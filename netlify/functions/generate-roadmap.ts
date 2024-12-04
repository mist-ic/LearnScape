import OpenAI from 'openai';
import { Handler } from '@netlify/functions';

const OPENAI_CONFIG = {
  model: 'gpt-3.5-turbo-1106',
  temperature: 0.2,
  max_tokens: 1000,
  top_p: 0.95,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  response_format: { type: "json_object" }
};

const SYSTEM_PROMPT = `You are a JSON-focused API that creates learning roadmaps.
Your ONLY role is to return a perfectly formatted JSON object.
You must NEVER include any explanatory text before or after the JSON.

Create a concise roadmap with these rules:
1. 3-5 steps maximum
2. Each step should be brief but clear
3. 1-2 resources per step maximum
4. Keep descriptions under 100 characters
5. Focus on core concepts only

The response must exactly match this structure:
{
  "steps": [
    {
      "title": "string",
      "description": "string",
      "estimatedTime": "string",
      "resources": [
        {
          "title": "string",
          "type": "video",
          "url": "string",
          "isPaid": false
        }
      ]
    }
  ]
}`;

const generateUserPrompt = (topic: string, months: number, resourcePreference: string) => `
Create a ${months}-month learning roadmap for ${topic}.
Include ${resourcePreference === 'both' ? 'both free and paid' : resourcePreference} resources only.
Keep it simple and focused on core concepts.`.trim();

const generateId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
};

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
      parsedResponse = JSON.parse(responseContent.trim());
      if (!parsedResponse.steps || !Array.isArray(parsedResponse.steps)) {
        throw new Error('Invalid response format: missing steps array');
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseContent);
      throw new Error('Failed to parse OpenAI response');
    }
    
    // Process steps with minimal validation
    const processedSteps = parsedResponse.steps.map((step: any) => ({
      ...step,
      id: generateId(),
      completed: false
    }));

    const response = {
      steps: processedSteps,
      metadata: {
        topic,
        months,
        resourcePreference,
        totalSteps: processedSteps.length,
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