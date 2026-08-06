import React, { memo } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon } from 'lucide-react';

export const RiskBadge = memo(({ level = 'SAFE', score = null }) => {
  const badgeConfig = {
    SAFE: {
      color: 'bg-[#8a9a5b]/10 border-[#8a9a5b]/30 text-[#8a9a5b]',
      icon: ShieldCheck,
      label: 'Safe'
    },
    LOW: {
      color: 'bg-[#8a9a5b]/10 border-[#8a9a5b]/30 text-[#8a9a5b]',
      icon: ShieldCheck,
      label: 'Low Risk'
    },
    MEDIUM: {
      color: 'bg-[#d9a441]/10 border-[#d9a441]/30 text-[#d9a441]',
      icon: AlertTriangle,
      label: 'Moderate Risk'
    },
    HIGH: {
      color: 'bg-[#a83b2e]/10 border-[#a83b2e]/30 text-[#a83b2e] font-bold',
      icon: ShieldAlert,
      label: 'High Risk'
    },
    CRITICAL: {
      color: 'bg-[#a83b2e]/20 border-[#a83b2e]/50 text-[#a83b2e] font-bold animate-pulse',
      icon: AlertOctagon,
      label: 'Critical Risk'
    }
  };

  const config = badgeConfig[level] || badgeConfig.SAFE;
  const Icon = config.icon;

  return (
    <span
      role="status"
      aria-label={`Security Risk Level: ${config.label}${score !== null ? `, Score: ${score}` : ''}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono border neu-inset ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{config.label}</span>
      {score !== null && <span className="opacity-75">({score})</span>}
    </span>
  );
});

RiskBadge.displayName = 'RiskBadge';
