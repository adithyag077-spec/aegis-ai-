import React, { useState } from 'react';
import { Globe, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { scanService } from '../../services/scanService';
import { LoadingRadar } from '../../components/common/LoadingRadar';
import { RiskBadge } from '../../components/common/RiskBadge';

export const FakeWebsiteScanner = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await scanService.scanFakeWebsite({ url });
      const rawResult = res?.data?.result || res?.result || res?.data || res;
      if (rawResult && typeof rawResult === 'object') {
        setResult({
          ...rawResult,
          indicators: Array.isArray(rawResult.indicators) ? rawResult.indicators : [],
          recommendations: Array.isArray(rawResult.recommendations) ? rawResult.recommendations : (Array.isArray(rawResult.safeActions) ? rawResult.safeActions : []),
          verdict: rawResult.verdict || 'Fake Website Audit Complete',
          threatLevel: rawResult.threatLevel || 'SAFE',
          riskScore: typeof rawResult.riskScore === 'number' ? rawResult.riskScore : 0
        });
      }
    } catch (err) {
      setError(err.message || 'Fake website audit failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <Globe className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Fake Website & Clone Auditor</h1>
          <p className="text-xs text-slate-400">Deep verify e-commerce domain authenticity & credential harvesting clones.</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">Target Website Domain URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://amazon-security-verify-login.xyz"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setUrl('https://arnazon-shopping-deals-discount.com')}
              className="text-xs font-mono text-slate-500 hover:text-emerald-400 underline"
            >
              Insert Typosquatting Sample URL
            </button>

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? 'Auditing...' : 'Audit Domain Authenticity'}</span>
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

      {loading && <LoadingRadar message="Gemini AI Deep Inspecting SSL Domain Certificates & Typosquatting Hashes..." />}

      {result && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">AI Verdict</span>
              <h3 className="text-xl font-bold text-slate-100">{result.verdict}</h3>
            </div>
            <RiskBadge level={result.threatLevel} score={result.riskScore} />
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Detected Risk Indicators</h4>
            <ul className="space-y-1.5">
              {result.indicators.map((ind, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">Actionable Defense Advice</h4>
            <ul className="space-y-1.5">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
