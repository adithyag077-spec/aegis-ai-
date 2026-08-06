const mongoose = require('mongoose');

const breachCheckLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  breachCount: {
    type: Number,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'SAFE'
  },
  breachesFound: [{
    name: String,
    domain: String,
    breachDate: String,
    compromisedData: [String],
    description: String
  }],
  recommendations: {
    passwordChangeNeeded: Boolean,
    mfaRecommended: Boolean,
    actionSteps: [String],
    aiSummary: String
  },
  checkedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BreachCheckLog', breachCheckLogSchema);
