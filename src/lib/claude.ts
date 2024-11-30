import Anthropic from '@anthropic-ai/sdk';
import { RoadmapStep, ResourcePreference } from '../types';
import { generateId } from './utils';
import { defaultRoadmaps } from '../data/roadmaps';

interface GenerateRoadmapParams {
  skill: string;
  timeframe: number;
  resourcePreference: ResourcePreference;
}

export async function generateRoadmap({ 
  skill, 
  timeframe, 
  resourcePreference 
}: GenerateRoadmapParams): Promise<RoadmapStep[]> {
  // Since we don't have a valid API key, let's provide a fallback
  // that returns a modified version of the default web development roadmap
  const webDevRoadmap = defaultRoadmaps[0];
  
  return webDevRoadmap.steps.map(step => ({
    ...step,
    id: generateId(),
    completed: false,
    title: step.title.replace('Web Development', skill),
    description: step.description.replace('web development', skill.toLowerCase()),
    estimatedTime: `${Math.ceil(timeframe / webDevRoadmap.steps.length)} weeks`,
    resources: step.resources.filter(resource => 
      resourcePreference === 'both' || 
      (resourcePreference === 'free' && !resource.isPaid) ||
      (resourcePreference === 'paid' && resource.isPaid)
    )
  }));
}