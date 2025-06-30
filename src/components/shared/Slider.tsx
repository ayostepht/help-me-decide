import React, { useId } from 'react';
import { MoodSliderProps } from '../../types';
import { MOOD_LABELS } from '../../utils/constants';

export const Slider: React.FC<MoodSliderProps> = ({ value, onChange }) => {
  const id = useId();
  const labelsId = useId();
  const currentValueId = useId();
  
  const currentLabel = MOOD_LABELS[value as keyof typeof MOOD_LABELS];
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (value > 1) onChange(value - 1);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (value < 5) onChange(value + 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(1);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(5);
    }
  };
  
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="sr-only">
        Current mood level
      </label>
      <input
        id={id}
        type="range"
        min="1"
        max="5"
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        onKeyDown={handleKeyDown}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Mood level"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={value}
        aria-valuetext={`${value} out of 5 - ${currentLabel}`}
        aria-describedby={`${labelsId} ${currentValueId}`}
        role="slider"
      />
      <div 
        id={labelsId}
        className="flex justify-between text-sm text-gray-600"
        aria-label="Mood scale labels"
      >
        {Object.entries(MOOD_LABELS).map(([key, label]) => (
          <span key={key} aria-hidden="true">{key} - {label}</span>
        ))}
      </div>
      <p 
        id={currentValueId}
        className="text-center text-gray-700 font-medium"
        aria-live="polite"
        role="status"
      >
        Currently: {value}/5 - {currentLabel}
      </p>
    </div>
  );
};