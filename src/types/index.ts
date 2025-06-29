// Core Types
export type ConversationStep = 'initial' | 'conversation';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface VerdictData {
  recommendation: string;
  reasoning: string;
  tips: string;
  reminder: string;
}

export interface SafetyResource {
  type: 'self-harm' | 'harm-others' | 'harm-animals' | 'general';
  message: string;
}

// Component Props
export interface DecisionSupportToolProps {
  // No props - self-contained component
}

export interface MessageProps {
  message: Message;
  index: number;
}

export interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

// State Interface
export interface AppState {
  currentStep: ConversationStep;
  userSituation: string;
  currentMood: number;
  conversation: Message[];
  isLoading: boolean;
  currentInput: string;
  showVerdictModal: boolean;
  verdict: VerdictData | null;
  safetyMode: boolean;
  safetyResources: SafetyResource | null;
}

// Gemini API Types
export interface GeminiAPIRequest {
  contents: {
    role: 'user';
    parts: {
      text: string;
    }[];
  }[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiAPIResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

// Safety Check Response
export interface SafetyCheckResponse {
  safetyTrigger: boolean;
  type?: 'self-harm' | 'harm-others' | 'harm-animals';
  message?: string;
}

// AI Response Types
export interface AIResponse {
  response: string;
}

// HTTP Error Types
export interface APIError {
  message: string;
  status?: number;
}