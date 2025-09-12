<?php

use App\Http\Controllers\Api\V1\PollVoteController;
use App\Http\Middleware\EnsureUniqueVote;
use App\Http\Middleware\EnsureUniqueVoteWithdrawal;

Route::middleware([EnsureUniqueVote::class])
    ->post('/polls/{poll}/votes', [PollVoteController::class, 'store'])
    ->name('polls.store');

Route::middleware([EnsureUniqueVoteWithdrawal::class])
    ->delete('/poll-votes/{pollVote}', [PollVoteController::class, 'destroy'])
    ->name('polls.destroy');
