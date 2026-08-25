const errorHandler = (error, req, res, next) => {
  console.error("Unhandled request error:", error);
  if (res.headersSent) return next(error);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Lỗi máy chủ" : error.message,
  });
};

module.exports = errorHandler;
