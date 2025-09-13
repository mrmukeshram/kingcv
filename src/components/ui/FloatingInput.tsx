
import React from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="input-floating">
        <input
          ref={ref}
          className={cn(
            'peer',
            error && 'border-red-500 focus:border-red-500 focus:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
            className
          )}
          placeholder=" "
          {...props}
        />
        <label className={cn(error && 'text-red-500')}>
          {label}
        </label>
        {error && (
          <p className="mt-2 text-sm text-red-500 animate-fade-in-up">
            {error}
          </p>
        )}
      </div>
    );
  }
);
FloatingInput.displayName = 'FloatingInput';

export default FloatingInput;
