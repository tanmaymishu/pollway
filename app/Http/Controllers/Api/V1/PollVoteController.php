<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Poll;
use App\Models\PollOption;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PollVoteController extends Controller
{
    public function store(Request $request, Poll $poll)
    {
        $request->validate(['poll_option_id' => ['required', Rule::exists('poll_options', 'id')]]);

        $poll->votes()->create([
            'poll_option_id' => $request->poll_option_id,
            'user_id' => auth()->id(),
            'ip_address' => $request->ip(),
        ]);

        PollOption::find($request->poll_option_id)->increment('vote_count');

        return back();
    }
}
