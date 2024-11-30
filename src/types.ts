export interface Resource {
  title: string;
  type: 'video' | 'article' | 'exercise';
  url: string;
  isPaid: boolean;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  resources: Resource[];
  completed: boolean;
  order: number;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  steps: RoadmapStep[];
  progress: number;
  resourcePreference: 'free' | 'paid' | 'both';
}

export type ResourcePreference = 'free' | 'paid' | 'both'; 