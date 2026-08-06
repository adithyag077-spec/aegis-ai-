const express = require('express');
const router = express.Router();
const { getIncidents, createIncident, updateIncidentStatus } = require('../controllers/incidentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.route('/')
  .get(getIncidents)
  .post(createIncident);

router.route('/:id')
  .patch(updateIncidentStatus);

module.exports = router;
