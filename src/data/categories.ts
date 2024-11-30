import { Category, Skill, TimeFrame } from '../types';

export const timeFrames: TimeFrame[] = [
  { id: '3m', title: '3 Months', months: 3 },
  { id: '6m', title: '6 Months', months: 6 },
  { id: '12m', title: '12 Months', months: 12 },
  { id: 'custom', title: 'Custom Duration', months: null },
];

export const categories: Category[] = [
  {
    id: 'software',
    title: 'Software Development',
    description: 'Learn programming languages and software development skills',
    skills: [
      {
        id: 'python',
        title: 'Python',
        description: 'General-purpose programming language',
        icon: '🐍',
      },
      {
        id: 'javascript',
        title: 'JavaScript',
        description: 'Web development and programming',
        icon: '⚡',
      },
      {
        id: 'react',
        title: 'React',
        description: 'Frontend web development',
        icon: '⚛️',
      },
    ],
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Develop business and entrepreneurship skills',
    skills: [
      {
        id: 'marketing',
        title: 'Digital Marketing',
        description: 'Learn modern marketing strategies',
        icon: '📈',
      },
      {
        id: 'management',
        title: 'Project Management',
        description: 'Master project management methodologies',
        icon: '📊',
      },
    ],
  },
  {
    id: 'design',
    title: 'Design',
    description: 'Master design tools and principles',
    skills: [
      {
        id: 'ui-design',
        title: 'UI Design',
        description: 'Create beautiful user interfaces',
        icon: '🎨',
      },
      {
        id: 'ux-design',
        title: 'UX Design',
        description: 'Design great user experiences',
        icon: '🎯',
      },
    ],
  },
];