'use client';

import React from 'react';
import { Sparkles, Info, X, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export const DemoNotice: React.FC = () => {
  const { demoNoticeDismissed, setDemoNoticeDismissed, selectedChannel } = useApp();

  if (demoNoticeDismissed) return null;

  return (
    <div className="relative isolate flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-slate-200 dark:border-white/[0.06] bg-slate-50/80 dark:bg-[#0d0f15] px-4 py-2 sm:px-6 text-xs transition-colors">
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
        <span className="flex h-5 items-center gap-1.5 rounded border border-slate-300 dark:border-white/[0.1] bg-white dark:bg-white/[0.04] px-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-300">
          Demo
        </span>
        <span className="text-[12px] text-slate-600 dark:text-slate-400">
          Simulated analytics for <strong className="font-semibold text-slate-900 dark:text-white">{selectedChannel.name}</strong>.
          Zero API quota consumed.
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="flex items-center gap-1 font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-xs underline underline-offset-4 decoration-slate-400 dark:decoration-slate-600 transition-colors"
        >
          <ShieldCheck className="h-3.5 w-3.5" /> Connect YouTube OAuth
        </Link>
        <button
          onClick={() => setDemoNoticeDismissed(true)}
          className="rounded p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/[0.08] hover:text-slate-600 dark:hover:text-white transition-colors"
          title="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

