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
            background: 'radial-gradient(circle at center, rgba(217,138,61,0.95) 0%, rgba(179,84,46,0.6) 40%, rgba(13,11,8,1) 80%)',
          }}
        />
      )}
    </AnimatePresence>
  );
}
