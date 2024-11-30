import Anthropic from '@anthropic-ai/sdk';
import { RoadmapStep, ResourcePreference } from '../types';
import { generateId } from './utils';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_CLAUDE_API_KEY,
});

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
  const prompt = `Generate a detailed learning roadmap for ${skill} that can be completed in ${timeframe} months. 
    The roadmap should include specific steps with clear objectives and ${resourcePreference === 'free' ? 'only free' : resourcePreference === 'paid' ? 'only paid' : 'both free and paid'} learning resources.
    Format the response as a JSON array of steps, where each step has:
    - title: string (short, descriptive title)
    - description: string (detailed explanation)
    - estimatedTime: string (e.g., "2 weeks")
    - resources: array of objects with:
      - title: string
      - type: "video" | "article" | "exercise"
      - url: string (valid URL)
      - isPaid: boolean
    
    Ensure all URLs are valid and resources match the specified preference (${resourcePreference}).`;

  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 4000,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  try {
    const response = JSON.parse(message.content[0].text);
    return response.map((step: Omit<RoadmapStep, 'id' | 'completed'>) => ({
      ...step,
      id: generateId(),
      completed: false,
    }));
  } catch (error) {
    console.error('Failed to parse Claude response:', error);
    throw new Error('Failed to generate roadmap');
  }
}