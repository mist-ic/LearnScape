import React from 'react';
import { ProgressBar } from '../ProgressBar';

interface RoadmapHeaderProps {
  title: string;
  description: string;
  progress: number;
}

export function RoadmapHeader({ title, description, progress }: RoadmapHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <div className="space-y-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
        <ProgressBar progress={progress} className="dark:bg-gray-700" />
      </div>
    </div>
  );
}