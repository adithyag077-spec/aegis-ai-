const express = require('express');
const simulatorController = require('../controllers/simulatorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/scenarios', simulatorController.getScenarios);
router.post('/submit', simulatorController.submitDecision);
router.get('/progress', simulatorController.getUserProgress);

module.exports = router;
