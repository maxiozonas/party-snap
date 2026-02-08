<?php

namespace App\Services;

use App\Models\Photo;
use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    public function __construct(
        private Cloudinary $cloudinary
    ) {}

    public function upload(UploadedFile $file, string $guestName, $guestSessionId = null): Photo
    {
        $uploadedFile = $this->cloudinary->uploadApi()->upload($file->getRealPath(), [
            'folder' => 'joseta',
            'transformation' => [
                'quality' => 'auto',
                'fetch_format' => 'auto',
            ],
        ]);

        return Photo::create([
            'cloudinary_public_id' => $uploadedFile['public_id'],
            'secure_url' => $uploadedFile['secure_url'],
            'guest_name' => $guestName,
            'mime_type' => $file->getMimeType(),
            'size_kb' => round($file->getSize() / 1024),
            'client_ip' => request()->ip(),
            'guest_session_id' => $guestSessionId,
        ]);
    }

    public function delete(Photo $photo): void
    {
        $this->cloudinary->uploadApi()->destroy($photo->cloudinary_public_id);
        $photo->delete();
    }
}
