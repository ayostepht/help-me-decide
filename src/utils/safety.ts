import { SAFETY_KEYWORDS } from './constants';
import { SafetyResource } from '../types';

export const checkKeywordFallback = (userMessage: string): boolean => {
  return SAFETY_KEYWORDS.some(keyword => 
    userMessage.toLowerCase().includes(keyword.toLowerCase())
  );
};

export const createSafetyResource = (type: string, customMessage?: string): SafetyResource => {
  const defaultMessage = "I'm concerned about what you've shared and want to make sure you're safe.";
  
  return {
    type: type as SafetyResource['type'],
    message: customMessage || defaultMessage
  };
};

export const getFallbackResponse = (): string => {
  return `That's a thoughtful question! Let me help you think through this decision.

Is there something specific about this situation that's making you feel uncertain, or are you just trying to figure out the best approach?`;
};

export const getFallbackVerdict = () => {
  return {
    recommendation: "Trust yourself",
    reasoning: "Whatever you decide right now is the right choice for you today. Trust your instincts and be gentle with yourself.",
    tips: "Remember that you can always change your mind later, and it's okay to prioritize your mental health.",
    reminder: "You know yourself best."
  };
};