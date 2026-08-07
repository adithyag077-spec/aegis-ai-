import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  KeyRound, 
  Smartphone, 
  History, 
  Lock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Info
} from 'lucide-react';
import { breachService } from '../../services/breachService';
import { useToast } from '../../context/ToastContext';
import { CardSkeleton, TableSkeleton } from '../../components/common/SkeletonLoader';

export const DataBreachMonitorPage = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await breachService.getHistory();
      const logsList = res.data?.logs || res.logs || (Array.isArray(res) ? res : []);
      if (Array.isArray(logsList)) {
        setHistory(logsList);
      }
    } catch (err) {
      console.error('Failed to load breach history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCheckBreach = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('DANGER', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const res = await breachService.checkBreach({ email });
      const rawResult = res?.data?.result || res?.result || res?.data || res;
      if (rawResult && typeof rawResult === 'object') {
        const validatedResult = {
          ...rawResult,
          breachesFound: Array.isArray(rawResult.breachesFound) ? rawResult.breachesFound : [],
          breachCount: typeof rawResult.breachCount === 'number' ? rawResult.breachCount : 0,
          recommendations: rawResult.recommendations || {}
        };
        setResult(validatedResult);
        if (validatedResult.breachCount > 0) {
          addToast('WARNING', `Identified ${validatedResult.breachCount} data breach exposures for ${email}`, 'Breach Detected');
        } else {
          addToast('SAFE', `No public breach exposures detected for ${email}`, 'Clean Audit');
        }
        loadHistory();
      }
    } catch (err) {
      addToast('DANGER', 'Failed to perform breach analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-level-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF6B35] uppercase tracking-widest mb-1.5 font-bold">
            <Lock className="w-4 h-4 text-[#FF6B35]" />
            <span>IDENTITY LEAK & BREACH AUDIT CENTER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F2F1ED] font-heading">Data Breach Monitor</h1>
          <p className="text-xs text-[#9A9CA5] mt-1 max-w-2xl">
            Scan your email address against known global data breach compilations to detect exposed passwords, PII, and security compromises.
          </p>
        </div>
      </div>

      {/* Email Input Form */}
      <div className="glass-card p-8 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#14161B]/70 space-y-4">
        <form onSubmit={handleCheckBreach} className="space-y-4">
          <label className="block text-xs font-mono text-[#FF6B35] uppercase tracking-wider font-bold">
            Enter Email Address to Audit:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9A9CA5] absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full bg-[#0B0C10] border border-[rgba(255,255,255,0.08)] rounded-xl py-3 pl-10 pr-4 text-xs text-[#F2F1ED] placeholder-[#5C5E68] focus:outline-none focus:border-[#FF6B35] font-mono transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-ember-primary px-8 py-3 rounded-xl text-[#F2F1ED] font-bold text-xs shadow-glow-ember flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? 'Inspecting Leaks...' : 'Run Breach Audit'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>

      {/* Audit Result Display */}
      {result && (
        <div className="space-y-6">
          <div className={`glass-panel p-6 rounded-2xl border ${
            result.breachCount > 0 ? 'border-[#FF4D6D]/40 bg-[#FF4D6D]/10' : 'border-[#00E5A0]/40 bg-[#00E5A0]/10'
          } space-y-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.breachCount > 0 ? (
                  <AlertTriangle className="w-6 h-6 text-[#FF4D6D]" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-[#00E5A0]" />
                )}
                <div>
                  <h2 className="text-xl font-bold text-[#F2F1ED] font-heading">
                    {result.breachCount > 0 ? `${result.breachCount} Breach Exposure(s) Found` : 'No Breaches Found'}
                  </h2>
                  <span className="text-xs font-mono text-[#9A9CA5]">Audited Target: {result.email} • Risk Level: <strong className="text-[#F2F1ED]">{result.riskLevel}</strong></span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#9A9CA5] leading-relaxed font-mono bg-[#0B0C10] p-3.5 rounded-xl border border-slate-800">
              <Info className="w-4 h-4 text-[#FF6B35] inline-block mr-2 -mt-0.5" />
              {result.recommendations.aiSummary}
            </p>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0B0C10] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F2F1ED]">
                  <KeyRound className="w-4 h-4 text-[#FFB84D]" />
                  <span>Password Reset Protocol</span>
                </div>
                <p className="text-xs text-[#9A9CA5]">
                  {result.recommendations.passwordChangeNeeded 
                    ? 'CRITICAL: Change your password immediately to prevent credential stuffing attacks.' 
                    : 'Your password exposure status is clear.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0C10] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#F2F1ED]">
                  <Smartphone className="w-4 h-4 text-[#00E5A0]" />
                  <span>MFA / 2FA Recommendation</span>
                </div>
                <p className="text-xs text-[#9A9CA5]">
                  Enable Multi-Factor Authentication (MFA) using an Authenticator App to protect logins.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Breaches List */}
          {result.breachesFound.length > 0 && (
            <div className="glass-card p-6 rounded-2xl border border-[#FF4D6D]/30 space-y-4 bg-[#14161B]/70">
              <h3 className="text-sm font-bold text-[#F2F1ED] flex items-center gap-2 font-heading">
                <ShieldAlert className="w-4 h-4 text-[#FF4D6D]" />
                <span>Compromised Breach Records</span>
              </h3>
              <div className="space-y-3">
                {result.breachesFound.map((b, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0B0C10] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F2F1ED]">{b.name} ({b.domain})</span>
                      <span className="text-[10px] font-mono text-[#9A9CA5]">Date: {b.breachDate}</span>
                    </div>
                    <p className="text-xs text-[#9A9CA5]">{b.description}</p>
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="text-[10px] font-mono text-[#9A9CA5]">Exposed Data:</span>
                      {b.compromisedData?.map((dataItem, dIdx) => (
                        <span key={dIdx} className="text-[10px] font-mono text-[#FF4D6D] bg-[#FF4D6D]/10 px-2 py-0.5 rounded border border-[#FF4D6D]/20">
                          {dataItem}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audit History Table */}
      <div className="glass-panel p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] space-y-4 bg-[#14161B]/70">
        <div className="flex items-center gap-2 text-[#F2F1ED] font-bold text-base font-heading">
          <History className="w-5 h-5 text-[#FF6B35]" />
          <span>Past Data Breach Inspections</span>
        </div>

        {loadingHistory ? (
          <TableSkeleton rows={3} />
        ) : history.length === 0 ? (
          <p className="text-xs text-[#9A9CA5] italic">No past data breach inspections recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[#9A9CA5] uppercase font-mono text-[11px]">
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Breach Count</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4 text-right">Checked At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((log) => (
                  <tr key={log._id} className="hover:bg-[#1A1D24]/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[#F2F1ED]">{log.email}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#FF6B35]">{log.breachCount} Leaks</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        log.riskLevel === 'SAFE' ? 'bg-[#00E5A0]/10 text-[#00E5A0] border-[#00E5A0]/30' : 'bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/30'
                      }`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#5C5E68] font-mono">
                      {new Date(log.checkedAt || log.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataBreachMonitorPage;
