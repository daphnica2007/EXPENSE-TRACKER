const Expense = require("../models/Expense");
const asyncHandler = require("../middleware/asyncHandler");

// @desc    Get all expenses (supports ?category=, ?search=, ?from=&to=)
// @route   GET /api/expenses
const getExpenses = asyncHandler(async (req, res) => {
  const { category, search, from, to } = req.query;
  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    // case-insensitive partial match on title
    filter.title = { $regex: search, $options: "i" };
  }

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const expenses = await Expense.find(filter).sort({ date: -1 });

  res.status(200).json({
    success: true,
    message: "Expenses fetched successfully",
    data: expenses,
  });
});

// @desc    Get a single expense by id
// @route   GET /api/expenses/:id
const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  res.status(200).json({
    success: true,
    message: "Expense fetched successfully",
    data: expense,
  });
});

// @desc    Create a new expense
// @route   POST /api/expenses
const createExpense = asyncHandler(async (req, res) => {
  const { title, amount, category, date, paymentMethod, notes } = req.body;

  const expense = await Expense.create({
    title,
    amount,
    category,
    date,
    paymentMethod,
    notes,
  });

  res.status(201).json({
    success: true,
    message: "Expense created successfully",
    data: expense,
  });
});

// @desc    Update an existing expense
// @route   PUT /api/expenses/:id
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  const { title, amount, category, date, paymentMethod, notes } = req.body;

  expense.title = title ?? expense.title;
  expense.amount = amount ?? expense.amount;
  expense.category = category ?? expense.category;
  expense.date = date ?? expense.date;
  expense.paymentMethod = paymentMethod ?? expense.paymentMethod;
  expense.notes = notes ?? expense.notes;

  // .save() re-runs schema validation, unlike some findByIdAndUpdate calls
  const updated = await expense.save();

  res.status(200).json({
    success: true,
    message: "Expense updated successfully",
    data: updated,
  });
});

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  await expense.deleteOne();

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
    data: { id: req.params.id },
  });
});

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
