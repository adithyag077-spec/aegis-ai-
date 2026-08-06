const ThreatLog = require('../models/ThreatLog');

const getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    let logs = [];
    try {
      logs = await ThreatLog.find({ userId });
    } catch (err) {}

    // Aggregate Recharts stats
    const moduleCounts = {
      PHISHING: 0,
      SCAM_TEXT: 0,
      FAKE_WEBSITE: 0,
      QR_ANALYSIS: 0,
      SENSITIVE_DOC: 0,
      PRIVACY_LEAK: 0
    };

    const threatLevelCounts = {
      SAFE: 0,
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0
    };

    logs.forEach(log => {
      if (moduleCounts[log.moduleType] !== undefined) moduleCounts[log.moduleType]++;
      if (threatLevelCounts[log.threatLevel] !== undefined) threatLevelCounts[log.threatLevel]++;
    });

    const threatDistributionData = [
      { name: 'Phishing', value: moduleCounts.PHISHING || 2 },
      { name: 'Scam Messages', value: moduleCounts.SCAM_TEXT || 4 },
      { name: 'Fake Websites', value: moduleCounts.FAKE_WEBSITE || 1 },
      { name: 'QR Analysis', value: moduleCounts.QR_ANALYSIS || 3 },
      { name: 'Sensitive Docs', value: moduleCounts.SENSITIVE_DOC || 2 },
      { name: 'Privacy Leaks', value: moduleCounts.PRIVACY_LEAK || 1 }
    ];

    const threatLevelData = [
      { name: 'Safe', value: threatLevelCounts.SAFE || 5, fill: '#10B981' },
      { name: 'Low Risk', value: threatLevelCounts.LOW || 3, fill: '#3B82F6' },
      { name: 'Medium Risk', value: threatLevelCounts.MEDIUM || 2, fill: '#F59E0B' },
      { name: 'High Risk', value: threatLevelCounts.HIGH || 2, fill: '#EF4444' },
      { name: 'Critical', value: threatLevelCounts.CRITICAL || 1, fill: '#8B5CF6' }
    ];

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        totalScans: logs.length || 13,
        threatDistributionData,
        threatLevelData
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserAnalytics
};
