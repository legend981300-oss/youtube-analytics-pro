'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Command,
  LayoutDashboard,
  Film,
  Sparkles,
  Layers,
  FileText,
  ShieldCheck,
  DollarSign,
  Users,
  MessageSquare,
  GitCompare,
  TrendingUp,
  SearchCode,
  Smartphone,
  FolderGit2,
  Target,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Download,
  Share2,
  X,
  ArrowRight,
  PlusCircle,
  BarChart3,
  Calendar,
  Globe,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DEMO_VIDEOS } from '@/lib/demo-data';
import { exportToCSV } from '@/lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMilestoneCard?: () => void;
  onOpenChannelExplorer?: () => void;
  onOpenAiCopilot?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenMilestoneCard,
  onOpenChannelExplorer,
  onOpenAiCopilot,
}) => {
  const router = useRouter();
  const { theme, toggleTheme, showToast, selectedChannel } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Command items definitions
  const quickActions = [
    {
      id: 'ask-ai',
      title: 'Ask Channel AI Copilot',
      subtitle: 'Ask questions about your performance & video strategy',
      icon: Sparkles,
      badge: 'AI',
      action: () => {
        onClose();
        if (onOpenAiCopilot) onOpenAiCopilot();
      },
    },
    {
      id: 'explore-channel',
      title: 'Explore Any YouTube Channel',
      subtitle: 'Paste any @handle (e.g. @MrBeast, @mkbhd) for instant audit',
      icon: SearchCode,
      badge: 'NEW',
      action: () => {
        onClose();
        if (onOpenChannelExplorer) onOpenChannelExplorer();
        else router.push('/channels');
      },
    },
    {
      id: 'milestone-card',
      title: 'Generate Milestone Celebration Card',
      subtitle: 'Export branded 100k views or subscriber graphic for social media',
      icon: Share2,
      badge: 'PRO',
      action: () => {
        onClose();
        if (onOpenMilestoneCard) onOpenMilestoneCard();
      },
    },
    {
      id: 'toggle-theme',
      title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Luxury Dark Mode',
      subtitle: 'Toggle global color appearance',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme();
        showToast('Theme Changed', `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`, 'info');
        onClose();
      },
    },
    {
      id: 'export-csv',
      title: 'Export Channel Analytics CSV',
      subtitle: 'Download complete 90-day raw time-series metrics',
      icon: Download,
      action: () => {
        exportToCSV(
          `youtube_analytics_${selectedChannel.handle}_export`,
          DEMO_VIDEOS.map((v) => ({
            id: v.id,
            title: v.title,
            views: v.views,
            ctr: `${v.ctr}%`,
            retention: `${v.avgViewPercentage}%`,
            revenue: `$${v.estimatedRevenue}`,
            publishedAt: v.publishedAt,
          }))
        );
        showToast('Export Complete', 'Downloaded channel performance data', 'success');
        onClose();
      },
    },
  ];

  const navigationPages = [
    { title: 'Overview & Main Dashboard', path: '/', icon: LayoutDashboard, category: 'Analytics' },
    { title: 'Video Performance & Retention', path: '/videos', icon: Film, category: 'Analytics' },
    { title: 'AI Video Studio & Generator', path: '/ai-studio', icon: Sparkles, category: 'Tools', badge: 'AI' },
    { title: 'A/B Testing Simulator Lab', path: '/ab-testing', icon: Layers, category: 'Tools', badge: 'PRO' },
    { title: 'Creator Sponsor Media Kit', path: '/media-kit', icon: FileText, category: 'Business', badge: 'NEW' },
    { title: 'Channel Health Remediation Audit', path: '/audit', icon: ShieldCheck, category: 'Tools' },
    { title: 'Head-to-Head Video & Channel Comparison', path: '/comparison', icon: GitCompare, category: 'Analytics' },
    { title: 'Revenue & AdSense Monetization', path: '/revenue', icon: DollarSign, category: 'Financials' },
    { title: 'Audience Demographics & Retention', path: '/audience', icon: Users, category: 'Analytics' },
    { title: 'Comments & Sentiment Analysis', path: '/comments', icon: MessageSquare, category: 'Community' },
    { title: 'Keyword Research & SEO Scores', path: '/seo', icon: SearchCode, category: 'Growth' },
    { title: 'Shorts Velocity & Retention', path: '/shorts', icon: Smartphone, category: 'Growth' },
    { title: 'Idea Vault & Content Pipeline', path: '/vault', icon: FolderGit2, category: 'Planning' },
    { title: 'Channel Milestones & Goals', path: '/goals', icon: Target, category: 'Planning' },
    { title: 'Predictive Growth Forecasts', path: '/predictions', icon: TrendingUp, category: 'Growth' },
    { title: 'Content Production Calendar', path: '/calendar', icon: Calendar, category: 'Planning' },
    { title: 'Public Product Landing Page', path: '/landing', icon: Globe, category: 'Marketing' },
    { title: 'Export & Scheduled Reports', path: '/reports', icon: BarChart3, category: 'Business' },
    { title: 'Channel Settings & API Keys', path: '/settings', icon: Settings, category: 'System' },
  ];

  // Filter items based on query
  const q = query.toLowerCase().trim();

  const filteredQuickActions = quickActions.filter(
    (a) => !q || a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
  );

  const filteredPages = navigationPages.filter(
    (p) => !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );

  const filteredVideos = q
    ? DEMO_VIDEOS.filter(
        (v) => v.title.toLowerCase().includes(q) || v.tags.some((t) => t.toLowerCase().includes(q))
      ).slice(0, 4)
    : [];

  // Flatten all navigable items for arrow key traversal
  const allItems = [
    ...filteredQuickActions.map((item) => ({ type: 'action', item })),
    ...filteredPages.map((item) => ({ type: 'page', item })),
    ...filteredVideos.map((item) => ({ type: 'video', item })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (allItems.length || 1)) % (allItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = allItems[selectedIndex];
      if (current) {
        if (current.type === 'action') {
          (current.item as any).action();
        } else if (current.type === 'page') {
          router.push((current.item as any).path);
          onClose();
        } else if (current.type === 'video') {
          router.push('/videos');
          onClose();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#11131a] shadow-2xl animate-scale-in">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-slate-100 dark:border-white/[0.06] px-4 py-3">
          <Search className="h-4 w-4 text-[#ff0033] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or jump to page... (Esc to close)"
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center rounded bg-slate-100 dark:bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/[0.06]">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4 scrollbar-thin">
          {/* Quick Actions */}
          {filteredQuickActions.length > 0 && (
            <div>
              <div className="px-3 py-1 font-mono text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500">
                Actions
              </div>
              <div className="mt-1 space-y-0.5">
                {filteredQuickActions.map((action, idx) => {
                  const globalIdx = idx;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => action.action()}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-slate-100 text-slate-900 dark:bg-white/[0.08] dark:text-white'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${
                            isSelected
                              ? 'bg-[#ff0033] text-white'
                              : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="font-medium">{action.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {action.subtitle}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {action.badge && (
                          <span className="rounded font-mono bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.06] px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:text-slate-400">
                            {action.badge}
                          </span>
                        )}
                        <ArrowRight className="h-3 w-3 opacity-40" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Pages */}
          {filteredPages.length > 0 && (
            <div>
              <div className="px-3 py-1 font-mono text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500">
                Pages ({filteredPages.length})
              </div>
              <div className="mt-1 space-y-0.5">
                {filteredPages.map((page, idx) => {
                  const globalIdx = filteredQuickActions.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.path}
                      onClick={() => {
                        router.push(page.path);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-slate-100 text-slate-900 dark:bg-white/[0.08] dark:text-white'
                          : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium">{page.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {page.badge && (
                          <span className="rounded font-mono bg-slate-100 dark:bg-white/[0.06] px-1.5 py-0.2 text-[9px] font-medium text-slate-500 dark:text-slate-400">
                            {page.badge}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">{page.category}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Videos Matching Search */}
          {filteredVideos.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Matching Videos
              </div>
              <div className="mt-1 space-y-1">
                {filteredVideos.map((video, idx) => {
                  const globalIdx = filteredQuickActions.length + filteredPages.length + idx;
                  const isSelected = selectedIndex === globalIdx;
                  return (
                    <button
                      key={video.id}
                      onClick={() => {
                        router.push('/videos');
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                        isSelected
                          ? 'bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300 ring-1 ring-brand-500/30'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Film className="h-4 w-4 text-brand-500 shrink-0" />
                        <span className="truncate font-medium">{video.title}</span>
                      </div>
                      <span className="shrink-0 text-xs text-slate-400">{video.views.toLocaleString()} views</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {allItems.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">
              No results found for &ldquo;<span className="text-slate-200">{query}</span>&rdquo;
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-navy-950/60 px-4 py-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded bg-slate-200 dark:bg-navy-800 px-1.5 py-0.5">↑↓</kbd> to navigate
            </span>
            <span>
              <kbd className="rounded bg-slate-200 dark:bg-navy-800 px-1.5 py-0.5">Enter</kbd> to select
            </span>
          </div>
          <span>YouTube Analytics Pro Command Hub</span>
        </div>
      </div>
    </div>
  );
};
