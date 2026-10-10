import { GenerateQuestParams, GenerateReflectionParams, Quest, QuestCategory, ProgressionStage } from '../../types/quest';
import { CATEGORIES, ENVIRONMENT_NAMES, DIFFICULTY_NAMES } from '../../utils/categories';

export function buildQuestPrompt(params: GenerateQuestParams): string {
  const { duration, environment, difficulty, category = 'biodiversity', userProfile, notes, isMystery, discoveryContext, curiosityContext } = params;
  const envMeta = ENVIRONMENT_NAMES[environment];
  const catMeta = CATEGORIES[category] || CATEGORIES.biodiversity;
  const diffMeta = DIFFICULTY_NAMES[difficulty] || DIFFICULTY_NAMES.explorer;

  // Past progression context (Adaptive Quest Evolution: observe → learn → explore deeper)
  const previousQuestsCount = userProfile.completedQuests.length;
  const lastQuests = userProfile.completedQuests.slice(0, 3);
  let progressionStage: ProgressionStage = userProfile.currentProgressionStage || 'observe';

  let progressionContext = '';
  if (previousQuestsCount > 0 && lastQuests.length > 0) {
    const lastQ = lastQuests[0];
    const diffPref = lastQ.difficultyFeedback;
    const pastObservation = lastQ.curiosityObservation || lastQ.userNote || 'tactile exploration';
    
    progressionContext = `
USER REAL ACTIVITY HISTORY (Adapt strictly based on this):
- Completed Missions: ${previousQuestsCount}
- Current Progression Stage: ${progressionStage.toUpperCase()} (Progression trajectory: observe → learn → explore deeper)
- Last Mission: "${lastQ.quest.title}" (${lastQ.quest.category})
- User Feedback on Last Difficulty: ${diffPref} (Adjust accordingly: if 'easier', deepen detail; if 'harder', clarify focus)
- User's Real Observed Details: "${pastObservation}"
${lastQ.nextAdaptiveFocus ? `- Adaptive Direction Seed: "${lastQ.nextAdaptiveFocus}"` : ''}

ADAPTIVE RULE: Build organically upon what the user actually observed in previous missions.
Progression logic:
- Stage 'observe': Focus on sensory awareness, shapes, and textures.
- Stage 'learn': Focus on comparing two specimens, noticing why things grow where they do, orientation to sun/wind.
- Stage 'explore_deeper': Focus on micro-interactions, insect highways, soil moisture gradients, or symbiotic decay.
DO NOT fabricate details. Connect to their real observed notes.`;
  } else {
    progressionContext = `This is the user's FIRST mission. Progression Stage: OBSERVE. Keep it inviting, tactile, and immediately rewarding. Do NOT claim the AI adapted from prior missions since this is their first.`;
  }

  // Discovery branching context
  let discoveryDirective = '';
  if (discoveryContext) {
    discoveryDirective = `
CRITICAL DISCOVERY BRANCHING DIRECTIVE:
The user previously logged a REAL field discovery:
"${discoveryContext.text}" (Category: ${discoveryContext.category || 'natural element'}).
The goal of this new quest is to TURN THIS DISCOVERY INTO A FRESH OUTDOOR MISSION.
Example: If they found a strange leaf, the mission should have them find two other leaves nearby and compare textures or find the parent tree.
Create a quest that directly expands on their discovery!`;
  }

  // Curiosity chain context
  let curiosityDirective = '';
  if (curiosityContext) {
    curiosityDirective = `
CRITICAL CURIOSITY CHAIN DIRECTIVE:
The user asked about their observation: "${curiosityContext.observation}".
Biological curiosity question: "${curiosityContext.question}".
Suggested spark: "${curiosityContext.missionSeed}".
Create a quest that directly answers this curiosity in the physical world!`;
  }

  // Mystery quest directive
  let mysteryDirective = '';
  if (isMystery) {
    mysteryDirective = `
CRITICAL MYSTERY QUEST DIRECTIVE:
This is a MYSTERY QUEST. The user does not know the specific topic before starting.
Design a poetic, unexpected, perspective-shifting challenge that breaks everyday autopilot.
Example style: "Find something you normally walk past. Look closely. Do not touch or disturb anything."
Include a sense of curiosity, stillness, and looking at the familiar as if seeing it for the first time.`;
  }

  return `You are WildQuest Engine, an open-weight AI built for Hacktoberfest 2026's "Touch Grass" challenge.
Your sole mission is to create a physical-world outdoor exploration card that makes the user PUT DOWN THEIR PHONE, go outside for ${duration} minutes, and observe the natural/neighborhood world.

CORE PHILOSOPHY:
"AI gives you the question. The real world gives you the answer."
The screen is the shortest part of the journey. Once the quest is read, the user locks their phone and explores.

PARAMETERS:
- Available Time: ${duration} minutes
- Environment: ${envMeta.name} (${envMeta.description})
- Difficulty Level: ${diffMeta.label} (${diffMeta.desc})
- Category/Focus: ${catMeta.name} - ${catMeta.tagline}
${notes ? `- User Special Focus: ${notes}` : ''}
${progressionContext}
${discoveryDirective}
${curiosityDirective}
${mysteryDirective}

CRITICAL RULES:
1. THE SCREEN MUST GET OUT OF THE WAY. Never suggest using mobile apps, social media, or screens outdoors.
2. The mission must be actionable, safe, realistic, and achievable in ${duration} minutes.
3. Keep the user strictly safe: no restricted property, no tasting wild plants, no disturbing wildlife, no dangerous climbing.
4. Return ONLY valid raw JSON conforming strictly to the schema below. No markdown fences, no conversational preamble.

OUTPUT JSON SCHEMA:
{
  "title": "Short poetic title (3-6 words)",
  "durationMinutes": ${duration},
  "category": "${category}",
  "difficulty": "${difficulty}",
  "mission": "One crisp, inspiring sentence. Example: Leave your phone in your pocket and locate three distinct micro-ecosystems.",
  "steps": [
    "Step 1: First physical observation or search criteria",
    "Step 2: Second physical observation or interaction",
    "Step 3: Third physical observation or sensory trigger",
    "Step 4: Fourth physical observation or interaction"
  ],
  "constraints": "Take no more than 3 photos. Pocket your phone between discoveries. Return when your timer ends.",
  "safetyNote": "Concrete safety reminder relevant to this environment.",
  "returnPrompt": "What pattern or living interaction surprised you the most?",
  "reflectionQuestions": [
    "Did you complete the physical search?",
    "What unexpected sound or texture did you notice?",
    "Do you want a deeper or broader mission next time?"
  ],
  "adaptationReason": "${previousQuestsCount > 0 ? 'Adapted from your previous expedition feedback and observations.' : 'Initial baseline observation mission.'}"
}`;
}

