import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService.js";

// Register page — creates an account, then sends the user to the login page
function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await registerUser({ name, email, password });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      // fetch throws a TypeError when the server can't be reached
      if (err instanceof TypeError) {
        setError("Could not reach the server. Please try again.");
      } else {
        setError(err.message);
      }
      setIsSubmitting(false);
    }
  }

  return (
    <section className="min-h-[calc(100vh-60px-100px)] flex items-center justify-center py-12 px-8">
      <div className="w-full max-w-auth">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-[2rem] text-ink mb-2">Create your account</h1>
          <p className="text-[0.9rem] text-ink-muted">Start tracking your expenses today</p>
        </div>

        {/* Form card */}
        <div className="bg-paper-card border border-border rounded-md p-8 mb-6">
          {error && (
            <p role="alert" className="mb-5 px-[0.875rem] py-[0.6rem] rounded-sm bg-danger-light text-danger text-[0.85rem]">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="name" className="block text-[0.85rem] font-medium text-ink-soft mb-1">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nitish Kumar"
                required
                autoFocus
                className="w-full px-[0.875rem] py-[0.6rem] border border-border rounded-sm font-body text-[0.95rem] text-ink bg-paper outline-none focus:border-accent transition-colors placeholder:text-ink-faint"
              />
            </div>

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
                placeholder="Min. 8 characters"
                required
                className="w-full px-[0.875rem] py-[0.6rem] border border-border rounded-sm font-body text-[0.95rem] text-ink bg-paper outline-none focus:border-accent transition-colors placeholder:text-ink-faint"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-[0.7rem] mt-2 bg-ink text-paper rounded-sm font-body text-[0.95rem] font-medium cursor-pointer hover:bg-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        {/* Switch to login */}
        <p className="text-center text-[0.875rem] text-ink-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </section>
  );
}

export default RegisterPage;
