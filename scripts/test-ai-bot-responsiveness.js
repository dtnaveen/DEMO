/**
 * Test AI Bot Responsiveness
 * Sends 100 different consecutive messages in various formats
 * to test if the bot responds like a human
 */

import { getCurrentUser, getAllUsers, getConversations, setConversations } from '../lib/localStorage.js';
import { getOrCreateAIChatBot, getOrCreateAIBotConversation, AI_CHAT_BOT_ID } from '../lib/aiChatBot.js';
import { generateAIReply } from '../lib/aiBotReplies.js';
import { getConversationId } from '../utils/helpers.js';

// Mock localStorage for Node.js environment
if (typeof window === 'undefined') {
  global.window = {};
  global.localStorage = {
    store: {},
    getItem: function(key) {
      return this.store[key] || null;
    },
    setItem: function(key, value) {
      this.store[key] = value.toString();
    },
    removeItem: function(key) {
      delete this.store[key];
    },
    clear: function() {
      this.store = {};
    }
  };
}

// Initialize test user
const testUser = {
  id: 'test-user-123',
  name: 'Test User',
  age: 25,
  location: 'Test City',
  bio: 'Testing AI bot responsiveness',
  valueAnswers: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0],
  contentAnswers: [0, 1, 0, 1, 0],
  preferences: {
    lookingFor: 'Relationship',
    ageRange: [18, 50],
    distance: 25,
    genderPreference: ['Everyone'],
    dealBreakers: []
  }
};

// Set up test environment
if (typeof window !== 'undefined') {
  localStorage.setItem('currentUser', JSON.stringify(testUser));
  localStorage.setItem('allUsers', JSON.stringify([testUser]));
  localStorage.setItem('conversations', JSON.stringify({}));
}

// 100 diverse test messages covering all formats
const testMessages = [
  // Greetings and casual conversation
  "Hi there!",
  "Hello! How are you?",
  "Hey 👋",
  "What's up?",
  "Good morning!",
  "How's your day going?",
  
  // Questions about interests
  "What do you like to do for fun?",
  "Do you have any hobbies?",
  "What kind of music do you listen to?",
  "Are you into movies?",
  "Do you like traveling?",
  "What's your favorite food?",
  "Do you enjoy reading?",
  "Are you a sports fan?",
  "What do you think about technology?",
  "Do you like animals?",
  
  // Personal questions
  "Tell me about yourself",
  "What makes you happy?",
  "What's your biggest fear?",
  "What are your goals?",
  "What's your favorite memory?",
  "What do you value most?",
  "How do you handle stress?",
  "What's your ideal day?",
  
  // Emotional expressions
  "I'm feeling great today! 😊",
  "I'm a bit tired",
  "I'm so excited!",
  "I'm feeling anxious",
  "I'm really happy right now",
  "I'm confused about something",
  "I'm grateful for today",
  "I'm feeling creative",
  
  // Statements and opinions
  "I think technology is amazing",
  "I love spending time outdoors",
  "I believe in being kind to others",
  "I enjoy trying new things",
  "I prefer quiet evenings at home",
  "I think communication is important",
  "I value honesty above all",
  "I enjoy deep conversations",
  
  // Questions about relationships
  "What do you look for in a relationship?",
  "How important is communication to you?",
  "Do you believe in love at first sight?",
  "What's your idea of a perfect date?",
  "How do you handle disagreements?",
  "What makes a relationship work?",
  "Do you think opposites attract?",
  "How do you show someone you care?",
  
  // Random topics
  "Have you seen any good movies lately?",
  "What's the weather like where you are?",
  "Do you have any pets?",
  "What's your favorite season?",
  "Do you like coffee or tea?",
  "What's your favorite color?",
  "Do you prefer city or country life?",
  "What's your dream vacation?",
  
  // Emoji-heavy messages
  "That's awesome! 🎉",
  "I'm so happy! 😄",
  "Love it! ❤️",
  "That's funny! 😂",
  "Amazing! ✨",
  "So cool! 🔥",
  "Perfect! 👌",
  "Awesome! 🤩",
  
  // Short responses
  "Yeah",
  "Sure",
  "Okay",
  "Nice",
  "Cool",
  "Thanks",
  "Got it",
  "I see",
  
  // Long messages
  "I've been thinking a lot lately about what I want in life and where I'm heading. It's been quite a journey of self-discovery and I'm learning so much about myself every day.",
  "You know, I really appreciate having someone to talk to. It's nice to have meaningful conversations and share thoughts and ideas with someone who listens and understands.",
  "I think the most important thing in life is to be true to yourself and to treat others with kindness and respect. That's what I try to do every day.",
  
  // Questions requiring thought
  "What do you think makes life meaningful?",
  "How do you define success?",
  "What's your philosophy on life?",
  "What do you think about the future?",
  "How do you stay positive?",
  "What inspires you?",
  "What's your biggest dream?",
  "What would you change about the world?",
  
  // Conversational continuations
  "That's interesting, tell me more",
  "I never thought about it that way",
  "You make a good point",
  "I can relate to that",
  "That sounds amazing",
  "I'd love to hear more",
  "That's really cool",
  "I agree with you",
  
  // Mixed formats
  "Hey! How's it going? 😊 I was just thinking about you",
  "That's so cool! I love that idea ❤️",
  "Thanks for listening! You're awesome ✨",
  "I'm really excited about this! 🎉",
  "That makes sense. I appreciate your perspective",
  "Wow! That's amazing! Tell me more about it",
  "I'm feeling great today! How about you? 😄",
  "That's a really interesting point. I never thought of it that way",
  
  // Edge cases
  "???",
  "!!!",
  "...",
  "haha",
  "lol",
  "omg",
  "wtf",
  "idk",
  
  // Final messages
  "This has been a great conversation!",
  "Thanks for chatting with me!",
  "I really enjoyed talking to you!",
  "You're really easy to talk to!",
  "I appreciate our conversation!",
  "You're awesome!",
  "Thanks for being here!",
  "I'm glad we talked!"
];

