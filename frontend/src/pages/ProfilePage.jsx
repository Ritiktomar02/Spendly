// Profile page — design only.
// Name and email come from the logged-in user. Everything else below is
// placeholder data and will be replaced when the backend is connected.

const memberSince = "January 2026";

const summaryStats = [
  { label: "Total spent", value: "₹18,240", note: "this month" },
  { label: "Transactions", value: "24", note: "this month" },
  { label: "Top category", value: "Bills", note: "₹4,500 spent" },
];

const categoryBreakdown = [
  { label: "Bills",     amount: "₹4,500", width: "72%", color: "bg-accent" },
  { label: "Food",      amount: "₹3,200", width: "52%", color: "bg-accent-2" },
  { label: "Health",    amount: "₹2,050", width: "33%", color: "bg-[#5b7fa6]" },
  { label: "Transport", amount: "₹1,800", width: "28%", color: "bg-[#8b5e83]" },
  { label: "Shopping",  amount: "₹1,350", width: "21%", color: "bg-ink-faint" },
];

const recentTransactions = [
  { id: 1, date: "28 Mar 2026", description: "Electricity bill",  category: "Bills",     amount: "₹2,100" },
  { id: 2, date: "26 Mar 2026", description: "Groceries",         category: "Food",      amount: "₹1,240" },
  { id: 3, date: "24 Mar 2026", description: "Metro card top-up", category: "Transport", amount: "₹500" },
  { id: 4, date: "22 Mar 2026", description: "Pharmacy",          category: "Health",    amount: "₹860" },
  { id: 5, date: "20 Mar 2026", description: "New headphones",    category: "Shopping",  amount: "₹1,350" },
];

// "Ritik Tomar" → "RT"
function getInitials(name) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function ProfilePage({ user }) {
  return (
    <section className="px-4 sm:px-8 py-12 md:py-16">
      <div className="max-w-content mx-auto flex flex-col gap-6">

        {/* Profile header */}
        <div className="bg-paper-card border border-border rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-accent-light text-accent font-display text-[1.6rem] flex items-center justify-center">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-[1.75rem] sm:text-[2rem] text-ink leading-tight">
              {user.name}
            </h1>
            <p className="text-ink-muted break-all">{user.email}</p>
            <p className="text-[0.85rem] text-ink-faint mt-1">Member since {memberSince}</p>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryStats.map((stat) => (
            <div key={stat.label} className="bg-paper-card border border-border rounded-md px-6 py-5">
              <p className="text-ink-muted mb-1">{stat.label}</p>
              <p className="text-[1.75rem] font-medium text-ink leading-tight mb-1">{stat.value}</p>
              <p className="text-[0.9rem] text-ink-faint">{stat.note}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6">

          {/* Spending by category */}
          <div className="bg-paper-card border border-border rounded-md p-6 sm:p-8">
            <h2 className="font-display text-[1.2rem] text-ink mb-6">Spending by category</h2>
            <div className="flex flex-col gap-4">
              {categoryBreakdown.map((item) => (
                <div key={item.label} className="grid grid-cols-[80px_1fr_60px] items-center gap-3">
                  <span className="text-[0.8rem] font-medium text-ink-soft">{item.label}</span>
                  <div className="h-[6px] bg-border-soft rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }} />
                  </div>
                  <span className="text-[0.8rem] font-medium text-ink-muted text-right">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-paper-card border border-border rounded-md p-6 sm:p-8">
            <h2 className="font-display text-[1.2rem] text-ink mb-4">Recent transactions</h2>
            <ul className="divide-y divide-border-soft">
              {recentTransactions.map((tx) => (
                <li key={tx.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="text-ink-soft font-medium truncate">{tx.description}</p>
                    <p className="text-[0.8rem] text-ink-faint">
                      {tx.date} · {tx.category}
                    </p>
                  </div>
                  <span className="text-ink font-medium whitespace-nowrap">{tx.amount}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
