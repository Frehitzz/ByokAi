# API Login With Sanctum

## 1. Feature Overview

### What problem does this feature solve?

This feature solves the problem of letting an API client log in with an email and password and receive a Sanctum token for future authenticated API requests.

Before this feature:
- the app already had web login through Fortify
- but there was no dedicated API login endpoint that returned a Sanctum token

### What is the purpose of this feature?

The purpose is to support token-based authentication for API consumers.

This means a frontend app, mobile app, Postman, or another client can:
- send credentials to `/api/login`
- receive a token
- use that token in `Authorization: Bearer <token>` headers on later requests

### How does it fit into the application?

This application now has two login styles:

- Web login:
  Uses Fortify and session authentication for the Inertia React app

- API login:
  Uses Sanctum personal access tokens for API-based authentication

So this feature fits into the API authentication side of the application.

---

## 2. High-Level Flow

User / API Client  
↓  
Send `POST /api/login` with email and password  
↓  
Laravel API route  
↓  
`AuthController@login()`  
↓  
`LoginRequest` validation  
↓  
Find user in database  
↓  
Check hashed password with `Hash::check()`  
↓  
Create Sanctum token  
↓  
Save token in `personal_access_tokens` table  
↓  
Return JSON response with `user` and `token`  
↓  
Client stores token  
↓  
Client uses token for future API requests

Important note:
- The existing React login page still uses Fortify session login
- This new feature is specifically for API token login

---

## 3. Files Involved

### `routes/api.php`

- Purpose:
  Defines API routes

- Why it was modified:
  Added the `/api/login` route

- How it connects:
  It maps the request to `AuthController@login()`

Relevant code:

```php
Route::post('/login', [AuthController::class, 'login']);
```

### `app/Http/Controllers/Api/AuthController.php`

- Purpose:
  Handles API authentication logic

- Why it was modified:
  Added the `login()` method

- How it connects:
  It receives validated input from `LoginRequest`, finds the user, checks the password, creates the Sanctum token, and returns JSON

### `app/Http/Requests/Api/LoginRequest.php`

- Purpose:
  Validates login input before the controller logic runs

- Why it was modified:
  The generated request file was updated to allow the request and require `email` and `password`

- How it connects:
  Laravel automatically injects it into `AuthController@login()`

### `app/Models/User.php`

- Purpose:
  Represents the `users` table

- Why it matters:
  It uses the `HasApiTokens` trait, which gives the model the `createToken()` method

- How it connects:
  The controller uses `User::where(...)` and `$user->createToken(...)`

### `database/migrations/2026_05_28_155748_create_personal_access_tokens_table.php`

- Purpose:
  Defines the Sanctum token storage table

- Why it matters:
  When `createToken()` is called, Laravel writes token data into this table

- How it connects:
  The controller creates tokens and Sanctum stores them here

### `tests/Feature/ApiLoginTest.php`

- Purpose:
  Verifies the API login behavior

- Why it was modified:
  Replaced the default placeholder test with real feature tests

- How it connects:
  It proves the route, validation, controller logic, and token storage all work together

### `tests/Feature/Auth/AuthenticationTest.php`

- Purpose:
  Tests the existing web login flow

- Why it matters:
  It shows that browser login already existed and is separate from the new Sanctum API login flow

- How it connects:
  Helps us understand the difference between session auth and token auth

---

## 4. Step-by-Step Execution Flow

When a user or API client uses this feature:

### 1. What happens first?

The client sends a `POST` request to:

```text
/api/login
```

with JSON like:

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### 2. What happens next?

Laravel checks `routes/api.php` and finds:

```php
Route::post('/login', [AuthController::class, 'login']);
```

That tells Laravel to call the `login()` method in `AuthController`.

### 3. What code runs?

The method signature is:

```php
public function login(LoginRequest $request): JsonResponse
```

Laravel automatically:
- creates the `LoginRequest`
- runs its validation rules
- only continues if validation passes

Then this line runs:

```php
$validated = $request->validated();
```

Now the controller has trusted input.

### 4. What database operations occur?

The controller runs:

```php
$user = User::where('email', $validated['email'])->first();
```

This reads from the `users` table.

Then Laravel checks the password:

```php
Hash::check($validated['password'], $user->password)
```

This does not write to the database. It only compares:
- plain password from request
- hashed password from DB

If valid, Laravel creates a Sanctum token:

```php
$token = $user->createToken('byokai-token')->plainTextToken;
```

This writes a new row to `personal_access_tokens`.

### 5. What response is returned?

If login succeeds:

```json
{
  "message": "Logged in successfully.",
  "user": { ... },
  "token": "plain-text-token"
}
```

If login fails:

```json
{
  "message": "The provided credentials are incorrect."
}
```

