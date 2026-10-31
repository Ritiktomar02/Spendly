import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService.js";

// Login page — mirrors login.html exactly
// On success: saves token + user to localStorage, redirects to /dashboard
function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      // Save JWT and user info for use across the app
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-60px-100px)] flex items-center justify-center py-12 px-8">
      <div className="w-full max-w-auth">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-[2rem] text-ink mb-2">Welcome back</h1>
          <p className="text-[0.9rem] text-ink-muted">Sign in to your Spendly account</p>
        </div>

        {/* Form card */}
        <div className="bg-paper-card border border-border rounded-md p-8 mb-6">

          {/* Error message — only shown when there is an error */}
          {error && (
            <div className="bg-danger-light text-danger border border-[#f5c6c2] rounded-sm px-4 py-3 text-[0.875rem] mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block text-[0.85rem] font-medium text-ink-soft mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nitish@example.com"
                required
                autoFocus
                className="w-full px-[0.875rem] py-[0.6rem] border border-border rounded-sm font-body text-[0.95rem] text-ink bg-paper outline-none focus:border-accent transition-colors placeholder:text-ink-faint"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block text-[0.85rem] font-medium text-ink-soft mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full px-[0.875rem] py-[0.6rem] border border-border rounded-sm font-body text-[0.95rem] text-ink bg-paper outline-none focus:border-accent transition-colors placeholder:text-ink-faint"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-[0.7rem] mt-2 bg-ink text-paper rounded-sm font-body text-[0.95rem] font-medium cursor-pointer hover:bg-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        {/* Switch to register */}
        <p className="text-center text-[0.875rem] text-ink-muted">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent font-medium hover:underline">
            Create one free
          </Link>
        </p>

      </div>
    </section>
  );
}

export default LoginPage;

