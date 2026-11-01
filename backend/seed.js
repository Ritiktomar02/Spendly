import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Expense from "./models/Expense.js";

// Seeds a demo user and sample expenses. Run with: npm run seed
// Safe to re-run: only the demo user and their expenses are replaced.

dotenv.config();

const demoUser = {
  name: "Demo User",
  email: "demo@spendly.com",
  password: "demo1234",
};

const sampleExpenses = [
  { amount: 450, category: "Food", date: "2026-10-03", description: "Groceries" },
  { amount: 120, category: "Transport", date: "2026-10-05", description: "Metro card recharge" },
  { amount: 1800, category: "Bills", date: "2026-10-07", description: "Electricity bill" },
  { amount: 650, category: "Health", date: "2026-10-10", description: "Pharmacy" },
  { amount: 399, category: "Entertainment", date: "2026-10-14", description: "Movie tickets" },
  { amount: 2200, category: "Shopping", date: "2026-10-18", description: "New shoes" },
  { amount: 280, category: "Food", date: "2026-10-22", description: "Dinner with friends" },
  { amount: 150, category: "Other", date: "2026-10-26", description: "Gift wrapping" },
];

async function seed() {
  await connectDB();

  // Remove any previous demo data so the script can be run again
  const existingUser = await User.findOne({ email: demoUser.email });
  if (existingUser) {
    await Expense.deleteMany({ userId: existingUser._id });
    await User.deleteOne({ _id: existingUser._id });
  }

  const passwordHash = await bcrypt.hash(demoUser.password, 10);
  const user = await User.create({
    name: demoUser.name,
    email: demoUser.email,
    passwordHash,
  });

  const expenses = sampleExpenses.map((expense) => ({ ...expense, userId: user._id }));
  await Expense.insertMany(expenses);

  console.log(`Seeded demo user ${demoUser.email} with ${expenses.length} expenses`);
}

try {
  await seed();
} catch (error) {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
