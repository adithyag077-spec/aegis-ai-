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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-ambient relative overflow-hidden">
      {/* Back to Home Link */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link 
          to="/" 
          className="neu-raised px-4 py-2 rounded-xl text-xs font-mono text-[#b8a892] hover:text-[#f2e8d8] flex items-center gap-2 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#d98a3d]" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d98a3d]/10 rounded-full blur-3xl pointer-events-none" />

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
              <div className="w-16 h-16 rounded-2xl neu-raised flex items-center justify-center mx-auto text-[#d98a3d] border border-[#a8672c]/40 shadow-glow-primary">
                <Shield className="w-8 h-8 text-[#d98a3d]" strokeWidth={2.2} />
              </div>
            </Link>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-3xl font-extrabold text-[#f2e8d8] font-heading tracking-tight">
            Sign in to AEGIS SOC
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xs text-[#b8a892] font-mono">
            Autonomous AI Cybersecurity & Neural Threat Defense
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div variants={itemVariants} className="neu-raised p-8 rounded-[28px] space-y-6 bg-[#17130e] border border-[#34291b]">
          {error && (
            <div className="p-3.5 rounded-xl neu-inset bg-[#a83b2e]/10 border border-[#a83b2e]/30 flex items-start gap-3 text-xs text-[#a83b2e] font-mono">
              <AlertCircle className="w-4 h-4 text-[#a83b2e] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
            <motion.div variants={itemVariants}>
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
                  className="w-full bg-[#0d0b08] border border-[#34291b] rounded-xl py-3 pl-10 pr-4 text-[#f2e8d8] placeholder-[#6e6151] focus:outline-none focus:border-[#d98a3d] focus:shadow-glow-primary transition-all neu-inset"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#d98a3d] uppercase tracking-wider font-bold text-[11px]">
                  Password
                </label>
                <span className="text-[10px] text-[#6e6151] hover:underline cursor-pointer">Forgot?</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6e6151] absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0d0b08] border border-[#34291b] rounded-xl py-3 pl-10 pr-4 text-[#f2e8d8] placeholder-[#6e6151] focus:outline-none focus:border-[#d98a3d] focus:shadow-glow-primary transition-all neu-inset"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-cyber-primary py-3.5 rounded-xl text-[#0d0b08] font-bold text-xs shadow-glow-primary flex items-center justify-center gap-2 disabled:opacity-50 transition-all font-sans cursor-pointer"
              >
                {loading ? (
                  <>
                    <KeyRound className="w-4 h-4 animate-spin text-[#0d0b08]" />
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
          <motion.div variants={itemVariants} className="pt-2 border-t border-[#34291b] text-center space-y-2">
            <span className="text-[10px] font-mono text-[#6e6151] block uppercase tracking-wider font-bold">Quick Demo Login</span>
            <button
              onClick={() => { setEmail('user@aegis.ai'); setPassword('password123'); }}
              className="text-[11px] font-mono text-[#d98a3d] hover:underline cursor-pointer"
            >
              Fill Demo Analyst Credentials (user@aegis.ai)
            </button>
          </motion.div>
        </motion.div>

        {/* Footer Register Link */}
        <motion.p variants={itemVariants} className="text-center text-xs font-mono text-[#b8a892]">
          Need an enterprise account?{' '}
          <Link to="/register" className="text-[#d1693a] font-bold hover:underline">
            Register Here
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};
