const { generateStructuredContent } = require('./geminiClient');

const SYSTEM_INSTRUCTION = `You are a Senior Phishing Security Specialist AI. Analyze the provided email or text content for phishing threats, social engineering tactics, credential harvesting, brand impersonation, and spoofed headers.
You MUST return strictly valid JSON matching this schema:
{
  "riskScore": <number 0-100>,
  "threatLevel": <"SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL">,
  "confidenceScore": <number 0.0 to 1.0>,
  "verdict": "<Short descriptive verdict title>",
  "explanation": "<Clear explanation of why this content is safe or suspicious>",
  "indicators": ["<phishing indicator 1>", "<phishing indicator 2>"],
  "safeActions": ["<actionable safe step 1>", "<actionable safe step 2>"],
  "technicalDetails": {
    "urgencyDetected": <boolean>,
    "credentialHarvestingRisk": <boolean>,
    "spoofedDomainRisk": <boolean>
  }
}`;

const analyzePhishing = async (content, type = 'EMAIL_TEXT') => {
  const prompt = `Analyze this ${type} content for phishing attacks:\n\n${content}`;
  
  const rawResult = await generateStructuredContent({
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });

  return {
    riskScore: Math.min(100, Math.max(0, rawResult.riskScore || 0)),
    threatLevel: rawResult.threatLevel || 'SAFE',
    confidenceScore: Math.min(1.0, Math.max(0.0, rawResult.confidenceScore || 0.95)),
    verdict: rawResult.verdict || 'Phishing Audit Complete',
    explanation: rawResult.explanation || 'No immediate phishing signatures detected.',
    indicators: Array.isArray(rawResult.indicators) ? rawResult.indicators : [],
    safeActions: Array.isArray(rawResult.safeActions) ? rawResult.safeActions : (Array.isArray(rawResult.recommendations) ? rawResult.recommendations : []),
    technicalDetails: rawResult.technicalDetails || {}
  };
};

module.exports = {
  analyzePhishing
};
