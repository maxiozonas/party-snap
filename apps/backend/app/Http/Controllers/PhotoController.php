<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadPhotoRequest;
use App\Http\Resources\PhotoResource;
use App\Models\GuestSession;
use App\Models\Photo;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PhotoController extends Controller
{
    public function __construct(
        private CloudinaryService $cloudinary
    ) {}

    public function index(): JsonResponse
    {
        $photos = Photo::approved()
            ->recent()
            ->with('guestSession:id,guest_name')
            ->get();

        return response()->json(PhotoResource::collection($photos));
    }

    public function feed(Request $request): JsonResponse
    {
        $limit = max(1, min((int) $request->query('limit', 10), 30));

        $query = Photo::query()
            ->approved()
            ->orderByDesc('created_at')
            ->orderByDesc('id');

        $cursor = $request->query('cursor');

        if (is_string($cursor) && $cursor !== '') {
            $decodedCursor = $this->decodeCursor($cursor);

            if (! $decodedCursor) {
                return response()->json([
                    'message' => 'Invalid cursor',
                ], 422);
            }

            $query->where(function ($builder) use ($decodedCursor) {
                $builder->where('created_at', '<', $decodedCursor['created_at'])
                    ->orWhere(function ($nestedBuilder) use ($decodedCursor) {
                        $nestedBuilder->where('created_at', '=', $decodedCursor['created_at'])
                            ->where('id', '<', $decodedCursor['id']);
                    });
            });
        }

        $photos = $query->limit($limit + 1)->get();
        $hasMore = $photos->count() > $limit;
        $visiblePhotos = $photos->take($limit)->values();
        $lastPhoto = $visiblePhotos->last();

        return response()->json([
            'data' => PhotoResource::collection($visiblePhotos)->toArray($request),
            'has_more' => $hasMore,
            'next_cursor' => $hasMore && $lastPhoto
                ? $this->encodeCursor($lastPhoto->created_at->toIso8601String(), (int) $lastPhoto->id)
                : null,
        ]);
    }

    public function store(UploadPhotoRequest $request): JsonResponse
    {
        $token = $request->header('X-Guest-Token');

        if (! $token) {
            return response()->json([
                'message' => 'Para compartir tus fotos, necesitas escanear el QR en el evento 🎉',
                'code' => 'MISSING_GUEST_TOKEN',
            ], 403);
        }

        $session = GuestSession::validToken($token)->first();

        if (! $session) {
            return response()->json([
                'message' => 'Tu sesión expiró. Por favor, escanea el QR nuevamente.',
                'code' => 'INVALID_GUEST_TOKEN',
            ], 403);
        }

        if (! $session->guest_name) {
            return response()->json([
                'message' => 'Debe ingresar un nombre para subir fotos.',
                'code' => 'MISSING_GUEST_NAME',
            ], 403);
        }

        $photo = $this->cloudinary->upload(
            $request->file('photo'),
            $session->guest_name,
            $session->id
        );

        $session->incrementPhotosCount();

        return response()->json([
            'success' => true,
            'data' => new PhotoResource($photo),
        ], 201);
    }

    public function destroy(Photo $photo): JsonResponse
    {
        $this->cloudinary->delete($photo);

        return response()->json([
            'success' => true,
            'message' => 'Photo deleted successfully',
        ]);
    }

    private function encodeCursor(string $createdAt, int $id): string
    {
        return base64_encode($createdAt.'|'.$id);
    }

    private function decodeCursor(string $cursor): ?array
    {
        $decoded = base64_decode($cursor, true);

        if (! is_string($decoded) || ! str_contains($decoded, '|')) {
            return null;
        }

        [$createdAt, $id] = explode('|', $decoded, 2);

        if (! is_numeric($id) || strtotime($createdAt) === false) {
            return null;
        }

        return [
            'created_at' => $createdAt,
            'id' => (int) $id,
        ];
    }
}
