import React from 'react';
import { Activity } from 'lucide-react';

export const ThreatHeatmap = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const vectors = [
    'Phishing Emails',
    'Scam Messages',
    'Fake Websites',
    'Malicious QR',
    'Sensitive Docs',
    'Privacy Leaks'
  ];

  // Intensity matrix (0 = Safe/Green, 1 = Low/Blue, 2 = Medium/Yellow, 3 = High/Red)
  const heatmapData = [
    [0, 1, 3, 0, 2, 1, 0],
    [2, 0, 1, 3, 1, 0, 2],
    [0, 2, 0, 1, 3, 0, 1],
    [1, 0, 2, 0, 1, 2, 0],
    [3, 1, 0, 2, 0, 1, 3],
    [0, 2, 1, 0, 2, 3, 0]
  ];

  const intensityColors = {
    0: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    2: 'bg-amber-500/30 text-amber-300 border-amber-500/40',
    3: 'bg-rose-500/40 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/20'
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            Weekly Threat Intensity Heatmap
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500/50"></span> Safe</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/40 border border-amber-500/60"></span> Moderate</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/50 border border-rose-500/70"></span> Critical</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-center text-xs font-mono">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 text-slate-400 uppercase font-semibold">Attack Vector</th>
              {days.map(day => (
                <th key={day} className="py-2 px-3 text-slate-400 uppercase font-semibold">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {vectors.map((vector, vIdx) => (
              <tr key={vector}>
                <td className="text-left py-3 px-3 font-semibold text-slate-300 text-xs">{vector}</td>
                {heatmapData[vIdx].map((val, dIdx) => (
                  <td key={dIdx} className="py-2 px-2">
                    <div className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold ${intensityColors[val]}`}>
                      {val === 3 ? 'HIGH' : val === 2 ? 'MED' : val === 1 ? 'LOW' : 'SAFE'}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
