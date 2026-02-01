<?php

namespace App\Services;

use App\Models\Photo;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    public function upload(UploadedFile $file, string $guestName = null): Photo
    {
        $uploadedFile = Cloudinary::upload($file->getRealPath(), [
            'folder' => 'party-snap',
            'transformation' => [
                'quality' => 'auto',
                'fetch_format' => 'auto',
            ],
        ]);

        return Photo::create([
            'cloudinary_public_id' => $uploadedFile->getPublicId(),
            'secure_url' => $uploadedFile->getSecurePath(),
            'guest_name' => $guestName ?? 'Anónimo',
            'mime_type' => $file->getMimeType(),
            'size_kb' => round($file->getSize() / 1024),
            'client_ip' => request()->ip(),
        ]);
    }

    public function delete(Photo $photo): void
    {
        Cloudinary::destroy($photo->cloudinary_public_id);
        $photo->delete();
    }
}
