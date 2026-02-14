<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateGuestSessionRequest;
use App\Http\Requests\RegisterGuestSessionRequest;
use App\Models\GuestSession;
use App\Models\PartyToken;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GuestSessionController extends Controller
{
    /**
     * Register a new guest session from a party token (QR scan)
     * Creates a new individual session for each user who scans the QR
     */
    public function register(RegisterGuestSessionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Find the master token (from QR)
        $partyToken = PartyToken::validToken($validated['master_token'])->first();

        if (! $partyToken) {
            return response()->json([
                'valid' => false,
                'message' => 'Token de evento inválido o expirado',
            ], 403);
        }

        // Create NEW individual session for this user
        $session = GuestSession::create([
            'id' => Str::uuid(),
            'party_token_id' => $partyToken->id,
            'token' => Str::random(64),  // Unique token for this session
            'guest_name' => $validated['guest_name'],
            'client_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'first_seen_at' => now(),
            'last_seen_at' => now(),
            'is_active' => true,
        ]);

        return response()->json([
            'valid' => true,
            'guest_name' => $session->guest_name,
            'session_token' => $session->token,  // Individual session token
        ], 201);
    }

    /**
     * Validate an individual guest session token
     */
    public function validate(string $token): JsonResponse
    {
        // Now validates INDIVIDUAL session token
        $session = GuestSession::validToken($token)->first();

        if (! $session) {
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

    /**
     * Legacy endpoint - kept for backward compatibility
     * Updates an existing session or creates a new one
     */
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

    /**
     * Update guest name for existing session
     */
    public function update(Request $request, string $token): JsonResponse
    {
        $validated = $request->validate([
            'guest_name' => 'required|string|min:2|max:100',
        ]);

        $session = GuestSession::validToken($token)->first();

        if (! $session) {
            return response()->json([
                'valid' => false,
                'message' => 'Token inválido o expirado',
            ], 404);
        }

        $session->update([
            'guest_name' => $validated['guest_name'],
            'last_seen_at' => now(),
        ]);

        return response()->json([
            'valid' => true,
            'guest_name' => $session->guest_name,
            'message' => 'Nombre actualizado exitosamente',
        ], 200);
    }
}
