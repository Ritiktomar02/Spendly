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
