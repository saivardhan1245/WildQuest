import { AIProvider, ProviderHealth } from './types';
import { GenerateQuestParams, GenerateReflectionParams, Quest } from '../../types/quest';
import { buildQuestPrompt, buildReflectionPrompt, validateQuestPayload } from './promptTemplates';

export class LocalGemmaProvider implements AIProvider {
  id = 'local-gemma';
  name = 'Local Gemma (Open-Weight)';
  modelIdentifier = 'gemma2:2b';
  description = 'Local on-device inference using Google’s open-weight Gemma 2 model via Ollama/Local Runner. 100% private.';
  isLocal = true;
  isOpenWeight = true;

  private ollamaUrl: string;
  private modelName: string;

  constructor(ollamaUrl = 'http://127.0.0.1:11434', modelName = 'gemma2:2b') {
    this.ollamaUrl = ollamaUrl;
    this.modelName = modelName;
  }

  setEndpoint(url: string, model: string) {
    this.ollamaUrl = url;
    this.modelName = model;
  }

  async checkAvailability(): Promise<ProviderHealth> {
    const start = performance.now();
    try {
      // First try via backend proxy endpoint to avoid CORS issues
      const res = await fetch(`/api/ollama/status?url=${encodeURIComponent(this.ollamaUrl)}`);
      if (res.ok) {
        const data = await res.json();
        const latencyMs = Math.round(performance.now() - start);
        if (data.available) {
          return {
            available: true,
            latencyMs,
            modelName: data.models?.find((m: string) => m.includes('gemma')) || this.modelName,
            isLocal: true,
            message: `Connected to local Ollama (${this.modelName} ready)`
          };
        }
      }
    } catch {
      // Proxy failed or backend unreachable
    }

    // Direct browser attempt
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${this.ollamaUrl}/api/tags`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        return {
          available: true,
          latencyMs: Math.round(performance.now() - start),
          modelName: this.modelName,
          isLocal: true,
          message: 'Direct local connection verified.'
        };
      }
    } catch {
      // Not reachable directly
    }

    return {
      available: false,
      latencyMs: Math.round(performance.now() - start),
      modelName: this.modelName,
      isLocal: true,
      message: `Local Gemma runner not detected at ${this.ollamaUrl}. Run 'ollama run gemma2:2b' in your terminal, or switch to the Offline Adaptive Engine.`
    };
  }

  async generateQuest(params: GenerateQuestParams): Promise<Quest> {
    const prompt = buildQuestPrompt(params);

    try {
      // Query through proxy endpoint
      const res = await fetch('/api/ollama/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: this.modelName,
          ollamaUrl: this.ollamaUrl
        })
      });

      if (!res.ok) {
        throw new Error(`Local inference returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const rawText = data.response || '';
      
      // Extract JSON if wrapped in backticks or text
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        parsed.generatedByProvider = `local-gemma (${this.modelName})`;
        return validateQuestPayload(parsed, params);
      }
    } catch (err: any) {
      console.warn('Local Gemma call failed, using graceful fallback:', err);
    }

    throw new Error('Local Gemma generation failed. Please verify that Ollama is running.');
  }

  async generateReflection(params: GenerateReflectionParams): Promise<string> {
    const prompt = buildReflectionPrompt(params);

    try {
      const res = await fetch('/api/ollama/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model: this.modelName,
          ollamaUrl: this.ollamaUrl
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.response || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.reflection) return parsed.reflection;
        }
        return rawText.slice(0, 200).trim();
      }
    } catch (err: any) {
      console.warn('Local Gemma reflection failed:', err);
    }

    throw new Error('Local Gemma reflection failed.');
  }
}
