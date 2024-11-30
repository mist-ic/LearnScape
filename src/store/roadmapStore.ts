import { create } from 'zustand';
import { Roadmap, RoadmapStep, ResourcePreference } from '../types';
import { generateId } from '../lib/utils';
import { generateRoadmap } from '../lib/claude';
import { defaultRoadmaps } from '../data/roadmaps';

interface RoadmapStore {
  roadmaps: Roadmap[];
  activeRoadmap: Roadmap | null;
  isGenerating: boolean;
  error: string | null;
  createRoadmap: (title: string, description: string, timeframe: string, resourcePreference: ResourcePreference) => Roadmap;
  generateAIRoadmap: (skill: string, timeframe: number, resourcePreference: ResourcePreference) => Promise<Roadmap>;
  addStep: (roadmapId: string, step: Omit<RoadmapStep, 'id' | 'completed'>) => void;
  updateProgress: (roadmapId: string, stepId: string, completed: boolean) => void;
  setActiveRoadmap: (roadmap: Roadmap) => void;
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  roadmaps: defaultRoadmaps,
  activeRoadmap: null,
  isGenerating: false,
  error: null,
  createRoadmap: (title, description, timeframe, resourcePreference) => {
    const newRoadmap: Roadmap = {
      id: generateId(),
      title,
      description,
      timeframe,
      steps: [],
      progress: 0,
      resourcePreference,
    };
    set((state) => ({
      roadmaps: [...state.roadmaps, newRoadmap],
      activeRoadmap: newRoadmap,
    }));
    return newRoadmap;
  },
  generateAIRoadmap: async (skill, timeframe, resourcePreference) => {
    set({ isGenerating: true, error: null });
    try {
      const steps = await generateRoadmap({ skill, timeframe, resourcePreference });
      const roadmap = get().createRoadmap(
        `${skill} Learning Path`,
        `Master ${skill} in ${timeframe} months`,
        `${timeframe} months`,
        resourcePreference
      );
      
      steps.forEach(step => {
        get().addStep(roadmap.id, step);
      });
      
      set({ isGenerating: false });
      return roadmap;
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
    set((state) => ({
      roadmaps: state.roadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const updatedSteps = roadmap.steps.map((step) =>
            step.id === stepId ? { ...step, completed } : step
          );
          const progress = (updatedSteps.filter((step) => step.completed).length / updatedSteps.length) * 100;
          return {
            ...roadmap,
            steps: updatedSteps,
            progress,
          };
        }
        return roadmap;
      }),
    }));
  },
  setActiveRoadmap: (roadmap) => set({ activeRoadmap: roadmap }),
}));