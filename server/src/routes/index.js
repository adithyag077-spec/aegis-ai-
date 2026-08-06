const express = require('express');
const authRoutes = require('./authRoutes');
const scanRoutes = require('./scanRoutes');
const userRoutes = require('./userRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const adminRoutes = require('./adminRoutes');
const simulatorRoutes = require('./simulatorRoutes');
const copilotRoutes = require('./copilotRoutes');
const breachRoutes = require('./breachRoutes');
const incidentRoutes = require('./incidentRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    system: 'AegisAI Defense Backend Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/scans', scanRoutes);
router.use('/users', userRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/simulator', simulatorRoutes);
router.use('/copilot', copilotRoutes);
router.use('/breach', breachRoutes);
router.use('/incidents', incidentRoutes);

module.exports = router;
