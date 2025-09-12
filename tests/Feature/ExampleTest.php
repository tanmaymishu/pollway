<?php

it('home route redirects to /polls', function () {
    $response = $this->get('/');

    $response->assertRedirect('/polls');
});
