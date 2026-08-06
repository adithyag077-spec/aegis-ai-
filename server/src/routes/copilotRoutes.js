const express = require('express');
const copilotController = require('../controllers/copilotController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/chat', copilotController.sendCopilotMessage);
router.get('/history', copilotController.getCopilotHistory);

module.exports = router;
