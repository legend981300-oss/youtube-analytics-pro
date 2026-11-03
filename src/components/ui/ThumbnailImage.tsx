'use client';

import React, { useState } from 'react';
import { Play, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThumbnailImageProps {
  src: string;
  alt: string;
  duration?: string;
  title?: string;
  className?: string;
  type?: 'video' | 'short';
}

export const ThumbnailImage: React.FC<ThumbnailImageProps> = ({
  src,
  alt,
  duration,
  title,
  className = '',
  type = 'video',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-slate-900 select-none group',
        type === 'short' ? 'aspect-[9/16]' : 'aspect-video',
        className
      )}
    >
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          className={cn(
            'h-full w-full object-cover transition-transform duration-300 group-hover:scale-105',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
        />
      ) : null}

      {/* Fallback Graphic when loading or failed */}
      {(hasError || !src) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 border border-navy-700/60">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/20 text-brand-500 mb-1 group-hover:scale-110 transition-transform">
            {type === 'short' ? <Zap className="h-5 w-5" /> : <Play className="h-5 w-5 fill-brand-500/30" />}
          </div>
          {title && (
            <p className="text-[10px] font-bold text-slate-300 line-clamp-1 max-w-[90%]">
              {title}
            </p>
          )}
        </div>
      )}

      {/* Duration Badge */}
      {duration && (
        <span className="absolute bottom-1.5 right-1.5 rounded bg-black/85 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm backdrop-blur-xs">
          {duration}
        </span>
      )}
    </div>
  );
};

