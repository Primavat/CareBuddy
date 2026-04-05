import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { callGeminiGenerateContent } from './lib/geminiServer.js';

function carebuddyChatApiPlugin(env) {
  return {
    name: 'carebuddy-chat-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split('?')[0];
        if (path !== '/api/chat' || req.method !== 'POST') {
          return next();
        }

        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', async () => {
          let body = {};
          try {
            const raw = Buffer.concat(chunks).toString('utf8');
            body = raw ? JSON.parse(raw) : {};
          } catch {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            return;
          }

          const apiKey =
            env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';

          const result = await callGeminiGenerateContent({
            message: body.message,
            apiKey,
          });

          res.statusCode = result.ok ? 200 : result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.json));
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), carebuddyChatApiPlugin(env)],
  };
});
