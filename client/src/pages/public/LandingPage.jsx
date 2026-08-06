import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Sparkles, Terminal, Activity, Lock, Cpu } from 'lucide-react';
import { WarpOverlay } from '../../components/common/WarpOverlay';
import { Aegis3DGlobe } from '../../components/common/Aegis3DGlobe';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [isWarping, setIsWarping] = useState(false);

  const handlePreloadLogin = () => {
    import('../auth/LoginPage');
  };

  const handleSignInWarp = (e) => {
    e.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      navigate('/login');
      return;
    }

    setIsWarping(true);

    setTimeout(() => {
      navigate('/login');
    }, 200);

    setTimeout(() => {
      setIsWarping(false);
    }, 700);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <div className="min-h-screen gradient-ambient text-[#CFD0CD] flex flex-col justify-between selection:bg-[#55443A]/40 selection:text-[#CFD0CD] relative overflow-hidden bg-[#0D1117]">
      {/* Interactive 3D Dune Neural Globe Background */}
      <Aegis3DGlobe />

      {/* 3D Warp Shutter Overlay */}
      <WarpOverlay show={isWarping} />

      {/* Header Navigation */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 flex items-center justify-between relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-raised flex items-center justify-center text-[#CFD0CD] bg-[#55443A]">
            <Shield className="w-5 h-5 text-[#CFD0CD]" />
          </div>
          <span className="text-lg font-bold font-heading tracking-tight text-[#CFD0CD]">
            AEGIS <span className="text-[#8A9992] font-mono text-xs">SOC</span>
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <button 
            onClick={handleSignInWarp}
            onMouseEnter={handlePreloadLogin}
            className="px-4 py-2 rounded-xl neu-raised text-[#B8BBB7] hover:text-[#CFD0CD] transition-all cursor-pointer bg-[#55443A]"
          >
            Sign In
          </button>
          <Link to="/register" className="btn-cyber-primary px-5 py-2.5 rounded-xl text-[#CFD0CD] font-bold">
            Get Started
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10"
      >
        <div className="space-y-6 max-w-2xl">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-inset text-[#CFD0CD] border border-[rgba(138,153,146,0.25)] text-xs font-mono font-bold bg-[#4D2308]">
            <Sparkles className="w-3.5 h-3.5 text-[#8A9992]" />
            <span>AUTONOMOUS AI CYBER SHIELD • POWERED BY GOOGLE GEMINI</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight font-heading">
            Enterprise AI <span className="gradient-text-hero">Threat Detection</span> & Identity Defense
          </motion.h1>

          <motion.p variants={itemVariants} className="text-sm sm:text-base text-[#B8BBB7] leading-relaxed font-sans max-w-xl">
            Next-generation Security Operations Center fusing real-time multi-vector threat scanning, MITRE ATT&CK kill-chain mapping, and autonomous AI remediation playbooks.
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center gap-4 pt-4 font-mono text-xs">
            <Link
              to="/app/dashboard"
              className="btn-cyber-primary px-8 py-4 rounded-xl text-[#CFD0CD] font-bold shadow-glow-primary flex items-center gap-2"
            >
              <span>Launch Cyber Radar Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleSignInWarp}
              onMouseEnter={handlePreloadLogin}
              className="px-6 py-4 rounded-xl neu-raised border border-[rgba(138,153,146,0.25)] text-[#CFD0CD] hover:border-[#8A9992] transition-all cursor-pointer flex items-center gap-2 bg-[#55443A]"
            >
              <span>Sign in to Dashboard →</span>
            </button>
          </motion.div>
        </div>

        {/* Wireframe Node Graphic Visualizer */}
        <motion.div 
          variants={itemVariants}
          className={`relative w-full max-w-md h-80 neu-raised p-6 rounded-[28px] flex items-center justify-center overflow-hidden border border-[rgba(138,153,146,0.25)] transition-transform duration-500 bg-[#55443A] ${
            isWarping ? 'scale-125 opacity-0 blur-sm' : ''
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#55443A]/40 to-[#4D2308]/40 rounded-[28px]" />

          {/* Streaking Outer Particles */}
          <div className={`absolute w-56 h-56 rounded-full border border-[#8A9992]/30 transition-transform duration-500 ${
            isWarping ? 'scale-150 opacity-0 border-opacity-100' : 'animate-radar-rotate'
          }`} />

          <div className="relative z-10 space-y-4 text-center">
            <div className={`w-20 h-20 rounded-full neu-raised border border-[#8A9992]/40 flex items-center justify-center mx-auto text-[#CFD0CD] shadow-glow-primary transition-transform duration-500 bg-[#4D2308] ${
              isWarping ? 'scale-150 text-[#CFD0CD]' : 'animate-radar-rotate'
            }`}>
              <Cpu className="w-10 h-10 text-[#8A9992]" />
            </div>

            <div className="font-mono text-xs space-y-1">
              <span className="text-[#CFD0CD] font-bold block">AEGIS JARVIS MATRIX</span>
              <span className="text-[10px] text-[#8A9992]">MongoDB Atlas Telemetry Stream Active</span>
            </div>
          </div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="border-t border-[rgba(138,153,146,0.25)] py-6 text-center text-xs font-mono text-[#8A9992] relative z-10 bg-[#0D1117]">
        © {new Date().getFullYear()} AegisAI Security Inc. Enterprise Platform.
      </footer>
    </div>
  );
};
