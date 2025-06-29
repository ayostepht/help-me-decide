import React from 'react';

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  const baseClasses = 'w-full p-4 border-2 rounded-lg focus:outline-none resize-y text-gray-700 transition-colors min-h-[8rem] max-h-64';
  const stateClasses = error 
    ? 'border-red-300 focus:border-red-500' 
    : 'border-gray-200 focus:border-blue-500';
  
  const combinedClasses = `${baseClasses} ${stateClasses} ${className}`.trim();
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-lg font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={combinedClasses}
        {...props}
      />
      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
};