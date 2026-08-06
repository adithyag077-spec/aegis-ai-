const { generateStructuredContent } = require('./geminiClient');

const SYSTEM_INSTRUCTION = `You are an Enterprise Document AI Security Auditor. Analyze document contents (PDF, DOCX, TXT, or Image Document Scans) for unencrypted passwords, financial records, PII, intellectual property leaks, or embedded malicious macro scripts.
You MUST return strictly valid JSON matching this schema:
{
  "riskScore": <number 0-100>,
  "threatLevel": <"SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL">,
  "confidenceScore": <number 0.0 to 1.0>,
  "documentType": "<PDF | DOCX | TXT | IMAGE | UNKNOWN>",
  "verdict": "<Short document audit verdict>",
  "explanation": "<Comprehensive summary of document confidentiality risks>",
  "detectedSensitiveData": [
    {
      "type": "<e.g. Password | Secret Key | Financial Data | Aadhaar | PAN | Credit Card>",
      "value": "<Redacted Preview>",
      "privacyRisk": "<Explanation>"
    }
  ],
  "indicators": ["<indicator 1>", "<indicator 2>"],
  "safeActions": ["<recommendation 1>", "<recommendation 2>"]
}`;

const analyzeDocument = async ({ textContent = '', fileBuffer = null, mimeType = null, fileName = 'Document' }) => {
  let prompt = `Analyze Document File: ${fileName}\n\n`;

  if (textContent) {
    prompt += `Extracted Text Content:\n${textContent.slice(0, 4000)}`;
  } else {
    prompt += `Analyze attached document buffer.`;
  }

  const rawResult = await generateStructuredContent({
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION,
    imageBuffer: mimeType?.startsWith('image/') ? fileBuffer : null,
    mimeType: mimeType?.startsWith('image/') ? mimeType : null
  });

  return {
    riskScore: Math.min(100, Math.max(0, rawResult.riskScore || 0)),
    threatLevel: rawResult.threatLevel || 'SAFE',
    confidenceScore: Math.min(1.0, Math.max(0.0, rawResult.confidenceScore || 0.95)),
    documentType: rawResult.documentType || (mimeType ? mimeType.toUpperCase() : 'TXT'),
    verdict: rawResult.verdict || 'Document AI Audit Complete',
    explanation: rawResult.explanation || 'Document content audited for security and confidentiality risks.',
    detectedSensitiveData: Array.isArray(rawResult.detectedSensitiveData) ? rawResult.detectedSensitiveData : [],
    indicators: Array.isArray(rawResult.indicators) ? rawResult.indicators : [],
    safeActions: Array.isArray(rawResult.safeActions) ? rawResult.safeActions : []
  };
};

module.exports = {
  analyzeDocument
};
