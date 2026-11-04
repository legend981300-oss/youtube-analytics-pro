'use client';

import React, { useState } from 'react';
import {
  GitCompare,
  TrendingUp,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Play,
  Clock,
  Eye,
  DollarSign,
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
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
  Legend,
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
  const runnerUpVideo = winner === 'A' ? videoB : videoA;

  // Compute delta percentages
  const getDelta = (valA: number, valB: number) => {
    if (!valB) return 0;
    return (((valA - valB) / valB) * 100).toFixed(1);
  };

  const handleSaveTakeaways = () => {
    addIdea({
      title: `Formula based on "${winningVideo.title.slice(0, 40)}..."`,
      category: 'Winning Formula',
      targetKeywords: winningVideo.tags,
      predictedPotential: 'Very High',
      status: 'idea',
      notes: `Replicate ${winningVideo.ctr}% CTR hook structure and pacing from top performing video "${winningVideo.title}".`,
      tags: winningVideo.tags,
    });
    showToast('Saved to Idea Vault', 'Winning video formula blueprint added to your pipeline', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Selector Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Head-to-Head Video Performance Matrix
              </h3>
              <Badge variant="cyan" size="sm">
                Deep Autopsy
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any two videos to analyze retention drop-offs, click-through variance, and revenue differentials
            </p>
          </div>
          <Button variant="glow" size="sm" onClick={handleSaveTakeaways} className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Replicate Winning Formula
          </Button>
        </div>

        {/* Video Selectors */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selector A */}
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center gap-1">
                <Play className="h-3 w-3" /> Video Variant A
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
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            >
              {DEMO_VIDEOS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({formatNumber(v.views)} views)
                </option>
              ))}
            </select>
            <div className="mt-3 flex items-center gap-3">
              <img src={videoA.thumbnail} alt="" className="h-14 w-24 rounded-lg object-cover shadow-sm" />
              <div className="min-w-0 text-xs">
                <div className="font-bold text-slate-900 dark:text-white truncate">{videoA.title}</div>
                <div className="text-slate-400 mt-0.5">
                  Published {videoA.publishedAt} • {videoA.duration}
                </div>
              </div>
            </div>
          </div>

          {/* Selector B */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Play className="h-3 w-3" /> Video Variant B
              </span>
              {winner === 'B' && (
                <Badge variant="purple" size="sm" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" /> Winner
                </Badge>
              )}
            </div>
            <select
              value={videoBId}
              onChange={(e) => setVideoBId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-navy-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
            >
              {DEMO_VIDEOS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title} ({formatNumber(v.views)} views)
                </option>
              ))}
            </select>
            <div className="mt-3 flex items-center gap-3">
              <img src={videoB.thumbnail} alt="" className="h-14 w-24 rounded-lg object-cover shadow-sm" />
              <div className="min-w-0 text-xs">
                <div className="font-bold text-slate-900 dark:text-white truncate">{videoB.title}</div>
                <div className="text-slate-400 mt-0.5">
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
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-3.5 shadow-sm text-center">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Views</div>
          <div className="mt-2 flex items-baseline justify-center gap-2">
            <span className="text-sm font-bold text-brand-500">{formatNumber(videoA.views)}</span>
            <span className="text-xs text-slate-400">vs</span>
            <span className="text-sm font-bold text-purple-500">{formatNumber(videoB.views)}</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
            Δ {Math.abs(Number(getDelta(videoA.views, videoB.views)))}%
          </div>
        </div>

        {/* Metric: CTR */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-3.5 shadow-sm text-center">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Click-Through (CTR)</div>
          <div className="mt-2 flex items-baseline justify-center gap-2">
            <span className="text-sm font-bold text-brand-500">{videoA.ctr}%</span>
            <span className="text-xs text-slate-400">vs</span>
            <span className="text-sm font-bold text-purple-500">{videoB.ctr}%</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
            Δ {(Math.abs(videoA.ctr - videoB.ctr)).toFixed(1)}% pt
          </div>
        </div>

        {/* Metric: Retention */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-3.5 shadow-sm text-center">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Avg Retention</div>
          <div className="mt-2 flex items-baseline justify-center gap-2">
            <span className="text-sm font-bold text-brand-500">{videoA.avgViewPercentage}%</span>
            <span className="text-xs text-slate-400">vs</span>
            <span className="text-sm font-bold text-purple-500">{videoB.avgViewPercentage}%</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
            Δ {Math.abs(Number((videoA.avgViewPercentage - videoB.avgViewPercentage).toFixed(1)))}% pt
          </div>
        </div>

        {/* Metric: Watch Hours */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-3.5 shadow-sm text-center">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Watch Hours</div>
          <div className="mt-2 flex items-baseline justify-center gap-2">
            <span className="text-sm font-bold text-brand-500">{formatNumber(videoA.watchTimeHours)}h</span>
            <span className="text-xs text-slate-400">vs</span>
            <span className="text-sm font-bold text-purple-500">{formatNumber(videoB.watchTimeHours)}h</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
            Δ {Math.abs(Number(getDelta(videoA.watchTimeHours, videoB.watchTimeHours)))}%
          </div>
        </div>

        {/* Metric: Revenue */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-3.5 shadow-sm text-center">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Est. Revenue</div>
          <div className="mt-2 flex items-baseline justify-center gap-2">
            <span className="text-sm font-bold text-brand-500">{formatCurrency(videoA.estimatedRevenue)}</span>
            <span className="text-xs text-slate-400">vs</span>
            <span className="text-sm font-bold text-purple-500">{formatCurrency(videoB.estimatedRevenue)}</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
            Δ ${Math.abs(videoA.estimatedRevenue - videoB.estimatedRevenue)}
          </div>
        </div>

        {/* Metric: Likes */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-3.5 shadow-sm text-center">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Likes & Likes/View</div>
          <div className="mt-2 flex items-baseline justify-center gap-2">
            <span className="text-sm font-bold text-brand-500">{formatNumber(videoA.likes)}</span>
            <span className="text-xs text-slate-400">vs</span>
            <span className="text-sm font-bold text-purple-500">{formatNumber(videoB.likes)}</span>
          </div>
          <div className="mt-2 inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
            Δ {Math.abs(Number(getDelta(videoA.likes, videoB.likes)))}%
          </div>
        </div>
      </div>

      {/* Synchronized Retention Curve */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 p-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Synchronized Viewer Retention Curves
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparing audience drop-off percentages from introductory hook through to the final seconds
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-brand-500">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-500"></span> Video A
            </span>
            <span className="flex items-center gap-1.5 text-purple-500">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span> Video B
            </span>
          </div>
        </div>

        <div className="mt-4">
          <ChartWrapper heightClass="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionCurveData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222f52" opacity={0.3} vertical={false} />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} stroke="#334155" />
                <YAxis
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  stroke="#334155"
                />
                <Tooltip formatter={(value: any, name: any) => [`${value}% Audience Retained`, name === 'videoA' ? 'Video A' : 'Video B']} />
                <Line
                  type="monotone"
                  dataKey="videoA"
                  name="videoA"
                  stroke="#f43f5e"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#f43f5e' }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="videoB"
                  name="videoB"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#8b5cf6' }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>
      </div>

      {/* Algorithmic Autopsy Analysis */}
      <div className="rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/5 via-navy-900/60 to-purple-500/5 p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-brand-500" />
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Algorithmic Post-Mortem: Why {winner === 'A' ? 'Video A' : 'Video B'} Won
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-navy-800/60 p-3.5 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Hook Velocity
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              The winning video maintained {Math.max(videoA.avgViewPercentage, videoB.avgViewPercentage)}% retention at
              the 0:30 mark by fulfilling its thumbnail premise within the first 6 seconds without a rambling intro.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-navy-800/60 p-3.5 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Click-Through Compounding
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Its {Math.max(videoA.ctr, videoB.ctr)}% CTR generated a higher initial velocity score on the YouTube
              recommendation engine, triggering wider browse feed distribution.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-navy-800/60 p-3.5 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Viewer Replay Loop
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Key code walkthrough and architecture diagram segments drove repeated scrub-backs, multiplying effective
              watch time per impression by 1.34x.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
