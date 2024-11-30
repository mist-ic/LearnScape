import React from 'react';
import { useParams } from 'react-router-dom';
import { useRoadmapStore } from '../store/roadmapStore';
import { RoadmapHeader } from '../components/roadmap/RoadmapHeader';
import { RoadmapStep } from '../components/roadmap/RoadmapStep';
import { generateId } from '../lib/utils';

export function RoadmapView() {
  const { id } = useParams<{ id: string }>();
  const { roadmaps, updateProgress } = useRoadmapStore();
  
  const roadmap = roadmaps.find((r) => r.id === id);

  if (!roadmap) {
    return <div>Roadmap not found</div>;
  }

  // Ensure each step has a unique ID
  const stepsWithIds = React.useMemo(() => {
    return roadmap.steps.map(step => ({
      ...step,
      id: step.id || generateId()
    }));
  }, [roadmap.steps]);

  const handleToggleComplete = (stepId: string, completed: boolean) => {
    if (roadmap.id) {
      updateProgress(roadmap.id, stepId, completed);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <RoadmapHeader
        title={roadmap.title}
        description={roadmap.description}
        progress={roadmap.progress}
      />

      <div className="space-y-4">
        {stepsWithIds.map((step) => (
          <RoadmapStep
            key={step.id}
            step={step}
            onToggleComplete={(completed) => handleToggleComplete(step.id, completed)}
          />
        ))}
      </div>
    </div>
  );
}