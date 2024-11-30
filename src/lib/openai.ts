import OpenAI from 'openai';
import { RoadmapStep, ResourcePreference } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const SYSTEM_PROMPT = `You are an expert learning path creator. Your task is to create detailed, structured learning roadmaps.
Follow these guidelines:

1. Break down the learning path into clear, manageable steps
2. Each step should have:
   - A clear title
   - A detailed description
   - Estimated time to complete
   - Relevant learning resources (URLs to actual content)
3. Resources should be high-quality and match the user's preference (free/paid/both)
4. Steps should be in logical progression from basics to advanced
5. Include practical exercises and projects
6. Consider the specified timeframe when creating steps

Return the response in this exact JSON format:
{
  "steps": [
    {
      "title": "string",
      "description": "string",
      "estimatedTime": "string",
      "resources": [
        {
          "title": "string",
          "type": "video" | "article" | "exercise",
          "url": "string",
          "isPaid": boolean
        }
      ]
    }
  ]
}`;

interface GenerateRoadmapParams {
  topic: string;
  months: number;
  resourcePreference: ResourcePreference;
}

export async function generateRoadmap({ 
  topic, 
  months, 
  resourcePreference 
}: GenerateRoadmapParams): Promise<RoadmapStep[]> {
  try {
    const userPrompt = `Create a ${months}-month learning roadmap for ${topic}.
Resource preference: ${resourcePreference} resources only.
Include specific, real-world resources (URLs) that match this preference.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content);
    return parsed.steps.map((step: any) => ({
      ...step,
      id: crypto.randomUUID(),
      completed: false
    }));
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw new Error('Failed to generate roadmap. Please try again.');
  }
}