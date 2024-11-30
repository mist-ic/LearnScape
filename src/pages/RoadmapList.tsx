import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../store/roadmapStore';
import { ProgressBar } from '../components/ProgressBar';
import { ArrowRight } from 'lucide-react';

export function RoadmapList() {
  const navigate = useNavigate();
  const roadmaps = useRoadmapStore((state) => state.roadmaps);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Learning Roadmaps</h2>
      <div className="space-y-4">
        {roadmaps.map((roadmap) => (
          <div
            key={roadmap.id}
            onClick={() => navigate(`/roadmap/${roadmap.id}`)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{roadmap.title}</h3>
                <p className="text-gray-600">{roadmap.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Progress</span>
                <span>{Math.round(roadmap.progress)}%</span>
              </div>
              <ProgressBar progress={roadmap.progress} />
              <p className="text-sm text-gray-500">
                Timeframe: {roadmap.timeframe}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}