with HTTP status `422`.

If validation fails:
- Laravel automatically returns validation errors
- also with HTTP status `422`

### 6. What happens in the frontend afterward?

For this implemented feature, the API client should:
- store the returned token
- send it on future requests using:

```text
Authorization: Bearer <token>
```

Important:
- the existing React login page is still using Fortify session login
- this new API login feature does not automatically update the browser login UI

---

## 5. Code Breakdown

## A. Route Definition

File:
`routes/api.php`

```php
Route::post('/login', [AuthController::class, 'login']);
```

### What it does

This creates the `/api/login` endpoint.

### Why it is needed

Without a route, Laravel would not know where to send the request.

### How it works

Laravel matches incoming requests based on:
- HTTP method
- URL path

This route says:
- if the request is `POST /api/login`
- run `AuthController@login`

### Laravel concept used

- Routing

### What would happen if it were removed?

The endpoint would return `404 Not Found`.

---

## B. Login Request Validation

File:
`app/Http/Requests/Api/LoginRequest.php`

```php
public function authorize(): bool
{
    return true;
}
```

### What it does

This allows the request to proceed.

### Why it is needed

Laravel Form Requests require an authorization decision.

### How it works

If this returns `false`, Laravel blocks the request before validation or controller logic runs.

### Laravel concept used

- Form Request authorization

### What would happen if it were removed?

The class would be incomplete. If it returned `false`, login would always fail.

---

```php
public function rules(): array
{
    return [
        'email' => ['required', 'string', 'email'],
        'password' => ['required', 'string'],
    ];
}
```

### What it does

Validates that:
- `email` exists
- `email` is formatted like an email
- `password` exists

### Why it is needed

It protects the controller from bad or incomplete input.

### How it works

Laravel automatically runs these rules before the controller method executes.

### Laravel concept used

- Form Request validation

### What would happen if it were removed?

The controller would need to validate manually, and bad input could reach the login logic.

---

## C. Controller Method

File:
`app/Http/Controllers/Api/AuthController.php`

```php
public function login(LoginRequest $request): JsonResponse
```

### What it does

This is the main login handler.

### Why it is needed

It contains the actual authentication logic.

### How it works

Laravel injects the validated request object into the controller.

### Laravel concept used

- Controller action
- Dependency injection

### What would happen if it were removed?

The route would point to logic that does not exist.

---

```php
$validated = $request->validated();
```

### What it does

Gets only the validated input data.

### Why it is needed

It ensures the controller uses trusted data.

### How it works

Laravel returns only fields that passed validation.

### Laravel concept used

- Validated request data

### What would happen if it were removed?

You would need to work directly with raw request data.

---

```php
$user = User::where('email', $validated['email'])->first();
```

### What it does

Looks up the user by email.

### Why it is needed

The app needs to know which user is attempting login.

### How it works

Eloquent builds a SQL query that searches the `users` table by email and returns the first result.

### Laravel concept used

- Eloquent ORM

### What would happen if it were removed?

The app would have no user record to authenticate.

---

```php
if (! $user || ! Hash::check($validated['password'], $user->password)) {
    return response()->json([
        'message' => 'The provided credentials are incorrect.',
    ], 422);
}
```

### What it does

Rejects login if:
- the user does not exist
- or the password is wrong

### Why it is needed

This is the core authentication check.

### How it works

`Hash::check()` compares:
- the plain password from the request
- the hashed password stored in the database

It does not decrypt the password. It verifies it safely.

### Laravel concept used

- Hash facade
- Secure password verification

### What would happen if it were removed?

Anyone could potentially log in without proper credential verification.

---

```php
$token = $user->createToken('byokai-token')->plainTextToken;
```

### What it does

Creates a Sanctum token and returns the raw token string.

### Why it is needed

API login is not useful unless the client receives a token for future requests.

### How it works

`createToken()`:
- creates a hashed token in the database
- associates it with the user
- returns the plain-text version once

### Laravel concept used

- Sanctum personal access tokens
- `HasApiTokens` trait

### What would happen if it were removed?

The user could be verified, but the API client would not get a token to use afterward.

---

```php
return response()->json([
    'message' => 'Logged in successfully.',
    'user' => $user,
    'token' => $token,
]);
```

### What it does

Returns a JSON success response.

### Why it is needed

API clients need a structured response they can read programmatically.

### How it works

Laravel converts the array into JSON and sends an HTTP response.

### Laravel concept used

- JSON response

### What would happen if it were removed?

The client would not receive the user or token.

---

## 6. Database Flow

### Which tables are used?

- `users`
- `personal_access_tokens`

### Which columns are read?

From `users`:
- `email`
- `password`
- also user identity columns like `id` and `name` when returning the user

