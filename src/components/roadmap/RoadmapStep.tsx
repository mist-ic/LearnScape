import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { RoadmapStep as RoadmapStepType } from '../../types';
import { ResourceList } from './ResourceList';

interface RoadmapStepProps {
  step: RoadmapStepType;
  onToggleComplete: (completed: boolean) => void;
}

export function RoadmapStep({ step, onToggleComplete }: RoadmapStepProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggleComplete(!step.completed)}
          className="mt-1"
        >
          {step.completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-300" />
          )}
        </button>
        <div>
          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
          <p className="text-gray-600 mb-4">{step.description}</p>
          {step.resources.length > 0 && <ResourceList resources={step.resources} />}
        </div>
      </div>
    </div>
  );
}