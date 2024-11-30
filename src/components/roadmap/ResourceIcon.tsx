import React from 'react';
import { Video, FileText, Dumbbell } from 'lucide-react';

type ResourceType = 'video' | 'article' | 'exercise';

interface ResourceIconProps {
  type: ResourceType;
}

export function ResourceIcon({ type }: ResourceIconProps) {
  switch (type) {
    case 'video':
      return <Video className="w-4 h-4 text-blue-500" />;
    case 'article':
      return <FileText className="w-4 h-4 text-green-500" />;
    case 'exercise':
      return <Dumbbell className="w-4 h-4 text-purple-500" />;
    default:
      return null;
  }
} 