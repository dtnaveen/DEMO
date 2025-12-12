'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import { isAdmin } from '@/lib/adminAuth';
import { getAIBotCharacter, updateAIBotCharacter, getOrCreateAIChatBot } from '@/lib/aiChatBot';
import { DEFAULT_BOT_PROFILE } from '@/lib/botProfile';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { showToast } from '@/utils/helpers';

export default function AIChatSettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [character, setCharacter] = useState(DEFAULT_BOT_PROFILE);
  const [botName, setBotName] = useState('AI Assistant');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    
    setCurrentUser(user);
    setIsUserAdmin(isAdmin(user));
    
    // Load AI bot character settings
    const aiBot = getOrCreateAIChatBot();
    if (aiBot) {
      setBotName(aiBot.name || 'AI Assistant');
      const botCharacter = getAIBotCharacter();
      
      // Ensure optimal settings are applied if bot profile is missing or incomplete
      if (!botCharacter || !botCharacter.askQuestions === undefined) {
        // Apply optimal defaults
        updateAIBotCharacter({
          askQuestions: true,
          responseLength: 'medium',
          emojiUsage: true,
          personality: 'friendly',
          replyStyle: 'conversational',
          formality: 'casual',
          humorLevel: 'medium'
        });
        const updatedCharacter = getAIBotCharacter();
        setCharacter(updatedCharacter);
      } else {
        setCharacter(botCharacter);
      }
    }
    
    setLoading(false);
  }, [router]);

  const handleUpdateCharacter = (updates) => {
    setCharacter(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    if (!currentUser) return;
    
    setSaving(true);
    
    try {
      // Update bot name and character
      const success = updateAIBotCharacter({
        name: botName,
        ...character
      });
      
      if (success) {
        showToast('AI Chat Bot settings saved successfully!', 'success');
        // Refresh character settings
        const updatedCharacter = getAIBotCharacter();
        setCharacter(updatedCharacter);
        const aiBot = getOrCreateAIChatBot();
        if (aiBot) {
          setBotName(aiBot.name);
        }
      } else {
        showToast('Failed to save settings.', 'error');
      }
    } catch (error) {
      console.error('Error updating AI bot character:', error);
      showToast('Failed to update AI bot character.', 'error');
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Chat settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            onClick={() => router.push('/messages')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Messages
          </Button>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Customize Your AI Chat Bot</h1>
          <p className="text-gray-600">Personalize your AI assistant's personality, style, and behavior</p>
        </div>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Settings</h2>
            <div className="space-y-4">
              <Input
                label="Bot Name"
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="AI Assistant"
              />
              <p className="text-sm text-gray-500">Give your AI assistant a name that you like!</p>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Personality Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personality Type</label>
                <select
                  value={character.personality}
                  onChange={(e) => handleUpdateCharacter({ personality: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="friendly">Friendly - Warm and approachable</option>
                  <option value="professional">Professional - Formal and business-like</option>
                  <option value="playful">Playful - Fun and lighthearted</option>
                  <option value="intellectual">Intellectual - Thoughtful and deep</option>
                  <option value="supportive">Supportive - Caring and encouraging</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reply Style</label>
                <select
                  value={character.replyStyle}
                  onChange={(e) => handleUpdateCharacter({ replyStyle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="conversational">Conversational - Natural and flowing</option>
                  <option value="brief">Brief - Short and to the point</option>
                  <option value="detailed">Detailed - Comprehensive responses</option>
                  <option value="enthusiastic">Enthusiastic - Energetic and excited</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formality Level</label>
                <select
                  value={character.formality}
                  onChange={(e) => handleUpdateCharacter({ formality: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="casual">Casual - Relaxed and informal</option>
                  <option value="formal">Formal - Professional and proper</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Length</label>
                <select
                  value={character.responseLength}
                  onChange={(e) => handleUpdateCharacter({ responseLength: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="short">Short - Quick responses</option>
                  <option value="medium">Medium - Balanced length</option>
                  <option value="long">Long - Detailed explanations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Humor Level</label>
                <select
                  value={character.humorLevel}
                  onChange={(e) => handleUpdateCharacter({ humorLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="none">None - Serious only</option>
                  <option value="low">Low - Occasional jokes</option>
                  <option value="medium">Medium - Regular humor</option>
                  <option value="high">High - Very funny and playful</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Behavior Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Use Emojis</label>
                  <p className="text-sm text-gray-500">Bot will use emojis in messages to be more expressive</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={character.emojiUsage}
                    onChange={(e) => handleUpdateCharacter({ emojiUsage: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ask Questions</label>
                  <p className="text-sm text-gray-500">Bot will ask follow-up questions to keep conversations engaging</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={character.askQuestions}
                    onChange={(e) => handleUpdateCharacter({ askQuestions: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Custom Greeting</h2>
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Welcome Message
              </label>
              <textarea
                value={character.customGreeting || ''}
                onChange={(e) => handleUpdateCharacter({ customGreeting: e.target.value || null })}
                placeholder="Hi! I'm your AI assistant. How can I help you today? 😊"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-sm text-gray-500 mt-1">Leave empty to use default greeting</p>
            </div>
          </div>
        </Card>

        {/* Optimal Settings Card */}
        <Card className="mb-6 border-2 border-green-200 bg-green-50">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2 text-green-800">🚀 Quick Setup: Optimal Settings</h2>
            <p className="text-sm text-gray-700 mb-4">
              Apply recommended settings for best human-like score (8.0+):
            </p>
            <ul className="text-sm text-gray-600 mb-4 space-y-1">
              <li>✅ Ask Questions: Enabled (better engagement)</li>
              <li>✅ Response Length: Medium (optimal scoring)</li>
              <li>✅ Use Emojis: Enabled (more human-like)</li>
              <li>✅ Personality: Friendly (balanced)</li>
              <li>✅ Reply Style: Conversational (natural flow)</li>
            </ul>
            <Button 
              onClick={async () => {
                // Apply optimal settings
                handleUpdateCharacter({
                  askQuestions: true,
                  responseLength: 'medium',
                  emojiUsage: true,
                  personality: 'friendly',
                  replyStyle: 'conversational',
                  formality: 'casual',
                  humorLevel: 'medium'
                });
                
                // Auto-save settings
                setSaving(true);
                try {
                  const success = updateAIBotCharacter({
                    name: botName,
                    askQuestions: true,
                    responseLength: 'medium',
                    emojiUsage: true,
                    personality: 'friendly',
                    replyStyle: 'conversational',
                    formality: 'casual',
                    humorLevel: 'medium',
                    ...character
                  });
                  
                  if (success) {
                    if (isUserAdmin) {
                      showToast('✅ Optimal settings saved! Navigating to test page...', 'success');
                      // Refresh character settings
                      const updatedCharacter = getAIBotCharacter();
                      setCharacter(updatedCharacter);
                      
                      // Navigate to test page after a short delay (only for admin)
                      setTimeout(() => {
                        router.push('/test-ai-bot');
                      }, 1500);
                    } else {
                      showToast('✅ Optimal settings saved!', 'success');
                      // Refresh character settings
                      const updatedCharacter = getAIBotCharacter();
                      setCharacter(updatedCharacter);
                    }
                  } else {
                    showToast('Failed to save settings. Please try again.', 'error');
                  }
                } catch (error) {
                  console.error('Error saving optimal settings:', error);
                  showToast('Error saving settings. Please try again.', 'error');
                }
                setSaving(false);
              }}
              variant="outline"
              className="w-full bg-green-100 hover:bg-green-200 border-green-300"
              disabled={saving}
            >
              {saving ? 'Saving...' : isUserAdmin ? '🚀 Apply & Test (Auto-Save)' : '🚀 Apply Optimal Settings'}
            </Button>
            {!isUserAdmin && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Note: Bot responsiveness testing is available for admin users only.
              </p>
            )}
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-4 sticky bottom-0 bg-transparent pt-4 pb-4">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button 
            onClick={() => router.push('/test-ai-bot')} 
            variant="outline"
          >
            Test Bot Responsiveness
          </Button>
          <Button 
            onClick={() => router.push('/messages')} 
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
