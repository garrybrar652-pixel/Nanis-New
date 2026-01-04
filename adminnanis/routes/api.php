<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ContactController as APIContactController;
use App\Http\Controllers\API\GroupController as APIGroupController;
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

// Sanctum CSRF cookie route (required for SPA authentication)
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

// Authentication Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected Contact & Group Routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('contacts')->group(function () {
        Route::get('/', [APIContactController::class, 'index']); // List contacts (with filters)
        Route::post('/', [APIContactController::class, 'store']); // Create contact
        Route::get('/email', [APIContactController::class, 'getByEmail']); // Get contact by email
        Route::put('/email', [APIContactController::class, 'updateByEmail']); // Update contact by email
        Route::post('/subscription', [APIContactController::class, 'toggleSubscription']); // Subscribe/Unsubscribe
        Route::delete('/email', [APIContactController::class, 'destroyByEmail']); // Delete by email
        Route::get('/{id}', [APIContactController::class, 'show']); // Get single contact
        Route::put('/{id}', [APIContactController::class, 'update']); // Update contact
        Route::delete('/{id}', [APIContactController::class, 'destroy']); // Delete contact
    });

    Route::prefix('groups')->group(function () {
        Route::get('/', [APIGroupController::class, 'index']); // List all groups
        Route::get('/{id}', [APIGroupController::class, 'show']); // Get single group
        Route::get('/{id}/contacts', [APIGroupController::class, 'contacts']); // Get group contacts
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/profile', [AuthController::class, 'profile']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    // Protected Campaign Routes
    Route::prefix('campaigns')->group(function () {
        Route::get('/', [CampaignController::class, 'index']);
        Route::post('/', [CampaignController::class, 'store']);
        Route::get('/statistics', [CampaignController::class, 'statistics']);
        Route::get('/{id}', [CampaignController::class, 'show']);
        Route::put('/{id}', [CampaignController::class, 'update']);
        Route::delete('/{id}', [CampaignController::class, 'destroy']);
        Route::post('/{id}/schedule', [CampaignController::class, 'schedule']);
        Route::post('/{id}/send', [CampaignController::class, 'send']);
        Route::post('/{id}/suspend', [CampaignController::class, 'suspend']);
    });
});

// Public Tracking Routes (no auth required)
Route::prefix('campaigns')->group(function () {
    Route::get('/{campaign}/track/open/{contact}', [CampaignController::class, 'trackOpen']);
    Route::get('/{campaign}/track/click/{contact}', [CampaignController::class, 'trackClick']);
});