'use client';

import React from 'react';

/**
 * Ultra-lightweight static ambient backdrop.
 * Zero CPU overhead, zero blur keyframe repaints, GPU static composite.
 */
export const AmbientBackdrop: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Static ambient radial glows - zero CPU repaints */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-brand-600/[0.08] blur-[80px]" />
      <div className="absolute top-[20%] -left-[10%] w-[450px] h-[350px] rounded-full bg-indigo-600/[0.04] blur-[80px]" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[400px] rounded-full bg-purple-600/[0.04] blur-[80px]" />

      {/* Subtle Fine Tech Dot Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-[0.2] dark:opacity-[0.25]" />
    </div>
  );
};
