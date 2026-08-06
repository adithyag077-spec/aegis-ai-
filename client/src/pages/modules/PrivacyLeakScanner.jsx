import React, { useState } from 'react';
import { Lock, Zap, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { scanService } from '../../services/scanService';
import { LoadingRadar } from '../../components/common/LoadingRadar';
import { RiskBadge } from '../../components/common/RiskBadge';

export const PrivacyLeakScanner = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await scanService.scanPrivacyLeak({ text });
      setResult(res.data.result);
    } catch (err) {
      setError(err.message || 'Privacy leak audit failed.');
    } finally {
      setLoading(false);
    }
  };

  const sensitiveDataList = result?.detectedSensitiveData || result?.detectedPII || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
          <Lock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Sensitive Information & PII Detector</h1>
          <p className="text-xs text-slate-400">Detect Aadhaar, PAN, Passport, Credit Cards, IFSC, Bank Accounts, Phone & Emails.</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Text Snippet / Code Payload to Audit</label>
            <textarea
              required
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw string, text document, or code to inspect for sensitive PII leaks..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setText("PAYMENT NOTICE:\nAadhaar: 4920 1928 3920\nPAN: ABCDE1234F\nCard: 4532 9102 3810 1928\nIFSC: SBIN0001234\nAccount: 39201920192\nPhone: +91 9876543210\nEmail: john.doe@example.com")}
              className="text-xs font-mono text-slate-500 hover:text-emerald-400 underline"
            >
              Insert PII Leak Test Sample
            </button>

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? 'Auditing Leaks...' : 'Audit Sensitive Info'}</span>
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading && <LoadingRadar message="Gemini AI & Regex Engine Inspecting Aadhaar, PAN, Card & PII Leak Signatures..." />}

      {result && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">AI Audit Verdict</span>
              <h3 className="text-xl font-bold text-slate-100">{result.verdict}</h3>
            </div>
            <RiskBadge level={result.threatLevel} score={result.riskScore} />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{result.explanation}</p>

          {sensitiveDataList.length > 0 && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>Detected Sensitive Data Elements ({sensitiveDataList.length})</span>
              </h4>
              <div className="space-y-2">
                {sensitiveDataList.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-mono font-bold text-purple-300 block">{typeof item === 'string' ? item : item.type}</span>
                      {item.privacyRisk && <span className="text-[11px] text-slate-400 block mt-0.5">{item.privacyRisk}</span>}
                    </div>
                    {item.value && (
                      <span className="px-2.5 py-1 rounded bg-slate-900 font-mono text-xs text-emerald-400 border border-slate-800 self-start sm:self-auto">
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Detected Threat Indicators</h4>
            <ul className="space-y-1.5">
              {result.indicators.map((ind, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
