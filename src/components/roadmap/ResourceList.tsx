import React from 'react';
import { Resource } from '../../types';
import { ResourceIcon } from './ResourceIcon';

interface ResourceListProps {
  resources: Resource[];
}

export function ResourceList({ resources }: ResourceListProps) {
  return (
    <ul className="space-y-2">
      {resources.map((resource, index) => (
        <li key={`${resource.title}-${index}`} className="flex items-center gap-2">
          <ResourceIcon type={resource.type} />
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:underline ${resource.isPaid ? 'text-amber-500' : 'text-green-500'}`}
          >
            {resource.title}
          </a>
        </li>
      ))}
    </ul>
  );
}