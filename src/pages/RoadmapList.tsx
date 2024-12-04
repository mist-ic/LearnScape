import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRoadmapStore } from '../store/roadmapStore';
import { ProgressBar } from '../components/ProgressBar';
import { ArrowRight, Plus } from 'lucide-react';
import { Button } from '../components/Button';

export function RoadmapList() {
  const navigate = useNavigate();
  const getUserRoadmaps = useRoadmapStore((state) => state.getUserRoadmaps);
  const roadmaps = getUserRoadmaps();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Learning Roadmaps</h2>
        <Button onClick={() => navigate('/')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Roadmap
        </Button>
      </div>

      {roadmaps.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-300 mb-4">You haven't created any roadmaps yet.</p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2 mx-auto">
            <Plus className="h-4 w-4" />
            Create Your First Roadmap
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {roadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              onClick={() => navigate(`/roadmap/${roadmap.id}`)}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{roadmap.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{roadmap.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Progress</span>
                  <span>{Math.round(roadmap.progress)}%</span>
                </div>
                <ProgressBar progress={roadmap.progress} className="dark:bg-gray-700" />
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Timeframe: {roadmap.timeframe}</span>
                  <span>Created: {new Date(roadmap.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}