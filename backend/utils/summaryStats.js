// Calculates profile summary stats (total spent, count, top category) from a list of expenses.
export function getSummaryStats(expenses) {
  let totalSpent = 0;
  const categoryTotals = {};

  for (const expense of expenses) {
    totalSpent += expense.amount;
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  }

  let topCategory = "—";
  let topAmount = 0;

  for (const [category, amount] of Object.entries(categoryTotals)) {
    if (topCategory === "—" || amount > topAmount) {
      topCategory = category;
      topAmount = amount;
    }
  }

  return { totalSpent, transactionCount: expenses.length, topCategory };
}
