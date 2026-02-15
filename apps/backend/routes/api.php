<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PhotoController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\PhotoStreamController;
use App\Http\Controllers\PartySettingController;
use App\Http\Controllers\GuestSessionController;
use App\Http\Controllers\AdminAuthController;

Route::prefix('v1')->group(function () {
    Route::get('/photos', [PhotoController::class, 'index']);
    Route::post('/upload', [PhotoController::class, 'store']);
    Route::delete('/admin/photo/{photo}', [PhotoController::class, 'destroy']);
    Route::get('/photos/stream', [PhotoStreamController::class, 'stream']);
    Route::get('/settings', [PartySettingController::class, 'index']);
    Route::put('/settings', [PartySettingController::class, 'update']);
    Route::post('/sessions', [GuestSessionController::class, 'storeOrUpdate']);
    Route::post('/sessions/register', [GuestSessionController::class, 'register']);
    Route::get('/sessions/validate/{token}', [GuestSessionController::class, 'validate']);

    // Rutas de autenticación admin
    Route::post('/admin/login', [AdminAuthController::class, 'login']);

    // Rutas protegidas (requieren autenticación)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
        Route::get('/admin/me', [AdminAuthController::class, 'me']);
        Route::put('/admin/password', [AdminAuthController::class, 'changePassword']);
    });
});

Route::post('/webhooks/cloudinary', [WebhookController::class, 'handleCloudinary'])->name('webhooks.cloudinary');
