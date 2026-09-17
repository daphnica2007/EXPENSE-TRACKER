import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Every function here returns response.data, which is our
// { success, message, data } shape from the backend. Components never
// touch axios directly - they only ever import from this file.

export const fetchExpenses = async (filters = {}) => {
  const params = {};
  if (filters.category) params.category = filters.category;
  if (filters.search) params.search = filters.search;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;

  const response = await api.get("/expenses", { params });
  return response.data;
};

export const createExpense = async (expense) => {
  const response = await api.post("/expenses", expense);
  return response.data;
};

export const updateExpense = async (id, expense) => {
  const response = await api.put(`/expenses/${id}`, expense);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

export default api;
