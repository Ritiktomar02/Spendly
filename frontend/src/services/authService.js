// Base URL for all API calls — points to the Express backend
const API_BASE = "http://localhost:5001/api";

// POST /api/auth/register
// Sends name, email, password — gets back { token, user }
async function registerUser(name, email, password) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw the error message from the server so the form can display it
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

// POST /api/auth/login
// Sends email, password — gets back { token, user }
async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export { registerUser, loginUser };

