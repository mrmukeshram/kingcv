import React from 'react';
import { cn } from '@/lib/utils';

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'floating' | 'interactive' | 'glow';
  glowColor?: 'blue' | 'pink' | 'green' | 'purple';
  animated?: boolean;
}

const ModernCard = React.forwardRef<HTMLDivElement, ModernCardProps>(
  ({ className, children, variant = 'floating', glowColor = 'blue', animated = true, ...props }, ref) => {
    // Base classes that should always be present
    const baseClasses = 'rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-sm';
    
    // Variant-specific classes
    const variantClasses = {
      floating: 'hover:shadow-lg transition-shadow duration-300',
      interactive: 'cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200',
      glow: `hover:shadow-lg hover:shadow-${glowColor}-500/20 border-${glowColor}-300/50`
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          animated && 'transition-transform duration-200 hover:transform-gpu',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ModernCard.displayName = 'ModernCard';

export default ModernCard;
