<?php

use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

// checks if user have correct email and password can successfully login
// and get an api token
test('users can login through the api', function () {
    $user = User::factory()->create([
        'email' => 'api-login@example.com',
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'api-login@example.com',
        'password' => 'password',
    ]);

    $response
        ->assertOk()
        ->assertJsonPath('message', 'Logged in successfully.')
        ->assertJsonPath('user.email', $user->email);

    expect($response->json('token'))->not->toBeEmpty();
    expect(PersonalAccessToken::query()->where('tokenable_id', $user->id)->exists())->toBeTrue();
});

// this checks if a ailure happens, this tries to login with correct email
// but wrong password and making that the api correctly rejects the attempt
test('api login rejects invalid credentials', function () {
    User::factory()->create([
        'email' => 'api-login@example.com',
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'api-login@example.com',
        'password' => 'wrong-password',
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonPath('message', 'The provided credentials are incorrect.');
});

// checks if user tries to login without data at all and it checks if that api correctly
// returns error saying the email and password fields are required
test('api login validates required fields', function () {
    $response = $this->postJson('/api/login', []);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'password']);
});
