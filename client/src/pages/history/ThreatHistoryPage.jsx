import React, { useEffect, useState } from 'react';
import { History, Trash2, Eye, Filter, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { scanService } from '../../services/scanService';
import { RiskBadge } from '../../components/common/RiskBadge';

export const ThreatHistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await scanService.getThreatHistory();
      if (res.data?.logs) {
        setLogs(res.data.logs);
        setFilteredLogs(res.data.logs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (moduleType) => {
    setSelectedModule(moduleType);
    if (moduleType === 'ALL') {
      setFilteredLogs(logs);
    } else {
      setFilteredLogs(logs.filter(l => l.moduleType === moduleType));
    }
  };

  const handleDelete = async (id) => {
    try {
      await scanService.deleteThreatLog(id);
      setLogs(logs.filter(l => l._id !== id));
      setFilteredLogs(filteredLogs.filter(l => l._id !== id));
      if (selectedLog?._id === id) setSelectedLog(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-sky-400" />
            <span>Threat Scan History</span>
          </h1>
          <p className="text-xs text-slate-400">Complete audit log of all previous AI cyber inspections.</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={selectedModule}
            onChange={(e) => handleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="ALL">All Modules</option>
            <option value="PHISHING">Phishing</option>
            <option value="SCAM_TEXT">Scam Text</option>
            <option value="FAKE_WEBSITE">Fake Website</option>
            <option value="QR_ANALYSIS">QR Analysis</option>
            <option value="SENSITIVE_DOC">Sensitive Doc</option>
            <option value="PRIVACY_LEAK">Privacy Leak</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            No inspection logs matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Input Preview</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">AI Verdict</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-semibold text-sky-400">{log.moduleType}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate font-mono">{log.inputSummary}</td>
                    <td className="py-3 px-4"><RiskBadge level={log.threatLevel} score={log.riskScore} /></td>
                    <td className="py-3 px-4 text-slate-200">{log.verdict}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {new Date(log.scannedAt || log.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-500/20 text-slate-300 hover:text-sky-400 transition-colors"
                        title="View Full AI Report"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(log._id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                        title="Delete Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="glass-panel max-w-2xl w-full p-6 rounded-2xl border border-slate-800 max-h-[90vh] overflow-y-auto space-y-6 relative">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 pr-8">
              <div>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest block">{selectedLog.moduleType}</span>
                <h3 className="text-lg font-bold text-slate-100">{selectedLog.verdict}</h3>
              </div>
              <RiskBadge level={selectedLog.threatLevel} score={selectedLog.riskScore} />
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-1">Input Content</h4>
              <p className="p-3 rounded-xl bg-slate-900 font-mono text-xs text-slate-300 break-all">{selectedLog.inputSummary}</p>
            </div>

            {selectedLog.analysisDetails?.indicators?.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Detected Threat Indicators</h4>
                <ul className="space-y-1.5">
                  {selectedLog.analysisDetails.indicators.map((ind, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedLog.analysisDetails?.recommendations?.length > 0 && (
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Defense Recommendations</h4>
                <ul className="space-y-1.5">
                  {selectedLog.analysisDetails.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
