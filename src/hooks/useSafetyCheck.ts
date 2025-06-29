import { useState, useCallback } from 'react';
import { SafetyResource } from '../types';
import { useGeminiAPI } from './useGeminiAPI';
import { createSafetyCheckPrompt } from '../utils/prompts';
import { checkKeywordFallback, createSafetyResource } from '../utils/safety';

export const useSafetyCheck = () => {
  const [safetyMode, setSafetyMode] = useState(false);
  const [safetyResources, setSafetyResources] = useState<SafetyResource | null>(null);
  const { generateSafetyCheck } = useGeminiAPI();

  const checkForSafetyTriggers = useCallback(async (userMessage: string): Promise<boolean> => {
    try {
      const safetyPrompt = createSafetyCheckPrompt(userMessage);
      const safetyCheck = await generateSafetyCheck(safetyPrompt);
      
      if (safetyCheck.safetyTrigger) {
        const resource = createSafetyResource(
          safetyCheck.type || 'general',
          safetyCheck.message
        );
        
        setSafetyMode(true);
        setSafetyResources(resource);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Safety check error:', error);
      
      // Fallback to keyword-based detection
      const hasHarmKeywords = checkKeywordFallback(userMessage);
      
      if (hasHarmKeywords) {
        const resource = createSafetyResource('general');
        setSafetyMode(true);
        setSafetyResources(resource);
        return true;
      }
      return false;
    }
  }, [generateSafetyCheck]);

  const resetSafetyMode = useCallback(() => {
    setSafetyMode(false);
    setSafetyResources(null);
  }, []);

  return {
    safetyMode,
    safetyResources,
    checkForSafetyTriggers,
    resetSafetyMode
  };
};