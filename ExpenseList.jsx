import { useState } from "react";

export default function ExpenseList({ expenses, loading, onEdit, onDelete }) {
  const [confirmId, setConfirmId] = useState(null);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  const formatAmount = (n) => `$${Number(n).toFixed(2)}`;

  if (loading) {
    return <div className="state-message">Loading expenses...</div>;
  }

  if (expenses.length === 0) {
    return <div className="state-message">No expenses found. Add your first one above.</div>;
  }

  return (
    <div className="expense-list-wrapper">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Payment</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td data-label="Title">{expense.title}</td>
              <td data-label="Amount">{formatAmount(expense.amount)}</td>
              <td data-label="Category">
                <span className={`category-pill category-${expense.category.toLowerCase()}`}>
                  {expense.category}
                </span>
              </td>
              <td data-label="Date">{formatDate(expense.date)}</td>
              <td data-label="Payment">{expense.paymentMethod}</td>
              <td data-label="Notes" className="notes-cell">{expense.notes || "—"}</td>
              <td data-label="Actions" className="actions-cell">
                <button className="btn btn-small" onClick={() => onEdit(expense)}>
                  Edit
                </button>
                {confirmId === expense._id ? (
                  <span className="confirm-delete">
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => {
                        onDelete(expense._id);
                        setConfirmId(null);
                      }}
                    >
                      Confirm
                    </button>
                    <button className="btn btn-small" onClick={() => setConfirmId(null)}>
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button className="btn btn-small btn-danger" onClick={() => setConfirmId(expense._id)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
