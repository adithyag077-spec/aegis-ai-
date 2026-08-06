const mongoose = require('mongoose');

const riskScoreHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  calculatedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  triggerEvent: {
    type: String,
    enum: ['SCAN_PERFORMED', 'MANUAL_RECALC', 'SYSTEM_RESET'],
    default: 'SCAN_PERFORMED'
  }
}, {
  timestamps: true
});

riskScoreHistorySchema.index({ userId: 1, calculatedAt: 1 });

module.exports = mongoose.model('RiskScoreHistory', riskScoreHistorySchema);
