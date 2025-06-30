import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
  icon?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className = '',
  icon = true
}) => {
  return (
    <div className={`flex items-center gap-2 text-red-600 text-sm ${className}`}>
      {icon && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
      <span>{message}</span>
    </div>
  );
};