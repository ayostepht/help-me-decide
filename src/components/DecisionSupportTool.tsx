import React, { useCallback } from 'react';
import { InitialAssessment } from './InitialAssessment';
import { ConversationInterface } from './ConversationInterface';
import { VerdictModal } from './VerdictModal';
import { SafetyMode } from './SafetyMode';
import { useConversation } from '../hooks/useConversation';
import { useSafetyCheck } from '../hooks/useSafetyCheck';

export const DecisionSupportTool: React.FC = () => {
  const {
    currentStep,
    userSituation,
    currentMood,
    conversation,
    isLoading,
    currentInput,
    showVerdictModal,
    verdict,
    setUserSituation,
    setCurrentMood,
    setCurrentInput,
    setShowVerdictModal,
    setIsLoading,
    startConversation,
    sendMessage,
    generateVerdict,
    reset
  } = useConversation();

  const {
    safetyMode,
    safetyResources,
    checkForSafetyTriggers,
    resetSafetyMode
  } = useSafetyCheck();

  const handleInitialSubmit = useCallback(async () => {
    if (!userSituation.trim()) return;
    
    // Set loading immediately for instant feedback
    setIsLoading(true);
    
    try {
      const hasSafetyTrigger = await checkForSafetyTriggers(userSituation);
      if (!hasSafetyTrigger) {
        await startConversation();
      } else {
        // If safety triggered, reset loading since we won't proceed
        setIsLoading(false);
      }
    } catch (error) {
      // Reset loading on error
      setIsLoading(false);
      console.error('Error in initial submit:', error);
    }
  }, [userSituation, checkForSafetyTriggers, startConversation, setIsLoading]);

  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim() || isLoading) return;
    
    // Set loading immediately for instant feedback
    setIsLoading(true);
    
    try {
      const hasSafetyTrigger = await checkForSafetyTriggers(currentInput);
      if (!hasSafetyTrigger) {
        await sendMessage();
      } else {
        // If safety triggered, reset loading since we won't proceed
        setIsLoading(false);
      }
    } catch (error) {
      // Reset loading on error
      setIsLoading(false);
      console.error('Error in send message:', error);
    }
  }, [currentInput, isLoading, checkForSafetyTriggers, sendMessage, setIsLoading]);

  const handleDecideButton = useCallback(() => {
    if (safetyMode) return;
    setShowVerdictModal(true);
    generateVerdict();
  }, [safetyMode, setShowVerdictModal, generateVerdict]);

  const handleReset = useCallback(() => {
    reset();
    resetSafetyMode();
  }, [reset, resetSafetyMode]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentStep === 'initial') {
        handleInitialSubmit();
      } else {
        handleSendMessage();
      }
    }
  }, [currentStep, handleInitialSubmit, handleSendMessage]);

  // Initial Assessment Screen
  if (currentStep === 'initial') {
    return (
      <InitialAssessment
        userSituation={userSituation}
        setUserSituation={setUserSituation}
        currentMood={currentMood}
        setCurrentMood={setCurrentMood}
        onSubmit={handleInitialSubmit}
        isLoading={isLoading}
        onKeyPress={handleKeyPress}
      />
    );
  }

  // Conversation Screen
  return (
    <>
      <ConversationInterface
        conversation={conversation}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        onSendMessage={handleSendMessage}
        onDecide={handleDecideButton}
        onReset={handleReset}
        onKeyPress={handleKeyPress}
        isLoading={isLoading}
        showVerdictModal={showVerdictModal}
      />

      {/* Safety Mode Overlay */}
      {safetyMode && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 p-6 z-50">
          <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-3rem)] flex flex-col max-w-4xl mx-auto">
            <SafetyMode
              safetyResources={safetyResources}
              onReset={handleReset}
            />
          </div>
        </div>
      )}

      {/* Verdict Modal */}
      <VerdictModal
        isOpen={showVerdictModal}
        verdict={verdict}
        isLoading={isLoading}
        onClose={() => setShowVerdictModal(false)}
        onContinue={() => setShowVerdictModal(false)}
        onReset={handleReset}
      />
    </>
  );
};