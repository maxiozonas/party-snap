<?php

namespace App\Http\Controllers;

use App\Models\GuestSession;
use App\Http\Requests\CreateGuestSessionRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class GuestSessionController extends Controller
{
    public function storeOrUpdate(CreateGuestSessionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $session = GuestSession::validToken($validated['token'])->first();

        if ($session) {
            $session->update([
                'last_seen_at' => now(),
            ]);

            return response()->json([
                'valid' => true,
                'exists' => true,
                'guest_name' => $session->guest_name,
                'session_id' => $session->id,
            ], 200);
        }

        $session = GuestSession::create([
            'id' => Str::uuid(),
            'token' => $validated['token'],
            'guest_name' => $validated['guest_name'],
            'client_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'first_seen_at' => now(),
            'last_seen_at' => now(),
        ]);

        return response()->json([
            'valid' => true,
            'exists' => false,
            'guest_name' => $session->guest_name,
            'session_id' => $session->id,
        ], 201);
    }

    public function validate(string $token): JsonResponse
    {
        $session = GuestSession::validToken($token)->first();

        if (!$session) {
            return response()->json([
                'valid' => false,
                'message' => 'Token inválido o expirado',
            ], 404);
        }

        return response()->json([
            'valid' => true,
            'guest_name' => $session->guest_name,
            'session_id' => $session->id,
        ], 200);
    }
}
