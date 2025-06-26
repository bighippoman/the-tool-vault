
export interface PersonaProfile {
  id: string;
  name: string;
  description: string;
  emoji: string;
  era: string;
  field: string;
  personalityTraits: {
    optimism: number;
    directness: number;
    humor: number;
    formality: number;
  };
  favoriteTopics: string[];
  speakingStyle: string;
  historicalContext: string;
  theme: {
    background: string;
    accent: string;
    textColor: string;
    bubbleStyle: string;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  persona?: string;
}
