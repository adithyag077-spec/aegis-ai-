import React, { useState } from 'react';
import { ShieldCheck, Upload, Zap, AlertCircle, FileText, Globe, QrCode, Lock, Mail, Image as ImageIcon } from 'lucide-react';
import { scanService } from '../../services/scanService';
import { LoadingRadar } from '../../components/common/LoadingRadar';
import { AiExplainabilityCard } from '../../components/common/AiExplainabilityCard';
import { useToast } from '../../context/ToastContext';

export const UniversalSecurityCenter = () => {
  const { addToast } = useToast();
  const [mode, setMode] = useState('AUTO'); // 'AUTO' | 'FILE' | 'URL' | 'TEXT' | 'QR'
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
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
      } else if (inputText.trim().startsWith('http://') || inputText.trim().startsWith('https://')) {
        res = await scanService.scanFakeWebsite({ url: inputText.trim() });
      } else if (inputText.toLowerCase().includes('subject:') || inputText.toLowerCase().includes('from:')) {
        res = await scanService.scanPhishing({ content: inputText, type: 'EMAIL_TEXT' });
      } else if (inputText.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/) || inputText.match(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/)) {
        res = await scanService.scanPrivacyLeak({ text: inputText });
      } else {
        res = await scanService.scanPhishing({ content: inputText, type: 'URL' });
      }

      const scanRes = res.data?.result;
      setResult(scanRes);

      if (scanRes?.threatLevel === 'CRITICAL' || scanRes?.threatLevel === 'HIGH') {
        addToast('HIGH', `Warning: ${scanRes.verdict}`, 'Threat Intercepted');
      } else {
        addToast('SAFE', 'Payload analyzed safely by Gemini AI.', 'Inspection Passed');
      }
    } catch (err) {
      setError(err.message || 'Universal security analysis failed.');
      addToast('CRITICAL', err.message || 'Inspection error.', 'Scan Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white shadow-lg">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Interactive Universal Security Center</h1>
          <p className="text-xs text-slate-400">All-in-one AI threat hub: Upload PDF, Images, Screenshots, QR Codes, URLs, or Text.</p>
        </div>
      </div>

      {/* Input Selection Dropzone Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        {/* Drag & Drop Box */}
        <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-8 text-center bg-slate-900/50 cursor-pointer transition-all group">
          <input
            type="file"
            accept=".pdf,.txt,.docx,.png,.jpg,.jpeg,.webp"
            onChange={(e) => setSelectedFile(e.target.files[0] || null)}
            className="hidden"
            id="universalFileUpload"
          />
          <label htmlFor="universalFileUpload" className="cursor-pointer flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-200 block">
                {selectedFile ? selectedFile.name : 'Drag & Drop PDF, Image, Screenshot, or Document Here'}
              </span>
              <span className="text-xs text-slate-400 font-mono mt-1 block">
                Supports .pdf, .docx, .txt, .png, .jpg, .webp • Auto AI Payload Parsing
              </span>
            </div>
          </label>
        </div>

        <div className="text-center text-xs font-mono text-slate-400 uppercase tracking-widest">— OR PASTE URL / EMAIL / TEXT / QR PAYLOAD BELOW —</div>

        <form onSubmit={handleScan} className="space-y-4">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste suspicious URL, email message body, Aadhaar/PAN snippet, or QR string..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setInputText('http://verify-bank-update-login.xyz/account/auth');
                }}
                className="text-xs font-mono text-slate-400 hover:text-emerald-400 underline"
              >
                Sample Phishing URL
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setInputText('URGENT NOTICE: PAN ABCDE1234F & Aadhaar 4920 1928 3920 exposed in data leak!');
                }}
                className="text-xs font-mono text-slate-400 hover:text-purple-400 underline"
              >
                Sample PII Leak
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || (!selectedFile && !inputText.trim())}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{loading ? 'Analyzing Payload...' : 'Run Universal AI Scan'}</span>
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && <LoadingRadar message="Gemini AI Auto-Detecting Payload Schema & Running Multi-Vector Heuristics..." />}

      {result && <AiExplainabilityCard result={result} moduleName="Universal Security Center Inspection" />}
    </div>
  );
};
