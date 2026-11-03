import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center dark:border-navy-750 dark:bg-navy-900/30',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500 mb-3">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

