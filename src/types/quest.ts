export type QuestDuration = 20 | 30 | 45 | 60;

export type QuestEnvironment = 'park' | 'neighborhood' | 'garden' | 'trail' | 'anywhere';

export type QuestDifficulty = 'beginner' | 'explorer' | 'challenge';

export type ProgressionStage = 'observe' | 'learn' | 'explore_deeper';

export type DiscoveryCategory =
  | 'flora'
  | 'fauna'
  | 'geology'
  | 'fungi'
  | 'water_weather'
  | 'urban_nature'
  | 'other';

export interface DiscoveryRecord {
  id: string;
  text: string;
  category: DiscoveryCategory;
  categoryLabel: string;
  photoUrl?: string; // local base64 or blob URL
  environment: QuestEnvironment;
  recordedAt: string;
  turnedIntoQuestId?: string;
  questTitleSpawned?: string;
}

export interface CuriosityChainItem {
  id: string;
  questId: string;
  questTitle: string;
  userObservation: string; // User answer to "What caught your attention?"
  curiosityQuestion: string; // Deep biological/ecological question
  nextMissionSeed: string; // Follow-up outdoor mission spark
  createdAt: string;
  followedIntoQuestId?: string;
}

export type QuestCategory =
  | 'nature_detective'
  | 'movement'
  | 'sensory'
  | 'biodiversity'
  | 'photography'
  | 'mindful_observation'
  | 'neighborhood_discovery'
  | 'social'
  | 'garden'
  | 'weather_seasonal';

export interface Quest {
  id: string;
  title: string;
  durationMinutes: QuestDuration;
  category: QuestCategory;
  categoryLabel: string;
  difficulty: QuestDifficulty;
  environment: QuestEnvironment;
  mission: string; // Punchy one-sentence primary mission
  steps: string[]; // 4-6 concrete observation/action items
  constraints: string; // e.g. "Take no more than 3 photos. Return when your timer ends."
  safetyNote: string;
  returnPrompt: string;
  reflectionQuestions: string[];
  generatedByProvider: string;
  createdAt: string;
  // Signature Features
  isMysteryQuest?: boolean;
  mysteryTeaser?: {
    durationRange: string;
    environmentLabel: string;
  };
  progressionStage?: ProgressionStage;
  branchedFromDiscoveryId?: string;
  branchedFromDiscoveryText?: string;
  curiositySeed?: string;
  adaptationReason?: string; // Transparent statement of what real data influenced this quest
}

export interface CompletedQuest {
  id: string;
  quest: Quest;
  completedAt: string;
  durationCompletedMinutes: number;
  completionStatus: 'completed' | 'partial' | 'alternative_discovery';
  userNote?: string;
  voiceNoteUrl?: string;
  photos: string[]; // base64 or blob data URLs (stored locally)
  difficultyFeedback: 'easier' | 'just_right' | 'harder' | 'different';
  aiReflection: string;
  nextAdaptiveFocus?: string;
  // Curiosity Chain & Progression
  curiosityObservation?: string; // What caught user's attention
  curiosityQuestion?: string;    // Deep inquiry generated from user's real answer
  nextMissionSeed?: string;      // Next quest proposal
  progressionStage?: ProgressionStage;
  verifiedPlaceName?: string;    // Explicitly allowed by user
}

export interface UserProfile {
  totalMinutesOutside: number;
  completedQuests: CompletedQuest[];
  streakDays: number;
  lastActiveDate?: string;
  environmentsExplored: Record<QuestEnvironment, number>;
  categoriesExplored: Record<QuestCategory, number>;
  discoveriesCount: number;
  contrastMode: 'natural' | 'sunlight' | 'eink';
  audioCuesEnabled: boolean;
  activeProviderId: 'local-gemma' | 'offline-adaptive' | 'gemini-dev';
  localOllamaUrl: string;
  localOllamaModel: string;
  // Signature Features real storage
  discoveries: DiscoveryRecord[];
  curiosityChain: CuriosityChainItem[];
  verifiedPlaces: string[];
  currentProgressionStage: ProgressionStage;
}

export interface GenerateQuestParams {
  duration: QuestDuration;
  environment: QuestEnvironment;
  difficulty: QuestDifficulty;
  category?: QuestCategory;
  userProfile: UserProfile;
  notes?: string;
  // Signature Feature options
  isMystery?: boolean;
  discoveryContext?: {
    id: string;
    text: string;
    category?: string;
  };
  curiosityContext?: {
    observation: string;
    question: string;
    missionSeed: string;
  };
}

export interface GenerateReflectionParams {
  quest: Quest;
  completionStatus: 'completed' | 'partial' | 'alternative_discovery';
  userNote?: string;
  curiosityObservation?: string;
  difficultyFeedback: 'easier' | 'just_right' | 'harder' | 'different';
  photoCount: number;
  userProfile: UserProfile;
}

export interface CuriosityChainResult {
  curiosityQuestion: string;
  nextMissionSeed: string;
  ecologicalInsight: string;
}
