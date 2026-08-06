const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required. Please log in to access this resource.', 401, 'UNAUTHORIZED'));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Attempt DB fetch if connected, else construct from token payload
    let currentUser = null;
    try {
      currentUser = await User.findById(decoded.id);
    } catch (dbErr) {
      // Fallback in case DB offline
    }

    if (!currentUser) {
      currentUser = {
        _id: decoded.id,
        id: decoded.id,
        role: decoded.role || 'user',
        email: decoded.email || 'user@aegis.ai'
      };
    }

    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Session expired. Please log in again.', 401, 'TOKEN_EXPIRED'));
    }
    return next(new AppError('Invalid authentication token.', 401, 'INVALID_TOKEN'));
  }
};

module.exports = authMiddleware;
