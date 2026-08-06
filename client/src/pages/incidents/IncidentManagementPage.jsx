import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  User, 
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { incidentService } from '../../services/incidentService';
import { useToast } from '../../context/ToastContext';
import { TableSkeleton } from '../../components/common/SkeletonLoader';

export const IncidentManagementPage = () => {
  const { addToast } = useToast();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [description, setDescription] = useState('');
  const [evidenceInput, setEvidenceInput] = useState('');

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const res = await incidentService.getIncidents();
      if (res.data?.incidents) {
        setIncidents(res.data.incidents);
      }
    } catch (err) {
      addToast('DANGER', 'Failed to load incident cases');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const res = await incidentService.createIncident({
        title,
        severity,
        description,
        evidence: evidenceInput ? evidenceInput.split(',').map(s => s.trim()) : []
      });

      if (res.data?.incident) {
        addToast('SAFE', 'New SOC Incident Case created successfully', 'Case Logged');
        setShowNewModal(false);
        setTitle('');
        setDescription('');
        setEvidenceInput('');
        loadIncidents();
      }
    } catch (err) {
      addToast('DANGER', 'Failed to log incident case');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await incidentService.updateStatus(id, newStatus);
      addToast('SAFE', `Case status updated to ${newStatus}`, 'Status Updated');
      loadIncidents();
    } catch (err) {
      addToast('DANGER', 'Failed to update case status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-level-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF6B35] uppercase tracking-widest mb-1.5 font-bold">
            <FileText className="w-4 h-4 text-[#FF6B35]" />
            <span>INCIDENT CASE MANAGEMENT WORKFLOW</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F2F1ED] font-heading">Incident Case Management</h1>
          <p className="text-xs text-[#9A9CA5] mt-1 max-w-2xl">
            Track security investigation cases, record evidence artifacts, and monitor containment lifecycle workflows.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="btn-ember-primary px-6 py-3 rounded-xl text-[#F2F1ED] text-xs font-bold shadow-glow-ember flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#F2F1ED]" />
          <span>Open New Incident Case</span>
        </button>
      </div>

      {/* Incident Cases Table */}
      <div className="glass-panel p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/70 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#F2F1ED] font-heading">Active Security Investigation Cases</h3>
          <span className="text-xs font-mono text-[#FF6B35] font-bold">{incidents.length} Active Cases</span>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : incidents.length === 0 ? (
          <p className="text-xs text-[#9A9CA5] italic">No active security investigation cases logged.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[#9A9CA5] uppercase font-mono text-[11px]">
                  <th className="py-3 px-4">Case Title</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned SOC Lead</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {incidents.map((inc) => (
                  <tr key={inc._id} className="hover:bg-[#1A1D24]/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#F2F1ED]">
                      <div>{inc.title}</div>
                      <div className="text-[10px] text-[#5C5E68] font-normal">{inc.mitreTactic}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        inc.severity === 'CRITICAL' || inc.severity === 'HIGH' 
                          ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/30' 
                          : 'bg-[#FFB84D]/15 text-[#FFB84D] border-[#FFB84D]/30'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={inc.status}
                        onChange={(e) => handleStatusChange(inc._id, e.target.value)}
                        className="bg-[#0B0C10] border border-slate-800 rounded-lg p-1 text-[11px] text-[#00E5A0] focus:outline-none"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="INVESTIGATING">INVESTIGATING</option>
                        <option value="CONTAINED">CONTAINED</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-[#9A9CA5]">{inc.assignedTo}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => handleStatusChange(inc._id, 'RESOLVED')}
                        className="text-[10px] text-[#00E5A0] hover:underline font-bold"
                      >
                        Mark Resolved
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Case Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-[#0B0C10]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#14161B] border border-[#FF6B35]/40 rounded-2xl p-6 shadow-level-3 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-[#F2F1ED] font-heading">Open New SOC Incident Case</h3>
              <button onClick={() => setShowNewModal(false)} className="text-[#9A9CA5] hover:text-[#F2F1ED]">✕</button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#FF6B35] uppercase mb-1 font-bold">Case Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Malicious Executable Dropper via Phishing Email"
                  className="w-full bg-[#0B0C10] border border-slate-800 rounded-xl p-3 text-[#F2F1ED] focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-[#FF6B35] uppercase mb-1 font-bold">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-slate-800 rounded-xl p-3 text-[#F2F1ED] focus:outline-none focus:border-[#FF6B35]"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label className="block text-[#FF6B35] uppercase mb-1 font-bold">Investigation Overview</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed breakdown of threat indicators..."
                  className="w-full bg-[#0B0C10] border border-slate-800 rounded-xl p-3 text-[#F2F1ED] focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div>
                <label className="block text-[#FF6B35] uppercase mb-1 font-bold">Evidence Artifacts (comma separated)</label>
                <input
                  type="text"
                  value={evidenceInput}
                  onChange={(e) => setEvidenceInput(e.target.value)}
                  placeholder="IP: 198.51.100.42, Hash: 8f9b..., Domain: malicious.xyz"
                  className="w-full bg-[#0B0C10] border border-slate-800 rounded-xl p-3 text-[#F2F1ED] focus:outline-none focus:border-[#FF6B35]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0B0C10] text-[#9A9CA5] hover:text-[#F2F1ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-ember-primary px-6 py-2.5 rounded-xl text-[#F2F1ED] font-bold shadow-glow-ember"
                >
                  Log Incident Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentManagementPage;
