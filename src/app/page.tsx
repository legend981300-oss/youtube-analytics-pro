'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import {
  Users,
  Eye,
  Clock,
  DollarSign,
  TrendingUp,
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
import { formatNumber, formatCurrency, formatDate, exportToCSV } from '@/lib/utils';
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
      color: '#f43f5e',
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
        {/* Welcome & Channel Quick Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Channel Analytics
              </h1>
              <Badge variant="purple" size="sm">
                Demo Mode (Simulated Data)
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Overview performance for{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {selectedChannel.name}
              </span>{' '}
              over the last {dateRange.toUpperCase()}.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                exportToCSV(`analytics-${selectedChannel.handle}-${dateRange}`, currentDailyData);
                showToast('Export Complete', `Dashboard metrics exported (${dateRange.toUpperCase()})`, 'success');
              }}
            >
              <Download className="h-3.5 w-3.5 mr-1" /> Export Data
            </Button>
            <Link href="/ai-studio">
              <Button size="sm">
                <Sparkles className="h-3.5 w-3.5 mr-1" /> AI Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Core KPI Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Subscribers"
            value={formatNumber(selectedChannel.subscribers)}
            change={14.2}
            icon={Users}
            iconColor="text-rose-500"
            subtitle={`+${formatNumber(totalNetSubs)} this period`}
          />
          <StatCard
            title="Total Views"
            value={formatNumber(totalViews)}
            change={22.8}
            icon={Eye}
            iconColor="text-blue-500"
            subtitle="Avg 19.4k views / day"
          />
          <StatCard
            title="Watch Time"
            value={`${formatNumber(totalWatchHours)}h`}
            change={18.5}
            icon={Clock}
            iconColor="text-emerald-500"
            subtitle="Avg view duration 7:42"
          />
          <StatCard
            title="Est. Revenue"
            value={formatCurrency(totalRevenue)}
            change={26.4}
            icon={DollarSign}
            iconColor="text-purple-500"
            subtitle="RPM: $3.85 • CPM: $8.40"
            badge="DEMO"
          />
        </div>

        {/* Interactive Main Analytics Chart Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Growth & Trend Trajectory
                </h3>
                <span className="text-xs text-slate-400">({currentConfig.label})</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daily timeline performance across {dateRange.toUpperCase()}.
              </p>
            </div>

            {/* Metric Switcher Pills */}
            <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-navy-950">
              <button
                onClick={() => setSelectedMetric('views')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedMetric === 'views'
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-navy-750 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Views
              </button>
              <button
                onClick={() => setSelectedMetric('netSubscribers')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedMetric === 'netSubscribers'
                    ? 'bg-white text-rose-600 shadow-sm dark:bg-navy-750 dark:text-rose-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Subscribers
              </button>
              <button
                onClick={() => setSelectedMetric('watchHours')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedMetric === 'watchHours'
                    ? 'bg-white text-emerald-600 shadow-sm dark:bg-navy-750 dark:text-emerald-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Watch Hours
              </button>
              <button
                onClick={() => setSelectedMetric('estimatedRevenue')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedMetric === 'estimatedRevenue'
                    ? 'bg-white text-purple-600 shadow-sm dark:bg-navy-750 dark:text-purple-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Est. Revenue
              </button>
            </div>
          </div>

          {/* Chart Viewport wrapped in client-safe ChartWrapper */}
          <div className="mt-4">
            <ChartWrapper heightClass="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id={currentConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.35} />
                      <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222f52" opacity={0.3} vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) => val.slice(5)}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    stroke="#334155"
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={currentConfig.formatter}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    stroke="#334155"
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: any) => [currentConfig.formatter(Number(value)), currentConfig.label]}
                    labelFormatter={(label) => `Date: ${formatDate(String(label))}`}
                  />
                  <Area
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={currentConfig.color}
                    strokeWidth={2.5}
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
          <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
              <div className="flex items-center gap-2">
                <Play className="h-4 w-4 text-brand-500 fill-brand-500/20" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Top Performing Videos
                </h3>
              </div>
              <Link
                href="/videos"
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1"
              >
                View All Videos <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {DEMO_VIDEOS.slice(0, 4).map((video, idx) => (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoModal(video)}
                  className="flex items-center gap-3.5 rounded-xl p-2.5 hover:bg-slate-50 dark:hover:bg-navy-800/60 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-navy-700 group"
                >
                  <span className="text-xs font-bold text-slate-400 w-4 text-center">
                    #{idx + 1}
                  </span>
                  <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg">
                    <ThumbnailImage
                      src={video.thumbnail}
                      alt={video.title}
                      duration={video.duration}
                      title={video.title}
                      className="h-full w-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-500 transition-colors">
                      {video.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{formatNumber(video.views)} views</span>
                      <span>•</span>
                      <span>CTR: {video.ctr}%</span>
                      <span>•</span>
                      <span className="text-emerald-500 font-medium">
                        {formatCurrency(video.estimatedRevenue)}
                      </span>
                    </div>
                  </div>

                  <Badge variant="success" size="sm" className="hidden sm:inline-flex">
                    {video.avgViewPercentage}% ret
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Health Score + Active Goal Tracker */}
          <div className="space-y-6">
            {/* Health Score Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Channel Health
                  </h3>
                </div>
                <Badge variant="success" size="sm">
                  Excellent
                </Badge>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border-4 border-emerald-500">
                  <div className="text-center">
                    <span className="text-2xl font-black text-emerald-500">86</span>
                    <span className="block text-[9px] font-semibold text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Strong Algorithmic Velocity
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    High CTR (9.8%) and consistent schedule give your channel top 10% reach in tech.
                  </p>
                  <Link
                    href="/audit"
                    className="inline-block pt-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    View 6 Audit Recommendations →
                  </Link>
                </div>
              </div>
            </div>

            {/* Active Goals Quick Widget */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Goal Progress
                  </h3>
                </div>
                <Link
                  href="/goals"
                  className="text-xs text-brand-600 dark:text-brand-400 font-semibold hover:underline"
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
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {goal.title}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-navy-950">
                        <div
                          className="h-full bg-gradient-to-r from-brand-600 to-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
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
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <ThumbnailImage
                  src={activeVideoModal.thumbnail}
                  alt={activeVideoModal.title}
                  duration={activeVideoModal.duration}
                  title={activeVideoModal.title}
                  className="h-full w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Views</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideoModal.views)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">CTR</span>
                  <p className="text-base font-bold text-emerald-500 mt-0.5">
                    {activeVideoModal.ctr}%
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Watch Time</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideoModal.watchTimeHours)} hrs
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. Earnings</span>
                  <p className="text-base font-bold text-purple-500 mt-0.5">
                    {formatCurrency(activeVideoModal.estimatedRevenue)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Active Tags & Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeVideoModal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-navy-700 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-100 dark:border-navy-750">
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
