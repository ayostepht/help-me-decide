import React from 'react';
import { AlertCircle, RefreshCw, X, Wifi, Clock, AlertTriangle } from 'lucide-react';
import { ErrorType } from '../../types';
import { Button } from './Button';

interface ErrorDisplayProps {
  message: string;
  type: ErrorType;
  canRetry?: boolean;
  isRetrying?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
  className?: string;
}

const getErrorIcon = (type: ErrorType) => {
  switch (type) {
    case 'network':
      return <Wifi className="w-5 h-5" />;
    case 'timeout':
      return <Clock className="w-5 h-5" />;
    case 'api':
    case 'parse':
      return <AlertTriangle className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
};

const getErrorColor = (type: ErrorType) => {
  switch (type) {
    case 'network':
      return 'border-orange-400 bg-orange-50 text-orange-800';
    case 'timeout':
      return 'border-yellow-400 bg-yellow-50 text-yellow-800';
    case 'api':
      return 'border-red-400 bg-red-50 text-red-800';
    case 'parse':
      return 'border-purple-400 bg-purple-50 text-purple-800';
    default:
      return 'border-red-400 bg-red-50 text-red-800';
  }
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  type,
  canRetry = false,
  isRetrying = false,
  onRetry,
  onDismiss,
  compact = false,
  className = ''
}) => {
  const errorColor = getErrorColor(type);
  const errorIcon = getErrorIcon(type);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-3 border-l-4 rounded-r-lg ${errorColor} ${className}`}>
        {errorIcon}
        <span className="text-sm flex-1">{message}</span>
        {canRetry && onRetry && (
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            size="sm"
            className="px-3 py-1 text-xs"
          >
            {isRetrying ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              'Retry'
            )}
          </Button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`border-l-4 rounded-r-lg p-4 ${errorColor} ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {errorIcon}
        </div>
        <div className="flex-1">
          <p className="font-medium mb-1">Something went wrong</p>
          <p className="text-sm mb-3">{message}</p>
          <div className="flex items-center gap-3">
            {canRetry && onRetry && (
              <Button
                onClick={onRetry}
                disabled={isRetrying}
                size="sm"
                variant="secondary"
                className="px-4 py-2"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-sm text-current opacity-70 hover:opacity-100 transition-opacity"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};