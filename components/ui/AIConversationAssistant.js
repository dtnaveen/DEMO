'use client';

import { useState, useEffect } from 'react';
import { SparklesIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { calculateMatchScore, getSharedInterests } from '@/lib/matchingAlgorithm';

/**
 * AI Conversation Assistant Component
 * Provides real-time conversation suggestions based on context
 */
export default function AIConversationAssistant({ 
  currentUser, 
  otherUser, 
  conversationHistory = [],
  onSuggestionSelect 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    generateSuggestions();
  }, [currentUser, otherUser, conversationHistory]);

  const generateSuggestions = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const newSuggestions = [];
      
      // Get match data
      const matchScore = calculateMatchScore(currentUser, otherUser);
      const sharedInterests = getSharedInterests(currentUser, otherUser);
      
      // Generate context-aware suggestions
      if (conversationHistory.length === 0) {
        // First message suggestions
        if (sharedInterests.length > 0) {
          newSuggestions.push({
            text: `I noticed we both value ${sharedInterests[0].answer.toLowerCase()}. How do you practice that?`,
            type: 'icebreaker',
            confidence: 0.9
          });
        }
        
        newSuggestions.push({
          text: `Hey ${otherUser.name.split(' ')[0]}! I'd love to learn more about what drives you.`,
          type: 'generic',
          confidence: 0.7
        });
        
        newSuggestions.push({
          text: `Your profile caught my attention! What's something you're passionate about?`,
          type: 'generic',
          confidence: 0.8
        });
      } else {
        // Follow-up suggestions based on conversation
        const lastMessage = conversationHistory[conversationHistory.length - 1];
        const lastText = lastMessage?.text?.toLowerCase() || '';
        
        if (lastText.includes('music')) {
          newSuggestions.push({
            text: 'What genre are you into? I love discovering new artists!',
            type: 'contextual',
            confidence: 0.9
          });
        }
        
        if (lastText.includes('travel') || lastText.includes('trip')) {
          newSuggestions.push({
            text: 'That sounds amazing! What was your favorite part of the trip?',
            type: 'contextual',
            confidence: 0.9
          });
        }
        
        // General follow-up
        newSuggestions.push({
          text: 'That\'s really interesting! Tell me more about that.',
          type: 'follow-up',
          confidence: 0.8
        });
        
        // Question suggestions
        newSuggestions.push({
          text: 'What do you like to do in your free time?',
          type: 'question',
          confidence: 0.7
        });
      }
      
      // Add match-based suggestions
      if (matchScore.percentage > 80) {
        newSuggestions.push({
          text: `We have a ${matchScore.percentage}% match! I think we'd get along really well.`,
          type: 'match-based',
          confidence: 0.85
        });
      }
      
      setSuggestions(newSuggestions.slice(0, 3)); // Show top 3
      setIsAnalyzing(false);
    }, 500);
  };

  const handleSuggestionClick = (suggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion.text);
    }
  };

  if (suggestions.length === 0 && !isAnalyzing) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <SparklesIcon className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-gray-900">AI Conversation Suggestions</h4>
        {isAnalyzing && (
          <span className="text-xs text-gray-500">Analyzing...</span>
        )}
      </div>
      
      {isAnalyzing ? (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Generating suggestions...</span>
        </div>
      ) : (
        <div className="space-y-2">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
                  {suggestion.text}
                </p>
                <LightBulbIcon className="w-4 h-4 text-blue-500 ml-2 flex-shrink-0" />
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500">{suggestion.type}</span>
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${suggestion.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

