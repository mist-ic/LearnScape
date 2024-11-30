import React from 'react';
import { cn } from '../lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2.5', className)}>
      <div
        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}