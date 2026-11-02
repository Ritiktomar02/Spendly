---
description: Seed realistic dummy expenses for a specific user
argument-hint: <user_id> <count> <months>
allowed-tools: Read, Bash(node:*)
---

Read the following files to understand the existing database setup and Expense model:

- `backend/config/db.js`
- `backend/models/User.js`
- `backend/models/Expense.js`
- `backend/server.js`
- `backend/package.json`

User input: `$ARGUMENTS`

## Step 1 — Parse arguments

Extract from `$ARGUMENTS`:

- `user_id` — MongoDB User `_id`
- `count` — number of expenses to create
- `months` — number of past months to spread expenses across

If any argument is missing or invalid, stop and say:

`Usage: /seed-expenses <user_id> <count> <months>`

## Step 2 — Verify user exists

Before generating expenses, confirm that the specified user exists in the `User` collection.

If the user does not exist, stop and say:

`No user found with id <user_id>.`

## Step 3 — Generate expenses

Write and run a temporary Node.js script that:

1. Connects to MongoDB using the existing database configuration.
2. Finds the specified user.
3. Generates the requested number of expenses.
4. Spreads expense dates randomly across the past `<months>` months.
5. Uses only these categories:

   - Food
   - Transport
   - Bills
   - Health
   - Entertainment
   - Shopping
   - Other

6. Uses realistic Indian descriptions and amounts:

   - Food: ₹50–₹800
   - Transport: ₹20–₹500
   - Bills: ₹200–₹3,000
   - Health: ₹100–₹2,000
   - Entertainment: ₹100–₹1,500
   - Shopping: ₹200–₹5,000
   - Other: ₹50–₹1,000

7. Distributes categories approximately proportionally:
   - Food should be most common.
   - Health and Entertainment should be less common.
   - Other categories should have reasonable frequency.

8. Sets `userId` to the specified user's `_id`.

9. Uses the existing `Expense` Mongoose model.

10. Inserts all expenses in a single `insertMany()` operation.

11. Do not create duplicate or unrelated users.

## Step 4 — Error handling

If insertion fails:

- Do not leave partially created data.
- Report the error clearly.
- Do not claim that the expenses were successfully inserted.

Use the existing MongoDB connection pattern and project dependencies.

Do not modify application source files.

Do not implement routes, controllers, authentication, filtering, or other features.

## Step 5 — Confirm

After successful insertion, print:

- Number of expenses inserted
- User ID
- Date range of generated expenses
- A sample of 5 inserted expenses showing:
  - Expense ID
  - Amount
  - Category
  - Date
  - Description

Clean up the temporary script after execution if one was created.