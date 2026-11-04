'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { DollarSign, TrendingUp, Sparkles, Download, CreditCard, ShieldCheck } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { formatNumber, formatCurrency, formatDate, exportToCSV, calculateXAxisInterval } from '@/lib/utils';
import { DEMO_DAILY_DATA, DEMO_VIDEOS, getDataForRange } from '@/lib/demo-data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';
import Link from 'next/link';

const REVENUE_SOURCES = [
  { name: 'Watch Page Ads (AdSense)', percentage: 72, color: '#10b981' },
  { name: 'YouTube Premium Revenue', percentage: 14, color: '#3b82f6' },
  { name: 'Channel Memberships', percentage: 9, color: '#a855f7' },
  { name: 'Super Thanks & Chat', percentage: 5, color: '#f59e0b' },
];

export default function RevenuePage() {
  const { selectedChannel, dateRange, showToast } = useApp();

  const currentDailyData = getDataForRange(dateRange, DEMO_DAILY_DATA);
  const totalRevenue = currentDailyData.reduce((acc, curr) => acc + curr.estimatedRevenue, 0);
  const avgDailyRevenue = totalRevenue / currentDailyData.length;
  const projectedMonthly = avgDailyRevenue * 30;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-1 border-b border-slate-200/80 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Revenue & Monetization
              </h1>
              <span className="font-mono text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] px-2 py-0.5 rounded">
                RPM / CPM Telemetry
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Estimated ad revenue, playback RPM, and monetization streams for <strong className="font-medium text-slate-900 dark:text-slate-200">{selectedChannel.name}</strong>.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportToCSV(`revenue-report-${selectedChannel.handle}-${dateRange}`, currentDailyData);
              showToast('Export Complete', `Revenue data exported (${dateRange.toUpperCase()})`, 'success');
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
          </Button>
        </div>

        {/* 4 Revenue KPIs */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Estimated Revenue"
            value={formatCurrency(totalRevenue)}
            change={26.4}
            icon={DollarSign}
            subtitle={`Across last ${dateRange.toUpperCase()}`}
          />
          <StatCard
            title="Playback RPM"
            value="$3.85"
            change={4.2}
            icon={TrendingUp}
            subtitle="Per 1,000 video views"
          />
          <StatCard
            title="Estimated CPM"
            value="$8.40"
            change={6.1}
            icon={CreditCard}
            subtitle="Advertiser cost per 1k impressions"
          />
          <StatCard
            title="30-Day Run Rate"
            value={formatCurrency(projectedMonthly)}
            change={18.2}
            icon={Sparkles}
            subtitle={`Avg ${formatCurrency(avgDailyRevenue)} / day`}
          />
        </div>

        {/* Daily Revenue Area Chart */}
        <div className="pro-card p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/[0.06]">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Daily Revenue Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Earnings curve across the active date range.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ChartWrapper heightClass="h-72 sm:h-80" minHeight={320}>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={currentDailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenuePurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
                      <stop offset="50%" stopColor="#a855f7" stopOpacity={0.10} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                  <XAxis
                    dataKey="date"
                    minTickGap={36}
                    interval="preserveStartEnd"
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
                    tickFormatter={(val) => formatCurrency(val)}
                    tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                    stroke="#27272a"
                    tickLine={false}
                    dx={-4}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-[#11131a] p-2.5 shadow-xl font-mono text-xs">
                          <p className="text-[10px] text-slate-400">{formatDate(String(label))}</p>
                          <p className="text-purple-400 font-semibold mt-0.5">
                            {formatCurrency(Number(payload[0].value))}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    isAnimationActive={false}
                    dataKey="estimatedRevenue"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenuePurple)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* 2 Cols: Revenue Sources + Top Earning Videos */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Source Breakdown */}
          <div className="pro-card p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Monetization Streams
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
              Share of income by monetization product.
            </p>

            <ChartWrapper heightClass="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={REVENUE_SOURCES}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={74}
                    paddingAngle={4}
                    dataKey="percentage"
                  >
                    {REVENUE_SOURCES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>

            <div className="space-y-1.5 mt-2">
              {REVENUE_SOURCES.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs p-2 rounded-md bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {item.percentage}% ({formatCurrency((totalRevenue * item.percentage) / 100)})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Earning Videos */}
          <div className="pro-card p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Top Yielding Content
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
              Videos generating the highest monetary returns.
            </p>

            <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-white/[0.04]">
              {DEMO_VIDEOS.slice(0, 4).map((vid) => (
                <div
                  key={vid.id}
                  className="pt-2.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-16 shrink-0 overflow-hidden rounded-md border border-slate-200 dark:border-white/[0.08]">
                      <ThumbnailImage
                        src={vid.thumbnail}
                        alt={vid.title}
                        title={vid.title}
                        duration={vid.duration}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                        {vid.title}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">
                        {formatNumber(vid.views)} views • RPM $4.32
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-500 shrink-0">
                    {formatCurrency(vid.estimatedRevenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
