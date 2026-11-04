'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { Zap, Disc3, GitFork, TrendingUp, Download } from 'lucide-react';
import { DEMO_SHORTS } from '@/lib/demo-data';
import { formatNumber, exportToCSV } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

import { useApp } from '@/context/AppContext';

export default function ShortsPage() {
  const { showToast } = useApp();
  const totalShortsViews = DEMO_SHORTS.reduce((acc, curr) => acc + curr.views, 0);
  const avgViewedRate = (
    DEMO_SHORTS.reduce((acc, curr) => acc + curr.viewedVsSwiped.viewed, 0) / DEMO_SHORTS.length
  ).toFixed(1);

  const shortsChartData = DEMO_SHORTS.map((s) => ({
    name: s.title.slice(0, 18) + '...',
    Viewed: s.viewedVsSwiped.viewed,
    SwipedAway: s.viewedVsSwiped.swiped,
  }));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                YouTube Shorts Analytics
              </h1>
              <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">
                • Shorts Feed
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Measure swipe-away rates, feed retention, audio remix engagement, and viral reach.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportToCSV('shorts-analytics', DEMO_SHORTS);
              showToast('Export Complete', 'Shorts catalog exported to CSV', 'success');
            }}
            className="text-xs font-normal"
          >
            <Download className="h-3.5 w-3.5 mr-1 text-zinc-400" /> Export Shorts Data
          </Button>
        </div>

        {/* 4 Shorts KPI Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Shorts Views"
            value={formatNumber(totalShortsViews)}
            change={34.8}
            icon={Zap}
            subtitle="Rapid discovery channel"
          />
          <StatCard
            title="Viewed vs Swiped Rate"
            value={`${avgViewedRate}%`}
            change={6.4}
            icon={TrendingUp}
            subtitle="Industry average is 71%"
          />
          <StatCard
            title="Sound Audio Uses"
            value="557"
            change={42.0}
            icon={Disc3}
            subtitle="Original audio track reuse"
          />
          <StatCard
            title="Shorts Remixes"
            value="145"
            change={28.5}
            icon={GitFork}
            subtitle="Community remixed clips"
          />
        </div>

        {/* Swipe Rate Chart: Viewed vs Swiped Away */}
        <div className="pro-card p-5">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-white/[0.04]">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Shorts Feed Retention: Viewed vs Swiped Away (%)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Videos with &gt;75% Viewed Rate trigger broader algorithmic distribution.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ChartWrapper heightClass="h-64 sm:h-72" minHeight={280}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={shortsChartData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.04} horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }} stroke="#27272a" />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#71717a', fontSize: 11 }} stroke="#27272a" />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`]}
                    contentStyle={{
                      backgroundColor: '#0e0f14',
                      borderColor: 'rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#f4f4f5',
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                    formatter={(value) => <span className="text-zinc-400 text-xs font-medium">{value}</span>}
                  />
                  <Bar dataKey="Viewed" fill="#0d9488" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="SwipedAway" fill="#3f3f46" stackId="a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* Shorts Grid Cards */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Recent Shorts Performance
          </h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {DEMO_SHORTS.map((short) => (
              <div
                key={short.id}
                className="pro-card p-4 transition-all hover:border-zinc-300 dark:hover:border-white/[0.12]"
              >
                <div className="relative aspect-[9/16] w-full max-h-72 overflow-hidden rounded-lg">
                  <ThumbnailImage
                    src={short.thumbnail}
                    alt={short.title}
                    duration={short.duration}
                    title={short.title}
                    type="short"
                    className="h-full w-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pointer-events-none">
                    <p className="text-xs font-medium text-white line-clamp-2">
                      {short.title}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">Total Views</span>
                    <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      {formatNumber(short.views)}
                    </span>
                  </div>

                  {/* Viewed vs Swiped Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-teal-400 font-medium">
                        {short.viewedVsSwiped.viewed}% Viewed
                      </span>
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {short.viewedVsSwiped.swiped}% Swiped
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800 flex">
                      <div
                        className="h-full bg-[#0d9488] rounded-l-full"
                        style={{ width: `${short.viewedVsSwiped.viewed}%` }}
                      />
                      <div
                        className="h-full bg-[#3f3f46] rounded-r-full"
                        style={{ width: `${short.viewedVsSwiped.swiped}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 dark:border-white/[0.04] text-[11px] text-zinc-500 font-mono">
                    <div>
                      <span>Likes: </span>
                      <strong className="text-zinc-800 dark:text-zinc-200">
                        {formatNumber(short.likes)}
                      </strong>
                    </div>
                    <div>
                      <span>Remixes: </span>
                      <strong className="text-zinc-800 dark:text-zinc-200">
                        {short.remixCount}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
