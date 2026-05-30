# Forgot Password Email Feature Notes

## 1. Feature Overview

### What problem does this feature solve?

Users sometimes forget their password and cannot log in. This feature lets them request a password reset link by entering their email address.

### What is the purpose of this feature?

The purpose is to let a user recover access to their account without needing an admin to manually change their password.

### How does it fit into the application?

This app uses Laravel Fortify for authentication and Inertia + React for auth screens. The forgot-password feature is part of that auth system:

- React shows the login, forgot-password, and reset-password pages.
- Fortify provides the backend routes and controllers.
- Laravel sends the reset notification email.
- The password reset token is stored in the database.
- The user sets a new password through the reset form.

This implementation mostly already existed. The recent change made the email delivery use SMTP instead of only logging emails locally, and the test was improved to verify the success flash message after requesting a reset link.

## 2. High-Level Flow

User clicks "Forgot your password?"
↓
React login page links to `/forgot-password`
↓
Fortify renders the Inertia forgot-password page
↓
User enters email and submits the form
↓
Inertia `Form` sends `POST /forgot-password`
↓
Fortify password reset controller validates the email
↓
Laravel looks up the user by email
↓
Laravel creates/stores a reset token in `password_reset_tokens`
↓
Laravel sends `ResetPassword` notification to the user
↓
SMTP mailer delivers the email
↓
User clicks reset link from email
↓
Browser opens `GET /reset-password/{token}?email=...`
↓
Fortify renders the Inertia reset-password page
↓
User submits new password to `POST /reset-password`
↓
Fortify verifies token + email
↓
`App\Actions\Fortify\ResetUserPassword` validates and saves new password
↓
Laravel hashes password and updates `users.password`
↓
User is redirected to login page

## 3. Files Involved

### `app/Providers/FortifyServiceProvider.php`

- Purpose: Connects Fortify backend auth features to the app's Inertia pages and custom actions.
- Why it matters: This file tells Fortify which React pages to render for login, forgot password, and reset password, and which password reset action to run.
- Connection: It bridges vendor Fortify routes/controllers with app-specific React pages and the custom `ResetUserPassword` action.

### `app/Actions/Fortify/ResetUserPassword.php`

- Purpose: Defines how a user's password is actually updated after a valid reset request.
- Why it matters: Fortify delegates the final password update to this class.
- Connection: It validates the new password and saves it onto the `User` model.

### `app/Concerns/PasswordValidationRules.php`

- Purpose: Holds reusable password validation rules.
- Why it matters: The reset action uses this trait to enforce password requirements.
- Connection: Shared by auth-related classes that need the same password rules.

### `app/Models/User.php`

- Purpose: The Eloquent model for application users.
- Why it matters: Password reset notifications are sent to this model, and the password field is updated here.
- Connection: Uses Laravel's `Notifiable` trait for email notifications and a `hashed` cast for secure password storage.

### `resources/js/pages/auth/login.tsx`

- Purpose: Login UI.
- Why it matters: It contains the "Forgot your password?" link.
- Connection: Sends users into the forgot-password flow using the generated password route helper.

### `resources/js/pages/auth/forgot-password.tsx`

- Purpose: UI for requesting a reset email.
- Why it matters: Lets the user submit their email address and shows success/errors.
- Connection: Uses the generated `email.form()` helper for `POST /forgot-password`.

### `resources/js/pages/auth/reset-password.tsx`

- Purpose: UI for entering a new password.
- Why it matters: Receives token and email from Fortify and submits the new password.
- Connection: Uses the generated `update.form()` helper for `POST /reset-password`.

### `resources/js/routes/password/index.ts`

- Purpose: Generated Wayfinder route helpers for password-related Fortify routes.
- Why it matters: Keeps frontend routes in sync with Laravel routes without hardcoding strings everywhere.
- Connection: Used by the React auth pages.

### `config/fortify.php`

- Purpose: Enables Fortify features and selects the password broker.
- Why it matters: The reset-password feature only exists because `Features::resetPasswords()` is enabled.
- Connection: Works with `config/auth.php` to define how password reset tokens are managed.

