'use client';

import React, { useState, useMemo } from 'react';
import { calculateStatisticalSignificance } from '@/lib/ab-test-engine';
import { formatNumber } from '@/lib/utils';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ChartWrapper } from '@/components/ui/ChartWrapper';

interface SimulatorProps {
  initialCtrA?: number;
  initialCtrB?: number;
  titleA?: string;
  titleB?: string;
}

export function StatisticalSignificanceSimulator({
  initialCtrA = 4.8,
  initialCtrB = 6.2,
  titleA = 'Variant A (Baseline)',
  titleB = 'Variant B (Challenger)',
}: SimulatorProps) {
  const [totalImpressions, setTotalImpressions] = useState<number>(30000);
  const [ctrA, setCtrA] = useState<number>(initialCtrA);
  const [ctrB, setCtrB] = useState<number>(initialCtrB);
  const [trafficSplit, setTrafficSplit] = useState<50 | 60 | 70>(50);
  const [confidenceTarget, setConfidenceTarget] = useState<90 | 95 | 99>(95);

  // Compute impressions and clicks per variant based on traffic split
  const splitRatioA = (100 - trafficSplit) / 100;
  const splitRatioB = trafficSplit / 100;

  const impressionsA = Math.round(totalImpressions * splitRatioA);
  const impressionsB = Math.round(totalImpressions * splitRatioB);

  const clicksA = Math.round(impressionsA * (ctrA / 100));
  const clicksB = Math.round(impressionsB * (ctrB / 100));

  // Run statistical significance engine
  const stats = useMemo(() => {
    return calculateStatisticalSignificance(clicksA, impressionsA, clicksB, impressionsB);
  }, [clicksA, impressionsA, clicksB, impressionsB]);

  // Projected days to reach target confidence based on a typical 5,000 views/day channel
  const dailyImpressions = 4000;
  const daysToCurrent = Math.max(1, Math.round(totalImpressions / dailyImpressions));

  // Generate 14-day cumulative convergence trajectory
  const convergenceData = useMemo(() => {
    const days = 14;
    const data = [];
    const stepImpressions = Math.max(500, Math.round(totalImpressions / days));

    let cumImpA = 0;
    let cumImpB = 0;
    let cumClicksA = 0;
    let cumClicksB = 0;

    for (let day = 1; day <= days; day++) {
      const dayImpA = Math.round(stepImpressions * splitRatioA);
      const dayImpB = Math.round(stepImpressions * splitRatioB);

      cumImpA += dayImpA;
      cumImpB += dayImpB;

      // Add mild noise in early days that stabilizes over time
      const noise = (Math.sin(day * 2) * 0.4) / Math.sqrt(day);
      const simCtrA = Math.max(1, ctrA + noise * 0.7);
      const simCtrB = Math.max(1, ctrB + (noise * -0.5));

      cumClicksA += Math.round(dayImpA * (simCtrA / 100));
      cumClicksB += Math.round(dayImpB * (simCtrB / 100));

      const runningCtrA = parseFloat(((cumClicksA / cumImpA) * 100).toFixed(2));
      const runningCtrB = parseFloat(((cumClicksB / cumImpB) * 100).toFixed(2));

      const dailyStat = calculateStatisticalSignificance(
        cumClicksA,
        cumImpA,
        cumClicksB,
        cumImpB
      );

      data.push({
        day: `Day ${day}`,
        'Variant A': runningCtrA,
        'Variant B': runningCtrB,
        confidence: dailyStat.confidenceScore,
        isSignificant: dailyStat.confidenceScore >= confidenceTarget,
      });
    }

    return data;
  }, [totalImpressions, ctrA, ctrB, splitRatioA, splitRatioB, confidenceTarget]);

  return (
    <div className="pro-card p-5 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-zinc-200/80 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Interactive Two-Proportion Z-Score Simulator
              <span className="font-mono text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">
                Frequentist Engine
              </span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Simulate traffic distribution, glance velocity, and sample convergence before switching production assets.
            </p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {stats.confidenceScore >= confidenceTarget ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Significant Winner ({stats.confidenceScore}% Conf.)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="h-3.5 w-3.5" />
              Inconclusive ({stats.confidenceScore}% Conf.)
            </span>
          )}
        </div>
      </div>

      {/* Interactive Sliders & Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-4 rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-white/[0.01]">
        {/* Total Sample Size Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-zinc-400" /> Total Impressions
            </span>
            <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
              {formatNumber(totalImpressions)}
            </span>
          </div>
          <input
            type="range"
            min={2000}
            max={100000}
            step={2000}
            value={totalImpressions}
            onChange={(e) => setTotalImpressions(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>2K</span>
            <span>50K</span>
            <span>100K</span>
          </div>
        </div>

        {/* Variant A vs Variant B CTR Sliders */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">
              Variant A CTR ({ctrA}%)
            </span>
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">
              Variant B CTR ({ctrB}%)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="range"
              min={1.0}
              max={15.0}
              step={0.1}
              value={ctrA}
              onChange={(e) => setCtrA(parseFloat(e.target.value))}
              className="w-full accent-zinc-500 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
            />
            <input
              type="range"
              min={1.0}
              max={15.0}
              step={0.1}
              value={ctrB}
              onChange={(e) => setCtrB(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>A: {clicksA} clicks</span>
            <span className="text-indigo-400 font-semibold">B: {clicksB} clicks</span>
          </div>
        </div>

        {/* Target Confidence & Split */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" /> Target Threshold
            </span>
            <span className="font-mono text-xs text-indigo-400 font-medium">
              {confidenceTarget}% Level
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            {[90, 95, 99].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setConfidenceTarget(lvl as 90 | 95 | 99)}
                className={`py-1.5 text-xs font-mono font-medium rounded-lg border transition-all ${
                  confidenceTarget === lvl
                    ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400 font-semibold'
                    : 'border-zinc-200 dark:border-white/[0.08] text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {lvl}%
              </button>
            ))}
          </div>
          <div className="text-[10px] text-zinc-500 text-center">
            Critical Z: {confidenceTarget === 90 ? '1.645' : confidenceTarget === 95 ? '1.960' : '2.576'}
          </div>
        </div>
      </div>

      {/* KPI Cards: Z-Score, P-Value, Uplift */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02] p-3">
          <span className="text-[10px] uppercase font-semibold text-zinc-400">Two-Tail Z-Score</span>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            {stats.zScore}
          </p>
          <span className="text-[10px] text-zinc-500">
            {stats.zScore >= 1.96 ? 'Above 95% critical mark' : 'Within sample noise'}
          </span>
        </div>

        <div className="rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02] p-3">
          <span className="text-[10px] uppercase font-semibold text-zinc-400">P-Value</span>
          <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
            {stats.pValue}
          </p>
          <span className="text-[10px] text-zinc-500">
            {stats.pValue <= 0.05 ? 'Statistically valid (α < 0.05)' : 'High variance risk'}
          </span>
        </div>

        <div className="rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02] p-3">
          <span className="text-[10px] uppercase font-semibold text-zinc-400">CTR Delta Uplift</span>
          <p className={`text-lg font-bold mt-0.5 ${ctrB >= ctrA ? 'text-emerald-400' : 'text-rose-400'}`}>
            {ctrB >= ctrA ? '+' : ''}{(ctrB - ctrA).toFixed(1)}%
          </p>
          <span className="text-[10px] text-zinc-500">
            Relative: {(((ctrB - ctrA) / (ctrA || 1)) * 100).toFixed(1)}% gain
          </span>
        </div>

        <div className="rounded-xl border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-white/[0.02] p-3">
          <span className="text-[10px] uppercase font-semibold text-zinc-400">Sample Duration</span>
          <p className="text-lg font-bold text-indigo-400 mt-0.5">
            ~{daysToCurrent} Days
          </p>
          <span className="text-[10px] text-zinc-500">
            @ {formatNumber(dailyImpressions)} imps/day pace
          </span>
        </div>
      </div>

      {/* 14-Day Convergence Trajectory Graph */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
            14-Day Cumulative CTR Convergence Curve
          </h4>
          <span className="text-[11px] font-mono text-zinc-400">
            Confidence threshold: <strong className="text-indigo-400">{confidenceTarget}%</strong>
          </span>
        </div>

        <ChartWrapper heightClass="h-64 sm:h-72" minHeight={260}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={convergenceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.04} vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                stroke="#27272a"
                tickLine={false}
                dy={4}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                domain={['auto', 'auto']}
                tick={{ fill: '#71717a', fontSize: 11, fontFamily: 'monospace' }}
                stroke="#27272a"
                tickLine={false}
                dx={-4}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="rounded-lg border border-zinc-200 dark:border-white/[0.1] bg-white dark:bg-[#101116] p-3 shadow-xl font-mono text-xs space-y-1.5">
                      <p className="text-[10px] text-zinc-400 font-semibold">{label}</p>
                      <div className="flex justify-between gap-4 text-zinc-400">
                        <span>Variant A (Baseline):</span>
                        <strong className="text-zinc-200">{payload[0]?.value}%</strong>
                      </div>
                      <div className="flex justify-between gap-4 text-indigo-400">
                        <span>Variant B (Challenger):</span>
                        <strong>{payload[1]?.value}%</strong>
                      </div>
                      <div className="pt-1 border-t border-zinc-100 dark:border-white/[0.06] text-[10px] flex justify-between text-zinc-500">
                        <span>Confidence:</span>
                        <span className={Number(payload[0]?.payload?.confidence) >= confidenceTarget ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                          {payload[0]?.payload?.confidence}%
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, fontFamily: 'monospace', paddingTop: 8 }}
                formatter={(val) => <span className="text-zinc-400 text-xs font-sans">{val}</span>}
              />
              <Line
                type="monotone"
                dataKey="Variant A"
                stroke="#71717a"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="Variant B"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#6366f1' }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>
    </div>
  );
}
