import OpenAI from 'openai';
import { Handler } from '@netlify/functions';

const OPENAI_CONFIG = {
  model: "gpt-4-1106-preview",
  temperature: 0.7
};

const SYSTEM_PROMPT = `You are an expert learning path creator. Your task is to create detailed, structured learning roadmaps.
You must ALWAYS respond with valid JSON only, no other text or explanation.

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

IMPORTANT: Your response must be ONLY valid JSON in this exact format, with no additional text:
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

const generateUserPrompt = (topic: string, months: number, resourcePreference: string) => `
Create a ${months}-month learning roadmap for ${topic}.
Resource preference: ${resourcePreference} resources only.
Include specific, real-world resources (URLs) that match this preference.

Remember: Respond with ONLY the JSON object, no other text.`;

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { topic, months, resourcePreference } = JSON.parse(event.body || '{}');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      ...OPENAI_CONFIG,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: generateUserPrompt(topic, months, resourcePreference) }
      ]
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    let parsedResponse;
    try {
      // Remove any potential markdown code block syntax
      const cleanedContent = responseContent.replace(/```json\n?|\n?```/g, '').trim();
      parsedResponse = JSON.parse(cleanedContent);
      if (!parsedResponse.steps || !Array.isArray(parsedResponse.steps)) {
        throw new Error('Invalid response format: missing steps array');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Failed to parse OpenAI response');
    }
    
    // Validate resources
    parsedResponse.steps.forEach((step: any, stepIndex: number) => {
      if (!Array.isArray(step.resources)) {
        throw new Error(`Step ${stepIndex + 1} is missing resources array`);
      }
      step.resources.forEach((resource: any, resourceIndex: number) => {
        if (typeof resource.isPaid !== 'boolean') {
          throw new Error(`Resource ${resourceIndex + 1} in step ${stepIndex + 1} is missing required fields: isPaid`);
        }
        if (!resource.type || !['video', 'article', 'exercise'].includes(resource.type)) {
          throw new Error(`Resource ${resourceIndex + 1} in step ${stepIndex + 1} has invalid type`);
        }
        if (!resource.url || typeof resource.url !== 'string') {
          throw new Error(`Resource ${resourceIndex + 1} in step ${stepIndex + 1} is missing valid URL`);
        }
      });
    });

    const response = {
      steps: parsedResponse.steps,
      metadata: {
        topic,
        months,
        resourcePreference,
        totalSteps: parsedResponse.steps.length,
        generationTime: 0,
        model: OPENAI_CONFIG.model
      }
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(response)
    };
  } catch (error: unknown) {
    console.error('Error generating roadmap:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      })
    };
  }
};

export { handler }; 