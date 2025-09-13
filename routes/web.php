<?php

use App\Http\Controllers\AdminPollController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PollController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect(route('polls.index'));
    //    return Inertia::render('welcome');
})->name('home');

Route::get('/polls', [PollController::class, 'index'])->name('polls.index');
Route::get('/polls/{poll:slug}', [PollController::class, 'show'])->name('polls.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware(IsAdmin::class)->group(function () {
        Route::get('/admin/polls', [AdminPollController::class, 'index'])->name('admin.polls.index');
        Route::get('/admin/polls/create', [AdminPollController::class, 'create'])->name('admin.polls.create');
        Route::post('/admin/polls/store', [AdminPollController::class, 'store'])->name('admin.polls.store');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
