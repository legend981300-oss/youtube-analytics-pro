'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { GitCompare, TrendingUp, Sparkles, Plus, Check } from 'lucide-react';
import { DEMO_COMPETITORS } from '@/lib/demo-data';
import { useApp } from '@/context/AppContext';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChartWrapper } from '@/components/ui/ChartWrapper';
import { VideoComparisonMatrix } from '@/components/comparison/VideoComparisonMatrix';
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

export default function ChannelComparisonPage() {
  const { selectedChannel, addIdea, showToast } = useApp();
  const [addedGaps, setAddedGaps] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'video-vs-video' | 'channel-benchmark'>('video-vs-video');

  const comparisonData = [
    {
      name: selectedChannel.name,
      subscribers: selectedChannel.subscribers,
      avgViews: 58000,
      monthlyGrowth: 5.6,
      engagement: 8.2,
      isYourChannel: true,
    },
    ...DEMO_COMPETITORS.map((c) => ({
      name: c.name,
      subscribers: c.subscribers,
      avgViews: c.avgViewsPerVideo,
      monthlyGrowth: c.subGrowthRate,
      engagement: c.engagementRate,
      isYourChannel: false,
    })),
  ];

  const contentGaps = [
    {
      id: 'gap-1',
      topic: 'Full Stack AI Agent with LangChain v0.3',
      competitor: 'DevMatrix Official',
      views: '310k views in 7 days',
      opportunityScore: 'Very High',
      suggestedTitle: 'Build an Autonomous Coding Agent in 45 Minutes (Full Stack)',
    },
    {
      id: 'gap-2',
      topic: 'Next.js 15 Server Actions Deep Dive & Security',
      competitor: 'ByteCode Academy',
      views: '450k views in 14 days',
      opportunityScore: 'High',
      suggestedTitle: 'Why Next.js Server Actions Are Vulnerable (And How to Fix It)',
    },
    {
      id: 'gap-3',
      topic: 'How Solo Developers Price B2B Micro-SaaS',
      competitor: 'SaaS Builder Club',
      views: '290k views in 21 days',
      opportunityScore: 'High',
      suggestedTitle: 'The SaaS Pricing Formula That Quadrupled My MRR',
    },
  ];

  const handleAddGapToVault = (gap: typeof contentGaps[0]) => {
    addIdea({
      title: gap.suggestedTitle,
      category: 'Competitive Gap',
      targetKeywords: [gap.topic.toLowerCase()],
      predictedPotential: 'Very High',
      status: 'idea',
      notes: `Inspired by competitor ${gap.competitor} (${gap.views}).`,
      tags: ['CompetitorGap', 'Trending'],
    });
    setAddedGaps((prev) => ({ ...prev, [gap.id]: true }));
    showToast('Gap Added to Vault', `"${gap.suggestedTitle.slice(0, 30)}..." saved to Idea Vault`, 'success');
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-1 border-b border-slate-200/80 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Comparison & Benchmarks
              </h1>
              <span className="font-mono text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] px-2 py-0.5 rounded">
                Matrix Lab
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Analyze head-to-head retention drop-offs between your videos or benchmark velocity against competitors.
            </p>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="inline-flex rounded-lg bg-slate-100 dark:bg-[#090a0f] p-0.5 border border-slate-200 dark:border-white/[0.06]">
            <button
              onClick={() => setActiveTab('video-vs-video')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === 'video-vs-video'
                  ? 'bg-white dark:bg-white/[0.1] text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GitCompare className="h-3.5 w-3.5 text-[#ff0033]" /> Video vs Video
            </button>
            <button
              onClick={() => setActiveTab('channel-benchmark')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === 'channel-benchmark'
                  ? 'bg-white dark:bg-white/[0.1] text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" /> Channel Benchmarks
            </button>
          </div>
        </div>

        {activeTab === 'video-vs-video' ? (
          <VideoComparisonMatrix />
        ) : (
          <div className="space-y-6">
            {/* Competitor Cards Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/* Your Channel Card */}
              <div className="pro-card p-4 relative border-slate-300 dark:border-white/[0.16]">
                <span className="absolute -top-2 right-3 rounded font-mono bg-[#ff0033] px-1.5 py-0.2 text-[9px] font-bold text-white">
                  ACTIVE
                </span>
                <div className="flex items-center gap-3">
                  <img src={selectedChannel.avatar} alt="" className="h-9 w-9 rounded-md object-cover ring-1 ring-slate-200 dark:ring-white/10" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {selectedChannel.name}
                    </h4>
                    <p className="font-mono text-[10px] text-slate-400">{selectedChannel.handle}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-white/[0.06] pt-2 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Subscribers</span>
                    <p className="font-semibold text-slate-900 dark:text-white">{formatNumber(selectedChannel.subscribers)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Growth</span>
                    <p className="font-semibold text-emerald-500">+5.6%</p>
                  </div>
                </div>
              </div>

              {/* Competitor Cards */}
              {DEMO_COMPETITORS.map((comp) => (
                <div
                  key={comp.id}
                  className="pro-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={comp.avatar} alt="" className="h-9 w-9 rounded-md object-cover ring-1 ring-slate-200 dark:ring-white/10" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {comp.name}
                      </h4>
                      <p className="font-mono text-[10px] text-slate-400">{comp.handle}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-white/[0.06] pt-2 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Subscribers</span>
                      <p className="font-semibold text-slate-900 dark:text-white">{formatNumber(comp.subscribers)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Growth</span>
                      <p className="font-semibold text-emerald-500">+{comp.subGrowthRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparative Chart */}
            <div className="pro-card p-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/[0.06]">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Scale & Engagement Benchmark
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Comparing total audience and average views generated per upload.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <ChartWrapper heightClass="h-72 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" opacity={0.05} vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} stroke="#222" tickLine={false} />
                      <YAxis tickFormatter={(v) => formatNumber(v)} tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }} stroke="#222" tickLine={false} />
                      <Tooltip formatter={(value: any, name: any) => [formatNumber(Number(value)), name]} />
                      <Legend />
                      <Bar dataKey="subscribers" name="Subscribers" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="avgViews" name="Avg Views / Video" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartWrapper>
              </div>
            </div>

            {/* Content Gap Analysis */}
            <div className="pro-card p-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-white/[0.06]">
                <Sparkles className="h-4 w-4 text-[#ff0033]" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Algorithmic Content Gap Opportunities
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                Topics driving breakout traffic for competitors that your channel has not yet capitalized on.
              </p>

              <div className="space-y-3">
                {contentGaps.map((gap) => (
                  <div
                    key={gap.id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3.5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-xs">
                          {gap.topic}
                        </span>
                        <Badge variant="outline" size="sm">
                          {gap.opportunityScore}
                        </Badge>
                      </div>
                      <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        Validated by <strong className="text-slate-700 dark:text-slate-300 font-sans">{gap.competitor}</strong> ({gap.views})
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Suggested angle: &quot;{gap.suggestedTitle}&quot;
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant={addedGaps[gap.id] ? 'secondary' : 'primary'}
                      onClick={() => handleAddGapToVault(gap)}
                      disabled={addedGaps[gap.id]}
                    >
                      {addedGaps[gap.id] ? (
                        <>
                          <Check className="h-3 w-3 mr-1" /> Added to Vault
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3 mr-1" /> Add to Vault
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
