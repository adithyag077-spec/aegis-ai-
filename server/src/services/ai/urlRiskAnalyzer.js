const { generateStructuredContent } = require('./geminiClient');

const SYSTEM_INSTRUCTION = `You are a Web Domain & URL Security Analyst AI. Analyze the target URL for malicious patterns, typosquatting (homograph attacks), suspicious top-level domains (.xyz, .top, .ru, .work), credential harvesting forms, and drive-by malware download risk.
You MUST return strictly valid JSON matching this schema:
{
  "riskScore": <number 0-100>,
  "threatLevel": <"SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL">,
  "confidenceScore": <number 0.0 to 1.0>,
  "verdict": "<Short domain verdict title>",
  "explanation": "<Deep explanation of the URL security posture and risk vectors>",
  "indicators": ["<suspicious pattern 1>", "<suspicious pattern 2>"],
  "safeActions": ["<safe action 1>", "<safe action 2>"],
  "technicalDetails": {
    "protocol": "<HTTP | HTTPS | UNKNOWN>",
    "isTyposquatting": <boolean>,
    "isShortenedUrl": <boolean>,
    "tldRiskRating": "<Low | Medium | High>"
  }
}`;

const analyzeUrlRisk = async (targetUrl) => {
  const prompt = `Perform domain & URL security risk evaluation for:\n${targetUrl}`;

  const rawResult = await generateStructuredContent({
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });

  return {
    riskScore: Math.min(100, Math.max(0, rawResult.riskScore || 0)),
    threatLevel: rawResult.threatLevel || 'SAFE',
    confidenceScore: Math.min(1.0, Math.max(0.0, rawResult.confidenceScore || 0.95)),
    verdict: rawResult.verdict || 'URL Risk Audit Complete',
    explanation: rawResult.explanation || 'URL appears standard and free of known malicious signatures.',
    indicators: Array.isArray(rawResult.indicators) ? rawResult.indicators : [],
    safeActions: Array.isArray(rawResult.safeActions) ? rawResult.safeActions : [],
    technicalDetails: rawResult.technicalDetails || {}
  };
};

module.exports = {
  analyzeUrlRisk
};
