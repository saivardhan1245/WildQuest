import { AIProvider } from './types';
import { LocalGemmaProvider } from './localGemmaProvider';
import { OfflineHeuristicProvider } from './offlineHeuristicProvider';
import { GeminiDevelopmentProvider } from './geminiDevelopmentProvider';
import { GenerateQuestParams, GenerateReflectionParams, Quest } from '../../types/quest';

export class ProviderRegistry {
  private localGemma: LocalGemmaProvider;
  private offlineAdaptive: OfflineHeuristicProvider;
  private geminiDev: GeminiDevelopmentProvider;

  constructor() {
    this.localGemma = new LocalGemmaProvider();
    this.offlineAdaptive = new OfflineHeuristicProvider();
    this.geminiDev = new GeminiDevelopmentProvider();
  }

  getProvider(id: string): AIProvider {
    switch (id) {
      case 'local-gemma':
        return this.localGemma;
      case 'gemini-dev':
        return this.geminiDev;
      case 'offline-adaptive':
      default:
        return this.offlineAdaptive;
    }
  }

  getAllProviders(): AIProvider[] {
    return [this.localGemma, this.offlineAdaptive, this.geminiDev];
  }

  updateLocalEndpoint(url: string, model: string) {
    this.localGemma.setEndpoint(url, model);
  }

  async generateQuestWithFallback(
    preferredId: string,
    params: GenerateQuestParams
  ): Promise<{ quest: Quest; usedProviderId: string; fallbackOccurred: boolean }> {
    const preferred = this.getProvider(preferredId);
    
    try {
      const quest = await preferred.generateQuest(params);
      return { quest, usedProviderId: preferred.id, fallbackOccurred: false };
    } catch (err) {
      console.warn(`Provider ${preferredId} failed. Falling back to Offline Adaptive Engine.`, err);
      // Gracefully fall back to on-device adaptive engine
      const fallbackQuest = await this.offlineAdaptive.generateQuest(params);
      fallbackQuest.generatedByProvider = `offline-adaptive (fallback from ${preferred.name})`;
      return { quest: fallbackQuest, usedProviderId: 'offline-adaptive', fallbackOccurred: true };
    }
  }

  async generateReflectionWithFallback(
    preferredId: string,
    params: GenerateReflectionParams
  ): Promise<{ reflection: string; curiosityQuestion?: string; nextMissionSeed?: string; usedProviderId: string }> {
    const preferred = this.getProvider(preferredId);

    try {
      const reflection = await preferred.generateReflection(params);
      return { reflection, usedProviderId: preferred.id };
    } catch (err) {
      console.warn(`Reflection on ${preferredId} failed. Using offline adaptive reflection.`);
      const reflection = await this.offlineAdaptive.generateReflection(params);
      return { reflection, usedProviderId: 'offline-adaptive' };
    }
  }

  async generateCuriositySparkWithFallback(
    preferredId: string,
    observation: string,
    quest: Quest
  ): Promise<{ curiosityQuestion: string; nextMissionSeed: string }> {
    const text = observation.toLowerCase();
    
    // Check if preferred provider is local Gemma or Gemini
    if (preferredId === 'gemini-dev') {
      try {
        const prompt = `A user returned from an outdoor quest titled "${quest.title}".
When asked "What caught your attention?", they answered:
"${observation}"

Generate a short, intriguing natural-world curiosity question AND one crisp follow-up mission seed to investigate it outdoors.
Return ONLY valid raw JSON:
{
  "curiosityQuestion": "Why do [subject of observation] [intriguing biological/physical phenomenon]?",
  "nextMissionSeed": "One concrete action to observe this on their next outdoor walk."
}`;
        const res = await fetch('/api/gemini/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt })
        });
        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data.text);
          if (parsed.curiosityQuestion && parsed.nextMissionSeed) {
            return {
              curiosityQuestion: parsed.curiosityQuestion,
              nextMissionSeed: parsed.nextMissionSeed
            };
          }
        }
      } catch {
        // Fallback to on-device heuristic
      }
    } else if (preferredId === 'local-gemma') {
      try {
        const prompt = `User outdoor observation: "${observation}".
Generate:
1. One biological curiosity question ("Why do...")
2. One follow-up outdoor action.
Return JSON:
{"curiosityQuestion": "...", "nextMissionSeed": "..."}`;
        const res = await fetch('/api/ollama/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, model: 'gemma2:2b' })
        });
        if (res.ok) {
          const data = await res.json();
          const match = data.response?.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (parsed.curiosityQuestion && parsed.nextMissionSeed) {
              return {
                curiosityQuestion: parsed.curiosityQuestion,
                nextMissionSeed: parsed.nextMissionSeed
              };
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    // High quality on-device natural history heuristics
    if (text.includes('ant') || text.includes('bug') || text.includes('insect') || text.includes('crawl')) {
      return {
        curiosityQuestion: 'Why do ants carry materials many times larger than their own body mass?',
        nextMissionSeed: 'Investigate ant foraging highways and track where items are delivered.'
      };
    }
    if (text.includes('leaf') || text.includes('leaves') || text.includes('tree') || text.includes('bark') || text.includes('branch')) {
      return {
        curiosityQuestion: 'How do leaf vein architectures differ between shade-tolerant and sun-loving branches?',
        nextMissionSeed: 'Find two leaves from the same tree at different sunlight levels and compare vein density.'
      };
    }
    if (text.includes('bird') || text.includes('feather') || text.includes('chirp') || text.includes('sing') || text.includes('nest')) {
      return {
        curiosityQuestion: 'How do urban birds adjust their vocalization frequency to cut through human background hum?',
        nextMissionSeed: 'Stand near a street corner and identify which bird calls carry farthest across the block.'
      };
    }
    if (text.includes('moss') || text.includes('fungi') || text.includes('mushroom') || text.includes('lichen') || text.includes('rot')) {
      return {
        curiosityQuestion: 'What micro-climate triggers lichen colonies to establish on the north or shaded aspect of surfaces?',
        nextMissionSeed: 'Check tree bases on opposite sides of a walking path to map lichen coverage.'
      };
    }
    if (text.includes('stone') || text.includes('rock') || text.includes('soil') || text.includes('dirt') || text.includes('mud')) {
      return {
        curiosityQuestion: 'How does soil moisture retention change within three inches of surface rocks?',
        nextMissionSeed: 'Compare soil compactness directly beneath a loose stone versus open exposed ground.'
      };
    }
    if (text.includes('water') || text.includes('puddle') || text.includes('rain') || text.includes('dew') || text.includes('drain')) {
      return {
        curiosityQuestion: 'Where does runoff water linger longest in this landscape to sustain micro-habitats?',
        nextMissionSeed: 'Follow the natural terrain slope to locate the lowest collection hollow.'
      };
    }

    return {
      curiosityQuestion: `What living conditions or historical growth patterns caused "${observation.slice(0, 35)}" to develop right here?`,
      nextMissionSeed: `Search for three nearby physical clues that explain how "${observation.slice(0, 25)}" survives in this habitat.`
    };
  }
}

export const providerRegistry = new ProviderRegistry();
