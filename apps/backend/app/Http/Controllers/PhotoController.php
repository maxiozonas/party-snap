<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadPhotoRequest;
use App\Http\Resources\PhotoResource;
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
            ->get();

        return response()->json(PhotoResource::collection($photos));
    }

    public function store(UploadPhotoRequest $request): JsonResponse
    {
        $photo = $this->cloudinary->upload(
            $request->file('photo'),
            $request->input('guest_name')
        );

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
