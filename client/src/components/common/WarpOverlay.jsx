import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function WarpOverlay({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, times: [0, 0.3, 0.7, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at center, rgba(138,153,146,0.90) 0%, rgba(85,68,58,0.7) 40%, rgba(13,17,23,1) 80%)',
          }}
        />
      )}
    </AnimatePresence>
  );
}
