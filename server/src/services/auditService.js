const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const recordAudit = async (actorId, action, targetResource = '', req = null) => {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : '127.0.0.1';
    const userAgent = req ? req.headers['user-agent'] : 'Internal System';

    await AuditLog.create({
      actorId,
      action,
      targetResource,
      ipAddress,
      userAgent
    });

    logger.security(`[AUDIT] Actor: ${actorId} | Action: ${action} | Resource: ${targetResource}`);
  } catch (err) {
    logger.error('Failed to create audit log entry:', { error: err.message });
  }
};

module.exports = {
  recordAudit
};
