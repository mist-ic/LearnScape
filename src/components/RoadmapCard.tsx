import React from 'react';
import { ArrowRight } from 'lucide-react';

interface RoadmapCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function RoadmapCard({ title, description, icon, onClick }: RoadmapCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-100 dark:border-gray-700/50 hover:border-indigo-100 dark:hover:border-indigo-900/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          {icon}
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}