### `config/auth.php`

- Purpose: Defines auth guards, user provider, and password reset broker settings.
- Why it matters: It tells Laravel which table stores reset tokens and how long tokens stay valid.
- Connection: Fortify uses this broker configuration during password reset.

### `config/mail.php`

- Purpose: Defines how Laravel sends mail.
- Why it was modified: The SMTP config now accepts either `MAIL_SCHEME` or `MAIL_ENCRYPTION`, which makes common SMTP setups like Gmail easier to configure.
- Connection: Laravel notifications use this mail configuration when sending the reset email.

### `.env`

- Purpose: Stores environment-specific configuration values.
- Why it was modified: The mailer was switched from `log` to `smtp`, and SMTP env keys were prepared for real email delivery.
- Connection: `config/mail.php` reads these values to decide how email is delivered.

### `tests/Feature/Auth/PasswordResetTest.php`

- Purpose: Automated tests for the password reset feature.
- Why it was modified: The reset-link request test now also checks that the user is redirected back with a success status message.
- Connection: Verifies the forgot-password flow from the HTTP layer.

## 4. Step-by-Step Execution Flow

### 1. What happens first?

The user opens the login page and clicks "Forgot your password?".

In `resources/js/pages/auth/login.tsx`, the link uses `request()` from `@/routes/password`, which points to `GET /forgot-password`.

### 2. What happens next?

Fortify handles `GET /forgot-password` and renders the Inertia page configured in `FortifyServiceProvider`:

- `Fortify::requestPasswordResetLinkView(...)`
- This returns `Inertia::render('auth/forgot-password', [...])`

That means Laravel does not return a Blade view here. It returns an Inertia response that tells React to render `resources/js/pages/auth/forgot-password.tsx`.

### 3. What code runs when the form is submitted?

The forgot-password page uses:

- `Form {...email.form()}`

That route helper is generated in `resources/js/routes/password/index.ts` and submits:

- `POST /forgot-password`

Fortify's vendor controller handles the request, validates the email field, uses the configured password broker, and attempts to send a reset link.

### 4. What database operations occur?

When the email matches a real user:

- Laravel reads the `users` table to find the account by email.
- Laravel writes or updates a record in `password_reset_tokens`.

That table stores:

- the email address
- the hashed reset token
- the creation timestamp

Later, when the user submits a new password:

- Laravel reads `password_reset_tokens` to verify the token and email.
- Laravel updates `users.password`.

### 5. What response is returned?

After a successful reset-link request:

- Fortify redirects back to the forgot-password page
- a session `status` message is flashed

`resources/js/pages/auth/forgot-password.tsx` reads this `status` prop and shows the success message.

After a successful password reset:

- Fortify redirects to the login page

### 6. What happens in the frontend afterward?

On the forgot-password page:

- success message appears if `status` exists
- validation errors appear through `InputError`
- button shows a loading spinner while submitting

On the reset-password page:

- user enters new password + confirmation
- any validation errors are shown under the fields
- on success, the user is sent back to login

## 5. Code Breakdown

### `Fortify::requestPasswordResetLinkView(...)`

What it does:
- Registers the page Fortify should show for `GET /forgot-password`.

Why it is needed:
- Without it, Fortify would not know which UI to render for this app's Inertia setup.

How it works:
- It returns `Inertia::render('auth/forgot-password', ['status' => ...])`.

Concept used:
- Laravel service provider
- Fortify view customization
- Inertia server response

If removed:
- The forgot-password route would no longer render this React page correctly.

### `Fortify::resetPasswordView(...)`

What it does:
- Registers the reset-password page for `GET /reset-password/{token}`.

Why it is needed:
- The reset page needs the token, email, and password rules.

How it works:
- Reads the route token and request email.
- Sends them to the React page as props.

Concept used:
- Route parameter access
- Inertia props

If removed:
- The reset link would not open the correct page with the required token/email data.

### `Form {...email.form()}`

What it does:
- Builds a form that submits to `POST /forgot-password`.

Why it is needed:
- It lets the React page submit data without manually wiring fetch/XHR code.

