'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Eye,
  Clock,
  DollarSign,
  Film,
  Zap,
  GitCompare,
  Search,
  Sparkles,
  Image as ImageIcon,
  Calendar,
  FolderKanban,
  Activity,
  TrendingUp,
  Target,
  UserCheck,
  MessageSquare,
  FileSpreadsheet,
  Tv2,
  CreditCard,
  Settings,
  ShieldAlert,
  ChevronDown,
  Check,
  Plus,
  Play,
  Split,
  Award,
  Globe,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { selectedChannel, setSelectedChannel, channels, currentUser } = useApp();
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);

  const sections: NavSection[] = [
    {
      title: 'CORE TELEMETRY',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Video Hub & Radar', href: '/videos', icon: Film },
        { name: 'Views Telemetry', href: '/views', icon: Eye },
        { name: 'Watch Time', href: '/watch-hours', icon: Clock },
        { name: 'Subscribers & Reach', href: '/subscribers', icon: Users },
        { name: 'Revenue & RPM', href: '/revenue', icon: DollarSign },
        { name: 'Shorts Velocity', href: '/shorts', icon: Zap },
      ],
    },
    {
      title: 'GROWTH & INTELLIGENCE',
      items: [
        { name: 'AI Creative Studio', href: '/ai-studio', icon: Sparkles, badge: 'AI' },
        { name: 'A/B Testing Lab', href: '/ab-testing', icon: Split, badge: 'PRO' },
        { name: 'SEO & Metadata', href: '/seo', icon: Search },
        { name: 'Thumbnail Scorecard', href: '/thumbnails', icon: ImageIcon },
        { name: 'Competitor Matrix', href: '/comparison', icon: GitCompare },
        { name: 'Growth Predictions', href: '/predictions', icon: TrendingUp },
        { name: 'Milestone Goals', href: '/goals', icon: Target },
        { name: 'Idea Vault Kanban', href: '/vault', icon: FolderKanban },
      ],
    },
    {
      title: 'CREATOR OPERATIONS',
      items: [
        { name: 'Sponsor Media Kit', href: '/media-kit', icon: Award },
        { name: 'Content Calendar', href: '/calendar', icon: Calendar },
        { name: 'Comments & Sentiment', href: '/comments', icon: MessageSquare },
        { name: 'Channel Health Audit', href: '/audit', icon: Activity },
        { name: 'Channels Hub', href: '/channels', icon: Tv2 },
        { name: 'Reports & Export', href: '/reports', icon: FileSpreadsheet },
        { name: 'Public Landing Page', href: '/landing', icon: Globe },
        { name: 'Pricing Plans', href: '/pricing', icon: CreditCard },
        { name: 'Settings & Cloud DB', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200/80 bg-white dark:border-white/[0.06] dark:bg-[#0c0d12] transition-colors select-none">
      {/* Brand Header */}
      <div className="flex h-13 shrink-0 items-center justify-between px-4 border-b border-zinc-200/80 dark:border-white/[0.06]">
        <BrandLogo size="md" href="/" />
      </div>

      {/* Channel Switcher */}
      <div className="relative px-3 py-2 shrink-0 border-b border-zinc-200/60 dark:border-white/[0.04]">
        <button
          onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
          className="flex w-full items-center justify-between rounded-md border border-zinc-200/60 bg-zinc-50/50 p-2 text-left hover:border-zinc-300 dark:border-white/[0.05] dark:bg-white/[0.02] dark:hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={selectedChannel.avatar}
              alt={selectedChannel.name}
              className="h-5 w-5 rounded object-cover ring-1 ring-zinc-200 dark:ring-white/10"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-200">
                {selectedChannel.name}
              </p>
              <p className="truncate text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                {(selectedChannel.subscribers / 1000).toFixed(1)}k subs
              </p>
            </div>
          </div>
          <ChevronDown className="h-3 w-3 shrink-0 text-zinc-400 dark:text-zinc-500" />
        </button>

        {channelDropdownOpen && (
          <div className="absolute left-3 right-3 top-14 z-30 mt-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-white/[0.1] dark:bg-[#13151f] animate-fade-in">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
              Channels
            </div>
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChannel(ch);
                  setChannelDropdownOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-xs transition-colors',
                  selectedChannel.id === ch.id
                    ? 'bg-slate-100 font-semibold text-slate-900 dark:bg-white/[0.08] dark:text-white'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-neutral-400 dark:hover:bg-white/[0.04] dark:hover:text-neutral-200'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <img src={ch.avatar} alt="" className="h-4 w-4 rounded object-cover" />
                  <span className="truncate">{ch.name}</span>
                </div>
                {selectedChannel.id === ch.id && <Check className="h-3 w-3 shrink-0 text-[#ff0033]" />}
              </button>
            ))}
            <div className="mt-1 pt-1 border-t border-slate-100 dark:border-white/[0.06]">
              <Link
                href="/channels"
                onClick={() => {
                  setChannelDropdownOpen(false);
                  onCloseMobile?.();
                }}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" /> Manage channels
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Scrollable Area */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-0.5">
            <div className="px-2.5 pb-1.5 pt-1 text-[9.5px] font-medium uppercase tracking-widest text-slate-400/50 dark:text-zinc-500/50 select-none">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={cn(
                    'group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition-colors duration-150',
                    isActive
                      ? 'bg-slate-100 font-medium text-slate-900 dark:bg-white/[0.08] dark:text-white'
                      : 'font-normal text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-zinc-100'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 truncate text-left">
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 stroke-[1.5]',
                        isActive
                          ? 'text-[#ff0033]'
                          : 'text-slate-400 group-hover:text-slate-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={cn(
                        'shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold tracking-wider',
                        isActive
                          ? 'bg-[#ff0033]/20 text-[#ff0033]'
                          : 'bg-slate-100 text-slate-500 dark:bg-white/[0.06] dark:text-zinc-400'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Clean Minimalist User Profile Footer */}
      <div className="p-3 shrink-0 border-t border-zinc-200/80 dark:border-white/[0.06] bg-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-white/10"
            />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-zinc-900 dark:text-zinc-200">
                {currentUser.name}
              </p>
              <p className="truncate text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                {currentUser.plan} Plan
              </p>
            </div>
          </div>
          <Link
            href="/settings"
            onClick={onCloseMobile}
            className="rounded-md p-1.5 text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.04] transition-colors"
            title="Settings"
          >
            <Settings className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
