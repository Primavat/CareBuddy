import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Prefer VITE_GEMINI_API_KEY in .env (Vite exposes only VITE_* vars to the client).
 * The legacy gemini-1.5-flash model id often yields 400/404 from the API; use a current id.
 */
const API_KEY = String(
  import.meta.env.VITE_GEMINI_API_KEY ??
    'AIzaSyB7H5bhn8y8Z4Ah-vTCqnMNWVw6ovxTrDs'
).trim();

export const GEMINI_CHAT_MODEL = 'gemini-2.0-flash';

export function getGeminiGenerativeModel(overrides = {}) {
  if (!API_KEY) {
    throw new Error('Missing Gemini API key. Set VITE_GEMINI_API_KEY in your environment.');
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({
    model: GEMINI_CHAT_MODEL,
    ...overrides,
  });
}
