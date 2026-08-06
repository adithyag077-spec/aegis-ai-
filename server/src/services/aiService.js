const { analyzePhishing } = require('./ai/phishingAnalyzer');
const { analyzeScamMessage } = require('./ai/scamDetector');
const { analyzeUrlRisk } = require('./ai/urlRiskAnalyzer');
const { analyzeQrContent } = require('./ai/qrAnalyzer');
const { analyzeSensitiveInfo } = require('./ai/sensitiveInfoDetector');
const { analyzeDocument } = require('./ai/documentScanner');
const { computeUnifiedRiskScore } = require('./ai/riskEngine');

module.exports = {
  analyzePhishing,
  analyzeScamMessage,
  analyzeUrlRisk,
  analyzeQrContent,
  analyzeSensitiveInfo,
  analyzeDocument,
  computeUnifiedRiskScore
};
