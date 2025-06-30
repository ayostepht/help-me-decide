import React, { useEffect } from 'react';
import { Heart } from 'lucide-react';
import { SafetyResource } from '../types';
import { CRISIS_RESOURCES } from '../utils/constants';
import { Button } from './shared/Button';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface SafetyModeProps {
  safetyResources: SafetyResource | null;
  onReset: () => void;
}

export const SafetyMode: React.FC<SafetyModeProps> = ({ safetyResources, onReset }) => {
  const safetyRef = useFocusTrap({ isActive: true, autoFocus: true });
  
  // Announce to screen readers that safety mode is active
  useEffect(() => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Safety mode activated. Crisis resources are displayed. Please seek immediate help if needed.';
    document.body.appendChild(announcement);
    
    return () => {
      document.body.removeChild(announcement);
    };
  }, []);

  return (
    <div 
      className="flex-1 p-6 flex items-center justify-center"
      role="alert"
      aria-live="assertive"
    >
      <div 
        ref={safetyRef}
        className="max-w-2xl text-center space-y-6"
        tabIndex={-1}
        role="main"
      >
        {/* Crisis Message */}
        <section 
          className="p-6 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
          aria-labelledby="safety-heading"
        >
          <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" aria-hidden="true" />
          <h1 id="safety-heading" className="text-xl font-bold text-red-800 mb-3">
            We're here for you
          </h1>
          <p className="text-red-700 mb-4">
            {safetyResources?.message || "I'm concerned about what you've shared and want to make sure you're safe."}
          </p>
          <p className="text-red-700">
            Please reach out to someone who can provide immediate support. You don't have to go through this alone.
          </p>
        </section>

        {/* Crisis Resources */}
        <section 
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
          aria-labelledby="crisis-resources-heading"
        >
          <h2 id="crisis-resources-heading" className="text-lg font-semibold text-blue-800 mb-4">
            Crisis Resources
          </h2>
          <ul className="space-y-3 text-left" role="list">
            {CRISIS_RESOURCES.map((resource, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full" aria-hidden="true"></div>
                <div>
                  <p className="font-medium text-blue-800">
                    <strong>{resource.name}</strong>
                  </p>
                  <p className="text-blue-700">
                    <span className="font-medium">{resource.contact}</span>
                    <span className="mx-1">-</span>
                    <span>{resource.availability}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Reset Button */}
        <Button 
          onClick={onReset} 
          fullWidth
          aria-describedby="reset-help"
        >
          Start a new conversation
        </Button>
        
        <p id="reset-help" className="sr-only">
          This will clear the current conversation and return to the initial assessment
        </p>
      </div>
    </div>
  );
};