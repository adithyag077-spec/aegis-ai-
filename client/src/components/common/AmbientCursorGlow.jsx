import React, { useEffect, useState } from 'react';

export const AmbientCursorGlow = () => {
  const [pos, setPos] = useState({ x: -200, y: -200 });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-0 w-96 h-96 rounded-full blur-[100px] opacity-10 transition-transform duration-700 ease-out"
      style={{
        background: 'radial-gradient(circle, rgba(217, 138, 61, 0.6) 0%, rgba(179, 84, 46, 0.4) 50%, transparent 80%)',
        transform: `translate3d(${pos.x - 192}px, ${pos.y - 192}px, 0)`
      }}
    />
  );
};
