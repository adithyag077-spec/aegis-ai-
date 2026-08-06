const { generateStructuredContent } = require('./geminiClient');

const SYSTEM_INSTRUCTION = `You are a Digital Scam & Financial Fraud Expert AI. Analyze incoming messages (SMS, WhatsApp, Telegram, Instagram, Facebook, LinkedIn, etc.) for scam patterns, OTP theft, impersonation, advance-fee fraud, fake investment schemes, or coerced wire transfers.
You MUST return strictly valid JSON matching this schema:
{
  "riskScore": <number 0-100>,
  "threatLevel": <"SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL">,
  "confidenceScore": <number 0.0 to 1.0>,
  "scamCategory": "<e.g. Financial Extortion | OTP Theft | Fake Job | Advance-Fee | Impersonation | Safe>",
  "verdict": "<Short verdict title>",
  "explanation": "<Detailed breakdown of why this message is genuine or a scam>",
  "indicators": ["<scam indicator 1>", "<scam indicator 2>"],
  "safeActions": ["<recommended protective step 1>", "<recommended protective step 2>"],
  "technicalDetails": {
    "platform": "<SMS | WhatsApp | Telegram | Social Media | General>",
    "financialRisk": <boolean>,
    "coercionLevel": "<None | Low | High>"
  }
}`;

const analyzeScamMessage = async (messageText, senderInfo = '', platform = 'General') => {
  const prompt = `Platform: ${platform}\nSender: ${senderInfo || 'Unknown'}\nMessage:\n${messageText}`;

  const rawResult = await generateStructuredContent({
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });

  return {
    riskScore: Math.min(100, Math.max(0, rawResult.riskScore || 0)),
    threatLevel: rawResult.threatLevel || 'SAFE',
    confidenceScore: Math.min(1.0, Math.max(0.0, rawResult.confidenceScore || 0.95)),
    scamCategory: rawResult.scamCategory || 'General Audit',
    verdict: rawResult.verdict || 'Scam Message Audit Complete',
    explanation: rawResult.explanation || 'No scam indicators found in message content.',
    indicators: Array.isArray(rawResult.indicators) ? rawResult.indicators : [],
    safeActions: Array.isArray(rawResult.safeActions) ? rawResult.safeActions : [],
    technicalDetails: rawResult.technicalDetails || { platform }
  };
};

module.exports = {
  analyzeScamMessage
};
