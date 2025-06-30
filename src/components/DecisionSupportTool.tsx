import React, { useCallback, lazy, Suspense } from 'react';
import { InitialAssessment } from './InitialAssessment';
import { ConversationInterface } from './ConversationInterface';
import { ErrorDisplay } from './shared/ErrorDisplay';
import { useConversation } from '../hooks/useConversation';
import { useSafetyCheck } from '../hooks/useSafetyCheck';
import { useErrorHandler } from '../hooks/useErrorHandler';

// Lazy load components that are not immediately needed
const VerdictModal = lazy(() => import('./VerdictModal').then(module => ({ default: module.VerdictModal })));
const SafetyMode = lazy(() => import('./SafetyMode').then(module => ({ default: module.SafetyMode })));

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

  const {
    clearError,
    executeWithErrorHandling,
    retry,
    getErrorInfo
  } = useErrorHandler();

  const handleInitialSubmit = useCallback(async () => {
    if (!userSituation.trim()) return;
    
    clearError();
    setIsLoading(true);
    
    await executeWithErrorHandling(async () => {
      const hasSafetyTrigger = await checkForSafetyTriggers(userSituation);
      if (!hasSafetyTrigger) {
        await startConversation();
      }
      return hasSafetyTrigger;
    }, 'initial submission');
    
    setIsLoading(false);
  }, [userSituation, checkForSafetyTriggers, startConversation, setIsLoading, clearError, executeWithErrorHandling]);

  const handleSendMessage = useCallback(async () => {
    if (!currentInput.trim() || isLoading) return;
    
    clearError();
    setIsLoading(true);
    
    await executeWithErrorHandling(async () => {
      const hasSafetyTrigger = await checkForSafetyTriggers(currentInput);
      if (!hasSafetyTrigger) {
        await sendMessage();
      }
      return hasSafetyTrigger;
    }, 'sending message');
    
    setIsLoading(false);
  }, [currentInput, isLoading, checkForSafetyTriggers, sendMessage, setIsLoading, clearError, executeWithErrorHandling]);

  const handleDecideButton = useCallback(() => {
    if (safetyMode) return;
    setShowVerdictModal(true);
    generateVerdict();
  }, [safetyMode, setShowVerdictModal, generateVerdict]);

  const handleReset = useCallback(() => {
    reset();
    resetSafetyMode();
    clearError();
  }, [reset, resetSafetyMode, clearError]);

  const handleRetryInitialSubmit = useCallback(async () => {
    await retry(async () => {
      const hasSafetyTrigger = await checkForSafetyTriggers(userSituation);
      if (!hasSafetyTrigger) {
        await startConversation();
      }
      return hasSafetyTrigger;
    }, 'initial submission retry');
  }, [retry, checkForSafetyTriggers, userSituation, startConversation]);

  const handleRetrySendMessage = useCallback(async () => {
    await retry(async () => {
      const hasSafetyTrigger = await checkForSafetyTriggers(currentInput);
      if (!hasSafetyTrigger) {
        await sendMessage();
      }
      return hasSafetyTrigger;
    }, 'send message retry');
  }, [retry, checkForSafetyTriggers, currentInput, sendMessage]);

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
    const errorInfo = getErrorInfo();
    
    return (
      <div className="space-y-4">
        <InitialAssessment
          userSituation={userSituation}
          setUserSituation={setUserSituation}
          currentMood={currentMood}
          setCurrentMood={setCurrentMood}
          onSubmit={handleInitialSubmit}
          isLoading={isLoading}
          onKeyPress={handleKeyPress}
        />
        {errorInfo && (
          <div className="max-w-4xl mx-auto px-6">
            <ErrorDisplay
              message={errorInfo.message}
              type={errorInfo.type}
              canRetry={errorInfo.canRetry}
              isRetrying={errorInfo.isRetrying}
              onRetry={handleRetryInitialSubmit}
              onDismiss={clearError}
              compact
            />
          </div>
        )}
      </div>
    );
  }

  // Conversation Screen
  const errorInfo = getErrorInfo();
  
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
        errorInfo={errorInfo}
        onRetryMessage={handleRetrySendMessage}
        onClearError={clearError}
      />

      {/* Safety Mode Overlay */}
      {safetyMode && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 p-6 z-50">
          <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-3rem)] flex flex-col max-w-4xl mx-auto">
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
              <SafetyMode
                safetyResources={safetyResources}
                onReset={handleReset}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Verdict Modal */}
      <Suspense fallback={null}>
        <VerdictModal
          isOpen={showVerdictModal}
          verdict={verdict}
          isLoading={isLoading}
          onClose={() => setShowVerdictModal(false)}
          onContinue={() => setShowVerdictModal(false)}
          onReset={handleReset}
        />
      </Suspense>
    </>
  );
};