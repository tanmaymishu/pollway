<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PollOption extends Model
{
    use HasFactory;

    protected $fillable = ['label', 'vote_count'];

    public function votes(): HasMany
    {
        return $this->hasMany(PollVote::class);
    }
}
