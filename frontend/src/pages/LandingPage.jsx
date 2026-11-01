import { Link } from "react-router-dom";

// Static dashboard mock shown under the hero CTAs
const previewStats = [
  { label: "This month", value: "₹18,240", note: "+12% vs last", noteClass: "text-[#e04848]" },
  { label: "Budget left", value: "₹6,760", note: "43% remaining", noteClass: "text-[#1a9b6c]" },
  { label: "Transactions", value: "34", note: "this month", noteClass: "text-ink-faint" },
];

const previewBars = [
  { label: "Food", width: "72%", color: "bg-[#f0a02c]" },
  { label: "Travel", width: "48%", color: "bg-[#3b86de]" },
  { label: "Bills", width: "38%", color: "bg-[#7f72d9]" },
];

function HeroPreview() {
  return (
    <div className="w-full max-w-[1000px] bg-paper border border-border rounded-lg p-4 sm:p-7 text-left">
      {/* Window dots */}
      <div className="flex gap-2 mb-5">
        <span className="w-4 h-4 rounded-full bg-[#ef8f8f]" />
        <span className="w-4 h-4 rounded-full bg-[#f7c55f]" />
        <span className="w-4 h-4 rounded-full bg-[#a0ddc5]" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {previewStats.map((stat) => (
          <div key={stat.label} className="bg-paper-card border border-border rounded-md px-7 py-6">
            <p className="text-[1rem] text-ink-muted mb-2">{stat.label}</p>
            <p className="text-[1.9rem] font-medium text-ink leading-tight mb-1">{stat.value}</p>
            <p className={`text-[1rem] ${stat.noteClass}`}>{stat.note}</p>
          </div>
        ))}
      </div>

      {/* Category bars */}
      <div className="bg-paper-card border border-border rounded-md px-5 sm:px-7 py-6 flex flex-col gap-4">
        {previewBars.map((bar) => (
          <div key={bar.label} className="flex items-center gap-4 sm:gap-6">
            <span className="w-14 sm:w-16 text-center text-[1rem] sm:text-[1.1rem] text-ink-soft">{bar.label}</span>
            <div className="flex-1 h-3 bg-paper-warm rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${bar.color}`} style={{ width: bar.width }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Landing page — mirrors the original landing.html exactly:
// Hero section → Features section → CTA section
function LandingPage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero Section                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-paper-card pt-16 md:pt-20 pb-16 md:pb-20 px-4 sm:px-8">
        <div className="max-w-content mx-auto flex flex-col items-center text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#e8f6ef] border border-[#bfe5d2] text-[#17855c] text-[0.85rem] sm:text-[1rem] font-medium px-5 py-[0.45rem] rounded-full mb-10">
            <span className="w-2 h-2 rounded-full bg-[#1a9b6c]" />
            Free to use · No credit card needed
          </div>

          {/* Headline */}
          <h1 className="font-body font-semibold text-[clamp(2.4rem,6.5vw,4.4rem)] leading-[1.12] tracking-[-0.03em] text-ink mb-8">
            Track every rupee.<br />
            <span className="text-[#1a9b6c]">Know where it goes.</span>
          </h1>

          {/* Subheading */}
          <p className="text-[1.05rem] sm:text-[1.3rem] text-ink-muted leading-[1.7] max-w-[620px] mb-12">
            Spendly helps you log expenses, spot patterns, and stay on budget —
            without the spreadsheet headache.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch sm:items-center w-full sm:w-auto mb-16 md:mb-20">
            <Link
              to="/register"
              className="inline-block bg-ink text-paper px-10 py-[1.05rem] rounded-[10px] text-[1.1rem] font-semibold hover:bg-accent transition-colors"
            >
              Create free account
            </Link>
            <a
              href="#features"
              className="inline-block bg-ink text-paper px-10 py-[1.05rem] rounded-[10px] text-[1.1rem] font-semibold hover:bg-accent transition-colors"
            >
              See how it works
            </a>
          </div>

          {/* Dashboard preview */}
          <HeroPreview />

        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Features Section                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section id="features" className="bg-paper-warm border-t border-b border-border py-20 px-8">
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

