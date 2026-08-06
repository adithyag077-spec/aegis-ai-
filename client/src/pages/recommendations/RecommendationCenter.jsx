import React from 'react';
import { Zap, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecommendationCenter = () => {
  const recommendations = [
    {
      id: 'rec_1',
      category: 'Immediate Action Required',
      priority: 'HIGH',
      title: 'Revoke Exposed AWS & Database Credentials',
      description: 'System identified raw API token strings in document upload audit log. Revoke active tokens and re-issue encrypted secrets.',
      actionText: 'Launch Sensitive Doc Scanner',
      actionPath: '/app/modules/doc-scanner',
      badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
    },
    {
      id: 'rec_2',
      category: 'Immediate Action Required',
      priority: 'HIGH',
      title: 'Block Typosquatting Phishing Domain',
      description: 'Add verify-account-bank-update.xyz to corporate WAF and DNS blacklist.',
      actionText: 'Launch Phishing Scanner',
      actionPath: '/app/modules/phishing',
      badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-400'
    },
    {
      id: 'rec_3',
      category: 'Preventive Action',
      priority: 'MEDIUM',
      title: 'Enforce Public QR Payload Verification',
      description: 'Instruct employees to use AegisAI QR inspector before connecting to public Wi-Fi access points or scanning posters.',
      actionText: 'Launch QR Inspector',
      actionPath: '/app/modules/qr-scanner',
      badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    },
    {
      id: 'rec_4',
      category: 'Long-Term Infrastructure Improvement',
      priority: 'STRATEGIC',
      title: 'Implement Zero-Trust Email DMARC & DKIM Headers',
      description: 'Strengthen email authentication records to prevent domain spoofing by threat actors.',
      actionText: 'View Threat Intelligence',
      actionPath: '/app/threat-intelligence',
      badgeColor: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white shadow-lg">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">AI Recommendation Center</h1>
          <p className="text-xs text-slate-400">Contextual defense advice prioritized by threat urgency & impact.</p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">{rec.category}</span>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${rec.badgeColor}`}>
                Priority: {rec.priority}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-100">{rec.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>

            <div className="pt-2 flex justify-end">
              <Link
                to={rec.actionPath}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>{rec.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
