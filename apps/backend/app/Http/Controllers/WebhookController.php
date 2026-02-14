<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleCloudinary(Request $request): JsonResponse
    {
        $payload = $request->all();

        Log::info('Cloudinary webhook received', ['payload' => $payload]);

        if (! isset($payload['notification_type'])) {
            return response()->json(['error' => 'Invalid webhook'], 400);
        }

        switch ($payload['notification_type']) {
            case 'delete':
                return $this->handleDelete($payload);

            case 'upload':
            case 'rename':
            case 'create':
                return $this->handleUpsert($payload);

            default:
                Log::info('Unhandled webhook type', ['type' => $payload['notification_type']]);
                break;
        }

        return response()->json(['success' => true]);
    }

    private function handleDelete(array $payload): JsonResponse
    {
        $publicId = $payload['resources'][0]['public_id'] ?? null;

        if (! $publicId) {
            Log::warning('Webhook delete missing public_id', ['payload' => $payload]);

            return response()->json(['error' => 'Missing public_id'], 400);
        }

        $photo = Photo::where('cloudinary_public_id', $publicId)->first();

        if ($photo) {
            $photo->delete();
            Log::info('Photo deleted from DB via webhook', ['public_id' => $publicId]);
        } else {
            Log::info('Photo not found in DB for deletion', ['public_id' => $publicId]);
        }

        return response()->json(['success' => true]);
    }

    private function handleUpsert(array $payload): JsonResponse
    {
        $resource = $payload['resources'][0] ?? null;

        if (! $resource) {
            Log::warning('Webhook upsert missing resource', ['payload' => $payload]);

            return response()->json(['error' => 'Missing resource'], 400);
        }

        $publicId = $resource['public_id'];
        $secureUrl = $resource['secure_url'];

        $photo = Photo::where('cloudinary_public_id', $publicId)->first();

        if (! $photo) {
            Photo::create([
                'cloudinary_public_id' => $publicId,
                'secure_url' => $secureUrl,
                'guest_name' => 'Uploaded via Cloudinary',
                'is_approved' => true,
            ]);

            Log::info('Photo created via webhook', ['public_id' => $publicId]);
        }

        return response()->json(['success' => true]);
    }
}
