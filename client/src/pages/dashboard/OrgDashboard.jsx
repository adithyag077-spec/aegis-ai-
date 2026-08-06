import React from 'react';
import { Building2, ShieldCheck, Users, ShieldAlert, Cpu, Activity, Lock } from 'lucide-react';
import { RiskBadge } from '../../components/common/RiskBadge';

export const OrgDashboard = () => {
  const teamMembers = [
    { name: 'Alex Morgan (CISO)', email: 'alex@aegis.ai', scans: 42, risk: 'LOW', score: 12 },
    { name: 'DevSecOps Team Lead', email: 'devsec@aegis.ai', scans: 88, risk: 'MEDIUM', score: 38 },
    { name: 'Frontend Engineer', email: 'dev1@aegis.ai', scans: 14, risk: 'SAFE', score: 5 },
    { name: 'Security Compliance Manager', email: 'audit@aegis.ai', scans: 29, risk: 'LOW', score: 18 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-widest mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Enterprise Organization Dashboard</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">AegisAI Enterprise Defense Suite</h1>
          <p className="text-xs text-slate-400">Organization-wide threat posture, team vulnerabilities, & security compliance.</p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>SOC2 & ISO-27001 Compliant</span>
        </div>
      </div>

      {/* Enterprise Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Team Risk Score</span>
          <span className="text-3xl font-extrabold text-emerald-400">18/100</span>
          <span className="text-[10px] font-mono text-slate-500 block mt-1">Grade A Security Rating</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Active Team Seats</span>
          <span className="text-3xl font-extrabold text-slate-100">12 / 20</span>
          <span className="text-[10px] font-mono text-slate-500 block mt-1">Enterprise Plan</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Total Org Scans</span>
          <span className="text-3xl font-extrabold text-indigo-400">1,428</span>
          <span className="text-[10px] font-mono text-slate-500 block mt-1">Last 30 Days</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Threat Intercepts</span>
          <span className="text-3xl font-extrabold text-rose-400">182</span>
          <span className="text-[10px] font-mono text-slate-500 block mt-1">Phishing & Leaks Blocked</span>
        </div>
      </div>

      {/* Team Members Posture Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono mb-4">
          Team Member Security Posture
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Scans Run</th>
                <th className="py-3 px-4">Risk Rating</th>
                <th className="py-3 px-4 text-right">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {teamMembers.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-100">{m.name}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{m.email}</td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-400">{m.scans}</td>
                  <td className="py-3 px-4"><RiskBadge level={m.risk} score={m.score} /></td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-mono">✅ Verified</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
