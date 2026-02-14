<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\GuestSessionController;
use App\Http\Controllers\PartySettingController;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\PhotoStreamController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::get('/photos', [PhotoController::class, 'index']);
    Route::post('/upload', [PhotoController::class, 'store']);
    Route::get('/photos/stream', [PhotoStreamController::class, 'stream']);
    Route::get('/settings', [PartySettingController::class, 'index']);
    Route::post('/sessions/register', [GuestSessionController::class, 'register']);
    Route::post('/sessions', [GuestSessionController::class, 'storeOrUpdate']);
    Route::get('/sessions/validate/{token}', [GuestSessionController::class, 'validate']);
    Route::put('/sessions/{token}', [GuestSessionController::class, 'update']);

    // Admin auth routes
    Route::post('/admin/login', [AdminAuthController::class, 'login']);

    // Protected admin routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
        Route::get('/admin/me', [AdminAuthController::class, 'me']);
        Route::post('/admin/change-password', [AdminAuthController::class, 'changePassword']);
        Route::put('/settings', [PartySettingController::class, 'update']);
        Route::delete('/admin/photo/{photo}', [PhotoController::class, 'destroy']);
    });
});

Route::post('/webhooks/cloudinary', [WebhookController::class, 'handleCloudinary'])->name('webhooks.cloudinary');
