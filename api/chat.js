import { callGeminiGenerateContent } from '../lib/geminiServer.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY;

  const result = await callGeminiGenerateContent({ message, apiKey });

  if (!result.ok) {
    return res.status(result.status).json(result.json);
  }

  return res.status(200).json(result.json);
}
