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
        'group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-white/[0.08] dark:bg-navy-850/80 dark:backdrop-blur-xl dark:hover:border-white/[0.18] dark:hover:shadow-glow-brand/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]',
        className
      )}
    >
      {/* Top Ambient Glow on Hover */}
      <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-brand-500/15 via-rose-500/5 to-transparent blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {title}
            </span>
            {badge && (
              <span className="rounded-full border border-white/10 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-navy-750 dark:text-slate-300">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {value}
            </h3>
          </div>
        </div>

        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 transition-all duration-300 group-hover:scale-110 dark:bg-navy-800/90 border border-slate-200/60 dark:border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]',
            iconColor
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs">
        {change !== undefined ? (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border',
                isPositive &&
                  'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
                isNegative &&
                  'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
                isNeutral &&
                  'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
              )}
            >
              {isPositive && <TrendingUp className="h-3 w-3 stroke-[2.5]" />}
              {isNegative && <TrendingDown className="h-3 w-3 stroke-[2.5]" />}
              {isNeutral && <Minus className="h-3 w-3 stroke-[2.5]" />}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{timeframe}</span>
          </div>
        ) : subtitle ? (
          <span className="text-[11px] text-slate-400 dark:text-slate-500">{subtitle}</span>
        ) : null}
      </div>

      {/* Decorative Brand Accent Line */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};
