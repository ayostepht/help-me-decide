import React from 'react';
import { MoodSliderProps } from '../../types';
import { MOOD_LABELS } from '../../utils/constants';

export const Slider: React.FC<MoodSliderProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3">
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-sm text-gray-600">
        {Object.entries(MOOD_LABELS).map(([key, label]) => (
          <span key={key}>{key} - {label}</span>
        ))}
      </div>
      <p className="text-center text-gray-700 font-medium">
        Currently: {value}/5 - {MOOD_LABELS[value as keyof typeof MOOD_LABELS]}
      </p>
    </div>
  );
};