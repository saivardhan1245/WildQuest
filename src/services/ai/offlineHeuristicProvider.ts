import { AIProvider, ProviderHealth } from './types';
import { GenerateQuestParams, GenerateReflectionParams, Quest } from '../../types/quest';
import { CATEGORIES } from '../../utils/categories';
import { validateQuestPayload } from './promptTemplates';

interface QuestArchetype {
  title: string;
  mission: string;
  steps: string[];
  constraints: string;
  safetyNote: string;
  returnPrompt: string;
}

const ARCHETYPES: Record<string, QuestArchetype[]> = {
  biodiversity: [
    {
      title: 'Biodiversity Margin Hunt',
      mission: 'Leave your phone in your pocket. Find four contrasting leaf margins and evidence of non-human feeding.',
      steps: [
        'Find two serrated leaves and two smooth-edged leaves from distinct plant species',
        'Locate a leaf showing partial insect nibbling or caterpillar shelter',
        'Find three different natural textures (rough bark, waxy petal, velvety moss)',
        'Identify one micro-interaction where two distinct species share a single square foot',
        'Pause and observe how light filters through the highest canopy branch for 60 seconds'
      ],
      constraints: 'Take at most 2 photos. Keep phone tucked away during walking intervals.',
      safetyNote: 'Do not pick plants or damage bark; observe leaves while attached to stems.',
      returnPrompt: 'Which of the textures felt most surprising to the touch?'
    },
    {
      title: 'Micro-Canopy Understory Survey',
      mission: 'Inspect the lowest six inches of outdoor vegetation for hidden fungal, moss, or lichen kingdoms.',
      steps: [
        'Find three distinct colonies of lichen on rock or tree bark (crusty, leafy, or shrubby)',
        'Look beneath a fallen piece of dry bark without disrupting root systems',
        'Count the number of different tiny insects passing through a 1-foot circle in two minutes',
        'Find a seedling attempting to grow in an unexpected crack or under heavy shade'
      ],
      constraints: 'No screen consultation until your return timer expires.',
      safetyNote: 'Watch your footing on damp soil or loose roots.',
      returnPrompt: 'Did you notice any organisms smaller than a fingernail?'
    }
  ],
  nature_detective: [
    {
      title: 'Ecological Trail of Evidence',
      mission: 'Track five subtle traces left behind by wildlife, weather, or passing birds.',
      steps: [
        'Find evidence of wind impact (fallen needles, bent grasses, or wind-blown seeds)',
        'Locate an abandoned shell, feather, or molted casing',
        'Detect an animal highway or footpath through undergrowth',
        'Find a seed designed for travel (prickly burr, winged helicopter seed, or berry)',
        'Spot a hollow or sheltered nook suitable for bird roosting'
      ],
      constraints: 'Leave everything undisturbed. Record findings in your memory.',
      safetyNote: 'Never reach your hands blindly into dark holes or hollow logs.',
      returnPrompt: 'What was the clearest sign of non-human life you discovered?'
    },
    {
      title: 'Water Path & Drainage Sleuth',
      mission: 'Follow the natural contours of terrain to discover where rain flows and pools outdoors.',
      steps: [
        'Identify the lowest contour of ground in your immediate surroundings',
        'Find where water has compacted sediment or gathered organic debris',
        'Locate the most moisture-loving plant in your area (moss, fern, or succulent clover)',
        'Notice how soil firmness changes between shaded and sun-exposed sections'
      ],
      constraints: 'Pocket your phone for the entire duration.',
      safetyNote: 'Avoid slippery slopes and deep retention areas.',
      returnPrompt: 'How did the soil or vegetation indicate where water stays longest?'
    }
  ],
  sensory: [
    {
      title: 'Acoustic Horizon & Micro-Scent Walk',
      mission: 'Close your eyes at three distinct waypoints to map acoustic depth and natural fragrances.',
      steps: [
        'Walk 50 paces, stop, close eyes for 45 seconds, and count distinct bird vocalizations',
        'Gently rub a fallen pine needle or bruised leaf between fingers and identify the scent notes',
        'Compare the temperature of sun-warmed stone against shaded soil using the back of your hand',
        'Listen for wind movement through two different types of trees (e.g. broadleaf rustle vs conifer hum)',
        'Stand motionless for two minutes and notice which birds resume calling after your pause'
      ],
      constraints: 'Zero photos. Rely purely on acoustic and tactile presence.',
      safetyNote: 'Stop in a safe location away from traffic before closing your eyes.',
      returnPrompt: 'What was the most distant sound you could discern?'
    }
  ],
  movement: [
    {
      title: 'Cardinal Compass Wandering',
      mission: 'Navigate using geographic landmarks rather than street maps or turn-by-turn screens.',
      steps: [
        'Observe where the sun casts shadows and determine true North without a compass app',
        'Walk continuously toward the highest visible green canopy or horizon line',
        'Alter your pace: 3 minutes of brisk walking followed by 1 minute of complete stillness',
        'Take three deliberate detour turns down paths or streets you have never walked down',
        'Complete a continuous non-overlapping loop back to your starting point'
      ],
      constraints: 'Keep phone completely locked in pocket until the timer chime rings.',
      safetyNote: 'Always remain aware of road traffic, curbs, and crossings.',
      returnPrompt: 'Did you discover any spot within 10 minutes of home you had never seen?'
    }
  ],
  mindful_observation: [
    {
      title: 'The Sit-Spot Canopy Witness',
      mission: 'Choose a solitary resting perch and remain physically still for 20 minutes.',
      steps: [
        'Select a bench, fallen log, or dry boulder with an open view of foliage or sky',
        'Take five slow nasal breaths, feeling the ambient temperature against your skin',
        'Watch the slow movement of shadows creeping across ground cover as the sun shifts',
        'Notice how small wildlife (squirrels, sparrows, bees) readjust to your calm presence',
        'Observe your urge to reach for a phone and gently let it pass'
      ],
      constraints: 'Phone must remain locked. No audio headphones.',
      safetyNote: 'Choose a secure, dry, and comfortable perch.',
      returnPrompt: 'At what minute did the initial mental restlessness begin to quiet down?'
    }
  ],
  neighborhood_discovery: [
    {
      title: 'Urban Flora Resilience Walk',
      mission: 'Discover how wild life reclaims concrete, asphalt cracks, and street curb margins.',
      steps: [
        'Find a flowering plant thriving in a narrow sidewalk crack or wall seam',
        'Identify three distinct species of street trees planted along your block',
        'Locate a pocket garden, window planter, or neglected wild corner',
        'Notice where birds perch on architectural features (eaves, antennas, gutters)',
        'Find one example of plant roots visibly lifting or reshaping pavement'
      ],
      constraints: 'Take up to 2 documentary photos only.',
      safetyNote: 'Stay alert at driveways, alley exits, and crosswalks.',
      returnPrompt: 'What was the toughest or most determined urban weed you encountered?'
    }
  ],
  photography: [
    {
      title: 'The Three-Frame Solitary Study',
      mission: 'Observe the world for 15 minutes before taking exactly three intentional outdoor frames.',
      steps: [
        'Spend the first 10 minutes walking with your hands empty and phone tucked away',
        'Frame 1: Capture an extreme close-up of a natural texture with side-lighting',
        'Frame 2: Capture the relationship between living vegetation and human-made structures',
        'Frame 3: Capture the interplay between light and deep shadow in foliage',
        'Immediately lock your camera and walk in silence for the remaining duration'
      ],
      constraints: 'Strict limit of 3 photographs total. No retakes, no filters.',
      safetyNote: 'Do not look through viewfinder while walking on uneven terrain.',
      returnPrompt: 'How did limiting yourself to 3 frames change how you observed the terrain?'
    }
  ],
  social: [
    {
      title: 'Companion Perspective Exchange',
      mission: 'Walk with a friend or family member and silently notice alternating natural details.',
      steps: [
        'Walk in companionable silence for the first 5 minutes without discussing screens',
        'Partner A points out a subtle natural phenomenon; Partner B must guess how it formed',
        'Swap roles: Partner B identifies a living organism that Partner A initially walked past',
        'Find a shared outdoor feature that neither of you had ever noticed before',
        'Sit together for 3 minutes without speaking and listen to the surroundings'
      ],
      constraints: 'Both companions keep devices tucked away in pockets or bags.',
      safetyNote: 'Maintain awareness of surroundings when engaged in conversation.',
      returnPrompt: 'What did your companion notice that you had completely overlooked?'
    }
  ],
  garden: [
    {
      title: 'Soil, Root & Decomposer Audit',
      mission: 'Investigate the foundation of plant life: topsoil, mulch, and micro-decomposition.',
      steps: [
        'Gently push back dry surface mulch to feel the moisture level of rich soil',
        'Look closely for earthworm castings, centipedes, or pill bugs recycling nutrients',
        'Examine leaf veins of decomposing leaves to see the skeletal cellulose structure',
        'Identify the newest fresh growth shoot on a perennial shrub or tree branch',
        'Notice the difference in soil aroma between dry dust and shaded compost'
      ],
      constraints: 'Keep phone in pocket. Return with clean or dusted hands.',
      safetyNote: 'Wash hands after handling soil; avoid sharp thorns or stinging nettle.',
      returnPrompt: 'What stage of plant decay or rebirth felt most evident?'
    }
  ],
  weather_seasonal: [
    {
      title: 'Micro-Climate & Thermal Gradient Search',
      mission: 'Detect how sunlight, wind barriers, and elevation alter outdoor temperatures.',
      steps: [
        'Find the warmest thermal pocket created by a south-facing brick wall or rock',
        'Step into the deepest tree shadow and note the immediate drop in temperature',
        'Determine wind direction by watching the movement of slender grass heads or leaves',
        'Observe cloud density and forecast what the sky will look like in one hour',
        'Notice which deciduous trees are holding their foliage versus shedding'
      ],
      constraints: 'No weather apps. Base every deduction on your direct bodily senses.',
      safetyNote: 'Dress warmly or wear sun protection based on current conditions.',
      returnPrompt: 'How many degrees did the micro-climate feel different between sun and shade?'
    }
  ]
};

