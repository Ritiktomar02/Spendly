// Base URL for all expense API calls
const API_BASE = "http://localhost:5001/api";

// Helper: read the JWT from localStorage and build the Authorization header
function authHeader() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// GET /api/expenses — fetch all expenses for the logged-in user
async function getExpenses() {
  const response = await fetch(`${API_BASE}/expenses`, {
    headers: authHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not fetch expenses");
  }

  return data;
}

// POST /api/expenses — create a new expense
async function createExpense(expenseData) {
  const response = await fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(expenseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not create expense");
  }

  return data;
}

// PUT /api/expenses/:id — update an existing expense
async function updateExpense(id, expenseData) {
  const response = await fetch(`${API_BASE}/expenses/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(expenseData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not update expense");
  }

  return data;
}

// DELETE /api/expenses/:id — delete an expense
async function deleteExpense(id) {
  const response = await fetch(`${API_BASE}/expenses/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not delete expense");
  }

  return data;
}

export { getExpenses, createExpense, updateExpense, deleteExpense };

