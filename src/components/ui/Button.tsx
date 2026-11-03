import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-navy-900 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
      primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/30 focus:ring-brand-500 border border-brand-500/30',
      secondary: 'bg-slate-800 text-white hover:bg-slate-700 dark:bg-navy-750 dark:hover:bg-navy-700 dark:text-white border border-slate-700 dark:border-navy-600 focus:ring-slate-400',
      outline: 'bg-transparent border border-slate-300 hover:bg-slate-100 text-slate-800 dark:border-navy-700 dark:text-slate-200 dark:hover:bg-navy-800/80 focus:ring-slate-400',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-navy-800 focus:ring-slate-400',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 focus:ring-rose-500',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
      md: 'h-10 px-4 text-sm rounded-xl gap-2',
      lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
      icon: 'h-9 w-9 rounded-lg p-0',
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

