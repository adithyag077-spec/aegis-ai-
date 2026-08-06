import React, { useState } from 'react';
import { FileSearch, Upload, Zap, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import { scanService } from '../../services/scanService';
import { LoadingRadar } from '../../components/common/LoadingRadar';
import { RiskBadge } from '../../components/common/RiskBadge';

export const DocScanner = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let res;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('document', selectedFile);
        res = await scanService.scanDocument(formData);
      } else {
        const formData = new FormData();
        formData.append('text', text || 'Sample document content with SSN: 000-12-3456');
        res = await scanService.scanDocument(formData);
      }
      setResult(res.data.result);
    } catch (err) {
      setError(err.message || 'Document security scan failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <FileSearch className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Sensitive Document Scanner</h1>
          <p className="text-xs text-slate-400">Upload documents (.pdf, .txt, .docx) to audit for PII or API key leaks.</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <form onSubmit={handleScan} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">Upload Document File (.pdf, .txt, .docx)</label>
            <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 text-center bg-slate-900/50 cursor-pointer transition-colors">
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                className="hidden"
                id="docUploadInput"
              />
              <label htmlFor="docUploadInput" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click or Drag & Drop Document File Here'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">Max size 5MB • Never stored to disk</span>
              </label>
            </div>
          </div>

          <div className="text-center text-xs font-mono text-slate-500 uppercase tracking-widest">— OR PASTE DOCUMENT TEXT CONTENT —</div>

          <div>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste raw text body from document..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setText("CONFIDENTIAL FINANCIAL AUDIT REPORT\nAccount No: 4920-1928-3920-1029\nSSN Owner: 102-39-9201\nAWS_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY");
              }}
              className="text-xs font-mono text-slate-500 hover:text-emerald-400 underline"
            >
              Insert Confidential Leak Sample
            </button>

            <button
              type="submit"
              disabled={loading || (!selectedFile && !text.trim())}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? 'Auditing Document...' : 'Audit Sensitive Document'}</span>
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

      {loading && <LoadingRadar message="Gemini AI Parsing Document Buffer & Auditing Confidential Data Patterns..." />}

      {result && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">AI Audit Verdict</span>
              <h3 className="text-xl font-bold text-slate-100">{result.verdict}</h3>
            </div>
            <RiskBadge level={result.threatLevel} score={result.riskScore} />
          </div>

          {result.detectedPII && result.detectedPII.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-bold mb-2">Exposed PII & Secret Credentials Found</h4>
              <div className="flex flex-wrap gap-2">
                {result.detectedPII.map((pii, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono">
                    ⚠️ {pii}
                  </span>
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
