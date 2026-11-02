---
description: Create a single dummy user in the MongoDB database
allowed-tools: Read, Bash(node:*)
---

Read the following files to understand the existing MongoDB setup and User model:

- `backend/config/db.js`
- `backend/server.js`
- `backend/models/User.js` if it exists
- `backend/package.json`

Then write and run a temporary Node.js script using Bash that:

1. Generates a realistic random Indian user:
   - Name: realistic Indian first + last name
   - Email: derived from the name with a random 2–3 digit suffix
     (example: `rahul.sharma91@gmail.com`)
   - Password: `"password123"`
   - Password must be hashed using the project's existing password-hashing approach.
   - `createdAt`: current date/time

2. Connects to MongoDB using the existing database connection setup.

3. Checks whether the generated email already exists in the `User` collection.
   - If it exists, generate another email.
   - Continue until a unique email is found.

4. Creates the user using the existing `User` Mongoose model.

5. Prints a confirmation containing:
   - User ID
   - Name
   - Email

6. Do not modify existing application files.

7. Do not create authentication, routes, controllers, or other features.

8. Clean up the temporary script after execution if one was created.

Use the project's existing architecture and dependencies. Do not introduce unnecessary packages.