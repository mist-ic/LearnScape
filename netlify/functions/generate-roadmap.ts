import OpenAI from 'openai';
import { Handler } from '@netlify/functions';
import { OPENAI_CONFIG, OPENAI_PROMPTS } from '../../src/server/config/openai';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { topic, months, resourcePreference } = JSON.parse(event.body || '{}');
    
    if (!process.env.VITE_OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing');
    }

    const openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      ...OPENAI_CONFIG,
      messages: [
        { role: 'system', content: OPENAI_PROMPTS.system },
        { role: 'user', content: OPENAI_PROMPTS.generateUserPrompt(topic, months, resourcePreference) }
      ]
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    const parsedResponse = JSON.parse(responseContent);
    
    // Validate resources
    parsedResponse.steps.forEach((step: any, stepIndex: number) => {
      step.resources.forEach((resource: any, resourceIndex: number) => {
        if (typeof resource.isPaid !== 'boolean') {
          throw new Error(`Resource ${resourceIndex + 1} in step ${stepIndex + 1} is missing required fields: isPaid`);
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
        generationTime: 0, // We don't track this in serverless function
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