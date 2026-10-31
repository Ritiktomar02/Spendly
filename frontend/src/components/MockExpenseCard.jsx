// This is the decorative mock expense chart card shown on the landing page hero.
// It's purely visual — no real data, just like the original Flask landing.html.
function MockExpenseCard() {
  // The bar data mirrors the original landing.html mock data
  const bars = [
    { label: "Bills",     width: "72%", color: "bg-accent",   amount: "₹4,500" },
    { label: "Food",      width: "52%", color: "bg-accent-2", amount: "₹3,200" },
    { label: "Health",    width: "33%", color: "bg-[#5b7fa6]", amount: "₹2,050" },
    { label: "Transport", width: "28%", color: "bg-[#8b5e83]", amount: "₹1,800" },
  ];

  return (
    <div className="bg-paper-card border border-border rounded-lg p-8 w-full max-w-[380px] shadow-[0_8px_40px_rgba(0,0,0,0.06)]">

      {/* Card header */}
      <div className="flex justify-between items-baseline mb-7 pb-5 border-b border-border-soft">
        <span className="text-[0.8rem] font-medium text-ink-muted uppercase tracking-wide">
          March 2026
        </span>
        <span className="font-display text-[1.75rem] text-ink">₹12,450</span>
      </div>

      {/* Category bars */}
      <div className="flex flex-col gap-4">
        {bars.map((bar) => (
          <div key={bar.label} className="grid grid-cols-[80px_1fr_60px] items-center gap-3">
            <span className="text-[0.8rem] font-medium text-ink-soft">{bar.label}</span>

            {/* Track */}
            <div className="h-[6px] bg-border-soft rounded-full overflow-hidden">
              {/* Filled portion */}
              <div
                className={`h-full ${bar.color} rounded-full`}
                style={{ width: bar.width }}
              />
            </div>

            <span className="text-[0.8rem] font-medium text-ink-muted text-right">
              {bar.amount}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default MockExpenseCard;

