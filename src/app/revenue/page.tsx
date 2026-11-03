'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { DollarSign, TrendingUp, Sparkles, AlertCircle, Download, CreditCard, ShieldCheck } from 'lucide-react';
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
import { formatNumber, formatCurrency, formatDate, exportToCSV } from '@/lib/utils';
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
  { name: 'Super Thanks & Super Chat', percentage: 5, color: '#f59e0b' },
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Estimated Revenue Dashboard
              </h1>
              <Badge variant="purple" size="sm">
                Demo Modeling
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Simulated monetization analytics based on developer & tech creator CPM benchmarks.
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
            <Download className="h-3.5 w-3.5 mr-1" /> Export Report CSV
          </Button>
        </div>

        {/* Clear Demo Label Notice Box */}
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Monetization Demo Mode Notice</p>
            <p className="leading-relaxed">
              Revenue values shown below are simulated projections based on an estimated RPM of $3.85 and CPM of $8.40. To display real historical monetization and AdSense payouts, connect your YouTube Analytics API OAuth integration in Settings.
            </p>
            <Link
              href="/settings"
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:text-amber-400 pt-1"
            >
              Configure YouTube OAuth Credentials →
            </Link>
          </div>
        </div>

        {/* 4 Revenue KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Estimated Revenue (Demo)"
            value={formatCurrency(totalRevenue)}
            change={26.4}
            icon={DollarSign}
            iconColor="text-purple-500"
            subtitle={`Last ${dateRange.toUpperCase()} (Simulated)`}
          />
          <StatCard
            title="Playback RPM (Simulated)"
            value="$3.85"
            change={4.2}
            icon={TrendingUp}
            iconColor="text-emerald-500"
            subtitle="Demo benchmark per 1,000 views"
          />
          <StatCard
            title="Estimated CPM (Simulated)"
            value="$8.40"
            change={6.1}
            icon={CreditCard}
            iconColor="text-blue-500"
            subtitle="Advertiser model per 1k impressions"
          />
          <StatCard
            title="30-Day Projection"
            value={formatCurrency(projectedMonthly)}
            change={18.2}
            icon={Sparkles}
            iconColor="text-amber-500"
            subtitle={`Based on ${formatCurrency(avgDailyRevenue)}/day avg`}
          />
        </div>

        {/* Daily Revenue Area Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Estimated Earnings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily earnings curve across {dateRange.toUpperCase()}.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ChartWrapper heightClass="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentDailyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenuePurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222f52" opacity={0.3} vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(val) => val.slice(5)}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    stroke="#334155"
                  />
                  <YAxis
                    tickFormatter={(val) => formatCurrency(val)}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    stroke="#334155"
                  />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Estimated Earnings']}
                    labelFormatter={(l) => `Date: ${formatDate(String(l))}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="estimatedRevenue"
                    stroke="#a855f7"
                    strokeWidth={2.5}
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
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Monetization Streams Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Share of income by monetization product.
            </p>

            <ChartWrapper heightClass="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={REVENUE_SOURCES}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
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

            <div className="space-y-2 mt-2">
              {REVENUE_SOURCES.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-navy-800"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.percentage}% ({formatCurrency((totalRevenue * item.percentage) / 100)})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Earning Videos */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Top Earning Content
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Videos generating the highest monetary returns.
            </p>

            <div className="space-y-3">
              {DEMO_VIDEOS.slice(0, 4).map((vid) => (
                <div
                  key={vid.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50 dark:border-navy-750 dark:bg-navy-800"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-16 shrink-0 overflow-hidden rounded">
                      <ThumbnailImage
                        src={vid.thumbnail}
                        alt={vid.title}
                        title={vid.title}
                        duration={vid.duration}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {vid.title}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {formatNumber(vid.views)} views • RPM $4.32
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-500 shrink-0">
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
