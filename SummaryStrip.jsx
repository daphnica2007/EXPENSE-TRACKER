export default function SummaryStrip({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const now = new Date();
  const thisMonthTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const format = (n) => `$${n.toFixed(2)}`;

  return (
    <div className="summary-strip">
      <div className="summary-card">
        <span className="summary-label">Total Spent</span>
        <span className="summary-value">{format(total)}</span>
      </div>
      <div className="summary-card">
        <span className="summary-label">This Month</span>
        <span className="summary-value">{format(thisMonthTotal)}</span>
      </div>
      <div className="summary-card">
        <span className="summary-label">Top Category</span>
        <span className="summary-value">{topCategory ? `${topCategory[0]} (${format(topCategory[1])})` : "—"}</span>
      </div>
    </div>
  );
}
