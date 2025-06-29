import React from 'react';
import { Brain, Heart, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from './shared/Button';
import { Input } from './shared/Input';
import { Slider } from './shared/Slider';

interface InitialAssessmentProps {
  userSituation: string;
  setUserSituation: (situation: string) => void;
  currentMood: number;
  setCurrentMood: (mood: number) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const InitialAssessment: React.FC<InitialAssessmentProps> = ({
  userSituation,
  setUserSituation,
  currentMood,
  setCurrentMood,
  onSubmit,
  isLoading,
  onKeyPress
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-blue-600" />
            <Heart className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Decision Support</h1>
          <p className="text-gray-600 text-lg">
            A gentle space to work through decisions when things feel overwhelming
          </p>
        </div>

        <div className="space-y-6">
          <Input
            label="What decision are you trying to make?"
            value={userSituation}
            onChange={(e) => setUserSituation(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Describe the situation you're facing. It could be about work, social plans, personal tasks, self-care, or anything else you're uncertain about..."
            className="h-32"
          />

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3">
              How are you feeling today?
            </label>
            <Slider value={currentMood} onChange={setCurrentMood} />
          </div>

          <Button
            onClick={onSubmit}
            disabled={!userSituation.trim() || isLoading}
            fullWidth
            size="lg"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Start Conversation
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-1">How this works</h3>
              <p className="text-blue-700 text-sm">
                I'll help you explore your situation through gentle questions, understand your feelings, 
                and work together to find a decision that feels right for you and your current capacity.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            🔒 Your conversations are private and not saved or stored anywhere
          </p>
        </div>
      </div>
    </div>
  );
};