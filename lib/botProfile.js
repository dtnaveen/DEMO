import { getAllUsers, setAllUsers } from './localStorage';
import { devLog } from '../utils/helpers';

/**
 * Default bot profile configuration
 */
export const DEFAULT_BOT_PROFILE = {
  personality: 'friendly', // friendly, professional, playful, intellectual, supportive
  replyStyle: 'conversational', // conversational, brief, detailed, enthusiastic
  topics: ['hobbies', 'interests', 'travel', 'music', 'movies', 'food'], // Topics bot likes to discuss
  emojiUsage: true, // Use emojis in messages
  askQuestions: true, // Ask follow-up questions
  responseLength: 'medium', // short, medium, long
  humorLevel: 'medium', // none, low, medium, high
  formality: 'casual', // formal, casual
  sexualChatLevel: 'none', // none, mild, moderate, high - Controls level of sexual/romantic content in conversations
  activeHours: {
    start: 9, // 9 AM
    end: 22 // 10 PM
  },
  replyDelay: {
    min: 3, // minimum seconds
    max: 8 // maximum seconds
  },
  conversationStarters: [
    "What's been the highlight of your week?",
    "I'm curious - what's something you're passionate about?",
    "Tell me about something fun you've done recently!",
    "What's a hobby or interest you could talk about for hours?",
    "I'd love to know what makes you smile!"
  ],
  favoriteTopics: [], // User-defined favorite topics
  avoidTopics: [], // Topics to avoid
  customGreeting: null, // Custom greeting message
  customBio: null // Custom bio override
};

/**
 * Get bot profile for a specific bot user
 */
export function getBotProfile(botUserId) {
  if (typeof window === 'undefined') return DEFAULT_BOT_PROFILE;
  
  const allUsers = getAllUsers();
  const botUser = allUsers.find(u => u.id === botUserId && u.isAIBot);
  
  if (!botUser) return DEFAULT_BOT_PROFILE;
  
  // Return bot profile or default
  return botUser.botProfile || DEFAULT_BOT_PROFILE;
}

/**
 * Update bot profile
 */
export function updateBotProfile(botUserId, profileUpdates) {
  if (typeof window === 'undefined') return false;
  
  try {
    const allUsers = getAllUsers();
    const botIndex = allUsers.findIndex(u => u.id === botUserId && u.isAIBot);
    
    if (botIndex === -1) {
      console.error('Bot user not found');
      return false;
    }
    
    // Merge with existing profile or use defaults
    const currentProfile = allUsers[botIndex].botProfile || DEFAULT_BOT_PROFILE;
    const updatedProfile = {
      ...currentProfile,
      ...profileUpdates
    };
    
    // Update user with new bot profile
    allUsers[botIndex] = {
      ...allUsers[botIndex],
      botProfile: updatedProfile
    };
    
    setAllUsers(allUsers);
      devLog('✅ Bot profile updated');
    return true;
  } catch (error) {
    console.error('Error updating bot profile:', error);
    return false;
  }
}

/**
 * Initialize bot profile for a bot user if not exists
 */
export function initializeBotProfile(botUserId) {
  if (typeof window === 'undefined') return false;
  
  const allUsers = getAllUsers();
  const botIndex = allUsers.findIndex(u => u.id === botUserId && u.isAIBot);
  
  if (botIndex === -1) return false;
  
  if (!allUsers[botIndex].botProfile) {
    allUsers[botIndex].botProfile = { ...DEFAULT_BOT_PROFILE };
    setAllUsers(allUsers);
  }
  
  return true;
}

/**
 * Get bot user ID by name (finds Sarah Martinez by default)
 */
export function getBotUserId(botName = 'Sarah Martinez') {
  if (typeof window === 'undefined') return null;
  
  const allUsers = getAllUsers();
  const bot = allUsers.find(u => {
    const nameLower = (u.name || '').toLowerCase();
    const searchLower = botName.toLowerCase();
    return nameLower.includes(searchLower.split(' ')[0]) && 
           nameLower.includes(searchLower.split(' ')[1] || '');
  });
  
  return bot?.id || null;
}