How it works:
- `email.form()` comes from the generated password route helper file.
- Inertia handles submission, validation errors, and processing state.

Concept used:
- Inertia form helper
- Wayfinder route generation

If removed:
- The page would need custom request code and would lose the current simple integration.

### `status && (...)` in `forgot-password.tsx`

What it does:
- Shows a success message after the reset email is requested.

Why it is needed:
- Users need feedback that the request worked.

How it works:
- Laravel flashes a session status value.
- FortifyServiceProvider passes it into the Inertia page props.

Concept used:
- Session flash data
- Conditional React rendering

If removed:
- The email may still be sent, but the user would not get a confirmation message.

### `transform={(data) => ({ ...data, token, email })}` in `reset-password.tsx`

What it does:
- Adds `token` and `email` into the form submission payload.

Why it is needed:
- Fortify needs both values when verifying the reset request.

How it works:
- The token and email come from page props.
- Inertia merges them into the posted form data.

Concept used:
- Inertia form transform
- React props

If removed:
- The backend would receive incomplete data and password reset would fail.

### `Validator::make(...)->validate()` in `ResetUserPassword.php`

What it does:
- Validates the new password.

Why it is needed:
- The app must reject weak or invalid passwords.

How it works:
- Uses reusable rules from `PasswordValidationRules`.
- Throws a validation exception automatically if invalid.

Concept used:
- Laravel validation
- Reusable traits

If removed:
- Invalid passwords could be accepted or the app would rely on weaker/default behavior.

### `$user->forceFill([...])->save()`

What it does:
- Updates the user's password and saves it.

Why it is needed:
- This is the actual password reset step.

How it works:
- `forceFill` assigns the new password.
- The `User` model's `hashed` cast automatically hashes the plain password before writing to the database.

Concept used:
- Eloquent model updates
- Attribute casting

If removed:
- The password would never change even if the token was valid.

### `Notifiable` trait on `User`

What it does:
- Lets the user model receive notifications like reset-password emails.

Why it is needed:
- Laravel sends the `ResetPassword` notification to the user model.

How it works:
- The model gains notification delivery methods and mail routing behavior.

Concept used:
- Laravel notifications

If removed:
- Laravel could not send the reset notification in the standard way.

### `'scheme' => env('MAIL_SCHEME') ?: env('MAIL_ENCRYPTION')`

What it does:
- Lets SMTP encryption come from either env variable.

Why it is needed:
- Many tutorials and providers use `MAIL_ENCRYPTION=tls`, while this config originally only looked for `MAIL_SCHEME`.

How it works:
- Laravel checks `MAIL_SCHEME` first.
- If empty, it falls back to `MAIL_ENCRYPTION`.

Concept used:
- Laravel config + env values

If removed:
- Common SMTP setups may not apply the expected encryption setting unless the exact env key name matches.

## 6. Database Flow

### Which tables are used?

- `users`
- `password_reset_tokens`

### Which columns are read?

From `users`:
- `email`
- `password`

From `password_reset_tokens`:
- `email`
- `token`
- `created_at`

### Which columns are written?

To `password_reset_tokens`:
- `email`
- `token`
- `created_at`

To `users`:
- `password`

### What data is stored?

In `password_reset_tokens`:
- the email address of the account requesting reset
- a hashed reset token
- the time the token was created

In `users.password`:
- the newly hashed password

### Why is it stored?

- The reset token proves the user has access to the email inbox.
- The timestamp allows token expiration.
- The new password is stored so the old password no longer works.

## 7. Authentication & Security Flow

### Validation

- Email request is validated by Fortify before attempting reset-link delivery.
- New password is validated by `ResetUserPassword` using `PasswordValidationRules`.

Why needed:
- Prevents malformed input and weak passwords.

### Password hashing

- The `User` model casts `password` as `hashed`.
- That means plain text passwords are never stored directly.

Why needed:
- If the database is leaked, hashed passwords are far safer than plain text passwords.

### Sanctum tokens

- Sanctum exists on the `User` model through `HasApiTokens`, but it is not directly used in this forgot-password web flow.

