<?php

use App\Http\Controllers\Api\V1\PollVoteController;
use App\Http\Middleware\EnsureUniqueVote;
use App\Http\Middleware\EnsureUniqueVoteWithdrawal;

Route::middleware(['web', EnsureUniqueVote::class])
    ->post('/v1/polls/{poll}/votes', [PollVoteController::class, 'store'])
    ->name('v1.poll-votes.store');

Route::middleware(['web', EnsureUniqueVoteWithdrawal::class])
    ->delete('/v1/poll-votes/{pollVote}', [PollVoteController::class, 'destroy'])
    ->name('v1.poll-votes.destroy');
