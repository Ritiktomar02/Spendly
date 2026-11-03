// Tests for Step 06: date filter on GET /api/profile.
// Run from the repo root:  node --test tests/test_06-date-filter-profile-page.js
//
// The backend is started by this file if it is not already running on port 5001.
// All users/expenses created here are removed in the `after` hook.

import { before, after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backendDir = path.join(rootDir, "backend");

// mongoose and dotenv are installed in backend/node_modules
const requireFromBackend = createRequire(path.join(backendDir, "package.json"));
const mongoose = requireFromBackend("mongoose");
const dotenv = requireFromBackend("dotenv");
dotenv.config({ path: path.join(backendDir, ".env") });

const { default: Expense } = await import(pathToFileURL(path.join(backendDir, "models", "Expense.js")).href);
const { default: User } = await import(pathToFileURL(path.join(backendDir, "models", "User.js")).href);

const BASE_URL = "http://localhost:5001";
const FORMAT_MESSAGE = "Dates must be in YYYY-MM-DD format";
const ORDER_MESSAGE = "Start date must be on or before end date";

const runId = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const password = `pw-${runId}-test`;

let serverProcess = null;
const createdUserIds = [];
const users = {}; // { owner, other, empty } -> { id, email, token }

async function isServerUp() {
  try {
    const res = await fetch(`${BASE_URL}/`);
    return res.ok;
  } catch {
    return false;
  }
}

function startServer() {
  return new Promise((resolve, reject) => {
    serverProcess = spawn("node", ["server.js"], { cwd: backendDir, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    serverProcess.stdout.on("data", (chunk) => {
      output += chunk.toString();
      if (output.includes("Server running")) resolve();
    });
    serverProcess.stderr.on("data", (chunk) => {
      output += chunk.toString();
    });
    serverProcess.on("error", reject);
    serverProcess.on("exit", (code) => reject(new Error(`Backend exited early (code ${code}): ${output}`)));
  });
}

async function createUser(label) {
  const email = `step06-${label}-${runId}@test.local`;
  const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: `Step06 ${label}`, email, password }),
  });
  assert.equal(registerRes.status, 201, "registration should succeed");
  const registered = await registerRes.json();
  createdUserIds.push(registered.user.id);

  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert.equal(loginRes.status, 200, "login should succeed");
  const { token } = await loginRes.json();
  return { id: registered.user.id, email, token };
}

function getProfile(query = "", token = users.owner?.token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return fetch(`${BASE_URL}/api/profile${query}`, { headers });
}

async function getOk(query, token) {
  const res = await getProfile(query, token);
  assert.equal(res.status, 200, `expected 200 for "${query}"`);
  return res.json();
}

function descriptions(body) {
  return body.transactions.map((t) => t.description);
}

before(
  async () => {
    assert.ok(process.env.MONGO_URI, "MONGO_URI must be set in backend/.env");
    if (!(await isServerUp())) await startServer();
    await mongoose.connect(process.env.MONGO_URI);

    users.owner = await createUser("owner");
    users.other = await createUser("other");
    users.empty = await createUser("empty");

    const at = (iso) => new Date(iso);
    await Expense.insertMany([
      // Owner: boundary-focused data set (5 rows, all fit in "recent transactions")
      { userId: users.owner.id, amount: 5, category: "Food", date: at("2026-02-28T23:59:59.999Z"), description: "before-range" },
      { userId: users.owner.id, amount: 10, category: "Food", date: at("2026-03-01T00:00:00.000Z"), description: "start-midnight" },
      { userId: users.owner.id, amount: 20, category: "Transport", date: at("2026-03-15T12:00:00.000Z"), description: "mid-month" },
      { userId: users.owner.id, amount: 40, category: "Bills", date: at("2026-03-31T23:59:59.999Z"), description: "end-late-night" },
      { userId: users.owner.id, amount: 80, category: "Shopping", date: at("2026-04-01T00:00:00.000Z"), description: "after-range" },
      // Another user with expenses inside every owner range
      { userId: users.other.id, amount: 999, category: "Health", date: at("2026-03-15T12:00:00.000Z"), description: "other-user-march" },
      { userId: users.other.id, amount: 777, category: "Other", date: at("2025-01-15T12:00:00.000Z"), description: "other-user-2025" },
    ]);
  },
  { timeout: 60000 }
);

