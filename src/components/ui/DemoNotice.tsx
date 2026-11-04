'use client';

import React from 'react';
import { Sparkles, Info, X, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export const DemoNotice: React.FC = () => {
  const { demoNoticeDismissed, setDemoNoticeDismissed, selectedChannel } = useApp();

  if (demoNoticeDismissed) return null;

  return (
    <div className="relative isolate flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-brand-500/20 bg-gradient-to-r from-brand-600/10 via-navy-900 to-brand-600/10 px-4 py-2.5 sm:px-6 text-xs">
      <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
        <span className="flex h-5 items-center gap-1 rounded-full bg-brand-500/20 px-2 text-[10px] font-bold text-brand-600 dark:text-brand-400">
          <Sparkles className="h-3 w-3" /> DEMO MODE
        </span>
        <span>
          Showing simulated metrics for <strong className="font-semibold text-slate-900 dark:text-white">{selectedChannel.name}</strong>.
          No live API quota consumed.
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="flex items-center gap-1 font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400 underline underline-offset-2"
        >
          <ShieldCheck className="h-3.5 w-3.5" /> Connect YouTube OAuth / Supabase
        </Link>
        <button
          onClick={() => setDemoNoticeDismissed(true)}
          className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          title="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

