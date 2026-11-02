# CLAUDE.md

## Project

Spendly is a lightweight personal expense tracker and a learning project for Claude Code.

The original reference project used Flask + SQLite. This implementation uses a MERN-style JavaScript architecture.

### Stack

- React + Vite
- Tailwind CSS v3
- Node.js + Express.js
- MongoDB + Mongoose
- JavaScript
- ES Modules (`import` / `export`)

Keep the code simple, readable, maintainable, and beginner-friendly.

---

## Current State

The project has intentionally been reset to an early development stage.

### Implemented

- Landing page
- Login/Register UI
- Terms/Privacy pages
- Navbar/Footer
- Basic Express server
- MongoDB connection infrastructure

### Not Implemented

- Authentication
- Register/Login APIs
- JWT
- Password hashing
- Logout
- Protected routes
- Dashboard/Profile
- User model
- Expense model
- Expense CRUD/filtering

**Do not implement unrequested features.**

---

## Architecture

### Frontend

```text
frontend/src/
├── components/     # Reusable UI
├── pages/          # Application pages
├── services/       # API communication when needed
├── App.jsx
├── index.css
└── main.jsx
```

Current routes:

```text
/
/login
/register
/terms
/privacy
```

Login and Register are currently UI-only.

Use native `fetch()` for API calls unless another library is explicitly required.

### Backend

```text
backend/
├── config/
│   └── db.js
├── controllers/    # When needed
├── middlewares/    # When needed
├── models/         # When needed
├── routes/         # When needed
├── utils/          # When needed
└── server.js
```

`server.js` is the application entry point.

`config/db.js` contains MongoDB connection logic.

Future backend flow:

```text
Route → Controller → Model → MongoDB
```

Create additional directories only when required by a feature.

---

## Database

MongoDB + Mongoose.

Keep database connection logic in:

```text
backend/config/db.js
```

Do not create models until the relevant feature is requested.

---

## UI

Preserve the existing Spendly design.

Avoid unnecessary changes to existing:

- Pages
- Navbar
- Footer
- Colors
- Typography
- Layout
- Responsive behavior

Use Tailwind CSS v3.

Global styles belong in:

```text
frontend/src/index.css
```

Do not introduce another CSS framework unless explicitly requested.

---

## Development

Spendly is developed incrementally.

**Implement only the feature requested in the current task.**

Do not automatically implement related features or assume what should come next.

Avoid unnecessary:

- Dependencies
- Abstractions
- Refactoring
- Architecture changes
- Performance optimization

Prefer small, focused changes.

---

## Coding Style

Use modern JavaScript with ES Modules.

- `camelCase` for variables/functions
- `PascalCase` for React components
- Clear and descriptive names
- Simple and readable implementations

Avoid clever or unnecessarily complex code.

---

## Ports

- Backend: `5001`
- Frontend: `5173`

Do not change them unless explicitly requested.

---

## Workflow

For every task:

```text
Explore → Understand → Plan → Implement → Test → Verify → Stop
```

Before changing code:

1. Inspect relevant files.
2. Understand the existing implementation.
3. Plan the smallest required change.
4. Implement only the requested feature.
5. Test and verify the affected functionality.
6. Stop when complete.

Never claim tests were run if they were not actually run.

---

## Critical Constraints

- Do not change the technology stack.
- Do not implement future features.
- Do not redesign unnecessarily.
- Do not refactor unrelated code.
- Do not delete working functionality.
- Do not install unnecessary dependencies.
- Do not expose or hardcode secrets.
- Do not commit `.env` files.
- Prefer the smallest correct implementation.

---

## Claude Configuration

Detailed instructions are stored in:

```text
.claude/rules/
```

Reusable workflows are stored in:

```text
.claude/commands/
```

`CLAUDE.md` provides project context and architecture.

Detailed coding, frontend, backend, database, testing, security, and workflow rules belong in `.claude/`.