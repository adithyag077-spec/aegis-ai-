import React from 'react';
import { Cpu } from 'lucide-react';

export const LoadingRadar = ({ message = "AI Cyber Defense Engine Inspecting Payload..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl border border-emerald-500/20 my-6">
      <div className="relative w-24 h-24 flex items-center justify-center mb-6">
        {/* Animated Cyber Radar Rings */}
        <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping"></div>
        <div className="absolute inset-2 rounded-full border border-indigo-500/30 animate-pulse"></div>
        <div className="absolute inset-4 rounded-full border border-emerald-500/50 animate-spin-slow"></div>
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-400 flex items-center justify-center text-emerald-400 cyber-glow-emerald">
          <Cpu className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-100 tracking-wide text-center mb-1">
        {message}
      </h3>
      <p className="text-xs font-mono text-emerald-400 animate-pulse">
        Gemini 1.5 Security Model Analyzing Indicators & Signatures...
      </p>
    </div>
  );
};
