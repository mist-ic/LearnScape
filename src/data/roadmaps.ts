import { Roadmap } from '../types';
import { generateId } from '../lib/utils';

export const webDevelopmentRoadmap: Roadmap = {
  id: generateId(),
  title: 'Web Development Fundamentals',
  description: 'Master the core concepts of web development from HTML to React',
  timeframe: '6 months',
  progress: 0,
  steps: [
    {
      id: generateId(),
      title: 'HTML & CSS Basics',
      description: 'Learn the fundamentals of HTML5 and CSS3',
      completed: false,
      estimatedTime: '2 weeks',
      resources: [
        {
          id: generateId(),
          title: 'MDN Web Docs - HTML',
          type: 'article',
          url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML'
        },
        {
          id: generateId(),
          title: 'CSS Crash Course',
          type: 'video',
          url: 'https://www.youtube.com/watch?v=yfoY53QXEnI'
        }
      ]
    },
    {
      id: generateId(),
      title: 'JavaScript Fundamentals',
      description: 'Master core JavaScript concepts and ES6+ features',
      completed: false,
      estimatedTime: '4 weeks',
      resources: [
        {
          id: generateId(),
          title: 'JavaScript.info',
          type: 'article',
          url: 'https://javascript.info/'
        },
        {
          id: generateId(),
          title: 'JavaScript Exercises',
          type: 'exercise',
          url: 'https://www.codewars.com/kata/search/javascript'
        }
      ]
    },
    {
      id: generateId(),
      title: 'React Basics',
      description: 'Learn React fundamentals and hooks',
      completed: false,
      estimatedTime: '6 weeks',
      resources: [
        {
          id: generateId(),
          title: 'React Documentation',
          type: 'article',
          url: 'https://react.dev/'
        },
        {
          id: generateId(),
          title: 'Build a React App',
          type: 'exercise',
          url: 'https://react.dev/learn/tutorial-tic-tac-toe'
        }
      ]
    }
  ]
};

export const pythonRoadmap: Roadmap = {
  id: generateId(),
  title: 'Python Programming',
  description: 'Learn Python from basics to advanced concepts',
  timeframe: '4 months',
  progress: 0,
  steps: [
    {
      id: generateId(),
      title: 'Python Basics',
      description: 'Learn Python syntax and basic programming concepts',
      completed: false,
      estimatedTime: '3 weeks',
      resources: [
        {
          id: generateId(),
          title: 'Python for Beginners',
          type: 'article',
          url: 'https://docs.python.org/3/tutorial/'
        },
        {
          id: generateId(),
          title: 'Python Exercises',
          type: 'exercise',
          url: 'https://www.practicepython.org/'
        }
      ]
    },
    {
      id: generateId(),
      title: 'Data Structures',
      description: 'Master Python data structures and algorithms',
      completed: false,
      estimatedTime: '4 weeks',
      resources: [
        {
          id: generateId(),
          title: 'Python Data Structures',
          type: 'article',
          url: 'https://realpython.com/python-data-structures/'
        },
        {
          id: generateId(),
          title: 'Algorithm Challenges',
          type: 'exercise',
          url: 'https://leetcode.com/problemset/all/?difficulty=EASY&page=1&languageTags=python'
        }
      ]
    }
  ]
};

export const defaultRoadmaps = [webDevelopmentRoadmap, pythonRoadmap];