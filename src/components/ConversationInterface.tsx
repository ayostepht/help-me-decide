import React from 'react';
import { MessageCircle, RotateCcw, Send, User, Bot, Brain } from 'lucide-react';
import { Message } from '../types';
import { Button } from './shared/Button';

interface ConversationInterfaceProps {
  conversation: Message[];
  currentInput: string;
  setCurrentInput: (input: string) => void;
  onSendMessage: () => void;
  onDecide: () => void;
  onReset: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  showVerdictModal: boolean;
}

export const ConversationInterface: React.FC<ConversationInterfaceProps> = ({
  conversation,
  currentInput,
  setCurrentInput,
  onSendMessage,
  onDecide,
  onReset,
  onKeyPress,
  isLoading,
  showVerdictModal
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-3rem)] flex flex-col max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Decision Support Conversation</h2>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 text-gray-800 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3 mb-3">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Share your thoughts or answer the question above..."
              className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-y min-h-[3rem] max-h-48"
            />
            <button
              onClick={onSendMessage}
              disabled={!currentInput.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
            <p className="text-xs text-gray-400">🔒 Not stored</p>
          </div>
          {conversation.length > 0 && !showVerdictModal && (
            <Button
              onClick={onDecide}
              disabled={isLoading}
              fullWidth
              className="flex flex-col items-center gap-1 text-sm"
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                <span className="font-medium">Ready to decide?</span>
              </div>
              <span className="text-xs text-blue-100">Get my recommendation</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};