import { useState, useCallback } from 'react';
import { ErrorState, RetryConfig } from '../types';
import { createAppError, categorizeError, withRetry, DEFAULT_RETRY_CONFIG } from '../utils/errorHandling';

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    retryCount: 0,
    isRetrying: false
  });

  // Clear error state
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false
    });
  }, []);

  // Handle error with proper categorization
  const handleError = useCallback((error: any, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    const errorType = categorizeError(error);
    const appError = createAppError(
      errorType,
      error.message || 'Unknown error occurred',
      { originalError: error, context }
    );

    setErrorState(prev => ({
      hasError: true,
      error: appError,
      retryCount: prev.retryCount,
      isRetrying: false
    }));

    return appError;
  }, []);

  // Execute function with error handling and retry logic
  const executeWithErrorHandling = useCallback(async <T>(
    fn: () => Promise<T>,
    context: string,
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
  ): Promise<T | null> => {
    try {
      clearError();
      
      const result = await withRetry(fn, retryConfig);
      return result;
    } catch (error) {
      handleError(error, context);
      return null;
    }
  }, [clearError, handleError]);

  // Retry the last failed operation
  const retry = useCallback(async <T>(
    fn: () => Promise<T>,
    context: string
  ): Promise<T | null> => {
    if (!errorState.error?.retryable) {
      return null;
    }

    setErrorState(prev => ({
      ...prev,
      isRetrying: true,
      retryCount: prev.retryCount + 1
    }));

    try {
      const result = await fn();
      clearError();
      return result;
    } catch (error) {
      const appError = handleError(error, `${context} (retry ${errorState.retryCount + 1})`);
      setErrorState(prev => ({
        ...prev,
        isRetrying: false,
        error: appError
      }));
      return null;
    }
  }, [errorState.error?.retryable, errorState.retryCount, clearError, handleError]);

  // Check if we should show retry button
  const canRetry = useCallback(() => {
    return errorState.hasError && 
           errorState.error?.retryable === true && 
           errorState.retryCount < 3 && 
           !errorState.isRetrying;
  }, [errorState]);

  // Get error display information
  const getErrorInfo = useCallback(() => {
    if (!errorState.hasError || !errorState.error) {
      return null;
    }

    return {
      message: errorState.error.userMessage,
      type: errorState.error.type,
      canRetry: canRetry(),
      isRetrying: errorState.isRetrying,
      retryCount: errorState.retryCount,
      timestamp: errorState.error.timestamp
    };
  }, [errorState, canRetry]);

  return {
    errorState,
    clearError,
    handleError,
    executeWithErrorHandling,
    retry,
    canRetry,
    getErrorInfo
  };
};