import React, { useEffect, useState } from 'react';
import { PieChart as PieIcon, LineChart as LineIcon, BarChart3, ShieldCheck } from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { userService } from '../../services/userService';

export const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [riskOverview, setRiskOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [aRes, rRes] = await Promise.all([
          userService.getUserAnalytics(),
          userService.getRiskOverview()
        ]);
        if (aRes.data) setAnalytics(aRes.data);
        if (rRes.data) setRiskOverview(rRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#8a9a5b', '#d98a3d', '#d9a441', '#a83b2e', '#b3542e', '#5b7a75'];

  const historyArray = Array.isArray(riskOverview?.history) 
    ? riskOverview.history 
    : (Array.isArray(riskOverview) ? riskOverview : null);

  const timelineData = historyArray ? historyArray.map((h, i) => ({
    time: new Date(h.calculatedAt || Date.now() - (5 - i) * 86400000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: h.score
  })) : [
    { time: 'Day 1', score: 10 },
    { time: 'Day 2', score: 25 },
    { time: 'Day 3', score: 18 },
    { time: 'Day 4', score: 45 },
    { time: 'Day 5', score: 15 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <PieIcon className="w-6 h-6 text-emerald-400" />
          <span>Security Threat Analytics</span>
        </h1>
        <p className="text-xs text-slate-400">Recharts visual analytics of multi-vector threat distributions and score trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Trendline Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <LineIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Risk Score Progression</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '8px', color: '#F8FAFC' }} />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Vector Distribution Pie Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Module Threat Distribution</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.threatDistributionData || [
                    { name: 'Phishing', value: 4 },
                    { name: 'Scam Text', value: 3 },
                    { name: 'Fake Website', value: 2 },
                    { name: 'QR Scan', value: 3 },
                    { name: 'Sensitive Doc', value: 1 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '8px', color: '#F8FAFC' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
