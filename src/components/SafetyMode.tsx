import React from 'react';
import { Heart } from 'lucide-react';
import { SafetyResource } from '../types';
import { CRISIS_RESOURCES } from '../utils/constants';
import { Button } from './shared/Button';

interface SafetyModeProps {
  safetyResources: SafetyResource | null;
  onReset: () => void;
}

export const SafetyMode: React.FC<SafetyModeProps> = ({ safetyResources, onReset }) => {
  return (
    <div className="flex-1 p-6 flex items-center justify-center">
      <div className="max-w-2xl text-center space-y-6">
        {/* Crisis Message */}
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-800 mb-3">We're here for you</h3>
          <p className="text-red-700 mb-4">
            {safetyResources?.message || "I'm concerned about what you've shared and want to make sure you're safe."}
          </p>
          <p className="text-red-700">
            Please reach out to someone who can provide immediate support. You don't have to go through this alone.
          </p>
        </div>

        {/* Crisis Resources */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-4">Crisis Resources</h4>
          <div className="space-y-3 text-left">
            {CRISIS_RESOURCES.map((resource, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-blue-800">{resource.name}</p>
                  <p className="text-blue-700">{resource.contact} - {resource.availability}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <Button onClick={onReset} fullWidth>
          Start a new conversation
        </Button>
      </div>
    </div>
  );
};