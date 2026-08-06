import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const AnimatedCounter = ({ value, duration = 1.5, className = '' }) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => {
      setCurrentText(latest);
    });
    return () => unsubscribe();
  }, [display]);

  return <motion.span className={className}>{currentText}</motion.span>;
};
