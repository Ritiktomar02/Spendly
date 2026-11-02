import { useState } from "react";
import { Link } from "react-router-dom";

// Register page — form UI only
// Authentication will be implemented in a later step
function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Authentication coming in a later step
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
              className="w-full py-[0.7rem] mt-2 bg-ink text-paper rounded-sm font-body text-[0.95rem] font-medium cursor-pointer hover:bg-accent transition-colors"
            >
              Create account
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
