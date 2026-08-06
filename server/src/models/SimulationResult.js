const mongoose = require('mongoose');

const simulationResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scenarioId: {
    type: String,
    required: true
  },
  scenarioType: {
    type: String,
    enum: ['PHISHING_EMAIL', 'BANKING_WEBSITE', 'QR_SCAM', 'WHATSAPP_SCAM', 'OTP_SCAM', 'UPI_SCAM', 'SOCIAL_ENGINEERING'],
    required: true
  },
  userDecision: {
    type: String,
    enum: ['SAFE_ACTION', 'SUSPICIOUS_ACTION', 'FALL_FOR_SCAM'],
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  awarenessScoreDelta: {
    type: Number,
    default: 0
  },
  badgesEarned: [{
    type: String
  }],
  aiFeedback: {
    verdict: String,
    redFlags: [String],
    explanation: String,
    preventionTip: String
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SimulationResult', simulationResultSchema);
