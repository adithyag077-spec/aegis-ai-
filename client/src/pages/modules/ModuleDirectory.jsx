import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  MessageSquareWarning, 
  Globe, 
  QrCode, 
  FileSearch, 
  Lock, 
  ArrowRight
} from 'lucide-react';

export const ModuleDirectory = () => {
  const modules = [
    { title: 'Phishing Detector', path: '/app/modules/phishing', desc: 'Scan URLs or suspicious emails for spear-phishing & domain spoofing.', icon: ShieldAlert, color: 'text-rose-400 border-rose-500/20 bg-rose-500/10' },
    { title: 'Scam Text Analyzer', path: '/app/modules/scam-text', desc: 'Audit SMS, Telegram & WhatsApp messages for financial extortion or scam patterns.', icon: MessageSquareWarning, color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
    { title: 'Fake Website Audit', path: '/app/modules/fake-website', desc: 'Deep verify e-commerce domain authenticity & credential harvesting clones.', icon: Globe, color: 'text-sky-400 border-sky-500/20 bg-sky-500/10' },
    { title: 'QR Code Inspector', path: '/app/modules/qr-scanner', desc: 'Safely decode QR image payloads before navigating to untrusted endpoints.', icon: QrCode, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
    { title: 'Sensitive Doc Audit', path: '/app/modules/doc-scanner', desc: 'Upload documents (.pdf, .txt, .docx) to detect unencrypted PII or credentials.', icon: FileSearch, color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' },
    { title: 'Privacy Data Leak Check', path: '/app/modules/privacy-leak', desc: 'Scan text inputs for exposed secrets, passwords, SSNs, and API keys.', icon: Lock, color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100">AI Cyber Security Modules</h1>
        <p className="text-xs text-slate-400 mt-1">Select a specialized threat vector to execute autonomous AI payload inspection.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-sky-500/40 transition-all group">
              <div>
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 transition-transform group-hover:scale-105 ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100 mb-2">{m.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">{m.desc}</p>
              </div>

              <Link
                to={m.path}
                className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 text-xs font-semibold hover:border-sky-500/40 hover:bg-sky-500/10 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
