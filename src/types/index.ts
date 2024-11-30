export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  completed: boolean;
  estimatedTime: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'exercise';
  url: string;
  isPaid: boolean;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  steps: RoadmapStep[];
  progress: number;
  resourcePreference: ResourcePreference;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TimeFrame {
  id: string;
  title: string;
  months: number | null;
}

export type ResourcePreference = 'free' | 'paid' | 'both';