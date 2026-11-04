'use client';

import React from 'react';

/**
 * Minimalist subtle background vignette (Linear/Vercel standard).
 * 0% GPU load, 0% CPU repaints, perfectly neutral.
 */
export const AmbientBackdrop: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-red-600/[0.03] blur-[100px]" />
    </div>
  );
};
