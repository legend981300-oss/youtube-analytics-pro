import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-navy-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:via-rose-500 hover:to-red-500 text-white shadow-md shadow-brand-600/30 border border-rose-400/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] focus:ring-rose-500 hover:shadow-glow',
      glow:
        'bg-gradient-to-r from-red-600 via-brand-600 to-rose-600 text-white shadow-[0_0_25px_rgba(225,29,72,0.45)] border border-rose-300/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(225,29,72,0.6)] focus:ring-rose-500',
      secondary:
        'bg-slate-900 text-white hover:bg-slate-800 dark:bg-navy-800 dark:hover:bg-navy-750 dark:text-white border border-slate-700 dark:border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] focus:ring-slate-400',
      outline:
        'bg-transparent border border-slate-300 hover:bg-slate-100 text-slate-800 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.06] dark:hover:border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] focus:ring-slate-400',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-white/[0.06] focus:ring-slate-400',
      danger:
        'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/30 border border-rose-500/30 focus:ring-rose-500',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-xl gap-1.5',
      md: 'h-10 px-4 text-xs font-bold rounded-xl gap-2',
      lg: 'h-12 px-6 text-sm font-bold rounded-2xl gap-2.5',
      icon: 'h-9 w-9 rounded-xl p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
