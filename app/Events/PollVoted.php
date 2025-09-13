<?php

namespace App\Events;

use App\Models\PollVote;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PollVoted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public PollVote $pollVote, public string $ip)
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
            new Channel('poll.' . $this->pollVote->poll_id),
        ];
    }

    public function broadcastAs()
    {
        return 'poll.voted';
    }

    public function broadcastWith(): array
    {
        return [
            'pollVote' => $this->pollVote,
            'ip' => $this->ip,
        ];
    }
}
