const { generateStructuredContent } = require('./geminiClient');

const SYSTEM_INSTRUCTION = `You are a QR Code Security & Quishing Specialist AI. Analyze the decoded QR payload (or image buffer) for quishing attempts, unauthorized Wi-Fi credential hijacking, malicious APK/IPA downloads, or phishing redirects.
You MUST return strictly valid JSON matching this schema:
{
  "riskScore": <number 0-100>,
  "threatLevel": <"SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL">,
  "confidenceScore": <number 0.0 to 1.0>,
  "payloadType": "<URL | Wi-Fi Config | Text | Contact Card | App Download>",
  "verdict": "<Short QR verdict title>",
  "explanation": "<Clear analysis of the QR payload destination and safety>",
  "indicators": ["<indicator 1>", "<indicator 2>"],
  "safeActions": ["<action 1>", "<action 2>"],
  "technicalDetails": {
    "targetDestination": "<string>",
    "isAutoExecuteRisk": <boolean>
  }
}`;

const analyzeQrContent = async (payloadText, imageBuffer = null, mimeType = null) => {
  const prompt = `Inspect QR Code Payload:\n${payloadText || 'Analyze attached QR image code.'}`;

  const rawResult = await generateStructuredContent({
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION,
    imageBuffer,
    mimeType
  });

  return {
    riskScore: Math.min(100, Math.max(0, rawResult.riskScore || 0)),
    threatLevel: rawResult.threatLevel || 'SAFE',
    confidenceScore: Math.min(1.0, Math.max(0.0, rawResult.confidenceScore || 0.95)),
    payloadType: rawResult.payloadType || 'URL',
    verdict: rawResult.verdict || 'QR Payload Audit Complete',
    explanation: rawResult.explanation || 'QR payload analyzed safely.',
    indicators: Array.isArray(rawResult.indicators) ? rawResult.indicators : [],
    safeActions: Array.isArray(rawResult.safeActions) ? rawResult.safeActions : [],
    technicalDetails: rawResult.technicalDetails || {}
  };
};

module.exports = {
  analyzeQrContent
};
