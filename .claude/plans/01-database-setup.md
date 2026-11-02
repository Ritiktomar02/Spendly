# Plan 01 — Database Setup (Spendly)

> On approval, this plan is first saved verbatim to `.claude/plans/01-database-setup.md` (the folder doesn't exist yet), then implemented.

## Context

The spec `.claude/specs/01-database-setup.md` sets up Spendly's data layer: the `User` and `Expense` Mongoose models, plus a safer connection/startup flow. This is the base for later auth and expense features. The task adds no routes, controllers, auth or CRUD.

### Current state (explored)

| File | State |
|---|---|
| `backend/config/db.js` | Has `connectDB()` that reads `process.env.MONGO_URI`. On failure it only **warns** and continues, which breaks spec §7/§8. |
| `backend/server.js` | Calls `connectDB()` **without awaiting** and starts listening anyway. Has `cors` (origin 5173), `express.json()` and `GET /` health check. Port is `process.env.PORT \|\| 5001`. |
| `backend/package.json` | ESM (`"type": "module"`). `mongoose ^8.4.4`, `dotenv` and `express` are already installed. The `dev` script uses nodemon. |
| `backend/models/` | Exists, empty. |
| `backend/.env` / `.env.example` | `MONGO_URI=mongodb://localhost:27017/spendly`, `PORT=5001`. `.env` is gitignored (confirmed). |
| Environment | Node v24.6.0. Local `mongod` (Homebrew, v6.0) is running. |

## Changes

### 1. Modify `backend/config/db.js`: fail clearly
- If `MONGO_URI` is missing, log a clear error and exit.
- Keep `await mongoose.connect(process.env.MONGO_URI)` and the success log.
- In `catch`, log `"MongoDB connection failed:"` with `error.message` (never the URI, which may contain credentials) and call `process.exit(1)` instead of warning and continuing.
- Keep the `export default connectDB` signature unchanged.

### 2. Modify `backend/server.js`: start only after the DB connects
- Keep loading dotenv, the CORS config, `express.json()`, `GET /` and the port logic exactly as they are.
- Replace the fire-and-forget `connectDB();` with `await connectDB();` (top-level await is valid in ESM) before `app.listen(...)`. This is the smallest change that guarantees the order connect → listen.
- No other changes.

### 3. Create `backend/models/User.js`
Follows the style of the earlier (deleted) models in git history: `mongoose.Schema`, then `mongoose.model`, then a default export.
- `name`: String, required, trim
- `email`: String, required, unique, lowercase, trim
- `passwordHash`: String, required (named as the spec says; no hashing logic here)
- `createdAt`: Date, default `Date.now`
- No `timestamps` option, because the spec lists only `createdAt`.

### 4. Create `backend/models/Expense.js`
- `userId`: `mongoose.Schema.Types.ObjectId`, `ref: "User"`, required
- `amount`: Number, required, `min: 0` (light validation; see assumptions)
- `category`: String, required, `enum: ["Food","Transport","Bills","Health","Entertainment","Shopping","Other"]` (the spec's exact list and order)
- `date`: Date, required (the spec allows Date or String; Date is chosen for future filtering)
- `description`: String, trim, optional
- `createdAt`: Date, default `Date.now`

### Not touched
Frontend, routes, controllers, middlewares, `package.json` (no new dependencies) and `.env`. There is no seed script.

## Assumptions / prerequisites
- MongoDB is reachable at the `MONGO_URI` in `backend/.env` (it's currently running locally).
- `amount` gets `min: 0` as basic validation. Drop it if a strict reading of the spec is preferred.
- `bcryptjs` and `jsonwebtoken` are already in `package.json` from the earlier version. They're left alone (removing them is out of scope).
- The models aren't imported by `server.js` yet, because no feature uses them. They're verified by loading them directly.

## Verification (to actually run)
1. `cd backend && npm run dev`: expect "MongoDB connected successfully", then "Server running on http://localhost:5001".
2. `curl http://localhost:5001/`: expect `{"message":"Spendly API is running"}`.
3. Model load and validation check (no DB writes):
   `node -e "const {default:U}=await import('./models/User.js');const {default:E}=await import('./models/Expense.js');console.log(U.modelName,E.modelName);console.log(new E({category:'Invalid'}).validateSync()?.errors && 'validation OK');console.log(new U({name:'a',email:'A@X.COM',passwordHash:'x'}).email)"`
   Expect `User Expense`, `validation OK` and a lowercased email.
4. Failure path: run with a bad `MONGO_URI`, e.g. `MONGO_URI=mongodb://localhost:1/x node server.js`. Expect a clear error, exit code 1 and no "Server running" line.
5. Check the frontend still builds and routes are unaffected (no frontend files are changed). Check the `git diff` touches only the four backend files.
