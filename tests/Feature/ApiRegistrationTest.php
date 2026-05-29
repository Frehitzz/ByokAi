<?php

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

test('users can register through the api', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'API Test User',
        'email' => 'api-test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response
        ->assertCreated()
        ->assertJsonPath('message', 'Registered successfully.')
        ->assertJsonPath('user.email', 'api-test@example.com');

    $user = User::where('email', 'api-test@example.com')->first();

    expect($user)->not->toBeNull();
    expect($response->json('token'))->not->toBeEmpty();
    expect(PersonalAccessToken::query()->where('tokenable_id', $user->id)->exists())->toBeTrue();
});

test('api registration validates required fields', function () {
    $response = $this->postJson('/api/register', []);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});
