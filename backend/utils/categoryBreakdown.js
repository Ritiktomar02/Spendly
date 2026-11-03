// Groups expenses by category and returns each category's total and its
// share of overall spending, sorted from highest to lowest amount.
export function getCategoryBreakdown(expenses) {
  const totalsByCategory = {};
  let overallTotal = 0;

  for (const expense of expenses) {
    const amount = Number(expense.amount) || 0;
    totalsByCategory[expense.category] =
      (totalsByCategory[expense.category] || 0) + amount;
    overallTotal += amount;
  }

  const breakdown = Object.entries(totalsByCategory).map(([name, amount]) => ({
    name,
    amount,
    pct: overallTotal > 0 ? Math.round((amount / overallTotal) * 100) : 0,
  }));

  breakdown.sort((a, b) => b.amount - a.amount);

  return breakdown;
}
