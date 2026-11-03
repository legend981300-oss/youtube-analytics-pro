'use client';

import React, { useState, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import {
  Film,
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  Play,
  MessageSquare,
  ThumbsUp,
  Eye,
  Sparkles,
  Copy,
  Plus,
  Clock,
  DollarSign,
  TrendingUp,
  Check,
} from 'lucide-react';
import { DEMO_VIDEOS } from '@/lib/demo-data';
import { VideoItem } from '@/types';
import { formatNumber, formatCurrency, formatDate, exportToCSV } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ThumbnailImage } from '@/components/ui/ThumbnailImage';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

type SortField = 'publishedAt' | 'views' | 'ctr' | 'avgViewPercentage' | 'watchTimeHours' | 'estimatedRevenue';
type FilterType = 'all' | 'high_ctr' | 'high_retention' | 'top_earners';

export default function VideosPage() {
  const { addIdea, showToast, searchQuery, setSearchQuery } = useApp();
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
    let result = DEMO_VIDEOS.filter((v) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q));

      if (!matchesSearch) return false;
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
        comparison = a[sortField] - b[sortField];
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [search, filterType, sortField, sortOrder]);

  // Compute counts for filter pills
  const counts = useMemo(() => {
    return {
      all: DEMO_VIDEOS.length,
      high_ctr: DEMO_VIDEOS.filter((v) => v.ctr >= 9.0).length,
      high_retention: DEMO_VIDEOS.filter((v) => v.avgViewPercentage >= 50.0).length,
      top_earners: DEMO_VIDEOS.filter((v) => v.estimatedRevenue >= 400).length,
    };
  }, []);

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
      <ArrowUp className="h-3 w-3 text-brand-500" />
    ) : (
      <ArrowDown className="h-3 w-3 text-brand-500" />
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Video Performance Analytics
              </h1>
              <Badge variant="purple" size="sm">
                Simulated Catalog
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Deep dive into individual video statistics, viewer retention, and simulated revenue per asset.
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
            <Download className="h-3.5 w-3.5 mr-1" /> Export Video Data
          </Button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, topic, or tag (#react, #saas)..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white dark:placeholder:text-slate-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setFilterType('all')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-750 dark:text-slate-300 dark:hover:bg-navy-700'
              }`}
            >
              <span>All Videos</span>
              <span className="rounded-full bg-black/15 dark:bg-white/15 px-1.5 py-0.2 text-[10px]">
                {counts.all}
              </span>
            </button>
            <button
              onClick={() => setFilterType('high_ctr')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'high_ctr'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-750 dark:text-slate-300 dark:hover:bg-navy-700'
              }`}
            >
              <span>High CTR (&gt;9%)</span>
              <span className="rounded-full bg-black/15 dark:bg-white/15 px-1.5 py-0.2 text-[10px]">
                {counts.high_ctr}
              </span>
            </button>
            <button
              onClick={() => setFilterType('high_retention')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'high_retention'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-750 dark:text-slate-300 dark:hover:bg-navy-700'
              }`}
            >
              <span>High Retention (&gt;50%)</span>
              <span className="rounded-full bg-black/15 dark:bg-white/15 px-1.5 py-0.2 text-[10px]">
                {counts.high_retention}
              </span>
            </button>
            <button
              onClick={() => setFilterType('top_earners')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterType === 'top_earners'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-navy-750 dark:text-slate-300 dark:hover:bg-navy-700'
              }`}
            >
              <span>Top Revenue ($400+)</span>
              <span className="rounded-full bg-black/15 dark:bg-white/15 px-1.5 py-0.2 text-[10px]">
                {counts.top_earners}
              </span>
            </button>
          </div>
        </div>

        {/* Video Catalog Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-750">
            <div className="flex items-center gap-2">
              <Film className="h-4 w-4 text-brand-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Catalog ({filteredAndSortedVideos.length} Videos)
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Sorted by: <strong className="text-slate-700 dark:text-slate-300 capitalize">{sortField}</strong> ({sortOrder})
            </span>
          </div>

          {filteredAndSortedVideos.length === 0 ? (
            <div className="py-16 text-center">
              <Film className="mx-auto h-10 w-10 text-slate-400/60" />
              <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No videos found</h4>
              <p className="mt-1 text-xs text-slate-500">
                Try adjusting your search query or reset the filter selection.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
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
              {/* Desktop Table View (>= md) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-navy-750 text-slate-400 font-semibold uppercase select-none">
                      <th className="pb-3 min-w-[280px]">Video Title</th>
                      <th
                        className="pb-3 cursor-pointer group"
                        onClick={() => handleSort('publishedAt')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Published</span>
                          {renderSortIndicator('publishedAt')}
                        </div>
                      </th>
                      <th
                        className="pb-3 cursor-pointer group"
                        onClick={() => handleSort('views')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Views</span>
                          {renderSortIndicator('views')}
                        </div>
                      </th>
                      <th
                        className="pb-3 cursor-pointer group"
                        onClick={() => handleSort('ctr')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>CTR</span>
                          {renderSortIndicator('ctr')}
                        </div>
                      </th>
                      <th
                        className="pb-3 cursor-pointer group"
                        onClick={() => handleSort('avgViewPercentage')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Retention</span>
                          {renderSortIndicator('avgViewPercentage')}
                        </div>
                      </th>
                      <th
                        className="pb-3 cursor-pointer group"
                        onClick={() => handleSort('watchTimeHours')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Watch Time</span>
                          {renderSortIndicator('watchTimeHours')}
                        </div>
                      </th>
                      <th
                        className="pb-3 cursor-pointer group"
                        onClick={() => handleSort('estimatedRevenue')}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Est. Revenue</span>
                          {renderSortIndicator('estimatedRevenue')}
                        </div>
                      </th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-navy-750">
                    {filteredAndSortedVideos.map((vid) => (
                      <tr
                        key={vid.id}
                        className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition-colors group"
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg">
                              <ThumbnailImage
                                src={vid.thumbnail}
                                alt={vid.title}
                                duration={vid.duration}
                                title={vid.title}
                                className="h-full w-full"
                              />
                            </div>
                            <div className="min-w-0 max-w-sm">
                              <p
                                className="font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-brand-500 cursor-pointer transition-colors"
                                onClick={() => setActiveVideo(vid)}
                              >
                                {vid.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                                <span>{formatNumber(vid.likes)} likes</span>
                                <span>•</span>
                                <span>{vid.comments} comments</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-slate-500 whitespace-nowrap">
                          {formatDate(vid.publishedAt)}
                        </td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">
                          {formatNumber(vid.views)}
                        </td>
                        <td className="py-3 font-semibold text-emerald-500">
                          {vid.ctr}%
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={vid.avgViewPercentage >= 50 ? 'success' : 'default'}
                            size="sm"
                          >
                            {vid.avgViewPercentage}%
                          </Badge>
                        </td>
                        <td className="py-3 text-slate-600 dark:text-slate-300">
                          {formatNumber(vid.watchTimeHours)} hrs
                        </td>
                        <td className="py-3 font-bold text-purple-500">
                          {formatCurrency(vid.estimatedRevenue)}
                        </td>
                        <td className="py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveVideo(vid)}
                          >
                            Inspect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Grid View (< md) */}
              <div className="block md:hidden space-y-3 mt-2">
                {filteredAndSortedVideos.map((vid) => (
                  <div
                    key={vid.id}
                    className="rounded-xl border border-slate-200/80 dark:border-navy-750 bg-slate-50/50 dark:bg-navy-800/40 p-3 space-y-3"
                  >
                    <div className="flex gap-3">
                      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg">
                        <ThumbnailImage
                          src={vid.thumbnail}
                          alt={vid.title}
                          duration={vid.duration}
                          title={vid.title}
                          className="h-full w-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4
                          onClick={() => setActiveVideo(vid)}
                          className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-brand-500"
                        >
                          {vid.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {formatDate(vid.publishedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-slate-200/60 dark:border-navy-750/70 text-[10px]">
                      <div>
                        <span className="text-slate-400 block">Views</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">
                          {formatNumber(vid.views)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">CTR</span>
                        <strong className="text-emerald-500 font-bold">{vid.ctr}%</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Ret</span>
                        <strong className="text-purple-500 font-bold">
                          {vid.avgViewPercentage}%
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Rev</span>
                        <strong className="text-slate-800 dark:text-slate-200 font-bold">
                          {formatCurrency(vid.estimatedRevenue)}
                        </strong>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => setActiveVideo(vid)}
                      >
                        Inspect Analytics & Diagnostics
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Enhanced Video Detail Modal */}
        <Modal
          isOpen={Boolean(activeVideo)}
          onClose={() => setActiveVideo(null)}
          title={activeVideo?.title || 'Video Performance Inspection'}
          description={`Published: ${activeVideo ? formatDate(activeVideo.publishedAt) : ''}`}
          size="lg"
        >
          {activeVideo && (
            <div className="space-y-4 text-xs">
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <ThumbnailImage
                  src={activeVideo.thumbnail}
                  alt={activeVideo.title}
                  duration={activeVideo.duration}
                  title={activeVideo.title}
                  className="h-full w-full"
                />
              </div>

              {/* 4x2 Metric Grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Views</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideo.views)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Click-Through</span>
                  <p className="text-base font-bold text-emerald-500 mt-0.5">
                    {activeVideo.ctr}% CTR
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Retention</span>
                  <p className="text-base font-bold text-purple-500 mt-0.5">
                    {activeVideo.avgViewPercentage}%
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Watch Time</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideo.watchTimeHours)} hrs
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. Earnings</span>
                  <p className="text-base font-bold text-emerald-500 mt-0.5">
                    {formatCurrency(activeVideo.estimatedRevenue)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. RPM</span>
                  <p className="text-base font-bold text-purple-500 mt-0.5">
                    ${((activeVideo.estimatedRevenue / (activeVideo.views || 1)) * 1000).toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Likes</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideo.likes)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Comments</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {formatNumber(activeVideo.comments)}
                  </p>
                </div>
              </div>

              {/* Heuristic Diagnostic Analysis */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-navy-750 dark:bg-navy-800 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-500" />
                  <p className="font-bold text-slate-900 dark:text-white">
                    Simulated Heuristic Diagnostic
                  </p>
                  <span className="text-[10px] rounded bg-brand-500/10 px-1.5 py-0.5 text-brand-600 dark:text-brand-400 font-semibold">
                    Demo Analysis
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                  {activeVideo.ctr >= 9.0
                    ? `Outstanding Click-Through Rate (${activeVideo.ctr}%)! The thumbnail hook and title packaging are generating strong algorithmic velocity. Keep this packaging style for future uploads.`
                    : `Click-Through Rate is ${activeVideo.ctr}%. Consider testing higher-contrast facial expressions or punchier 35-50 character titles to lift CTR above 8.5%.`}
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  {activeVideo.avgViewPercentage >= 50
                    ? `Audience retention is strong at ${activeVideo.avgViewPercentage}%, indicating the intro delivery matched viewer expectations.`
                    : `Retention dipped to ${activeVideo.avgViewPercentage}%. Inspect your first 45 seconds to tighten pacing and minimize early drop-offs.`}
                </p>
              </div>

              {/* Tags */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-navy-750 dark:bg-navy-800">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  Targeted Keywords & Tags:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {activeVideo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:bg-navy-700 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-slate-100 dark:border-navy-750">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyTitle(activeVideo.title)}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy Title
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveToVault(activeVideo)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Save to Vault
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
