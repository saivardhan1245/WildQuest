import {
  CompletedQuest,
  Quest,
  UserProfile,
  QuestEnvironment,
  QuestCategory,
  DiscoveryRecord,
  CuriosityChainItem,
  ProgressionStage
} from '../types/quest';

const STORAGE_KEY = 'wildquest_user_profile_v2';

// In-memory memory fallback if localStorage is blocked by iframe security policies
const memoryStore: Record<string, string> = {};

function safeGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (err) {
    // Sandboxed iframe or security error
  }
  return memoryStore[key] || null;
}

function safeSet(key: string, val: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
      return;
    }
  } catch (err) {
    // Sandboxed iframe or security error
  }
  memoryStore[key] = val;
}

function safeRemove(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    // Sandboxed iframe
  }
  delete memoryStore[key];
}

// Clean initial state for any new user: 0 minutes, 0 quests, 0 streak, 0 discoveries.
export const INITIAL_USER_PROFILE: UserProfile = {
  totalMinutesOutside: 0,
  completedQuests: [],
  streakDays: 0,
  lastActiveDate: undefined,
  environmentsExplored: {
    park: 0,
    neighborhood: 0,
    garden: 0,
    trail: 0,
    anywhere: 0
  },
  categoriesExplored: {
    nature_detective: 0,
    movement: 0,
    sensory: 0,
    biodiversity: 0,
    photography: 0,
    mindful_observation: 0,
    neighborhood_discovery: 0,
    social: 0,
    garden: 0,
    weather_seasonal: 0
  },
  discoveriesCount: 0,
  contrastMode: 'natural',
  audioCuesEnabled: true,
  activeProviderId: 'local-gemma',
  localOllamaUrl: 'http://127.0.0.1:11434',
  localOllamaModel: 'gemma2:2b',
  discoveries: [],
  curiosityChain: [],
  verifiedPlaces: [],
  currentProgressionStage: 'observe'
};

export function computeProgressionStage(completedCount: number): ProgressionStage {
  if (completedCount <= 1) return 'observe';
  if (completedCount <= 4) return 'learn';
  return 'explore_deeper';
}

