require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const expenseRoutes = require("./routes/expenseRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

connectDB();

const app = express();

// Allow the Vite frontend (running on a different port) to call this API
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",");
app.use(cors({ origin: allowedOrigins }));

app.use(express.json()); // parses incoming JSON request bodies into req.body

app.get("/", (req, res) => {
  res.json({ success: true, message: "Expense Tracker API is running", data: null });
});

app.use("/api/expenses", expenseRoutes);

// Must come after all routes: catches unmatched routes, then hands off
// to the central error handler below.
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
