import { getStoredToken } from "./authService.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// Load the logged-in user's profile data, optionally limited to a date range
// ("YYYY-MM-DD" strings). Throws an Error (with .status) on failure.
export async function getProfile({ startDate, endDate } = {}) {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const query = params.toString();
  const url = `${API_URL}/api/profile${query ? `?${query}` : ""}`;

  const response = await fetch(url, {
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
