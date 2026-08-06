import React, { useState } from 'react';
import { Settings, Bell, Lock, Key, Save, Check } from 'lucide-react';

export const SettingsPage = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [highRiskNotify, setHighRiskNotify] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Defense System Settings</h1>
          <p className="text-xs text-slate-400">Configure notification triggers, security preferences & API keys.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification Preferences */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Alert & Notification Rules</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-slate-200 block">Email Threat Warnings</span>
                <span className="text-[11px] text-slate-400">Receive instant email alerts when CRITICAL phishing/leak attempts are intercepted.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-slate-200 block">High-Risk Score Threshold Notification</span>
                <span className="text-[11px] text-slate-400">Alert when account threat score exceeds 50/100.</span>
              </div>
              <input
                type="checkbox"
                checked={highRiskNotify}
                onChange={(e) => setHighRiskNotify(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>
        </div>

        {/* Security & API Key Placeholders */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Security & API Configuration</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">Backend Server Proxy API Endpoint</label>
              <input
                type="text"
                readOnly
                value={import.meta.env.VITE_API_BASE_URL || '/api/v1'}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 font-mono text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-mono text-[11px] uppercase mb-1">AI Engine Security Isolation</label>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>Google Gemini API Key is locked on server environment (`GEMINI_API_KEY`). Zero exposure in client.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