after(
  async () => {
    try {
      if (mongoose.connection.readyState === 1 && createdUserIds.length > 0) {
        const ids = createdUserIds.map((id) => new mongoose.Types.ObjectId(id));
        await Expense.deleteMany({ userId: { $in: ids } });
        await User.deleteMany({ _id: { $in: ids } });
      }
    } finally {
      await mongoose.disconnect();
      if (serverProcess) {
        serverProcess.removeAllListeners("exit");
        serverProcess.kill();
      }
    }
  },
  { timeout: 30000 }
);

describe("GET /api/profile date filter - authentication", () => {
  it("should_return_401_without_token_when_date_params_are_present", async () => {
    const res = await getProfile("?startDate=2026-01-01", null);
    assert.equal(res.status, 401);
  });

  it("should_return_401_without_token_and_no_params", async () => {
    const res = await getProfile("", null);
    assert.equal(res.status, 401);
  });

  it("should_return_401_for_invalid_token_with_date_params", async () => {
    const res = await getProfile("?startDate=2026-01-01&endDate=2026-12-31", "not-a-real-token");
    assert.equal(res.status, 401);
  });
});

describe("GET /api/profile date filter - no params (unchanged behavior)", () => {
  it("should_return_all_expenses_and_unchanged_shape_when_no_params", async () => {
    const body = await getOk("");
    assert.deepEqual(Object.keys(body).sort(), ["categoryBreakdown", "summary", "transactions", "user"]);
    assert.deepEqual(Object.keys(body.user).sort(), ["email", "memberSince", "name"]);
    assert.deepEqual(Object.keys(body.summary).sort(), ["topCategory", "totalSpent", "transactionCount"]);
    assert.equal(body.user.email, users.owner.email);
    assert.equal(body.summary.totalSpent, 155);
    assert.equal(body.summary.transactionCount, 5);
    assert.equal(body.summary.topCategory, "Shopping");
    assert.equal(body.transactions.length, 5);
    for (const key of ["date", "description", "category", "amount"]) {
      assert.ok(key in body.transactions[0], `transaction should have ${key}`);
    }
    for (const key of ["name", "amount", "pct"]) {
      assert.ok(key in body.categoryBreakdown[0], `category row should have ${key}`);
    }
  });

  it("should_not_expose_password_data_in_profile_response", async () => {
    const res = await getProfile("?startDate=2026-03-01");
    const text = await res.text();
    assert.ok(!/passwordHash/i.test(text), "response must not contain passwordHash");
    assert.ok(!text.includes(password), "response must not contain the password");
  });
});

