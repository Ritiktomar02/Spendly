import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getExpenses, createExpense, deleteExpense } from "../services/expenseService.js";

// The main dashboard page — only accessible when logged in.
// Shows the user's expenses, lets them add and delete expenses.
function DashboardPage() {
  const navigate = useNavigate();

  // Read the logged-in user's name from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state for adding a new expense
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0], // default to today
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Load expenses when the page first mounts
  useEffect(() => {
    loadExpenses();
  }, []);

  async function loadExpenses() {
    setLoading(true);
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      // If token is invalid or expired, redirect to login
      if (err.message.includes("authorized")) {
        navigate("/login");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAddExpense(e) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const newExpense = await createExpense({
        ...formData,
        amount: parseFloat(formData.amount),
      });

      // Add the new expense to the top of the list
      setExpenses([newExpense, ...expenses]);

      // Reset form
      setFormData({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0] });
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  // Calculate total spending
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Format a number as Indian Rupees
  function formatRupees(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
  }

  // Format a date string nicely
  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="max-w-content mx-auto px-8 py-10">

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-[2rem] text-ink">
            Hello, {user?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-[0.9rem] text-ink-muted mt-1">
            Here's your spending overview.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-ink text-paper px-5 py-2 rounded-sm text-[0.9rem] font-medium hover:bg-accent transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Expense"}
        </button>
      </div>

      {/* Total spending card */}
      <div className="bg-paper-card border border-border rounded-md p-6 mb-6 flex items-baseline gap-4">
        <span className="text-[0.85rem] font-medium text-ink-muted uppercase tracking-wide">
          Total spent
        </span>
        <span className="font-display text-[2.5rem] text-ink">{formatRupees(total)}</span>
        <span className="text-[0.85rem] text-ink-faint">{expenses.length} expenses</span>
      </div>

      {/* Add expense form */}
      {showForm && (
        <div className="bg-paper-card border border-border rounded-md p-6 mb-6">
          <h2 className="font-display text-[1.3rem] text-ink mb-4">Add new expense</h2>

          {formError && (
            <div className="bg-danger-light text-danger border border-[#f5c6c2] rounded-sm px-4 py-3 text-[0.875rem] mb-4">
              {formError}
            </div>
          )}

          <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-[0.85rem] font-medium text-ink-soft mb-1">
                Amount (₹)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="500"
                required
                className="w-full px-[0.875rem] py-[0.6rem] border border-border rounded-sm font-body text-[0.95rem] text-ink bg-paper outline-none focus:border-accent transition-colors placeholder:text-ink-faint"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[0.85rem] font-medium text-ink-soft mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-[0.875rem] py-[0.6rem] border border-border rounded-sm font-body text-[0.95rem] text-ink bg-paper outline-none focus:border-accent transition-colors"
              >
                {["Food", "Bills", "Transport", "Health", "Shopping", "Entertainment", "Other"].map(
                  (cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  )
                )}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[0.85rem] font-medium text-ink-soft mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-[0.875rem] py-[0.6rem] border border-border rounded-sm font-body text-[0.95rem] text-ink bg-paper outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[0.85rem] font-medium text-ink-soft mb-1">
                Description (optional)
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Lunch at canteen"
                className="w-full px-[0.875rem] py-[0.6rem] border border-border rounded-sm font-body text-[0.95rem] text-ink bg-paper outline-none focus:border-accent transition-colors placeholder:text-ink-faint"
              />
            </div>

            {/* Submit button — spans both columns */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={formLoading}
                className="bg-accent text-paper px-6 py-[0.7rem] rounded-sm text-[0.95rem] font-medium hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {formLoading ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses list */}
      {loading ? (
        <p className="text-ink-muted text-[0.95rem]">Loading expenses...</p>
      ) : error ? (
        <p className="text-danger text-[0.95rem]">{error}</p>
      ) : expenses.length === 0 ? (
        <div className="text-center py-16 text-ink-muted">
          <p className="text-[1.1rem] mb-2">No expenses yet.</p>
          <p className="text-[0.9rem]">Click "+ Add Expense" to log your first one.</p>
        </div>
      ) : (
        <div className="bg-paper-card border border-border rounded-md overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-6 py-3 bg-paper-warm border-b border-border text-[0.8rem] font-semibold text-ink-muted uppercase tracking-wide">
            <span>Description</span>
            <span>Category</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Expense rows */}
          {expenses.map((expense) => (
            <div
              key={expense._id}
              className="grid grid-cols-[1fr_120px_120px_80px] gap-4 px-6 py-4 border-b border-border-soft last:border-0 items-center hover:bg-paper transition-colors"
            >
              <div>
                <span className="text-[0.95rem] text-ink">
                  {expense.description || "—"}
                </span>
              </div>

              <span className="inline-block bg-accent-light text-accent text-[0.75rem] font-medium px-2 py-1 rounded-full w-fit">
                {expense.category}
              </span>

              <span className="text-[0.875rem] text-ink-muted">
                {formatDate(expense.date)}
              </span>

              <div className="flex items-center justify-end gap-3">
                <span className="text-[0.95rem] font-medium text-ink">
                  {formatRupees(expense.amount)}
                </span>
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="text-ink-faint hover:text-danger transition-colors text-[0.8rem]"
                  title="Delete expense"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default DashboardPage;

