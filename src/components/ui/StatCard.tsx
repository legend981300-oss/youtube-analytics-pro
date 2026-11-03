import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  timeframe?: string;
  icon: LucideIcon;
  iconColor?: string;
  subtitle?: string;
  className?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  timeframe = 'vs last 28 days',
  icon: Icon,
  iconColor = 'text-brand-500',
  subtitle,
  className,
  badge,
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-navy-750 dark:bg-navy-850/90 dark:backdrop-blur-sm dark:hover:border-navy-600 dark:hover:shadow-glow-blue',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </span>
            {badge && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-navy-700 dark:text-slate-300">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {value}
            </h3>
          </div>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 transition-transform duration-300 group-hover:scale-105 dark:bg-navy-800 border border-slate-200/50 dark:border-navy-700',
            iconColor
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {change !== undefined ? (
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-medium',
                isPositive && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                isNegative && 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                isNeutral && 'bg-slate-500/10 text-slate-600 dark:text-slate-400'
              )}
            >
              {isPositive && <TrendingUp className="h-3 w-3" />}
              {isNegative && <TrendingDown className="h-3 w-3" />}
              {isNeutral && <Minus className="h-3 w-3" />}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-slate-400 dark:text-slate-500">{timeframe}</span>
          </div>
        ) : subtitle ? (
          <span className="text-slate-400 dark:text-slate-500">{subtitle}</span>
        ) : null}
      </div>

      {/* Decorative subtle gradient edge */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};

