# Spec: Profile Page Design

## Overview
Adds a static, design-only Profile page at `/profile` that a logged-in user reaches from the Navbar. The page shows the user's name and email (from the `user` already held in `App.jsx` state after login) and lays out the sections a profile will eventually have: account summary stats, a spending-by-category breakdown and a recent transactions list. Every number on the page, and every transaction and category in it, is **hardcoded placeholder data** defined in the page file. No API calls are made. This step exists to settle the layout and visual design before the profile is wired to real data in a later step. It builds on Step 03 (Login and Logout) and stops at the UI: no new backend routes, no expense queries, no editing of profile details.

## Depends on
- **Step 01 — Database Setup** (complete): `User` and `Expense` models exist (not used by this step).
- **Step 02 — Registration** (complete).
- **Step 03 — Login and Logout** (complete): `App.jsx` holds the logged-in `user` (`{ id, name, email }`) in state, restored from `localStorage` via `getStoredUser()`; the Navbar shows the user's name and a "Sign out" button when logged in.

## Routes
- `GET /profile` (frontend route) — static profile page — logged-in
  - When `user` is `null`, redirect to `/login` with `<Navigate to="/login" replace />`, following the existing pattern `App.jsx` uses for `/login` and `/register`.

No new backend routes.

## Database changes
No database changes. The page reads nothing from MongoDB; the existing `User` and `Expense` models are untouched.

## UI / Pages
- **Create:**
  - `frontend/src/pages/ProfilePage.jsx`: receives `user` as a prop. Sections, top to bottom, inside a `max-w-content` container:
    1. **Profile header**: a circular avatar showing the user's initials (derived from `user.name`), the user's name in `font-display`, the email in `text-ink-muted`, and a hardcoded "Member since" date.
    2. **Summary stats**: three cards in a responsive grid (stacked on mobile): Total spent, Transactions, Top category. All values are hardcoded (e.g. `₹18,240`, `24`, `Bills`).
    3. **Spending by category**: a card with horizontal bars, styled like `MockExpenseCard` (track `bg-border-soft`, fills `bg-accent` / `bg-accent-2` etc.), using a hardcoded array.
    4. **Recent transactions**: a card listing about 5 hardcoded transactions (date, description, category, amount), with amounts right-aligned in ₹.
  - Hardcoded data lives in plain arrays/objects at the top of `ProfilePage.jsx`, and a short comment marks it as placeholder data to replace when the backend is connected.
- **Modify:**
  - `frontend/src/App.jsx`: import `ProfilePage`; add the `/profile` route (redirect to `/login` when logged out) and pass `user` to it.
  - `frontend/src/components/Navbar.jsx`: when logged in, make the user's name a `Link` to `/profile` (same `text-ink-muted` style with the existing `hover:text-ink transition-colors`). The logged-out Navbar is unchanged, and the Navbar's layout, height, logo and spacing must not change.

Styling must use the existing Tailwind theme tokens (`ink*`, `paper*`, `accent*`, `border*`, `font-display`, `font-body`, `rounded-sm/md/lg`, `max-w-content`) and match the look of the landing page and `MockExpenseCard`. No new colours, fonts or global CSS.

## Files to change
- `frontend/src/App.jsx`: add the `/profile` route with a logged-out redirect
- `frontend/src/components/Navbar.jsx`: link the user's name to `/profile`

## Files to create
- `frontend/src/pages/ProfilePage.jsx`

## New dependencies
No new dependencies. Charts/bars are plain Tailwind `div`s; no chart library.

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
- This is a **design-only** step: no `fetch()` calls, no new service functions, no backend changes, and no new models or routes.
- The only real data shown is `user.name` and `user.email` from existing App state; everything else is hardcoded placeholder data.
- Do not build edit-profile forms, password change, avatar upload, a dashboard, expense CRUD, filters or date pickers.
- Do not add auth middleware or a `GET /api/auth/me` endpoint. The logged-out redirect is client-side only, matching the existing pattern in `App.jsx`.
- Do not add React Context or a state library; pass `user` as a prop.
- Keep components in a single page file unless a piece is clearly reusable; do not split into many tiny components.
- The page must be responsive: readable at phone width (~375px) with no horizontal scroll.
- Keep ports (backend `5001`, frontend `5173`) and existing routes unchanged.

## Definition of done
- [ ] `npm run dev` in `frontend/` starts with no errors and `npm run build` succeeds.
- [ ] While logged in, the user's name in the Navbar is a link; clicking it opens `/profile`.
- [ ] `/profile` shows the logged-in user's real name and email, plus initials in the avatar.
- [ ] `/profile` shows the summary stats, spending-by-category bars and recent transactions sections with placeholder data.
- [ ] While logged out, visiting `/profile` redirects to `/login`.
- [ ] After signing out from `/profile`, the app goes to `/`, and visiting `/profile` again redirects to `/login`.
- [ ] Refreshing `/profile` while logged in keeps you on the profile page.
- [ ] Logging in redirects to `/profile` (changed after review; replaces Step 03's redirect to `/`). If the user was sent to `/login` from another page, they go back to that page instead.
- [ ] No network requests are made by the Profile page (check the browser DevTools Network tab).
- [ ] The page uses the existing Spendly colours and fonts and looks consistent with the landing page.
- [ ] At ~375px width the page stacks cleanly with no horizontal scrolling.
- [ ] `/`, `/login`, `/register`, `/terms` and `/privacy` still render as before, the logged-out Navbar and Footer look unchanged, and login/logout/registration still work.
- [ ] No errors in the browser console.
