<?php

namespace App\Http\Controllers;

use App\Models\PartySetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartySettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = PartySetting::getCurrent();

        return response()->json([
            'data' => [
                'id' => $settings->id,
                'title' => $settings->title,
                'subtitle' => $settings->subtitle,
                'event_date' => $settings->event_date?->format('Y-m-d'),
                'created_at' => $settings->created_at,
                'updated_at' => $settings->updated_at,
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:1000',
            'event_date' => 'nullable|date',
        ]);

        $settings = PartySetting::updateCurrent($validated);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $settings->id,
                'title' => $settings->title,
                'subtitle' => $settings->subtitle,
                'event_date' => $settings->event_date?->format('Y-m-d'),
                'updated_at' => $settings->updated_at,
            ],
        ]);
    }

    public function initialize(): JsonResponse
    {
        $settings = PartySetting::getCurrent();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $settings->id,
                'title' => $settings->title,
                'subtitle' => $settings->subtitle,
                'event_date' => $settings->event_date?->format('Y-m-d'),
            ],
        ], 201);
    }
}
