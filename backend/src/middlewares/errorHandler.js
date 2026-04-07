module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({ error: { message, status } });
};
