'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Sparkles,
  Play,
  CheckCircle2,
} from 'lucide-react';
import { DEMO_VIDEOS } from '@/lib/demo-data';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useApp } from '@/context/AppContext';

export const VideoComparisonMatrix: React.FC = () => {
  const { showToast, addIdea } = useApp();
  const [videoAId, setVideoAId] = useState(DEMO_VIDEOS[0].id);
  const [videoBId, setVideoBId] = useState(DEMO_VIDEOS[1].id);

  const videoA = DEMO_VIDEOS.find((v) => v.id === videoAId) || DEMO_VIDEOS[0];
  const videoB = DEMO_VIDEOS.find((v) => v.id === videoBId) || DEMO_VIDEOS[1];

  // Retention timeline comparison points
  const retentionCurveData = [
    { time: '0:00 (Intro)', videoA: 100, videoB: 100 },
    { time: '0:30 (Hook)', videoA: Math.min(100, Math.round(videoA.avgViewPercentage * 1.5)), videoB: Math.min(100, Math.round(videoB.avgViewPercentage * 1.6)) },
    { time: '1:30 (Core)', videoA: Math.round(videoA.avgViewPercentage * 1.2), videoB: Math.round(videoB.avgViewPercentage * 1.3) },
    { time: '3:00 (Mid)', videoA: Math.round(videoA.avgViewPercentage * 0.95), videoB: Math.round(videoB.avgViewPercentage * 1.05) },
    { time: '5:00 (Climax)', videoA: Math.round(videoA.avgViewPercentage * 0.75), videoB: Math.round(videoB.avgViewPercentage * 0.85) },
    { time: '10:00 (Outro)', videoA: Math.round(videoA.avgViewPercentage * 0.5), videoB: Math.round(videoB.avgViewPercentage * 0.6) },
  ];

  // Determine winner by views and engagement
  const scoreA = videoA.views * 0.4 + videoA.ctr * 10000 + videoA.avgViewPercentage * 5000;
  const scoreB = videoB.views * 0.4 + videoB.ctr * 10000 + videoB.avgViewPercentage * 5000;
  const winner = scoreA >= scoreB ? 'A' : 'B';
  const winningVideo = winner === 'A' ? videoA : videoB;

  // Compute delta percentages
  const getDelta = (valA: number, valB: number) => {
    if (!valB) return 0;
    return (((valA - valB) / valB) * 100).toFixed(1);
  };

  const handleSaveTakeaways = () => {
    addIdea({
      title: `Formula: "${winningVideo.title.slice(0, 40)}..."`,
      category: 'Winning Formula',
      targetKeywords: winningVideo.tags,
      predictedPotential: 'Very High',
      status: 'idea',
      notes: `Replicate ${winningVideo.ctr}% CTR hook structure and pacing from top performing video "${winningVideo.title}".`,
      tags: winningVideo.tags,
    });
    showToast('Saved to Idea Vault', 'Winning video blueprint added to your pipeline', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Selector Card */}
      <div className="pro-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3.5 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Video Autopsy Matrix
              </h3>
              <Badge variant="outline" size="sm">
                Head-to-Head
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select two videos to compare retention curves, CTR drop-offs, and earnings differentials.
            </p>
          </div>
          <Button size="sm" onClick={handleSaveTakeaways}>
            <Sparkles className="h-3 w-3 mr-1" /> Replicate Winning Formula
          </Button>
        </div>

        {/* Video Selectors */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selector A */}
          <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Play className="h-2.5 w-2.5 text-[#ff0033]" /> Video Variant A
              </span>
              {winner === 'A' && (
                <Badge variant="success" size="sm" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> Winner
                </Badge>
              )}
            </div>
            <select
              value={videoAId}
              onChange={(e) => setVideoAId(e.target.value)}
              className="w-full rounded-md border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#11131a] px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
            >
              {DEMO_VIDEOS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({formatNumber(v.views)} views)
                </option>
              ))}
            </select>
            <div className="mt-2.5 flex items-center gap-3">
              <img src={videoA.thumbnail} alt="" className="h-12 w-20 rounded-md object-cover border border-slate-200 dark:border-white/[0.08]" />
              <div className="min-w-0 text-xs">
                <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{videoA.title}</div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                  Published {videoA.publishedAt} • {videoA.duration}
                </div>
              </div>
            </div>
          </div>

          {/* Selector B */}
          <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Play className="h-2.5 w-2.5 text-purple-400" /> Video Variant B
              </span>
              {winner === 'B' && (
                <Badge variant="success" size="sm" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> Winner
                </Badge>
              )}
            </div>
            <select
              value={videoBId}
              onChange={(e) => setVideoBId(e.target.value)}
              className="w-full rounded-md border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#11131a] px-2.5 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
            >
              {DEMO_VIDEOS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({formatNumber(v.views)} views)
                </option>
              ))}
            </select>
            <div className="mt-2.5 flex items-center gap-3">
              <img src={videoB.thumbnail} alt="" className="h-12 w-20 rounded-md object-cover border border-slate-200 dark:border-white/[0.08]" />
              <div className="min-w-0 text-xs">
                <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{videoB.title}</div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                  Published {videoB.publishedAt} • {videoB.duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Metric Comparison Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric: Views */}
        <div className="pro-card p-3 text-center font-mono">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Views</div>
          <div className="mt-1.5 flex items-baseline justify-center gap-1.5 text-xs font-semibold">
            <span className="text-[#ff0033]">{formatNumber(videoA.views)}</span>
            <span className="text-slate-500 font-sans text-[10px]">vs</span>
            <span className="text-purple-400">{formatNumber(videoB.views)}</span>
          </div>
          <div className="mt-1.5 inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[9px] font-semibold text-emerald-500 bg-emerald-500/10">
            Δ {Math.abs(Number(getDelta(videoA.views, videoB.views)))}%
          </div>
        </div>

        {/* Metric: CTR */}
        <div className="pro-card p-3 text-center font-mono">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">CTR</div>
          <div className="mt-1.5 flex items-baseline justify-center gap-1.5 text-xs font-semibold">
            <span className="text-[#ff0033]">{videoA.ctr}%</span>
            <span className="text-slate-500 font-sans text-[10px]">vs</span>
            <span className="text-purple-400">{videoB.ctr}%</span>
          </div>
          <div className="mt-1.5 inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[9px] font-semibold text-emerald-500 bg-emerald-500/10">
            Δ {(Math.abs(videoA.ctr - videoB.ctr)).toFixed(1)}% pt
          </div>
        </div>

        {/* Metric: Retention */}
        <div className="pro-card p-3 text-center font-mono">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Retention</div>
          <div className="mt-1.5 flex items-baseline justify-center gap-1.5 text-xs font-semibold">
            <span className="text-[#ff0033]">{videoA.avgViewPercentage}%</span>
            <span className="text-slate-500 font-sans text-[10px]">vs</span>
            <span className="text-purple-400">{videoB.avgViewPercentage}%</span>
          </div>
          <div className="mt-1.5 inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[9px] font-semibold text-emerald-500 bg-emerald-500/10">
            Δ {Math.abs(Number((videoA.avgViewPercentage - videoB.avgViewPercentage).toFixed(1)))}% pt
          </div>
        </div>

        {/* Metric: Watch Hours */}
        <div className="pro-card p-3 text-center font-mono">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Watch Time</div>
          <div className="mt-1.5 flex items-baseline justify-center gap-1.5 text-xs font-semibold">
            <span className="text-[#ff0033]">{formatNumber(videoA.watchTimeHours)}h</span>
            <span className="text-slate-500 font-sans text-[10px]">vs</span>
            <span className="text-purple-400">{formatNumber(videoB.watchTimeHours)}h</span>
          </div>
          <div className="mt-1.5 inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[9px] font-semibold text-emerald-500 bg-emerald-500/10">
            Δ {Math.abs(Number(getDelta(videoA.watchTimeHours, videoB.watchTimeHours)))}%
          </div>
        </div>

        {/* Metric: Revenue */}
        <div className="pro-card p-3 text-center font-mono">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Revenue</div>
          <div className="mt-1.5 flex items-baseline justify-center gap-1.5 text-xs font-semibold">
            <span className="text-[#ff0033]">{formatCurrency(videoA.estimatedRevenue)}</span>
            <span className="text-slate-500 font-sans text-[10px]">vs</span>
            <span className="text-purple-400">{formatCurrency(videoB.estimatedRevenue)}</span>
          </div>
          <div className="mt-1.5 inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[9px] font-semibold text-emerald-500 bg-emerald-500/10">
            Δ ${Math.abs(videoA.estimatedRevenue - videoB.estimatedRevenue)}
          </div>
        </div>

        {/* Metric: Likes */}
        <div className="pro-card p-3 text-center font-mono">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Likes</div>
          <div className="mt-1.5 flex items-baseline justify-center gap-1.5 text-xs font-semibold">
            <span className="text-[#ff0033]">{formatNumber(videoA.likes)}</span>
            <span className="text-slate-500 font-sans text-[10px]">vs</span>
            <span className="text-purple-400">{formatNumber(videoB.likes)}</span>
          </div>
          <div className="mt-1.5 inline-flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[9px] font-semibold text-emerald-500 bg-emerald-500/10">
            Δ {Math.abs(Number(getDelta(videoA.likes, videoB.likes)))}%
          </div>
        </div>
      </div>

      {/* Synchronized Retention Curve */}
      <div className="pro-card p-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/[0.06]">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Synchronized Audience Retention Curves
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Audience drop-off percentages from introductory hook through to the final seconds.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="flex items-center gap-1.5 text-[#ff0033]">
              <span className="h-2 w-2 rounded-full bg-[#ff0033]" /> Video A
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="h-2 w-2 rounded-full bg-purple-400" /> Video B
            </span>
          </div>
        </div>

        <div className="mt-4">
          <ChartWrapper heightClass="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionCurveData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} stroke="#222" tickLine={false} />
                <YAxis
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                  stroke="#222"
                  tickLine={false}
                />
                <Tooltip formatter={(value: any, name: any) => [`${value}% Retained`, name === 'videoA' ? 'Video A' : 'Video B']} />
                <Line
                  type="monotone"
                  dataKey="videoA"
                  name="videoA"
                  stroke="#ff0033"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#ff0033' }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="videoB"
                  name="videoB"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#a855f7' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      </div>

      {/* Algorithmic Autopsy Analysis */}
      <div className="pro-card p-5">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
          <Sparkles className="h-4 w-4 text-[#ff0033]" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Algorithmic Autopsy: Why {winner === 'A' ? 'Video A' : 'Video B'} Won
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Hook Velocity
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Maintained {Math.max(videoA.avgViewPercentage, videoB.avgViewPercentage)}% retention at
              the 0:30 mark by fulfilling its thumbnail premise within the first 6 seconds.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Click-Through Compounding
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Its {Math.max(videoA.ctr, videoB.ctr)}% CTR generated a higher initial velocity score on the YouTube
              recommendation engine, triggering wider browse feed distribution.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Rewatch Cycles
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Key code walkthrough and architecture diagram segments drove repeated scrub-backs, multiplying effective
              watch time per impression by 1.34x.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
