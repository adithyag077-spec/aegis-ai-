import React from 'react';
import { ShieldAlert, CheckCircle2, AlertCircle, Download, Cpu, Info, FileText } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { exportSecurityReport } from '../../utils/reportExporter';
import { useToast } from '../../context/ToastContext';

export const AiExplainabilityCard = ({ result, moduleName = 'AI Cyber Security Inspection' }) => {
  const { addToast } = useToast();

  if (!result || typeof result !== 'object') return null;

  const handleDownloadReport = () => {
    exportSecurityReport(result, moduleName);
    addToast('SAFE', 'Security Inspection Report generated and downloaded.', 'Report Exported');
  };

  const confidencePct = Math.round((result.confidenceScore || 0.95) * 100);

  // Safe Array Handling for Map Operations
  const indicators = Array.isArray(result.indicators) ? result.indicators : [];
  const safeActions = Array.isArray(result.safeActions)
    ? result.safeActions
    : (Array.isArray(result.recommendations) ? result.recommendations : []);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Security Explainability Report</span>
          </div>
          <h3 className="text-xl font-bold text-slate-100">{result.verdict || 'Analysis Complete'}</h3>
        </div>

        <div className="flex items-center gap-3">
          <RiskBadge level={result.threatLevel || 'SAFE'} score={result.riskScore || 0} />
          <button
            onClick={handleDownloadReport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-sky-500/20 border border-slate-700 hover:border-sky-500/30 text-sky-400 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Download PDF/HTML Executive Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">AI Confidence Score</span>
          <span className="font-bold text-sky-400 text-base">{confidencePct}%</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Severity Rating</span>
          <span className="font-bold text-amber-400 text-base">{result.threatLevel || 'SAFE'}</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-400 uppercase block">Risk Score</span>
          <span className="font-bold text-emerald-400 text-base">{result.riskScore || 0}/100</span>
        </div>
      </div>

      {/* Human-Friendly Explanation */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span>Why AI Reached This Conclusion</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
          {result.explanation || 'Payload audited cleanly with standard security heuristic checks.'}
        </p>
      </div>

      {/* Detected Threat Indicators */}
      {indicators.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Detected Technical Threat Indicators ({indicators.length})
          </h4>
          <ul className="space-y-1.5">
            {indicators.map((ind, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{typeof ind === 'string' ? ind : JSON.stringify(ind)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safe Actions */}
      {safeActions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            Suggested Safe Actions & Remediation
          </h4>
          <ul className="space-y-1.5">
            {safeActions.map((action, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{typeof action === 'string' ? action : JSON.stringify(action)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
