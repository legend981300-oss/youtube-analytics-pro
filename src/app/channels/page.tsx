'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Tv2, Plus, Check, ExternalLink, ShieldCheck, PlaySquare, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { youtubeApi } from '@/lib/youtube-api';

export default function MultiChannelPage() {
  const { channels, selectedChannel, setSelectedChannel, addNewChannel, showToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelHandle, setChannelHandle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [isConnecting, setIsConnecting] = useState(false);

  // Compute portfolio totals
  const totalPortfolioSubs = channels.reduce((acc, c) => acc + c.subscribers, 0);
  const totalPortfolioViews = channels.reduce((acc, c) => acc + c.totalViews, 0);
  const totalPortfolioVideos = channels.reduce((acc, c) => acc + c.totalVideos, 0);

  const handleConnectChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;

    setIsConnecting(true);
    setTimeout(() => {
      addNewChannel(channelName, channelHandle || `@${channelName.replace(/\s+/g, '')}`, category);
      setIsConnecting(false);
      setModalOpen(false);
      setChannelName('');
      setChannelHandle('');
      showToast('Channel Linked', `Channel "${channelName}" successfully linked in Demo Mode!`, 'success');
    }, 1000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Multi-Channel Management Hub
              </h1>
              <Badge variant="purple" size="sm">
                Portfolio Reach
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Manage all your YouTube channels from a single unified creator operating system.
            </p>
          </div>

          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Connect Channel
          </Button>
        </div>

        {/* Aggregated Portfolio Snapshot */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-navy-750 dark:bg-navy-850">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Global Portfolio Reach
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Aggregated metrics across all {channels.length} connected brand channels.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Portfolio Subscribers</span>
              <p className="text-2xl font-black text-rose-500 mt-1">{formatNumber(totalPortfolioSubs)}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Combined Lifetime Views</span>
              <p className="text-2xl font-black text-blue-500 mt-1">{formatNumber(totalPortfolioViews)}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-navy-750 dark:bg-navy-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Published Videos</span>
              <p className="text-2xl font-black text-emerald-500 mt-1">{totalPortfolioVideos}</p>
            </div>
          </div>
        </div>

        {/* Channels List Cards */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Connected Channels ({channels.length})
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {channels.map((chan) => {
              const isSelected = selectedChannel.id === chan.id;
              return (
                <div
                  key={chan.id}
                  className={`relative rounded-2xl border bg-white p-5 shadow-sm dark:bg-navy-850 transition-all ${
                    isSelected
                      ? 'border-brand-500 ring-2 ring-brand-500/20'
                      : 'border-slate-200/80 hover:border-slate-300 dark:border-navy-750'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-600 dark:text-brand-400">
                      <Check className="h-3 w-3" /> Active
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <img
                      src={chan.avatar}
                      alt={chan.name}
                      className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-navy-700"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {chan.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{chan.handle}</p>
                      <Badge variant="cyan" size="sm" className="mt-1">
                        {chan.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-navy-750 pt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Subscribers</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">
                        {formatNumber(chan.subscribers)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase">Total Views</span>
                      <p className="font-extrabold text-slate-900 dark:text-white">
                        {formatNumber(chan.totalViews)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-2">
                    {isSelected ? (
                      <Button size="sm" variant="outline" className="w-full pointer-events-none opacity-60">
                        Currently Viewing
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          setSelectedChannel(chan);
                          showToast('Channel Switched', `Now viewing analytics for ${chan.name}`, 'success');
                        }}
                      >
                        Switch to this Channel
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connect Channel Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Connect a YouTube Channel"
          description="Simulate adding another channel or prepare OAuth integration."
        >
          <form onSubmit={handleConnectChannel} className="space-y-4 text-xs">
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> YouTube OAuth 2.0 Integration Point
              </p>
              <p className="text-[11px] leading-relaxed">
                In production, clicking connect opens Google OAuth with `youtube.readonly` scopes. For this local version, you can simulate adding any channel name to test multi-channel switching.
              </p>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Channel Name
              </label>
              <input
                type="text"
                required
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="e.g. NextGen AI Labs"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Channel Handle
              </label>
              <input
                type="text"
                value={channelHandle}
                onChange={(e) => setChannelHandle(e.target.value)}
                placeholder="@NextGenAILabs"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Niche / Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Gaming, Tech, Education, Vlog..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:border-brand-500 focus:bg-white focus:outline-none dark:border-navy-750 dark:bg-navy-950 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-navy-750">
              <a
                href={youtubeApi.getOAuthLoginUrl()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-red-500 hover:to-rose-500 transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Connect with Google OAuth
              </a>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isConnecting}>
                  Link Channel (Demo)
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
}

