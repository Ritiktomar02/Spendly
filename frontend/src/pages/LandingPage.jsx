import { Link } from "react-router-dom";
import MockExpenseCard from "../components/MockExpenseCard.jsx";

// Landing page — mirrors the original landing.html exactly:
// Hero section → Features section → CTA section
function LandingPage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero Section                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-content mx-auto">

        {/* Left: text */}
        <div>
          <div className="inline-block bg-accent-light text-accent text-[0.75rem] font-semibold uppercase tracking-[0.08em] px-[0.85rem] py-[0.35rem] rounded-full mb-6">
            Personal Finance Tracker
          </div>

          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] text-ink mb-5">
            Know where your<br />
            <em className="italic text-accent">money goes</em>
          </h1>

          <p className="text-[1.05rem] text-ink-muted leading-[1.7] max-w-[460px] mb-8">
            Log expenses, understand your spending patterns, and take control of
            your financial life — one transaction at a time.
          </p>

          <div className="flex gap-4 items-center">
            <Link
              to="/register"
              className="inline-block bg-ink text-paper px-6 py-[0.65rem] rounded-sm text-[0.9rem] font-medium hover:bg-accent transition-colors"
            >
              Start tracking free
            </Link>
            <Link
              to="/login"
              className="inline-block bg-transparent text-ink-soft px-6 py-[0.65rem] rounded-sm text-[0.9rem] font-medium border border-border hover:border-ink hover:text-ink transition-all"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* Right: mock expense card — hidden on small screens */}
        <div className="hidden md:flex justify-center">
          <MockExpenseCard />
        </div>

      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Features Section                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-paper-warm border-t border-b border-border py-20 px-8">
        <div className="max-w-content mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-paper-card border border-border rounded-md p-8">
            <div className="text-accent text-[1.5rem] font-bold mb-4">₹</div>
            <h3 className="font-display text-[1.2rem] text-ink mb-3">Log expenses instantly</h3>
            <p className="text-[0.9rem] text-ink-muted leading-[1.7]">
              Add any expense in seconds. Category, amount, date, description — all in one simple form.
            </p>
          </div>

          <div className="bg-paper-card border border-border rounded-md p-8">
            <div className="text-accent text-[1.5rem] font-bold mb-4">◎</div>
            <h3 className="font-display text-[1.2rem] text-ink mb-3">Understand your patterns</h3>
            <p className="text-[0.9rem] text-ink-muted leading-[1.7]">
              See exactly where your money goes with category breakdowns and monthly summaries.
            </p>
          </div>

          <div className="bg-paper-card border border-border rounded-md p-8">
            <div className="text-accent text-[1.5rem] font-bold mb-4">◷</div>
            <h3 className="font-display text-[1.2rem] text-ink mb-3">Filter by time period</h3>
            <p className="text-[0.9rem] text-ink-muted leading-[1.7]">
              View your spending for any date range — last week, last month, or a custom period.
            </p>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA Section                                                         */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 px-8 text-center">
        <div className="max-w-[560px] mx-auto">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] text-ink mb-4">
            Ready to take control?
          </h2>
          <p className="text-[1rem] text-ink-muted mb-8">
            Join thousands of people who track their expenses with Spendly.
          </p>
          <Link
            to="/register"
            className="inline-block bg-ink text-paper px-6 py-[0.65rem] rounded-sm text-[0.9rem] font-medium hover:bg-accent transition-colors"
          >
            Create free account
          </Link>
        </div>
      </section>
    </>
  );
}

export default LandingPage;

