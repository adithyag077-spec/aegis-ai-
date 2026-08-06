const AppError = require('../utils/AppError');

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden: You do not have permission to perform this action', 403, 'FORBIDDEN'));
    }
    next();
  };
};

module.exports = roleMiddleware;
