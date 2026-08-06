const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'HIGH'
    },
    status: {
      type: String,
      enum: ['OPEN', 'INVESTIGATING', 'CONTAINED', 'RESOLVED'],
      default: 'OPEN'
    },
    mitreTactic: {
      type: String,
      default: 'Initial Access (TA0001)'
    },
    mitreTechnique: {
      type: String,
      default: 'Phishing: Spearphishing Link (T1566.002)'
    },
    description: {
      type: String,
      required: true
    },
    evidence: [
      {
        type: String
      }
    ],
    aiRemediationPlan: {
      type: String,
      default: ''
    },
    assignedTo: {
      type: String,
      default: 'JARVIS SOC AI Lead'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Incident', incidentSchema);
