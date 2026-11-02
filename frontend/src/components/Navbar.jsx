import { Link, useNavigate } from "react-router-dom";

// Navbar appears on every page via App.jsx
// Logged out: Sign in + Get started. Logged in: user's name + Sign out
function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  function handleSignOut() {
    onLogout();
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-50 bg-paper border-b border-border px-8">
      <div className="max-w-content mx-auto h-[60px] flex items-center justify-between">

        {/* Brand logo */}
        <Link to="/" className="flex items-center gap-2 font-body font-semibold text-[1.1rem] text-ink">
          <span className="text-accent text-[1.3rem]">◈</span>
          <span>Spendly</span>
        </Link>

        {/* Navigation links */}
        <div className="flex items-center gap-6 text-[0.9rem] font-medium">
          {user ? (
            <>
              <span className="text-ink-muted">{user.name}</span>
              <button
                type="button"
                onClick={handleSignOut}
                className="bg-ink text-paper px-[1.1rem] py-[0.45rem] rounded-sm font-medium cursor-pointer hover:bg-accent transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-ink-muted hover:text-ink transition-colors">
                Sign in
              </Link>
              <Link
                to="/register"
                className="bg-ink text-paper px-[1.1rem] py-[0.45rem] rounded-sm hover:bg-accent transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
