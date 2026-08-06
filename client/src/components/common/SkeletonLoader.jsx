import React from 'react';
import { motion } from 'framer-motion';

export const CardSkeleton = () => (
  <motion.div 
    initial={{ opacity: 0.4 }}
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    className="glass-card p-6 rounded-2xl border border-[rgba(70,120,255,0.15)] space-y-4 bg-[#0B1220]/60"
  >
    <div className="h-4 bg-[#2D7DFF]/20 rounded-md w-1/3" />
    <div className="h-8 bg-[#2D7DFF]/25 rounded-lg w-1/2" />
    <div className="h-3 bg-[#2D7DFF]/15 rounded-md w-2/3" />
  </motion.div>
);

export const TableSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3">
    {[...Array(rows)].map((_, i) => (
      <motion.div 
        key={i} 
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
        className="h-14 bg-[#0B1220]/60 rounded-2xl border border-[rgba(70,120,255,0.15)] flex items-center justify-between px-5"
      >
        <div className="h-4 bg-[#2D7DFF]/20 rounded w-1/4" />
        <div className="h-4 bg-[#2D7DFF]/25 rounded w-1/3" />
        <div className="h-4 bg-[#2D7DFF]/15 rounded w-1/6" />
      </motion.div>
    ))}
  </div>
);
