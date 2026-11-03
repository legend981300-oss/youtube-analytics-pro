import React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pills' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pills',
}) => {
  if (variant === 'underline') {
    return (
      <div className={cn('flex space-x-6 border-b border-slate-200 dark:border-navy-750', className)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors',
                isActive
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-slate-400'
                  )}
                >
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand-500" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-navy-900 border border-slate-200 dark:border-navy-800',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
              isActive
                ? 'bg-white text-slate-900 shadow-sm dark:bg-navy-750 dark:text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px]',
                  isActive
                    ? 'bg-brand-500 text-white'
                    : 'bg-slate-200 text-slate-700 dark:bg-navy-700 dark:text-slate-300'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

