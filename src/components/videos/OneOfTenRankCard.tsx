'use client';

import React from 'react';
import { OneOfTenAudit } from '@/lib/analytics-engine';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { Trophy, ArrowUpRight, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const OneOfTenRankCard: React.FC<{ audit: OneOfTenAudit | null; onSelectVideo?: (v: any) => void }> = ({
  audit,
  onSelectVideo,
}) => {
  if (!audit) return null;

  const { latestVideo, rank, deltaPercentVsMedian, verdict, recommendation } = audit;
  const isTopRank = rank === 1;

  return (
    <div className="pro-card p-5 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3.5 border-b border-slate-100 dark:border-white/[0.06] gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
              isTopRank
                ? 'bg-amber-400/10 text-amber-500 border-amber-400/30'
                : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.08]'
            }`}
          >
            <Trophy className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Latest Upload Performance
              </h3>
              <span
                className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isTopRank
                    ? 'bg-amber-400/10 text-amber-500 border-amber-400/30'
                    : rank <= 3
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-white/[0.06] text-slate-400 border-slate-200 dark:border-white/[0.08]'
                }`}
              >
                Rank #{rank} of 10
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ranked against previous 9 uploads in the first 48 hours of release.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`font-mono text-xs font-semibold px-2 py-0.5 rounded border ${
              deltaPercentVsMedian >= 0
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
            }`}
          >
            {deltaPercentVsMedian >= 0 ? `+${deltaPercentVsMedian}%` : `${deltaPercentVsMedian}%`} vs median
          </span>
        </div>
      </div>

      {/* Structured 2-Column Grid */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Video Tile */}
        <div
          onClick={() => onSelectVideo?.(latestVideo)}
          className="lg:col-span-5 flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] cursor-pointer hover:border-slate-300 dark:hover:border-white/[0.14] transition-all group"
        >
          <div className="relative w-32 h-18 sm:w-36 sm:h-20 shrink-0 aspect-video overflow-hidden rounded-lg border border-slate-200 dark:border-white/[0.08]">
            <ThumbnailImage
              src={latestVideo.thumbnail}
              alt={latestVideo.title}
              duration={latestVideo.duration}
              title={latestVideo.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#ff0033] transition-colors leading-snug">
              {latestVideo.title}
            </h4>
            <div className="mt-1.5 flex items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatNumber(latestVideo.views)} views
              </span>
              <span>•</span>
              <span className="text-emerald-500 font-medium">CTR {latestVideo.ctr}%</span>
            </div>
          </div>
        </div>

        {/* Right: Algorithmic Diagnosis & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/60 dark:border-white/[0.04] space-y-2.5">
          <div>
            <div className="font-medium text-slate-900 dark:text-slate-200 text-xs flex items-center gap-1.5">
              <span>{verdict}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mt-1">
              {recommendation}
            </p>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/ab-testing"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-colors"
            >
              <Sparkles className="h-3 w-3 text-[#ff0033]" /> Test Title/Thumbnail Variant
            </Link>
            <Link
              href="/seo"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-colors"
            >
              Inspect Keyword Search Volume
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
