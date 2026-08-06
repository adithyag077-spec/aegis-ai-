const AppError = require('../utils/AppError');

const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.errors.map(err => ({
        field: err.path.join('.'),
        issue: err.message
      }));
      return next(new AppError('Invalid input request parameters', 400, 'INVALID_INPUT', details));
    }
    req.body = result.data;
    next();
  };
};

module.exports = validateMiddleware;
