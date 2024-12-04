import { create } from 'zustand';
import { Roadmap, RoadmapStep, ResourcePreference } from '../types';
import { generateId } from '../lib/utils';
import { defaultRoadmaps } from '../data/roadmaps';
import { generateRoadmap } from '../lib/api/roadmap';

interface RoadmapStore {
  roadmaps: Roadmap[];
  activeRoadmap: Roadmap | null;
  isGenerating: boolean;
  error: string | null;
  createRoadmap: (title: string, description: string, timeframe: string, resourcePreference: ResourcePreference) => Promise<Roadmap>;
  addStep: (roadmapId: string, step: Omit<RoadmapStep, 'id' | 'completed'>) => void;
  updateProgress: (roadmapId: string, stepId: string, completed: boolean) => void;
  setActiveRoadmap: (roadmap: Roadmap) => void;
  clearError: () => void;
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  roadmaps: defaultRoadmaps,
  activeRoadmap: null,
  isGenerating: false,
  error: null,
  createRoadmap: async (title, description, timeframe, resourcePreference) => {
    set({ isGenerating: true, error: null });
    try {
      const months = parseInt(timeframe);
      const steps = await generateRoadmap({
        topic: title,
        months,
        resourcePreference
      });

      const processedSteps = steps.map(step => ({
        ...step,
        id: step.id || generateId(),
        completed: false
      }));

      const newRoadmap: Roadmap = {
        id: generateId(),
        title,
        description,
        timeframe,
        steps: processedSteps,
        progress: 0,
        resourcePreference,
      };

      set((state) => ({
        roadmaps: [...state.roadmaps, newRoadmap],
        activeRoadmap: newRoadmap,
        isGenerating: false
      }));

      return newRoadmap;
    } catch (error) {
      set({ 
        isGenerating: false, 
        error: error instanceof Error ? error.message : 'Failed to generate roadmap'
      });
      throw error;
    }
  },
  addStep: (roadmapId, step) => {
    set((state) => ({
      roadmaps: state.roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const newStep: RoadmapStep = {
            ...step,
            id: generateId(),
            completed: false,
          };
          return {
            ...roadmap,
            steps: [...roadmap.steps, newStep],
          };
        }
        return roadmap;
      }),
    }));
  },
  updateProgress: (roadmapId, stepId, completed) => {
    console.log('Updating progress:', { roadmapId, stepId, completed });
    set((state) => {
      const updatedRoadmaps = state.roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const updatedSteps = roadmap.steps.map((step) => {
            if (step.id === stepId) {
              console.log('Updating step:', { stepId, completed });
              return { ...step, completed };
            }
            return step;
          });
          const progress = (updatedSteps.filter((step) => step.completed).length / updatedSteps.length) * 100;
          return {
            ...roadmap,
            steps: updatedSteps,
            progress,
          };
        }
        return roadmap;
      });

      const updatedActiveRoadmap = updatedRoadmaps.find(r => r.id === state.activeRoadmap?.id) || null;
      
      return {
        roadmaps: updatedRoadmaps,
        activeRoadmap: updatedActiveRoadmap
      };
    });
  },
  setActiveRoadmap: (roadmap) => set({ activeRoadmap: roadmap }),
  clearError: () => set({ error: null })
}));