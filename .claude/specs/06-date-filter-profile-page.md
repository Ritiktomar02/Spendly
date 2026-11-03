# Spec: Date Filter for Profile Page

## Overview
Step 06 lets the logged-in user narrow the `/profile` page to a date range. A small filter bar with **From** and **To** date inputs sits above the summary stats; applying it re-fetches `GET /api/profile` with optional `startDate` / `endDate` query parameters, and the backend filters the user's expenses by `date` before computing the summary stats, category breakdown and recent transactions. With no dates set, the page behaves exactly as in Step 05 (all time). This builds directly on the live profile data from Step 05 and is the first step where the user can shape what the profile shows. It stops at date filtering: no category filter, search, pagination, or expense CRUD.

## Depends on
- **Step 01: Database Setup**: `User` and `Expense` models (`Expense.date` is a required `Date`).
- **Step 02: Registration** and **Step 03: Login and Logout**: JWT login, the `requireAuth` middleware that sets `req.userId`, and the token stored on the frontend (`getStoredToken()`).
- **Step 04: Profile Page Design**: the `/profile` page layout.
- **Step 05: Backend Route for Profile Page**: `GET /api/profile`, `profileController.getProfile`, the `summaryStats` / `categoryBreakdown` / `transactionHistory` utils, and `frontend/src/services/profileService.js`.

## Routes
No new routes.

Modify the existing route:
- `GET /api/profile?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`: return profile data with only the expenses whose `date` falls within the range. Access: logged-in (`requireAuth`, unchanged).
  - Both parameters are **optional**, and either one can be used on its own:
    - only `startDate`: expenses on or after that day
    - only `endDate`: expenses on or before that day (inclusive of the whole day)
    - neither: all expenses (same response as Step 05)
  - Dates are `YYYY-MM-DD` strings, read as UTC calendar days. `startDate` matches `date >= startDate 00:00:00Z`; `endDate` matches `date < (endDate + 1 day) 00:00:00Z`.
  - Validation, returning `400` with `{ message }`:
    - a parameter is present but is not a string in `YYYY-MM-DD` format, or is not a real date (e.g. `2026-02-30`): `"Dates must be in YYYY-MM-DD format"`
    - `startDate` is after `endDate`: `"Start date must be on or before end date"`
  - The response shape is unchanged from Step 05. `user` (including `memberSince`) is never affected by the filter; `summary`, `transactions` and `categoryBreakdown` are computed from the filtered expenses only. An empty range returns the existing empty-state values (`totalSpent: 0`, `transactionCount: 0`, `topCategory: "—"`, empty arrays).

## Database changes
No database changes. The filter is a `date` range condition added to the existing `Expense.find({ userId })` query. No new models, fields or indexes.

## UI / Pages
- **Create:** none.
- **Modify:**
  - `frontend/src/pages/ProfilePage.jsx`:
    - Add a filter bar card between the profile header and the summary stats, styled with the existing tokens (`bg-paper-card border border-border rounded-md`, `text-ink-muted` labels). It contains:
      - **From** and **To** native `<input type="date">` fields
      - an **Apply** button (styled like the existing primary buttons) that re-fetches the profile with the chosen dates
      - a **Clear** button (secondary/text style) that empties both inputs and re-fetches all-time data. It shows only while a filter is applied.
    - Client-side check before fetching: if both dates are set and From is after To, show an inline error in `text-danger` and don't fetch.
    - Keep the profile header and filter bar on screen while filtered data reloads. Don't replace the whole page with "Loading your profile..." after the first load. A small loading text or a disabled Apply button is enough.
    - Server errors (e.g. a `400` message) show inline near the filter bar. A `401` still calls `onLogout()` as today.
    - Summary card notes change from `"all time"` to describe the active range when a filter is applied (e.g. `"1 Mar 2026 – 31 Mar 2026"`, `"from 1 Mar 2026"`, `"until 31 Mar 2026"`), using the existing `formatDate` helper. With no filter they still read `"all time"`.
    - Empty-state text inside the category and transactions cards reads `"No expenses in this period."` when a filter is active, and keeps the current text otherwise.
    - The filter bar must stack cleanly at ~375px width.
  - `frontend/src/services/profileService.js`: `getProfile` takes an optional `{ startDate, endDate }` argument and appends only the non-empty values as query parameters (using `URLSearchParams`). Calling it with no argument behaves exactly as now.

