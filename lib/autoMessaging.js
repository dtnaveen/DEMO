import { getAllUsers, getConversations, setConversations, getCurrentUser } from './localStorage';
import { getConversationId, devLog } from '../utils/helpers';
import { calculateMatchScore, getSharedInterests, getSharedContent } from './matchingAlgorithm';

/**
 * Generate an AI-like message based on shared interests
 */
function generateAIMessage(fromUser, toUser) {
  const sharedInterests = getSharedInterests(fromUser, toUser);
  const sharedContent = getSharedContent(fromUser, toUser);
  const matchScore = calculateMatchScore(fromUser, toUser);
  
  // Message templates based on shared interests
  const messages = [];
  
  // High match score messages
  if (matchScore.percentage >= 80) {
    messages.push(
      `Hey ${toUser.name.split(' ')[0]}! 👋 I noticed we have an ${matchScore.percentage}% match - that's pretty amazing!`,
      `Hi ${toUser.name.split(' ')[0]}! Our profiles aligned so well, I had to reach out. Would love to chat!`,
      `Hey! I saw we matched and couldn't resist saying hi. Looking forward to getting to know you better!`
    );
  } else if (matchScore.percentage >= 60) {
    messages.push(
      `Hey ${toUser.name.split(' ')[0]}! 👋 Saw we matched and thought I'd say hello!`,
      `Hi there! Nice to see we have some things in common. Want to chat?`,
      `Hey! Just matched with you - thought I'd reach out and see how you're doing!`
    );
  } else {
    messages.push(
      `Hey ${toUser.name.split(' ')[0]}! 👋 Thought I'd say hello!`,
      `Hi! Just wanted to reach out and introduce myself. Looking forward to chatting!`
    );
  }
  
  // Add context based on shared interests
  if (sharedInterests.length > 0) {
    const interest = sharedInterests[0];
    messages.push(
      `Hey ${toUser.name.split(' ')[0]}! I noticed we both value ${interest.answer.toLowerCase()}. That's really important to me too! Would love to hear your thoughts on it.`,
      `Hi! I saw we share a love for ${interest.answer.toLowerCase()}. It's rare to find someone who gets that!`,
      `Hey! We both seem to prioritize ${interest.answer.toLowerCase()} in relationships. I'd love to learn more about your perspective!`
    );
  }
  
  // Add content-based messages
  if (sharedContent.length > 0) {
    const content = sharedContent[0];
    messages.push(
      `Hey ${toUser.name.split(' ')[0]}! Fellow ${content.answer.toLowerCase()} fan here! What's your current favorite?`,
      `Hi! I noticed we're both into ${content.answer.toLowerCase()}. Always great to meet someone with similar taste!`,
      `Hey! We have similar content preferences - specifically ${content.answer.toLowerCase()}. Want to share recommendations?`
    );
  }
  
  // Age group specific messages
  if (fromUser.ageGroup === toUser.ageGroup) {
    if (fromUser.ageGroup === 'Gen Z') {
      messages.push(
        `Hey ${toUser.name.split(' ')[0]}! Fellow Gen Z here 👋 Saw we matched and thought I'd say hi!`,
        `Hi! Another Gen Z in the wild! Always cool to connect with people from our generation. Let's chat!`
      );
    } else if (fromUser.ageGroup === 'Millennials') {
      messages.push(
        `Hey ${toUser.name.split(' ')[0]}! Nice to see another millennial on here! Would love to connect.`,
        `Hi! Millennial here too. Saw we matched and thought I'd reach out. How are you doing?`
      );
    }
  }
  
  // Default friendly message
  messages.push(
    `Hey ${toUser.name.split(' ')[0]}! 👋 Just matched with you and thought I'd say hello! How's your day going?`,
    `Hi there! Saw we matched and couldn't resist reaching out. Would love to get to know you!`,
    `Hey! Nice to match with you. I'd love to chat if you're up for it!`
  );
  
  // Return a random message with AI bot indicator
  const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
  
  // Add AI bot note for Sarah Martinez
  if (fromUser.isAIBot) {
    return `${selectedMessage} 🤖 (This is an AI-generated message to help you get started!)`;
  }
  
  return selectedMessage;
}

/**
 * Send automatic messages from Sarah Martinez to ALL users
 */
export function sendAutoMessagesFromSarah() {
  if (typeof window === 'undefined') return;
  
  try {
    const allUsers = getAllUsers();
    const sarah = allUsers.find(u => {
      const nameLower = (u.name || '').toLowerCase();
      return nameLower.includes('sarah') && nameLower.includes('martinez');
    });
    
    if (!sarah) {
      // Sarah Martinez not found, skipping auto-messages
      return;
    }
    
    // Initialize bot profile if not exists (dynamic import to avoid circular dependency)
    if (typeof window !== 'undefined') {
      import('./botProfile').then(({ initializeBotProfile }) => {
        initializeBotProfile(sarah.id);
      }).catch(err => console.error('Failed to initialize bot profile:', err));
    }
    
    const conversations = getConversations();
    let messagesSent = 0;
    
    // Send message to all other users
    allUsers.forEach(user => {
      // Skip Sarah herself
      if (user.id === sarah.id) return;
      
      // Get or create conversation
      const conversationId = getConversationId(sarah.id, user.id);
      
      // Check if Sarah has already sent messages to this user
      if (conversations[conversationId]) {
        const existingMessages = conversations[conversationId].messages || [];
        const sarahHasMessaged = existingMessages.some(m => m.senderId === sarah.id);
        
        if (sarahHasMessaged) {
          return; // Skip if already messaged
        }
      }
      
      // Generate AI message
      const message = generateAIMessage(sarah, user);
      
      // Create or update conversation
      if (!conversations[conversationId]) {
        conversations[conversationId] = {
          participants: [sarah.id, user.id],
          messages: []
        };
      }
      
      // Add message from Sarah with AI bot indicator
      conversations[conversationId].messages.push({
        senderId: sarah.id,
        text: message,
        timestamp: new Date().toISOString(),
        isAI: true // Mark as AI-generated
      });
      
      messagesSent++;
    });
    
    // Save conversations
    setConversations(conversations);
    
    // Messages sent successfully
    
    return messagesSent;
  } catch (error) {
    console.error('Error sending auto-messages from Sarah:', error);
    return false;
  }
}

/**
 * Set up periodic auto-messages (optional - can be called to send more messages over time)
 */
export function setupPeriodicAutoMessages() {
  if (typeof window === 'undefined') return;
  
  // Send initial message
  sendAutoMessagesFromSarah();
  
  // Optionally set up interval to send more messages (every 5 minutes)
  // Uncomment if you want continuous messaging
  // setInterval(() => {
  //   sendAutoMessagesFromSarah();
  // }, 5 * 60 * 1000);
}

