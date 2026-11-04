'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import {
  Users,
  Eye,
  Clock,
  DollarSign,
  Play,
  ArrowUpRight,
  Sparkles,
  Target,
  Activity,
  Download,
  Copy,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { formatNumber, formatCurrency, formatDate, exportToCSV, calculateXAxisInterval } from '@/lib/utils';
import { DEMO_DAILY_DATA, DEMO_VIDEOS, getDataForRange } from '@/lib/demo-data';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';
import { VideoItem } from '@/types';

export default function DashboardOverviewPage() {
  const { selectedChannel, dateRange, goals, showToast } = useApp();
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'netSubscribers' | 'watchHours' | 'estimatedRevenue'>('views');
  const [activeVideoModal, setActiveVideoModal] = useState<VideoItem | null>(null);

  // Compute aggregated totals dynamically based on selected date range (7d, 28d, 90d, 365d)
  const currentDailyData = getDataForRange(dateRange, DEMO_DAILY_DATA);
  const totalViews = currentDailyData.reduce((acc, curr) => acc + curr.views, 0);
  const totalNetSubs = currentDailyData.reduce((acc, curr) => acc + curr.netSubscribers, 0);
  const totalWatchHours = currentDailyData.reduce((acc, curr) => acc + curr.watchHours, 0);
  const totalRevenue = currentDailyData.reduce((acc, curr) => acc + curr.estimatedRevenue, 0);

  const metricConfigs = {
    views: {
      label: 'Views',
      color: '#3b82f6',
      gradientId: 'viewsGrad',
      formatter: (v: number) => formatNumber(v),
    },
    netSubscribers: {
      label: 'Net Subscribers',
      color: '#ff0033',
      gradientId: 'subsGrad',
      formatter: (v: number) => `+${formatNumber(v)}`,
    },
    watchHours: {
      label: 'Watch Hours',
      color: '#10b981',
      gradientId: 'hoursGrad',
      formatter: (v: number) => `${formatNumber(v)}h`,
    },
    estimatedRevenue: {
      label: 'Est. Revenue',
      color: '#a855f7',
      gradientId: 'revGrad',
      formatter: (v: number) => formatCurrency(v),
    },
  };

  const currentConfig = metricConfigs[selectedMetric];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Confident, Quiet Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between pb-3 border-b border-zinc-200/80 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                Channel Overview
              </h1>
              <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                • {selectedChannel.name}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Performance metrics for <strong className="font-medium text-zinc-900 dark:text-zinc-200">{selectedChannel.name}</strong> ({selectedChannel.handle}) across the last {dateRange.toUpperCase()}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                exportToCSV(`analytics-${selectedChannel.handle}-${dateRange}`, currentDailyData);
                showToast('Export Complete', `Dashboard metrics exported (${dateRange.toUpperCase()})`, 'success');
              }}
              className="text-xs font-normal"
            >
              <Download className="h-3.5 w-3.5 mr-1 text-zinc-400" /> Export CSV
            </Button>
            <Link href="/ai-studio">
              <Button size="sm" className="text-xs font-normal">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> AI Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Core KPI Stat Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Subscribers"
            value={selectedChannel.subscribers}
            change={14.2}
            icon={Users}
            subtitle={`+${formatNumber(totalNetSubs)} this period`}
          />
          <StatCard
            title="Total Views"
            value={totalViews}
            change={22.8}
            icon={Eye}
            subtitle="Avg 19.4k views / day"
          />
          <StatCard
            title="Watch Time"
            value={`${formatNumber(totalWatchHours)}h`}
            change={18.5}
            icon={Clock}
            subtitle="Avg view duration 7:42"
          />
          <StatCard
            title="Est. Revenue"
            value={formatCurrency(totalRevenue)}
            change={26.4}
            icon={DollarSign}
            subtitle="RPM: $3.85 • CPM: $8.40"
          />
        </div>

        {/* Interactive Main Analytics Chart Card */}
        <div className="pro-card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Trajectory & Volume
                </h3>
                <span className="font-mono text-xs text-slate-400">({currentConfig.label})</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daily telemetry data across the selected window.
              </p>
            </div>

            {/* Segmented Metric Switcher */}
            <div className="inline-flex rounded-md bg-zinc-100/70 dark:bg-white/[0.03] p-0.5 border border-zinc-200/50 dark:border-white/[0.05]">
              {(['views', 'netSubscribers', 'watchHours', 'estimatedRevenue'] as const).map((key) => {
                const active = selectedMetric === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(key)}
                    className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      active
                        ? 'bg-white dark:bg-white/[0.08] text-zinc-900 dark:text-white shadow-none'
                        : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                    }`}
                  >
                    {metricConfigs[key].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart Viewport wrapped in client-safe ChartWrapper */}
          <div className="mt-4 w-full" style={{ minHeight: '340px', height: '340px' }}>
            <ChartWrapper heightClass="h-84" minHeight={340}>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={currentDailyData} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id={currentConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={currentConfig.color} stopOpacity={0.20} />
                      <stop offset="60%" stopColor={currentConfig.color} stopOpacity={0.05} />
                      <stop offset="100%" stopColor={currentConfig.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
                  <XAxis
                    dataKey="date"
                    interval={calculateXAxisInterval(currentDailyData.length, 7)}
                    tickFormatter={(val) => {
                      if (!val) return '';
                      const parts = val.split('-');
                      if (parts.length === 3) {
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        const m = months[parseInt(parts[1], 10) - 1] || parts[1];
                        return `${m} ${parseInt(parts[2], 10)}`;
                      }
                      return val.slice(5);
                    }}
                    tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                    stroke="#27272a"
                    tickLine={false}
                    dy={4}
                  />
                  <YAxis
                    tickFormatter={currentConfig.formatter}
                    tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                    stroke="#27272a"
                    tickLine={false}
                    dx={-4}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const val = Number(payload[0].value);
                      return (
                        <div className="rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#11131a] p-2.5 shadow-xl">
                          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {formatDate(String(label))}
                          </p>
                          <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                            {currentConfig.formatter(val)}
                            <span className="text-xs font-normal text-slate-400 ml-1.5 font-sans">
                              {currentConfig.label}
                            </span>
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    isAnimationActive={false}
                    dataKey={selectedMetric}
                    stroke={currentConfig.color}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#${currentConfig.gradientId})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* 2-Column Split: Top Performing Videos + Health & Goals */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Top Performing Videos (2 Cols) */}
          <div className="lg:col-span-2 pro-card p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-[#ff0033]" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Top Performing Content
                </h3>
              </div>
              <Link
                href="/videos"
                className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                All Videos <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-3 divide-y divide-slate-100 dark:divide-white/[0.04]">
              {DEMO_VIDEOS.slice(0, 4).map((video, idx) => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoModal(video)}
                  className="flex items-center gap-3.5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] cursor-pointer transition-colors px-2 rounded-lg group"
                >
                  <span className="font-mono text-xs font-semibold text-slate-400 w-4 text-center">
                    {idx + 1}
                  </span>
                  <div className="relative w-32 sm:w-36 h-20 shrink-0 aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-white/[0.08]">
                    <ThumbnailImage
                      src={video.thumbnail}
                      alt={video.title}
                      duration={video.duration}
                      title={video.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-[#ff0033] transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{formatNumber(video.views)} views</span>
                      <span>•</span>
                      <span>CTR {video.ctr}%</span>
                      <span>•</span>
                      <span className="text-emerald-500 font-medium">
                        {formatCurrency(video.estimatedRevenue)}
                      </span>
                    </div>
                  </div>

                  <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
                    {video.avgViewPercentage}% ret
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Health Score + Active Goal Tracker */}
          <div className="space-y-6">
            {/* Health Score Card */}
            <div className="pro-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Channel Health
                  </h3>
                </div>
                <Badge variant="success" size="sm">
                  Optimal
                </Badge>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="text-center">
                    <span className="font-mono text-lg font-semibold text-emerald-500">86</span>
                    <span className="block font-mono text-[9px] text-zinc-400">/ 100</span>
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    Consistent Reach Velocity
                  </p>
                  <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                    Average CTR of 9.8% places this channel in the top tier for technical content.
                  </p>
                  <Link
                    href="/audit"
                    className="inline-block pt-0.5 text-[11px] text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    View audit report →
                  </Link>
                </div>
              </div>
            </div>

            {/* Active Goals Quick Widget */}
            <div className="pro-card p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Active Goals
                  </h3>
                </div>
                <Link
                  href="/goals"
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  Manage
                </Link>
              </div>

              <div className="mt-4 space-y-4">
                {goals.slice(0, 2).map((goal) => {
                  const progress = Math.min(
                    100,
                    Math.round((goal.currentValue / goal.targetValue) * 100)
                  );
                  return (
                    <div key={goal.id} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {goal.title}
                        </span>
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                        <div
                          className="h-full bg-white dark:bg-slate-200 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between font-mono text-[10px] text-slate-400">
                        <span>
                          {formatNumber(goal.currentValue)} {goal.unit}
                        </span>
                        <span>
                          Target: {formatNumber(goal.targetValue)} {goal.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Video Detail Modal */}
        <Modal
          isOpen={Boolean(activeVideoModal)}
          onClose={() => setActiveVideoModal(null)}
          title={activeVideoModal?.title || 'Video Analytics'}
          description={`Published ${activeVideoModal ? formatDate(activeVideoModal.publishedAt) : ''}`}
          size="lg"
        >
          {activeVideoModal && (
            <div className="space-y-4 text-xs">
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 dark:border-white/[0.08]">
                <ThumbnailImage
                  src={activeVideoModal.thumbnail}
                  alt={activeVideoModal.title}
                  duration={activeVideoModal.duration}
                  title={activeVideoModal.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono">
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Views</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideoModal.views)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">CTR</span>
                  <p className="text-sm font-semibold text-emerald-500 mt-0.5">
                    {activeVideoModal.ctr}%
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Watch Time</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideoModal.watchTimeHours)} hrs
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Revenue</span>
                  <p className="text-sm font-semibold text-purple-400 mt-0.5">
                    {formatCurrency(activeVideoModal.estimatedRevenue)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3">
                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  Target Keywords & Tags:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeVideoModal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(activeVideoModal.title);
                    showToast('Title Copied', `"${activeVideoModal.title.slice(0, 30)}..." copied`, 'info');
                  }}
                >
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy Title
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveVideoModal(null)}>
                    Close
                  </Button>
                  <Link href="/seo">
                    <Button size="sm">
                      Optimize in SEO Analyzer →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </AppShell>
  );
}
