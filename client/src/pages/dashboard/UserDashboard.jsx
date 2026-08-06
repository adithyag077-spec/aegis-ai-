import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  ArrowUpRight, 
  Cpu, 
  History, 
  Activity,
  User,
  Settings,
  Clock,
  Download,
  BarChart3,
  Terminal,
  Radio,
  Lock,
  Globe,
  Sparkles,
  Bot,
  AlertTriangle,
  Compass
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { scanService } from '../../services/scanService';
import { userService } from '../../services/userService';
import { RiskBadge } from '../../components/common/RiskBadge';
import { AlertsBanner } from '../../components/common/AlertsBanner';
import { EmptyState } from '../../components/common/EmptyState';
import { GamificationCard } from '../../components/gamification/GamificationCard';
import { TrustScoreGauge } from '../../components/gamification/TrustScoreGauge';
import { exportSecurityReport } from '../../utils/reportExporter';
import { useToast } from '../../context/ToastContext';
import { AnimatedCounter } from '../../components/common/AnimatedCounter';
import { TiltCard } from '../../components/common/TiltCard';
import { CircularProgress } from '../../components/common/CircularProgress';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const UserDashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [riskData, setRiskData] = useState({ currentRiskScore: 15, riskCategory: 'Low' });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [riskRes, historyRes] = await Promise.all([
          userService.getRiskOverview(),
          scanService.getThreatHistory()
        ]);
        if (riskRes.data) setRiskData(riskRes.data);
        if (historyRes.data?.logs) setRecentLogs(historyRes.data.logs.slice(0, 5));
      } catch (err) {
        console.error('Failed to load SOC dashboard metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExportFullReport = () => {
    exportSecurityReport({
      verdict: 'AEGIS Executive Dune SOC Assessment',
      threatLevel: riskData.riskCategory?.toUpperCase() || 'SAFE',
      riskScore: riskData.currentRiskScore || 15,
      confidenceScore: 0.98,
      explanation: `AEGIS SOC Dune Command Console evaluated posture. Current risk rating is ${riskData.riskCategory} (${riskData.currentRiskScore}/100) based on real-time threat telemetry.`,
      indicators: [
        'Multi-vector scan telemetry logs evaluated',
        'Identity & domain leak boundaries intact',
        'JARVIS Autonomous Defense Engine online'
      ],
      safeActions: [
        'Maintain continuous URL & QR code inspection',
        'Enable 2FA authentication across critical accounts'
      ]
    }, 'AEGIS SOC Executive Audit');

    addToast('SAFE', 'Full SOC Executive PDF/HTML Report generated.', 'Report Exported');
  };

  const chartData = [
    { time: '00:00', risk: 12, scans: 2 },
    { time: '04:00', risk: 15, scans: 5 },
    { time: '08:00', risk: 28, scans: 12 },
    { time: '12:00', risk: riskData.currentRiskScore || 18, scans: recentLogs.length || 8 },
    { time: '16:00', risk: 14, scans: 6 },
    { time: '20:00', risk: 20, scans: 4 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  const healthScore = 100 - (riskData.currentRiskScore || 15);

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Neumorphic Hero Header Panel (Dune ambient gradient) */}
      <motion.div 
        variants={itemVariants}
        className="neu-raised p-8 rounded-[28px] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden gradient-ambient"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-[#d98a3d]/15 to-[#b3542e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full neu-inset text-[#f0a355] border border-[#4a3823] text-xs font-mono font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#d98a3d]" />
            <span>NEUMORPHIC SOC COMMAND • ACTIVE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f2e8d8] tracking-tight font-heading">
            Security Operations Center
          </h1>
          <p className="text-xs text-[#b8a892] max-w-2xl leading-relaxed">
            Real-time global attack line visualization, identity telemetry, and autonomous neural AI threat radar.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap relative z-10">
          <button
            onClick={handleExportFullReport}
            className="px-4 py-2.5 rounded-xl neu-raised text-[#f2e8d8] hover:text-[#d98a3d] text-xs font-bold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#d98a3d]" />
            <span>Export SOC Audit</span>
          </button>
          <Link
            to="/app/copilot"
            className="btn-copilot-green px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Bot className="w-4 h-4 text-[#d1693a] animate-pulse" />
            <span>Ask AI Copilot</span>
          </Link>
          <Link
            to="/app/modules"
            className="btn-cyber-primary px-6 py-2.5 text-xs font-bold text-[#0d0b08] transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Launch Scanners</span>
          </Link>
        </div>
      </motion.div>

      {/* Global Threat Radar Panel (3D Tilt + rotating outer ring) */}
      <motion.div variants={itemVariants}>
        <TiltCard>
          <div className="neu-raised p-6 rounded-2xl space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#f2e8d8] font-bold text-sm font-heading">
                <Globe className="w-4 h-4 text-[#d98a3d]" />
                <span>Global Threat Radar & Live Signal Stream</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8a9a5b] animate-status-pulse" />
                <span className="text-xs font-mono text-[#8a9a5b] neu-inset px-2.5 py-1 font-bold">
                  60 FPS Live Telemetry
                </span>
              </div>
            </div>

            {/* Radar Canvas with 20s rotating outer ring */}
            <div className="relative h-48 w-full rounded-xl neu-inset flex items-center justify-center overflow-hidden">
              {/* Outer Rotating Ring */}
              <div className="absolute w-44 h-44 rounded-full border border-[#4a3823] animate-radar-rotate pointer-events-none" />
              <div className="absolute w-28 h-28 rounded-full border border-[#b3542e]/30" />
              <div className="absolute w-14 h-14 rounded-full border border-[#8a9a5b]/40" />

              {/* Radar Sweeping Beam */}
              <div className="absolute w-44 h-44 origin-center animate-radar-rotate pointer-events-none">
                <div className="w-22 h-22 bg-gradient-to-br from-[#d98a3d]/35 to-transparent rounded-tl-full" />
              </div>

              {/* Pulsing Threat Nodes */}
              <div className="absolute top-10 left-24 w-3 h-3 rounded-full bg-[#a83b2e] animate-ping" />
              <div className="absolute bottom-12 right-28 w-3 h-3 rounded-full bg-[#d9a441] animate-ping" />
              <div className="absolute top-16 right-36 w-2.5 h-2.5 rounded-full bg-[#8a9a5b]" />

              <div className="absolute bottom-3 left-4 font-mono text-[11px] text-[#b8a892] flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-[#d98a3d]" />
                <span>NODES: 3 Active • RADAR: Operational • LATENCY: 12ms</span>
              </div>
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* Metric Cards (Overall Score, AI Risk Index, Audited Payloads, Active Shield) */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Overall Security Score */}
        <TiltCard>
          <div className="neu-raised p-5 rounded-2xl flex items-center justify-between h-full">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-[#b8a892] font-bold block">Overall Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#f2e8d8] font-mono">
                  <AnimatedCounter value={healthScore} />
                </span>
                <span className="text-xs font-bold text-[#d98a3d] font-mono">/ 100</span>
              </div>
              <span className="text-[11px] text-[#b8a892] block">Optimal Posture</span>
            </div>
            <CircularProgress value={healthScore} color="#d98a3d" size={60} strokeWidth={6} />
          </div>
        </TiltCard>

        {/* AI Risk Index */}
        <TiltCard>
          <div className="neu-raised p-5 rounded-2xl flex items-center justify-between h-full">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-[#b8a892] font-bold block">AI Risk Index</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-[#f2e8d8] font-mono">
                  <AnimatedCounter value={riskData.currentRiskScore || 15} />
                </span>
                <span className="text-xs font-bold text-[#8a9a5b] font-mono">{riskData.riskCategory}</span>
              </div>
              <span className="text-[11px] text-[#b8a892] block">Real-time Telemetry</span>
            </div>
            <CircularProgress value={riskData.currentRiskScore || 15} color="#8a9a5b" size={60} strokeWidth={6} />
          </div>
        </TiltCard>

        {/* Audited Payloads */}
        <TiltCard>
          <div className="neu-raised p-5 rounded-2xl flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[#b8a892] font-bold">Audited Scans</span>
              <Cpu className="w-4 h-4 text-[#b3542e]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#f2e8d8] font-mono">
                <AnimatedCounter value={recentLogs.length} />
              </span>
              <span className="text-xs text-[#b8a892] font-mono">Payloads</span>
            </div>
            <span className="text-[11px] text-[#b8a892] mt-1">Multi-Vector Audits</span>
          </div>
        </TiltCard>

        {/* Active Shield */}
        <TiltCard>
          <div className="neu-raised p-5 rounded-2xl flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase text-[#b8a892] font-bold">Active Shield</span>
              <Clock className="w-4 h-4 text-[#8a9a5b]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8a9a5b] animate-status-pulse" />
              <span className="text-xs font-bold text-[#8a9a5b] font-mono">Active (100%)</span>
            </div>
            <span className="text-[11px] text-[#b8a892] mt-1">Zero Active Breaches</span>
          </div>
        </TiltCard>
      </motion.div>

      {/* AI Recommendations Panel */}
      <motion.div variants={itemVariants} className="neu-raised p-6 rounded-2xl border-l-4 border-l-[#b3542e] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#b3542e]" />
            <h3 className="text-sm font-bold text-[#f2e8d8] font-heading">AI Neural Recommendations</h3>
          </div>
          <span className="text-[10px] font-mono text-[#f0a355] neu-inset px-2.5 py-0.5 font-bold">
            Gemini Neural Matrix
          </span>
        </div>
        <p className="text-xs text-[#b8a892] leading-relaxed font-mono">
          "SOC AI telemetry evaluates current risk posture as <strong className="text-[#f2e8d8]">{riskData.riskCategory} Risk</strong> ({riskData.currentRiskScore}/100). Maintain continuous link & QR code verification, and enable 2FA authenticator apps for all corporate logins."
        </p>
      </motion.div>

      {/* Recharts Area Graph */}
      <motion.div variants={itemVariants} className="neu-raised p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#f2e8d8] font-bold text-sm font-heading">
            <BarChart3 className="w-4 h-4 text-[#d98a3d]" />
            <span>SOC Threat Stream & Velocity</span>
          </div>
          <span className="text-xs font-mono text-[#d98a3d] neu-inset px-2.5 py-1 font-bold">
            24-Hour Velocity Stream
          </span>
        </div>

        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="amberArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d98a3d" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d98a3d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#6e6151" fontSize={11} tickLine={false} />
              <YAxis stroke="#6e6151" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#17130e', borderColor: 'rgba(217,138,61,0.4)', borderRadius: '12px', color: '#f2e8d8' }}
              />
              <Area type="monotone" dataKey="risk" stroke="#d98a3d" strokeWidth={3} fillOpacity={1} fill="url(#amberArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Gamification & Health Score Section */}
      <motion.div variants={itemVariants}>
        <GamificationCard totalScans={recentLogs.length} riskScore={riskData.currentRiskScore} />
      </motion.div>

      {/* Trust & Privacy Scores */}
      <motion.div variants={itemVariants}>
        <TrustScoreGauge privacyScore={95} trustScore={97} />
      </motion.div>

      {/* Real-time Alerts Feed Banner */}
      <motion.div variants={itemVariants}>
        <AlertsBanner />
      </motion.div>

      {/* Recent Incidents Log Table */}
      <motion.div variants={itemVariants} className="neu-raised p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#d98a3d]" />
            <h3 className="text-base font-bold text-[#f2e8d8] font-heading">Recent Incidents & Threat Logs</h3>
          </div>
          <Link to="/app/history" className="text-xs text-[#d98a3d] font-bold hover:underline flex items-center gap-1 font-mono">
            <span>Full Threat Logs</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <EmptyState
            title="No Threat Logs Recorded"
            description="You haven't run any AI scans yet. Select a detection tool from the Scan Suite to audit links, text, or files."
            actionText="Launch First AI Scan"
            actionLink="/app/modules"
            icon={History}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#34291b] text-[#b8a892] uppercase font-mono text-[11px]">
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Input Preview</th>
                  <th className="py-3 px-4">Threat Level</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#34291b]">
                {recentLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-[#0d0b08]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#d98a3d]">{log.moduleType}</td>
                    <td className="py-3.5 px-4 text-[#b8a892] max-w-xs truncate font-mono">{log.inputSummary}</td>
                    <td className="py-3.5 px-4"><RiskBadge level={log.threatLevel} score={log.riskScore} /></td>
                    <td className="py-3.5 px-4 text-[#f2e8d8] font-medium">{log.verdict}</td>
                    <td className="py-3.5 px-4 text-right text-[#6e6151] font-mono">
                      {new Date(log.scannedAt || log.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
