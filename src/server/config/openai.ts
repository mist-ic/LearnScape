import { ChatCompletionCreateParams } from 'openai/resources/chat';

export const OPENAI_CONFIG = {
  model: 'gpt-4o-mini' as const,
  temperature: 0.2,
  max_tokens: 2000,
  top_p: 0.95,
  frequency_penalty: 0.0,
  presence_penalty: 0.0
} satisfies Partial<ChatCompletionCreateParams>;

export const OPENAI_PROMPTS = {
  system: `You are a JSON-focused API that creates learning roadmaps.
Your ONLY role is to return a perfectly formatted JSON object.
You must NEVER include any explanatory text before or after the JSON.
Start your response with '{' and end with '}'.

Follow these strict formatting rules:

1. Use DOUBLE QUOTES for ALL strings (never single quotes)
2. NO trailing commas in arrays or objects
3. NO extra spaces in property names
4. ALL property names must be in double quotes
5. URLs must be complete and properly quoted
6. Boolean values must be exactly true or false (no quotes)
7. Numbers must be without quotes
8. NO comments or additional text

The response must exactly match this structure:
{
  "steps": [
    {
      "title": "Example Step",
      "description": "Example description",
      "estimatedTime": "1 week",
      "resources": [
        {
          "title": "Example Resource",
          "type": "video",
          "url": "https://example.com/resource",
          "isPaid": false
        }
      ],
      "order": 1
    }
  ]
}

CRITICAL RULES:
- Resource "type" must be exactly one of: "video", "article", "exercise"
- "isPaid" must be exactly: true or false (not strings)
- "order" must be a number without quotes
- All URLs must start with "http://" or "https://"`,

  generateUserPrompt: (topic: string, months: number, resourcePreference: 'free' | 'paid' | 'both') => `
Create a ${months}-month learning roadmap for ${topic} with these requirements:

1. Include ${resourcePreference === 'both' ? 'both free and paid' : resourcePreference} resources
2. Total time must be ${months} months
3. Each step needs 2-3 resources from established platforms
4. Resources must include:
   - Main tutorial/course
   - Practice exercises
   - Documentation/reference

FORMATTING REQUIREMENTS:
1. Return ONLY the JSON object
2. Start with '{' and end with '}'
3. Use double quotes for ALL strings
4. No trailing commas
5. Boolean true/false without quotes
6. Numbers without quotes
7. Complete URLs starting with http:// or https://
`.trim()
}; 