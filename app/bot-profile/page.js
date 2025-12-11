'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getAllUsers, setAllUsers } from '@/lib/localStorage';
import { getBotUserId, getBotProfile, updateBotProfile, initializeBotProfile, DEFAULT_BOT_PROFILE } from '@/lib/botProfile';
import { VALUE_QUESTIONS, CONTENT_QUESTIONS, GENDERS, LOOKING_FOR, GENDER_PREFERENCES, DEAL_BREAKERS, getAgeGroup } from '@/lib/constants';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { showToast } from '@/utils/helpers';

export default function BotProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [botUserId, setBotUserId] = useState(null);
  const [botUser, setBotUser] = useState(null);
  const [profile, setProfile] = useState(DEFAULT_BOT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, values, content, preferences, behavior
  
  // Bot characteristics state
  const [botCharacteristics, setBotCharacteristics] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    photoUrl: '',
    bio: '',
    valueAnswers: [],
    contentAnswers: [],
    preferences: {
      lookingFor: 'Relationship',
      ageRange: [18, 50],
      distance: 25,
      genderPreference: ['Everyone'],
      dealBreakers: []
    }
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    
    setCurrentUser(user);
    
    // Find bot user (Sarah Martinez)
    const botId = getBotUserId('Sarah Martinez');
    if (!botId) {
      showToast('Bot profile not found. Please ensure the bot user exists.', 'error');
      setLoading(false);
      return;
    }
    
    setBotUserId(botId);
    
    // Get bot user
    const allUsers = getAllUsers();
    const bot = allUsers.find(u => u.id === botId && u.isAIBot);
    if (bot) {
      setBotUser(bot);
      // Initialize profile if not exists
      initializeBotProfile(botId);
      const botProfile = getBotProfile(botId);
      setProfile(botProfile || DEFAULT_BOT_PROFILE);
      
      // Load bot characteristics
      setBotCharacteristics({
        name: bot.name || '',
        age: bot.age?.toString() || '',
        gender: bot.gender || '',
        location: bot.location || '',
        photoUrl: bot.photoUrl || '',
        bio: bot.bio || '',
        valueAnswers: bot.valueAnswers || Array(10).fill(0),
        contentAnswers: bot.contentAnswers || Array(5).fill(0),
        preferences: bot.preferences || {
          lookingFor: 'Relationship',
          ageRange: [18, 50],
          distance: 25,
          genderPreference: ['Everyone'],
          dealBreakers: []
        }
      });
    }
    
    setLoading(false);
  }, [router]);

  const handleUpdateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleCharacteristicChange = (field, value) => {
    setBotCharacteristics(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handlePreferenceChange = (field, value) => {
    setBotCharacteristics(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };
  
  const handleValueAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...botCharacteristics.valueAnswers];
    newAnswers[questionIndex] = answerIndex;
    setBotCharacteristics(prev => ({
      ...prev,
      valueAnswers: newAnswers
    }));
  };
  
  const handleContentAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...botCharacteristics.contentAnswers];
    newAnswers[questionIndex] = answerIndex;
    setBotCharacteristics(prev => ({
      ...prev,
      contentAnswers: newAnswers
    }));
  };
  
  const handleDealBreakerToggle = (dealBreaker) => {
    const current = botCharacteristics.preferences.dealBreakers || [];
    const newDealBreakers = current.includes(dealBreaker)
      ? current.filter(db => db !== dealBreaker)
      : [...current, dealBreaker];
    handlePreferenceChange('dealBreakers', newDealBreakers);
  };
  
  const handleGenderPreferenceToggle = (gender) => {
    const current = botCharacteristics.preferences.genderPreference || [];
    const newPreferences = current.includes(gender)
      ? current.filter(g => g !== gender)
      : [...current, gender];
    handlePreferenceChange('genderPreference', newPreferences);
  };
  
  const handleSave = () => {
    if (!botUserId) return;
    
    setSaving(true);
    
    try {
      // Validate age
      const age = parseInt(botCharacteristics.age);
      if (isNaN(age) || age < 18 || age > 100) {
        showToast('Please enter a valid age (18-100)', 'error');
        setSaving(false);
        return;
      }
      
      // Calculate age group
      const ageGroup = getAgeGroup(age);
      
      // Update bot user characteristics in allUsers
      const allUsers = getAllUsers();
      const botIndex = allUsers.findIndex(u => u.id === botUserId && u.isAIBot);
      
      if (botIndex === -1) {
        showToast('Bot user not found', 'error');
        setSaving(false);
        return;
      }
      
      // Update bot user with new characteristics
      allUsers[botIndex] = {
        ...allUsers[botIndex],
        name: botCharacteristics.name,
        age: age,
        gender: botCharacteristics.gender,
        location: botCharacteristics.location,
        photoUrl: botCharacteristics.photoUrl || '',
        bio: botCharacteristics.bio || '',
        ageGroup: ageGroup,
        valueAnswers: botCharacteristics.valueAnswers,
        contentAnswers: botCharacteristics.contentAnswers,
        preferences: botCharacteristics.preferences
      };
      
      setAllUsers(allUsers);
      setBotUser(allUsers[botIndex]);
      
      // Update bot profile (behavior settings)
      const success = updateBotProfile(botUserId, profile);
      
      if (success) {
        showToast('Bot profile and characteristics updated successfully!', 'success');
      } else {
        showToast('Failed to update bot profile settings.', 'error');
      }
    } catch (error) {
      console.error('Error updating bot:', error);
      showToast('Failed to update bot profile.', 'error');
    }
    
    setSaving(false);
  };

  // Auto-update age group when age changes - MUST be before any conditional returns
  useEffect(() => {
    if (botCharacteristics.age) {
      const age = parseInt(botCharacteristics.age);
      if (age >= 18) {
        // Age group will be recalculated on save
      }
    }
  }, [botCharacteristics.age]);
  
  // Calculate content questions - MUST be before any conditional returns
  const contentQuestions = botCharacteristics.age && parseInt(botCharacteristics.age) >= 18 
    ? CONTENT_QUESTIONS[getAgeGroup(parseInt(botCharacteristics.age))] || []
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bot profile...</p>
        </div>
      </div>
    );
  }

  if (!botUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Bot profile not found</p>
          <Button onClick={() => router.push('/discover')}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bot Profile Configuration</h1>
          <p className="text-gray-600">Customize {botUser.name}'s characteristics, preferences, and behavior</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto">
            {['basic', 'values', 'content', 'preferences', 'behavior'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'basic' && 'Basic Info'}
                {tab === 'values' && 'Value Questions'}
                {tab === 'content' && 'Content Questions'}
                {tab === 'preferences' && 'Preferences'}
                {tab === 'behavior' && 'Behavior Settings'}
              </button>
            ))}
          </nav>
        </div>

        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    type="text"
                    value={botCharacteristics.name}
                    onChange={(e) => handleCharacteristicChange('name', e.target.value)}
                    placeholder="Bot name"
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="18"
                      max="100"
                      value={botCharacteristics.age}
                      onChange={(e) => handleCharacteristicChange('age', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="25"
                    />
                    {botCharacteristics.age && parseInt(botCharacteristics.age) >= 18 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Age Group: {getAgeGroup(parseInt(botCharacteristics.age))}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={botCharacteristics.gender}
                      onChange={(e) => handleCharacteristicChange('gender', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select gender</option>
                      {GENDERS.map(gender => (
                        <option key={gender} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>
                  
                  <Input
                    label="Location"
                    type="text"
                    value={botCharacteristics.location}
                    onChange={(e) => handleCharacteristicChange('location', e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
                
                <Input
                  label="Profile Photo URL"
                  type="text"
                  value={botCharacteristics.photoUrl}
                  onChange={(e) => handleCharacteristicChange('photoUrl', e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={botCharacteristics.bio}
                    onChange={(e) => handleCharacteristicChange('bio', e.target.value)}
                    placeholder="Tell us about the bot..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Value Questions Tab */}
        {activeTab === 'values' && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Value Questions (10 Questions)</h2>
              <p className="text-gray-600 mb-6">Answer these questions to define the bot's values and preferences.</p>
              
              <div className="space-y-8">
                {VALUE_QUESTIONS.map((question, qIdx) => (
                  <div key={qIdx} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {qIdx + 1}. {question.question}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.options.map((option, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleValueAnswer(qIdx, oIdx)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            botCharacteristics.valueAnswers[qIdx] === oIdx
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 hover:border-primary/50 text-gray-700'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Content Questions Tab */}
        {activeTab === 'content' && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Content Questions (5 Questions)</h2>
              {!botCharacteristics.age || parseInt(botCharacteristics.age) < 18 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-700">Please set the bot's age in Basic Info tab first to see age-appropriate content questions.</p>
                </div>
              ) : contentQuestions.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">Content questions will appear based on the selected age group.</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">Age Group: <strong>{getAgeGroup(parseInt(botCharacteristics.age))}</strong></p>
                  <p className="text-gray-600 mb-6">These questions are specific to the bot's age group.</p>
                  
                  <div className="space-y-8">
                    {contentQuestions.map((question, qIdx) => (
                      <div key={qIdx} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {qIdx + 1}. {question.question}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {question.options.map((option, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => handleContentAnswer(qIdx, oIdx)}
                              className={`p-4 rounded-lg border-2 text-left transition-all ${
                                botCharacteristics.contentAnswers[qIdx] === oIdx
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-gray-200 hover:border-primary/50 text-gray-700'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Matching Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Looking For</label>
                  <select
                    value={botCharacteristics.preferences.lookingFor}
                    onChange={(e) => handlePreferenceChange('lookingFor', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {LOOKING_FOR.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Range: {botCharacteristics.preferences.ageRange[0]} - {botCharacteristics.preferences.ageRange[1]} years
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min Age</label>
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={botCharacteristics.preferences.ageRange[0]}
                        onChange={(e) => handlePreferenceChange('ageRange', [
                          parseInt(e.target.value) || 18,
                          botCharacteristics.preferences.ageRange[1]
                        ])}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max Age</label>
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={botCharacteristics.preferences.ageRange[1]}
                        onChange={(e) => handlePreferenceChange('ageRange', [
                          botCharacteristics.preferences.ageRange[0],
                          parseInt(e.target.value) || 50
                        ])}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distance (miles)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={botCharacteristics.preferences.distance}
                    onChange={(e) => handlePreferenceChange('distance', parseInt(e.target.value) || 25)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender Preference</label>
                  <div className="space-y-2">
                    {GENDER_PREFERENCES.map(gender => (
                      <label key={gender} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={botCharacteristics.preferences.genderPreference.includes(gender)}
                          onChange={() => handleGenderPreferenceToggle(gender)}
                          className="mr-2 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-gray-700">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deal Breakers</label>
                  <div className="space-y-2">
                    {DEAL_BREAKERS.map(dealBreaker => (
                      <label key={dealBreaker} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={botCharacteristics.preferences.dealBreakers.includes(dealBreaker)}
                          onChange={() => handleDealBreakerToggle(dealBreaker)}
                          className="mr-2 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-gray-700">{dealBreaker}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Behavior Settings Tab */}
        {activeTab === 'behavior' && (
          <>
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Personality Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Personality Type</label>
                <select
                  value={profile.personality}
                  onChange={(e) => handleUpdateProfile({ personality: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="playful">Playful</option>
                  <option value="intellectual">Intellectual</option>
                  <option value="supportive">Supportive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reply Style</label>
                <select
                  value={profile.replyStyle}
                  onChange={(e) => handleUpdateProfile({ replyStyle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="conversational">Conversational</option>
                  <option value="brief">Brief</option>
                  <option value="detailed">Detailed</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formality Level</label>
                <select
                  value={profile.formality}
                  onChange={(e) => handleUpdateProfile({ formality: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Response Length</label>
                <select
                  value={profile.responseLength}
                  onChange={(e) => handleUpdateProfile({ responseLength: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Humor Level</label>
                <select
                  value={profile.humorLevel}
                  onChange={(e) => handleUpdateProfile({ humorLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexual Chat Level</label>
                <select
                  value={profile.sexualChatLevel || 'none'}
                  onChange={(e) => handleUpdateProfile({ sexualChatLevel: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="none">None - Keep conversations strictly PG</option>
                  <option value="mild">Mild - Light flirting and romantic hints</option>
                  <option value="moderate">Moderate - More flirtatious and romantic</option>
                  <option value="high">High - Open to more intimate conversations</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Controls how flirtatious or romantic the bot's responses can be</p>
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
                  <p className="text-sm text-gray-500">Bot will use emojis in messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.emojiUsage}
                    onChange={(e) => handleUpdateProfile({ emojiUsage: e.target.checked })}
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
                    checked={profile.askQuestions}
                    onChange={(e) => handleUpdateProfile({ askQuestions: e.target.checked })}
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
                Custom Greeting Message (use {'{name}'} for user's first name)
              </label>
              <textarea
                value={profile.customGreeting || ''}
                onChange={(e) => handleUpdateProfile({ customGreeting: e.target.value || null })}
                placeholder="Hey {name}! 👋 I'm excited to chat with you!"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-sm text-gray-500 mt-1">Leave empty to use default greetings</p>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Reply Timing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Delay (seconds)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={profile.replyDelay.min}
                  onChange={(e) => handleUpdateProfile({
                    replyDelay: { ...profile.replyDelay, min: parseInt(e.target.value) || 3 }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Delay (seconds)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={profile.replyDelay.max}
                  onChange={(e) => handleUpdateProfile({
                    replyDelay: { ...profile.replyDelay, max: parseInt(e.target.value) || 8 }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </Card>

          </>
        )}

        {/* Save Button - Always Visible */}
        <div className="flex gap-4 sticky bottom-0 bg-gray-50 pt-4 pb-4 border-t border-gray-200">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
          <Button 
            onClick={async () => {
              // Test bot with 50 sexual messages
              if (confirm('This will send 50 high-level sexual/romantic test messages to the bot. Continue?')) {
                const { getAllUsers, setAllUsers, getConversations, setConversations } = await import('@/lib/localStorage');
                const { getConversationId } = await import('@/utils/helpers');
                const { generateAIReply } = await import('@/lib/aiBotReplies');
                const { getBotProfile } = await import('@/lib/botProfile');
                
                const allUsers = getAllUsers();
                const bot = allUsers.find(u => u.id === botUserId);
                const currentUser = getCurrentUser();
                
                if (!bot || !currentUser) {
                  alert('Bot or current user not found!');
                  return;
                }
                
                // Set to high sexual chat level
                const botProfile = getBotProfile(bot.id);
                const { updateBotProfile } = await import('@/lib/botProfile');
                updateBotProfile(bot.id, { ...botProfile, sexualChatLevel: 'high' });
                
                const conversationId = getConversationId(currentUser.id, bot.id);
                const conversations = getConversations();
                
                if (!conversations[conversationId]) {
                  conversations[conversationId] = {
                    participants: [currentUser.id, bot.id],
                    messages: []
                  };
                }
                
                const testMessages = [
                  "lets fuck", "I want you", "you're so hot", "I want to kiss you", "let's hook up tonight",
                  "you're sexy", "I'm turned on by you", "wanna come over?", "I want to touch you", "you make me hard",
                  "let's get intimate", "I'm so attracted to you", "you're beautiful", "I want you in bed", "let's have some fun",
                  "I'm horny for you", "you turn me on", "let's do it", "I want to be with you tonight", "you're irresistible",
                  "I can't stop thinking about you", "let's make love", "I desire you", "you're so desirable", "I want to feel you",
                  "let's be together", "I'm craving you", "you're so hot", "I want you right now", "let's get closer",
                  "I'm so into you", "you're amazing", "I want to be intimate with you", "let's spend the night together",
                  "I'm so attracted to you", "you drive me crazy", "I want to be with you", "let's have a good time",
                  "I'm so hot for you", "you're so seductive", "I want to explore you", "let's get physical",
                  "I'm so turned on", "you're irresistible to me", "I want to be yours", "let's make it happen",
                  "I'm so into you right now", "you're so tempting", "I want to be closer to you", "let's do this"
                ];
                
                console.log('🤖 Testing bot with 50 sexual messages...');
                
                for (let i = 0; i < testMessages.length; i++) {
                  const msg = testMessages[i];
                  conversations[conversationId].messages.push({
                    senderId: currentUser.id,
                    text: msg,
                    timestamp: new Date().toISOString()
                  });
                  
                  const lastMsg = conversations[conversationId].messages[conversations[conversationId].messages.length - 1];
                  const updatedBot = getAllUsers().find(u => u.id === botUserId);
                  const reply = generateAIReply(updatedBot, currentUser, conversations[conversationId].messages, lastMsg);
                  
                  conversations[conversationId].messages.push({
                    senderId: bot.id,
                    text: reply,
                    timestamp: new Date().toISOString(),
                    isAI: true
                  });
                  
                  console.log(`${i + 1}/50: "${msg}" → "${reply}"`);
                }
                
                setConversations(conversations);
                alert(`✅ Test complete! ${testMessages.length} messages sent. Check console for all responses. Redirecting to Messages...`);
                router.push('/messages?userId=' + bot.id);
              }
            }}
            variant="outline"
          >
            Test Bot (50 Messages)
          </Button>
          <Button onClick={() => router.push('/discover')} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

