const SimulationResult = require('../models/SimulationResult');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Fallback memory store when DB is offline
const memorySimResults = [];

const scenarios = [
  {
    id: 'sim_phish_01',
    type: 'PHISHING_EMAIL',
    title: 'Urgent Executive Payroll Verification Email',
    category: 'Email Phishing',
    difficulty: 'Intermediate',
    description: 'You received an urgent email from HR claiming your monthly direct deposit failed. It instructs you to click a link and re-enter your corporate login credentials immediately.',
    sender: 'hr-support@payroll-verifications-update.com',
    subject: 'URGENT: Payroll Direct Deposit Suspended - Update Banking Details',
    bodySnippet: 'Dear Employee, We encountered an error processing your salary deposit. Please click http://corporate-payroll-update-auth.com/login to verify your credentials within 2 hours to prevent payment delay.',
    options: [
      { id: 'opt_1', text: 'Click the link immediately and submit login credentials to get paid on time.', isSafe: false, actionType: 'FALL_FOR_SCAM' },
      { id: 'opt_2', text: 'Forward the email to security@company.com and inspect sender domain header.', isSafe: true, actionType: 'SAFE_ACTION' },
      { id: 'opt_3', text: 'Reply to the sender asking if this email is legitimate.', isSafe: false, actionType: 'SUSPICIOUS_ACTION' }
    ],
    redFlags: [
      'Suspicious lookalike domain (payroll-verifications-update.com)',
      'Artificial urgency trigger (verify within 2 hours or salary suspended)',
      'Unsecure HTTP link requesting corporate credentials'
    ],
    badgeAward: 'Phishing Hunter'
  },
  {
    id: 'sim_bank_02',
    type: 'BANKING_WEBSITE',
    title: 'Cloned National Bank Login Portal',
    category: 'Fake Website Clone',
    difficulty: 'Advanced',
    description: 'An SMS link directs you to a bank portal asking for your net banking ID, password, and debit card PIN to avoid account lock.',
    sender: 'HDFC-ALERT-SMS',
    subject: 'Account Security Notice',
    bodySnippet: 'Your Account #4920 has been temporarily frozen. Visit https://hdfc-bank-netbanking-verify.cc to restore full access instantly.',
    options: [
      { id: 'opt_1', text: 'Enter customer ID, password, and debit card PIN to unfreeze account.', isSafe: false, actionType: 'FALL_FOR_SCAM' },
      { id: 'opt_2', text: 'Check SSL certificate, verify domain URL suffix (.cc vs official .com), and close page.', isSafe: true, actionType: 'SAFE_ACTION' },
      { id: 'opt_3', text: 'Enter a fake password to test if the site is real.', isSafe: false, actionType: 'SUSPICIOUS_ACTION' }
    ],
    redFlags: [
      'Unusual domain extension (.cc instead of official domain)',
      'Bank requesting Debit Card PIN on web login form',
      'Urgency tactic claiming account is frozen'
    ],
    badgeAward: 'Web Defense Sentinel'
  },
  {
    id: 'sim_qr_03',
    type: 'QR_SCAM',
    title: 'Parking Meter QR Code Overlay Scam',
    category: 'Quishing / QR Payload',
    difficulty: 'Beginner',
    description: 'A sticker with a QR code placed over a public parking meter instructs you to scan and pay via a third-party website.',
    sender: 'Public Parking Sticker',
    subject: 'Quick Pay QR Code',
    bodySnippet: 'Scan QR code to pay parking fee via QuickPark-Pay.org',
    options: [
      { id: 'opt_1', text: 'Scan QR code and enter credit card information without inspecting URL.', isSafe: false, actionType: 'FALL_FOR_SCAM' },
      { id: 'opt_2', text: 'Inspect URL before opening, notice malicious redirect to unknown payment gate, pay via official app.', isSafe: true, actionType: 'SAFE_ACTION' },
      { id: 'opt_3', text: 'Scan QR code but only enter name and email.', isSafe: false, actionType: 'SUSPICIOUS_ACTION' }
    ],
    redFlags: [
      'Physical sticker placed over official meter signage',
      'Shortened or suspicious payment URL redirect',
      'Lack of official municipal payment branding'
    ],
    badgeAward: 'QR Shield Defender'
  },
  {
    id: 'sim_wa_04',
    type: 'WHATSAPP_SCAM',
    title: 'Emergency Family Member Distress Message',
    category: 'Messaging Fraud',
    difficulty: 'Intermediate',
    description: 'You receive a WhatsApp message from an unknown number claiming to be your cousin who lost their phone and urgently needs $500 transferred to a friend bank account.',
    sender: '+1 (555) 019-2831',
    subject: 'Emergency Help Needed!',
    bodySnippet: 'Hey! It is Sam, my phone got stolen and I am stuck at the station. Can you wire $500 to this UPI/Zelle account right now? I will pay you back tomorrow!',
    options: [
      { id: 'opt_1', text: 'Immediately send $500 via UPI/Zelle to help your cousin.', isSafe: false, actionType: 'FALL_FOR_SCAM' },
      { id: 'opt_2', text: 'Call your cousin on their original phone number or verify identity through a personal offline question.', isSafe: true, actionType: 'SAFE_ACTION' },
      { id: 'opt_3', text: 'Ask for a selfie before sending half the money.', isSafe: false, actionType: 'SUSPICIOUS_ACTION' }
    ],
    redFlags: [
      'Message from unknown number claiming identity theft',
      'Emotional manipulation & financial urgency',
      'Request to send money to an unrelated third-party account'
    ],
    badgeAward: 'Social Guard Elite'
  },
  {
    id: 'sim_otp_05',
    type: 'OTP_SCAM',
    title: 'Fake Tech Support OTP Harvesting Call',
    category: 'Vishing / OTP Theft',
    difficulty: 'Advanced',
    description: 'A caller claiming to be from Microsoft Security says a virus is broadcasting from your PC and asks you to read out the 6-digit OTP code sent to your phone to authenticate.',
    sender: 'Phone Call (+1-800-443-0199)',
    subject: 'Critical Windows Security Warning',
    bodySnippet: 'Caller: "Sir we detected malware on your IP. I just sent a security verification code to your SMS. Read those 6 digits to me so I can block the hacker."',
    options: [
      { id: 'opt_1', text: 'Read the 6-digit OTP aloud to the caller to fix the virus.', isSafe: false, actionType: 'FALL_FOR_SCAM' },
      { id: 'opt_2', text: 'Never share OTP codes over the phone, hang up immediately, and report caller ID.', isSafe: true, actionType: 'SAFE_ACTION' },
      { id: 'opt_3', text: 'Ask the caller for their badge number before sharing the code.', isSafe: false, actionType: 'SUSPICIOUS_ACTION' }
    ],
    redFlags: [
      'Unsolicited incoming phone call from tech support',
      'Request to share confidential 6-digit OTP passcode',
      'Fear-inducing claim of active malware infection'
    ],
    badgeAward: 'OTP Vault Keeper'
  },
  {
    id: 'sim_upi_06',
    type: 'UPI_SCAM',
    title: 'OLX / Marketplace Pay-To-Receive Trap',
    category: 'Payment Fraud',
    difficulty: 'Intermediate',
    description: 'An online buyer offers to buy your old laptop instantly. They send a UPI request stating "Enter PIN to Receive $400 Direct Credit into your Bank Account".',
    sender: 'Buyer_Rajesh_UPI',
    subject: 'UPI Payment Request',
    bodySnippet: 'Payment Request Received from buyer_rajesh@upi: "Pay $400. Enter UPI PIN to confirm receipt."',
    options: [
      { id: 'opt_1', text: 'Enter your 4-digit UPI PIN thinking it approves receiving funds.', isSafe: false, actionType: 'FALL_FOR_SCAM' },
      { id: 'opt_2', text: 'Decline request. Remember that UPI PIN is NEVER required to receive money.', isSafe: true, actionType: 'SAFE_ACTION' },
      { id: 'opt_3', text: 'Accept request and enter incorrect PIN.', isSafe: false, actionType: 'SUSPICIOUS_ACTION' }
    ],
    redFlags: [
      'Fundamental rule: Entering UPI PIN ALWAYS DEBITS money, never receives money',
      'Buyer insists on instant remote transaction without inspecting item',
      'Reversed transaction terminology designed to confuse user'
    ],
    badgeAward: 'Financial Shield Master'
  },
  {
    id: 'sim_soc_07',
    type: 'SOCIAL_ENGINEERING',
    title: 'LinkedIn Impersonation & Malicious Resume PDF',
    category: 'Spear Phishing',
    difficulty: 'Advanced',
    description: 'A recruiter on LinkedIn sends a message with an attached file named "Senior_Executive_Compensation_Package.pdf.exe" asking you to open it to review job details.',
    sender: 'LinkedIn Recruiter (Fake Profile)',
    subject: 'Exclusive Executive Opportunity',
    bodySnippet: 'Hi! We loved your profile. Attached is the full job description and salary breakdown. Download and run Senior_Executive_Offer.pdf.exe to view.',
    options: [
      { id: 'opt_1', text: 'Download and double-click the file to view job details.', isSafe: false, actionType: 'FALL_FOR_SCAM' },
      { id: 'opt_2', text: 'Notice double file extension (.pdf.exe), do not open, report profile for malware distribution.', isSafe: true, actionType: 'SAFE_ACTION' },
      { id: 'opt_3', text: 'Forward file to a friend to open on their laptop first.', isSafe: false, actionType: 'SUSPICIOUS_ACTION' }
    ],
    redFlags: [
      'Executable file extension (.exe) disguised with fake double extension (.pdf.exe)',
      'Unsolicited high-paying offer requiring binary execution',
      'Newly created recruiter profile with low connections'
    ],
    badgeAward: 'Malware Disruptor'
  }
];

