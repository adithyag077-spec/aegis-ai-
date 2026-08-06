const { generateStructuredContent } = require('./geminiClient');

const preScanRegexPII = (text) => {
  const findings = [];

  const patterns = [
    { type: 'Aadhaar Number', regex: /\b[2-9]\d{3}\s?\d{4}\s?\d{4}\b/g },
    { type: 'PAN Card Number', regex: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g },
    { type: 'Passport Number', regex: /\b[A-PR-WYa-pr-wy][1-9]\d{7}\b/g },
    { type: 'Credit/Debit Card', regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g },
    { type: 'IFSC Code', regex: /\b[A-Z]{4}0[A-Z0-9]{6}\b/g },
    { type: 'Bank Account Number', regex: /\b\d{9,18}\b/g },
    { type: 'Phone Number', regex: /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
    { type: 'Email Address', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g }
  ];

  patterns.forEach(({ type, regex }) => {
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      matches.forEach(m => {
        const masked = m.length > 6 ? `${m.slice(0, 3)}...${m.slice(-3)}` : '****';
        findings.push({ type, maskedValue: masked });
      });
    }
  });

  return findings;
};

const SYSTEM_INSTRUCTION = `You are a Privacy & PII Data Protection Specialist AI. Analyze input text for sensitive personal identifiable information (PII) including Aadhaar, PAN, Passports, Credit/Debit Cards, IFSC, Bank Accounts, Phone Numbers, Emails, or Passwords.
You MUST return strictly valid JSON matching this schema:
{
  "riskScore": <number 0-100>,
  "threatLevel": <"SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL">,
  "confidenceScore": <number 0.0 to 1.0>,
  "verdict": "<Short privacy verdict title>",
  "explanation": "<Clear explanation of privacy risks associated with found data>",
  "detectedSensitiveData": [
    {
      "type": "<e.g. Aadhaar | PAN | Credit Card | Phone | Email | IFSC | Bank Account>",
      "value": "<Redacted or Masked Preview>",
      "privacyRisk": "<Why exposing this specific data element is dangerous>"
    }
  ],
  "indicators": ["<privacy risk indicator 1>", "<privacy risk indicator 2>"],
  "safeActions": ["<redaction / remediation advice 1>", "<remediation advice 2>"]
}`;

const analyzeSensitiveInfo = async (text) => {
  const preScanned = preScanRegexPII(text);
  const prompt = `Analyze text for PII & sensitive data leaks:\n\n${text}`;

  const rawResult = await generateStructuredContent({
    prompt,
    systemInstruction: SYSTEM_INSTRUCTION
  });

  return {
    riskScore: Math.min(100, Math.max(0, rawResult.riskScore || (preScanned.length > 0 ? 80 : 10))),
    threatLevel: rawResult.threatLevel || (preScanned.length > 0 ? 'HIGH' : 'SAFE'),
    confidenceScore: Math.min(1.0, Math.max(0.0, rawResult.confidenceScore || 0.95)),
    verdict: rawResult.verdict || (preScanned.length > 0 ? 'Sensitive PII Leak Detected' : 'Privacy Audit Passed'),
    explanation: rawResult.explanation || 'Analyzed content for sensitive identifier exposure.',
    detectedSensitiveData: Array.isArray(rawResult.detectedSensitiveData) && rawResult.detectedSensitiveData.length > 0 
      ? rawResult.detectedSensitiveData 
      : preScanned.map(p => ({
          type: p.type,
          value: p.maskedValue,
          privacyRisk: `Exposing ${p.type} increases identity theft and financial fraud risk.`
        })),
    indicators: Array.isArray(rawResult.indicators) ? rawResult.indicators : [],
    safeActions: Array.isArray(rawResult.safeActions) ? rawResult.safeActions : []
  };
};

module.exports = {
  analyzeSensitiveInfo,
  preScanRegexPII
};
