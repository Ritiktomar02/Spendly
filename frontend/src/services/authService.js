const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Create a new account. Throws an Error with the server's message on failure.
export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  // Fall back to an empty object if the response is not JSON
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

const TOKEN_KEY = "spendlyToken";
const USER_KEY = "spendlyUser";

// Sign in and remember the token and user. Throws an Error with the server's message on failure.
export async function loginUser({ email, password }) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));

  return data.user;
}

// Return the saved user, or null if there isn't a valid one
export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

// Forget the saved token and user
export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
