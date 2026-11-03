import { useEffect, useState } from "react";
import { getProfile } from "../services/profileService.js";

// Profile page — shows the logged-in user's real data from GET /api/profile.

// Bar colours, used in order from the largest category down
const barColors = ["bg-accent", "bg-accent-2", "bg-[#5b7fa6]", "bg-[#8b5e83]", "bg-ink-faint"];

// 18240 → "₹18,240"
function formatAmount(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// "2026-03-28T00:00:00.000Z" → "28 Mar 2026"
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// "2026-01-15T..." → "January 2026"
function formatMonthYear(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

// "2026-03-01" (from a date input) → "1 Mar 2026".
// Adding T00:00:00 reads it as local midnight, so the day never shifts by timezone.
function formatInputDate(value) {
  return formatDate(`${value}T00:00:00`);
}

// Describes the applied date range for the summary card notes
function getRangeLabel({ startDate, endDate }) {
  if (startDate && endDate) return `${formatInputDate(startDate)} – ${formatInputDate(endDate)}`;
  if (startDate) return `from ${formatInputDate(startDate)}`;
  if (endDate) return `until ${formatInputDate(endDate)}`;
  return "all time";
}

const emptyRange = { startDate: "", endDate: "" };

const dateInputClass =
  "w-full sm:w-auto px-[0.875rem] py-[0.6rem] border border-border rounded-sm font-body text-[0.95rem] text-ink bg-paper outline-none focus:border-accent transition-colors";

// "Ritik Tomar" → "RT"
function getInitials(name) {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

function ProfilePage({ onLogout }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedRange, setAppliedRange] = useState(emptyRange);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Ignore a slow older response if a newer range was applied meanwhile
    let ignore = false;
    setIsLoading(true);

    getProfile(appliedRange)
      .then((data) => {
        if (ignore) return;
        setProfile(data);
        setError("");
      })
      .catch((err) => {
        if (ignore) return;
        // Token missing or expired: sign out so the app sends the user to login
        if (err.status === 401) {
          onLogout();
          return;
        }
        setError(
          err instanceof TypeError
            ? "Could not reach the server. Please try again."
            : err.message
        );
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [appliedRange, onLogout]);

  function handleApply(event) {
    event.preventDefault();
    if (startDate && endDate && startDate > endDate) {
      setError("Start date must be on or before end date");
      return;
    }
    setError("");
    setAppliedRange({ startDate, endDate });
  }

  function handleClear() {
    setStartDate("");
    setEndDate("");
    setError("");
    setAppliedRange(emptyRange);
  }

  // Before the profile has loaded once, an error replaces the page.
  // After that, errors show inline under the date filter.
  if (error && !profile) {
    return (
      <section className="px-4 sm:px-8 py-12 md:py-16">
        <div className="max-w-content mx-auto">
          <p role="alert" className="text-danger">{error}</p>
        </div>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="px-4 sm:px-8 py-12 md:py-16">
        <div className="max-w-content mx-auto">
          <p className="text-ink-muted">Loading your profile...</p>
        </div>
      </section>
    );
  }

  const { summary, transactions, categoryBreakdown } = profile;
  const topCategoryAmount = categoryBreakdown.length > 0 ? categoryBreakdown[0].amount : 0;
  const isFiltered = Boolean(appliedRange.startDate || appliedRange.endDate);
  const rangeLabel = getRangeLabel(appliedRange);

  const summaryStats = [
    { label: "Total spent", value: formatAmount(summary.totalSpent), note: rangeLabel },
    { label: "Transactions", value: String(summary.transactionCount), note: rangeLabel },
    {
      label: "Top category",
      value: summary.topCategory,
      note: topCategoryAmount > 0 ? `${formatAmount(topCategoryAmount)} spent` : "no expenses yet",
    },
  ];

  return (
    <section className="px-4 sm:px-8 py-12 md:py-16">
      <div className="max-w-content mx-auto flex flex-col gap-6">

        {/* Profile header */}
        <div className="bg-paper-card border border-border rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-accent-light text-accent font-display text-[1.6rem] flex items-center justify-center">
            {getInitials(profile.user.name)}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-[1.75rem] sm:text-[2rem] text-ink leading-tight">
              {profile.user.name}
            </h1>
            <p className="text-ink-muted break-all">{profile.user.email}</p>
            <p className="text-[0.85rem] text-ink-faint mt-1">Member since {formatMonthYear(profile.user.memberSince)}</p>
          </div>
        </div>

        {/* Date filter */}
        <form
          onSubmit={handleApply}
          className="bg-paper-card border border-border rounded-md px-6 py-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="startDate" className="text-[0.85rem] text-ink-muted">From</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className={dateInputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="endDate" className="text-[0.85rem] text-ink-muted">To</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className={dateInputClass}
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-[0.7rem] bg-ink text-paper rounded-sm font-body text-[0.95rem] font-medium cursor-pointer hover:bg-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? "Applying..." : "Apply"}
              </button>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="text-[0.95rem] text-ink-muted hover:text-ink transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          {error && (
            <p role="alert" className="text-danger text-[0.85rem] mt-3">{error}</p>
          )}
        </form>

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
              {categoryBreakdown.length === 0 && (
                <p className="text-ink-muted">
                  {isFiltered ? "No expenses in this period." : "No expenses yet."}
                </p>
              )}
              {categoryBreakdown.map((item, index) => (
                <div key={item.name} className="grid grid-cols-[80px_1fr_60px] items-center gap-3">
                  <span className="text-[0.8rem] font-medium text-ink-soft">{item.name}</span>
                  <div className="h-[6px] bg-border-soft rounded-full overflow-hidden">
                    <div className={`h-full ${barColors[index % barColors.length]} rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-[0.8rem] font-medium text-ink-muted text-right">{formatAmount(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-paper-card border border-border rounded-md p-6 sm:p-8">
            <h2 className="font-display text-[1.2rem] text-ink mb-4">Recent transactions</h2>
            {transactions.length === 0 && (
              <p className="text-ink-muted">
                {isFiltered ? "No expenses in this period." : "No transactions yet."}
              </p>
            )}
            <ul className="divide-y divide-border-soft">
              {transactions.map((tx, index) => (
                <li key={index} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="text-ink-soft font-medium truncate">{tx.description}</p>
                    <p className="text-[0.8rem] text-ink-faint">
                      {formatDate(tx.date)} · {tx.category}
                    </p>
                  </div>
                  <span className="text-ink font-medium whitespace-nowrap">{formatAmount(tx.amount)}</span>
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