describe("GET /api/profile date filter - happy paths", () => {
  it("should_include_both_boundary_days_for_start_and_end_range", async () => {
    const body = await getOk("?startDate=2026-03-01&endDate=2026-03-31");
    assert.deepEqual(descriptions(body), ["end-late-night", "mid-month", "start-midnight"]);
    assert.equal(body.summary.totalSpent, 70);
    assert.equal(body.summary.transactionCount, 3);
    assert.equal(body.summary.topCategory, "Bills");
  });

  it("should_include_expense_late_on_end_date_and_exclude_next_day_midnight", async () => {
    const body = await getOk("?endDate=2026-03-31");
    assert.ok(descriptions(body).includes("end-late-night"), "23:59:59.999Z on end date must be included");
    assert.ok(!descriptions(body).includes("after-range"), "00:00:00Z the next day must be excluded");
  });

  it("should_exclude_expense_just_before_start_midnight", async () => {
    const body = await getOk("?startDate=2026-03-01&endDate=2026-03-31");
    assert.ok(!descriptions(body).includes("before-range"));
    assert.ok(descriptions(body).includes("start-midnight"), "00:00:00Z on start date must be included");
  });

  it("should_filter_on_or_after_start_date_when_only_start_date_given", async () => {
    const body = await getOk("?startDate=2026-03-15");
    assert.deepEqual(descriptions(body), ["after-range", "end-late-night", "mid-month"]);
    assert.equal(body.summary.totalSpent, 140);
    assert.equal(body.summary.transactionCount, 3);
    assert.equal(body.summary.topCategory, "Shopping");
  });

  it("should_filter_on_or_before_end_date_when_only_end_date_given", async () => {
    const body = await getOk("?endDate=2026-03-15");
    assert.deepEqual(descriptions(body), ["mid-month", "start-midnight", "before-range"]);
    assert.equal(body.summary.totalSpent, 35);
    assert.equal(body.summary.transactionCount, 3);
    assert.equal(body.summary.topCategory, "Transport");
  });

  it("should_return_only_that_day_for_same_day_range_at_end_of_day", async () => {
    const body = await getOk("?startDate=2026-03-31&endDate=2026-03-31");
    assert.deepEqual(descriptions(body), ["end-late-night"]);
    assert.equal(body.summary.totalSpent, 40);
    assert.equal(body.summary.transactionCount, 1);
  });

  it("should_return_only_that_day_for_same_day_range_at_start_of_day", async () => {
    const body = await getOk("?startDate=2026-03-01&endDate=2026-03-01");
    assert.deepEqual(descriptions(body), ["start-midnight"]);
    assert.equal(body.summary.totalSpent, 10);
  });

  it("should_accept_leap_day_2024_02_29", async () => {
    const res = await getProfile("?startDate=2024-02-29&endDate=2024-02-29");
    assert.equal(res.status, 200);
  });

  it("should_compute_category_breakdown_from_filtered_expenses_only", async () => {
    const body = await getOk("?startDate=2026-03-01&endDate=2026-03-31");
    const byName = Object.fromEntries(body.categoryBreakdown.map((c) => [c.name, c]));
    assert.deepEqual(Object.keys(byName).sort(), ["Bills", "Food", "Transport"]);
    assert.equal(byName.Bills.amount, 40);
    assert.equal(byName.Transport.amount, 20);
    assert.equal(byName.Food.amount, 10);
    assert.equal(byName.Bills.pct, Math.round((40 / 70) * 100));
    assert.equal(byName.Food.pct, Math.round((10 / 70) * 100));
    assert.deepEqual(
      body.categoryBreakdown.map((c) => c.name),
      ["Bills", "Transport", "Food"],
      "categories sorted by amount descending"
    );
  });

  it("should_return_transactions_newest_first", async () => {
    const body = await getOk("?startDate=2026-03-01&endDate=2026-04-01");
    const times = body.transactions.map((t) => new Date(t.date).getTime());
    assert.deepEqual(times, [...times].sort((a, b) => b - a));
    assert.equal(body.transactions.length, 4);
  });

  it("should_not_change_user_info_when_filter_applied", async () => {
    const unfiltered = await getOk("");
    const filtered = await getOk("?startDate=2030-01-01&endDate=2030-01-31");
    assert.deepEqual(filtered.user, unfiltered.user);
    assert.equal(filtered.user.name, "Step06 owner");
    assert.ok(filtered.user.memberSince, "memberSince is still present");
  });
});

