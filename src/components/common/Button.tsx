import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-sm shadow-indigo-600/30 border border-indigo-500/30 hover:border-indigo-400/50',
      secondary:
        'bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 dark:border-slate-700/50 light:bg-slate-100 light:text-slate-800 light:hover:bg-slate-200 light:border-slate-300',
      outline:
        'bg-transparent hover:bg-slate-800/40 text-slate-300 hover:text-white border border-slate-700/80 dark:border-slate-700 light:border-slate-300 light:text-slate-700 light:hover:bg-slate-100',
      ghost:
        'bg-transparent hover:bg-slate-800/60 active:bg-slate-800/90 text-slate-400 hover:text-slate-200 light:text-slate-600 light:hover:text-slate-900 light:hover:bg-slate-100',
      danger:
        'bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 text-rose-400 border border-rose-500/30 hover:border-rose-500/50',
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
      md: 'text-sm px-3.5 py-2 rounded-xl gap-2',
      lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5',
      icon: 'p-2 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
