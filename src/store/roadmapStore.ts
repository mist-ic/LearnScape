import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Roadmap, RoadmapStep, ResourcePreference } from '../types';
import { generateId } from '../lib/utils';
import { defaultRoadmaps } from '../data/roadmaps';
import { generateRoadmap } from '../lib/api/roadmap';
import { useAuthStore } from './authStore';

interface RoadmapStore {
  roadmaps: Record<string, Roadmap[]>; // userId -> roadmaps
  activeRoadmap: Roadmap | null;
  isGenerating: boolean;
  error: string | null;
  createRoadmap: (title: string, description: string, timeframe: string, resourcePreference: ResourcePreference) => Promise<Roadmap>;
  addStep: (roadmapId: string, step: Omit<RoadmapStep, 'id' | 'completed'>) => void;
  updateProgress: (roadmapId: string, stepId: string, completed: boolean) => void;
  setActiveRoadmap: (roadmap: Roadmap) => void;
  clearError: () => void;
  getUserRoadmaps: () => Roadmap[];
}

export const useRoadmapStore = create<RoadmapStore>()(
  persist(
    (set, get) => ({
      roadmaps: {},
      activeRoadmap: null,
      isGenerating: false,
      error: null,

      getUserRoadmaps: () => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return [];
        return get().roadmaps[userId] || [];
      },

      createRoadmap: async (title, description, timeframe, resourcePreference) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) throw new Error('User not authenticated');

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
            userId, // Add userId to associate roadmap with user
            createdAt: new Date().toISOString(),
          };

          set((state) => ({
            roadmaps: {
              ...state.roadmaps,
              [userId]: [...(state.roadmaps[userId] || []), newRoadmap],
            },
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
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;

        set((state) => ({
          roadmaps: {
            ...state.roadmaps,
            [userId]: (state.roadmaps[userId] || []).map((roadmap) => {
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
          },
        }));
      },

      updateProgress: (roadmapId, stepId, completed) => {
        const userId = useAuthStore.getState().user?.id;
        if (!userId) return;

        set((state) => {
          const updatedUserRoadmaps = (state.roadmaps[userId] || []).map((roadmap) => {
            if (roadmap.id === roadmapId) {
              const updatedSteps = roadmap.steps.map((step) => {
                if (step.id === stepId) {
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

          const updatedActiveRoadmap = updatedUserRoadmaps.find(r => r.id === state.activeRoadmap?.id) || null;
          
          return {
            roadmaps: {
              ...state.roadmaps,
              [userId]: updatedUserRoadmaps,
            },
            activeRoadmap: updatedActiveRoadmap
          };
        });
      },

      setActiveRoadmap: (roadmap) => set({ activeRoadmap: roadmap }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'roadmap-storage',
    }
  )
);