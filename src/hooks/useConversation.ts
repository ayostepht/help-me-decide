import { useState, useCallback, useRef } from 'react';
import { Message, VerdictData, ConversationStep } from '../types';
import { useGeminiAPI } from './useGeminiAPI';
import { createInitialPrompt, createConversationPrompt, createVerdictPrompt } from '../utils/prompts';
import { getFallbackResponse, getFallbackVerdict } from '../utils/safety';
import { GEMINI_CONFIG_FAST, GEMINI_CONFIG_THINKING } from '../utils/constants';

export const useConversation = () => {
  const [currentStep, setCurrentStep] = useState<ConversationStep>('initial');
  const [userSituation, setUserSituation] = useState('');
  const [currentMood, setCurrentMood] = useState(3);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [verdict, setVerdict] = useState<VerdictData | null>(null);
  
  // Prevent concurrent API calls
  const isProcessingRef = useRef(false);

  const { generateAIResponse, generateJSONResponse } = useGeminiAPI();

  const startConversation = useCallback(async (): Promise<void> => {
    if (!userSituation.trim()) return;
    
    // Note: setIsLoading(true) is now handled in DecisionSupportTool component
    setCurrentStep('conversation');
    
    try {
      const initialPrompt = createInitialPrompt(userSituation, currentMood);
      const aiMessage = await generateAIResponse(initialPrompt, GEMINI_CONFIG_FAST);
      
      const newConversation: Message[] = [
        { role: 'user', content: `I'm trying to decide: ${userSituation}` },
        { role: 'assistant', content: aiMessage.response }
      ];
      
      setConversation(newConversation);
    } catch (error) {
      console.error('Error starting conversation:', error);
      const fallbackResponse = getFallbackResponse();
      
      const newConversation: Message[] = [
        { role: 'user', content: `I'm trying to decide: ${userSituation}` },
        { role: 'assistant', content: fallbackResponse }
      ];
      
      setConversation(newConversation);
    }
    
    setIsLoading(false);
  }, [userSituation, currentMood, generateAIResponse]);

  const sendMessage = useCallback(async (): Promise<void> => {
    if (!currentInput.trim() || isLoading || isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    const userMessage = currentInput.trim();
    setCurrentInput('');
    // Note: setIsLoading(true) is now handled in DecisionSupportTool component
    
    const updatedConversation: Message[] = [
      ...conversation,
      { role: 'user', content: userMessage }
    ];
    
    setConversation(updatedConversation);
    
    try {
      const prompt = createConversationPrompt(updatedConversation);
      const aiMessage = await generateAIResponse(prompt, GEMINI_CONFIG_FAST);
      
      const finalConversation: Message[] = [
        ...updatedConversation,
        { role: 'assistant', content: aiMessage.response }
      ];
      
      setConversation(finalConversation);
    } catch (error) {
      console.error('Error sending message:', error);
      const fallbackResponse = "I'm here to support you through this decision. Can you share more about how you're feeling about this situation?";
      
      const finalConversation: Message[] = [
        ...updatedConversation,
        { role: 'assistant', content: fallbackResponse }
      ];
      
      setConversation(finalConversation);
    }
    
    setIsLoading(false);
    isProcessingRef.current = false;
  }, [currentInput, isLoading, conversation, generateAIResponse]);

  const generateVerdict = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const verdictPrompt = createVerdictPrompt(conversation, currentMood);
      const verdictData = await generateJSONResponse<VerdictData>(verdictPrompt, GEMINI_CONFIG_THINKING);
      
      setVerdict(verdictData);
    } catch (error) {
      console.error('Error generating verdict:', error);
      const fallbackVerdict = getFallbackVerdict();
      setVerdict(fallbackVerdict);
    }
    
    setIsLoading(false);
  }, [conversation, currentMood, generateJSONResponse]);

  const reset = useCallback(() => {
    isProcessingRef.current = false;
    setCurrentStep('initial');
    setUserSituation('');
    setCurrentMood(3);
    setConversation([]);
    setCurrentInput('');
    setShowVerdictModal(false);
    setVerdict(null);
  }, []);

  return {
    // State
    currentStep,
    userSituation,
    currentMood,
    conversation,
    isLoading,
    currentInput,
    showVerdictModal,
    verdict,
    
    // Actions
    setUserSituation,
    setCurrentMood,
    setCurrentInput,
    setShowVerdictModal,
    setIsLoading,
    startConversation,
    sendMessage,
    generateVerdict,
    reset
  };
};