# Plan 02 — Registration (Spendly)

> On approval, this plan is first saved verbatim to `.claude/plans/02-registration.md`, then implemented on branch `feature/registration`.

## Context

The spec `.claude/specs/02-registration.md` turns the UI-only Register page into a working sign-up. It adds Spendly's first API, `POST /api/auth/register`, built in the `Route → Controller → Model` layers. It also wires the existing form to that API and shows a confirmation on the Login page. The step stops at account creation: no login, JWT, sessions or protected routes.

### Current state (explored)

| Area | State |
|---|---|
| `backend/server.js` | `dotenv` → `await connectDB()` → `cors({ origin: "http://localhost:5173" })` → `express.json()` → `GET /` → listen on `PORT \|\| 5001`. No routers yet. |
| `backend/models/User.js` | `name` (required, trim), `email` (required, unique, lowercase, trim), `passwordHash` (required), `createdAt`. **Not modified.** |
| `backend/seed.js` | Already hashes with `bcrypt.hash(password, 10)` using `bcryptjs`, so registration reuses the same approach. |
| `backend/routes/`, `controllers/` | Empty directories. |
| `frontend/src/pages/RegisterPage.jsx` | Has state for `name`/`email`/`password`. `handleSubmit` only calls `preventDefault()`. Inputs use `required`, and email uses `type="email"`. |
| `frontend/src/pages/LoginPage.jsx` | UI-only, with the same card and form styling as Register. |
| `frontend/src/services/` | Empty. Nothing in the frontend uses `fetch` or `import.meta.env` yet. There's no frontend `.env` and no Vite proxy. |
| `frontend/tailwind.config.js` | Already defines `danger`/`danger-light` and `accent`/`accent-light` tokens. The notices use these, so no new colours are needed. |

## Changes

### Backend

**1. Create `backend/controllers/authController.js`: `export async function registerUser(req, res)`**
- Read `name`, `email`, `password` from `req.body` (use `req.body || {}` to guard against an empty body).
- **Validate (each failure → `400 { message }`):**
  - All three must be **strings**. This rejects objects such as `{ "$ne": null }` and blocks query injection into `findOne`.
  - `name.trim()` must be non-empty → "Name is required".
  - `email.trim().toLowerCase()` must match a simple pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` → "Please enter a valid email address".
  - `password.length >= 8` → "Password must be at least 8 characters". The password is not trimmed.
- **Duplicate check:** `User.findOne({ email: normalizedEmail })`. If found → `409 { message: "An account with this email already exists" }`.
- **Hash:** `bcrypt.hash(password, 10)`, the same as `backend/seed.js`.
- **Create:** `User.create({ name: trimmedName, email: normalizedEmail, passwordHash })`.
- **Respond `201`:** `{ message: "Account created successfully", user: { id: user._id, name: user.name, email: user.email } }`. This lists fields explicitly so `passwordHash` can never leak.
- **`try/catch`:** Express 4 doesn't catch async errors on its own.
  - `error.code === 11000` (two requests racing on the unique index) → `409` with the same message.
  - Anything else → `console.error("Registration failed:", error.message)` and `500 { message: "Something went wrong. Please try again." }`.
  - Never log the request body or the password.

**2. Create `backend/routes/authRoutes.js`**
- `express.Router()`, `router.post("/register", registerUser)`, `export default router`. No logic here.

**3. Modify `backend/server.js`**
- Add `import authRoutes from "./routes/authRoutes.js";`.
- Add `app.use("/api/auth", authRoutes);` after `express.json()` and the `GET /` route.
- Nothing else changes: CORS, port and DB startup stay as they are.

### Frontend

**4. Create `frontend/src/services/authService.js`**
- `const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";`
- `export async function registerUser({ name, email, password })`:
  - `fetch(\`${API_URL}/api/auth/register\`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(...) })`.
  - Parse JSON. If `!response.ok`, `throw new Error(data.message || "Registration failed")`. Otherwise return `data`.