### Which columns are written?

To `personal_access_tokens`:
- `tokenable_type`
- `tokenable_id`
- `name`
- `token`
- `abilities`
- `last_used_at`
- `expires_at`
- timestamps

### What data is stored?

In `users`:
- the user record already exists
- password is stored hashed

In `personal_access_tokens`:
- the token owner
- token name
- hashed token value
- timestamps

### Why is it stored?

Sanctum needs a persistent record of valid tokens so Laravel can authenticate future API requests using bearer tokens.

Important beginner note:
- the plain token is returned once in the response
- the database stores a hashed version, not the raw token string

---

## 7. Authentication & Security Flow

### Validation

Handled by `LoginRequest`.

Why necessary:
- ensures required fields exist
- ensures email has a valid format
- prevents invalid payloads from reaching the controller logic

### Password hashing

Passwords are never stored or compared in plain text.

The user model uses:

```php
'password' => 'hashed',
```

And login checks passwords using:

```php
Hash::check(...)
```

Why necessary:
- protects user credentials
- follows secure authentication practices

### Sanctum tokens

Sanctum generates personal access tokens with:

```php
$user->createToken(...)
```

Why necessary:
- allows stateless API authentication
- avoids needing email/password on every request

### Middleware

Protected API routes can use:

```php
->middleware('auth:sanctum')
```

Example already present:

```php
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
```

Why necessary:
- checks that the incoming bearer token is valid
- identifies the authenticated user from that token

### Authorization

For login, `authorize()` returns `true`.

Why necessary:
- anyone should be allowed to attempt login
- actual access is controlled by credential verification, not by blocking the request before it reaches the controller

---

## 8. Concepts Learned

### Laravel Routing

- Definition:
  Mapping URLs to controller actions

- Why used:
  To expose `/api/login`

- Beginner explanation:
  A route tells Laravel which code should run for a request

### Controller

- Definition:
  A class that handles request logic

- Why used:
  Keeps API logic separate from route definitions

- Beginner explanation:
  The route receives the request, but the controller does the work

### Form Request

- Definition:
  A dedicated class for validation and authorization

- Why used:
  Keeps validation clean and reusable

- Beginner explanation:
  It is like a guard that checks the request before your main code runs

### Eloquent ORM

- Definition:
  Laravel’s way to work with database tables as PHP models

- Why used:
  To query users with `User::where(...)`

- Beginner explanation:
  Instead of writing raw SQL, you use PHP methods

### Hash Facade

- Definition:
  Laravel helper for secure password hashing and verification

- Why used:
  To safely compare the login password with the stored hashed password

- Beginner explanation:
  It checks whether the typed password matches the stored one without exposing the original password

### Sanctum

- Definition:
  Laravel package for API authentication using tokens

- Why used:
  To issue personal access tokens after successful login

- Beginner explanation:
  Sanctum lets a user log in once and then use a token instead of re-sending credentials every time

### `HasApiTokens` Trait

- Definition:
  A trait that adds API token features to the model

- Why used:
  It provides `createToken()`

- Beginner explanation:
  This gives the `User` model token powers

### JSON Response

- Definition:
  API response format using JSON

- Why used:
  Clients like React apps, mobile apps, and Postman can read it easily

- Beginner explanation:
  It is the standard way APIs return structured data

### Feature Testing

- Definition:
  End-to-end tests that simulate real HTTP requests

- Why used:
  To verify login success, validation errors, and invalid credentials

- Beginner explanation:
  These tests act like a fake user calling your app and checking what happens

### Authentication

- Definition:
  Confirming that a user is really who they claim to be

- Why used:
  To allow only valid users to get tokens

- Beginner explanation:
  Authentication is the login check

### Authorization

- Definition:
  Deciding whether a request is allowed to continue

- Why used:
  In the request class with `authorize()`

- Beginner explanation:
  Authorization asks, “Should this request even be allowed to try?”

---

## 9. Final Learning Notes

### Summary

This feature adds a new API login endpoint using Sanctum.

The main steps are:
- validate input
- find user by email
- check password securely
- create Sanctum token
- return token in JSON

### Most important beginner takeaway

This app now has two separate auth styles:

- Fortify web login:
  session-based, used by the browser/Inertia app

- Sanctum API login:
  token-based, used by API clients

### Example request

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Example success response

```json
{
  "message": "Logged in successfully.",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "user@example.com"
  },
  "token": "plain-text-token-here"
}
```

### Example future protected request

```text
Authorization: Bearer plain-text-token-here
```

### Good follow-up topics to study next

- How `auth:sanctum` works internally
- Difference between session auth and token auth
- How to implement API logout and token revocation
- How to connect a React frontend directly to `/api/login`
