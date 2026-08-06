import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Mail, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Authentication failed. Verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-ambient relative overflow-hidden bg-[#0D1117]">
      {/* Back to Home Link */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link 
          to="/" 
          className="neu-raised px-4 py-2 rounded-xl text-xs font-mono text-[#B8BBB7] hover:text-[#CFD0CD] flex items-center gap-2 transition-all cursor-pointer bg-[#55443A]"
        >
          <ArrowLeft className="w-4 h-4 text-[#8A9992]" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#8A9992]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md space-y-8 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <motion.div variants={itemVariants}>
            <Link to="/" className="inline-block">
              <div className="w-16 h-16 rounded-2xl neu-raised flex items-center justify-center mx-auto text-[#CFD0CD] border border-[rgba(138,153,146,0.25)] shadow-glow-primary bg-[#55443A]">
                <Shield className="w-8 h-8 text-[#CFD0CD]" strokeWidth={2.2} />
              </div>
            </Link>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold text-[#CFD0CD] font-heading tracking-tight">
            Sign in to AEGIS SOC
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xs text-[#B8BBB7] font-mono">
            Autonomous AI Cybersecurity & Neural Threat Defense
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div variants={itemVariants} className="neu-raised p-8 rounded-[28px] space-y-6 bg-[#55443A] border border-[rgba(138,153,146,0.25)]">
          {error && (
            <div className="p-3.5 rounded-xl neu-inset bg-[#8C5A4A]/20 border border-[#8C5A4A]/40 flex items-start gap-3 text-xs text-[#8C5A4A] font-mono">
              <AlertCircle className="w-4 h-4 text-[#8C5A4A] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
            <motion.div variants={itemVariants}>
              <label className="block text-[#CFD0CD] uppercase tracking-wider mb-2 font-bold text-[11px]">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A9992] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@aegis-defense.io"
                  className="w-full bg-[#4D2308] border border-[#8A9992] rounded-xl py-3 pl-10 pr-4 text-[#CFD0CD] placeholder-[rgba(207,208,205,0.5)] focus:outline-none focus:border-[#CFD0CD] focus:shadow-glow-primary transition-all neu-inset"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#CFD0CD] uppercase tracking-wider font-bold text-[11px]">
                  Password
                </label>
                <span className="text-[10px] text-[#8A9992] hover:underline cursor-pointer">Forgot?</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A9992] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#4D2308] border border-[#8A9992] rounded-xl py-3 pl-10 pr-4 text-[#CFD0CD] placeholder-[rgba(207,208,205,0.5)] focus:outline-none focus:border-[#CFD0CD] focus:shadow-glow-primary transition-all neu-inset"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-cyber-primary py-3.5 rounded-xl text-[#CFD0CD] font-bold text-xs shadow-glow-primary flex items-center justify-center gap-2 disabled:opacity-50 transition-all font-sans cursor-pointer"
              >
                {loading ? (
                  <>
                    <KeyRound className="w-4 h-4 animate-spin text-[#CFD0CD]" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate →</span>
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <motion.div variants={itemVariants} className="pt-2 border-t border-[rgba(138,153,146,0.25)] text-center space-y-2">
            <span className="text-[10px] font-mono text-[#8A9992] block uppercase tracking-wider font-bold">Quick Demo Login</span>
            <button
              onClick={() => { setEmail('user@aegis.ai'); setPassword('password123'); }}
              className="text-[11px] font-mono text-[#8A9992] hover:underline cursor-pointer"
            >
              Fill Demo Analyst Credentials (user@aegis.ai)
            </button>
          </motion.div>
        </motion.div>

        {/* Footer Register Link */}
        <motion.p variants={itemVariants} className="text-center text-xs font-mono text-[#B8BBB7]">
          Need an enterprise account?{' '}
          <Link to="/register" className="text-[#8A9992] font-bold hover:underline">
            Register Here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};
