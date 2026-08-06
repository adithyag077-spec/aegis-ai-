const mongoose = require('mongoose');

const copilotMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    default: () => `session_${Date.now()}`
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  suggestedFollowups: [{
    type: String
  }],
  contextScanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ThreatLog'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CopilotMessage', copilotMessageSchema);
