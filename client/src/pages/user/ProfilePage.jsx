import React from 'react';
import { User, ShieldCheck, Mail, Key, Clock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Cyber Agent Profile</h1>
          <p className="text-xs text-slate-400">Manage identity credentials and defense parameters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 md:col-span-1 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 p-0.5 shadow-xl">
            <div className="w-full h-full bg-[#090D16] rounded-full flex items-center justify-center text-emerald-400 text-2xl font-bold">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{user?.fullName || 'Cyber Agent'}</h3>
            <span className="text-xs font-mono text-emerald-400">{user?.email || 'agent@aegis.ai'}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role: {user?.role?.toUpperCase() || 'USER'}</span>
          </div>
        </div>

        {/* Identity Details Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
            Account Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Current Risk Rating</span>
              <span className="font-semibold text-emerald-400">{user?.currentRiskScore || 15}/100 ({user?.riskCategory || 'Low'})</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Account Authorization</span>
              <span className="font-semibold text-slate-200">JWT Token Auth Verified</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Session Status</span>
              <span className="font-semibold text-emerald-400">Active Session</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Encryption Protocol</span>
              <span className="font-semibold text-slate-200">Bcrypt (12 Rounds)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
