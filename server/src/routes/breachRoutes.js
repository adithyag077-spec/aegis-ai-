const express = require('express');
const breachController = require('../controllers/breachController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/check', breachController.checkBreach);
router.get('/history', breachController.getBreachHistory);

module.exports = router;
