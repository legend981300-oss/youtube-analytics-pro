'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Download,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  Calendar,
  Sparkles,
  ExternalLink,
  X,
  Film,
  KeyRound,
  ArrowRight,
  Compass,
  SearchCode,
  Trophy,
  Share2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DateRange } from '@/types';
import { exportToCSV, formatNumber } from '@/lib/utils';
import { DEMO_DAILY_DATA, DEMO_VIDEOS, DEMO_KEYWORDS, getDataForRange } from '@/lib/demo-data';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onOpenCommandPalette?: () => void;
  onOpenChannelExplorer?: () => void;
  onOpenMilestoneCard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onOpenCommandPalette,
  onOpenChannelExplorer,
  onOpenMilestoneCard,
}) => {
  const {
    theme,
    toggleTheme,
    dateRange,
    setDateRange,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    currentUser,
    selectedChannel,
    searchQuery,
    setSearchQuery,
    showToast,
  } = useApp();

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Search matches
  const trimmedQuery = searchQuery.trim().toLowerCase();

  const matchingPages = useMemo(() => {
    if (!trimmedQuery) return [];
    const allPages = [
      { name: 'Dashboard Overview', href: '/', category: 'Analytics' },
      { name: 'Subscriber Growth', href: '/subscribers', category: 'Analytics' },
      { name: 'Views Analytics', href: '/views', category: 'Analytics' },
      { name: 'Watch Hours', href: '/watch-hours', category: 'Analytics' },
      { name: 'Estimated Revenue', href: '/revenue', category: 'Analytics' },
      { name: 'Video Performance', href: '/videos', category: 'Analytics' },
      { name: 'Shorts Analytics', href: '/shorts', category: 'Analytics' },
      { name: 'Audience Demographics', href: '/audience', category: 'Analytics' },
      { name: 'Comment Sentiment Analysis', href: '/comments', category: 'Analytics' },
      { name: 'Competitor Benchmark', href: '/comparison', category: 'SEO' },
      { name: 'SEO & Keyword Explorer', href: '/seo', category: 'SEO' },
      { name: 'Thumbnail Clickability Analyzer', href: '/thumbnails', category: 'SEO' },
      { name: 'Channel Health Audit', href: '/audit', category: 'SEO' },
      { name: 'Growth Predictions', href: '/predictions', category: 'Growth' },
      { name: 'Goal Tracker', href: '/goals', category: 'Growth' },
      { name: 'AI Creative Studio', href: '/ai-studio', category: 'AI Tools' },
      { name: 'Content Calendar', href: '/calendar', category: 'Content' },
      { name: 'Video Idea Vault', href: '/vault', category: 'Content' },
      { name: 'Multi-Channel Hub', href: '/channels', category: 'Admin' },
      { name: 'Weekly Executive Reports', href: '/reports', category: 'Admin' },
      { name: 'Pricing & Plans', href: '/pricing', category: 'Billing' },
      { name: 'Settings & Integrations', href: '/settings', category: 'Settings' },
      { name: 'Admin Command Center', href: '/admin', category: 'Admin' },
    ];
    return allPages
      .filter(
        (p) =>
          p.name.toLowerCase().includes(trimmedQuery) ||
          p.category.toLowerCase().includes(trimmedQuery)
      )
      .slice(0, 4);
  }, [trimmedQuery]);

  const matchingVideos = useMemo(() => {
    if (!trimmedQuery) return [];
    return DEMO_VIDEOS.filter(
      (v) =>
        v.title.toLowerCase().includes(trimmedQuery) ||
        v.tags.some((t) => t.toLowerCase().includes(trimmedQuery))
    ).slice(0, 3);
  }, [trimmedQuery]);

  const matchingKeywords = useMemo(() => {
    if (!trimmedQuery) return [];
    return DEMO_KEYWORDS.filter((k) =>
      k.keyword.toLowerCase().includes(trimmedQuery)
    ).slice(0, 3);
  }, [trimmedQuery]);

  const hasSearchResults =
    matchingPages.length > 0 || matchingVideos.length > 0 || matchingKeywords.length > 0;

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportData = () => {
    const dataForRange = getDataForRange(dateRange, DEMO_DAILY_DATA);
    exportToCSV(`youtube-analytics-${selectedChannel.handle}-${dateRange}`, dataForRange);
    showToast('Export Complete', `Analytics data exported as CSV (${dateRange.toUpperCase()})`, 'success');
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setSearchFocused(false);
      router.push('/videos');
    } else if (e.key === 'Escape') {
      setSearchFocused(false);
    }
  };

  const dateRangeOptions: { id: DateRange; label: string }[] = [
    { id: '7d', label: '7D' },
    { id: '28d', label: '28D' },
    { id: '90d', label: '90D' },
    { id: '365d', label: '365D' },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200/80 bg-white dark:border-white/[0.07] dark:bg-[#0c0e14] px-4 sm:px-6 transition-colors select-none">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-md">
        <button
          onClick={onToggleMobileMenu}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:hover:text-white lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Input with Dynamic Results Dropdown */}
        <div className="relative w-full" ref={searchRef}>
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchFocused(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search metrics, videos, keywords... (Ctrl+K)"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-12 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:outline-none dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-white dark:placeholder:text-neutral-500 dark:focus:border-white/20 transition-colors"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchFocused(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 items-center rounded bg-slate-200/80 dark:bg-white/[0.08] px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-600 dark:text-neutral-400 border border-slate-300/40 dark:border-white/[0.06]"
              title="Open Command Palette (Ctrl+K)"
            >
              ⌘K
            </button>
          )}

          {/* Search Results Popover */}
          {searchFocused && trimmedQuery && (
            <div className="absolute left-0 right-0 top-11 z-50 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-navy-750 dark:bg-navy-850 animate-fade-in max-h-96 overflow-y-auto">
              {!hasSearchResults ? (
                <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400">
                  <p>No results found for &quot;{searchQuery}&quot;</p>
                  <p className="text-[11px] text-slate-400 mt-1">Try searching for &quot;views&quot;, &quot;revenue&quot;, &quot;saas&quot;, or &quot;shorts&quot;</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Matching Pages */}
                  {matchingPages.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                        Platform Pages
                      </p>
                      {matchingPages.map((page) => (
                        <Link
                          key={page.href}
                          href={page.href}
                          onClick={() => {
                            setSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between rounded-lg p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                        >
                          <span>{page.name}</span>
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                            {page.category}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Matching Videos */}
                  {matchingVideos.length > 0 && (
                    <div className="space-y-1 border-t border-slate-100 dark:border-navy-750 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                        Videos
                      </p>
                      {matchingVideos.map((vid) => (
                        <Link
                          key={vid.id}
                          href="/videos"
                          onClick={() => setSearchFocused(false)}
                          className="flex items-center gap-2.5 rounded-lg p-2 text-xs hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors group"
                        >
                          <Film className="h-4 w-4 text-brand-500 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-500">
                              {vid.title}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {formatNumber(vid.views)} views • CTR {vid.ctr}%
                            </p>
                          </div>
                          <ArrowRight className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Matching Keywords */}
                  {matchingKeywords.length > 0 && (
                    <div className="space-y-1 border-t border-slate-100 dark:border-navy-750 pt-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
                        Keywords
                      </p>
                      {matchingKeywords.map((kw) => (
                        <Link
                          key={kw.keyword}
                          href="/seo"
                          onClick={() => {
                            setSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center justify-between rounded-lg p-2 text-xs hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                        >
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            #{kw.keyword}
                          </span>
                          <span className="text-[10px] text-emerald-500 font-semibold">
                            {formatNumber(kw.searchVolume)}/mo (Simulated)
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-navy-750 text-center">
                    <button
                      onClick={() => {
                        setSearchFocused(false);
                        router.push('/videos');
                      }}
                      className="text-[11px] font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                    >
                      View all video matches in Catalog →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Date Range Selector: Clean macOS Segmented Style */}
        <div className="hidden sm:flex items-center rounded-lg bg-slate-100 dark:bg-white/[0.04] p-0.5 border border-slate-200 dark:border-white/[0.06]">
          {dateRangeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setDateRange(opt.id)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                dateRange === opt.id
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-white/[0.1] dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] p-1.5 text-slate-500 hover:bg-slate-50 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:hover:text-white transition-colors"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] p-1.5 text-slate-500 hover:bg-slate-50 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-3.5 w-3.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-1.5 w-1.5 rounded-full bg-[#ff0033]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-white/[0.08] dark:bg-[#11131a] animate-fade-in">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white text-xs">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded bg-[#ff0033]/10 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-[#ff0033]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-72 overflow-y-auto space-y-1 divide-y divide-slate-100 dark:divide-white/[0.04] scrollbar-thin">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`pt-2 flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                      item.read
                        ? 'opacity-60 hover:opacity-100'
                        : 'bg-slate-50 dark:bg-white/[0.03]'
                    }`}
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
                      <Sparkles className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                      <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 mt-1 block">
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.06] text-center">
                <Link
                  href="/reports"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center gap-1 transition-colors"
                >
                  View Reports <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] p-1 hover:border-slate-300 dark:hover:border-white/20 transition-all"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-6 w-6 rounded-md object-cover"
            />
            <span className="hidden md:inline-block text-xs font-medium text-slate-800 dark:text-white pr-1">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-11 z-50 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-white/[0.08] dark:bg-[#11131a] animate-fade-in">
              <div className="p-2 border-b border-slate-100 dark:border-white/[0.06]">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {currentUser.name}
                </p>
                <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.email}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="rounded bg-slate-100 dark:bg-white/[0.06] px-1.5 py-0.2 font-mono text-[9px] font-medium text-slate-700 dark:text-slate-300">
                    {currentUser.plan} Plan
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 font-mono text-[9px] font-medium text-emerald-500">
                    Demo
                  </span>
                </div>
              </div>

              <div className="py-1">
                {onOpenChannelExplorer && (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onOpenChannelExplorer();
                    }}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <SearchCode className="h-3.5 w-3.5 text-[#ff0033]" /> Explore Any Channel
                  </button>
                )}
                {onOpenMilestoneCard && (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onOpenMilestoneCard();
                    }}
                    className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <Trophy className="h-3.5 w-3.5 text-amber-500" /> Milestone Card Maker
                  </button>
                )}
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    handleExportData();
                  }}
                  className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04] transition-colors text-left"
                >
                  <Download className="h-3.5 w-3.5 text-slate-400" /> Export CSV Report
                </button>
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" /> Account Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" /> Settings & Integrations
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> Admin Console
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04] transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-slate-400" /> Upgrade Plan
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-white/[0.06]">
                <Link
                  href="/auth/login"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out (Demo)
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
