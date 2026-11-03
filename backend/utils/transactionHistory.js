// Returns the most recent expenses (newest date first) shaped for the profile page.
export function getRecentTransactions(expenses, limit = 5) {
  // Copy the array so the original order is not changed
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return sortedExpenses.slice(0, limit).map((expense) => ({
    date: expense.date,
    description: expense.description || "",
    category: expense.category,
    amount: expense.amount,
  }));
}
