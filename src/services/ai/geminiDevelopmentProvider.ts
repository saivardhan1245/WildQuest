import { AIProvider, ProviderHealth } from './types';
import { GenerateQuestParams, GenerateReflectionParams, Quest } from '../../types/quest';
import { buildQuestPrompt, buildReflectionPrompt, validateQuestPayload } from './promptTemplates';

export class GeminiDevelopmentProvider implements AIProvider {
  id = 'gemini-dev';
  name = 'Development Cloud Provider (Gemini)';
  modelIdentifier = 'gemini-2.5-flash';
  description = 'Cloud-based development provider using server proxy for rapid testing and comparisons.';
  isLocal = false;
  isOpenWeight = false;

  async checkAvailability(): Promise<ProviderHealth> {
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        return {
          available: Boolean(data.hasGeminiKey),
          latencyMs: Math.round(performance.now() - start),
          modelName: 'gemini-2.5-flash',
          isLocal: false,
          message: data.hasGeminiKey
            ? 'Server-side development key active.'
            : 'No server GEMINI_API_KEY detected.'
        };
      }
    } catch {
      // Offline or network error
    }

    return {
      available: false,
      isLocal: false,
      message: 'Server development provider offline.'
    };
  }

  async generateQuest(params: GenerateQuestParams): Promise<Quest> {
    const prompt = buildQuestPrompt(params);

    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      throw new Error(`Development provider failed with status ${res.status}`);
    }

    const data = await res.json();
    const parsed = JSON.parse(data.text);
    parsed.generatedByProvider = 'gemini-development (gemini-2.5-flash)';
    return validateQuestPayload(parsed, params);
  }

  async generateReflection(params: GenerateReflectionParams): Promise<string> {
    const prompt = buildReflectionPrompt(params);

    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      throw new Error(`Development provider failed with status ${res.status}`);
    }

    const data = await res.json();
    try {
      const parsed = JSON.parse(data.text);
      return parsed.reflection || data.text;
    } catch {
      return data.text.slice(0, 200);
    }
  }
}
