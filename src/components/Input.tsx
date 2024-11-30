import React from 'react';
import { cn } from '../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          className={cn(
            'block w-full rounded-md shadow-sm',
            'bg-white dark:bg-gray-700',
            'text-gray-900 dark:text-gray-100',
            'border-gray-300 dark:border-gray-600',
            'focus:border-indigo-500 dark:focus:border-indigo-400',
            'focus:ring-indigo-500 dark:focus:ring-indigo-400',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            error && 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';