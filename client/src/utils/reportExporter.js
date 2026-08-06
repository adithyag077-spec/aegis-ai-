/**
 * Professional HTML / Printable Security Report Generator
 */
export const exportSecurityReport = (resultData, moduleName = 'Cyber Defense Inspection') => {
  const timestamp = new Date().toLocaleString();
  const reportId = `AEGIS-RPT-${Math.floor(100000 + Math.random() * 900000)}`;

  const indicators = Array.isArray(resultData?.indicators) ? resultData.indicators : [];
  const safeActions = Array.isArray(resultData?.safeActions)
    ? resultData.safeActions
    : (Array.isArray(resultData?.recommendations) ? resultData.recommendations : []);

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>AegisAI Security Inspection Report - ${reportId}</title>
  <style>
    body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #090D16; color: #F8FAFC; margin: 0; padding: 40px; }
    .container { max-width: 800px; margin: 0 auto; background: #0F172A; border: 1px solid #1E293B; border-radius: 16px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1E293B; padding-bottom: 20px; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: 800; color: #10B981; }
    .badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: rgba(16, 185, 129, 0.1); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 14px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; font-mono: monospace; }
    .card { background: #1E293B; padding: 16px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 12px; }
    ul { margin: 0; padding-left: 20px; }
    li { margin-bottom: 6px; font-size: 13px; color: #CBD5E1; }
    .footer { border-top: 1px solid #1E293B; padding-top: 16px; margin-top: 32px; text-align: center; font-size: 11px; color: #64748B; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo">AegisAI Security Engine</div>
        <div style="font-size: 12px; color: #94A3B8;">Official Executive Cyber Threat Report • ${moduleName}</div>
      </div>
      <div style="text-align: right;">
        <div class="badge">${resultData?.threatLevel || 'SAFE'} RISK</div>
        <div style="font-size: 11px; color: #64748B; font-family: monospace; margin-top: 4px;">ID: ${reportId}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Executive Summary</div>
      <div class="card">
        <h3 style="margin: 0 0 8px 0; color: #F8FAFC;">${resultData?.verdict || 'Security Audit Complete'}</h3>
        <p style="margin: 0; font-size: 13px; color: #94A3B8; line-height: 1.5;">${resultData?.explanation || 'No immediate threat signatures identified in payload analysis.'}</p>
      </div>
    </div>

    <div class="section">
      <div class="section-title">AI Metrics & Confidence</div>
      <div style="display: flex; gap: 16px;">
        <div class="card" style="flex: 1; text-align: center;">
          <div style="font-size: 11px; color: #64748B;">AI RISK SCORE</div>
          <div style="font-size: 32px; font-weight: 800; color: ${resultData?.riskScore > 50 ? '#EF4444' : '#10B981'};">${resultData?.riskScore || 0}/100</div>
        </div>
        <div class="card" style="flex: 1; text-align: center;">
          <div style="font-size: 11px; color: #64748B;">AI CONFIDENCE</div>
          <div style="font-size: 32px; font-weight: 800; color: #3B82F6;">${Math.round((resultData?.confidenceScore || 0.95) * 100)}%</div>
        </div>
      </div>
    </div>

    ${indicators.length > 0 ? `
    <div class="section">
      <div class="section-title">Detected Threat Indicators</div>
      <div class="card">
        <ul>
          ${indicators.map(ind => `<li>⚠️ ${typeof ind === 'string' ? ind : JSON.stringify(ind)}</li>`).join('')}
        </ul>
      </div>
    </div>
    ` : ''}

    ${safeActions.length > 0 ? `
    <div class="section">
      <div class="section-title">Recommended Defense Actions</div>
      <div class="card">
        <ul>
          ${safeActions.map(act => `<li>✅ ${typeof act === 'string' ? act : JSON.stringify(act)}</li>`).join('')}
        </ul>
      </div>
    </div>
    ` : ''}

    <div class="footer">
      Generated on ${timestamp} by AegisAI Defense Platform • Google Gemini Security Model
    </div>
  </div>
</body>
</html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AegisAI_Report_${reportId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
