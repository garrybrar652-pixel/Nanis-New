<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\RegisterController;
use App\Models\User;

Route::middleware('auth:admin')->group(function () {
    Route::get('/admin', function () {
        $users = User::all();
        return view('admin.index', compact('users'));
    })->name('admin.dashboard');

    Route::resource('admin/users', UserController::class, [
        'as' => 'admin'
    ]);

    Route::resource('admin/settings', SettingController::class, [
        'as' => 'admin'
    ]);
});

Route::middleware('guest:admin')->group(function () {
    Route::get('admin/login', [LoginController::class, 'showLoginForm'])->name('admin.login.page');
    Route::post('admin/login', [LoginController::class, 'login'])->name('admin.login');

    Route::get('admin/register', [RegisterController::class, 'showRegistrationForm'])->name('admin.register.page');
    Route::post('admin/register', [RegisterController::class, 'register'])->name('admin.register');

    // Redirect route for Laravel's default auth middleware
    Route::get('/login', function () {
        return redirect()->route('admin.login.page');
    })->name('login');
});

Route::middleware('auth:admin')->group(function () {
    Route::post('admin/logout', [LoginController::class, 'logout'])->name('admin.logout');
});
