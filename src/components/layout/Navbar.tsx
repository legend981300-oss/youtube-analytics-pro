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
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DateRange } from '@/types';
import { exportToCSV, formatNumber } from '@/lib/utils';
import { DEMO_DAILY_DATA, DEMO_VIDEOS, DEMO_KEYWORDS, getDataForRange } from '@/lib/demo-data';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
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
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-navy-950/80 sm:px-6 transition-all">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 lg:gap-4 flex-1 max-w-lg">
        <button
          onClick={onToggleMobileMenu}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-navy-800 dark:hover:text-white lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Search Input with Dynamic Results Dropdown */}
        <div className="relative w-full" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchFocused(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search metrics, videos, keywords, or ideas..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-brand-500 transition-colors"
          />
          {searchQuery && (
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
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Range Selector */}
        <div className="hidden sm:flex items-center gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-navy-900/90 border border-slate-200/80 dark:border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <Calendar className="h-3.5 w-3.5 ml-2 mr-1 text-slate-400" />
          {dateRangeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setDateRange(opt.id)}
              className={`rounded-xl px-2.5 py-1 text-xs font-bold transition-all ${
                dateRange === opt.id
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-gradient-to-r dark:from-red-600 dark:to-rose-600 dark:text-white dark:shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Quick CSV Export */}
        <button
          onClick={handleExportData}
          title="Export current data to CSV"
          className="hidden md:inline-flex items-center gap-1.5 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/[0.08] dark:bg-navy-850 dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/[0.06] transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
        >
          <Download className="h-3.5 w-3.5 text-brand-500" />
          <span>Export CSV</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-2xl border border-slate-200/80 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 dark:border-white/[0.08] dark:bg-navy-850 dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/[0.06] transition-all shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-navy-950 shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-navy-750 dark:bg-navy-850 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-navy-750">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2 max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-navy-750/50">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`pt-2 flex items-start gap-3 p-2 rounded-xl cursor-pointer transition-colors ${item.read
                        ? 'opacity-70 hover:opacity-100'
                        : 'bg-brand-500/5 dark:bg-brand-500/10'
                      }`}
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/20 text-brand-500">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-navy-750 text-center">
                <Link
                  href="/reports"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center justify-center gap-1"
                >
                  View Weekly Reports <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Theme Toggle (Hydration-Safe) */}
        <button
          onClick={toggleTheme}
          className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 dark:border-navy-750 dark:bg-navy-850 dark:text-slate-300 dark:hover:bg-navy-800 transition-colors"
          aria-label="Toggle theme"
          title={mounted ? `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode` : 'Toggle theme'}
        >
          {mounted && theme === 'light' ? (
            <Moon className="h-4 w-4 text-slate-700" />
          ) : (
            <Sun className="h-4 w-4 text-amber-400" />
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm hover:border-slate-300 dark:border-navy-750 dark:bg-navy-850 dark:hover:border-navy-600 transition-all"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-7 w-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-navy-700"
            />
            <span className="hidden md:inline-block text-xs font-bold text-slate-800 dark:text-white pr-1">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-navy-750 dark:bg-navy-850 animate-fade-in">
              <div className="p-2 border-b border-slate-100 dark:border-navy-750">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.email}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                    {currentUser.plan} Plan
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Demo Mode
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-750"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" /> Account Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-750"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" /> Settings & Integrations
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-750"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> Admin Dashboard
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-navy-750 font-medium"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Upgrade Plan
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-navy-750">
                <Link
                  href="/auth/login"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-navy-750"
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
