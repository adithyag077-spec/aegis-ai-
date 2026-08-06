const User = require('../models/User');
const ThreatLog = require('../models/ThreatLog');
const RiskScoreHistory = require('../models/RiskScoreHistory');
const logger = require('../utils/logger');

/**
 * Calculates and updates user AI risk score based on recent threat scans
 */
const recalculateUserRiskScore = async (userId) => {
  try {
    const recentLogs = await ThreatLog.find({ userId })
      .sort({ scannedAt: -1 })
      .limit(10);

    if (!recentLogs || recentLogs.length === 0) {
      return 15; // Baseline safe score
    }

    // Weighted average giving higher weight to recent critical/high scans
    const totalScore = recentLogs.reduce((acc, log) => acc + log.riskScore, 0);
    const avgScore = Math.round(totalScore / recentLogs.length);

    let category = 'Low';
    if (avgScore >= 75) category = 'Critical';
    else if (avgScore >= 50) category = 'High';
    else if (avgScore >= 30) category = 'Moderate';

    // Update User Document
    await User.findByIdAndUpdate(userId, {
      currentRiskScore: avgScore,
      riskCategory: category
    });

    // Record History Point
    await RiskScoreHistory.create({
      userId,
      score: avgScore,
      triggerEvent: 'SCAN_PERFORMED'
    });

    logger.info(`[RISK ENGINE] User ${userId} risk score updated to ${avgScore} (${category})`);
    return avgScore;
  } catch (error) {
    logger.error(`[RISK ENGINE ERROR] Failed to update risk score for user ${userId}:`, { error: error.message });
    return 15;
  }
};

module.exports = {
  recalculateUserRiskScore
};
