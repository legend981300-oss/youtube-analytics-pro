'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
      {toasts.map((toast) => {
        const type = toast.type || 'success';
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300 animate-fade-in',
              type === 'success' && 'border-emerald-500/30 bg-white/95 text-slate-900 dark:bg-navy-900/95 dark:text-white',
              type === 'error' && 'border-rose-500/30 bg-white/95 text-slate-900 dark:bg-navy-900/95 dark:text-white',
              type === 'warning' && 'border-amber-500/30 bg-white/95 text-slate-900 dark:bg-navy-900/95 dark:text-white',
              type === 'info' && 'border-blue-500/30 bg-white/95 text-slate-900 dark:bg-navy-900/95 dark:text-white'
            )}
          >
            <div className="mt-0.5 shrink-0">
              {type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {type === 'error' && <AlertCircle className="h-5 w-5 text-rose-500" />}
              {type === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              {type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
            </div>

            <div className="flex-1 min-w-0 text-xs">
              <p className="font-bold leading-tight">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-slate-500 dark:text-slate-400 leading-normal">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

