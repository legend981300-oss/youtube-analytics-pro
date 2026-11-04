'use client';

import React from 'react';

export const AmbientBackdrop: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Top Center YouTube Brand Ambient Radial Glow */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full bg-gradient-to-b from-brand-600/12 via-rose-600/5 to-transparent blur-[120px] will-change-transform animate-float-drift-1" />

      {/* Top Left Indigo Ambient Accent */}
      <div className="absolute top-[15%] -left-[10%] w-[650px] h-[500px] rounded-full bg-indigo-600/[0.06] blur-[140px] will-change-transform animate-float-drift-2" />

      {/* Bottom Right Violet Ambient Accent */}
      <div className="absolute -bottom-[15%] -right-[10%] w-[750px] h-[600px] rounded-full bg-purple-600/[0.05] blur-[140px] will-change-transform animate-float-drift-1" />

      {/* Subtle Fine Tech Dot Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-[0.25] dark:opacity-[0.35]" />
    </div>
  );
};
