import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Radio } from 'lucide-react';

export const AegisBootIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    // Hard fallback safety timer: Guarantee completion at exactly 5.0 seconds under ALL circumstances
    const hardFallback = setTimeout(() => {
      setFinished(true);
      if (onComplete) onComplete();
    }, 5000);

    // Timed Phase Sequence
    const t1 = setTimeout(() => setPhase(1), 1000); // 1.0s: Particle Shield Assembly
    const t2 = setTimeout(() => setPhase(2), 2200); // 2.2s: Text Reveal
    const t3 = setTimeout(() => setPhase(3), 3200); // 3.2s: Radar Sweep & Ambient Grid
    const t4 = setTimeout(() => setPhase(4), 4200); // 4.2s: Fly-Through & Compress
    const t5 = setTimeout(() => {
      setFinished(true);
      if (onComplete) onComplete();
    }, 5000); // 5.0s: Complete & Reveal Landing Page

    return () => {
      clearTimeout(hardFallback);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  if (finished) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="aegis-boot-intro-layer"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 4 ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: phase === 4 ? 0.8 : 0.4 }}
        className="fixed inset-0 z-[99999] bg-[#0D1117] flex flex-col items-center justify-center overflow-hidden pointer-events-auto"
      >
        {/* Ambient Grid (3% Opacity) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#8A9992 1px, transparent 1px), linear-gradient(90deg, #8A9992 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Phase 0 & 1: Ambient Glow */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: phase >= 4 ? 0.1 : 1.2, opacity: phase >= 4 ? 1 : 0.4 }}
          transition={{ duration: phase === 4 ? 0.8 : 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(138, 153, 146, 0.5) 0%, rgba(85, 68, 58, 0.3) 50%, transparent 80%)'
          }}
        />

        {/* 160 Assembling Shield Particles */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 160 }).map((_, i) => {
            const angle = (i / 160) * Math.PI * 2;
            const radius = 180 + (i % 5) * 12;
            const startX = Math.cos(angle) * radius * (phase === 0 ? 2.2 : 1);
            const startY = Math.sin(angle) * radius * (phase === 0 ? 2.2 : 1);

            return (
              <motion.div
                key={i}
                initial={{ 
                  x: (Math.random() - 0.5) * 600, 
                  y: (Math.random() - 0.5) * 600, 
                  opacity: 0,
                  scale: Math.random() * 0.8 + 0.4 
                }}
                animate={{
                  x: phase >= 4 ? 0 : (phase >= 1 ? startX : (Math.random() - 0.5) * 300),
                  y: phase >= 4 ? 0 : (phase >= 1 ? startY : (Math.random() - 0.5) * 300),
                  opacity: phase >= 4 ? 1 : (phase >= 1 ? [0.3, 0.9, 0.6] : 0.2),
                  scale: phase >= 4 ? 0.1 : (phase >= 1 ? 1 : 0.5)
                }}
                transition={{
                  duration: phase === 4 ? 0.7 : 1.1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: (i % 20) * 0.01
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-[#8A9992] shadow-[0_0_8px_#55443A]"
              />
            );
          })}
        </div>

        {/* Center Shield Assembly */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: phase === 4 ? 18 : (phase >= 1 ? 1 : 0.7), 
              opacity: phase === 4 ? [1, 0.8, 0] : (phase >= 1 ? 1 : 0.4)
            }}
            transition={{ duration: phase === 4 ? 0.8 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Animated Scanning Radar Rings */}
            {phase >= 3 && (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute w-28 h-28 rounded-full border border-[#8A9992]/60 pointer-events-none"
                />
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-36 h-36 rounded-full border border-dashed border-[#55443A]/40 pointer-events-none"
                />
              </>
            )}

            <div className="w-24 h-24 rounded-3xl neu-raised border border-[#8A9992]/50 flex items-center justify-center text-[#CFD0CD] shadow-[0_0_35px_rgba(138,153,146,0.3)] bg-[#55443A]">
              <Shield className="w-12 h-12 text-[#CFD0CD]" strokeWidth={2.2} />
            </div>
          </motion.div>

          {/* Cinematic Text Reveal */}
          {phase >= 2 && phase < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center space-y-2 font-mono"
            >
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#CFD0CD] font-heading tracking-[0.25em] uppercase drop-shadow-[0_0_12px_rgba(138,153,146,0.4)]">
                AEGIS
              </h1>
              <p className="text-xs text-[#8A9992] tracking-[0.2em] uppercase font-bold">
                Enterprise AI Security Platform
              </p>
            </motion.div>
          )}
        </div>

        {/* Phase 3 Telemetry Pill */}
        {phase === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 flex items-center gap-2 px-4 py-1.5 rounded-full neu-inset text-[#CFD0CD] border border-[#8A9992] text-xs font-mono font-bold"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#8A9992]" />
            <span>INITIALIZING JARVIS NEURAL ENGINE...</span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
