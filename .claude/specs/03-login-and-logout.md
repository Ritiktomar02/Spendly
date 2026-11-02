# Spec: Login and Logout

## Overview
Lets a registered user sign in from the existing Login page and sign out again from the Navbar. The Login form is currently UI-only (`handleSubmit` does nothing). This step adds a backend `POST /api/auth/login` endpoint that checks the email and password against the stored bcrypt hash and, on success, returns a signed JWT plus the user's public details. The frontend stores the token and user in `localStorage`, keeps the logged-in user in `App.jsx` state, and the Navbar switches from "Sign in / Get started" to the user's name and a "Sign out" button. Logout is client-side: it clears the stored token and user. It builds directly on Step 02 (Registration) and stops there: no auth middleware, protected routes, dashboard or profile.

## Depends on
- **Step 01 — Database Setup** (complete): `backend/config/db.js` connects before the server starts; `backend/models/User.js` has `name`, `email` (unique, lowercase, trimmed), `passwordHash`, `createdAt`.
- **Step 02 — Registration** (complete): `POST /api/auth/register` creates users with bcrypt-hashed passwords; `backend/routes/authRoutes.js`, `backend/controllers/authController.js` and `frontend/src/services/authService.js` exist.

## Routes
- `POST /api/auth/login` — sign in with email and password — public
  - Request body (JSON): `{ "email": string, "password": string }`
  - Validation (server-side, before touching the database):
    - `email` and `password` must both be non-empty strings (non-strings rejected, which also blocks query objects like `{ "$ne": null }`)
    - `email` is trimmed and lowercased before lookup, matching the model
  - Behaviour: find the user by email, compare the password with `bcrypt.compare` against `passwordHash`, then sign a JWT with `jsonwebtoken` using `process.env.JWT_SECRET`, payload `{ userId: user._id }`, `expiresIn: "7d"`.
  - Responses:
    - `200` — `{ "message": "Logged in successfully", "token": "<jwt>", "user": { "id", "name", "email" } }`
    - `400` — `{ "message": "Email and password are required" }`
    - `401` — `{ "message": "Invalid email or password" }` — the same message whether the email is unknown or the password is wrong
    - `500` — `{ "message": "Something went wrong. Please try again." }` — no internal details. If `JWT_SECRET` is not set, log a clear server-side error and return this `500`.
  - The response must never include `passwordHash` or the plain password.

No backend logout route: JWTs are stateless, so logout is handled on the client by deleting the stored token and user.

No new frontend routes: `/login` already exists.

## Database changes
No database changes. Login only reads the existing `User` model.

