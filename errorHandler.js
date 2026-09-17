// Runs when no route matches the request. Turns Express's default
// "Cannot GET /whatever" into our standard JSON error shape.
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Central error-handling middleware. Express recognizes this as an
// error handler because it takes 4 arguments (err, req, res, next).
// Every controller funnels its errors here via asyncHandler, so all
// error responses come out in the same { success, message, data } shape.
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server Error";

  // Mongoose "CastError" happens when an :id in the URL isn't a valid
  // MongoDB ObjectId (e.g. /api/expenses/abc123). Treat that as a 404
  // ("no expense found with that id") instead of a 500 crash.
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Expense not found";
  }

  // Mongoose validation errors (from our schema's required/enum/validate
  // rules) come back as a ValidationError with one entry per bad field.
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Duplicate key error from a unique index, if one is ever added.
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    // Only include the stack trace outside production, so students can
    // debug locally without leaking internals in a real deployment.
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
