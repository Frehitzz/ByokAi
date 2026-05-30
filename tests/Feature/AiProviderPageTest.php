<?php

use App\Models\User;

test('guests are redirected to the login page for ai providers', function () {
    $response = $this->get(route('ai-providers'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the ai providers page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('ai-providers'));
    $response->assertOk();
});