export function buildReflectionPrompt(params: GenerateReflectionParams): string {
  const { quest, completionStatus, userNote, curiosityObservation, difficultyFeedback, photoCount } = params;

  return `You are WildQuest Engine powered by open-weight Gemma.
A user has returned from an outdoor quest. Provide a SHORT, thoughtful, grounding reflection AND generate a curiosity question for their curiosity chain.

CRITICAL RULES:
1. MAX 2 TO 3 SENTENCES TOTAL for the reflection. No fluffy filler or corporate praise.
2. Ground the curiosity question in what caught the user's attention.
   Example: If user noticed ants carrying leaves → Curiosity: "Why do ants carry objects much larger than themselves?" → Next mission seed: "Trace an ant trail back to its entrance hole."
3. Return ONLY valid raw JSON:
{
  "reflection": "2 short sentences reflecting on their outdoor experience with grounded depth.",
  "nextAdaptiveFocus": "One phrase describing the next evolution of their curiosity (e.g. 'Leaf vein patterns vs sun exposure', 'Bird song territorial boundaries')",
  "curiosityQuestion": "One intriguing question about what they noticed (or 'What micro-patterns exist in this habitat?')",
  "nextMissionSeed": "One crisp sentence proposing how to investigate this on their next outdoor walk."
}

QUEST DETAILS:
- Title: ${quest.title}
- Category: ${quest.category}
- Duration: ${quest.durationMinutes} minutes
- Status: ${completionStatus}
- User field notes: "${userNote || 'User spent time silently outdoors'}"
- What caught user's attention: "${curiosityObservation || userNote || 'Noticed subtle natural details'}"
- User difficulty feedback: ${difficultyFeedback}
- Photos recorded: ${photoCount}
`;
}

