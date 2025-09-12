<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Poll extends Model
{
    protected $fillable = ['title', 'slug', 'withdrawable', 'result_visible', 'created_by'];

    public function options(): HasMany
    {
        return $this->hasMany(PollOption::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(PollVote::class);
    }

    public function owner(): HasOne
    {
        return $this->hasOne(User::class, 'created_by');
    }

    public function ownVote(): BelongsTo
    {
        return $this->belongsTo(PollVote::class);
    }

//    public function ownVote(): HasOne
//    {
//        return $this->hasOne(PollVote::class)
//            ->where('ip_address', request()->ip())
//            ->latest();
//    }

    public function scopeWithOwnVote($query)
    {
        return $query
            ->addSelect([
                'own_vote_id' => PollVote::select('id')
                    ->whereColumn('poll_id', 'polls.id')
                    ->where('ip_address', request()->ip())
                    ->take(1)
            ])->with('ownVote');
    }
}