- If the network is down, `fetch` rejects. The page catches that and shows a generic "Could not reach the server. Please try again." message.

**5. Modify `frontend/src/pages/RegisterPage.jsx`**
- Imports: add `useNavigate` from `react-router-dom` and `registerUser` from `../services/authService.js`.
- New state: `error` (string) and `isSubmitting` (boolean).
- `handleSubmit`:
  - Call `preventDefault`, clear the error and set submitting.
  - `await registerUser(...)`.
  - On success: `navigate("/login", { state: { registered: true } })`.
  - On failure: set the error from `err.message` (or the generic message for a network failure), then reset submitting.
- **Error notice** (inside the card, above the `<form>`, only when `error` is set):
  - `<p role="alert" className="mb-5 px-[0.875rem] py-[0.6rem] rounded-sm bg-danger-light text-danger text-[0.85rem]">`.
- **Submit button:**
  - Add `disabled={isSubmitting}` plus `disabled:opacity-60 disabled:cursor-not-allowed`.
  - The label becomes `isSubmitting ? "Creating account..." : "Create account"`.
- Update the "form UI only" comment. Leave all other markup, classes and copy unchanged.

**6. Modify `frontend/src/pages/LoginPage.jsx`**
- Import `useLocation`, then `const location = useLocation();` and `const justRegistered = location.state?.registered;`.
- **Success notice** (inside the card, above the `<form>`, when `justRegistered`):
  - `<p role="status" className="mb-5 px-[0.875rem] py-[0.6rem] rounded-sm bg-accent-light text-accent text-[0.85rem]">Account created. Please sign in.</p>`.
- Nothing else changes. Login stays UI-only.

### Not touched
- `User` model, `db.js`, `seed.js`, `package.json` (no new dependencies), `.env` / `.env.example`.
- Navbar, Footer, `App.jsx` (the `/register` route already exists), CORS and ports.
- No JWT, cookies, middleware, login API or dashboard.

## Assumptions / notes
- MongoDB is running locally at `MONGO_URI`, as it was in step 01.
- `VITE_API_URL` is optional. The default `http://localhost:5001` matches the project's fixed backend port, so no frontend `.env` is needed.
- The Login success notice comes from router history state, so it stays if the user refreshes `/login`. That's acceptable for this step.
- Malformed JSON bodies get Express's default 400 response. Handling them is out of scope for the spec.

## Verification (to actually run)
Before starting servers, check what's already listening on ports 5001/5173 and **don't kill your dev servers**. If 5001 is taken, run a test backend with `PORT=5099`.

1. **Backend startup:** start the backend → "MongoDB connected successfully" and "Server running". `curl /` → `{"message":"Spendly API is running"}`.
2. **API checks with `curl`** (each prints the status and body):
   - Valid new user → `201`, with `user.id/name/email` and no `passwordHash`/`password` keys.
   - Same email in different case (`Reg.Test@Example.com`) → `409`.
   - Missing name / `bad-email` / 7-character password / `email: {"$ne":null}` → `400` each, with a clear message.
3. **DB check** (Node one-liner with the `User` model):
   - Exactly one test user.
   - `passwordHash` starts with `$2` and `bcrypt.compare` with the original password is true.
   - Email is stored lowercase.
4. **Frontend build:** `npm run build` in `frontend/` succeeds.
5. **Browser flow** (Vite dev server, plus the backend on 5001, using claude-in-chrome if available; otherwise reported as not run):
   - Register a new user → redirect to `/login` with "Account created. Please sign in.".
   - Register the same email again → red error on the Register page.
   - The button shows "Creating account..." while the request runs.
   - `/`, `/login`, `/terms` and `/privacy` still render, and there are no console errors.
6. **Cleanup:** delete the test users created during verification. Their emails use a `reg.test` prefix, so they can't be confused with real or seeded users.
7. **Diff check:** `git status` shows only the 6 planned files plus `.claude/plans/02-registration.md`.
