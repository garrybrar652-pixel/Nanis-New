<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CampaignController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public Campaign Routes (for testing - remove auth temporarily)
Route::prefix('campaigns')->group(function () {
    Route::get('/', [CampaignController::class, 'index']);
    Route::get('/statistics', [CampaignController::class, 'statistics']);
    Route::get('/{id}', [CampaignController::class, 'show']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/profile', [AuthController::class, 'profile']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    // Protected Campaign Routes
    Route::prefix('campaigns')->group(function () {
        Route::post('/', [CampaignController::class, 'store']);
        Route::put('/{id}', [CampaignController::class, 'update']);
        Route::delete('/{id}', [CampaignController::class, 'destroy']);
        Route::post('/{id}/schedule', [CampaignController::class, 'schedule']);
        Route::post('/{id}/send', [CampaignController::class, 'send']);
        Route::post('/{id}/suspend', [CampaignController::class, 'suspend']);
    });
});