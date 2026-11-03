import User from "../models/User.js";
import Expense from "../models/Expense.js";
import { getSummaryStats } from "../utils/summaryStats.js";
import { getRecentTransactions } from "../utils/transactionHistory.js";
import { getCategoryBreakdown } from "../utils/categoryBreakdown.js";

// GET /api/profile
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.userId).select("name email createdAt");
    if (!user) {
      return res.status(401).json({ message: "Not authorized. Please sign in." });
    }

    const expenses = await Expense.find({ userId: req.userId }).lean();

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
