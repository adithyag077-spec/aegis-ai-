import React from 'react';
import { ShieldCheck, Award, Zap, BookOpen, Key, Crown, Target } from 'lucide-react';

export const GamificationCard = ({ totalScans = 5, riskScore = 15 }) => {
  let level = 'Recruit';
  let levelNum = 1;

  if (totalScans >= 25) {
    level = 'Master Sentinel';
    levelNum = 4;
  } else if (totalScans >= 10) {
    level = 'Guardian';
    levelNum = 3;
  } else if (totalScans >= 5) {
    level = 'Analyst';
    levelNum = 2;
  }

  const healthScore = Math.max(0, 100 - riskScore);

  const badges = [
    { title: 'Radar Scan', icon: Zap, unlocked: totalScans >= 1, color: 'text-sky-400' },
    { title: 'Sentinel Shield', icon: ShieldCheck, unlocked: totalScans >= 3, color: 'text-emerald-400' },
    { title: 'PII Protection', icon: Key, unlocked: totalScans >= 5, color: 'text-cyan-400' },
    { title: 'Master Guardian', icon: Crown, unlocked: totalScans >= 10, color: 'text-amber-400' }
  ];

  const dailyTips = [
    "Verify domain spelling: threat actors use homograph characters like 'arnazon.com' to impersonate 'amazon.com'.",
    "Never disclose OTPs or credentials via SMS or phone calls. Official banking representatives will never request them.",
    "Inspect QR code URL payloads before scanning in public venues to prevent quishing redirects.",
    "Redact sensitive Aadhaar and PAN numbers prior to uploading documents to cloud repositories."
  ];

  const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Rank & Health Score */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 lg:col-span-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Security Rank & Health Score
            </h3>
          </div>
          <span className="px-3 py-1 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold">
            Level {levelNum}: {level}
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
            <span>Security Health Rating</span>
            <span className="text-emerald-400 font-bold">{healthScore}% Optimal</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
        </div>

        {/* Badges List */}
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">Achievement Milestones</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    b.unlocked
                      ? 'bg-slate-900/80 border-slate-700 text-slate-100'
                      : 'bg-slate-900/30 border-slate-800/60 opacity-40 grayscale'
                  }`}
                >
                  <div className="flex justify-center mb-1.5">
                    <Icon className={`w-5 h-5 ${b.unlocked ? b.color : 'text-slate-500'}`} />
                  </div>
                  <span className="text-xs font-bold block truncate">{b.title}</span>
                  <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                    {b.unlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Security Tip */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs uppercase font-bold mb-3">
            <BookOpen className="w-4 h-4" />
            <span>Cyber Security Insight</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed border-l-2 border-sky-500 pl-3 py-1">
            "{randomTip}"
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Continuous Threat Intel</span>
          <span className="text-sky-400 font-bold">AegisAI Engine</span>
        </div>
      </div>
    </div>
  );
};