export function validateQuestPayload(data: any, fallbackParams: GenerateQuestParams): Quest {
  const id = 'wq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const now = new Date().toISOString();
  
  const title = typeof data?.title === 'string' && data.title.trim().length > 0 
    ? data.title.trim() 
    : fallbackParams.isMystery
      ? 'The Hidden Horizon'
      : `${fallbackParams.duration}-Minute Outdoor Exploration`;

  const mission = typeof data?.mission === 'string' && data.mission.trim().length > 0
    ? data.mission.trim()
    : fallbackParams.isMystery
      ? 'Find something you normally walk past. Look closely. Do not touch or disturb anything.'
      : 'Leave your phone in your pocket. Observe subtle patterns of growth and light.';

  const steps = Array.isArray(data?.steps) && data.steps.length > 0
    ? data.steps.map((s: any) => String(s).trim())
    : [
        'Notice three different plant textures with your fingertips',
        'Find one living interaction between an insect or bird and a plant',
        'Pause for 60 seconds with your eyes closed and listen to the ambient sphere',
        'Locate a trace of seasonal change in foliage or soil'
      ];

  const rawCat = (data?.category || fallbackParams.category || 'biodiversity') as string;
  const category: QuestCategory = rawCat in CATEGORIES ? (rawCat as QuestCategory) : 'biodiversity';
  const catMeta = CATEGORIES[category] || CATEGORIES.biodiversity;

  const previousCount = fallbackParams.userProfile.completedQuests.length;
  let adaptationReason: string | undefined = undefined;
  if (fallbackParams.discoveryContext) {
    adaptationReason = `Branched directly from your field discovery: "${fallbackParams.discoveryContext.text.slice(0, 40)}..."`;
  } else if (fallbackParams.curiosityContext) {
    adaptationReason = `Evolved from your curiosity: "${fallbackParams.curiosityContext.question.slice(0, 45)}..."`;
  } else if (previousCount > 0) {
    const lastQ = fallbackParams.userProfile.completedQuests[0];
    adaptationReason = `Progressed from Quest #${previousCount} ("${lastQ?.quest.title}") based on your feedback (${lastQ?.difficultyFeedback})`;
  }

  return {
    id,
    title,
    durationMinutes: fallbackParams.duration,
    category: catMeta.id,
    categoryLabel: catMeta.name,
    difficulty: fallbackParams.difficulty,
    environment: fallbackParams.environment,
    mission,
    steps,
    constraints: typeof data?.constraints === 'string' ? data.constraints : 'Take no more than 3 photos. Pocket your phone. Return when your timer ends.',
    safetyNote: typeof data?.safetyNote === 'string' ? data.safetyNote : 'Stay on safe paths, do not ingest wild plants, and keep a respectful distance from wildlife.',
    returnPrompt: typeof data?.returnPrompt === 'string' ? data.returnPrompt : 'What natural detail caught your attention?',
    reflectionQuestions: Array.isArray(data?.reflectionQuestions) && data.reflectionQuestions.length > 0
      ? data.reflectionQuestions.map((q: any) => String(q))
      : [
          'Did you complete the search?',
          'What surprised you about this environment?',
          'Do you want a harder or more relaxed quest next time?'
        ],
    generatedByProvider: data?.generatedByProvider || 'gemma-local',
    createdAt: now,
    isMysteryQuest: Boolean(fallbackParams.isMystery),
    mysteryTeaser: fallbackParams.isMystery
      ? {
          durationRange: `${fallbackParams.duration} MIN`,
          environmentLabel: fallbackParams.environment.toUpperCase()
        }
      : undefined,
    progressionStage: fallbackParams.userProfile.currentProgressionStage,
    branchedFromDiscoveryId: fallbackParams.discoveryContext?.id,
    branchedFromDiscoveryText: fallbackParams.discoveryContext?.text,
    curiositySeed: fallbackParams.curiosityContext?.question,
    adaptationReason
  };
}
