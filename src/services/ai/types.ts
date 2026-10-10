import { GenerateQuestParams, GenerateReflectionParams, Quest } from '../../types/quest';

export interface ProviderHealth {
  available: boolean;
  latencyMs?: number;
  modelName?: string;
  message?: string;
  isLocal: boolean;
}

export interface AIProvider {
  id: string;
  name: string;
  modelIdentifier: string;
  description: string;
  isLocal: boolean;
  isOpenWeight: boolean;
  checkAvailability(): Promise<ProviderHealth>;
  generateQuest(params: GenerateQuestParams): Promise<Quest>;
  generateReflection(params: GenerateReflectionParams): Promise<string>;
}
