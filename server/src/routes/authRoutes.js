const express = require('express');
const authController = require('../controllers/authController');
const validateMiddleware = require('../middleware/validateMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const { authRateLimiter } = require('../middleware/rateLimiter');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const router = express.Router();

router.post('/register', authRateLimiter, validateMiddleware(registerSchema), authController.register);
router.post('/login', authRateLimiter, validateMiddleware(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
