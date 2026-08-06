const mongoose = require('mongoose');

const threatLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  moduleType: {
    type: String,
    enum: ['PHISHING', 'SCAM_TEXT', 'FAKE_WEBSITE', 'QR_ANALYSIS', 'SENSITIVE_DOC', 'PRIVACY_LEAK'],
    required: true,
    index: true
  },
  inputSummary: {
    type: String,
    required: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  threatLevel: {
    type: String,
    enum: ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true,
    index: true
  },
  verdict: {
    type: String,
    required: true
  },
  analysisDetails: {
    indicators: [{ type: String }],
    recommendations: [{ type: String }],
    detectedPII: [{ type: String }],
    technicalBreakdown: { type: mongoose.Schema.Types.Mixed }
  },
  rawAiConfidence: {
    type: Number,
    min: 0,
    max: 1.0,
    default: 0.95
  },
  scannedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

threatLogSchema.index({ userId: 1, scannedAt: -1 });

module.exports = mongoose.model('ThreatLog', threatLogSchema);
