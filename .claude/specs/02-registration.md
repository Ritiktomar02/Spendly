# Spec: Registration

## Overview
Lets a new visitor create a Spendly account from the existing Register page. The form is currently UI-only (`handleSubmit` does nothing). This step adds a backend `POST /api/auth/register` endpoint that validates input, hashes the password with `bcryptjs`, and saves a `User` document, and wires the Register page to it through a frontend service. It is the first backend API in Spendly and the first use of the `Route → Controller → Model` flow, so it establishes the pattern later features will follow. It stops at account creation: no login, tokens, sessions or protected routes.

## Depends on
- **Step 01 — Database Setup** (complete): `backend/config/db.js` connects before the server starts, and `backend/models/User.js` exists with `name`, `email` (required, unique, lowercase, trimmed), `passwordHash` and `createdAt`.

## Routes
- `POST /api/auth/register` — create a new user account — public
  - Request body (JSON): `{ "name": string, "email": string, "password": string }`
  - Validation (server-side, before touching the database):
    - `name` — required, non-empty after trimming
    - `email` — required, valid email format
    - `password` — required, at least 8 characters
  - Responses:
    - `201` — `{ "message": "Account created successfully", "user": { "id", "name", "email" } }`
    - `400` — `{ "message": "<what is wrong>" }` for missing or invalid fields
    - `409` — `{ "message": "An account with this email already exists" }` (email compared case-insensitively, matching the model's `lowercase: true`)
    - `500` — `{ "message": "Something went wrong. Please try again." }` — no internal error details
  - The response must never include `passwordHash` or the plain password.

No frontend route changes: `/register` already exists.

## Database changes
No database changes. The existing `User` model already has every field needed. The `unique` index on `email` is the final guard against duplicates; a duplicate-key error (`11000`) from a race between two requests must also return `409`.

## UI / Pages
- **Create:** none
- **Modify:**
  - `frontend/src/pages/RegisterPage.jsx` — `handleSubmit` calls the register service. Show an inline error message above the form on failure, disable the submit button and show "Creating account..." while the request is in flight, and on success navigate to `/login` with router state `{ registered: true }`. Keep the existing layout, fields, classes and copy.
  - `frontend/src/pages/LoginPage.jsx` — if router state has `registered: true`, show a small success notice ("Account created. Please sign in.") above the form. No other changes; login stays UI-only.

New UI elements (error and success notices) must use the existing Tailwind theme tokens (`ink`, `accent`, `border`, `paper`, etc.) and match the current form styling.

## Files to change
- `backend/server.js` — mount the auth routes at `/api/auth`
- `frontend/src/pages/RegisterPage.jsx` — call the API, handle loading/error/success
- `frontend/src/pages/LoginPage.jsx` — show the post-registration success notice

## Files to create
- `backend/routes/authRoutes.js` — Express router with `POST /register`
- `backend/controllers/authController.js` — `registerUser` controller: validate, check for existing email, hash password, create user, send response
- `frontend/src/services/authService.js` — `registerUser({ name, email, password })` using native `fetch()`; reads the API base URL from `import.meta.env.VITE_API_URL`, defaulting to `http://localhost:5001`; throws an `Error` with the server's `message` on non-2xx responses

## New dependencies
No new dependencies. `bcryptjs` is already in `backend/package.json`; the frontend uses native `fetch()`.

## Rules for implementation
- Use MongoDB + Mongoose
- Do not use SQL or SQL ORMs
- Use the existing database connection setup
- Use environment variables for secrets and configuration
- Do not hardcode credentials or secrets
- Preserve the existing Spendly UI unless the feature requires changes
- Use the existing project architecture
- Do not implement future features
- Do not refactor unrelated code
- Follow `Route → Controller → Model`: the route file only maps the path to the controller; all logic lives in the controller.
- Hash passwords with `bcryptjs` (salt rounds `10`, as in `backend/seed.js`). Never store or log the plain password.
- Do not implement login, logout, JWT, cookies, sessions, auth middleware, protected routes, or a dashboard. `JWT_SECRET` in `.env.example` stays unused in this step.
- Do not log the user in automatically after registration.
- Keep the existing CORS setup (`http://localhost:5173`) and ports (backend `5001`, frontend `5173`).
- Keep the browser's built-in `required`/`type="email"` checks on the form; server-side validation is still mandatory.
- Do not modify the `User` model.

## Definition of done
- [ ] Backend starts with `npm run dev` in `backend/` with no errors, and `GET /` still returns `{"message":"Spendly API is running"}`.
- [ ] `POST /api/auth/register` with a valid new name/email/password returns `201` with `id`, `name` and `email`, and no `passwordHash` or `password` in the response.
- [ ] The created user exists in MongoDB with a bcrypt hash in `passwordHash` (starts with `$2`), not the plain password, and the email stored in lowercase.
- [ ] Registering again with the same email (including different letter case, e.g. `Test@X.com` vs `test@x.com`) returns `409` and creates no second user.
- [ ] Missing name, invalid email, or a password shorter than 8 characters each return `400` with a clear message, and create no user.
- [ ] In the browser at `http://localhost:5173/register`, submitting valid details redirects to `/login` and shows "Account created. Please sign in."
- [ ] Submitting an email that is already registered shows the server's error message on the Register page without leaving the page.
- [ ] The submit button is disabled and reads "Creating account..." while the request is in progress.
- [ ] `/`, `/login`, `/terms` and `/privacy` still render as before; the Navbar and Footer are unchanged.
- [ ] No errors in the browser console or backend terminal during the flows above.
- [ ] `frontend` builds successfully with `npm run build`.