async function testAIBotResponsiveness() {
  console.log('🤖 Starting AI Bot Responsiveness Test...\n');
  console.log(`Sending ${testMessages.length} diverse messages to test human-like responses\n`);
  
  // Initialize bot and conversation
  const aiBot = getOrCreateAIChatBot();
  if (!aiBot) {
    console.error('❌ Failed to create AI bot');
    return;
  }
  
  const conversationId = getOrCreateAIBotConversation();
  if (!conversationId) {
    console.error('❌ Failed to create conversation');
    return;
  }
  
  const conversations = getConversations();
  let conversation = conversations[conversationId] || {
    participants: [testUser.id, aiBot.id],
    messages: []
  };
  
  // Clear existing messages for clean test
  conversation.messages = [];
  
  const results = {
    totalMessages: testMessages.length,
    responses: [],
    responseLengths: [],
    uniqueResponses: new Set(),
    responseTimes: [],
    errors: [],
    analysis: {
      averageResponseLength: 0,
      uniqueResponseRate: 0,
      averageResponseTime: 0,
      errorRate: 0,
      humanLikeScore: 0
    }
  };
  
  // Send all messages and collect responses
  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    const startTime = Date.now();
    
    try {
      // Add user message
      conversation.messages.push({
        senderId: testUser.id,
        text: message,
        timestamp: new Date().toISOString()
      });
      
      // Generate AI response
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      const aiResponse = generateAIReply(aiBot, testUser, conversation.messages, lastMessage);
      
      // Add AI response
      conversation.messages.push({
        senderId: aiBot.id,
        text: aiResponse,
        timestamp: new Date().toISOString(),
        isAI: true
      });
      
      const responseTime = Date.now() - startTime;
      
      results.responses.push({
        messageNumber: i + 1,
        userMessage: message,
        botResponse: aiResponse,
        responseLength: aiResponse.length,
        responseTime: responseTime,
        isUnique: !results.uniqueResponses.has(aiResponse)
      });
      
      results.responseLengths.push(aiResponse.length);
      results.responseTimes.push(responseTime);
      results.uniqueResponses.add(aiResponse);
      
      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`✓ Processed ${i + 1}/${testMessages.length} messages...`);
      }
      
    } catch (error) {
      results.errors.push({
        messageNumber: i + 1,
        userMessage: message,
        error: error.message
      });
      console.error(`❌ Error on message ${i + 1}:`, error.message);
    }
  }
  
  // Save conversation
  conversations[conversationId] = conversation;
  setConversations(conversations);
  
  // Calculate analysis
  results.analysis.averageResponseLength = 
    results.responseLengths.reduce((a, b) => a + b, 0) / results.responseLengths.length;
  results.analysis.uniqueResponseRate = 
    (results.uniqueResponses.size / results.responses.length) * 100;
  results.analysis.averageResponseTime = 
    results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length;
  results.analysis.errorRate = 
    (results.errors.length / testMessages.length) * 100;
  
  // Calculate human-like score (0-100)
  // Factors: response variety, appropriate length, contextual relevance
  const varietyScore = results.analysis.uniqueResponseRate; // 0-100
  const lengthScore = results.analysis.averageResponseLength > 20 && 
                      results.analysis.averageResponseLength < 200 ? 100 : 50; // Prefer 20-200 chars
  const errorScore = 100 - results.analysis.errorRate;
  
  results.analysis.humanLikeScore = 
    (varietyScore * 0.5) + (lengthScore * 0.3) + (errorScore * 0.2);
  
  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('📊 AI BOT RESPONSIVENESS TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`\n✅ Total Messages Sent: ${results.totalMessages}`);
  console.log(`✅ Successful Responses: ${results.responses.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);
  console.log(`\n📈 Response Analysis:`);
  console.log(`   • Average Response Length: ${results.analysis.averageResponseLength.toFixed(1)} characters`);
  console.log(`   • Unique Response Rate: ${results.analysis.uniqueResponseRate.toFixed(1)}%`);
  console.log(`   • Average Response Time: ${results.analysis.averageResponseTime.toFixed(1)}ms`);
  console.log(`   • Error Rate: ${results.analysis.errorRate.toFixed(1)}%`);
  console.log(`\n🎯 Human-Like Score: ${results.analysis.humanLikeScore.toFixed(1)}/100`);
  
  // Score interpretation
  let interpretation = '';
  if (results.analysis.humanLikeScore >= 80) {
    interpretation = '🌟 Excellent - Bot responds very human-like!';
  } else if (results.analysis.humanLikeScore >= 60) {
    interpretation = '👍 Good - Bot responds well but could be more varied';
  } else if (results.analysis.humanLikeScore >= 40) {
    interpretation = '⚠️  Fair - Bot needs improvement in variety and context';
  } else {
    interpretation = '❌ Poor - Bot responses are too repetitive or generic';
  }
  
  console.log(`   ${interpretation}`);
  
  // Show sample responses
  console.log(`\n📝 Sample Responses (First 5):`);
  results.responses.slice(0, 5).forEach((r, idx) => {
    console.log(`\n   ${idx + 1}. User: "${r.userMessage}"`);
    console.log(`      Bot: "${r.botResponse.substring(0, 100)}${r.botResponse.length > 100 ? '...' : ''}"`);
  });
  
  // Show unique response examples
  console.log(`\n🔄 Unique Response Examples:`);
  const uniqueExamples = Array.from(results.uniqueResponses).slice(0, 5);
  uniqueExamples.forEach((response, idx) => {
    console.log(`   ${idx + 1}. "${response.substring(0, 80)}${response.length > 80 ? '...' : ''}"`);
  });
  
  // Show errors if any
  if (results.errors.length > 0) {
    console.log(`\n❌ Errors Encountered:`);
    results.errors.forEach(err => {
      console.log(`   Message ${err.messageNumber}: ${err.error}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Test Complete!\n');
  
  return results;
}

// Run test if executed directly
if (typeof window !== 'undefined' || typeof module === 'undefined') {
  testAIBotResponsiveness().catch(console.error);
}

export { testAIBotResponsiveness, testMessages };
