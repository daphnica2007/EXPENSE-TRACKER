import { useEffect, useState } from "react";

const CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Health", "Other"];
const PAYMENT_METHODS = ["Cash", "Card", "UPI"];

const emptyForm = {
  title: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: "Cash",
  notes: "",
};

// One form, two jobs: if `editingExpense` is null we're adding a new
// expense; if it holds an expense object we're editing it. The parent
// (App.jsx) decides which mode we're in by what it passes down.
export default function ExpenseForm({ editingExpense, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date?.slice(0, 10) || emptyForm.date,
        paymentMethod: editingExpense.paymentMethod,
        notes: editingExpense.notes || "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Client-side validation mirrors the backend rules, so the user gets
  // instant feedback instead of waiting for a round trip to find out
  // their amount was zero.
  const validate = () => {
    const newErrors = {};
    if (!form.title || form.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }
    if (form.title && form.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }
    if (!form.amount || Number(form.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!CATEGORIES.includes(form.category)) {
      newErrors.category = "Choose a valid category";
    }
    if (!form.date) {
      newErrors.date = "Date is required";
    } else if (new Date(form.date) > new Date()) {
      newErrors.date = "Date cannot be in the future";
    }
    if (form.notes && form.notes.length > 300) {
      newErrors.notes = "Notes cannot exceed 300 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

      <div className="form-row">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Groceries"
        />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-row form-row-split">
        <div>
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
          {errors.amount && <span className="field-error">{errors.amount}</span>}
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
      </div>

      <div className="form-row form-row-split">
        <div>
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={2} />
        {errors.notes && <span className="field-error">{errors.notes}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingExpense ? "Save Changes" : "Add Expense"}
        </button>
        {editingExpense && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
