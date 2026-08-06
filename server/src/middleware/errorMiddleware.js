const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`[API ERROR] ${req.method} ${req.originalUrl}: ${err.message}`, {
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    error: {
      code: err.errorCode || 'INTERNAL_SERVER_ERROR',
      message: err.message,
      details: err.details || null
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorMiddleware;
