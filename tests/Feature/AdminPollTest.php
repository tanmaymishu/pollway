<?php

use App\Models\User;

test('guest user cannot create polls', function () {
    $response = $this->post(route('admin.polls.store'), []);

    $response->assertRedirect(route('login'));
});

test('only an admin user can create a poll', function () {
    $user = User::factory()->create();
    $response = $this->actingAs($user)->post(route('admin.polls.store'), []);

    $response->assertForbidden();

    $user->update(['is_admin' => true]);
    $response = $this->actingAs($user)->post(route('admin.polls.store'), []);

    $response->assertSessionHasErrors();
});


test('admin cannot create a poll without a minimum of two options', function () {
    $admin = User::factory()->create(['is_admin' => true]);

    $response = $this->actingAs($admin)->post(route('admin.polls.store'), [
        'title' => 'Test',
        'result_visible' => false,
        'withdrawable' => false,
        'options' => ['Foo'],
    ]);

    $response->assertSessionHasErrors(['options']);
});

test('admin can create a test', function () {
    $response = $this->post(route('admin.polls.store'), [
        'title' => 'Test',
        'result_visible' => false,
        'withdrawable' => false,
        'options' => ['Foo', 'Bar']
    ]);

    $response->assertSessionDoesntHaveErrors();
});
