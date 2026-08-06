const CopilotMessage = require('../models/CopilotMessage');
const ThreatLog = require('../models/ThreatLog');
const { generateStructuredContent } = require('../services/ai/geminiClient');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

const memoryCopilotMessages = [];

const copilotKnowledgeFallback = (prompt, contextScan) => {
  const query = (prompt || '').toLowerCase();
  
  let response = '';
  let followups = [];

  if (contextScan) {
    response = `### 🔍 Analysis of Selected Threat Scan (${contextScan.moduleType})
    
**Input Preview:** \`${contextScan.inputSummary}\`
**Threat Level:** **${contextScan.threatLevel}** (Risk Rating: ${contextScan.riskScore}/100)
**Verdict:** ${contextScan.verdict}

#### 🛡️ AI Recommended Actions:
1. **Immediate Containment:** Do not interact with the payload or links referenced in this scan.
2. **Access Isolation:** If credentials were entered, immediately reset your password and terminate active web sessions.
3. **Audit Trail:** Archive this threat log for incident reporting to your SOC / IT Security team.`;

    followups = [
      "What steps should I take if I already clicked the link?",
      "How do I configure 2FA on my primary email account?",
      "Explain the technical indicators found in this scan"
    ];
  } else if (query.includes('phishing') || query.includes('email')) {
    response = `### 🎣 Understanding & Preventing Phishing Attacks

Phishing is a social engineering attack where bad actors impersonate legitimate organizations (banks, HR, cloud providers) to harvest credentials or deploy malware.

#### 🚩 Key Red Flags to Watch For:
- **Lookalike Domains:** Inspect email headers (\`payroll-support-auth.com\` instead of \`company.com\`).
- **Artificial Urgency:** Demands for instant action within 2 to 24 hours under threat of account suspension.
- **Generic Greetings:** Messages addressing you as "Dear Customer" rather than your verified name.
- **Unusual Attachments:** Files ending in \`.exe\`, \`.scr\`, \`.html\`, or double extensions like \`.pdf.exe\`.

#### 🛡️ Recommended Prevention Protocol:
1. Never click login links embedded inside unexpected emails.
2. Bookmark official portal links in your browser.
3. Verify suspicious requests by calling the sender over verified phone channels.`;

    followups = [
      "How can I spot spoofed email headers?",
      "What is the difference between phishing and spear-phishing?",
      "How does multi-factor authentication (MFA) defend against phishing?"
    ];
  } else if (query.includes('url') || query.includes('website') || query.includes('link')) {
    response = `### 🌐 Web Domain Risk & Suspicious Link Audit

Fake websites and cloned portals mimic legitimate login interfaces to steal passwords, debit card PINs, and session tokens.

#### 🔎 Domain Inspection Checklist:
- **Check the TLD (Top Level Domain):** Watch for unusual extensions like \`.cc\`, \`.xyz\`, \`.top\`, or \`.tk\`.
- **SSL Certificate Verification:** Ensure HTTPS connection and inspect certificate issuer details in your browser bar.
- **Homograph & Typo Squatting Attacks:** Watch for character substitutions like \`pαypal.com\` or \`secunty.com\`.

#### 🚀 Immediate Safety Rules:
- Never enter PIN numbers or passwords on unverified domain links.
- Use AegisAI's **Fake Website Scanner** to audit suspicious URLs before opening.`;

    followups = [
      "What is HTTPS and does it guarantee a website is safe?",
      "How do attackers create cloned banking websites?",
      "How to check if a website link is safe to open?"
    ];
  } else if (query.includes('incident') || query.includes('hacked') || query.includes('compromised') || query.includes('leak')) {
    response = `### 🚨 Incident Response & Containment Protocol

If you suspect an active security breach, account takeover, or credential compromise, follow this step-by-step incident containment plan immediately:

#### ⚡ Step 1: Account & Credential Isolation
1. **Password Revocation:** Change your password from a clean, secure device.
2. **Session Termination:** Select **"Log out of all active devices"** in account settings.
3. **MFA Reset:** Re-key your 2FA authenticator app secrets and revoke lost recovery keys.

#### 🛡️ Step 2: Device & Network Inspection
- Disconnect affected laptops or devices from local Wi-Fi / Ethernet to stop lateral malware movement.
- Run a full anti-virus & malware scanner on the system.

#### 📋 Step 3: Reporting
- Notify your organization's IT Security Officer or SOC team immediately with timestamp details.`;

    followups = [
      "How do I check if my email was leaked in a data breach?",
      "What are the best password manager tools to use?",
      "How do I set up continuous threat monitoring?"
    ];
  } else {
    response = `### 🤖 AegisAI Security Copilot Guidance

Hello! I am your enterprise AI Security Assistant. I am trained to provide guidance on threat detection, phishing defense, incident response, and security best practices.

#### 💡 How I Can Assist You:
- **Analyze Security Scans:** Ask me to break down your recent threat logs or risk scores.
- **Explain Attack Vectors:** Learn how phishing, QR scams, and OTP fraud operate.
- **Incident Mitigation:** Get instant step-by-step guidance if an account or device is compromised.
- **Security Best Practices:** Advice on password managers, 2FA/MFA, and privacy protection.`;

    followups = [
      "How does AegisAI detect phishing emails?",
      "What are the top cybersecurity threats in 2026?",
      "Give me a checklist for securing my personal accounts"
    ];
  }

  return { response, followups };
};

