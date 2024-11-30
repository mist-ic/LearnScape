import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';
import path from 'path';
import { OPENAI_CONFIG, OPENAI_PROMPTS } from './config/openai';

// Load environment variables from the project root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const apiKey = process.env.VITE_OPENAI_API_KEY;
console.log('API Key available:', !!apiKey);

if (!apiKey) {
  throw new Error('OpenAI API key is missing. Please check your .env file.');
}

const openai = new OpenAI({
  apiKey: apiKey
});

interface RoadmapRequest {
  topic: string;
  months: number;
  resourcePreference: 'free' | 'paid' | 'both';
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

function tryParseJSON(text: string): any {
  try {
    // Remove any potential BOM or whitespace
    const cleanText = text.trim().replace(/^\uFEFF/, '');
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Raw response:', text);
    console.error('JSON parse error:', error);
    throw new Error(`Invalid JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function validateStep(step: any, index: number): void {
  const requiredFields = ['title', 'description', 'estimatedTime', 'resources', 'order'];
  const missingFields = requiredFields.filter(field => !step[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Step ${index + 1} is missing required fields: ${missingFields.join(', ')}`);
  }

  if (!Array.isArray(step.resources)) {
    throw new Error(`Step ${index + 1} resources must be an array`);
  }

  step.resources.forEach((resource: any, resIndex: number) => {
    const requiredResourceFields = ['title', 'type', 'url', 'isPaid'];
    const missingResourceFields = requiredResourceFields.filter(field => !resource[field]);
    
    if (missingResourceFields.length > 0) {
      throw new Error(`Resource ${resIndex + 1} in step ${index + 1} is missing required fields: ${missingResourceFields.join(', ')}`);
    }

    if (!['video', 'article', 'exercise'].includes(resource.type)) {
      throw new Error(`Resource ${resIndex + 1} in step ${index + 1} has invalid type: ${resource.type}`);
    }

    if (typeof resource.isPaid !== 'boolean') {
      throw new Error(`Resource ${resIndex + 1} in step ${index + 1} has invalid isPaid value: ${resource.isPaid}`);
    }
  });
}

function fixResource(resource: any): any {
  // Ensure isPaid is a boolean
  if (typeof resource.isPaid === 'undefined') {
    // Default to false if not specified
    resource.isPaid = false;
  } else if (typeof resource.isPaid === 'string') {
    // Convert string 'true'/'false' to boolean
    resource.isPaid = resource.isPaid.toLowerCase() === 'true';
  }

  // Ensure type is valid
  if (!['video', 'article', 'exercise'].includes(resource.type)) {
    resource.type = 'article';
  }

  // Ensure URL starts with https://
  if (resource.url && !resource.url.startsWith('https://')) {
    resource.url = `https://${resource.url.replace(/^http:\/\//, '')}`;
  }

  return resource;
}

function fixStep(step: any): any {
  // Fix resources array
  if (Array.isArray(step.resources)) {
    step.resources = step.resources.map(fixResource);
  } else {
    step.resources = [];
  }

  // Ensure order is a number
  if (typeof step.order === 'string') {
    step.order = parseInt(step.order, 10);
  }

  return step;
}

function fixResponse(content: string): any {
  try {
    // Clean the content
    const cleanContent = content.trim()
      .replace(/^\uFEFF/, '') // Remove BOM
      .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas

    // Parse the JSON
    const parsed = JSON.parse(cleanContent);

    // Fix each step
    if (parsed.steps && Array.isArray(parsed.steps)) {
      parsed.steps = parsed.steps.map(fixStep);
    }

    return parsed;
  } catch (error) {
    console.error('Error fixing response:', error);
    throw error;
  }
}

// Roadmap generation endpoint
app.post('/api/generate-roadmap', async (req, res) => {
  const startTime = Date.now();
  try {
    const { topic, months, resourcePreference } = req.body;
    
    const completion = await openai.chat.completions.create({
      ...OPENAI_CONFIG,
      messages: [
        { role: 'system', content: OPENAI_PROMPTS.system },
        { role: 'user', content: OPENAI_PROMPTS.generateUserPrompt(topic, months, resourcePreference) }
      ]
    });

    console.log('Raw OpenAI Response:', JSON.stringify(completion, null, 2));
    console.log('Response Content:', completion.choices[0]?.message?.content);

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    try {
      const parsedResponse = JSON.parse(responseContent);
      console.log('Parsed Response:', JSON.stringify(parsedResponse, null, 2));
      
      // Validate resources
      parsedResponse.steps.forEach((step: any, stepIndex: number) => {
        step.resources.forEach((resource: any, resourceIndex: number) => {
          if (typeof resource.isPaid !== 'boolean') {
            console.log(`Invalid isPaid at step ${stepIndex + 1}, resource ${resourceIndex + 1}:`, resource);
            throw new Error(`Resource ${resourceIndex + 1} in step ${stepIndex + 1} is missing required fields: isPaid`);
          }
        });
      });

      const endTime = Date.now();
      const response = {
        steps: parsedResponse.steps,
        metadata: {
          topic,
          months,
          resourcePreference,
          totalSteps: parsedResponse.steps.length,
          generationTime: endTime - startTime,
          model: OPENAI_CONFIG.model
        }
      };

      res.json(response);
    } catch (error: unknown) {
      console.error('Failed to parse response:', error);
      console.error('Raw content that failed to parse:', responseContent);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unknown parsing error';
        
      throw new Error(`Failed to parse OpenAI response: ${errorMessage}`);
    }
  } catch (error: unknown) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 