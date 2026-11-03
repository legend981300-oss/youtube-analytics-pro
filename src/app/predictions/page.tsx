'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/Badge';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { Info, Sparkles } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { formatNumber } from '@/lib/utils';

// 12-Month Predictive Modeling Data
const PREDICTION_TIMELINE = [
  { month: 'Now', expectedSubs: 248500, conservativeSubs: 248500, aggressiveSubs: 248500 },
  { month: 'Dec 26', expectedSubs: 254200, conservativeSubs: 251800, aggressiveSubs: 258000 },
  { month: 'Jan 27', expectedSubs: 261500, conservativeSubs: 256000, aggressiveSubs: 271000 },
  { month: 'Feb 27', expectedSubs: 270400, conservativeSubs: 261200, aggressiveSubs: 288000 },
  { month: 'Mar 27', expectedSubs: 282100, conservativeSubs: 268000, aggressiveSubs: 310000 },
  { month: 'Apr 27', expectedSubs: 296000, conservativeSubs: 275000, aggressiveSubs: 338000 },
  { month: 'May 27', expectedSubs: 312000, conservativeSubs: 283000, aggressiveSubs: 372000 },
  { month: 'Jun 27', expectedSubs: 330000, conservativeSubs: 292000, aggressiveSubs: 412000 },
  { month: 'Jul 27', expectedSubs: 351000, conservativeSubs: 302000, aggressiveSubs: 458000 },
  { month: 'Aug 27', expectedSubs: 375000, conservativeSubs: 313000, aggressiveSubs: 512000 },
  { month: 'Sep 27', expectedSubs: 402000, conservativeSubs: 325000, aggressiveSubs: 574000 },
  { month: 'Oct 27', expectedSubs: 432000, conservativeSubs: 338000, aggressiveSubs: 645000 },
];

export default function PredictionsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                AI Growth Forecasting & Trajectory
              </h1>
              <Badge variant="purple" size="sm">
                Simulated Forecast (Demo)
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Algorithmic simulation estimating your subscriber and monetization velocity based on modelled creator trajectory.
            </p>
          </div>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="flex items-start gap-2.5 rounded-xl border border-brand-500/20 bg-brand-500/5 p-3 text-[11px] text-slate-600 dark:text-slate-300">
          <Info className="h-4 w-4 shrink-0 text-brand-500 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Predictive Model Disclaimer:</strong> Projections below illustrate conservative, expected, and aggressive growth trajectories based on mathematical heuristics. They represent simulated modeling and never guarantee actual YouTube platform distribution or revenue payouts.
          </p>
        </div>

        {/* 3 Scenario KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Conservative Model (Base Pace)
            </span>
            <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              338,000 Subs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              +89.5k new subscribers in 12 months assuming no viral breakouts.
            </p>
            <div className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
              Est. Monthly Revenue: <strong>$6,200</strong>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-brand-500/50 bg-white p-5 shadow-md dark:border-brand-500/40 dark:bg-navy-850 relative">
            <span className="absolute -top-2.5 right-4 rounded-full bg-brand-600 px-2.5 py-0.5 text-[9px] font-extrabold text-white">
              RECOMMENDED / EXPECTED
            </span>
            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              Expected Model (95% Confidence)
            </span>
            <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              432,000 Subs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              +183.5k new subscribers with current 2 uploads/week pace and existing CTR.
            </p>
            <div className="mt-3 text-xs font-semibold text-emerald-500">
              Est. Monthly Revenue: <strong>$8,800 - $9,500</strong>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
            <span className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
              Aggressive Model (With 3 Viral Shorts)
            </span>
            <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              645,000 Subs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              +396.5k new subscribers if compounding Shorts feed recommendations hit 1M+ views.
            </p>
            <div className="mt-3 text-xs font-semibold text-purple-500">
              Est. Monthly Revenue: <strong>$14,200+</strong>
            </div>
          </div>
        </div>

        {/* 12-Month Trajectory Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                12-Month Projected Growth Curve
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing divergence between conservative, expected, and breakout algorithmic scenarios.
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ChartWrapper heightClass="h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={PREDICTION_TIMELINE} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222f52" opacity={0.3} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                  <YAxis tickFormatter={(v) => formatNumber(v)} tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                  <Tooltip formatter={(value: any, name: any) => [formatNumber(Number(value)), name]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="aggressiveSubs"
                    name="Aggressive Model"
                    stroke="#a855f7"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expectedSubs"
                    name="Expected Trajectory"
                    stroke="#f43f5e"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#f43f5e' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conservativeSubs"
                    name="Conservative Pace"
                    stroke="#64748b"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </div>
        </div>

        {/* Milestone ETA Countdown List */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
            Estimated Milestone Delivery Dates
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-850 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">250,000 Subs</span>
                <Badge variant="success" size="sm">~12 Days</Badge>
              </div>
              <p className="text-[11px] text-slate-500">Est. Date: November 14, 2026</p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-850 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">500,000 Subs</span>
                <Badge variant="cyan" size="sm">~9 Months</Badge>
              </div>
              <p className="text-[11px] text-slate-500">Est. Date: August 2027</p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-850 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">1,000,000 Gold Play</span>
                <Badge variant="purple" size="sm">~21 Months</Badge>
              </div>
              <p className="text-[11px] text-slate-500">Est. Date: August 2028</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
