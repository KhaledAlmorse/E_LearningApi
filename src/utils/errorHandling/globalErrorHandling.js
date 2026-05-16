export const globalErrorHandling = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    stack: err.stack || "No stack trace available",
  });
};