## Files to change
- `backend/controllers/profileController.js`: read, validate and apply `startDate` / `endDate` to the `Expense` query
- `frontend/src/services/profileService.js`: optional date parameters on `getProfile`
- `frontend/src/pages/ProfilePage.jsx`: filter bar, filtered fetches, range-aware notes and empty states

## Files to create
None. If the date parsing/validation makes the controller hard to read, it may go in a small helper in `backend/utils/` (e.g. `backend/utils/dateRange.js`). Only create it if it is needed.

## New dependencies
No new dependencies. Use native `Date`, native `<input type="date">` and `URLSearchParams`. No date or date-picker libraries.

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
- Filter in the MongoDB query (`date: { $gte, $lt }`), not by fetching all expenses and filtering in JavaScript.
- Always scope the query to `req.userId`. The filter must never return another user's expenses.
- Only accept plain strings for `startDate` / `endDate` (reject arrays/objects such as `?startDate[$gt]=`) and validate the format before building the query.
- Do not change the `GET /api/profile` response shape or the `summaryStats`, `categoryBreakdown` and `transactionHistory` utils. They already work on whatever expense list they are given.
- Do not expose internal error details. Keep the existing `500` message.
- No category filter, search, preset ranges, URL-synced filter state, pagination, or expense add/edit/delete.
- Do not add React Context, a state library or new routes. Keep the filter state local to `ProfilePage`.
- Use native `fetch()` through the existing service file.
- Keep ports (backend `5001`, frontend `5173`) and all existing routes unchanged.

## Definition of done
- [ ] Backend starts with `npm run dev` (or `node server.js`) in `backend/` with no errors; frontend `npm run dev` starts and `npm run build` succeeds.
- [ ] `GET /api/profile` with a valid token and no query parameters returns the same data as before this step.
- [ ] `GET /api/profile?startDate=…&endDate=…` returns only expenses within the range (inclusive of both days), and `summary`, `transactions` and `categoryBreakdown` all reflect the filtered set.
- [ ] Only `startDate` or only `endDate` filters correctly on one side.
- [ ] A range with no expenses returns `totalSpent: 0`, `transactionCount: 0`, `topCategory: "—"` and empty arrays.
- [ ] `startDate=2026-13-01`, `startDate=abc`, `startDate=2026-02-30` or `startDate[$gt]=x` returns `400` with `"Dates must be in YYYY-MM-DD format"`.
- [ ] `startDate` after `endDate` returns `400` with `"Start date must be on or before end date"`.
- [ ] Without a token, `GET /api/profile?startDate=2026-01-01` still returns `401`.
- [ ] Filtered results never include another user's expenses (check with two seeded users).
- [ ] On `/profile`, choosing From/To and clicking Apply updates the stats, category bars and transactions without a full-page loading screen; the network tab shows `/api/profile?startDate=…&endDate=…`.
- [ ] Summary notes show the active range when filtered and `"all time"` when not.
- [ ] Clicking Clear resets both inputs and shows all-time data again.
- [ ] Choosing a From date after the To date shows an inline error and sends no request.
- [ ] An empty range shows `"No expenses in this period."` in both cards.
- [ ] At ~375px width the filter bar stacks with no horizontal scrolling, and the rest of the page looks unchanged.
- [ ] Login, logout, registration, the logged-out `/profile` redirect, and `/`, `/login`, `/register`, `/terms`, `/privacy` all still work.
- [ ] No errors in the browser console or the backend terminal.
