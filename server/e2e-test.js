const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:5000/api/v1';

async function makeRequest(path, method = 'GET', data = null, token = null, isMultipart = false) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    let bodyData = null;
    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      if (isMultipart) {
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        headers['Content-Type'] = `multipart/form-data; boundary=${boundary}`;
        bodyData = `--${boundary}\r\nContent-Disposition: form-data; name="document"; filename="test.txt"\r\nContent-Type: text/plain\r\n\r\nCONFIDENTIAL REPORT\r\nSSN: 000-12-3456\r\nPAN: ABCDE1234F\r\n--${boundary}--\r\n`;
      } else {
        headers['Content-Type'] = 'application/json';
        bodyData = JSON.stringify(data);
      }
      headers['Content-Length'] = Buffer.byteLength(bodyData);
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: headers
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: responseBody });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

async function runE2ETests() {
  console.log('====================================================');
  console.log('🚀 AEGIS-AI PLATFORM END-TO-END AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  const results = [];

  const recordResult = (feature, passed, details = '') => {
    results.push({ feature, passed, details });
    console.log(`${passed ? '✅ PASS' : '❌ FAIL'} - ${feature} ${details ? `(${details})` : ''}`);
  };

  try {
    // 1. Health Endpoint Test
    const health = await makeRequest('/health');
    recordResult('Health API Check', health.status === 200 && health.body?.status === 'UP', `Status: ${health.status}`);

    // 2. User Registration
    const testEmail = `agent_${Date.now()}@aegis.ai`;
    const regRes = await makeRequest('/auth/register', 'POST', {
      fullName: 'Test Agent',
      email: testEmail,
      password: 'Password123!',
      role: 'admin'
    });
    const userCreated = regRes.status === 201 && regRes.body?.success;
    recordResult('User Registration (MongoDB Write)', userCreated, `Status: ${regRes.status}`);

    const token = regRes.body?.data?.token;

    // 3. User Login
    const loginRes = await makeRequest('/auth/login', 'POST', {
      email: testEmail,
      password: 'Password123!'
    });
    recordResult('User Login & JWT Sign', loginRes.status === 200 && loginRes.body?.data?.token, `Status: ${loginRes.status}`);

    // 4. Get Current User Profile (JWT Authentication & DB Read)
    const meRes = await makeRequest('/auth/me', 'GET', null, token);
    recordResult('JWT Auth Middleware & Profile Read', meRes.status === 200 && meRes.body?.data?.user, `User: ${meRes.body?.data?.user?.email}`);

    // 5. Phishing Email & Link Analyzer Endpoint
    const phishRes = await makeRequest('/scans/phishing', 'POST', {
      content: 'http://verify-bank-update-login.account-check.xyz',
      type: 'URL'
    }, token);
    recordResult('Phishing Analyzer Endpoint', phishRes.status === 200 && phishRes.body?.data?.result, `Verdict: ${phishRes.body?.data?.result?.verdict}`);

    // 6. Scam Text Detector Endpoint
    const scamRes = await makeRequest('/scans/scam-text', 'POST', {
      messageText: 'URGENT: Your account has been suspended! Send $500 crypto to restore.',
      senderInfo: '+1-888-FAKE-BANK'
    }, token);
    recordResult('Scam Message Detector Endpoint', scamRes.status === 200 && scamRes.body?.data?.result, `Score: ${scamRes.body?.data?.result?.riskScore}`);

    // 7. URL Risk Analyzer Endpoint
    const urlRes = await makeRequest('/scans/fake-website', 'POST', {
      url: 'https://arnazon-shopping-deals-discount.com'
    }, token);
    recordResult('URL & Fake Website Risk Analyzer', urlRes.status === 200 && urlRes.body?.data?.result, `Verdict: ${urlRes.body?.data?.result?.verdict}`);

    // 8. QR Code Analyzer Endpoint
    const qrRes = await makeRequest('/scans/qr-code', 'POST', {
      payloadText: 'http://malicious-qr-redirect.com/auth'
    }, token);
    recordResult('QR Code Analyzer Endpoint', qrRes.status === 200 && qrRes.body?.data?.result, `Verdict: ${qrRes.body?.data?.result?.verdict}`);

    // 9. Sensitive Information & PII Detector Endpoint
    const piiRes = await makeRequest('/scans/privacy-leak', 'POST', {
      text: 'Aadhaar: 4920 1928 3920, PAN: ABCDE1234F, Email: test@aegis.ai'
    }, token);
    recordResult('Sensitive Information & PII Detector', piiRes.status === 200 && piiRes.body?.data?.result, `Detected: ${piiRes.body?.data?.result?.detectedSensitiveData?.length || 0} items`);

    // 10. Document AI Scanner Endpoint (Multipart File Upload)
    const docRes = await makeRequest('/scans/doc-scan', 'POST', {}, token, true);
    recordResult('Document AI Scanner (Multipart Upload)', docRes.status === 200 && docRes.body?.data?.result, `Verdict: ${docRes.body?.data?.result?.verdict}`);

    // 11. Threat History Endpoint (MongoDB Read)
    const histRes = await makeRequest('/scans/history', 'GET', null, token);
    recordResult('Threat History (MongoDB Read)', histRes.status === 200 && Array.isArray(histRes.body?.data?.logs), `Total Logs: ${histRes.body?.data?.logs?.length}`);

    // 12. User Risk Overview Endpoint
    const riskRes = await makeRequest('/users/risk-overview', 'GET', null, token);
    recordResult('User Risk Overview & Calculation', riskRes.status === 200 && riskRes.body?.data?.currentRiskScore !== undefined, `Score: ${riskRes.body?.data?.currentRiskScore}`);

    // 13. Security Analytics Endpoint (Recharts Aggregation Data)
    const analyticsRes = await makeRequest('/analytics/user-summary', 'GET', null, token);
    recordResult('Security Analytics Aggregations', analyticsRes.status === 200 && analyticsRes.body?.data?.threatDistributionData, `Total Scans: ${analyticsRes.body?.data?.totalScans}`);

    // 14. Admin Statistics Endpoint
    const adminRes = await makeRequest('/admin/stats', 'GET', null, token);
    recordResult('Admin Portal System Metrics', adminRes.status === 200 && adminRes.body?.data?.systemMetrics, `Total Users: ${adminRes.body?.data?.systemMetrics?.totalUsers}`);

    console.log('\n====================================================');
    console.log('📊 TEST SUITE COMPLETE');
    const passedCount = results.filter(r => r.passed).length;
    console.log(`Passed: ${passedCount} / ${results.length}`);
    console.log('====================================================');
  } catch (err) {
    console.error('Fatal test runner error:', err);
  }
}

runE2ETests();
