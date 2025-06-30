import { AppError, ErrorType, RetryConfig } from '../types';

// Default retry configuration
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2
};

// Create an AppError with appropriate user messaging
export const createAppError = (
  type: ErrorType,
  message: string,
  details?: any
): AppError => {
  const userMessages: Record<ErrorType, string> = {
    network: "Connection issue detected. Please check your internet connection and try again.",
    timeout: "The request is taking longer than expected. Please try again.",
    api: "There was an issue with the AI service. Please try again in a moment.",
    parse: "There was an issue processing the response. Please try again.",
    validation: "Please check your input and try again.",
    unknown: "Something unexpected happened. Please try again."
  };

  const retryableErrors: ErrorType[] = ['network', 'timeout', 'api'];
  const recoverableErrors: ErrorType[] = ['network', 'timeout', 'api', 'parse'];

  return {
    type,
    message,
    userMessage: userMessages[type],
    recoverable: recoverableErrors.includes(type),
    retryable: retryableErrors.includes(type),
    timestamp: new Date(),
    details
  };
};

// Categorize error based on error object or message
export const categorizeError = (error: any): ErrorType => {
  if (!error) return 'unknown';

  const errorMessage = error.message?.toLowerCase() || '';
  
  // Network-related errors
  if (
    error.name === 'TypeError' && errorMessage.includes('fetch') ||
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('offline')
  ) {
    return 'network';
  }

  // Timeout errors
  if (
    error.name === 'AbortError' ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('aborted')
  ) {
    return 'timeout';
  }

  // API errors
  if (
    error.status >= 400 ||
    errorMessage.includes('http') ||
    errorMessage.includes('api') ||
    errorMessage.includes('gemini')
  ) {
    return 'api';
  }

  // Parse errors
  if (
    error instanceof SyntaxError ||
    errorMessage.includes('parse') ||
    errorMessage.includes('json')
  ) {
    return 'parse';
  }

  // Validation errors
  if (errorMessage.includes('validation')) {
    return 'validation';
  }

  return 'unknown';
};

// Sleep utility for retry delays
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry wrapper with exponential backoff
export const withRetry = async <T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      const errorType = categorizeError(error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const appError = createAppError(errorType, errorMessage, error);
      
      // Don't retry if error is not retryable or this is the last attempt
      if (!appError.retryable || attempt === config.maxAttempts) {
        throw appError;
      }
      
      // Calculate delay with exponential backoff
      const delay = config.delayMs * Math.pow(config.backoffMultiplier, attempt - 1);
      await sleep(delay);
    }
  }
  
  throw lastError;
};

// Check if error is recoverable
export const isRecoverableError = (error: AppError): boolean => {
  return error.recoverable;
};

// Check if error is retryable
export const isRetryableError = (error: AppError): boolean => {
  return error.retryable;
};

// Get user-friendly error message
export const getUserErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && error !== null && 'userMessage' in error) {
    return (error as any).userMessage;
  }
  
  const errorType = categorizeError(error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const appError = createAppError(errorType, errorMessage);
  return appError.userMessage;
};