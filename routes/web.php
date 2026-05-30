<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('chatbots', 'chatbots')->name('chatbots');
    Route::inertia('ai-providers', 'ai-providers')->name('ai-providers');
});

require __DIR__.'/settings.php';
