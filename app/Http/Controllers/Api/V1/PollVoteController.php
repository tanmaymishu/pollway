<?php

namespace App\Http\Controllers\Api\V1;

use App\Events\PollVoted;
use App\Events\VoteWithdrawn;
use App\Http\Controllers\Controller;
use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PollVoteController extends Controller
{
    public function store(Request $request, Poll $poll)
    {
        $request->validate(['poll_option_id' => ['required', Rule::exists('poll_options', 'id')]]);

        $pollVote = $poll->votes()->create([
            'poll_option_id' => $request->poll_option_id,
            'user_id' => auth()->id(),
            'ip_address' => $request->ip(),
        ]);

        $pollOption = PollOption::query()->find($request->poll_option_id);

        $pollOption->increment('vote_count');

        $pollVote = $pollVote->load(['option', 'poll' => fn ($query) => $query->withOwnVote()]);

        //        $pollVote = $pollVote->load(['option', 'poll.ownVote']);

        broadcast(new PollVoted($pollVote))->toOthers();

        return response()->json(['message' => 'Vote Casted', 'data' => $pollVote], 201);
    }

    public function destroy(Request $request, PollVote $pollVote)
    {
        $poll = $pollVote->poll;
        $pollVote->option()->decrement('vote_count');
        $pollVote->delete();

        broadcast(new VoteWithdrawn($poll->id))->toOthers();

        return response()->json(['message' => 'Vote Withdrawn'], 204);
    }
}
