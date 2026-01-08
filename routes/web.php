<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    //Зарегестрированные пути
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    //==========================================task======================================
    Route::apiResource('dashboard/tasks', TaskController::class)->names('dashboard.tasks');

    //==========================================news======================================
    Route::apiResource('dashboard/news', NewsController::class)->names('dashboard.news');
});

require __DIR__ . '/settings.php';
