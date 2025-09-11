<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PollVote extends Model
{
    protected $fillable = ['poll_id', 'vote_count', 'poll_option_id', 'user_id', 'ip_address'];

    public function option(): BelongsTo
    {
        return $this->belongsTo(PollOption::class);
    }
}
