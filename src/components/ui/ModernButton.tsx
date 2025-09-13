
import React from 'react';
import { cn } from '@/lib/utils';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', loading = false, disabled, ...props }, ref) => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      glow: 'btn-primary btn-glow animate-glow'
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-2xl',
      xl: 'px-12 py-6 text-xl rounded-2xl'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'flex items-center justify-center',
          'touch-target font-bold transition-all duration-300 transform-gpu',
          variants[variant],
          sizes[size],
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Loading...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            {children}
          </span>
        )}
      </button>
    );
  }
);
ModernButton.displayName = 'ModernButton';

export default ModernButton;
