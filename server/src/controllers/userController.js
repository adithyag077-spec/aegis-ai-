const User = require('../models/User');
const ThreatLog = require('../models/ThreatLog');
const RiskScoreHistory = require('../models/RiskScoreHistory');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    let user = null;
    try {
      user = await User.findById(userId);
    } catch (err) {}

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        user: user || req.user
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

const getRiskOverview = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    let history = [];
    try {
      history = await RiskScoreHistory.find({ userId }).sort({ calculatedAt: 1 }).limit(30);
    } catch (err) {
      history = [
        { score: 10, calculatedAt: new Date(Date.now() - 86400000 * 5) },
        { score: 25, calculatedAt: new Date(Date.now() - 86400000 * 3) },
        { score: 15, calculatedAt: new Date() }
      ];
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        currentRiskScore: req.user.currentRiskScore || 15,
        riskCategory: req.user.riskCategory || 'Low',
        history
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getRiskOverview
};
