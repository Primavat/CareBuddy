/**
 * Shared Gemini REST call for Vercel `/api/chat` and Vite dev middleware.
 * Keeps the API key off the browser (client-side keys often return 400 when restricted/invalid).
 */

export const DEFAULT_CAREBOT_SYSTEM_INSTRUCTION =
  'Your name is CareBot. You are a friendly, professional, and knowledgeable medical assistant for the CareBuddy app. Provide concise, helpful, and empathetic health advice. Always remind the user to consult a professional for serious concerns.';

export const GEMINI_REST_MODEL = 'gemini-2.0-flash';

/**
 * @param {{ message: string, apiKey: string, systemInstruction?: string }} params
 * @returns {Promise<{ ok: true, json: { reply: string } } | { ok: false, status: number, json: Record<string, unknown> }>}
 */
export async function callGeminiGenerateContent({
  message,
  apiKey,
  systemInstruction = DEFAULT_CAREBOT_SYSTEM_INSTRUCTION,
}) {
  const text = typeof message === 'string' ? message.trim() : '';
  if (!text) {
    return { ok: false, status: 400, json: { error: 'message is required' } };
  }
  if (!apiKey || typeof apiKey !== 'string') {
    return {
      ok: false,
      status: 500,
      json: { error: 'GEMINI_API_KEY is not configured on the server' },
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_REST_MODEL}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg =
        data?.error?.message ||
        `Gemini HTTP ${response.status} ${response.statusText || ''}`.trim();
      return {
        ok: false,
        status: response.status >= 400 && response.status < 600 ? response.status : 502,
        json: { error: msg },
      };
    }

    if (data.error) {
      return {
        ok: false,
        status: 500,
        json: { error: String(data.error.message || 'Gemini error') },
      };
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      return {
        ok: false,
        status: 500,
        json: { error: 'Empty model response' },
      };
    }

    return { ok: true, json: { reply } };
  } catch (e) {
    return {
      ok: false,
      status: 500,
      json: { error: e instanceof Error ? e.message : 'Request failed' },
    };
  }
}
