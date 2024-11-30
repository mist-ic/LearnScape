import React from 'react';
import { Resource } from '../../types';

interface ResourceListProps {
  resources: Resource[];
}

export function ResourceList({ resources }: ResourceListProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">Resources</h4>
      <ul className="space-y-2">
        {resources.map((resource) => (
          <li key={resource.id}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              {resource.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}