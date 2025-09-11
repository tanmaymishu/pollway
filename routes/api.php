<?php

use App\Http\Controllers\Api\V1\PollVoteController;
use App\Http\Middleware\EnsureUniqueVote;

Route::middleware(EnsureUniqueVote::class)
    ->post('/polls/{poll}/votes', [PollVoteController::class, 'store'])
    ->name('polls.store');
