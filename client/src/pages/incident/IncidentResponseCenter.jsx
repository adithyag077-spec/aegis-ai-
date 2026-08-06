import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  GitCommit, 
  Sparkles, 
  FileText,
  Lock,
  Zap,
  Play
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const IncidentResponseCenter = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('mitre');
  const [executingRemediation, setExecutingRemediation] = useState(false);

  const mitreTactics = [
    { id: 'TA0001', name: 'Initial Access', technique: 'Spearphishing Link (T1566.002)', risk: 'HIGH', count: 4 },
    { id: 'TA0002', name: 'Execution', technique: 'User Execution: Malicious File (T1204.002)', risk: 'CRITICAL', count: 2 },
    { id: 'TA0003', name: 'Persistence', technique: 'Valid Accounts: SSO Hijack (T1078.004)', risk: 'MEDIUM', count: 1 },
    { id: 'TA0005', name: 'Defense Evasion', technique: 'Obfuscated Files (T1027)', risk: 'HIGH', count: 3 },
    { id: 'TA0006', name: 'Credential Access', technique: 'OS Credential Dumping (T1003)', risk: 'CRITICAL', count: 2 },
  ];

  const attackChain = [
    { step: 1, title: 'Inbound Phishing Email Received', detail: 'Spoofed headers from auth-verify-sso.xyz', time: '10:42:15 AM' },
    { step: 2, title: 'User Clicked Malicious URL', detail: 'Redirected to external credential harvester 198.51.100.42', time: '10:43:02 AM' },
    { step: 3, title: 'Session Token Interception', detail: 'OAuth JWT token posted to remote C2 server', time: '10:43:18 AM' },
    { step: 4, title: 'AEGIS JARVIS Auto-Containment', detail: 'Active session revoked, firewall IP block deployed', time: '10:43:20 AM' },
  ];

  const handleExecutePlaybook = () => {
    setExecutingRemediation(true);
    setTimeout(() => {
      setExecutingRemediation(false);
      addToast('SAFE', 'Automated AI Remediation Playbook executed successfully. Perimeter rules locked.', 'Incident Contained');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-level-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF6B35] uppercase tracking-widest mb-1.5 font-bold">
            <Cpu className="w-4 h-4 text-[#FF6B35]" />
            <span>AI INCIDENT RESPONSE & MITRE ATT&CK CENTER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F2F1ED] font-heading">AI Incident Response Center</h1>
          <p className="text-xs text-[#9A9CA5] mt-1 max-w-2xl">
            Automated kill-chain reconstruction, MITRE ATT&CK tactic mapping, and one-click AI containment playbooks.
          </p>
        </div>

        <button
          onClick={handleExecutePlaybook}
          disabled={executingRemediation}
          className="btn-ember-primary px-6 py-3 rounded-xl text-[#F2F1ED] text-xs font-bold shadow-glow-ember flex items-center gap-2 disabled:opacity-50 shrink-0"
        >
          {executingRemediation ? (
            <>
              <Cpu className="w-4 h-4 animate-spin text-[#F2F1ED]" />
              <span>Deploying Playbook...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-[#F2F1ED]" />
              <span>Execute Containment Playbook</span>
            </>
          )}
        </button>
      </div>

      {/* MITRE ATT&CK & Attack Chain Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTab('mitre')}
          className={`px-4 py-2 rounded-xl transition-all font-bold ${
            activeTab === 'mitre' 
              ? 'bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30' 
              : 'text-[#9A9CA5] hover:text-[#F2F1ED]'
          }`}
        >
          MITRE ATT&CK Mapping
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl transition-all font-bold ${
            activeTab === 'timeline' 
              ? 'bg-[#FF6B35]/15 text-[#FF6B35] border border-[#FF6B35]/30' 
              : 'text-[#9A9CA5] hover:text-[#F2F1ED]'
          }`}
        >
          Attack Chain Timeline
        </button>
      </div>

      {/* MITRE ATT&CK Matrix View */}
      {activeTab === 'mitre' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mitreTactics.map((tactic) => (
            <div key={tactic.id} className="glass-card p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#FF6B35] bg-[#FF6B35]/15 px-2 py-0.5 rounded border border-[#FF6B35]/30">
                  {tactic.id}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  tactic.risk === 'CRITICAL' ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/30' : 'bg-[#FFB84D]/15 text-[#FFB84D] border-[#FFB84D]/30'
                }`}>
                  {tactic.risk}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#F2F1ED] font-heading">{tactic.name}</h3>
              <p className="text-xs text-[#9A9CA5] font-mono bg-[#0B0C10] p-3 rounded-xl border border-slate-800">
                {tactic.technique}
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#9A9CA5] font-mono pt-1">
                <span>Detections Recorded:</span>
                <span className="font-bold text-[#F2F1ED]">{tactic.count} Events</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Attack Chain Timeline View */}
      {activeTab === 'timeline' && (
        <div className="glass-panel p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/70 space-y-6">
          <div className="flex items-center gap-2 text-[#F2F1ED] font-bold text-base font-heading">
            <GitCommit className="w-5 h-5 text-[#FF6B35]" />
            <span>Kill-Chain Event Reconstruction</span>
          </div>

          <div className="space-y-6 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {attackChain.map((item) => (
              <div key={item.step} className="flex items-start gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-[#1A1D24] border border-[#FF6B35]/40 flex items-center justify-center text-[#FF6B35] font-mono text-xs font-bold shrink-0 z-10">
                  {item.step}
                </div>
                <div className="glass-card p-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0B0C10] flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F2F1ED]">{item.title}</span>
                    <span className="text-[10px] font-mono text-[#5C5E68]">{item.time}</span>
                  </div>
                  <p className="text-xs text-[#9A9CA5] font-mono">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentResponseCenter;
