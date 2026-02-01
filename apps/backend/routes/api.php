<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PhotoController;

Route::prefix('v1')->group(function () {
    Route::get('/photos', [PhotoController::class, 'index']);
    Route::post('/upload', [PhotoController::class, 'store']);
    Route::delete('/admin/photo/{photo}', [PhotoController::class, 'destroy']);
});
