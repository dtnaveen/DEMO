'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/localStorage';
import { getOrCreateAIChatBot, getOrCreateAIBotConversation, AI_CHAT_BOT_ID } from '@/lib/aiChatBot';
import { getConversations, setConversations } from '@/lib/localStorage';
import { getConversationId } from '@/utils/helpers';
import { generateAIReply } from '@/lib/aiBotReplies';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { showToast } from '@/utils/helpers';

/**
 * Generate 100 diverse test messages covering:
 * - Different characters (casual, formal, young, old, etc.)
 * - Different ages (teen, young adult, middle-aged, senior)
 * - Different relationship contexts (friend, romantic, professional, etc.)
 */
function generateTestMessages() {
  const messages = [];
  
  // Young Adult (18-25) - Casual/Friendly
  messages.push(
    { text: "hey what's up?", age: 22, context: 'casual', character: 'young_casual' },
    { text: "omg that's so cool!", age: 20, context: 'casual', character: 'young_casual' },
    { text: "wanna hang out later?", age: 23, context: 'casual', character: 'young_casual' },
    { text: "i'm so tired today lol", age: 21, context: 'casual', character: 'young_casual' },
    { text: "what are you doing rn?", age: 19, context: 'casual', character: 'young_casual' },
  );
  
  // Young Adult - Romantic
  messages.push(
    { text: "I can't stop thinking about you", age: 24, context: 'romantic', character: 'young_romantic' },
    { text: "You're so beautiful", age: 22, context: 'romantic', character: 'young_romantic' },
    { text: "I miss you already", age: 25, context: 'romantic', character: 'young_romantic' },
    { text: "Want to grab dinner tonight?", age: 23, context: 'romantic', character: 'young_romantic' },
    { text: "You make me so happy", age: 21, context: 'romantic', character: 'young_romantic' },
  );
  
  // Middle-Aged (30-50) - Professional
  messages.push(
    { text: "Good morning, how are you today?", age: 35, context: 'professional', character: 'professional' },
    { text: "I'd like to discuss the project timeline", age: 42, context: 'professional', character: 'professional' },
    { text: "Thank you for your prompt response", age: 38, context: 'professional', character: 'professional' },
    { text: "Could we schedule a meeting this week?", age: 45, context: 'professional', character: 'professional' },
    { text: "I appreciate your assistance with this matter", age: 40, context: 'professional', character: 'professional' },
  );
  
  // Middle-Aged - Mature Romantic
  messages.push(
    { text: "I've been thinking about our conversation", age: 35, context: 'romantic', character: 'mature_romantic' },
    { text: "You have such a wonderful personality", age: 42, context: 'romantic', character: 'mature_romantic' },
    { text: "I'd love to get to know you better", age: 38, context: 'romantic', character: 'mature_romantic' },
    { text: "Would you like to meet for coffee this weekend?", age: 45, context: 'romantic', character: 'mature_romantic' },
    { text: "You seem like someone special", age: 40, context: 'romantic', character: 'mature_romantic' },
  );
  
  // Senior (55+) - Formal/Friendly
  messages.push(
    { text: "Hello, how are you doing today?", age: 60, context: 'friendly', character: 'senior_formal' },
    { text: "I hope you're having a pleasant day", age: 65, context: 'friendly', character: 'senior_formal' },
    { text: "What are your thoughts on this?", age: 58, context: 'friendly', character: 'senior_formal' },
    { text: "I'd be interested in hearing more about that", age: 70, context: 'friendly', character: 'senior_formal' },
    { text: "Thank you for taking the time to chat", age: 62, context: 'friendly', character: 'senior_formal' },
  );
  
  // Questions - Various Types
  messages.push(
    { text: "What's your favorite movie?", age: 25, context: 'casual', character: 'curious' },
    { text: "Do you like traveling?", age: 30, context: 'casual', character: 'curious' },
    { text: "What do you do for fun?", age: 28, context: 'casual', character: 'curious' },
    { text: "Have you ever been to Paris?", age: 35, context: 'casual', character: 'curious' },
    { text: "What's your biggest fear?", age: 27, context: 'deep', character: 'philosophical' },
    { text: "What makes you happy?", age: 32, context: 'deep', character: 'philosophical' },
    { text: "Do you believe in love at first sight?", age: 29, context: 'romantic', character: 'romantic_curious' },
  );
  
  // Emotional States
  messages.push(
    { text: "I'm feeling really down today", age: 24, context: 'support', character: 'emotional' },
    { text: "I'm so excited about my new job!", age: 26, context: 'casual', character: 'excited' },
    { text: "I'm nervous about our date tomorrow", age: 23, context: 'romantic', character: 'nervous' },
    { text: "I'm frustrated with work lately", age: 35, context: 'support', character: 'frustrated' },
    { text: "I'm grateful for our friendship", age: 30, context: 'friendly', character: 'grateful' },
  );
  
  // Slang/Informal
  messages.push(
    { text: "yo what's good?", age: 20, context: 'casual', character: 'slang' },
    { text: "that's fire!", age: 22, context: 'casual', character: 'slang' },
    { text: "no cap, you're awesome", age: 21, context: 'casual', character: 'slang' },
    { text: "bet, let's do it", age: 19, context: 'casual', character: 'slang' },
    { text: "fr fr?", age: 20, context: 'casual', character: 'slang' },
  );
  
  // Long Messages
  messages.push(
    { text: "I've been thinking a lot about what you said yesterday, and I really appreciate your perspective on things. It's not often I meet someone who thinks so deeply about life.", age: 32, context: 'deep', character: 'thoughtful' },
    { text: "So I was at this amazing concert last night, and the energy was just incredible. The band played all my favorite songs, and I couldn't stop dancing. You would have loved it!", age: 25, context: 'casual', character: 'enthusiastic' },
  );
  
  // Short/One Word
  messages.push(
    { text: "ok", age: 22, context: 'casual', character: 'brief' },
    { text: "cool", age: 24, context: 'casual', character: 'brief' },
    { text: "thanks", age: 28, context: 'casual', character: 'brief' },
    { text: "sure", age: 26, context: 'casual', character: 'brief' },
    { text: "nice", age: 23, context: 'casual', character: 'brief' },
  );
  
  // Emojis
  messages.push(
    { text: "Hey! 😊", age: 22, context: 'casual', character: 'emoji_user' },
    { text: "That's awesome! 🎉", age: 24, context: 'casual', character: 'emoji_user' },
    { text: "I love it! ❤️", age: 26, context: 'romantic', character: 'emoji_user' },
    { text: "So excited! 🎊", age: 23, context: 'casual', character: 'emoji_user' },
    { text: "You're the best! 🌟", age: 25, context: 'friendly', character: 'emoji_user' },
  );
  
  // Topics - Hobbies
  messages.push(
    { text: "I love playing guitar in my free time", age: 28, context: 'casual', character: 'hobbyist' },
    { text: "Do you enjoy reading? I'm into sci-fi novels", age: 32, context: 'casual', character: 'hobbyist' },
    { text: "I'm training for a marathon next month", age: 29, context: 'casual', character: 'hobbyist' },
    { text: "Cooking is my passion, especially Italian food", age: 35, context: 'casual', character: 'hobbyist' },
  );
  
  // Topics - Work/Career
  messages.push(
    { text: "Work has been really stressful lately", age: 30, context: 'support', character: 'professional' },
    { text: "I just got promoted at my job!", age: 28, context: 'casual', character: 'professional' },
    { text: "What do you do for work?", age: 25, context: 'casual', character: 'curious' },
    { text: "I'm thinking about changing careers", age: 32, context: 'support', character: 'professional' },
  );
  
  // Topics - Family
  messages.push(
    { text: "I'm visiting my family this weekend", age: 28, context: 'casual', character: 'family_oriented' },
    { text: "My sister just had a baby!", age: 30, context: 'casual', character: 'family_oriented' },
    { text: "Do you have any siblings?", age: 26, context: 'casual', character: 'curious' },
  );
  
  // Topics - Travel
  messages.push(
    { text: "I'm planning a trip to Japan next year", age: 27, context: 'casual', character: 'traveler' },
    { text: "Have you ever been to Europe?", age: 29, context: 'casual', character: 'traveler' },
    { text: "I love exploring new places", age: 31, context: 'casual', character: 'traveler' },
  );
  
  // Flirty/Playful
  messages.push(
    { text: "You're looking good today 😉", age: 26, context: 'romantic', character: 'flirty' },
    { text: "I can't get you out of my head", age: 24, context: 'romantic', character: 'flirty' },
    { text: "You're so cute when you smile", age: 25, context: 'romantic', character: 'flirty' },
  );
  
  // Serious/Deep
  messages.push(
    { text: "What do you think is the meaning of life?", age: 30, context: 'deep', character: 'philosophical' },
    { text: "I've been reflecting on my past mistakes", age: 35, context: 'deep', character: 'philosophical' },
    { text: "How do you deal with difficult situations?", age: 32, context: 'deep', character: 'philosophical' },
  );
  
  // Fill to 100 messages with variations
  const baseMessages = [...messages];
  while (messages.length < 100) {
    const base = baseMessages[Math.floor(Math.random() * baseMessages.length)];
    const variation = {
      ...base,
      text: base.text + (Math.random() > 0.5 ? '!' : ''),
      age: base.age + Math.floor(Math.random() * 5) - 2, // Slight age variation
    };
    messages.push(variation);
  }
  
  return messages.slice(0, 100);
}

