import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Path to compiled production distribution
const distPath = path.resolve(__dirname, 'dist');
const hasDist = fs.existsSync(path.resolve(distPath, 'index.html'));

// Environment mode
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Permissive CORS and iframe headers for AI Studio preview
app.use((req: Request, res: Response, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    gemmaLocalRecommended: 'gemma2:2b',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
  });
});

// Local Ollama / Gemma connection test
app.get('/api/ollama/status', async (req: Request, res: Response) => {
  const ollamaUrl = (req.query.url as string) || 'http://127.0.0.1:11434';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const response = await fetch(`${ollamaUrl}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    
    if (response.ok) {
      const data = await response.json();
      const models = (data.models || []).map((m: any) => m.name);
      const hasGemma = models.some((m: string) => m.toLowerCase().includes('gemma'));
      return res.json({
        available: true,
        url: ollamaUrl,
        models,
        hasGemma,
        recommendedModel: 'gemma2:2b'
      });
    }
  } catch (err: any) {
    // Expected when Ollama is not running on localhost
  }
  
  res.json({
    available: false,
    url: ollamaUrl,
    message: 'Local Ollama/Gemma not detected on port 11434. Fallback engines ready.'
  });
});

// Proxy / Relay for Local Ollama to avoid CORS issues in browsers
app.post('/api/ollama/generate', async (req: Request, res: Response) => {
  const { prompt, model = 'gemma2:2b', ollamaUrl = 'http://127.0.0.1:11434' } = req.body;
  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.7,
          top_p: 0.9
        }
      })
    });

    if (!response.ok) {
      return res.status(502).json({ error: `Local Ollama returned status ${response.status}` });
    }

    const data = await response.json();
    return res.json({
      response: data.response,
      model: data.model,
      done: data.done
    });
  } catch (err: any) {
    return res.status(503).json({
      error: 'Cannot connect to local Ollama instance',
      details: err.message
    });
  }
});

// Server-side Gemini API provider fallback (when user wants development provider)
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ error: 'GEMINI_API_KEY not configured in server environment' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    return res.json({
      text: response.text,
      provider: 'gemini-development'
    });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Gemini inference failed',
      details: err.message
    });
  }
});

// Boot production static server or local Vite dev middleware
async function startServer() {
  if (isProd) {
    console.log(`[WildQuest] Serving production build from ${distPath}`);

    // Explicitly return 404 for /@vite/client in production so no Vite dev client is exposed or loaded
    app.get('/@vite/client', (req: Request, res: Response) => {
      res.status(404).send('Vite client disabled in production');
    });

    // Never cache service worker so updates or fixes are immediate
    app.get('/sw.js', (req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.sendFile(path.resolve(distPath, 'sw.js'));
    });

    // Helper to find latest compiled JS & CSS bundle in dist/assets
    const getLatestBundles = () => {
      const assetsDir = path.resolve(distPath, 'assets');
      if (!fs.existsSync(assetsDir)) return { js: null, css: null };
      const files = fs.readdirSync(assetsDir);
      const jsFile = files.find((f) => f.startsWith('index-') && f.endsWith('.js'));
      const cssFile = files.find((f) => f.startsWith('index-') && f.endsWith('.css'));
      return {
        js: jsFile ? path.resolve(assetsDir, jsFile) : null,
        css: cssFile ? path.resolve(assetsDir, cssFile) : null
      };
    };

    // Stale asset fallback: if a cached browser requests an older bundle hash,
    // serve the latest JavaScript bundle rather than returning HTML (which triggers SyntaxError)
    app.get('/assets/*.js', (req: Request, res: Response) => {
      const targetFile = path.resolve(distPath, '.' + req.path);
      if (fs.existsSync(targetFile)) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        return res.sendFile(targetFile);
      }
      const { js } = getLatestBundles();
      if (js && fs.existsSync(js)) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        return res.sendFile(js);
      }
      res.status(404).type('text/plain').send('JavaScript asset not found');
    });

    app.get('/assets/*.css', (req: Request, res: Response) => {
      const targetFile = path.resolve(distPath, '.' + req.path);
      if (fs.existsSync(targetFile)) {
        res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        return res.sendFile(targetFile);
      }
      const { css } = getLatestBundles();
      if (css && fs.existsSync(css)) {
        res.setHeader('Content-Type', 'text/css; charset=UTF-8');
        return res.sendFile(css);
      }
      res.status(404).type('text/plain').send('CSS asset not found');
    });

    // Serve static compiled assets
    app.use(express.static(distPath, { maxAge: '1y', index: false }));

    // SPA fallback: send production index.html with no-cache so browsers always get fresh asset hashes
    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/assets/')) {
        return res.status(404).type('text/plain').send('Asset not found');
      }
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    console.log(`[WildQuest] Starting local Vite dev middleware`);
    const { createServer } = await import('vite');
    const enableHmr = process.env.ENABLE_HMR === 'true';
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: enableHmr ? true : false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WildQuest server running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
