export const OPENAI_CONFIG = {
  model: "gpt-4",
  temperature: 0.7,
  max_tokens: 2000
} as const;

export const API_CONFIG = {
  baseURL: "https://api.openai.com/v1",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
  }
} as const;