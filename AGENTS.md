# AGENTS.md

# Project Overview

This project is a Laravel 13 application using:

- Frontend: React 19 + Inertia.js v3 + Vite + Tailwind CSS v4
- Backend: Laravel + Fortify + Wayfinder
- Testing: Pest + PHPUnit
- Styling and formatting: Tailwind CSS, ESLint, Prettier, Pint

The goal of this project is to build maintainable, scalable features that fit the existing Laravel + Inertia architecture and remain approachable for future contributors.

---

# Development Philosophy

- Keep code simple, readable, and maintainable
- Avoid overengineering and unnecessary abstractions
- Reuse existing components, hooks, actions, and patterns before creating new ones
- Prefer clarity over cleverness
- Build features incrementally
- Keep changes focused and easy to review
- Preserve existing behavior unless the task requires a deliberate change

---

# Important Restrictions

- Do not hardcode credentials, secrets, or API keys
- Do not expose sensitive configuration values
- Do not install or upgrade dependencies without approval
- Do not change database schema without explaining the reason
- Do not remove or rename important files without explanation
- Do not modify production-related configuration carelessly
- Do not create new top-level folders without approval
- Do not create documentation files unless explicitly requested

---

# Protected Areas

- Do not modify `.env.example` unless necessary
- Do not remove existing routes without explanation
- Do not change response structures without explanation
- Do not remove migrations that may already be in use
- Do not delete existing components unless confirmed

---

# Frontend Rules

## React and Inertia Rules

- Use functional components only
- Use hooks instead of class components
- Keep components modular and focused
- Avoid extremely large components
- Reuse existing UI patterns before creating new ones
- Keep page components focused on composition and data flow
- Prefer existing Inertia patterns over custom client-side state machinery
- Use Wayfinder-generated routes where applicable

## Styling Rules

- Use Tailwind CSS
- Avoid inline styles unless necessary
- Keep spacing, typography, and layout consistent
- Maintain responsive behavior on desktop and mobile
- Keep UI clean and readable

## Frontend Folder Structure

- Components -> `resources/js/components`
- Pages -> `resources/js/pages`
- Hooks -> `resources/js/hooks`
- Layouts -> `resources/js/layouts`
- Shared utilities -> `resources/js/lib`
- Route helpers -> `resources/js/routes` and `resources/js/wayfinder`
- Types -> `resources/js/types`

---

# Backend Rules

## Laravel Rules

- Follow Laravel conventions and existing project patterns
- Keep controllers clean
- Prefer Form Requests for validation when appropriate
- Keep business logic out of controllers when it becomes substantial
- Reuse existing models, actions, and relationships before introducing new abstractions
- Organize route changes within the existing route files

## Database Rules

- Use migrations for schema changes
- Keep naming conventions consistent
- Avoid duplicate data
- Use indexes and foreign keys when appropriate
- Never modify production migrations directly

## Response and API Rules

- Keep response structures consistent with the existing application
- Use proper HTTP status codes where applicable
- Validate all user input
- Protect private routes with the correct middleware

## Security Rules

- Never expose secrets
- Use `.env` variables properly
- Sanitize and validate user input
- Validate uploaded files
- Never trust client-side validation alone
- Avoid granting unnecessary permissions

---

# Backend Folder Structure

- Controllers, requests, middleware, and resources -> `app/Http`
- Models -> `app/Models`
- Actions and application logic helpers -> `app/Actions`
- Service providers -> `app/Providers`
- Route definitions -> `routes`

---

# AI Assistant Instructions

## Before Coding

- Analyze the existing architecture first
- Understand the current code flow before editing
- Reuse existing patterns before creating new ones
- Avoid breaking existing functionality
- Ask before making major architectural changes
- Prefer simple and maintainable solutions

## During Coding

- Follow the existing project structure
- Keep changes minimal and focused
- Avoid unnecessary abstractions
- Maintain consistent naming conventions
- Avoid duplicated logic

## After Coding

- Review for bugs and regressions
- Check for security issues
- Check for missing imports and unused code
- Explain modified files and important decisions concisely
- Run the minimum relevant automated tests for the change

---

# Git Rules

- Use conventional commit prefixes when creating commits:
  - `feat:` new feature
  - `fix:` bug fix
  - `refactor:` code cleanup
  - `style:` UI or design changes
  - `docs:` documentation
  - `chore:` maintenance tasks

---

# Testing Rules

- Test functionality before finalizing
- Prefer automated tests over manual-only verification
- Run the minimum relevant tests needed for confidence
- Check browser console errors when working on frontend behavior
- Verify responsive behavior when changing UI
- Check edge cases when practical

---

# Performance Rules

- Avoid unnecessary re-renders
- Avoid duplicate database queries
- Reuse components and data-loading patterns when possible
- Optimize expensive API or page-loading flows when necessary

---

# Code Quality Rules

- Use readable variable and method names
- Avoid deeply nested logic when a clearer structure exists
- Keep functions focused on one responsibility
- Remove unused imports and dead code
- Write code that is easy to understand and extend

---

# Final Goal

The goal of this project is to:

- Build maintainable software
- Follow proper Laravel and Inertia engineering practices
- Keep the codebase organized and scalable
- Use AI as a development assistant, not as a replacement for understanding

---

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4
- inertiajs/inertia-laravel (INERTIA_LARAVEL) - v3
- laravel/fortify (FORTIFY) - v1
- laravel/framework (LARAVEL) - v13
- laravel/prompts (PROMPTS) - v0
- laravel/wayfinder (WAYFINDER) - v0
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- @inertiajs/react (INERTIA_REACT) - v3
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/vite-plugin-wayfinder (WAYFINDER_VITE) - v0
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>
