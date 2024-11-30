import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500':
            variant === 'primary',
          'bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-500':
            variant === 'secondary',
          'border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500':
            variant === 'outline',
        },
        {
          'h-9 px-4 text-sm': size === 'sm',
          'h-10 px-4 text-base': size === 'md',
          'h-11 px-8 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
}