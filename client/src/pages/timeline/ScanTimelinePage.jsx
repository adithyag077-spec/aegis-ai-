import React, { useEffect, useState } from 'react';
import { Clock, History, ArrowRight, ShieldCheck, AlertCircle, Eye, GitCompare } from 'lucide-react';
import { scanService } from '../../services/scanService';
import { RiskBadge } from '../../components/common/RiskBadge';

export const ScanTimelinePage = () => {
  const [logs, setLogs] = useState([]);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await scanService.getThreatHistory();
        if (res.data?.logs) setLogs(res.data.logs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const toggleCompare = (log) => {
    if (selectedForCompare.find(l => l._id === log._id)) {
      setSelectedForCompare(selectedForCompare.filter(l => l._id !== log._id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], log]);
      } else {
        setSelectedForCompare([...selectedForCompare, log]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>AI Security Timeline & Evolution</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Chronological Threat Event Stream</h1>
          <p className="text-xs text-slate-400">Track security score progression and compare previous AI inspection results.</p>
        </div>
      </div>

      {/* Side-by-Side Scan Comparison Modal / Panel */}
      {selectedForCompare.length === 2 && (
        <div className="glass-panel p-6 rounded-2xl border border-indigo-500/40 bg-indigo-950/20 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-500/30 pb-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm font-mono uppercase">
              <GitCompare className="w-4 h-4" />
              <span>Side-by-Side Threat Audit Comparison</span>
            </div>
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              Clear Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedForCompare.map((log, idx) => (
              <div key={log._id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase">Scan #{idx + 1} ({log.moduleType})</span>
                <h4 className="text-sm font-bold text-slate-100">{log.verdict}</h4>
                <div className="flex items-center gap-2">
                  <RiskBadge level={log.threatLevel} score={log.riskScore} />
                  <span className="text-xs text-slate-400 font-mono">{new Date(log.scannedAt || log.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-300 font-mono truncate">{log.inputSummary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline Stream */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
          Select up to 2 items to compare threat progression (Selected: {selectedForCompare.length}/2)
        </div>

        {logs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            No chronological timeline events recorded yet. Run your first AI scan.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
            {logs.map((log) => {
              const isSelected = selectedForCompare.some(l => l._id === log._id);
              return (
                <div key={log._id} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#090D16] transition-colors ${
                    log.threatLevel === 'HIGH' || log.threatLevel === 'CRITICAL'
                      ? 'border-rose-500 bg-rose-500/20'
                      : 'border-emerald-500 bg-emerald-500/20'
                  }`}></div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">{log.moduleType}</span>
                        <span className="text-[11px] text-slate-500 font-mono">• {new Date(log.scannedAt || log.createdAt).toLocaleString()}</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-100">{log.verdict}</h3>
                      <p className="text-xs text-slate-400 font-mono max-w-xl truncate">{log.inputSummary}</p>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <RiskBadge level={log.threatLevel} score={log.riskScore} />
                      <button
                        onClick={() => toggleCompare(log)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                          isSelected
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : '+ Compare'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
