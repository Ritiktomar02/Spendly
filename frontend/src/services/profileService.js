import { getStoredToken } from "./authService.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Load the logged-in user's profile data. Throws an Error (with .status) on failure.
export async function getProfile() {
  const response = await fetch(`${API_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${getStoredToken()}` },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "Could not load your profile");
    error.status = response.status;
    throw error;
  }

  return data;
}
