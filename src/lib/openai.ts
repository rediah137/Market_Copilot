import { OpenAI } from 'openai';

// Validate API key
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OpenAI API key is missing. Please check your .env file.');
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

export default openai;