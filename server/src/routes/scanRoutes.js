const express = require('express');
const scanController = require('../controllers/scanController');
const authMiddleware = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { scanRateLimiter } = require('../middleware/rateLimiter');
const {
  phishingScanSchema,
  scamTextScanSchema,
  fakeWebsiteScanSchema,
  qrScanSchema,
  privacyLeakScanSchema
} = require('../validators/scanValidator');

const router = express.Router();

// Apply Auth Middleware to all scan routes
router.use(authMiddleware);

router.post('/phishing', scanRateLimiter, validateMiddleware(phishingScanSchema), scanController.scanPhishing);
router.post('/scam-text', scanRateLimiter, validateMiddleware(scamTextScanSchema), scanController.scanScamText);
router.post('/fake-website', scanRateLimiter, validateMiddleware(fakeWebsiteScanSchema), scanController.scanFakeWebsite);
router.post('/qr-code', scanRateLimiter, validateMiddleware(qrScanSchema), scanController.scanQrCode);
router.post('/doc-scan', scanRateLimiter, upload.single('document'), scanController.scanDocument);
router.post('/privacy-leak', scanRateLimiter, validateMiddleware(privacyLeakScanSchema), scanController.scanPrivacyLeak);

router.get('/history', scanController.getThreatHistory);
router.get('/history/:id', scanController.getThreatDetail);
router.delete('/history/:id', scanController.deleteThreatLog);

module.exports = router;
