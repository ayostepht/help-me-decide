import { useCallback } from 'react';
import { GeminiAPIRequest, GeminiAPIResponse, AIResponse, SafetyCheckResponse } from '../types';
import { GEMINI_CONFIG } from '../utils/constants';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const useGeminiAPI = () => {
  const generateContent = useCallback(async (prompt: string): Promise<string> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment variables.');
    }

    const request: GeminiAPIRequest = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: GEMINI_CONFIG
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      // Check for API error response
      if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message}`);
      }
      
      // Type assertion after error check
      const geminiResponse = data as GeminiAPIResponse;
      
      if (!geminiResponse.candidates || geminiResponse.candidates.length === 0) {
        throw new Error('No response generated from Gemini API');
      }

      const content = geminiResponse.candidates[0].content.parts[0].text;
      return content;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }, []);

  const cleanJSONResponse = (content: string): string => {
    // Remove markdown code blocks if present
    let cleaned = content.trim();
    
    // Remove opening ```json or ``` tags
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    
    // Remove closing ``` tags
    cleaned = cleaned.replace(/\s*```\s*$/, '');
    
    return cleaned.trim();
  };

  const generateJSONResponse = useCallback(async <T>(prompt: string): Promise<T> => {
    const content = await generateContent(prompt);
    try {
      const cleanedContent = cleanJSONResponse(content);
      return JSON.parse(cleanedContent) as T;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Original Content:', content);
      throw new Error('Failed to parse JSON response from Gemini API');
    }
  }, [generateContent]);

  const generateAIResponse = useCallback(async (prompt: string): Promise<AIResponse> => {
    return generateJSONResponse<AIResponse>(prompt);
  }, [generateJSONResponse]);

  const generateSafetyCheck = useCallback(async (prompt: string): Promise<SafetyCheckResponse> => {
    return generateJSONResponse<SafetyCheckResponse>(prompt);
  }, [generateJSONResponse]);

  return {
    generateContent,
    generateJSONResponse,
    generateAIResponse,
    generateSafetyCheck
  };
};