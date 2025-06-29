// Mood Labels
export const MOOD_LABELS = {
  1: 'Very low',
  2: 'Below average',
  3: 'Okay',
  4: 'Good',
  5: 'Great'
} as const;

// Safety Keywords for Fallback Detection
export const SAFETY_KEYWORDS = [
  'kill', 'die', 'suicide', 'hurt myself', 'end it', 
  'not worth living', 'hurt someone', 'hurt them', 
  'violence', 'attack', 'hurt animal', 'kill animal', 'abuse'
] as const;

// Crisis Resources
export const CRISIS_RESOURCES = [
  {
    name: 'National Suicide Prevention Lifeline',
    contact: 'Call or text 988',
    availability: 'Available 24/7'
  },
  {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    availability: '24/7'
  },
  {
    name: 'Emergency Services',
    contact: 'Call 911',
    availability: 'For immediate help'
  }
] as const;

// API Configuration
export const GEMINI_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.9,
  maxOutputTokens: 2048
} as const;