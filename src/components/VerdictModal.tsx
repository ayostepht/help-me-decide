import React, { useEffect } from 'react';
import { Brain, X } from 'lucide-react';
import { VerdictData } from '../types';
import { Button } from './shared/Button';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface VerdictModalProps {
  isOpen: boolean;
  verdict: VerdictData | null;
  isLoading: boolean;
  onClose: () => void;
  onContinue: () => void;
  onReset: () => void;
}

export const VerdictModal: React.FC<VerdictModalProps> = ({
  isOpen,
  verdict,
  isLoading,
  onClose,
  onContinue,
  onReset
}) => {
  const modalRef = useFocusTrap({ isActive: isOpen });

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="verdict-modal-title"
      aria-describedby="verdict-modal-description"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        role="document"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg" aria-hidden="true">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h2 
              id="verdict-modal-title" 
              className="text-2xl font-bold text-gray-800"
            >
              Your Personalized Recommendation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Close recommendation modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6" id="verdict-modal-description">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div 
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"
                aria-hidden="true"
              ></div>
              <p className="text-gray-600" role="status" aria-live="polite">
                Thinking through your situation...
              </p>
            </div>
          ) : verdict ? (
            <div className="space-y-6" role="main">
              {/* Recommendation */}
              <section className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  My recommendation: {verdict.recommendation}
                </h3>
                <p className="text-green-700 leading-relaxed">{verdict.reasoning}</p>
              </section>

              {/* Tips */}
              <section className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Moving forward:</h3>
                <p className="text-blue-700 leading-relaxed">{verdict.tips}</p>
              </section>

              {/* Reminder */}
              <section className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Remember:</h3>
                <p className="text-purple-700 leading-relaxed">{verdict.reminder}</p>
              </section>

              {/* Actions */}
              <div className="flex gap-3 pt-4" role="group" aria-label="Verdict actions">
                <Button 
                  onClick={onContinue} 
                  fullWidth
                  aria-describedby="continue-description"
                >
                  Continue conversation
                </Button>
                <Button 
                  onClick={onReset} 
                  variant="secondary" 
                  className="px-6"
                  aria-describedby="reset-description"
                >
                  Start over
                </Button>
              </div>
              
              {/* Screen reader descriptions for actions */}
              <div className="sr-only">
                <p id="continue-description">
                  Continue the conversation to explore your decision further
                </p>
                <p id="reset-description">
                  Start a new conversation with a different situation
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};