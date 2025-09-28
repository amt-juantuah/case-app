/**
 * Centralized API Error Handling Middleware
 *
 * Catches errors from routes, middlewares, and async handlers.
 */

const { messages } = require('../constants');

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || messages.internal_server_error;

  res.status(status).json({
    success: false,
    error: message,
    message: process.env.NODE_ENV === 'development'? err.stack : message,
  });
}

module.exports = errorHandler;
