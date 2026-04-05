/**
 * Calls the server-side `/api/chat` route (Vercel in production, Vite middleware in dev).
 * The browser never sends your Google API key to clients — avoids 400s from invalid/restricted client keys.
 */
export async function requestGeminiReply(message) {
  const text = typeof message === 'string' ? message.trim() : '';
  if (!text) {
    throw new Error('Message is empty');
  }

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text }),
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Invalid response from chat server');
  }

  if (!res.ok) {
    const err = typeof data?.error === 'string' ? data.error : `Request failed (${res.status})`;
    throw new Error(err);
  }

  if (typeof data?.reply !== 'string' || !data.reply) {
    throw new Error('Empty reply from server');
  }

  return data.reply;
}