export default function TestAIBotPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
  }, [router]);
  
  const analyzeResponse = (response, originalMessage, context, age) => {
    const analysis = {
      length: response.length,
      hasQuestion: response.includes('?'),
      hasEmoji: /[\u{1F300}-\u{1F9FF}]/u.test(response),
      isRelevant: true,
      tone: 'neutral',
      humanLike: 0,
      contextAppropriate: true,
      ageAppropriate: true,
    };
    
    // Check for human-like qualities
    let humanScore = 0;
    
    // 1. Appropriate length (not too short, not too long)
    if (analysis.length >= 20 && analysis.length <= 200) humanScore += 2;
    else if (analysis.length >= 10 && analysis.length <= 300) humanScore += 1;
    else if (analysis.length < 5) humanScore -= 2; // Too short
    else if (analysis.length > 500) humanScore -= 1; // Too long
    
    // 2. Asks follow-up questions (shows engagement)
    if (analysis.hasQuestion) humanScore += 2;
    
    // 3. Uses emojis appropriately (not excessive)
    const emojiCount = (response.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
    if (emojiCount > 0 && emojiCount <= 3) humanScore += 1;
    else if (emojiCount > 5) humanScore -= 1; // Too many emojis
    
    // 4. Shows engagement (references user's message)
    const firstWords = originalMessage.toLowerCase().split(' ').slice(0, 3);
    const mentionsUserMessage = firstWords.some(word => 
      word.length > 2 && response.toLowerCase().includes(word)
    );
    if (mentionsUserMessage) humanScore += 2;
    
    // 5. Natural language patterns
    if (response.includes('!') || response.includes('?')) humanScore += 1;
    
    // 6. Variety in sentence starts (not repetitive)
    const sentenceStarts = response.split(/[.!?]/).filter(s => s.trim().length > 0)
      .map(s => s.trim().split(' ')[0].toLowerCase());
    const uniqueStarts = new Set(sentenceStarts);
    if (uniqueStarts.size > 1) humanScore += 1; // Variety
    
    // 7. Context appropriateness
    const responseLower = response.toLowerCase();
    if (context === 'romantic') {
      if (responseLower.includes('love') || responseLower.includes('miss') || 
          responseLower.includes('beautiful') || responseLower.includes('special')) {
        analysis.contextAppropriate = true;
        humanScore += 1;
      } else if (responseLower.includes('business') || responseLower.includes('meeting')) {
        analysis.contextAppropriate = false;
        humanScore -= 2;
      }
    } else if (context === 'professional') {
      if (responseLower.includes('business') || responseLower.includes('professional') ||
          responseLower.includes('meeting') || responseLower.includes('project')) {
        analysis.contextAppropriate = true;
        humanScore += 1;
      } else if (responseLower.includes('babe') || responseLower.includes('sexy')) {
        analysis.contextAppropriate = false;
        humanScore -= 2;
      }
    } else if (context === 'casual') {
      if (responseLower.includes('cool') || responseLower.includes('awesome') ||
          responseLower.includes('nice') || responseLower.includes('fun')) {
        analysis.contextAppropriate = true;
        humanScore += 1;
      }
    }
    
    // 8. Age appropriateness
    if (age < 25) {
      // Young users - casual language, emojis OK
      if (emojiCount > 0 && emojiCount <= 3) humanScore += 0.5;
      if (responseLower.includes('lol') || responseLower.includes('omg')) humanScore += 0.5;
    } else if (age > 55) {
      // Senior users - more formal, fewer emojis
      if (emojiCount === 0) humanScore += 0.5;
      if (responseLower.includes('please') || responseLower.includes('thank you')) humanScore += 0.5;
      if (emojiCount > 2) humanScore -= 1; // Too many emojis for senior
    }
    
    // 9. Avoids repetitive patterns
    const words = response.toLowerCase().split(/\s+/);
    const wordFrequency = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    const repeatedWords = Object.entries(wordFrequency).filter(([_, count]) => count > 3);
    if (repeatedWords.length > 0) humanScore -= 1; // Too repetitive
    
    // 10. Natural conversation flow
    if (response.includes(',') || response.includes(';')) humanScore += 0.5; // Natural punctuation
    if (response.split(' ').length >= 5 && response.split(' ').length <= 50) humanScore += 1; // Good word count
    
    // Tone detection
    if (responseLower.includes('love') || responseLower.includes('excited') || responseLower.includes('amazing')) {
      analysis.tone = 'enthusiastic';
    } else if (responseLower.includes('sorry') || responseLower.includes('understand') || responseLower.includes('feel')) {
      analysis.tone = 'empathetic';
    } else if (responseLower.includes('great') || responseLower.includes('awesome') || responseLower.includes('wonderful')) {
      analysis.tone = 'positive';
    } else if (responseLower.includes('interesting') || responseLower.includes('curious') || responseLower.includes('think')) {
      analysis.tone = 'thoughtful';
    }
    
    analysis.humanLike = Math.max(0, Math.min(humanScore, 10)); // Cap between 0-10
    return analysis;
  };
  
  const runTest = async () => {
    if (!currentUser) return;
    
    setTesting(true);
    setProgress(0);
    setResults(null);
    
    const aiBot = getOrCreateAIChatBot();
    if (!aiBot) {
      showToast('AI Bot not found', 'error');
      setTesting(false);
      return;
    }
    
    const conversationId = getOrCreateAIBotConversation();
    const conversations = getConversations();
    const conversation = conversations[conversationId] || { participants: [currentUser.id, aiBot.id], messages: [] };
    
    const testMessages = generateTestMessages();
    const testResults = {
      totalMessages: testMessages.length,
      responses: [],
      statistics: {
        averageResponseLength: 0,
        questionsAsked: 0,
        emojisUsed: 0,
        averageHumanLikeScore: 0,
        toneDistribution: {},
        responseTimes: [],
      },
      issues: [],
    };
    
    // Create a test user profile for each message context
    const createTestUser = (age, context, character) => {
      return {
        ...currentUser,
        age: age,
        name: `Test User ${age}`,
        // Adjust profile based on context
        preferences: {
          ...currentUser.preferences,
          lookingFor: context === 'romantic' ? 'Relationship' : 'Friendship',
        },
      };
    };
    
    for (let i = 0; i < testMessages.length; i++) {
      const testMsg = testMessages[i];
      setProgress(Math.round((i / testMessages.length) * 100));
      setCurrentMessage(`Testing: "${testMsg.text.substring(0, 30)}..." (Age: ${testMsg.age}, Context: ${testMsg.context})`);
      
      // Create test user for this message
      const testUser = createTestUser(testMsg.age, testMsg.context, testMsg.character);
      
      // Add user message
      const userMessage = {
        senderId: testUser.id,
        text: testMsg.text,
        timestamp: new Date().toISOString(),
      };
      
      conversation.messages.push(userMessage);
      
      // Generate AI response
      const startTime = Date.now();
      const aiResponse = generateAIReply(aiBot, testUser, conversation.messages, userMessage);
      const responseTime = Date.now() - startTime;
      
      // Add AI response
      const botMessage = {
        senderId: aiBot.id,
        text: aiResponse,
        timestamp: new Date().toISOString(),
        isAI: true,
      };
      
      conversation.messages.push(botMessage);
      
      // Analyze response
      const analysis = analyzeResponse(aiResponse, testMsg.text, testMsg.context, testMsg.age);
      analysis.message = testMsg.text;
      analysis.response = aiResponse;
      analysis.age = testMsg.age;
      analysis.context = testMsg.context;
      analysis.character = testMsg.character;
      analysis.responseTime = responseTime;
      
      testResults.responses.push(analysis);
      
      // Update statistics
      testResults.statistics.averageResponseLength += analysis.length;
      if (analysis.hasQuestion) testResults.statistics.questionsAsked++;
      if (analysis.hasEmoji) testResults.statistics.emojisUsed++;
      testResults.statistics.averageHumanLikeScore += analysis.humanLike;
      testResults.statistics.responseTimes.push(responseTime);
      
      // Track tone distribution
      testResults.statistics.toneDistribution[analysis.tone] = 
        (testResults.statistics.toneDistribution[analysis.tone] || 0) + 1;
      
      // Check for issues
      if (analysis.length < 10) {
        testResults.issues.push(`Very short response: "${aiResponse.substring(0, 50)}"`);
      }
      if (analysis.length > 500) {
        testResults.issues.push(`Very long response: "${aiResponse.substring(0, 50)}..."`);
      }
      if (analysis.humanLike < 3) {
        testResults.issues.push(`Low human-like score (${analysis.humanLike}/10) for: "${testMsg.text}"`);
      }
      
      // Small delay to simulate real conversation
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Calculate final statistics
    testResults.statistics.averageResponseLength = 
      Math.round(testResults.statistics.averageResponseLength / testResults.totalMessages);
    testResults.statistics.averageHumanLikeScore = 
      (testResults.statistics.averageHumanLikeScore / testResults.totalMessages).toFixed(2);
    testResults.statistics.averageResponseTime = 
      Math.round(testResults.statistics.responseTimes.reduce((a, b) => a + b, 0) / testResults.statistics.responseTimes.length);
    
    // Save conversation
    conversations[conversationId] = conversation;
    setConversations(conversations);
    
    setResults(testResults);
    setTesting(false);
    setProgress(100);
    setCurrentMessage('');
    showToast('Test completed!', 'success');
  };
  
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            onClick={() => router.push('/ai-chat-settings')}
            variant="outline"
            className="mb-4"
          >
            ← Back to Settings
          </Button>
          <h1 className="text-3xl font-black text-gray-900 mb-2">AI Bot Responsiveness Test</h1>
          <p className="text-gray-600">Test the AI bot with 100 diverse messages across different characters, ages, and relationship contexts</p>
        </div>
        
        {!testing && !results && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Test Overview</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li><strong>100 diverse messages</strong> covering various scenarios</li>
                <li><strong>Different age groups:</strong> Young (18-25), Middle-aged (30-50), Senior (55+)</li>
                <li><strong>Different contexts:</strong> Casual, Romantic, Professional, Friendly, Deep</li>
                <li><strong>Different characters:</strong> Slang users, Formal speakers, Emoji users, etc.</li>
                <li><strong>Analysis metrics:</strong> Response length, human-like score, tone, engagement</li>
              </ul>
              <Button onClick={runTest} size="lg" className="w-full">
                Start Test (100 Messages)
              </Button>
            </div>
          </Card>
        )}
        
        {testing && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Running Test...</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              {currentMessage && (
                <p className="text-sm text-gray-600 mt-4">{currentMessage}</p>
              )}
            </div>
          </Card>
        )}
        
        {results && (
          <>
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Test Results Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-black text-blue-600">{results.statistics.averageHumanLikeScore}/10</div>
                    <div className="text-sm text-gray-600">Human-Like Score</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-black text-green-600">{results.statistics.averageResponseLength}</div>
                    <div className="text-sm text-gray-600">Avg Response Length</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-black text-purple-600">{results.statistics.questionsAsked}</div>
                    <div className="text-sm text-gray-600">Questions Asked</div>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="text-2xl font-black text-pink-600">{results.statistics.averageResponseTime}ms</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700">Emojis Used</span>
                      <span className="font-semibold">{results.statistics.emojisUsed} messages</span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 text-gray-700">Tone Distribution</div>
                    <div className="space-y-2">
                      {Object.entries(results.statistics.toneDistribution).map(([tone, count]) => (
                        <div key={tone} className="flex justify-between">
                          <span className="capitalize">{tone}</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {results.issues.length > 0 && (
              <Card className="mb-6">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-red-600">Issues Found ({results.issues.length})</h2>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {results.issues.slice(0, 20).map((issue, idx) => (
                      <div key={idx} className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                        {issue}
                      </div>
                    ))}
                    {results.issues.length > 20 && (
                      <p className="text-sm text-gray-500">... and {results.issues.length - 20} more issues</p>
                    )}
                  </div>
                </div>
              </Card>
            )}
            
            <Card className="mb-6">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Sample Responses</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {results.responses.slice(0, 10).map((result, idx) => (
                    <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900">User ({result.age}yo, {result.context}):</div>
                          <div className="text-sm text-gray-700 mb-2">"{result.message}"</div>
                          <div className="text-sm font-semibold text-blue-600">AI Bot:</div>
                          <div className="text-sm text-gray-700">"{result.response}"</div>
                        </div>
                        <div className="ml-4 text-right">
                          <div className="text-xs text-gray-500">Score: {result.humanLike}/10</div>
                          <div className="text-xs text-gray-500">{result.length} chars</div>
                          <div className="text-xs text-gray-500">{result.responseTime}ms</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={() => router.push('/messages')}
                  variant="outline"
                  className="mt-4"
                >
                  View Full Conversation
                </Button>
              </div>
            </Card>
            
            <div className="flex gap-4">
              <Button onClick={runTest} variant="outline">
                Run Test Again
              </Button>
              <Button onClick={() => router.push('/ai-chat-settings')}>
                Back to Settings
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
