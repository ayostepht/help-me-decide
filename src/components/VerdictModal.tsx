import React from 'react';
import { Brain, X } from 'lucide-react';
import { VerdictData } from '../types';
import { Button } from './shared/Button';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your Personalized Recommendation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Thinking through your situation...</p>
            </div>
          ) : verdict ? (
            <div className="space-y-6">
              {/* Recommendation */}
              <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  My recommendation: {verdict.recommendation}
                </h3>
                <p className="text-green-700 leading-relaxed">{verdict.reasoning}</p>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Moving forward:</h3>
                <p className="text-blue-700 leading-relaxed">{verdict.tips}</p>
              </div>

              {/* Reminder */}
              <div className="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-r-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Remember:</h3>
                <p className="text-purple-700 leading-relaxed">{verdict.reminder}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button onClick={onContinue} fullWidth>
                  Continue conversation
                </Button>
                <Button onClick={onReset} variant="secondary" className="px-6">
                  Start over
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};