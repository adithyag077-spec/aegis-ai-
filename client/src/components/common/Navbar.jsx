import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LogOut, 
  LayoutDashboard, 
  History, 
  PieChart, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  Bot, 
  Bell, 
  Command,
  X,
  Menu
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const notifications = [
    { id: 1, title: 'AI Telemetry Active', time: 'Just now', type: 'SAFE' },
    { id: 2, title: 'MongoDB Atlas Sync Clean', time: '4m ago', type: 'INFO' },
    { id: 3, title: 'Zero Active Threat Vectors', time: '10m ago', type: 'SAFE' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#17130e]/90 backdrop-blur-xl border-b border-[#34291b] transition-all py-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-2xl neu-raised flex items-center justify-center text-[#d98a3d] group-hover:shadow-glow-primary transition-all">
            <Shield className="w-5 h-5 text-[#d98a3d]" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[#f2e8d8] flex items-center gap-1.5 font-heading">
              AEGIS<span className="text-[#d98a3d] font-mono text-[11px] px-2 py-0.5 rounded-full neu-inset border border-[#d98a3d]/20">SOC</span>
            </span>
          </div>
        </Link>

        {/* Global Search Pill */}
        {isAuthenticated && (
          <div 
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2.5 neu-inset rounded-full px-4 py-2 text-xs text-[#b8a892] w-72 transition-all cursor-pointer hover:neu-raised hover:text-[#f2e8d8]"
          >
            <Search className="w-3.5 h-3.5 text-[#d98a3d]" />
            <span className="flex-1 truncate font-mono">Search logs, URLs, domains...</span>
            <span className="font-mono text-[10px] bg-[#0d0b08] text-[#b8a892] px-1.5 py-0.5 rounded border border-[#34291b] flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" />K
            </span>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link 
                to="/app/dashboard" 
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#b8a892] hover:text-[#f2e8d8] neu-raised rounded-xl transition-all"
              >
                <LayoutDashboard className="w-4 h-4 text-[#d98a3d]" />
                <span>Console</span>
              </Link>

              {/* Ask AI Copilot Button (Burnt Rust Accent) */}
              <Link 
                to="/app/copilot" 
                className="btn-copilot-green flex items-center gap-2 px-3.5 py-2 text-xs font-bold transition-all"
              >
                <Bot className="w-4 h-4 text-[#d1693a] animate-pulse" />
                <span>Ask AI Copilot</span>
              </Link>

              {/* Notification Center */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2.5 rounded-xl neu-raised text-[#b8a892] hover:text-[#f2e8d8] transition-all relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-[#b8a892]" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8a9a5b] animate-ping" />
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 neu-raised p-4 z-50 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-[#34291b] pb-2">
                      <span className="font-bold text-[#f2e8d8] uppercase text-[11px]">SOC Telemetry Stream</span>
                      <span className="text-[10px] text-[#8a9a5b]">3 New</span>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-2.5 rounded-xl neu-inset flex items-center justify-between">
                          <span className="text-[#f2e8d8] text-[11px] font-medium">{n.title}</span>
                          <span className="text-[10px] text-[#6e6151]">{n.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Avatar */}
              <div className="flex items-center gap-3 pl-3 border-l border-[#34291b]">
                <Link to="/app/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-9 h-9 rounded-full neu-raised flex items-center justify-center text-xs font-bold text-[#d98a3d] font-mono shadow-glow-primary">
                    {user?.fullName?.charAt(0) || 'A'}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl text-[#b8a892] hover:text-[#a83b2e] hover:neu-raised transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-semibold text-[#b8a892] hover:text-[#f2e8d8] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-cyber-primary px-5 py-2.5 text-xs font-bold text-[#0d0b08]"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl neu-raised text-[#b8a892] hover:text-[#f2e8d8]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#0d0b08]/80 backdrop-blur-md flex items-start justify-center pt-24 p-4">
          <div className="w-full max-w-xl neu-raised p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#34291b] pb-3">
              <div className="flex items-center gap-3 flex-1">
                <Search className="w-5 h-5 text-[#d98a3d]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search threat logs, scanners, modules..."
                  className="w-full bg-transparent text-sm text-[#f2e8d8] placeholder-[#6e6151] focus:outline-none font-mono"
                />
              </div>
              <button onClick={() => setSearchOpen(false)} className="text-[#b8a892] hover:text-[#f2e8d8]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <span className="text-[#6e6151] uppercase tracking-wider text-[10px] block font-bold">Quick Navigation Shortcuts</span>
              <button onClick={() => { navigate('/app/dashboard'); setSearchOpen(false); }} className="w-full text-left p-3 rounded-xl neu-inset hover:text-[#d98a3d] text-[#f2e8d8] flex items-center justify-between">
                <span>Executive SOC Console</span>
                <span className="text-[#d98a3d]">/app/dashboard</span>
              </button>
              <button onClick={() => { navigate('/app/copilot'); setSearchOpen(false); }} className="w-full text-left p-3 rounded-xl neu-inset hover:text-[#b3542e] text-[#f2e8d8] flex items-center justify-between">
                <span>AI Security Copilot</span>
                <span className="text-[#b3542e]">/app/copilot</span>
              </button>
              <button onClick={() => { navigate('/app/simulator'); setSearchOpen(false); }} className="w-full text-left p-3 rounded-xl neu-inset hover:text-[#d98a3d] text-[#f2e8d8] flex items-center justify-between">
                <span>AI Attack Simulator</span>
                <span className="text-[#d98a3d]">/app/simulator</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
