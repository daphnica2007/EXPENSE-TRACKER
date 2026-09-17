const mongoose = require("mongoose");

const ALLOWED_CATEGORIES = ["Food", "Travel", "Bills", "Shopping", "Health", "Other"];
const ALLOWED_PAYMENT_METHODS = ["Cash", "Card", "UPI"];

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      validate: {
        validator: (value) => value > 0,
        message: "Amount must be greater than 0",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ALLOWED_CATEGORIES,
        message: "Category must be one of: " + ALLOWED_CATEGORIES.join(", "),
      },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: (value) => value <= new Date(),
        message: "Date cannot be in the future",
      },
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ALLOWED_PAYMENT_METHODS,
        message: "Payment method must be one of: " + ALLOWED_PAYMENT_METHODS.join(", "),
      },
      default: "Cash",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, "Notes cannot exceed 300 characters"],
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Expense", expenseSchema);
module.exports.ALLOWED_CATEGORIES = ALLOWED_CATEGORIES;
module.exports.ALLOWED_PAYMENT_METHODS = ALLOWED_PAYMENT_METHODS;
