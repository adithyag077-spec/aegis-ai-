import api from './api';

export const scanService = {
  scanPhishing: (payload) => api.post('/scans/phishing', payload),
  scanScamText: (payload) => api.post('/scans/scam-text', payload),
  scanFakeWebsite: (payload) => api.post('/scans/fake-website', payload),
  scanQrCode: (payload) => api.post('/scans/qr-code', payload),
  scanDocument: (formData) => api.post('/scans/doc-scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  scanPrivacyLeak: (payload) => api.post('/scans/privacy-leak', payload),

  getThreatHistory: () => api.get('/scans/history'),
  getThreatDetail: (id) => api.get(`/scans/history/${id}`),
  deleteThreatLog: (id) => api.delete(`/scans/history/${id}`)
};
