/**
 * AI Chat Bot - Always Available Chat Assistant
 * Provides a personalized AI chat bot that's always available in messages
 * regardless of matches. Each user can customize their bot's character.
 */

import { getCurrentUser, getAllUsers, setAllUsers, getConversations, setConversations } from './localStorage';
import { getConversationId } from '../utils/helpers';
import { DEFAULT_BOT_PROFILE, updateBotProfile, initializeBotProfile } from './botProfile';
import { generateAIReply } from './aiBotReplies';

/**
 * AI Bot User ID - Fixed ID for the AI chat bot
 */
export const AI_CHAT_BOT_ID = 'ai-chat-bot-assistant';

/**
 * Get or create the AI chat bot user for the current user
 * Each user gets their own personalized AI bot instance
 */
export function getOrCreateAIChatBot() {
  if (typeof window === 'undefined') return null;
  
  const currentUser = getCurrentUser();
  if (!currentUser) return null;
  
  const allUsers = getAllUsers();
  
  // Check if AI bot already exists for this user
  let aiBot = allUsers.find(u => u.id === AI_CHAT_BOT_ID && u.ownerId === currentUser.id);
  
  if (!aiBot) {
    // Create personalized AI bot for this user
    aiBot = {
      id: AI_CHAT_BOT_ID,
      ownerId: currentUser.id, // Link bot to current user
      name: 'AI Assistant',
      age: 25,
      location: 'Always Here',
      bio: 'Your personal AI chat assistant. I\'m here to help, chat, and keep you company!',
      photoUrl: null, // Will use default avatar
      isAIBot: true,
      subscriptionTier: 'free',
      botProfile: {
        ...DEFAULT_BOT_PROFILE,
        // User can customize these later
        personality: 'friendly',
        replyStyle: 'conversational',
        emojiUsage: true,
        askQuestions: true,
        responseLength: 'medium',
        humorLevel: 'medium',
        formality: 'casual',
      },
      // Default conversation starter
      welcomeMessage: "Hi! I'm your AI assistant. I'm here to chat, help, and keep you company. What would you like to talk about? 😊"
    };
    
    // Add bot to users list
    allUsers.push(aiBot);
    setAllUsers(allUsers);
  } else {
    // Ensure bot profile is initialized
    if (!aiBot.botProfile) {
      aiBot.botProfile = { ...DEFAULT_BOT_PROFILE };
      const botIndex = allUsers.findIndex(u => u.id === AI_CHAT_BOT_ID && u.ownerId === currentUser.id);
      if (botIndex !== -1) {
        allUsers[botIndex] = aiBot;
        setAllUsers(allUsers);
      }
    }
  }
  
  return aiBot;
}

/**
 * Get or create conversation with AI bot
 */
export function getOrCreateAIBotConversation() {
  if (typeof window === 'undefined') return null;
  
  const currentUser = getCurrentUser();
  if (!currentUser) return null;
  
  const aiBot = getOrCreateAIChatBot();
  if (!aiBot) return null;
  
  const conversationId = getConversationId(currentUser.id, aiBot.id);
  const conversations = getConversations();
  
  // Create conversation if it doesn't exist
  if (!conversations[conversationId]) {
    conversations[conversationId] = {
      participants: [currentUser.id, aiBot.id],
      messages: []
    };
    
    // Add welcome message if bot has one
    if (aiBot.welcomeMessage) {
      conversations[conversationId].messages.push({
        senderId: aiBot.id,
        text: aiBot.welcomeMessage,
        timestamp: new Date().toISOString(),
        isAI: true
      });
    }
    
    setConversations(conversations);
  }
  
  return conversationId;
}

/**
 * Update AI bot's character/personality
 */
export function updateAIBotCharacter(updates) {
  if (typeof window === 'undefined') return false;
  
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  const aiBot = getOrCreateAIChatBot();
  if (!aiBot) return false;
  
  // Update bot profile
  const success = updateBotProfile(aiBot.id, updates);
  
  // Also update bot's name if provided
  if (updates.name) {
    const allUsers = getAllUsers();
    const botIndex = allUsers.findIndex(u => u.id === AI_CHAT_BOT_ID && u.ownerId === currentUser.id);
    if (botIndex !== -1) {
      allUsers[botIndex].name = updates.name;
      setAllUsers(allUsers);
    }
  }
  
  return success;
}

/**
 * Get AI bot's current character settings
 */
export function getAIBotCharacter() {
  if (typeof window === 'undefined') return DEFAULT_BOT_PROFILE;
  
  const aiBot = getOrCreateAIChatBot();
  if (!aiBot) return DEFAULT_BOT_PROFILE;
  
  return {
    name: aiBot.name,
    ...aiBot.botProfile
  };
}

/**
 * Send message to AI bot and get response
 */
export function sendMessageToAIBot(messageText) {
  if (typeof window === 'undefined') return null;
  
  const currentUser = getCurrentUser();
  if (!currentUser) return null;
  
  const aiBot = getOrCreateAIChatBot();
  if (!aiBot) return null;
  
  const conversationId = getOrCreateAIBotConversation();
  if (!conversationId) return null;
  
  const conversations = getConversations();
  const conversation = conversations[conversationId];
  
  if (!conversation) return null;
  
  // Add user's message
  conversation.messages.push({
    senderId: currentUser.id,
    text: messageText,
    timestamp: new Date().toISOString()
  });
  
  // Generate AI response
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const aiResponse = generateAIReply(aiBot, currentUser, conversation.messages, lastMessage);
  
  // Add AI response
  conversation.messages.push({
    senderId: aiBot.id,
    text: aiResponse,
    timestamp: new Date().toISOString(),
    isAI: true
  });
  
  conversations[conversationId] = conversation;
  setConversations(conversations);
  
  // Trigger update event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('conversationsUpdated'));
  }
  
  return aiResponse;
}
