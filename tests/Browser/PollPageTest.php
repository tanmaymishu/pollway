<?php

use App\Models\Poll;
use App\Models\User;

test('unauthenticated user sees login/register links', function () {
    visit('/polls')
        ->assertSeeLink('Login')
        ->assertSeeLink('Register')
        ->assertDontSeeLink('Dashboard');
});

test('authenticated user sees dashboard link', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    visit('/polls')
        ->assertDontSeeLink('Login')
        ->assertDontSeeLink('Register')
        ->assertSeeLink('Dashboard');
});

test('guest user can open a single poll by clicking View', function () {
    $poll = Poll::factory()->create();

    visit('/polls')
        ->click('View')
        ->assertSee($poll->title);
});