## UI / Pages
- **Create:** none
- **Modify:**
  - `frontend/src/App.jsx` — hold the logged-in `user` in `useState`, initialised from `localStorage` (via the auth service). Pass `user` and an `onLogout` handler to `Navbar`, and an `onLogin` handler to `LoginPage`.
  - `frontend/src/pages/LoginPage.jsx` — `handleSubmit` calls the login service. Show an inline error (same style as RegisterPage's `role="alert"` box) on failure, including "Could not reach the server. Please try again." for network errors. Disable the button and show "Signing in..." while in flight. On success call `onLogin(user)` and navigate to `/`. Keep the existing "Account created. Please sign in." notice, layout, fields, classes and copy.
  - `frontend/src/components/Navbar.jsx` — when `user` is null, render exactly the current "Sign in" / "Get started" links. When logged in, show the user's name (in the existing `text-ink-muted` link style) and a "Sign out" button styled like the current "Get started" button. Clicking "Sign out" calls `onLogout` and navigates to `/`.

New UI elements must use the existing Tailwind theme tokens (`ink`, `accent`, `danger`, `border`, `paper`, etc.) and match the current styling. Do not change the Navbar's layout, height, logo or spacing.

## Files to change
- `backend/controllers/authController.js` — add `loginUser` controller
- `backend/routes/authRoutes.js` — add `POST /login`
- `frontend/src/services/authService.js` — add `loginUser`, `getStoredUser`, `logoutUser`
- `frontend/src/App.jsx` — logged-in user state and login/logout handlers
- `frontend/src/pages/LoginPage.jsx` — call the API, handle loading/error/success
- `frontend/src/components/Navbar.jsx` — logged-in vs logged-out links, Sign out button

## Files to create
No new files.

Service functions to add in `frontend/src/services/authService.js`:
- `loginUser({ email, password })` — `POST /api/auth/login` with native `fetch()`; on success saves `token` and `user` (JSON) to `localStorage` under the keys `spendlyToken` and `spendlyUser`, returns the `user`; throws an `Error` with the server's `message` on non-2xx responses.
- `getStoredUser()` — returns the parsed `spendlyUser` from `localStorage`, or `null` if missing or invalid JSON.
- `logoutUser()` — removes `spendlyToken` and `spendlyUser` from `localStorage`.

## New dependencies
No new dependencies. `jsonwebtoken` and `bcryptjs` are already in `backend/package.json`; the frontend uses native `fetch()` and `localStorage`.

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
- Follow `Route → Controller → Model`: the route file only maps paths to controllers; all logic lives in the controller. Keep `registerUser` unchanged.
- Read the JWT secret only from `process.env.JWT_SECRET`; never hardcode a fallback secret. `JWT_SECRET` is already documented in `backend/.env.example`.
- Use `bcrypt.compare` for password checks; never log passwords, hashes or tokens.
- Use one generic "Invalid email or password" message so the API does not reveal which emails are registered.
- Do not implement auth middleware, `GET /api/auth/me`, protected routes, a dashboard, profile page, refresh tokens, cookies or sessions. The stored token is not sent to any endpoint in this step.
- Do not add a global state library or React Context; lift state into `App.jsx` and pass props.
- Keep the existing CORS setup (`http://localhost:5173`) and ports (backend `5001`, frontend `5173`).
- Do not modify the `User` model.

## Definition of done
- [ ] Backend starts with `npm run dev` in `backend/` with no errors, and `GET /` still returns `{"message":"Spendly API is running"}`.
- [ ] `POST /api/auth/login` with a registered user's correct email and password returns `200` with a `token` and `user` (`id`, `name`, `email`), and no `passwordHash` or `password`.
- [ ] The returned token decodes (e.g. on jwt.io or with `jsonwebtoken`) to a payload containing `userId` and an `exp` about 7 days ahead.
- [ ] Login works regardless of email letter case (e.g. `Test@X.com` for a user registered as `test@x.com`).
- [ ] A wrong password and an unregistered email both return `401` with exactly `"Invalid email or password"`.
- [ ] Missing email or password, or a non-string value such as `{ "$ne": null }`, returns `400`.
- [ ] `POST /api/auth/register` still works as before.
- [ ] In the browser at `http://localhost:5173/login`, valid credentials redirect to `/`, and the Navbar shows the user's name and a "Sign out" button instead of "Sign in" / "Get started".
- [ ] `spendlyToken` and `spendlyUser` appear in the browser's `localStorage` after login.
- [ ] Refreshing the page after login keeps the Navbar in the logged-in state.
- [ ] Invalid credentials show "Invalid email or password" on the Login page without leaving it; with the backend stopped, the page shows "Could not reach the server. Please try again."
- [ ] The Sign in button is disabled and reads "Signing in..." while the request is in progress.
- [ ] Clicking "Sign out" clears both `localStorage` keys, navigates to `/`, and the Navbar shows "Sign in" / "Get started" again; refreshing keeps it logged out.
- [ ] While logged in, visiting `/login` or `/register` redirects to `/` (added after review). Logged out, both pages work as before.
- [ ] Registering a new account still redirects to `/login` with "Account created. Please sign in."
- [ ] `/`, `/register`, `/terms` and `/privacy` still render as before; the logged-out Navbar and the Footer look unchanged.
- [ ] No errors in the browser console or backend terminal during the flows above.
- [ ] `frontend` builds successfully with `npm run build`.
