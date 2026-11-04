'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mark' | 'compact';
  href?: string;
  className?: string;
  showProBadge?: boolean;
}

export const BrandMark: React.FC<{ sizeClass?: string; className?: string }> = ({
  sizeClass = 'h-7 w-7',
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center shrink-0 rounded-lg overflow-hidden select-none transition-transform duration-200 group-hover:scale-105',
        'bg-gradient-to-b from-[#ff1a40] via-[#ff0033] to-[#d60029]',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.32),0_2px_8px_rgba(255,0,51,0.28)]',
        'border border-red-400/40',
        sizeClass,
        className
      )}
    >
      {/* Specular Top Hairline */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/40" />

      {/* Bespoke Geometric Analytics + Play Vector Mark */}
      <svg
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-[62%] w-[62%] drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]"
      >
        <defs>
          <linearGradient id="markGradLeft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="markGradRight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Left Segment: Ascending Analytics Growth Pillar */}
        <path
          d="M7 8.2C7 7.2 7.9 6.5 8.9 6.8L12.7 7.9C13.5 8.1 14 8.8 14 9.6V18.4C14 19.2 13.5 19.9 12.7 20.1L8.9 21.2C7.9 21.5 7 20.8 7 19.8V8.2Z"
          fill="url(#markGradLeft)"
        />

        {/* Right Segment: Forward Velocity Play Apex */}
        <path
          d="M16 9.4C16 8.5 17 8.0 17.7 8.5L22.8 12.3C23.4 12.8 23.4 13.7 22.8 14.1L17.7 17.9C17 18.4 16 17.9 16 17.0V9.4Z"
          fill="url(#markGradRight)"
        />

        {/* Metric Pulse Indicator */}
        <circle cx="10.5" cy="14" r="1.1" fill="#ff0033" fillOpacity="0.8" />
      </svg>
    </div>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'full',
  href = '/',
  className,
  showProBadge = true,
}) => {
  const sizeMap = {
    xs: {
      mark: 'h-5 w-5',
      text: 'text-xs',
      badge: 'text-[8px] px-1 py-0.2',
      gap: 'gap-1.5',
    },
    sm: {
      mark: 'h-6 w-6',
      text: 'text-xs',
      badge: 'text-[9px] px-1 py-0.2',
      gap: 'gap-2',
    },
    md: {
      mark: 'h-7 w-7',
      text: 'text-sm',
      badge: 'text-[9px] px-1.5 py-0.5',
      gap: 'gap-2.5',
    },
    lg: {
      mark: 'h-9 w-9 rounded-xl',
      text: 'text-base',
      badge: 'text-[10px] px-1.5 py-0.5',
      gap: 'gap-3',
    },
    xl: {
      mark: 'h-11 w-11 rounded-2xl',
      text: 'text-lg sm:text-xl',
      badge: 'text-xs px-2 py-0.5',
      gap: 'gap-3.5',
    },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={cn('inline-flex items-center select-none group', currentSize.gap, className)}>
      <BrandMark sizeClass={currentSize.mark} />

      {variant !== 'mark' && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={cn(
              'font-semibold tracking-tight text-slate-900 dark:text-white transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-100',
              currentSize.text
            )}
          >
            {variant === 'compact' ? 'YT Analytics' : 'YouTube Analytics'}
          </span>

          {showProBadge && (
            <span
              className={cn(
                'font-mono font-semibold uppercase tracking-wider rounded border',
                'bg-slate-100 text-slate-800 border-slate-200/80',
                'dark:bg-white/[0.06] dark:text-slate-200 dark:border-white/[0.08]',
                currentSize.badge
              )}
            >
              PRO
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
