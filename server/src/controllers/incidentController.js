const Incident = require('../models/Incident');

// @desc    Get all incident cases for logged in user
// @route   GET /api/v1/incidents
// @access  Private
exports.getIncidents = async (req, res, next) => {
  try {
    const incidents = await Incident.find({ userId: req.user.id }).sort({ createdAt: -1 });

    if (incidents.length === 0) {
      // Seed initial sample incident if empty
      const sample = await Incident.create({
        userId: req.user.id,
        title: 'Suspicious Spearphishing & Credential Harvester Attempt',
        severity: 'HIGH',
        status: 'INVESTIGATING',
        mitreTactic: 'Initial Access (TA0001)',
        mitreTechnique: 'Phishing: Spearphishing Link (T1566.002)',
        description: 'Multi-vector phishing campaign impersonating corporate Single Sign-On login portal. Target IP address flagged in IOC database.',
        evidence: [
          'URL: hxxps://auth-sso-verify-login.xyz/login',
          'IP: 198.51.100.42',
          'SSL Certificate: Self-signed untrusted CA'
        ],
        aiRemediationPlan: '1. Revoke active SSO session tokens. 2. Block domain at perimeter firewall. 3. Force MFA password reset.',
        assignedTo: 'JARVIS SOC AI Lead'
      });
      return res.status(200).json({
        success: true,
        statusCode: 200,
        count: 1,
        incidents: [sample],
        data: { incidents: [sample] },
        meta: { timestamp: new Date().toISOString() }
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      count: incidents.length,
      incidents,
      data: { incidents },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new incident case
// @route   POST /api/v1/incidents
// @access  Private
exports.createIncident = async (req, res, next) => {
  try {
    const { title, severity, mitreTactic, mitreTechnique, description, evidence } = req.body;

    const incident = await Incident.create({
      userId: req.user.id,
      title,
      severity: severity || 'HIGH',
      status: 'OPEN',
      mitreTactic: mitreTactic || 'Initial Access (TA0001)',
      mitreTechnique: mitreTechnique || 'Phishing (T1566)',
      description,
      evidence: evidence || [],
      aiRemediationPlan: `1. Isolate target system. 2. Inspect memory artifacts. 3. Update firewall rule set.`
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      incident,
      data: { incident },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident status
// @route   PATCH /api/v1/incidents/:id
// @access  Private
exports.updateIncidentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const incident = await Incident.findOne({ _id: req.params.id, userId: req.user.id });

    if (!incident) {
      return res.status(404).json({ success: false, statusCode: 404, message: 'Incident case not found' });
    }

    if (status) incident.status = status;
    await incident.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      incident,
      data: { incident },
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (error) {
    next(error);
  }
};
