import { ResourcePreference } from '../../types';
import { generateId } from '../utils';

// Use relative path in development, Netlify function path in production
const API_URL = import.meta.env.DEV ? 'http://localhost:8888/.netlify/functions' : '/.netlify/functions';

interface GenerateRoadmapParams {
  topic: string;
  months: number;
  resourcePreference: ResourcePreference;
}

interface Resource {
  title: string;
  type: 'video' | 'article' | 'exercise';
  url: string;
  isPaid: boolean;
}

interface RoadmapStep {
  title: string;
  description: string;
  estimatedTime: string;
  resources: Resource[];
  order: number;
  id: string;
  completed: boolean;
}

interface RoadmapMetadata {
  topic: string;
  months: number;
  resourcePreference: ResourcePreference;
  totalSteps: number;
  generationTime: number;
}

interface RoadmapResponse {
  steps: RoadmapStep[];
  metadata: RoadmapMetadata;
}

export async function generateRoadmap({ 
  topic, 
  months, 
  resourcePreference 
}: GenerateRoadmapParams): Promise<RoadmapStep[]> {
  try {
    console.log('Sending request to backend:', { topic, months, resourcePreference });
    
    const response = await fetch(`${API_URL}/generate-roadmap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        months,
        resourcePreference
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data: RoadmapResponse = await response.json();
    console.log('Received response from backend:', data);
    console.log(`Roadmap generated in ${data.metadata.generationTime / 1000} seconds`);
    console.log(`Total steps: ${data.metadata.totalSteps}`);
    
    if (!data.steps || !Array.isArray(data.steps)) {
      throw new Error('Invalid response format from server');
    }

    const processedSteps = data.steps.map(step => ({
      ...step,
      id: generateId(),
      completed: false
    }));

    console.log('Processed steps with IDs:', processedSteps);
    return processedSteps;
  } catch (error) {
    console.error('Error in generateRoadmap:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate roadmap: ${error.message}`);
    }
    throw new Error('Failed to generate roadmap. Please try again.');
  }
} 