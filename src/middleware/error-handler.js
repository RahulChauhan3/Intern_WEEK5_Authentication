function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: { code: "ROUTE_NOT_FOUND", message: `Route ${req.method} ${req.originalUrl} was not found.` }
  });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const body = {
    success: false,
    error: {
      code: error.code || "INTERNAL_SERVER_ERROR",
      message: status >= 500 ? "An unexpected server error occurred." : error.message
    }
  };
  if (error.details && status < 500) body.error.details = error.details;
  if (status >= 500) console.error(error);
  res.status(status).json(body);
}

module.exports = { notFound, errorHandler };
