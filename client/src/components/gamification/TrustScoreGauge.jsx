import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export const TrustScoreGauge = ({ privacyScore = 92, trustScore = 95 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Privacy Score Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">Privacy Protection Index</span>
          <span className="text-2xl font-extrabold text-emerald-400">{privacyScore}/100</span>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">PII Data Encryption Active</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
      </div>

      {/* Trust Score Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">Platform Security Trust Score</span>
          <span className="text-2xl font-extrabold text-indigo-400">{trustScore}/100</span>
          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Zero Data Retention Guarantee</span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
