# Spec: Backend Connection

## Overview

Step 5 replaces the hardcoded data on the `/profile` page with live data from the MongoDB database. The profile page will display the logged-in user's information, summary statistics, recent transactions, and category breakdown using real data.

The UI structure created in Step 4 should be preserved. This step only adds the backend connection and replaces mock data with API-driven data.

## Depends on

- Step 1: Database setup
- Step 2: Registration
- Step 3: Login + Logout
- Step 4: Profile page static UI

## Routes

Add the following backend API route:

- `GET /api/profile` — return profile data for the authenticated user — logged-in only

No new frontend page routes.

## Database changes

No database changes.

Use the existing:

- `User` model
- `Expense` model
- MongoDB connection

## API Response

`GET /api/profile` should return:

```js
{
  user: {
    name,
    email,
    memberSince
  },
  summary: {
    totalSpent,
    transactionCount,
    topCategory
  },
  transactions: [
    {
      date,
      description,
      category,
      amount
    }
  ],
  categoryBreakdown: [
    {
      name,
      amount,
      pct
    }
  ]
}
```

If the user has no expenses:

```js
{
  totalSpent: 0,
  transactionCount: 0,
  topCategory: "—",
  transactions: [],
  categoryBreakdown: []
}
```

## Files to change

- `backend/server.js` — register the profile API route if routes are registered here.
- `frontend/src/pages/ProfilePage.jsx` — replace hardcoded data with data from the profile API.
- Existing authentication middleware or utilities — use them if required to identify the logged-in user.
- `frontend/src/services/` — add or update API communication if this directory is already being used.

## Files to create

Create only the files required by the existing project architecture.

Potential files:

- `backend/routes/profileRoutes.js`
- `backend/controllers/profileController.js`
- `frontend/src/services/profileService.js`

Do not create unnecessary layers if the existing project does not use them.

## New dependencies

No new dependencies.

Use the existing MongoDB, Mongoose, Express, and frontend dependencies.

## Rules for implementation

- Use MongoDB + Mongoose.
- Do not use SQLite or SQL.
- Do not use SQLAlchemy or another ORM.
- Use the existing `User` and `Expense` models.
- Use the existing MongoDB connection.
- Use the existing authentication mechanism to identify the logged-in user.
- Do not hardcode user or expense data.
- Do not expose password or password hash in the API response.
- Return only data required by the profile page.
- Keep the existing Profile UI and design unchanged unless a data-format change requires a small adjustment.
- Use native `fetch()` unless the project already uses another HTTP client.
- Keep API logic separate from React UI where the existing architecture supports services/controllers.
- Do not implement unrelated features.
- Do not add unnecessary dependencies.
- Currency must