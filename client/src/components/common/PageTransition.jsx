import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Check for reduced motion preference
const prefersReducedMotion = typeof window !== 'undefined' 
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
  : false;

// 1. Forward Warp Physics (Landing -> Login)
const warpExit = prefersReducedMotion 
  ? { opacity: 0 } 
  : {
      scale: 1.15,
      opacity: 0,
      filter: 'blur(6px)',
      transition: { duration: 0.35, ease: [0.6, 0.04, 0.98, 0.34] }
    };

const warpInitial = prefersReducedMotion 
  ? { opacity: 0 } 
  : {
      scale: 0.85,
      opacity: 0,
      rotateX: 8,
      z: -200,
    };

const warpEnter = prefersReducedMotion 
  ? { opacity: 1, transition: { duration: 0.15 } } 
  : {
      scale: 1,
      opacity: 1,
      rotateX: 0,
      z: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
        mass: 0.9,
        delay: 0.15,
      },
    };

// 2. Reverse Reconstruction Physics (Login -> Landing, 500-600ms)
const reverseExit = prefersReducedMotion
  ? { opacity: 0 }
  : {
      scale: 0.95,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeOut' }
    };

const reverseInitial = prefersReducedMotion
  ? { opacity: 0 }
  : {
      scale: 0.98,
      opacity: 0
    };

const reverseEnter = prefersReducedMotion
  ? { opacity: 1, transition: { duration: 0.15 } }
  : {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    };

export const PageTransition = ({ children }) => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  // Determine transition physics based on route history direction
  const initialVariants = isLandingPage ? reverseInitial : warpInitial;
  const enterVariants = isLandingPage ? reverseEnter : warpEnter;
  const exitVariants = isLoginPage ? reverseExit : warpExit;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={initialVariants}
        animate={enterVariants}
        exit={exitVariants}
        style={{ 
          perspective: 1200, 
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity'
        }}
        className="w-full min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
