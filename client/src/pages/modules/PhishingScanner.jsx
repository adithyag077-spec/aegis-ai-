import React, { useState } from 'react';
import { ShieldAlert, Zap, AlertCircle } from 'lucide-react';
import { scanService } from '../../services/scanService';
import { LoadingRadar } from '../../components/common/LoadingRadar';
import { AiExplainabilityCard } from '../../components/common/AiExplainabilityCard';

export const PhishingScanner = () => {
  const [content, setContent] = useState('');
  const [type, setType] = useState('URL');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await scanService.scanPhishing({ content, type });
      setResult(res.data.result);
    } catch (err) {
      setError(err.message || 'Phishing scan failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">AI Phishing Detector</h1>
          <p className="text-xs text-slate-400">Analyze URLs or email text for spear-phishing & homograph spoofing.</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <form onSubmit={handleScan} className="space-y-4">
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input type="radio" name="scanType" value="URL" checked={type === 'URL'} onChange={() => setType('URL')} />
              <span>Website URL</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input type="radio" name="scanType" value="EMAIL_TEXT" checked={type === 'EMAIL_TEXT'} onChange={() => setType('EMAIL_TEXT')} />
              <span>Email Content</span>
            </label>
          </div>

          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={type === 'URL' ? "e.g., http://verify-secure-bank-login.account-update.xyz" : "Paste email text header or message body..."}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setContent('http://verify-account-update-bank-login.xyz/auth?user=123')}
              className="text-xs font-mono text-slate-500 hover:text-emerald-400 underline"
            >
              Insert Phishing Test URL
            </button>

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-xs font-bold shadow-lg shadow-rose-500/20 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? 'Analyzing...' : 'Run Phishing Audit'}</span>
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

      {loading && <LoadingRadar message="Gemini AI Analyzing Phishing Indicators & Domain Signals..." />}

      {result && <AiExplainabilityCard result={result} moduleName="Phishing Email & Link Inspection" />}
    </div>
  );
};
