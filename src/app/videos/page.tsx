'use client';

import React, { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Film,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Sparkles,
  Copy,
  Plus,
  Flame,
  Zap,
} from 'lucide-react';
import { DEMO_VIDEOS } from '@/lib/demo-data';
import { VideoItem } from '@/types';
import { formatNumber, formatCurrency, formatDate, exportToCSV } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';
import { useApp } from '@/context/AppContext';
import { OneOfTenRankCard } from '@/components/videos/OneOfTenRankCard';
import { calculateOutlierMetrics, calculateOneOfTenRank } from '@/lib/analytics-engine';
import Link from 'next/link';

type SortField = 'publishedAt' | 'views' | 'ctr' | 'avgViewPercentage' | 'watchTimeHours' | 'estimatedRevenue';
type FilterType = 'all' | 'outliers' | 'high_ctr' | 'high_retention' | 'top_earners';

export default function VideosPage() {
  const { addIdea, showToast, searchQuery, channelVideos, selectedChannel } = useApp();
  const [search, setSearch] = useState(searchQuery || '');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('views');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // Synchronize with global navbar search if active
  React.useEffect(() => {
    if (searchQuery) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  // Outlier & 1 of 10 Computations (Dynamically adapts per selected channel)
  const outlierMap = useMemo(() => calculateOutlierMetrics(channelVideos), [channelVideos]);
  const oneOfTenAudit = useMemo(() => calculateOneOfTenRank(channelVideos), [channelVideos]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter & Sort Pipeline
  const filteredAndSortedVideos = useMemo(() => {
    let result = channelVideos.filter((v) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      const outlier = outlierMap.get(v.id);
      if (filterType === 'outliers') return outlier && outlier.tier !== 'normal';
      if (filterType === 'high_ctr') return v.ctr >= 9.0;
      if (filterType === 'high_retention') return v.avgViewPercentage >= 50.0;
      if (filterType === 'top_earners') return v.estimatedRevenue >= 400;
      return true;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'publishedAt') {
        comparison = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      } else {
        comparison = (a[sortField] as number) - (b[sortField] as number);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [channelVideos, search, filterType, sortField, sortOrder, outlierMap]);

  // Filter counts
  const counts = useMemo(() => {
    return {
      all: channelVideos.length,
      outliers: channelVideos.filter((v) => {
        const o = outlierMap.get(v.id);
        return o && o.tier !== 'normal';
      }).length,
      high_ctr: channelVideos.filter((v) => v.ctr >= 9.0).length,
      high_retention: channelVideos.filter((v) => v.avgViewPercentage >= 50.0).length,
      top_earners: channelVideos.filter((v) => v.estimatedRevenue >= 400).length,
    };
  }, [channelVideos, outlierMap]);

  const handleSaveToVault = (video: VideoItem) => {
    addIdea({
      title: `Follow-up to: ${video.title}`,
      category: 'Video Follow-up',
      targetKeywords: video.tags,
      predictedPotential: video.ctr >= 9.0 ? 'Very High' : 'High',
      status: 'idea',
      notes: `Original video had ${formatNumber(video.views)} views with ${video.ctr}% CTR and ${video.avgViewPercentage}% retention.`,
      tags: video.tags,
    });
    showToast('Saved to Idea Vault', `Concept based on "${video.title.slice(0, 30)}..." added`, 'success');
  };

  const handleCopyTitle = (title: string) => {
    navigator.clipboard.writeText(title);
    showToast('Copied to Clipboard', title, 'info');
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3 w-3 opacity-30 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-[#ff0033]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#ff0033]" />
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-1 border-b border-slate-200/80 dark:border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                Video Performance & Velocity
              </h1>
              <span className="font-mono text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] px-2 py-0.5 rounded uppercase">
                {channelVideos.length} Assets • {selectedChannel.name}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Individual video statistics, viewer retention autopsy, and algorithmic outlier velocity scores.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              exportToCSV('video-performance-catalog', filteredAndSortedVideos);
              showToast('Export Started', 'Exporting video performance catalog to CSV', 'info');
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
          </Button>
        </div>

        {/* 1 of 10 Upload Performance Widget */}
        <OneOfTenRankCard audit={oneOfTenAudit} onSelectVideo={(v) => setActiveVideo(v)} />

        {/* Filter & Search Bar */}
        <div className="pro-card p-2.5 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, topic, or keyword (#react, #saas)..."
              className="w-full rounded-md border border-zinc-200/60 bg-zinc-50/50 py-1.5 pl-8 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:outline-none dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-zinc-100 dark:placeholder:text-zinc-500 transition-colors"
            />
          </div>

          <div className="inline-flex rounded-md bg-zinc-100/70 dark:bg-white/[0.03] p-0.5 border border-zinc-200/50 dark:border-white/[0.05] overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'all', label: 'All Videos', count: counts.all },
                { id: 'outliers', label: 'Outliers', count: counts.outliers },
                { id: 'high_ctr', label: 'High CTR (>9%)', count: counts.high_ctr },
                { id: 'high_retention', label: 'Retention (>50%)', count: counts.high_retention },
                { id: 'top_earners', label: 'Top Rev ($400+)', count: counts.top_earners },
              ] as const
            ).map((tab) => {
              const active = filterType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as FilterType)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    active
                      ? 'bg-white dark:bg-white/[0.08] text-zinc-900 dark:text-white shadow-none font-medium'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="font-mono text-[10px] text-zinc-400">({tab.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Catalog Card */}
        <div className="pro-card p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-[#ff0033]" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Catalog ({filteredAndSortedVideos.length} Videos)
              </h3>
            </div>
            <span className="font-mono text-xs text-slate-400">
              Sort: <strong className="text-slate-700 dark:text-slate-300 capitalize">{sortField}</strong> ({sortOrder})
            </span>
          </div>

          {filteredAndSortedVideos.length === 0 ? (
            <div className="py-16 text-center">
              <Film className="mx-auto h-8 w-8 text-slate-400/50" />
              <h4 className="mt-3 text-xs font-semibold text-slate-900 dark:text-white">No matching videos</h4>
              <p className="mt-1 text-[11px] text-slate-500">
                Try adjusting your search query or reset the filter selection.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setSearch('');
                  setFilterType('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/[0.06] text-slate-400 font-mono text-[10px] uppercase tracking-wider select-none bg-slate-50/50 dark:bg-white/[0.01]">
                      <th className="py-3 px-3 min-w-[280px]">Video Title</th>
                      <th className="py-3 px-3">Velocity Outlier</th>
                      <th
                        className="py-3 px-3 cursor-pointer group"
                        onClick={() => handleSort('publishedAt')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Published</span>
                          {renderSortIndicator('publishedAt')}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 cursor-pointer group"
                        onClick={() => handleSort('views')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Views</span>
                          {renderSortIndicator('views')}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 cursor-pointer group"
                        onClick={() => handleSort('ctr')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>CTR</span>
                          {renderSortIndicator('ctr')}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 cursor-pointer group"
                        onClick={() => handleSort('avgViewPercentage')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Retention</span>
                          {renderSortIndicator('avgViewPercentage')}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 cursor-pointer group"
                        onClick={() => handleSort('watchTimeHours')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Watch Time</span>
                          {renderSortIndicator('watchTimeHours')}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 cursor-pointer group"
                        onClick={() => handleSort('estimatedRevenue')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Revenue</span>
                          {renderSortIndicator('estimatedRevenue')}
                        </div>
                      </th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                    {filteredAndSortedVideos.map((vid) => {
                      const outlier = outlierMap.get(vid.id);
                      return (
                        <tr
                          key={vid.id}
                          className="hover:bg-slate-50 dark:hover:bg-white/[0.025] transition-colors group"
                        >
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-3">
                              <div className="relative w-28 h-16 shrink-0 aspect-video overflow-hidden rounded-md border border-slate-200 dark:border-white/[0.08]">
                                <ThumbnailImage
                                  src={vid.thumbnail}
                                  alt={vid.title}
                                  duration={vid.duration}
                                  title={vid.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 max-w-sm">
                                <p
                                  className="font-medium text-slate-900 dark:text-slate-100 line-clamp-1 hover:text-[#ff0033] cursor-pointer transition-colors"
                                  onClick={() => setActiveVideo(vid)}
                                >
                                  {vid.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5 font-mono text-[10px] text-slate-400">
                                  <span>{formatNumber(vid.likes)} likes</span>
                                  <span>•</span>
                                  <span>{vid.comments} comments</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            {outlier && outlier.tier !== 'normal' ? (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${outlier.badgeColor}`}
                              >
                                {outlier.tier === '10x' && <Zap className="h-3 w-3 fill-amber-400 text-amber-400" />}
                                {outlier.tier === '5x' && <Flame className="h-3 w-3 text-rose-400" />}
                                {outlier.label}
                              </span>
                            ) : (
                              <span className="font-mono text-[10px] text-slate-500">Normal</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                            {formatDate(vid.publishedAt)}
                          </td>
                          <td className="py-3.5 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                            {formatNumber(vid.views)}
                          </td>
                          <td className="py-3.5 px-3 font-mono font-semibold text-emerald-500">
                            {vid.ctr}%
                          </td>
                          <td className="py-3.5 px-3 font-mono">
                            <Badge
                              variant={vid.avgViewPercentage >= 50 ? 'success' : 'default'}
                              size="sm"
                            >
                              {vid.avgViewPercentage}%
                            </Badge>
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300">
                            {formatNumber(vid.watchTimeHours)} hrs
                          </td>
                          <td className="py-3.5 px-3 font-mono font-semibold text-purple-400">
                            {formatCurrency(vid.estimatedRevenue)}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setActiveVideo(vid)}
                            >
                              Inspect
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Grid View */}
              <div className="block md:hidden space-y-3 mt-2">
                {filteredAndSortedVideos.map((vid) => {
                  const outlier = outlierMap.get(vid.id);
                  return (
                    <div
                      key={vid.id}
                      className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] p-3 space-y-2.5"
                    >
                      <div className="flex gap-3">
                        <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md border border-slate-200 dark:border-white/[0.08]">
                          <ThumbnailImage
                            src={vid.thumbnail}
                            alt={vid.title}
                            duration={vid.duration}
                            title={vid.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4
                            onClick={() => setActiveVideo(vid)}
                            className="text-xs font-medium text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-[#ff0033]"
                          >
                            {vid.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[10px] text-slate-400">
                              {formatDate(vid.publishedAt)}
                            </span>
                            {outlier && outlier.tier !== 'normal' && (
                              <span
                                className={`px-1 rounded font-mono text-[9px] font-semibold border ${outlier.badgeColor}`}
                              >
                                {outlier.multiplier}x Outlier
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-slate-200/60 dark:border-white/[0.06] font-mono text-[10px]">
                        <div>
                          <span className="text-slate-400 block text-[9px]">Views</span>
                          <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                            {formatNumber(vid.views)}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">CTR</span>
                          <strong className="text-emerald-500 font-semibold">{vid.ctr}%</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">Ret</span>
                          <strong className="text-purple-400 font-semibold">
                            {vid.avgViewPercentage}%
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">Rev</span>
                          <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                            {formatCurrency(vid.estimatedRevenue)}
                          </strong>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => setActiveVideo(vid)}
                        >
                          Inspect Analytics
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Video Detail Modal */}
        <Modal
          isOpen={Boolean(activeVideo)}
          onClose={() => setActiveVideo(null)}
          title={activeVideo?.title || 'Video Performance Inspection'}
          description={`Published: ${activeVideo ? formatDate(activeVideo.publishedAt) : ''}`}
          size="lg"
        >
          {activeVideo && (
            <div className="space-y-4 text-xs">
              <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 dark:border-white/[0.08]">
                <ThumbnailImage
                  src={activeVideo.thumbnail}
                  alt={activeVideo.title}
                  duration={activeVideo.duration}
                  title={activeVideo.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 4x2 Metric Grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 font-mono">
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Views</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideo.views)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">CTR</span>
                  <p className="text-sm font-semibold text-emerald-500 mt-0.5">
                    {activeVideo.ctr}%
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Retention</span>
                  <p className="text-sm font-semibold text-purple-400 mt-0.5">
                    {activeVideo.avgViewPercentage}%
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Watch Time</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideo.watchTimeHours)} hrs
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Est. Earnings</span>
                  <p className="text-sm font-semibold text-emerald-500 mt-0.5">
                    {formatCurrency(activeVideo.estimatedRevenue)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Est. RPM</span>
                  <p className="text-sm font-semibold text-purple-400 mt-0.5">
                    ${((activeVideo.estimatedRevenue / (activeVideo.views || 1)) * 1000).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Likes</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideo.likes)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-2.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">Comments</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideo.comments)}
                  </p>
                </div>
              </div>

              {/* Heuristic Diagnostic Analysis */}
              <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#ff0033]" />
                  <p className="font-medium text-slate-900 dark:text-white">
                    Algorithmic Health Diagnostic
                  </p>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  {activeVideo.ctr >= 9.0
                    ? `Outstanding Click-Through Rate (${activeVideo.ctr}%)! The thumbnail hook and title packaging are generating strong algorithmic velocity.`
                    : `Click-Through Rate is ${activeVideo.ctr}%. Testing higher-contrast facial expressions or punchier 35-50 character titles can lift CTR above 8.5%.`}
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  {activeVideo.avgViewPercentage >= 50
                    ? `Audience retention is strong at ${activeVideo.avgViewPercentage}%, indicating the intro delivery matched viewer expectations.`
                    : `Retention dipped to ${activeVideo.avgViewPercentage}%. Inspect your first 45 seconds to tighten pacing and minimize early drop-offs.`}
                </p>
              </div>

              {/* Tags */}
              <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] p-3">
                <span className="text-[11px] font-medium text-slate-800 dark:text-slate-200">
                  Targeted Keywords & Tags:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeVideo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyTitle(activeVideo.title)}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy Title
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveToVault(activeVideo)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Save to Vault
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setActiveVideo(null)}>
                    Close
                  </Button>
                  <Link href="/seo">
                    <Button size="sm">
                      Analyze in SEO Tool →
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
