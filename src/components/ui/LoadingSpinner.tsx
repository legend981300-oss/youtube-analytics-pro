import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}> = ({ size = 'md', label = 'Loading analytics...', className }) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 space-y-3 text-slate-500 dark:text-slate-400',
        className
      )}
    >
      <Loader2 className={cn('animate-spin text-brand-500', sizeMap[size])} />
      {label && <p className="text-xs font-medium animate-pulse">{label}</p>}
    </div>
  );
};

