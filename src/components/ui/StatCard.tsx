import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
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

  // Format large raw integers dynamically to standard short-scale units (K, M, B)
  const formattedValue = typeof value === 'number' ? formatNumber(value) : value;

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-zinc-200/80 bg-white p-4.5 transition-colors duration-150 dark:border-white/[0.06] dark:bg-[#0e0f14] hover:border-zinc-300 dark:hover:border-white/[0.1]',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium tracking-wider uppercase text-zinc-500 dark:text-zinc-400">
            {title}
          </span>
          {badge && (
            <span className="rounded bg-zinc-100 px-1.5 py-0.2 text-[9px] font-medium text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-400">
              {badge}
            </span>
          )}
        </div>
        <Icon className="h-4 w-4 stroke-[1.5] text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
      </div>

      <div className="mt-2.5">
        <h3 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 tabular-nums font-mono">
          <AnimatedNumber value={formattedValue} />
        </h3>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-zinc-100 dark:border-white/[0.04]">
        {change !== undefined ? (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors',
                isPositive && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                isNegative && 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                isNeutral && 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
              )}
            >
              {isPositive && <TrendingUp className="h-3 w-3 stroke-[2]" />}
              {isNegative && <TrendingDown className="h-3 w-3 stroke-[2]" />}
              {isNeutral && <Minus className="h-3 w-3 stroke-[2]" />}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
            <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{timeframe}</span>
          </div>
        ) : subtitle ? (
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">{subtitle}</span>
        ) : null}
      </div>
    </div>
  );
};
