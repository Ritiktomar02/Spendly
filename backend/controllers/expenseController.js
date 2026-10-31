import Expense from "../models/Expense.js";

// GET /api/expenses
// Returns all expenses for the logged-in user, newest first
async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find({ userId: req.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Could not fetch expenses" });
  }
}

// POST /api/expenses
// Create a new expense for the logged-in user
async function createExpense(req, res) {
  const { amount, category, description, date } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ message: "Amount and category are required" });
  }

  try {
    const expense = await Expense.create({
      userId: req.userId,
      amount,
      category,
      description: description || "",
      date: date || Date.now(),
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Create expense error:", error);
    res.status(500).json({ message: "Could not create expense" });
  }
}

// PUT /api/expenses/:id
// Update an existing expense (only if it belongs to the logged-in user)
async function updateExpense(req, res) {
  const { amount, category, description, date } = req.body;

  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.userId });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    expense.amount = amount ?? expense.amount;
    expense.category = category ?? expense.category;
    expense.description = description ?? expense.description;
    expense.date = date ?? expense.date;

    const updated = await expense.save();
    res.json(updated);
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({ message: "Could not update expense" });
  }
}

// DELETE /api/expenses/:id
// Delete an expense (only if it belongs to the logged-in user)
async function deleteExpense(req, res) {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({ message: "Could not delete expense" });
  }
}

export { getExpenses, createExpense, updateExpense, deleteExpense };

