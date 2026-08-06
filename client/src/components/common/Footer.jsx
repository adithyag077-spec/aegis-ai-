import React from 'react';
import { Shield, Radio } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-[#34291b] bg-[#0d0b08] py-6 text-center text-[#b8a892] text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#d98a3d]" />
          <span className="font-bold text-[#f2e8d8] tracking-wide font-heading">AEGIS SOC Platform</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#b8a892]">
          <Radio className="w-3.5 h-3.5 text-[#8a9a5b] animate-pulse" />
          <span>MongoDB Atlas Connected • JARVIS Telemetry Active</span>
        </div>
        <p className="text-[#6e6151] text-[11px] font-mono">
          © {new Date().getFullYear()} AegisAI Security Inc. Dune Command Console.
        </p>
      </div>
    </footer>
  );
};
