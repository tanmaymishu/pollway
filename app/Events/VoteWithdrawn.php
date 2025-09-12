<?php

namespace App\Events;

use App\Models\Poll;
use App\Models\PollVote;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VoteWithdrawn implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public int $pollId)
    {
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('poll.'.$this->pollId),
        ];
    }

    public function broadcastAs()
    {
        return 'poll.unvoted';
    }

    public function broadcastWith(): array
    {
        return ['poll' => Poll::with('options')->withOwnVote()->find($this->pollId)];
//        return ['poll' => Poll::with(['options', 'ownVote'])->find($this->pollId)];
    }
}
