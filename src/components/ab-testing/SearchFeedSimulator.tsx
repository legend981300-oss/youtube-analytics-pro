'use client';

import React, { useState } from 'react';
import {
  Search,
  Eye,
  Flame,
  Sparkles,
  Trophy,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Play,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useApp } from '@/context/AppContext';

interface SearchFeedSimulatorProps {
  variantA: { title: string; thumbnailUrl: string };
  variantB: { title: string; thumbnailUrl: string };
}

interface SimulatedFeedResult {
  id: string;
  isUserVariant?: 'A' | 'B';
  title: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  timeAgo: string;
  thumbnailUrl: string;
  duration: string;
  badge?: string;
  focalScore?: number;
}

export const SearchFeedSimulator: React.FC<SearchFeedSimulatorProps> = ({ variantA, variantB }) => {
  const { selectedChannel } = useApp();
  const [searchQuery, setSearchQuery] = useState('Next.js 15 Full Course SaaS Tutorial');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [feedMode, setFeedMode] = useState<'both' | 'variantA' | 'variantB'>('both');

  // Competitor baseline results
  const competitorVideos: SimulatedFeedResult[] = [
    {
      id: 'comp-1',
      title: 'Full Stack Web Development with Next.js & TypeScript in 10 Hours',
      channelName: 'freeCodeCamp.org',
      channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      views: '1.4M views',
      timeAgo: '4 months ago',
      thumbnailUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop&q=80',
      duration: '10:42:15',
      focalScore: 78,
    },
    {
      id: 'comp-2',
      title: 'React 19 & Next 15 in 100 Seconds',
      channelName: 'Fireship',
      channelAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      views: '890K views',
      timeAgo: '2 weeks ago',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      duration: '2:14',
      focalScore: 84,
    },
    {
      id: 'comp-3',
      title: 'Building a Micro-SaaS from Scratch That Makes $5k/mo',
      channelName: 'SaaS Builder Lab',
      channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      views: '340K views',
      timeAgo: '1 month ago',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      duration: '24:18',
      focalScore: 72,
    },
  ];

  // Calculate focal scores for Variant A vs B
  const scoreA = Math.min(
    95,
    Math.max(65, 75 + (variantA.title.length > 35 && variantA.title.length < 65 ? 12 : 2))
  );
  const scoreB = Math.min(
    98,
    Math.max(68, 78 + (variantB.title.toLowerCase().includes('stop') || variantB.title.toLowerCase().includes('wrong') ? 14 : 4))
  );

  const standoutWinner = scoreB >= scoreA ? 'B' : 'A';
  const standoutDifference = Math.abs(scoreB - scoreA);

  // Combine into full simulated YouTube Search feed
  const feedItems: SimulatedFeedResult[] = [];

  if (feedMode === 'both' || feedMode === 'variantA') {
    feedItems.push({
      id: 'user-variant-a',
      isUserVariant: 'A',
      title: variantA.title,
      channelName: selectedChannel.name,
      channelAvatar: selectedChannel.avatar,
      views: 'Simulated 125K views',
      timeAgo: 'Just now',
      thumbnailUrl: variantA.thumbnailUrl,
      duration: '18:42',
      badge: 'TEST VARIANT A',
      focalScore: scoreA,
    });
  }

  feedItems.push(competitorVideos[0]);

  if (feedMode === 'both' || feedMode === 'variantB') {
    feedItems.push({
      id: 'user-variant-b',
      isUserVariant: 'B',
      title: variantB.title,
      channelName: selectedChannel.name,
      channelAvatar: selectedChannel.avatar,
      views: 'Simulated 195K views',
      timeAgo: 'Just now',
      thumbnailUrl: variantB.thumbnailUrl,
      duration: '18:42',
      badge: 'TEST VARIANT B',
      focalScore: scoreB,
    });
  }

  feedItems.push(competitorVideos[1], competitorVideos[2]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-xl overflow-hidden">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 p-4 sm:p-5 bg-slate-50/50 dark:bg-navy-950/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Live YouTube Search Feed Simulator
            </h3>
            <Badge variant="purple" size="sm">
              Visual Standout Lab
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Preview how your thumbnails look when competing for attention against top-ranking videos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Heatmap Toggle Button */}
          <Button
            size="sm"
            variant={showHeatmap ? 'glow' : 'outline'}
            onClick={() => setShowHeatmap(!showHeatmap)}
            className="flex items-center gap-1.5"
          >
            <Eye className="h-3.5 w-3.5" />
            {showHeatmap ? 'Hide Focal Heatmap' : 'Show Eye-Tracking Heatmap'}
          </Button>

          {/* Mode Selector */}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-800 p-0.5 text-xs">
            <button
              onClick={() => setFeedMode('both')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                feedMode === 'both' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Both A & B
            </button>
            <button
              onClick={() => setFeedMode('variantA')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                feedMode === 'variantA' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Variant A Only
            </button>
            <button
              onClick={() => setFeedMode('variantB')}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                feedMode === 'variantB' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Variant B Only
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Bar Mockup */}
      <div className="border-b border-slate-200 dark:border-slate-800 px-4 py-3 bg-white dark:bg-navy-900">
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-navy-950 px-4 py-2 pl-10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            placeholder="Type a simulated YouTube search query..."
          />
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Standout Rating Callout */}
      <div className="mx-4 my-4 rounded-xl border border-brand-500/30 bg-gradient-to-r from-brand-500/10 via-indigo-500/5 to-transparent p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white shadow-glow-brand">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">
              Visual Dominance Rating: Variant {standoutWinner} Wins (+{standoutDifference}% More First-Glance Attention)
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              Variant {standoutWinner} has stronger contrasting foreground separation and curiosity-inducing keywords
              that break through YouTube feed banner blindness.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={standoutWinner === 'A' ? 'success' : 'purple'} size="md">
            Variant A: {scoreA}/100
          </Badge>
          <Badge variant={standoutWinner === 'B' ? 'success' : 'purple'} size="md">
            Variant B: {scoreB}/100
          </Badge>
        </div>
      </div>

      {/* Simulated Search Results Feed */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/80 p-4 space-y-4 max-h-[600px] overflow-y-auto">
        {feedItems.map((item) => {
          const isUser = !!item.isUserVariant;

          return (
            <div
              key={item.id}
              className={`pt-4 first:pt-0 flex flex-col sm:flex-row gap-3.5 group rounded-xl p-3 transition-colors ${
                isUser
                  ? item.isUserVariant === 'B'
                    ? 'bg-purple-500/5 ring-1 ring-purple-500/20'
                    : 'bg-brand-500/5 ring-1 ring-brand-500/20'
                  : 'hover:bg-slate-50 dark:hover:bg-navy-800/40'
              }`}
            >
              {/* Thumbnail with duration pill & optional Heatmap */}
              <div className="relative aspect-video w-full sm:w-64 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/50 shadow-md">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Duration badge */}
                <span className="absolute bottom-1.5 right-1.5 rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-bold text-white tracking-wide">
                  {item.duration}
                </span>

                {/* User Variant Badge */}
                {item.badge && (
                  <span
                    className={`absolute top-2 left-2 rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-md ${
                      item.isUserVariant === 'B' ? 'bg-purple-600' : 'bg-brand-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Eye-Tracking Heatmap Overlay */}
                {showHeatmap && (
                  <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-center animate-fade-in">
                    <div
                      className={`h-16 w-16 rounded-full flex items-center justify-center font-black text-white text-base shadow-xl border-2 ${
                        (item.focalScore || 70) >= 85
                          ? 'bg-emerald-500/80 border-emerald-300 shadow-emerald-500/50'
                          : (item.focalScore || 70) >= 75
                          ? 'bg-brand-500/80 border-brand-300 shadow-brand-500/50'
                          : 'bg-amber-500/80 border-amber-300 shadow-amber-500/50'
                      }`}
                    >
                      {item.focalScore || 72}%
                    </div>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white drop-shadow">
                      {(item.focalScore || 70) >= 85 ? 'High Glance Capture' : 'Moderate Notice'}
                    </span>
                  </div>
                )}
              </div>

              {/* Video Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand-500 transition-colors">
                    {item.title}
                  </h4>
                </div>

                <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.views}</span>
                  <span>•</span>
                  <span>{item.timeAgo}</span>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <img
                    src={item.channelAvatar}
                    alt={item.channelName}
                    className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                  />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-white">
                    {item.channelName}
                  </span>
                  <span className="rounded-full bg-slate-200 dark:bg-navy-800 p-0.5 text-slate-500">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  In this simulated search video breakdown, we analyze real retention curves, code architecture, and
                  production workflows.
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
