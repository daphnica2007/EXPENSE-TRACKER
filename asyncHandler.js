// Wraps an async route/controller function so any thrown error or
// rejected promise is automatically passed to next(), which sends it
// to our centralized error handler instead of crashing the server.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
