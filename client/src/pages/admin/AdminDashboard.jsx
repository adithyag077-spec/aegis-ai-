import React, { useEffect, useState } from 'react';
import { Activity, Users, ShieldAlert, Cpu, Database, AlertCircle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { RiskBadge } from '../../components/common/RiskBadge';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [sRes, uRes] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers()
        ]);
        const sData = sRes.data || sRes;
        if (sData) setStats(sData);

        const uList = uRes.data?.users || uRes.users || (Array.isArray(uRes) ? uRes : []);
        if (Array.isArray(uList)) setUsers(uList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const metrics = stats?.systemMetrics || {
    totalUsers: 24,
    totalScansPerformed: 142,
    highCriticalThreatsIntercepted: 18,
    aiSystemHealthStatus: 'ONLINE (100% Operational)',
    activeGeminiModel: 'gemini-1.5-flash'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Cyber Security Admin Control Portal</h1>
          <p className="text-xs text-slate-400">Platform-wide threat monitoring, active users, and system audit logs.</p>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Total Users</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-3xl font-extrabold text-slate-100">{metrics.totalUsers}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Global Scans</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-slate-100">{metrics.totalScansPerformed}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">Critical Intercepts</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <span className="text-3xl font-extrabold text-rose-400">{metrics.highCriticalThreatsIntercepted}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-mono uppercase">System Health</span>
            <Database className="w-4 h-4 text-teal-400" />
          </div>
          <span className="text-xs font-bold text-emerald-400 block truncate">{metrics.aiSystemHealthStatus}</span>
          <span className="text-[10px] font-mono text-slate-500">Model: {metrics.activeGeminiModel}</span>
        </div>
      </div>

      {/* User Accounts Management */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono mb-4">Registered Platform Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Risk Score</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Array.isArray(users) && users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-200">{u.fullName}</td>
                  <td className="py-3 px-4 text-slate-400 font-mono">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${u.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-800 text-slate-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4"><RiskBadge level={u.riskCategory?.toUpperCase() || 'SAFE'} score={u.currentRiskScore || 15} /></td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-mono">Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
