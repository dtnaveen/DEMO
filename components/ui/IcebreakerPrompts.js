'use client';

import { useState } from 'react';
import Button from './Button';
import { getSharedInterests, getSharedContent } from '@/lib/matchingAlgorithm';

export default function IcebreakerPrompts({ currentUser, otherUser, onSend }) {
  const [customMessage, setCustomMessage] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  
  const sharedInterests = getSharedInterests(currentUser, otherUser);
  const sharedContent = getSharedContent(currentUser, otherUser);
  
  // Generate icebreaker prompts based on shared interests
  const generatePrompts = () => {
    const prompts = [];
    
    // Based on shared values
    if (sharedInterests.length > 0) {
      const interest = sharedInterests[0];
      prompts.push({
        text: `You both value ${interest.answer.toLowerCase()}. How do you practice that in your daily life?`,
        type: 'value'
      });
    }
    
    // Based on shared content
    if (sharedContent.length > 0) {
      const content = sharedContent[0];
      prompts.push({
        text: `Fellow ${content.answer.toLowerCase()} fan! What's your current favorite?`,
        type: 'content'
      });
    }
    
    // Based on age group and interests
    if (currentUser.ageGroup === otherUser.ageGroup) {
      if (currentUser.ageGroup === 'Gen Z') {
        prompts.push({
          text: `I see we're both ${currentUser.ageGroup}. What's been your favorite discovery this week?`,
          type: 'general'
        });
      } else {
        prompts.push({
          text: `Hey! I noticed we have similar vibes. What's something you're passionate about right now?`,
          type: 'general'
        });
      }
    }
    
    // Fill remaining slots with generic prompts
    while (prompts.length < 3) {
      prompts.push({
        text: `Hey ${otherUser.name.split(' ')[0]}! I'd love to learn more about what drives you.`,
        type: 'generic'
      });
    }
    
    return prompts.slice(0, 3);
  };
  
  const prompts = generatePrompts();
  
  const handleSend = () => {
    const message = selectedPrompt || customMessage;
    if (message.trim()) {
      onSend(message.trim());
      setCustomMessage('');
      setSelectedPrompt(null);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Start the conversation
      </h3>
      
      <div className="space-y-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPrompt(prompt.text)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedPrompt === prompt.text
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-primary/50'
            }`}
          >
            <p className="text-gray-700">{prompt.text}</p>
          </button>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or write your own message
        </label>
        <textarea
          value={customMessage}
          onChange={(e) => {
            setCustomMessage(e.target.value);
            setSelectedPrompt(null);
          }}
          placeholder="Type your message here..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          rows="3"
        />
      </div>
      
      <Button
        onClick={handleSend}
        disabled={!selectedPrompt && !customMessage.trim()}
        fullWidth
        className="mt-4"
      >
        Send Message
      </Button>
    </div>
  );
}
