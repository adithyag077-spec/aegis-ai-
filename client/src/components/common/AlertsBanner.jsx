import React from 'react';
import { AlertTriangle, Bell, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AlertsBanner = ({ alerts = [] }) => {
  const defaultAlerts = [
    {
      id: 'alt_1',
      title: 'High-Risk Phishing Domain Intercepted',
      description: 'System blocked access to verify-account-bank-update.xyz homograph domain.',
      severity: 'HIGH',
      timestamp: '10 mins ago'
    },
    {
      id: 'alt_2',
      title: 'Credential Leak Scan Warning',
      description: 'Exposed API token detected in uploaded text file.',
      severity: 'CRITICAL',
      timestamp: '2 hours ago'
    },
    {
      id: 'alt_3',
      title: 'Identity Risk Baseline Established',
      description: 'Your current threat score is rated LOW (15/100). Keep scanning untrusted links.',
      severity: 'SAFE',
      timestamp: '1 day ago'
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : defaultAlerts;

  const severityStyles = {
    CRITICAL: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    HIGH: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    MEDIUM: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    SAFE: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Recent Security Alerts Feed</h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Live Radar Stream
        </span>
      </div>

      <div className="space-y-2.5">
        {displayAlerts.map((alt) => {
          const style = severityStyles[alt.severity] || severityStyles.SAFE;
          return (
            <div
              key={alt.id}
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 transition-colors ${style}`}
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{alt.title}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{alt.description}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono opacity-75 shrink-0">{alt.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
