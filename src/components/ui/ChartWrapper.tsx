'use client';

import React, { useState, useEffect } from 'react';

interface ChartWrapperProps {
  children: React.ReactNode;
  heightClass?: string;
  className?: string;
  minHeight?: number;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  children,
  heightClass = 'h-80',
  className = '',
  minHeight = 320,
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Ensure clean hydration with requestAnimationFrame
    const frame = requestAnimationFrame(() => setHasMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!hasMounted) {
    return (
      <div
        style={{ minHeight: `${minHeight}px`, height: `${minHeight}px` }}
        className={`w-full ${heightClass} ${className} flex flex-col items-center justify-center rounded-xl bg-slate-50/60 dark:bg-navy-950/40 border border-slate-100 dark:border-navy-800/60 animate-pulse`}
      >
        <div className="h-4 w-32 rounded-full bg-slate-200 dark:bg-navy-800 mb-2" />
        <div className="h-2 w-20 rounded-full bg-slate-200/60 dark:bg-navy-800/60" />
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: `${minHeight}px`, height: `${minHeight}px` }}
      className={`w-full ${heightClass} ${className} relative overflow-hidden`}
    >
      {children}
    </div>
  );
};