describe("GET /api/profile date filter - empty states", () => {
  it("should_return_empty_state_values_when_range_has_no_expenses", async () => {
    const body = await getOk("?startDate=2025-01-01&endDate=2025-01-31");
    assert.equal(body.summary.totalSpent, 0);
    assert.equal(body.summary.transactionCount, 0);
    assert.equal(body.summary.topCategory, "—");
    assert.deepEqual(body.transactions, []);
    assert.deepEqual(body.categoryBreakdown, []);
  });

  it("should_return_empty_state_for_start_date_after_all_expenses", async () => {
    const body = await getOk("?startDate=2027-01-01");
    assert.equal(body.summary.transactionCount, 0);
    assert.deepEqual(body.transactions, []);
  });

  it("should_return_empty_state_for_user_with_no_expenses_with_and_without_filter", async () => {
    for (const query of ["", "?startDate=2026-01-01&endDate=2026-12-31"]) {
      const body = await getOk(query, users.empty.token);
      assert.equal(body.summary.totalSpent, 0);
      assert.equal(body.summary.transactionCount, 0);
      assert.equal(body.summary.topCategory, "—");
      assert.deepEqual(body.transactions, []);
      assert.deepEqual(body.categoryBreakdown, []);
    }
  });
});

describe("GET /api/profile date filter - validation", () => {
  const badFormats = [
    ["month_13", "?startDate=2026-13-01"],
    ["non_date_text", "?startDate=abc"],
    ["feb_30", "?startDate=2026-02-30"],
    ["feb_29_non_leap_year", "?endDate=2025-02-29"],
    ["day_32", "?endDate=2026-01-32"],
    ["day_zero", "?startDate=2026-01-00"],
    ["no_zero_padding", "?startDate=2026-3-1"],
    ["slash_separators", "?startDate=2026/03/01"],
    ["datetime_string", "?startDate=2026-03-01T00:00:00Z"],
    ["bad_end_date", "?endDate=not-a-date"],
    ["valid_start_with_bad_end", "?startDate=2026-03-01&endDate=2026-02-30"],
    ["object_injection_start_gt", "?startDate[$gt]=x"],
    ["object_injection_end_ne", "?endDate[$ne]=x"],
    ["object_injection_valid_date_value", "?startDate[$gt]=2026-01-01"],
    ["array_start_date", "?startDate=2026-03-01&startDate=2026-03-02"],
    ["array_bracket_end_date", "?endDate[]=2026-03-01"],
  ];

  for (const [name, query] of badFormats) {
    it(`should_return_400_format_message_for_${name}`, async () => {
      const res = await getProfile(query);
      assert.equal(res.status, 400, `expected 400 for ${query}`);
      const body = await res.json();
      assert.equal(body.message, FORMAT_MESSAGE);
    });
  }

  it("should_return_400_when_start_date_is_after_end_date", async () => {
    const res = await getProfile("?startDate=2026-04-01&endDate=2026-03-31");
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.equal(body.message, ORDER_MESSAGE);
  });

  it("should_not_reject_start_date_one_day_before_end_date_or_equal", async () => {
    assert.equal((await getProfile("?startDate=2026-03-30&endDate=2026-03-31")).status, 200);
    assert.equal((await getProfile("?startDate=2026-03-31&endDate=2026-03-31")).status, 200);
  });
});

describe("GET /api/profile date filter - user isolation", () => {
  it("should_never_include_other_users_expenses_in_filtered_results", async () => {
    const body = await getOk("?startDate=2026-03-01&endDate=2026-03-31");
    assert.ok(!descriptions(body).includes("other-user-march"));
    assert.equal(body.summary.totalSpent, 70);
  });

  it("should_never_include_other_users_expenses_for_open_ended_ranges", async () => {
    for (const query of ["?startDate=2020-01-01", "?endDate=2030-01-01", ""]) {
      const body = await getOk(query);
      const found = descriptions(body).filter((d) => d.startsWith("other-user"));
      assert.deepEqual(found, [], `owner must not see other user's expenses for "${query}"`);
      assert.ok(!body.categoryBreakdown.some((c) => c.name === "Health" || c.name === "Other"));
    }
  });

  it("should_return_each_users_own_filtered_data", async () => {
    const body = await getOk("?startDate=2026-03-01&endDate=2026-03-31", users.other.token);
    assert.equal(body.user.email, users.other.email);
    assert.deepEqual(descriptions(body), ["other-user-march"]);
    assert.equal(body.summary.totalSpent, 999);
  });
});
