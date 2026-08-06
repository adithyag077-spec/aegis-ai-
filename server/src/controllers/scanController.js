const { 
  analyzePhishing, 
  analyzeScamMessage, 
  analyzeUrlRisk, 
  analyzeQrContent, 
  analyzeSensitiveInfo, 
  analyzeDocument,
  computeUnifiedRiskScore 
} = require('../services/aiService');
const ThreatLog = require('../models/ThreatLog');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Fallback memory store when DB is offline
const memoryThreatLogs = [];

const saveThreatRecord = async (userId, moduleType, inputSummary, aiResult) => {
  try {
    const log = await ThreatLog.create({
      userId,
      moduleType,
      inputSummary: inputSummary.slice(0, 150),
      riskScore: aiResult.riskScore,
      threatLevel: aiResult.threatLevel,
      verdict: aiResult.verdict,
      analysisDetails: {
        explanation: aiResult.explanation,
        indicators: aiResult.indicators || [],
        recommendations: aiResult.safeActions || aiResult.recommendations || [],
        detectedSensitiveData: aiResult.detectedSensitiveData || aiResult.detectedPII || [],
        technicalDetails: aiResult.technicalDetails || {}
      },
      rawAiConfidence: aiResult.confidenceScore || 0.95
    });

    // Update unified risk score
    computeUnifiedRiskScore(userId).catch(err => logger.error('Risk score sync error', { err: err.message }));

    return log;
  } catch (err) {
    const fallbackLog = {
      _id: 'log_' + Date.now(),
      userId,
      moduleType,
      inputSummary: inputSummary.slice(0, 150),
      riskScore: aiResult.riskScore,
      threatLevel: aiResult.threatLevel,
      verdict: aiResult.verdict,
      analysisDetails: {
        explanation: aiResult.explanation,
        indicators: aiResult.indicators || [],
        recommendations: aiResult.safeActions || [],
        detectedSensitiveData: aiResult.detectedSensitiveData || [],
        technicalDetails: aiResult.technicalDetails || {}
      },
      rawAiConfidence: aiResult.confidenceScore || 0.95,
      scannedAt: new Date()
    };
    memoryThreatLogs.push(fallbackLog);
    return fallbackLog;
  }
};

/** 1. Phishing Email & Link Analyzer */
const scanPhishing = async (req, res, next) => {
  try {
    const { content, type } = req.body;
    const aiResult = await analyzePhishing(content, type);
    const record = await saveThreatRecord(req.user.id || req.user._id, 'PHISHING', content, aiResult);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Phishing AI security analysis complete',
      data: { result: aiResult, recordId: record._id },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

/** 2. Scam Message Detector */
const scanScamText = async (req, res, next) => {
  try {
    const { messageText, senderInfo, platform } = req.body;
    const aiResult = await analyzeScamMessage(messageText, senderInfo, platform || 'SMS/Chat');
    const record = await saveThreatRecord(req.user.id || req.user._id, 'SCAM_TEXT', messageText, aiResult);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Scam message AI detection complete',
      data: { result: aiResult, recordId: record._id },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

/** 3. URL & Website Risk Analyzer */
const scanFakeWebsite = async (req, res, next) => {
  try {
    const { url } = req.body;
    const aiResult = await analyzeUrlRisk(url);
    const record = await saveThreatRecord(req.user.id || req.user._id, 'FAKE_WEBSITE', url, aiResult);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'URL domain risk audit complete',
      data: { result: aiResult, recordId: record._id },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

/** 4. QR Code Analyzer */
const scanQrCode = async (req, res, next) => {
  try {
    const payloadText = req.body.payloadText || 'QR Code Scan';
    const imageBuffer = req.file ? req.file.buffer : null;
    const mimeType = req.file ? req.file.mimetype : null;

    const aiResult = await analyzeQrContent(payloadText, imageBuffer, mimeType);
    const record = await saveThreatRecord(req.user.id || req.user._id, 'QR_ANALYSIS', payloadText, aiResult);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'QR Code payload analysis complete',
      data: { result: aiResult, recordId: record._id },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

/** 5. Sensitive Information & PII Detector */
const scanPrivacyLeak = async (req, res, next) => {
  try {
    const { text } = req.body;
    const aiResult = await analyzeSensitiveInfo(text);
    const record = await saveThreatRecord(req.user.id || req.user._id, 'PRIVACY_LEAK', text, aiResult);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Sensitive information & PII privacy audit complete',
      data: { result: aiResult, recordId: record._id },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

/** 6. Document AI Scanner */
const scanDocument = async (req, res, next) => {
  try {
    let textContent = '';
    let fileName = 'Uploaded Document';
    let fileBuffer = null;
    let mimeType = null;

    if (req.file) {
      fileName = req.file.originalname;
      fileBuffer = req.file.buffer;
      mimeType = req.file.mimetype;
      if (mimeType === 'text/plain') {
        textContent = fileBuffer.toString('utf8');
      }
    } else {
      textContent = req.body.text || '';
    }

    const aiResult = await analyzeDocument({ textContent, fileBuffer, mimeType, fileName });
    const record = await saveThreatRecord(req.user.id || req.user._id, 'SENSITIVE_DOC', fileName, aiResult);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Document AI audit complete',
      data: { result: aiResult, recordId: record._id },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

/** 7. Threat History & Logs API */
const getThreatHistory = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    let logs = [];
    try {
      logs = await ThreatLog.find({ userId }).sort({ scannedAt: -1 });
    } catch (dbErr) {
      logs = memoryThreatLogs.filter(l => l.userId === userId);
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: { logs },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

const getThreatDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    let log = null;
    try {
      log = await ThreatLog.findById(id);
    } catch (err) {
      log = memoryThreatLogs.find(l => l._id === id);
    }

    if (!log) {
      return next(new AppError('Threat log record not found', 404, 'NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: { log },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

const deleteThreatLog = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await ThreatLog.findByIdAndDelete(id);
    } catch (err) {
      const idx = memoryThreatLogs.findIndex(l => l._id === id);
      if (idx !== -1) memoryThreatLogs.splice(idx, 1);
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Threat log record deleted',
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  scanPhishing,
  scanScamText,
  scanFakeWebsite,
  scanQrCode,
  scanDocument,
  scanPrivacyLeak,
  getThreatHistory,
  getThreatDetail,
  deleteThreatLog
};
