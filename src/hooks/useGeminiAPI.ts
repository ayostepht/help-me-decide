import { useCallback } from 'react';
import { GeminiAPIRequest, GeminiAPIResponse, AIResponse, SafetyCheckResponse } from '../types';
import { GEMINI_CONFIG, GEMINI_CONFIG_FAST, GEMINI_CONFIG_THINKING } from '../utils/constants';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const useGeminiAPI = () => {
  const generateContent = useCallback(async (prompt: string, config = GEMINI_CONFIG): Promise<string> => {
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
      generationConfig: config
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

      const candidate = geminiResponse.candidates[0];
      if (!candidate?.content?.parts || candidate.content.parts.length === 0) {
        throw new Error('Invalid response structure from Gemini API');
      }

      const content = candidate.content.parts[0]?.text;
      if (!content) {
        throw new Error('No text content in Gemini API response');
      }
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

  const generateJSONResponse = useCallback(async <T>(prompt: string, config = GEMINI_CONFIG): Promise<T> => {
    const content = await generateContent(prompt, config);
    try {
      const cleanedContent = cleanJSONResponse(content);
      
      // Check if the cleaned content looks like valid JSON before parsing
      if (!cleanedContent.trim().startsWith('{') && !cleanedContent.trim().startsWith('[')) {
        throw new Error('Response does not appear to be JSON format');
      }
      
      return JSON.parse(cleanedContent) as T;
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Original Content:', content);
      console.error('Cleaned Content:', cleanJSONResponse(content));
      
      // If JSON is truncated or has parsing issues, request again with stricter prompt
      if (parseError instanceof SyntaxError) {
        console.warn('JSON parsing failed, trying with stricter prompt...');
        const stricterPrompt = prompt + '\n\nIMPORTANT: Ensure all quotes and apostrophes in your response text are properly escaped for valid JSON. Use \\" for quotes within strings.';
        
        try {
          const retryContent = await generateContent(stricterPrompt, config);
          const retryCleanedContent = cleanJSONResponse(retryContent);
          return JSON.parse(retryCleanedContent) as T;
        } catch (retryError) {
          console.error('Retry also failed:', retryError);
        }
      }
      
      throw new Error('Failed to parse JSON response from Gemini API');
    }
  }, [generateContent]);

  const generateAIResponse = useCallback(async (prompt: string, config = GEMINI_CONFIG): Promise<AIResponse> => {
    return generateJSONResponse<AIResponse>(prompt, config);
  }, [generateJSONResponse]);

  const generateSafetyCheck = useCallback(async (prompt: string, config = GEMINI_CONFIG): Promise<SafetyCheckResponse> => {
    return generateJSONResponse<SafetyCheckResponse>(prompt, config);
  }, [generateJSONResponse]);

  return {
    generateContent,
    generateJSONResponse,
    generateAIResponse,
    generateSafetyCheck
  };
};