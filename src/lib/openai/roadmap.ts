import { GenerateRoadmapParams } from './types';
import { RoadmapStep } from '../../types';

const API_URL = 'http://localhost:5000';

export async function generateRoadmap({ 
  topic, 
  months, 
  resourcePreference 
}: GenerateRoadmapParams): Promise<RoadmapStep[]> {
  try {
    console.log('Sending request to backend:', { topic, months, resourcePreference });
    
    const response = await fetch(`${API_URL}/api/generate-roadmap`, {
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

    const data = await response.json();
    console.log('Received response from backend:', data);
    
    if (!data.steps || !Array.isArray(data.steps)) {
      throw new Error('Invalid response format from server');
    }

    return data.steps;
  } catch (error) {
    console.error('Error in generateRoadmap:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate roadmap: ${error.message}`);
    }
    throw new Error('Failed to generate roadmap. Please try again.');
  }
}