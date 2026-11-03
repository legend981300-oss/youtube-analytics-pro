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
  PlaySquare,
  Split,
  Award,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: 'default' | 'success' | 'warning' | 'purple' | 'cyan';
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
      title: 'ANALYTICS & METRICS',
      items: [
        { name: 'Dashboard Overview', href: '/', icon: LayoutDashboard },
        { name: 'Subscriber Growth', href: '/subscribers', icon: Users },
        { name: 'Views Analytics', href: '/views', icon: Eye },
        { name: 'Watch Hours', href: '/watch-hours', icon: Clock },
        { name: 'Estimated Revenue', href: '/revenue', icon: DollarSign, badge: 'PRO', badgeColor: 'purple' },
        { name: 'Video Performance', href: '/videos', icon: Film },
        { name: 'Shorts Analytics', href: '/shorts', icon: Zap, badge: 'HOT', badgeColor: 'cyan' },
        { name: 'Audience Insights', href: '/audience', icon: UserCheck },
        { name: 'Sentiment & Comments', href: '/comments', icon: MessageSquare },
      ],
    },
    {
      title: 'GROWTH & SEO',
      items: [
        { name: 'Competitor Analysis', href: '/comparison', icon: GitCompare },
        { name: 'SEO & Keywords', href: '/seo', icon: Search },
        { name: 'A/B Testing Lab', href: '/ab-testing', icon: Split, badge: 'PRO', badgeColor: 'purple' },
        { name: 'Thumbnail Analyzer', href: '/thumbnails', icon: ImageIcon },
        { name: 'Channel Health Audit', href: '/audit', icon: Activity },
        { name: 'Growth Predictions', href: '/predictions', icon: TrendingUp },
        { name: 'Goal Tracker', href: '/goals', icon: Target },
      ],
    },
    {
      title: 'AI CREATIVE STUDIO',
      items: [
        { name: 'AI Generators', href: '/ai-studio', icon: Sparkles, badge: 'AI', badgeColor: 'success' },
        { name: 'Content Calendar', href: '/calendar', icon: Calendar },
        { name: 'Video Idea Vault', href: '/vault', icon: FolderKanban },
      ],
    },
    {
      title: 'OPERATIONS & PLANS',
      items: [
        { name: 'Multi-Channel Hub', href: '/channels', icon: Tv2 },
        { name: 'Sponsor Media Kit', href: '/media-kit', icon: Award, badge: 'NEW', badgeColor: 'cyan' },
        { name: 'Weekly Reports & CSV', href: '/reports', icon: FileSpreadsheet },
        { name: 'Pricing & Plans', href: '/pricing', icon: CreditCard },
        { name: 'Settings & OAuth', href: '/settings', icon: Settings },
        { name: 'Admin Dashboard', href: '/admin', icon: ShieldAlert, badge: 'ADMIN', badgeColor: 'default' },
      ],
    },
  ];

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200/80 bg-slate-50 dark:border-navy-800 dark:bg-navy-900 transition-colors">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200/80 dark:border-navy-800">
        <Link
          href="/"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 font-bold tracking-tight text-slate-900 dark:text-white group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <PlaySquare className="h-5 w-5 text-white fill-white/20" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-tight">
              YT Analytics<span className="text-brand-500 font-black">Pro</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">
              Creator Intelligence
            </span>
          </div>
        </Link>
      </div>

      {/* Channel Switcher */}
      <div className="relative p-3 border-b border-slate-200/60 dark:border-navy-800/80">
        <button
          onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-left shadow-sm hover:border-slate-300 dark:border-navy-750 dark:bg-navy-850 dark:hover:border-navy-600 transition-all"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={selectedChannel.avatar}
              alt={selectedChannel.name}
              className="h-8 w-8 rounded-lg object-cover ring-1 ring-brand-500/30"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white">
                {selectedChannel.name}
              </p>
              <p className="truncate text-[10px] text-slate-500 dark:text-slate-400">
                {selectedChannel.handle} • {(selectedChannel.subscribers / 1000).toFixed(1)}k subs
              </p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        </button>

        {channelDropdownOpen && (
          <div className="absolute left-3 right-3 top-16 z-30 mt-1 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-navy-700 dark:bg-navy-800 animate-fade-in">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Your Channels
            </div>
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  setSelectedChannel(ch);
                  setChannelDropdownOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                  selectedChannel.id === ch.id
                    ? 'bg-brand-500/10 font-bold text-brand-600 dark:text-brand-400'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-navy-750'
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <img src={ch.avatar} alt="" className="h-5 w-5 rounded object-cover" />
                  <span className="truncate">{ch.name}</span>
                </div>
                {selectedChannel.id === ch.id && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            ))}
            <div className="mt-1 pt-1 border-t border-slate-100 dark:border-navy-700">
              <Link
                href="/channels"
                onClick={() => {
                  setChannelDropdownOpen(false);
                  onCloseMobile?.();
                }}
                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-navy-750"
              >
                <Plus className="h-3.5 w-3.5" /> Manage or Add Channel
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Scrollable Area */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                    'group flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-navy-800 dark:hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200'
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant={item.badgeColor || 'default'}
                      size="sm"
                      className={isActive ? 'bg-white/20 text-white border-transparent' : ''}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Plan & User Footer */}
      <div className="p-3 border-t border-slate-200/80 dark:border-navy-800 bg-white dark:bg-navy-950/50">
        <div className="rounded-xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 via-transparent to-purple-500/10 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {currentUser.plan} Plan
            </span>
            <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
              Demo Active
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {currentUser.plan === 'Free'
              ? 'Basic demo analytics & 1 channel.'
              : currentUser.plan === 'Creator'
              ? 'Multi-channel studio suite & team access.'
              : 'Unlimited AI insights & 5 channels.'}
          </p>
          <Link
            href="/pricing"
            onClick={onCloseMobile}
            className="mt-2.5 block text-center rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition-colors"
          >
            {currentUser.plan === 'Creator' ? 'Manage Subscription' : 'Upgrade Plan'}
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-7 w-7 rounded-full object-cover"
            />
            <div className="text-[11px]">
              <p className="font-semibold text-slate-900 dark:text-white truncate w-24">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-24">
                {currentUser.email}
              </p>
            </div>
          </div>
          <Link
            href="/settings"
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-navy-800 dark:hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
};

