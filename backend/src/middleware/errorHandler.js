/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, _next) {
  console.error("❌ Error:", err);

  // Prisma known errors
  if (err.code === "P2002") {
    return res.status(409).json({
      error: "A record with this value already exists.",
      field: err.meta?.target?.[0],
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Record not found.",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token." });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token expired." });
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
