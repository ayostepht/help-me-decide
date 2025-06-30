import React, { useId } from 'react';

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  description?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  description,
  className = '',
  ...props
}) => {
  const id = useId();
  const errorId = useId();
  const descriptionId = useId();
  
  const baseClasses = 'w-full p-4 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 resize-y text-gray-700 transition-all min-h-[8rem] max-h-64';
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200';
  
  const combinedClasses = `${baseClasses} ${stateClasses} ${className}`.trim();
  
  // Build aria-describedby from available descriptions
  const describedByIds = [
    description ? descriptionId : '',
    error ? errorId : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id}
          className="block text-lg font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      {description && (
        <p 
          id={descriptionId}
          className="text-sm text-gray-600"
        >
          {description}
        </p>
      )}
      <textarea
        id={id}
        className={combinedClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedByIds || undefined}
        {...props}
      />
      {error && (
        <p 
          id={errorId}
          className="text-red-600 text-sm flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};