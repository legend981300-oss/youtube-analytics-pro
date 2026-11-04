import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from './AnimatedNumber';

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
  timeframe = 'vs last 28d',
  icon: Icon,
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
        'group relative rounded-xl border border-slate-200/80 bg-white p-5 transition-all duration-150 hover:border-slate-300 dark:border-white/[0.08] dark:bg-[#11131a] dark:hover:border-white/[0.14] dark:hover:bg-[#141620] shadow-sm',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-neutral-400">
              {title}
            </span>
            {badge && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-white/[0.06] dark:text-neutral-300">
                {badge}
              </span>
            )}
          </div>
          <div className="pt-1">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums font-mono">
              <AnimatedNumber value={value} />
            </h3>
          </div>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-neutral-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          <Icon className="h-4 w-4 stroke-[1.75]" />
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-white/[0.04]">
        {change !== undefined ? (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 font-semibold text-xs',
                isPositive && 'text-emerald-600 dark:text-emerald-400',
                isNegative && 'text-rose-600 dark:text-rose-400',
                isNeutral && 'text-slate-500 dark:text-neutral-400'
              )}
            >
              {isPositive && <TrendingUp className="h-3 w-3 stroke-[2]" />}
              {isNegative && <TrendingDown className="h-3 w-3 stroke-[2]" />}
              {isNeutral && <Minus className="h-3 w-3 stroke-[2]" />}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-neutral-500">{timeframe}</span>
          </div>
        ) : subtitle ? (
          <span className="text-[11px] text-slate-400 dark:text-neutral-500">{subtitle}</span>
        ) : null}
      </div>
    </div>
  );
};
