import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { getSummaryStats } from "../utils/summaryStats.js";
import { getRecentTransactions } from "../utils/transactionHistory.js";
import { getCategoryBreakdown } from "../utils/categoryBreakdown.js";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const oneDayMs = 24 * 60 * 60 * 1000;

// "2026-03-01" → Date at 2026-03-01T00:00:00Z, or null if it is not a real YYYY-MM-DD date.
// Only plain strings are accepted, which also blocks query objects like startDate[$gt]=x.
function parseDateParam(value) {
  if (typeof value !== "string" || !datePattern.test(value)) return null;

  const date = new Date(`${value}T00:00:00Z`);
  // Rejects dates that roll over, like 2026-02-30 → 2026-03-02
  if (isNaN(date) || date.toISOString().slice(0, 10) !== value) return null;

  return date;
}

// GET /api/profile?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD (both optional)
export async function getProfile(req, res) {
  const { startDate, endDate } = req.query;
  // undefined = date not sent (no limit on that side), null = sent but invalid
  const start = startDate === undefined ? undefined : parseDateParam(startDate);
  const end = endDate === undefined ? undefined : parseDateParam(endDate);

  if (start === null || end === null) {
    return res.status(400).json({ message: "Dates must be in YYYY-MM-DD format" });
  }
  if (start && end && start > end) {
    return res.status(400).json({ message: "Start date must be on or before end date" });
  }

  const expenseQuery = { userId: req.userId };
  if (start || end) {
    expenseQuery.date = {};
    if (start) expenseQuery.date.$gte = start;
    // Include the whole end day by stopping just before the next day starts
    if (end) expenseQuery.date.$lt = new Date(end.getTime() + oneDayMs);
  }

  try {
    const user = await User.findById(req.userId).select("name email createdAt");
    if (!user) {
      return res.status(401).json({ message: "Not authorized. Please sign in." });
    }

    const expenses = await Expense.find(expenseQuery).lean();

    return res.status(200).json({
      user: { name: user.name, email: user.email, memberSince: user.createdAt },
      summary: getSummaryStats(expenses),
      transactions: getRecentTransactions(expenses),
      categoryBreakdown: getCategoryBreakdown(expenses),
    });
  } catch (error) {
    console.error("Loading profile failed:", error.message);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
