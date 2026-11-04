'use client';

import React from 'react';
import { OneOfTenAudit } from '@/lib/analytics-engine';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';
import { formatNumber } from '@/lib/utils';
import { Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const OneOfTenRankCard: React.FC<{ audit: OneOfTenAudit | null; onSelectVideo?: (v: any) => void }> = ({
  audit,
  onSelectVideo,
}) => {
  if (!audit) return null;

  const { latestVideo, rank, deltaPercentVsMedian, verdict, recommendation } = audit;
  const isTopRank = rank === 1;

  return (
    <div className="pro-card p-4.5 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-zinc-100 dark:border-white/[0.04] gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-md border ${
              isTopRank
                ? 'bg-amber-400/10 text-amber-500 border-amber-400/20'
                : 'bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 border-zinc-200/60 dark:border-white/[0.06]'
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-medium tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
                Latest Upload Performance
              </h3>
              <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                • Rank #{rank} of 10
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              Ranked against previous 9 uploads in the first 48 hours of release.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`font-mono text-[11px] font-medium px-2 py-0.5 rounded ${
              deltaPercentVsMedian >= 0
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}
          >
            {deltaPercentVsMedian >= 0 ? `+${deltaPercentVsMedian}%` : `${deltaPercentVsMedian}%`} vs median
          </span>
        </div>
      </div>

      {/* Structured 2-Column Grid */}
      <div className="mt-3.5 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Video Tile */}
        <div
          onClick={() => onSelectVideo?.(latestVideo)}
          className="lg:col-span-5 flex items-center gap-3 p-2.5 rounded-lg bg-zinc-50/50 dark:bg-white/[0.015] border border-zinc-200/60 dark:border-white/[0.05] cursor-pointer hover:border-zinc-300 dark:hover:border-white/[0.1] transition-colors group"
        >
          <div className="relative w-28 sm:w-32 h-16 shrink-0 aspect-video overflow-hidden rounded border border-zinc-200/80 dark:border-white/[0.06]">
            <ThumbnailImage
              src={latestVideo.thumbnail}
              alt={latestVideo.title}
              duration={latestVideo.duration}
              title={latestVideo.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-[#ff0033] transition-colors leading-snug">
              {latestVideo.title}
            </h4>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {formatNumber(latestVideo.views)} views
              </span>
              <span>•</span>
              <span className="text-emerald-500 dark:text-emerald-400 font-medium">CTR {latestVideo.ctr}%</span>
            </div>
          </div>
        </div>

        {/* Right: Algorithmic Diagnosis & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between p-2.5 rounded-lg bg-zinc-50/30 dark:bg-white/[0.01] border border-zinc-200/40 dark:border-white/[0.03] space-y-2">
          <div>
            <div className="font-medium text-zinc-900 dark:text-zinc-200 text-xs">
              {verdict}
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed mt-0.5">
              {recommendation}
            </p>
          </div>

          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/ab-testing"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] px-2 py-1 text-[11px] font-normal text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-colors"
            >
              <Sparkles className="h-3 w-3 text-[#ff0033]" /> Test Title/Thumbnail Variant
            </Link>
            <Link
              href="/seo"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200/80 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] px-2 py-1 text-[11px] font-normal text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/[0.06] transition-colors"
            >
              Inspect Keyword Search Volume →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
