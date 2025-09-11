<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
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
}