const getScenarios = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: { scenarios },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

const submitDecision = async (req, res, next) => {
  try {
    const { scenarioId, optionId } = req.body;
    const userId = req.user.id || req.user._id;

    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) {
      return next(new AppError('Simulation scenario not found', 404, 'NOT_FOUND'));
    }

    const selectedOpt = scenario.options.find(o => o.id === optionId);
    if (!selectedOpt) {
      return next(new AppError('Invalid option selected for scenario', 400, 'INVALID_OPTION'));
    }

    const isCorrect = selectedOpt.isSafe;
    const scoreDelta = isCorrect ? 15 : -10;
    const badges = isCorrect ? [scenario.badgeAward] : [];

    const aiFeedback = {
      verdict: isCorrect ? 'Safe Action Executed - Threat Neutralized!' : 'Vulnerability Triggered - Security Breach Occurred!',
      redFlags: scenario.redFlags,
      explanation: isCorrect 
        ? `Great job! You identified the threat indicators in this ${scenario.category} scenario and took the recommended security protocol.`
        : `Caution! Selecting this option exposed credentials/data. In real-world attacks, attackers leverage ${scenario.redFlags[0]} to compromise accounts.`,
      preventionTip: `Always audit domain URLs, never share 6-digit OTP passcodes, and remember entering a PIN debits money.`
    };

    let resultRecord;
    try {
      resultRecord = await SimulationResult.create({
        userId,
        scenarioId,
        scenarioType: scenario.type,
        userDecision: selectedOpt.actionType,
        isCorrect,
        awarenessScoreDelta: scoreDelta,
        badgesEarned: badges,
        aiFeedback
      });
    } catch (dbErr) {
      resultRecord = {
        _id: 'sim_res_' + Date.now(),
        userId,
        scenarioId,
        scenarioType: scenario.type,
        userDecision: selectedOpt.actionType,
        isCorrect,
        awarenessScoreDelta: scoreDelta,
        badgesEarned: badges,
        aiFeedback,
        completedAt: new Date()
      };
      memorySimResults.push(resultRecord);
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Simulation decision evaluated successfully',
      data: {
        isCorrect,
        scoreDelta,
        badgesEarned: badges,
        aiFeedback,
        resultId: resultRecord._id
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

const getUserProgress = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;

    let userResults = [];
    try {
      userResults = await SimulationResult.find({ userId }).sort({ completedAt: -1 });
    } catch (dbErr) {
      userResults = memorySimResults.filter(r => r.userId === userId);
    }

    const totalCompleted = userResults.length;
    const correctCount = userResults.filter(r => r.isCorrect).length;
    
    // Calculate Security Awareness Score (base 50, +15 for correct, max 100)
    let awarenessScore = 50 + userResults.reduce((acc, r) => acc + (r.awarenessScoreDelta || 0), 0);
    awarenessScore = Math.min(100, Math.max(10, awarenessScore));

    const earnedBadgesSet = new Set();
    userResults.forEach(r => {
      if (r.badgesEarned) r.badgesEarned.forEach(b => earnedBadgesSet.add(b));
    });

    if (correctCount >= 5) earnedBadgesSet.add('Master Cyber Guardian');

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: {
        awarenessScore,
        totalCompleted,
        correctCount,
        accuracyPercentage: totalCompleted > 0 ? Math.round((correctCount / totalCompleted) * 100) : 0,
        badges: Array.from(earnedBadgesSet),
        recentResults: userResults.slice(0, 10)
      },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getScenarios,
  submitDecision,
  getUserProgress
};
