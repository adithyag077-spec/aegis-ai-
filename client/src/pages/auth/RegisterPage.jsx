import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({ fullName, email, password });
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Registration failed. Check parameters.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-ambient relative overflow-hidden">
      <div className="absolute top-1/4 right-1/2 translate-x-1/2 w-96 h-96 bg-[#b3542e]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl neu-raised flex items-center justify-center mx-auto text-[#d98a3d] border border-[#a8672c]/40 shadow-glow-primary">
            <Shield className="w-8 h-8 text-[#d98a3d]" strokeWidth={2.2} />
          </div>
          <h1 className="text-3xl font-extrabold text-[#f2e8d8] font-heading tracking-tight">
            Create SOC Account
          </h1>
          <p className="text-xs text-[#b8a892] font-mono">
            Provision Analyst Access to AEGIS Telemetry
          </p>
        </div>

        <div className="neu-raised p-8 rounded-[28px] space-y-6 bg-[#17130e] border border-[#34291b]">
          {error && (
            <div className="p-3.5 rounded-xl neu-inset bg-[#a83b2e]/10 border border-[#a83b2e]/30 flex items-start gap-3 text-xs text-[#a83b2e] font-mono">
              <AlertCircle className="w-4 h-4 text-[#a83b2e] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
            <div>
              <label className="block text-[#d98a3d] uppercase tracking-wider mb-2 font-bold text-[11px]">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6e6151] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Security Analyst"
                  className="w-full bg-[#0d0b08] border border-[#34291b] rounded-xl py-3 pl-10 pr-4 text-[#f2e8d8] placeholder-[#6e6151] focus:outline-none focus:border-[#a8672c] transition-all neu-inset"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#d98a3d] uppercase tracking-wider mb-2 font-bold text-[11px]">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6e6151] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@aegis-defense.io"
                  className="w-full bg-[#0d0b08] border border-[#34291b] rounded-xl py-3 pl-10 pr-4 text-[#f2e8d8] placeholder-[#6e6151] focus:outline-none focus:border-[#a8672c] transition-all neu-inset"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#d98a3d] uppercase tracking-wider mb-2 font-bold text-[11px]">
                Password (min 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6e6151] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0d0b08] border border-[#34291b] rounded-xl py-3 pl-10 pr-4 text-[#f2e8d8] placeholder-[#6e6151] focus:outline-none focus:border-[#a8672c] transition-all neu-inset"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-cyber-primary py-3.5 rounded-xl text-[#0d0b08] font-bold text-xs shadow-glow-primary flex items-center justify-center gap-2 disabled:opacity-50 transition-all font-sans cursor-pointer"
            >
              {loading ? (
                <span>Provisioning Account...</span>
              ) : (
                <span>Create SOC Account →</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-mono text-[#b8a892]">
          Already registered?{' '}
          <Link to="/login" className="text-[#d1693a] font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
