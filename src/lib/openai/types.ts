import { ResourcePreference } from '../../types';

export interface GenerateRoadmapParams {
  topic: string;
  months: number;
  resourcePreference: ResourcePreference;
}

export interface OpenAIResponse {
  steps: Array<{
    title: string;
    description: string;
    estimatedTime: string;
    resources: Array<{
      title: string;
      type: 'video' | 'article' | 'exercise';
      url: string;
      isPaid: boolean;
    }>;
  }>;
}