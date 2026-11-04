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
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-[#090a0f] focus:ring-red-500 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      primary:
        'bg-[#ff0033] hover:bg-[#e6002e] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_1px_2px_rgba(0,0,0,0.4)] border border-red-500/60',
      glow:
        'bg-white text-black hover:bg-slate-100 font-semibold shadow-sm border border-white',
      secondary:
        'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white/[0.08] dark:hover:bg-white/[0.12] dark:text-white border border-slate-700 dark:border-white/[0.1] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]',
      outline:
        'bg-transparent border border-slate-300 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-800 dark:text-slate-200 dark:hover:border-white/[0.16]',
      ghost:
        'bg-transparent hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 dark:hover:text-white',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white border border-rose-500/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]',
    };

    const sizes = {
      sm: 'h-8 px-2.5 text-[11px] font-medium rounded-lg gap-1.5',
      md: 'h-9 px-3.5 text-xs font-medium rounded-lg gap-2',
      lg: 'h-10 px-4 text-xs font-semibold rounded-lg gap-2.5',
      icon: 'h-8 w-8 rounded-lg p-0',
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
