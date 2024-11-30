import React from 'react';
import { useParams } from 'react-router-dom';
import { useRoadmapStore } from '../store/roadmapStore';
import { RoadmapHeader } from '../components/roadmap/RoadmapHeader';
import { RoadmapStep } from '../components/roadmap/RoadmapStep';

export function RoadmapView() {
  const { id } = useParams<{ id: string }>();
  const { roadmaps, updateProgress } = useRoadmapStore();
  
  const roadmap = roadmaps.find((r) => r.id === id);

  if (!roadmap) {
    return <div>Roadmap not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <RoadmapHeader
        title={roadmap.title}
        description={roadmap.description}
        progress={roadmap.progress}
      />

      <div className="space-y-4">
        {roadmap.steps.map((step) => (
          <RoadmapStep
            key={step.id}
            step={step}
            onToggleComplete={(completed) => updateProgress(roadmap.id, step.id, completed)}
          />
        ))}
      </div>
    </div>
  );
}