const User = require('../models/User');
const authService = require('../services/authService');
const auditService = require('../services/auditService');
const AppError = require('../utils/AppError');

// Simulated in-memory user store for dev testing if MongoDB is not connected
const memoryUsers = [];

const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    let existingUser = null;
    try {
      existingUser = await User.findOne({ email: email.toLowerCase() });
    } catch (err) {
      existingUser = memoryUsers.find(u => u.email === email.toLowerCase());
    }

    if (existingUser) {
      return next(new AppError('An account with this email address already exists.', 400, 'USER_EXISTS'));
    }

    const passwordHash = await authService.hashPassword(password);
    
    let newUser;
    try {
      newUser = await User.create({
        fullName,
        email: email.toLowerCase(),
        passwordHash,
        role: role || 'user'
      });
    } catch (dbErr) {
      newUser = {
        _id: 'usr_' + Date.now(),
        fullName,
        email: email.toLowerCase(),
        passwordHash,
        role: role || 'user',
        currentRiskScore: 15,
        riskCategory: 'Low',
        createdAt: new Date()
      };
      memoryUsers.push(newUser);
    }

    const token = authService.generateToken(newUser);
    await auditService.recordAudit(newUser._id || newUser.id, 'USER_REGISTERED', 'User', req);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Account registered successfully',
      data: {
        token,
        user: {
          id: newUser._id || newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          currentRiskScore: newUser.currentRiskScore,
          riskCategory: newUser.riskCategory
        }
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = null;
    try {
      user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    } catch (err) {
      user = memoryUsers.find(u => u.email === email.toLowerCase());
    }

    if (!user) {
      return next(new AppError('Invalid email or password credentials.', 401, 'INVALID_CREDENTIALS'));
    }

    const isMatch = await authService.comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return next(new AppError('Invalid email or password credentials.', 401, 'INVALID_CREDENTIALS'));
    }

    const token = authService.generateToken(user);
    await auditService.recordAudit(user._id || user.id, 'USER_LOGIN', 'Auth', req);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Authentication successful',
      data: {
        token,
        user: {
          id: user._id || user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          currentRiskScore: user.currentRiskScore || 15,
          riskCategory: user.riskCategory || 'Low'
        }
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        user: req.user
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
