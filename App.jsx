import { useEffect, useState, useCallback } from "react";
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from "./api/expenseApi";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import FilterBar from "./components/FilterBar";
import SummaryStrip from "./components/SummaryStrip";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "", from: "", to: "" });
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  // Central place that re-fetches the list from the server. Every
  // create/update/delete calls this afterward so the UI always reflects
  // what's actually in the database, instead of us guessing the new state.
  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchExpenses(filters);
      setExpenses(res.data);
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense._id, formData);
        showMessage("success", "Expense updated successfully");
      } else {
        await createExpense(formData);
        showMessage("success", "Expense added successfully");
      }
      setEditingExpense(null);
      loadExpenses();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      showMessage("success", "Expense deleted");
      loadExpenses();
    } catch (err) {
      showMessage("error", err.response?.data?.message || "Failed to delete expense");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Expense Tracker</h1>
      </header>

      {message && <div className={`toast toast-${message.type}`}>{message.text}</div>}

      <SummaryStrip expenses={expenses} />

      <main className="app-main">
        <section className="form-section">
          <ExpenseForm
            editingExpense={editingExpense}
            onSubmit={handleCreateOrUpdate}
            onCancel={() => setEditingExpense(null)}
          />
        </section>

        <section className="list-section">
          <FilterBar filters={filters} onChange={setFilters} />
          <ExpenseList
            expenses={expenses}
            loading={loading}
            onEdit={setEditingExpense}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}
