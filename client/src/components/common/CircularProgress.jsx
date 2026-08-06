import React, { useEffect, useState } from 'react';

export const CircularProgress = ({ value = 0, size = 64, strokeWidth = 6, color = '#d98a3d' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progress = Math.min(100, Math.max(0, value));
    const progressOffset = circumference - (progress / 100) * circumference;
    setOffset(progressOffset);
  }, [value, circumference]);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(74, 56, 35, 0.4)"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      {/* Animated Active Progress Arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
    </svg>
  );
};
