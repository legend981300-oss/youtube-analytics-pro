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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                YouTube Shorts Analytics
              </h1>
              <Badge variant="cyan" size="sm">
                Shorts Feed
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
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
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Export Shorts Data
          </Button>
        </div>

        {/* 4 Shorts KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Shorts Views"
            value={formatNumber(totalShortsViews)}
            change={34.8}
            icon={Zap}
            iconColor="text-cyan-500"
            subtitle="Rapid discovery channel"
          />
          <StatCard
            title="Viewed vs Swiped Rate"
            value={`${avgViewedRate}%`}
            change={6.4}
            icon={TrendingUp}
            iconColor="text-emerald-500"
            subtitle="Industry average is 71%"
          />
          <StatCard
            title="Sound Audio Uses"
            value="557"
            change={42.0}
            icon={Disc3}
            iconColor="text-purple-500"
            subtitle="Original audio track reuse"
          />
          <StatCard
            title="Shorts Remixes"
            value="145"
            change={28.5}
            icon={GitFork}
            iconColor="text-rose-500"
            subtitle="Community remixed clips"
          />
        </div>

        {/* Swipe Rate Chart: Viewed vs Swiped Away */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Shorts Feed Retention: Viewed vs Swiped Away (%)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Videos with &gt;75% Viewed Rate trigger broader algorithmic distribution.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ChartWrapper heightClass="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shortsChartData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222f52" opacity={0.3} horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                  <Tooltip formatter={(value: any) => [`${value}%`]} />
                  <Legend />
                  <Bar dataKey="Viewed" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="SwipedAway" fill="#f43f5e" stackId="a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* Shorts Grid Cards */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
            Recent Shorts Performance
          </h3>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {DEMO_SHORTS.map((short) => (
              <div
                key={short.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm hover:border-slate-300 dark:border-navy-750 dark:bg-navy-850 dark:hover:border-navy-600 transition-all"
              >
                <div className="relative aspect-[9/16] w-full max-h-72 overflow-hidden rounded-xl">
                  <ThumbnailImage
                    src={short.thumbnail}
                    alt={short.title}
                    duration={short.duration}
                    title={short.title}
                    type="short"
                    className="h-full w-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pointer-events-none">
                    <p className="text-xs font-bold text-white line-clamp-2">
                      {short.title}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Total Views</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatNumber(short.views)}
                    </span>
                  </div>

                  {/* Viewed vs Swiped Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-emerald-500 font-bold">
                        {short.viewedVsSwiped.viewed}% Viewed
                      </span>
                      <span className="text-rose-500 font-medium">
                        {short.viewedVsSwiped.swiped}% Swiped
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-rose-500/30 flex">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${short.viewedVsSwiped.viewed}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-navy-750 text-[11px] text-slate-500">
                    <div>
                      <span>Likes: </span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {formatNumber(short.likes)}
                      </strong>
                    </div>
                    <div>
                      <span>Remixes: </span>
                      <strong className="text-slate-800 dark:text-slate-200">
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
