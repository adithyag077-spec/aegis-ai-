const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('./env');
const logger = require('../utils/logger');

let genAI = null;

if (env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    logger.info('🤖 Google Gemini AI Engine Initialized successfully on backend');
  } catch (err) {
    logger.error('❌ Failed to initialize Google Gemini AI Engine:', { error: err.message });
  }
} else {
  logger.warn('⚠️ GEMINI_API_KEY is not configured or using default placeholder. AI engine will operate with heuristic security fallback simulation.');
}

const getGeminiModel = (modelName = 'gemini-1.5-flash') => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
};

module.exports = {
  genAI,
  getGeminiModel
};
