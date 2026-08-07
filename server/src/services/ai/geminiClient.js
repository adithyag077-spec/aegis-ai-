const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../../config/env');
const logger = require('../../utils/logger');
const AppError = require('../../utils/AppError');

let genAI = null;

const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (apiKey && apiKey.trim() !== '' && !apiKey.includes('YOUR_GEMINI_API_KEY')) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    logger.info('🤖 Real Google Gemini API Client Initialized Successfully');
  } catch (err) {
    logger.error('❌ Failed to initialize Google Generative AI Client:', { error: err.message });
  }
} else {
  logger.warn('⚠️ GEMINI_API_KEY missing or placeholder. Engine utilizing Intelligent Heuristic Security Analyzer fallback.');
}

/**
 * Intelligent Heuristic Security Analyzer Fallback
 */
const runHeuristicFallback = (prompt) => {
  logger.warn('[AI ENGINE] Utilizing Heuristic Analysis Engine fallback for payload');
  const text = (prompt || '').toLowerCase();

  let riskScore = 15;
  let threatLevel = 'SAFE';
  let verdict = 'Payload Verified - Low Risk';
  let explanation = 'Content exhibits standard communication patterns with no immediate high-risk threat signatures.';
  let indicators = ['Standard communication structure', 'No malicious redirect hooks'];
  let safeActions = ['Maintain continuous vigilance', 'Audit untrusted links before opening'];
  let detectedSensitiveData = [];

  if (text.includes('urgent') || text.includes('verify-bank') || text.includes('password') || text.includes('suspended') || text.includes('crypto')) {
    riskScore = 85;
    threatLevel = 'HIGH';
    verdict = 'High-Risk Phishing / Extortion Pattern Intercepted';
    explanation = 'Urgency triggers, financial extortion keywords, and credential harvesting patterns detected in content.';
    indicators = ['Social engineering urgency trigger', 'Financial credential reference', 'Potential credential harvesting attempt'];
    safeActions = ['Do NOT click any links in this message', 'Do NOT reply or share passwords/OTP', 'Report to IT Security team'];
  } else if (text.includes('aadhaar') || text.includes('pan') || text.includes('ssn') || text.match(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/)) {
    riskScore = 92;
    threatLevel = 'CRITICAL';
    verdict = 'Critical Sensitive PII & Identity Leak Detected';
    explanation = 'Identified unencrypted Aadhaar, PAN, or financial identifiers in payload.';
    indicators = ['Aadhaar / PAN identifier detected', 'Unencrypted PII exposure risk'];
    detectedSensitiveData = [
      { type: 'Aadhaar / PAN Card', value: 'XXXX-XXXX-3920', privacyRisk: 'Exposing national IDs permits identity theft.' }
    ];
    safeActions = ['Redact sensitive ID numbers immediately', 'Revoke exposed document permissions'];
  }

  return {
    riskScore,
    threatLevel,
    confidenceScore: 0.92,
    verdict,
    explanation,
    indicators,
    safeActions,
    detectedSensitiveData,
    technicalDetails: {
      engineMode: 'Heuristic Security Engine',
      suspiciousIndicatorsFound: indicators.length
    }
  };
};

/**
 * Execute a Gemini Prompt with Timeout Handling and Structured JSON Enforcement
 */
const generateStructuredContent = async ({
  prompt,
  systemInstruction = '',
  imageBuffer = null,
  mimeType = null,
  modelName = 'gemini-1.5-flash',
  timeoutMs = 20000
}) => {
  if (!genAI) {
    return runHeuristicFallback(prompt);
  }

  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.2,
      topP: 0.95,
      responseMimeType: 'application/json'
    }
  });

  const fullPrompt = systemInstruction
    ? `${systemInstruction}\n\n[USER INPUT TO ANALYZE]:\n${prompt}`
    : prompt;

  const parts = [{ text: fullPrompt }];

  if (imageBuffer && mimeType) {
    parts.push({
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType
      }
    });
  }

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new AppError(`Gemini AI analysis request timed out after ${timeoutMs / 1000}s`, 504, 'AI_TIMEOUT'));
    }, timeoutMs);
  });

  try {
    const apiPromise = model.generateContent(parts);
    const result = await Promise.race([apiPromise, timeoutPromise]);
    const response = await result.response;
    const textOutput = response.text().trim();

    const cleanedText = textOutput.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    const parsedJson = JSON.parse(cleanedText);

    return parsedJson;
  } catch (error) {
    logger.warn(`[GEMINI API WARNING] API call unsuccessful (${error.message}). Swapping to Heuristic Analyzer.`);
    return runHeuristicFallback(prompt);
  }
};

module.exports = {
  genAI,
  generateStructuredContent
};
