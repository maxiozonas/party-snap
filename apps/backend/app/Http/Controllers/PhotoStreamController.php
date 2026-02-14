<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PhotoStreamController extends Controller
{
    public function stream(): StreamedResponse
    {
        return response()->stream(function () {
            $lastCount = Photo::approved()->count();
            $lastId = Photo::approved()->latest('id')->first()?->id ?? 0;

            while (true) {
                try {
                    $currentCount = Photo::approved()->count();
                    $latestPhoto = Photo::approved()->latest('id')->first();
                    $currentId = $latestPhoto?->id ?? 0;

                    $newPhotos = $currentCount > $lastCount || $currentId > $lastId;

                    if ($newPhotos) {
                        $this->sendSSE([
                            'type' => 'new_photos',
                            'new_photos' => true,
                            'photo_count' => $currentCount,
                            'latest_id' => $currentId,
                            'timestamp' => now()->toIso8601String(),
                        ]);

                        $lastCount = $currentCount;
                        $lastId = $currentId;

                        echo "retry: 2000\n\n";
                    } else {
                        $this->sendSSE([
                            'type' => 'heartbeat',
                            'photo_count' => $currentCount,
                            'timestamp' => now()->toIso8601String(),
                        ]);
                    }

                    ob_flush();
                    flush();

                    usleep(2000000);
                } catch (\Exception $e) {
                    $this->sendSSE([
                        'type' => 'error',
                        'message' => 'Error en stream',
                    ]);
                    ob_flush();
                    flush();
                    break;
                }
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    private function sendSSE(array $data): void
    {
        echo 'data: '.json_encode($data)."\n\n";
    }
}
