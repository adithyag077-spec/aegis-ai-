import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ShieldAlert, 
  Database, 
  Activity, 
  Radio, 
  ExternalLink,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ThreatIntelPage = () => {
  const { addToast } = useToast();
  const [iocQuery, setIocQuery] = useState('');
  const [iocResult, setIocResult] = useState(null);

  const threatActors = [
    { name: 'APT29 (Cozy Bear)', sector: 'Government & Defense', signature: 'Spearphishing & OAuth token theft', risk: 'CRITICAL' },
    { name: 'FIN7', sector: 'Financial & Retail', signature: 'POS malware & credentials harvesting', risk: 'HIGH' },
    { name: 'Lazarus Group', sector: 'Cryptocurrency & Banking', signature: 'SWIFT network manipulation & ransomware', risk: 'CRITICAL' },
    { name: 'LockBit 3.0', sector: 'Enterprise & Healthcare', signature: 'Double extortion ransomware payloads', risk: 'CRITICAL' }
  ];

  const sampleIOCs = [
    { indicator: '198.51.100.42', type: 'IP Address', threatType: 'C2 Command Server', confidence: '98%' },
    { indicator: 'auth-sso-verify-login.xyz', type: 'Domain Name', threatType: 'Phishing Harvester', confidence: '95%' },
    { indicator: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', type: 'SHA-256 Hash', threatType: 'Ransomware Dropper', confidence: '99%' }
  ];

  const handleSearchIOC = (e) => {
    e.preventDefault();
    if (!iocQuery.trim()) return;

    // Simulate real-time IOC Lookup against threat intelligence databases
    setIocResult({
      query: iocQuery,
      isMalicious: true,
      confidence: '97%',
      category: 'Command & Control Server (C2)',
      reputationScore: 'Critical Risk (92/100)',
      associatedActor: 'APT29 (Cozy Bear)',
      recommendations: [
        'Block IP/Domain at perimeter firewall immediately.',
        'Revoke active SSO refresh tokens for connected user sessions.',
        'Run endpoint memory scan for DLL injection artifacts.'
      ]
    });

    addToast('DANGER', `IOC Alert: High threat confidence identified for ${iocQuery}`, 'IOC Matched');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-level-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF6B35] uppercase tracking-widest mb-1.5 font-bold">
            <Globe className="w-4 h-4 text-[#FF6B35]" />
            <span>GLOBAL THREAT INTELLIGENCE & IOC DATABASE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F2F1ED] font-heading">Global Threat Intelligence</h1>
          <p className="text-xs text-[#9A9CA5] mt-1 max-w-2xl">
            Inspect Indicators of Compromise (IOCs), search threat actor signatures, and track real-time attack vectors.
          </p>
        </div>
      </div>

      {/* IOC Search Bar */}
      <div className="glass-card p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/70 space-y-4">
        <form onSubmit={handleSearchIOC} className="space-y-3">
          <label className="block text-xs font-mono text-[#FF6B35] uppercase tracking-wider font-bold">
            Search Threat Intelligence IOC Database (IP, Domain, File Hash):
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9A9CA5] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={iocQuery}
                onChange={(e) => setIocQuery(e.target.value)}
                placeholder="e.g. 198.51.100.42 or hxxps://malicious-login.xyz"
                className="w-full bg-[#0B0C10] border border-[rgba(255,255,255,0.08)] rounded-xl py-3 pl-10 pr-4 text-xs text-[#F2F1ED] placeholder-[#5C5E68] focus:outline-none focus:border-[#FF6B35] font-mono transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-ember-primary px-8 py-3 rounded-xl text-[#F2F1ED] font-bold text-xs shadow-glow-ember shrink-0"
            >
              Search Threat IOC
            </button>
          </div>
        </form>
      </div>

      {/* IOC Search Result */}
      {iocResult && (
        <div className="glass-panel p-6 rounded-2xl border border-[#FF4D6D]/40 bg-[#FF4D6D]/10 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-[#FF4D6D]" />
              <div>
                <h3 className="text-base font-bold text-[#F2F1ED] font-heading">Malicious Indicator Detected</h3>
                <span className="text-[#9A9CA5]">Target: <strong>{iocResult.query}</strong> • Confidence: <strong className="text-[#FF6B35]">{iocResult.confidence}</strong></span>
              </div>
            </div>
            <span className="px-3 py-1 rounded bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/40 font-bold">
              {iocResult.reputationScore}
            </span>
          </div>

          <p className="text-[#9A9CA5] bg-[#0B0C10] p-3 rounded-xl border border-slate-800">
            Associated Threat Actor: <strong className="text-[#00E5A0]">{iocResult.associatedActor}</strong> • Classification: <strong className="text-[#F2F1ED]">{iocResult.category}</strong>
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[#FF6B35] uppercase font-bold block">Recommended SOC Action Items:</span>
            {iocResult.recommendations.map((rec, rIdx) => (
              <div key={rIdx} className="flex items-center gap-2 text-[#9A9CA5]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5A0]" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Threat Actor Profiles Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#F2F1ED] font-heading flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#FF6B35]" />
          <span>Active Threat Actor Profiles & Signatures</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {threatActors.map((actor, idx) => (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F2F1ED] font-heading">{actor.name}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  actor.risk === 'CRITICAL' ? 'bg-[#FF4D6D]/15 text-[#FF4D6D] border-[#FF4D6D]/30' : 'bg-[#FFB84D]/15 text-[#FFB84D] border-[#FFB84D]/30'
                }`}>
                  {actor.risk}
                </span>
              </div>
              <p className="text-xs text-[#9A9CA5] font-mono">Target Sector: <strong className="text-[#F2F1ED]">{actor.sector}</strong></p>
              <p className="text-xs text-[#9A9CA5] font-mono bg-[#0B0C10] p-2.5 rounded-lg border border-slate-800">
                Signature: {actor.signature}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelPage;