export function loadUserProfile(): UserProfile {
  try {
    // Purge legacy storage safely
    safeRemove('wildquest_user_profile_v1');

    const raw = safeGet(STORAGE_KEY);
    if (!raw) {
      saveUserProfile(INITIAL_USER_PROFILE);
      return INITIAL_USER_PROFILE;
    }

    const parsed = JSON.parse(raw);

    // Sanitize: ensure no mock/sample data survived in storage
    const genuineCompletedQuests: CompletedQuest[] = (parsed.completedQuests || []).filter(
      (q: CompletedQuest) =>
        q &&
        typeof q.id === 'string' &&
        !q.id.startsWith('wq-past') &&
        !q.id.startsWith('sample') &&
        q.quest &&
        !q.quest.id.startsWith('wq-sample')
    );

    // Filter genuine discoveries
    const genuineDiscoveries: DiscoveryRecord[] = (parsed.discoveries || []).filter(
      (d: DiscoveryRecord) => d && typeof d.id === 'string' && !d.id.startsWith('sample')
    );

    // Filter genuine curiosity chain
    const genuineCuriosity: CuriosityChainItem[] = (parsed.curiosityChain || []).filter(
      (c: CuriosityChainItem) => c && typeof c.id === 'string' && !c.id.startsWith('sample')
    );

    // Derive stats solely and strictly from genuine completed activity
    const totalMinutes = genuineCompletedQuests.reduce(
      (sum, q) => sum + (Number(q.durationCompletedMinutes) || 0),
      0
    );

    const totalDiscoveriesCount =
      genuineDiscoveries.length +
      genuineCompletedQuests.reduce(
        (sum, q) => sum + (q.userNote ? 1 : 0) + (Array.isArray(q.photos) ? q.photos.length : 0),
        0
      );

    const envCounts: Record<QuestEnvironment, number> = {
      park: 0,
      neighborhood: 0,
      garden: 0,
      trail: 0,
      anywhere: 0
    };

    const catCounts: Record<QuestCategory, number> = {
      nature_detective: 0,
      movement: 0,
      sensory: 0,
      biodiversity: 0,
      photography: 0,
      mindful_observation: 0,
      neighborhood_discovery: 0,
      social: 0,
      garden: 0,
      weather_seasonal: 0
    };

    genuineCompletedQuests.forEach((q) => {
      if (q.quest?.environment && envCounts[q.quest.environment] !== undefined) {
        envCounts[q.quest.environment] += 1;
      }
      if (q.quest?.category && catCounts[q.quest.category] !== undefined) {
        catCounts[q.quest.category] += 1;
      }
    });

    const streak = genuineCompletedQuests.length > 0 ? (parsed.streakDays || 1) : 0;
    const stage = computeProgressionStage(genuineCompletedQuests.length);

    const sanitizedProfile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      ...parsed,
      completedQuests: genuineCompletedQuests,
      discoveries: genuineDiscoveries,
      curiosityChain: genuineCuriosity,
      verifiedPlaces: Array.isArray(parsed.verifiedPlaces) ? parsed.verifiedPlaces : [],
      currentProgressionStage: stage,
      totalMinutesOutside: totalMinutes,
      discoveriesCount: totalDiscoveriesCount,
      streakDays: streak,
      environmentsExplored: envCounts,
      categoriesExplored: catCounts
    };

    return sanitizedProfile;
  } catch (err) {
    console.error('Failed to load user profile from localStorage:', err);
    return INITIAL_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    safeSet(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
}

export function recordCompletedQuest(
  profile: UserProfile,
  completed: CompletedQuest
): UserProfile {
  const updatedQuests = [completed, ...profile.completedQuests];
  const newMinutes = profile.totalMinutesOutside + (completed.durationCompletedMinutes || 0);

  // Update streak logic strictly from real completions
  const todayStr = new Date().toISOString().split('T')[0];
  let newStreak = profile.streakDays;
  if (!profile.lastActiveDate || profile.completedQuests.length === 0) {
    newStreak = 1;
  } else if (profile.lastActiveDate !== todayStr) {
    const lastDate = new Date(profile.lastActiveDate);
    const today = new Date(todayStr);
    const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  const env = completed.quest.environment;
  const cat = completed.quest.category;

  const envs = { ...profile.environmentsExplored };
  if (envs[env] !== undefined) {
    envs[env] = (envs[env] || 0) + 1;
  }

  const cats = { ...profile.categoriesExplored };
  if (cats[cat] !== undefined) {
    cats[cat] = (cats[cat] || 0) + 1;
  }

  // Curiosity Chain integration if user answered "What caught your attention?"
  const updatedCuriosity = [...profile.curiosityChain];
  if (completed.curiosityObservation && completed.curiosityQuestion) {
    const chainItem: CuriosityChainItem = {
      id: `cc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      questId: completed.quest.id,
      questTitle: completed.quest.title,
      userObservation: completed.curiosityObservation,
      curiosityQuestion: completed.curiosityQuestion,
      nextMissionSeed: completed.nextMissionSeed || 'Investigate subtle ecological relationships.',
      createdAt: completed.completedAt
    };
    updatedCuriosity.unshift(chainItem);
  }

  // Verified places explicitly recorded
  const updatedPlaces = [...profile.verifiedPlaces];
  if (completed.verifiedPlaceName && !updatedPlaces.includes(completed.verifiedPlaceName)) {
    updatedPlaces.push(completed.verifiedPlaceName);
  }

  // Discoveries count strictly from real items
  const discoveryDelta = (completed.userNote ? 1 : 0) + (completed.photos?.length || 0);
  const newDiscoveriesCount = profile.discoveriesCount + discoveryDelta;
  const nextStage = computeProgressionStage(updatedQuests.length);

  const updatedProfile: UserProfile = {
    ...profile,
    completedQuests: updatedQuests,
    curiosityChain: updatedCuriosity,
    verifiedPlaces: updatedPlaces,
    currentProgressionStage: nextStage,
    totalMinutesOutside: newMinutes,
    streakDays: newStreak,
    lastActiveDate: todayStr,
    environmentsExplored: envs,
    categoriesExplored: cats,
    discoveriesCount: newDiscoveriesCount
  };

  saveUserProfile(updatedProfile);
  return updatedProfile;
}

export function recordUserDiscovery(
  profile: UserProfile,
  discovery: DiscoveryRecord
): UserProfile {
  const updatedDiscoveries = [discovery, ...profile.discoveries];
  const updatedProfile: UserProfile = {
    ...profile,
    discoveries: updatedDiscoveries,
    discoveriesCount: profile.discoveriesCount + 1
  };
  saveUserProfile(updatedProfile);
  return updatedProfile;
}

export function linkDiscoveryToQuest(
  profile: UserProfile,
  discoveryId: string,
  questId: string,
  questTitle: string
): UserProfile {
  const updatedDiscoveries = profile.discoveries.map((d) =>
    d.id === discoveryId
      ? { ...d, turnedIntoQuestId: questId, questTitleSpawned: questTitle }
      : d
  );
  const updatedProfile: UserProfile = {
    ...profile,
    discoveries: updatedDiscoveries
  };
  saveUserProfile(updatedProfile);
  return updatedProfile;
}

export function resetAllData(): UserProfile {
  const blankProfile: UserProfile = {
    ...INITIAL_USER_PROFILE
  };
  saveUserProfile(blankProfile);
  return blankProfile;
}