export class OfflineHeuristicProvider implements AIProvider {
  id = 'offline-adaptive';
  name = 'Offline Adaptive Engine (On-Device)';
  modelIdentifier = 'Heuristic-Engine-v2';
  description = '100% on-device offline quest generator. Zero network latency, maximum privacy.';
  isLocal = true;
  isOpenWeight = true;

  async checkAvailability(): Promise<ProviderHealth> {
    return {
      available: true,
      latencyMs: 1,
      modelName: 'On-Device Rule & Progression Engine',
      isLocal: true,
      message: 'Always available offline. No server or API key required.'
    };
  }

  async generateQuest(params: GenerateQuestParams): Promise<Quest> {
    const { category = 'biodiversity', difficulty, duration, environment, userProfile } = params;
    const catArchetypes = ARCHETYPES[category] || ARCHETYPES.biodiversity;
    const completedCount = userProfile.completedQuests.length;
    
    // Signature Feature 1: Mystery Quest Archetypes
    if (params.isMystery) {
      const mysteryMissions = [
        {
          title: 'The Overlooked Micro-Realm',
          mission: 'Find something you normally walk past every single day. Look closely. Do not touch or disturb anything.',
          steps: [
            'Walk 100 paces in an everyday direction, then pause completely for 60 seconds',
            'Look directly at the base of the nearest tree, lamppost, or wall edge',
            'Examine the surface for weathering, tiny growth, or insect pathways',
            'Notice the physical contrast between human construction and natural recolonization',
            'Commit the subtle details to memory before walking back'
          ],
          constraints: 'Lock your phone away. Touch nothing. Let your eyes do 100% of the work.',
          safetyNote: 'Stay aware of your surroundings, traffic, and pedestrians.',
          returnPrompt: 'What had you walked past a hundred times without ever actually seeing?'
        },
        {
          title: 'The Silent Threshold',
          mission: 'Step outside and locate where two different outdoor textures meet. Observe the boundary in silence.',
          steps: [
            'Find a clear boundary line (soil meeting asphalt, shade meeting direct sun, grass meeting stone)',
            'Spend 5 minutes observing the border: which plants cross it, which stop?',
            'Look for moisture or temperature differences across the two sides',
            'Notice any living creature that uses this edge as a highway or shelter',
            'Take three slow breaths and register the ambient soundscape'
          ],
          constraints: 'No screen consultation. Pure sensory boundary mapping.',
          safetyNote: 'Remain in safe pedestrian areas.',
          returnPrompt: 'What happens at the edge between those two surfaces?'
        }
      ];
      const selected = mysteryMissions[completedCount % mysteryMissions.length];
      return validateQuestPayload({
        title: selected.title,
        durationMinutes: duration,
        category: 'mindful_observation',
        difficulty,
        mission: selected.mission,
        steps: selected.steps,
        constraints: selected.constraints,
        safetyNote: selected.safetyNote,
        returnPrompt: selected.returnPrompt,
        reflectionQuestions: [
          'What did you discover hiding in plain sight?',
          'How did the mission feel once revealed?',
          'Did stepping out with mystery enhance your focus?'
        ],
        generatedByProvider: 'offline-adaptive'
      }, params);
    }

    // Signature Feature 2: Discovery -> Next Quest Branching
    if (params.discoveryContext) {
      const disc = params.discoveryContext;
      return validateQuestPayload({
        title: `Investigation: ${disc.text.slice(0, 24)}`,
        durationMinutes: duration,
        category: (params.category || 'biodiversity'),
        difficulty,
        mission: `Branching from your discovery: "${disc.text}". Step outside and locate two other related natural elements nearby to compare.`,
        steps: [
          `Return to or recreate the outdoor conditions where you discovered: "${disc.text}"`,
          'Locate two other leaves, rocks, bark textures, or organisms within 30 paces',
          'Compare their textures, vein patterns, or colors side-by-side without detaching them',
          'Determine whether sunlight, moisture, or soil quality explains their differences',
          'Formulate one hypothesis about why they grow or appear the way they do'
        ],
        constraints: 'Take at most 2 comparison photos. Do not pick or harm living specimens.',
        safetyNote: 'Watch your footing and stay on public trails or parkland.',
        returnPrompt: 'How did the comparison deepen what you noticed originally?',
        reflectionQuestions: [
          'Did you find other specimens related to your discovery?',
          'What differences emerged when comparing them closely?',
          'What is your next curiosity regarding this specimen?'
        ],
        generatedByProvider: 'offline-adaptive'
      }, params);
    }

    // Signature Feature 3: Curiosity Chain Spark
    if (params.curiosityContext) {
      const cur = params.curiosityContext;
      return validateQuestPayload({
        title: `Curiosity: ${cur.missionSeed.slice(0, 26)}`,
        durationMinutes: duration,
        category: (params.category || 'nature_detective'),
        difficulty,
        mission: `${cur.missionSeed} Inquiry: "${cur.question}"`,
        steps: [
          `Recall your observation: "${cur.observation}"`,
          `Keep this inquiry in mind: "${cur.question}"`,
          'Search outdoors for physical clues or living behaviors addressing this question',
          'Pause and watch living interactions for at least 5 unbroken minutes',
          'Identify what environmental factor (sun, wind, moisture, shelter) matters most'
        ],
        constraints: 'Lock your phone. Keep your observation unbroken.',
        safetyNote: 'Never disturb living animals or fragile habitats.',
        returnPrompt: 'What living clue did you observe that spoke to your question?',
        reflectionQuestions: [
          'Did the real world offer any clues to your curiosity?',
          'What new question emerged from watching closely?'
        ],
        generatedByProvider: 'offline-adaptive'
      }, params);
    }

    // Adaptive seed selection based on user's past quest history
    const archetypeIndex = completedCount % catArchetypes.length;
    const base = catArchetypes[archetypeIndex];

    // Progression adaptation (observe → learn → explore deeper)
    const lastQuest = userProfile.completedQuests[0];
    let adaptiveMission = base.mission;
    let adaptiveSteps = [...base.steps];

    if (lastQuest) {
      const stage = userProfile.currentProgressionStage || 'observe';
      if (stage === 'explore_deeper') {
        adaptiveMission = `Deep Field Exploration: ${base.mission} Focus on micro-systems and biological symbiosis.`;
        adaptiveSteps.push('Document one nuanced ecological relationship between two different species.');
      } else if (stage === 'learn') {
        adaptiveMission = `Pattern Investigation: ${base.mission} Compare what you see against findings from Quest #${completedCount}.`;
      }
      
      if (lastQuest.difficultyFeedback === 'harder') {
        adaptiveMission = `Gently Focused: ${base.mission.replace('Leave your phone in your pocket. ', '')}`;
        adaptiveSteps = adaptiveSteps.slice(0, 3);
      } else if (lastQuest.difficultyFeedback === 'easier') {
        adaptiveSteps.push('Find one living trace of seasonal change in foliage or soil.');
      }
    }

    const payload = {
      title: `${duration}-Min ${base.title}`,
      durationMinutes: duration,
      category,
      difficulty,
      mission: adaptiveMission,
      steps: adaptiveSteps,
      constraints: base.constraints,
      safetyNote: base.safetyNote,
      returnPrompt: base.returnPrompt,
      reflectionQuestions: [
        'Did you complete the physical observation?',
        'What detail stood out most in this environment?',
        'How did your mental focus feel after stepping away from screens?'
      ],
      generatedByProvider: 'offline-adaptive'
    };

    return validateQuestPayload(payload, params);
  }

  async generateReflection(params: GenerateReflectionParams): Promise<string> {
    const { quest, completionStatus, difficultyFeedback, userNote } = params;
    const noteSnippet = userNote ? ` Your note on "${userNote.slice(0, 40)}" reveals acute attention.` : '';

    if (completionStatus === 'completed') {
      return `You engaged deeply with the real environment today rather than passive screen consumption.${noteSnippet} Next time, we will adapt your path toward subtle micro-patterns in this landscape.`;
    } else if (completionStatus === 'alternative_discovery') {
      return `True field exploration often leads somewhere unexpected.${noteSnippet} Wandering off-script is the highest form of genuine curiosity. Your next quest will embrace this discovery path.`;
    } else {
      return `Even a partial step outdoors breaks the screen loop.${noteSnippet} Stepping away from devices for ${quest.durationMinutes} minutes is already a victory for your nervous system.`;
    }
  }
}
