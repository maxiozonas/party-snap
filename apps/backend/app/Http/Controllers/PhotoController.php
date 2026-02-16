<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadPhotoRequest;
use App\Http\Resources\PhotoResource;
use App\Models\GuestSession;
use App\Models\Photo;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;

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
}