Why mention it:
- It is part of the app's auth stack, but this feature uses session/web auth and password brokers, not API tokens.

### Middleware

- Fortify routes are configured with the `web` middleware in `config/fortify.php`.

Why needed:
- `web` enables sessions, CSRF protection, cookies, and flash messages.
- The status message on the forgot-password page depends on session flash data.

### Authorization

- A user does not need to already be logged in to request a reset link.
- Authorization here is based on possession of a valid reset token sent to the account email.

Why needed:
- This is how the app safely lets locked-out users recover access.

## 8. Concepts Learned

### Laravel Fortify

Definition:
- A backend authentication package for Laravel.

Why used:
- Provides ready-made auth routes and logic for login, registration, password reset, and more.

Beginner explanation:
- Instead of building auth from scratch, Fortify gives you the backend pieces and lets you connect your own frontend.

### Inertia.js

Definition:
- A library that lets Laravel render React pages without building a separate API + SPA architecture.

Why used:
- Keeps auth screens in React while still using Laravel routing/controllers.

Beginner explanation:
- Laravel returns a special response that tells React which page component to show and what props to pass.

### Service Provider

Definition:
- A Laravel class used to register or configure services during app boot.

Why used:
- `FortifyServiceProvider` customizes Fortify behavior for this app.

Beginner explanation:
- It is a setup file where Laravel packages are connected to your app.

### Notifications

Definition:
- Laravel's system for sending messages by mail, database, SMS, and more.

Why used:
- Password reset links are sent through a notification.

Beginner explanation:
- A notification is Laravel's way of saying "send this message to this user using this channel."

### Password Broker

Definition:
- Laravel service that handles password reset tokens and reset workflows.

Why used:
- It manages token creation, storage, validation, and expiration.

Beginner explanation:
- It is the built-in reset-password engine behind the scenes.

### Eloquent Model Casts

Definition:
- Automatic transformations when reading or writing model attributes.

Why used:
- The `password` field is automatically hashed.

Beginner explanation:
- You set a plain password in PHP, and Laravel safely converts it before saving.

### Validation

Definition:
- Rules that check whether input data is acceptable.

Why used:
- Ensures email and new password data are valid.

Beginner explanation:
- Validation is the gatekeeper that rejects bad input before the app does anything important.

### Session Flash Data

Definition:
- Temporary session data available for the next request only.

Why used:
- Used to display the "we sent you a reset link" status message.

Beginner explanation:
- It is a short-lived message stored by the backend and shown after a redirect.

### SMTP

Definition:
- A standard protocol for sending email.

Why used:
- The app now uses SMTP to send real password reset emails.

Beginner explanation:
- SMTP is how your Laravel app talks to an email provider like Gmail.

### Wayfinder Route Helpers

Definition:
- Generated TypeScript helpers for Laravel routes.

Why used:
- Avoids hardcoding route strings in React.

Beginner explanation:
- Instead of typing `'/forgot-password'` by hand, the frontend imports a helper that already knows the route.

### Feature Testing with Pest

Definition:
- Automated tests that verify real app behavior through HTTP requests.

Why used:
- Confirms that reset routes work and notifications are sent.

Beginner explanation:
- These tests act like a user or browser hitting the app and checking the result.

## 9. Practical Takeaways

- The forgot-password feature is mostly provided by Laravel Fortify.
- Your app customizes the UI with Inertia + React pages.
- The reset link email depends on Laravel notifications and mail configuration.
- The recent implementation change did not reinvent the auth system. It mostly enabled real mail delivery and strengthened the test.
- The actual password is updated in `ResetUserPassword.php`, not directly in a controller you wrote.
- The token itself is not stored in plain text in the database.
- The `web` middleware is important because this flow depends on sessions, CSRF protection, and flash messages.

## 10. What to Remember for Future Changes

- If the reset email is not arriving, check `.env` mail settings first.
- If the success message does not show, inspect session flash `status`.
- If the reset page fails, confirm the token and email are both present in the request.
- If passwords are saving incorrectly, inspect `ResetUserPassword.php` and the `hashed` cast on `User`.
- If links point to the wrong site, check `APP_URL`.
