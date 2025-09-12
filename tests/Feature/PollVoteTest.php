<?php

use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;

test('submitting a vote twice from the same ip throws 403', function () {
    $poll = Poll::factory()->create();
    [$pollOptionA, $pollOptionB] = PollOption::factory(2)->recycle($poll)->create();
    $response = $this->post(route('polls.store', $poll->id), [
        'poll_option_id' => $pollOptionA->id,
    ]);

    $response->assertSessionDoesntHaveErrors();
    $response->assertStatus(201);

    $response = $this->post(route('polls.store', $poll->id), [
        'poll_option_id' => $pollOptionB->id,
    ]);

    $response->assertStatus(403);
});

test('if a poll is withdrawable then a vote can be withdrawn', function () {
    $poll = Poll::factory()->create();
    $pollVote = PollVote::factory()->recycle($poll)->create(['ip_address' => '127.0.0.1']);
    $response = $this->delete(route('polls.destroy', $pollVote->id));

    $response->assertStatus(204);
});