const sendCopilotMessage = async (req, res, next) => {
  try {
    const { prompt, sessionId, scanContextId } = req.body;
    const userId = req.user.id || req.user._id;

    if (!prompt || prompt.trim().length === 0) {
      return next(new AppError('Prompt cannot be empty', 400, 'EMPTY_PROMPT'));
    }

    let contextScan = null;
    if (scanContextId) {
      try {
        contextScan = await ThreatLog.findById(scanContextId);
      } catch (e) {
        // Fallback search ignore error
      }
    }

    // Save User Prompt
    let userMsgRecord;
    try {
      userMsgRecord = await CopilotMessage.create({
        userId,
        sessionId: sessionId || `session_${Date.now()}`,
        role: 'user',
        content: prompt,
        contextScanId: scanContextId || null
      });
    } catch (dbErr) {
      userMsgRecord = {
        _id: 'copilot_u_' + Date.now(),
        userId,
        sessionId: sessionId || `session_${Date.now()}`,
        role: 'user',
        content: prompt,
        createdAt: new Date()
      };
      memoryCopilotMessages.push(userMsgRecord);
    }

    // AI Copilot Response Generation
    const systemInstruction = `You are AegisAI Security Copilot, an enterprise cybersecurity assistant. Provide concise, highly actionable, expert guidance formatted in markdown. Include clear headers, bullet points, and actionable safety protocols.`;
    
    let aiOutput;
    try {
      const promptWithContext = contextScan 
        ? `[USER SCAN CONTEXT]: Type: ${contextScan.moduleType}, Risk: ${contextScan.riskScore}, Verdict: ${contextScan.verdict}, Explanation: ${contextScan.analysisDetails?.explanation}\n\n[USER QUESTION]: ${prompt}`
        : prompt;

      aiOutput = await generateStructuredContent({
        prompt: promptWithContext,
        systemInstruction,
        timeoutMs: 15000
      });
    } catch (aiErr) {
      logger.warn('[COPILOT] Using Fallback Knowledge Base Engine');
    }

    let assistantContent = '';
    let followups = [];

    if (aiOutput && aiOutput.explanation) {
      assistantContent = `### 🛡️ AegisAI Copilot Analysis\n\n${aiOutput.explanation}\n\n#### Key Indicators:\n${(aiOutput.indicators || []).map(i => `- ${i}`).join('\n')}\n\n#### Recommended Actions:\n${(aiOutput.safeActions || []).map(a => `- ${a}`).join('\n')}`;
      followups = aiOutput.safeActions || ["How to enable MFA?", "Explain phishing red flags", "Check my risk overview"];
    } else {
      const fallback = copilotKnowledgeFallback(prompt, contextScan);
      assistantContent = fallback.response;
      followups = fallback.followups;
    }

    // Save Assistant Response
    let assistantMsgRecord;
    try {
      assistantMsgRecord = await CopilotMessage.create({
        userId,
        sessionId: userMsgRecord.sessionId,
        role: 'assistant',
        content: assistantContent,
        suggestedFollowups: followups
      });
    } catch (dbErr) {
      assistantMsgRecord = {
        _id: 'copilot_a_' + Date.now(),
        userId,
        sessionId: userMsgRecord.sessionId,
        role: 'assistant',
        content: assistantContent,
        suggestedFollowups: followups,
        createdAt: new Date()
      };
      memoryCopilotMessages.push(assistantMsgRecord);
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        sessionId: userMsgRecord.sessionId,
        userMessage: userMsgRecord,
        assistantMessage: assistantMsgRecord
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

const getCopilotHistory = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const { sessionId } = req.query;

    let messages = [];
    try {
      const query = { userId };
      if (sessionId) query.sessionId = sessionId;
      messages = await CopilotMessage.find(query).sort({ createdAt: 1 });
    } catch (dbErr) {
      messages = memoryCopilotMessages.filter(m => m.userId === userId && (!sessionId || m.sessionId === sessionId));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: { messages },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendCopilotMessage,
  getCopilotHistory
};
