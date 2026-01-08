<?php

use App\Http\Controllers\CommentsController;
use App\Http\Controllers\LikesController;
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

    //==========================================likes=====================================
    Route::post('likes/toggle', [LikesController::class, 'toggle'])->name('likes.toggle');

    //==========================================comments==================================
    Route::post('/comments', [CommentsController::class, 'store'])->name('comments.store');
    Route::delete('/comments/{comments}', [CommentsController::class, 'destroy'])->name('comments.destroy');
});

require __DIR__ . '/settings.php';
