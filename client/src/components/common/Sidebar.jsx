import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  MessageSquareWarning, 
  Globe, 
  QrCode, 
  FileSearch, 
  Lock, 
  History, 
  PieChart, 
  ShieldCheck,
  Activity,
  Zap,
  Clock,
  Building2,
  Cpu,
  Bot,
  Gamepad2,
  Database,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Radio,
  GitCommit,
  FileText
} from 'lucide-react';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState({
    executive: true,
    detection: true,
    analytics: true
  });

  const toggleSection = (sectionKey) => {
    if (collapsed) return;
    setSectionsOpen(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const navGroups = [
    {
      key: 'executive',
      title: 'Executive Command',
      icon: Cpu,
      accentColor: 'text-[#d98a3d]',
      items: [
        { label: 'JARVIS SOC Console', path: '/app/dashboard', icon: LayoutDashboard },
        { label: 'AI Security Copilot', path: '/app/copilot', icon: Bot, isAi: true },
        { label: 'AI Incident Response', path: '/app/incident-response', icon: GitCommit, isAi: true },
        { label: 'Case Management', path: '/app/cases', icon: FileText },
        { label: 'AI Attack Simulator', path: '/app/simulator', icon: Gamepad2 },
        { label: 'Data Breach Monitor', path: '/app/breach-monitor', icon: Database },
        { label: 'Universal Security Center', path: '/app/security-center', icon: ShieldCheck },
      ]
    },
    {
      key: 'detection',
      title: 'Threat Detection Suite',
      icon: ShieldAlert,
      accentColor: 'text-[#b3542e]',
      items: [
        { label: 'Phishing Detector', path: '/app/modules/phishing', icon: ShieldAlert },
        { label: 'Scam Text Analyzer', path: '/app/modules/scam-text', icon: MessageSquareWarning },
        { label: 'Fake Website Audit', path: '/app/modules/fake-website', icon: Globe },
        { label: 'QR Code Inspector', path: '/app/modules/qr-scanner', icon: QrCode },
        { label: 'Sensitive Doc Audit', path: '/app/modules/doc-scanner', icon: FileSearch },
        { label: 'Privacy Data Leak', path: '/app/modules/privacy-leak', icon: Lock },
      ]
    },
    {
      key: 'analytics',
      title: 'Analytics & Telemetry',
      icon: Activity,
      accentColor: 'text-[#8a9a5b]',
      items: [
        { label: 'Threat History', path: '/app/history', icon: History },
        { label: 'Security Analytics', path: '/app/analytics', icon: PieChart },
        { label: 'Security Timeline', path: '/app/timeline', icon: Clock },
        { label: 'Recommendation Hub', path: '/app/recommendations', icon: Zap },
        { label: 'Org Enterprise View', path: '/app/org-dashboard', icon: Building2 },
      ]
    }
  ];

  return (
    <aside className={`neu-raised min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex rounded-2xl my-2 bg-[#17130e] transition-all duration-300 relative ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full neu-raised text-[#d98a3d] flex items-center justify-center hover:shadow-glow-primary transition-all z-20"
        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="space-y-5 overflow-y-auto max-h-[calc(100vh-10rem)] pr-1">
        {navGroups.map((group) => {
          const GroupIcon = group.icon;
          const isOpen = sectionsOpen[group.key];

          return (
            <div key={group.key} className="space-y-1">
              {!collapsed ? (
                <button
                  onClick={() => toggleSection(group.key)}
                  className="w-full px-3 py-1.5 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-[#6e6151] font-bold hover:text-[#f2e8d8] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <GroupIcon className={`w-3 h-3 ${group.accentColor}`} />
                    <span>{group.title}</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
                </button>
              ) : (
                <div className="w-full flex justify-center py-2 text-[#6e6151]">
                  <GroupIcon className={`w-3.5 h-3.5 ${group.accentColor}`} />
                </div>
              )}

              <AnimatePresence initial={false}>
                {(isOpen || collapsed) && (
                  <motion.nav 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 overflow-hidden"
                  >
                    {group.items.map((item) => {
                      const ItemIcon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          title={collapsed ? item.label : undefined}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                              isActive
                                ? 'neu-inset text-[#f0a355] border-l-2 border-l-[#d98a3d] font-bold shadow-[inset_2px_0_0_#d98a3d]'
                                : 'text-[#b8a892] hover:text-[#f2e8d8] hover:bg-[#0d0b08]/50'
                            } ${collapsed ? 'justify-center px-0' : ''}`
                          }
                        >
                          <ItemIcon className={`w-4 h-4 shrink-0 ${item.isAi ? 'text-[#d1693a]' : ''}`} />
                          {!collapsed && (
                            <div className="flex items-center justify-between w-full">
                              <span className="truncate">{item.label}</span>
                              {item.isAi && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#7a3a1f]/30 text-[#d1693a] border border-[#b3542e]/30 font-bold">
                                  AI
                                </span>
                              )}
                            </div>
                          )}
                        </NavLink>
                      );
                    })}
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Cyber Status Footer Widget */}
      {!collapsed && (
        <div className="neu-inset p-3.5 rounded-xl mt-4">
          <div className="flex items-center gap-2 text-[#d98a3d] font-bold text-xs mb-1 font-heading">
            <Radio className="w-3.5 h-3.5 text-[#d98a3d] animate-pulse" />
            <span>JARVIS Neural Matrix</span>
          </div>
          <p className="text-[10px] text-[#b8a892] font-mono leading-relaxed">
            Dune Spice Telemetry & MongoDB Atlas Active.
          </p>
        </div>
      )}
    </aside>
  );
};
