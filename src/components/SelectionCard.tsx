import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface SelectionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode | string;
  onClick: () => void;
  selected?: boolean;
}

export function SelectionCard({
  title,
  description,
  icon,
  onClick,
  selected = false,
}: SelectionCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white dark:bg-gray-800/50 rounded-xl p-6 cursor-pointer transition-all duration-200',
        'border-2',
        selected
          ? 'border-indigo-500 dark:border-indigo-400 shadow-md'
          : 'border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800/50 hover:shadow-md'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {typeof icon === 'string' ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <ArrowRight className={cn(
          'h-5 w-5 transition-colors',
          selected ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-600'
        )} />
      </div>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}