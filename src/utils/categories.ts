import { QuestCategory, QuestDifficulty, QuestEnvironment } from '../types/quest';

export interface CategoryMeta {
  id: QuestCategory;
  name: string;
  tagline: string;
  iconName: string;
  fieldTip: string;
  color: string;
}

export const CATEGORIES: Record<QuestCategory, CategoryMeta> = {
  nature_detective: {
    id: 'nature_detective',
    name: 'Nature Detective',
    tagline: 'Spot hidden clues, animal signs, and ecological traces',
    iconName: 'Compass',
    fieldTip: 'Look for chewing marks on leaves, tracks in damp mud, or hollowed twigs.',
    color: '#3d6132',
  },
  movement: {
    id: 'movement',
    name: 'Movement & Wandering',
    tagline: 'Walk briskly, explore unfamiliar corners, and stretch your legs',
    iconName: 'Footprints',
    fieldTip: 'Pace yourself by landmarks rather than counting steps on a screen.',
    color: '#654e2f',
  },
  sensory: {
    id: 'sensory',
    name: 'Sensory Exploration',
    tagline: 'Tune into touch, natural aromas, wind sounds, and micro-textures',
    iconName: 'Ear',
    fieldTip: 'Close your eyes for 30 seconds at a time to expand your acoustic sphere.',
    color: '#4a5d3f',
  },
  biodiversity: {
    id: 'biodiversity',
    name: 'Biodiversity Hunt',
    tagline: 'Catalog contrasting leaf species, insects, lichen, and fungi',
    iconName: 'Sparkles',
    fieldTip: 'Count distinct leaf margins (serrated vs smooth vs lobed) within one square meter.',
    color: '#2e5b3f',
  },
  photography: {
    id: 'photography',
    name: 'Field Photography',
    tagline: 'Capture 3 intentional outdoor frames, then pocket your camera',
    iconName: 'Camera',
    fieldTip: 'Observe a subject for 2 full minutes before taking a single deliberate shot.',
    color: '#4e5648',
  },
  mindful_observation: {
    id: 'mindful_observation',
    name: 'Mindful Observation',
    tagline: 'Sit beneath a canopy, observe shifting light, and breathe deep',
    iconName: 'Sun',
    fieldTip: 'Find a natural perch and watch the canopy move with the wind without speaking.',
    color: '#415749',
  },
  neighborhood_discovery: {
    id: 'neighborhood_discovery',
    name: 'Neighborhood Discovery',
    tagline: 'Uncover pocket gardens, street trees, and resilient urban flora',
    iconName: 'MapPin',
    fieldTip: 'Turn down the street you normally bypass. Notice weeds flowering in stone cracks.',
    color: '#5c4838',
  },
  social: {
    id: 'social',
    name: 'Companion Quest',
    tagline: 'Share a walk with a friend, neighbor, dog, or family member',
    iconName: 'Users',
    fieldTip: 'Compare what each person notices first when entering a new clearing.',
    color: '#3a5035',
  },
  garden: {
    id: 'garden',
    name: 'Garden & Soil',
    tagline: 'Examine compost, earthworms, root tendrils, and flowering stages',
    iconName: 'Flower2',
    fieldTip: 'Gently feel soil moisture beneath leaf mulch with your fingertips.',
    color: '#44662d',
  },
  weather_seasonal: {
    id: 'weather_seasonal',
    name: 'Seasonal Transition',
    tagline: 'Note temperature shifts, seasonal color changes, and cloud patterns',
    iconName: 'CloudSun',
    fieldTip: 'Notice the angle of shadows and which deciduous trees have shed their leaves.',
    color: '#3c5a61',
  },
};

export const ENVIRONMENT_NAMES: Record<QuestEnvironment, { name: string; description: string }> = {
  park: { name: 'Public Park / Green Space', description: 'Lawns, groves, benches, and urban wildlife' },
  neighborhood: { name: 'Neighborhood Streets', description: 'Sidewalks, gardens, alleyways, and street trees' },
  garden: { name: 'Garden / Backyard', description: 'Cultivated beds, planters, compost, and micro-fauna' },
  trail: { name: 'Nature Trail / Forest', description: 'Unpaved paths, denser canopy, and wild terrain' },
  anywhere: { name: 'Any Outdoor Spot', description: 'Balcony, doorstep, courtyard, or sidewalk' },
};

export const DIFFICULTY_NAMES: Record<QuestDifficulty, { label: string; desc: string }> = {
  beginner: { label: 'Gentle Walk', desc: 'Accessible, light observation, within 500m' },
  explorer: { label: 'Curious Explorer', desc: 'Active searching, varied textures, slight detours' },
  challenge: { label: 'Field Naturalist', desc: 'Deeper focus, patient tracking, subtle patterns' },
};

export const UNIVERSAL_SAFETY_GUIDELINES = [
  'Never trespass or enter private or restricted grounds.',
  'Do not consume any wild plants, berries, or mushrooms.',
  'Observe wildlife from a respectful distance without approaching or feeding.',
  'Stay aware of vehicular traffic and uneven terrain.',
  'Dress appropriately for the weather and stay hydrated.',
];
