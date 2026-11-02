# Spendly — Database Foundation

## 1. Overview

Implement the MongoDB database foundation for Spendly.

This step establishes the data layer for future features such as authentication, profiles, and expense tracking.

The current project already has the Express server and MongoDB connection infrastructure. This task should only establish the database models and verify the connection.

---

## 2. Depends On

Nothing.

This is the first database implementation step.

---

## 3. Routes

No new routes.

Existing frontend and backend routes remain unchanged.

Do not implement authentication or expense APIs in this step.

---

## 4. Database

**Database:** MongoDB  
**ODM:** Mongoose

MongoDB connection logic must remain in:

```text
backend/config/db.js
```

Database models must be placed in:

```text
backend/models/
```

---

## 5. Models

### A. User

Create:

```text
backend/models/User.js
```

Fields:

| Field | Type | Constraints |
|---|---|---|
| name | String | Required |
| email | String | Required, Unique |
| passwordHash | String | Required |
| createdAt | Date | Default: current date |

Email should be stored consistently, preferably lowercase.

---

### B. Expense

Create:

```text
backend/models/Expense.js
```

Fields:

| Field | Type | Constraints |
|---|---|---|
| userId | ObjectId | Required, references User |
| amount | Number | Required |
| category | String | Required |
| date | Date/String | Required |
| description | String | Optional |
| createdAt | Date | Default: current date |

`userId` must reference the `User` model.

---

## 6. Categories

Use only these categories:

```text
Food
Transport
Bills
Health
Entertainment
Shopping
Other
```

Do not introduce additional categories unless explicitly requested.

---

## 7. Database Connection

`backend/config/db.js` should:

- Connect to MongoDB using Mongoose.
- Read the MongoDB connection string from an environment variable.
- Handle connection errors clearly.
- Avoid hardcoded credentials.
- Export the database connection function.

Example environment variable:

```text
MONGO_URI
```

---

## 8. Server Startup

`backend/server.js` should:

1. Load environment variables.
2. Connect to MongoDB.
3. Start the Express server only after the database connection succeeds.

Existing server behavior and routes should remain unchanged.

---

## 9. Seed Data

Do **not** add seed/demo data automatically unless explicitly requested.

If seed data is required later, create a separate seed script instead of putting seed logic inside server startup.

---

## 10. Dependencies

Use the existing project dependencies.

Required:

```text
mongoose
```

Do not add another database library or ORM.

Do not install unnecessary packages.

---

## 11. Implementation Rules

- Use Mongoose schemas/models.
- Keep models in `backend/models/`.
- Keep database connection logic in `backend/config/db.js`.
- Use environment variables for database credentials.
- Do not hardcode secrets.
- Do not create routes/controllers for this step.
- Do not implement authentication.
- Do not implement expense CRUD.
- Do not modify existing frontend UI.
- Do not refactor unrelated code.
- Keep the implementation simple and readable.

---

## 12. Verification

After implementation:

1. Start the backend.
2. Verify MongoDB connects successfully.
3. Verify the server starts without errors.
4. Verify both models load correctly.
5. Confirm existing routes still work.
6. Do not claim verification unless it was actually performed.