/**
 * Generate test data for admin metrics testing
 */

import { getAllUsers, setAllUsers, getMatches, setMatches, getConversations, setConversations } from './localStorage';

export function generateTestDataForMetrics() {
  const allUsers = getAllUsers();
  
  // Ensure we have some users with lastActive dates
  const now = Date.now();
  const oneDayAgo = now - (24 * 60 * 60 * 1000);
  const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
  
  // Update users with lastActive dates
  allUsers.forEach((user, index) => {
    if (!user.lastActive) {
      // Distribute users across different activity periods
      if (index % 3 === 0) {
        user.lastActive = new Date(now - (index * 1000)).toISOString(); // Recent
      } else if (index % 3 === 1) {
        user.lastActive = new Date(oneDayAgo - (index * 1000)).toISOString(); // 1 day ago
      } else {
        user.lastActive = new Date(oneMonthAgo - (index * 1000)).toISOString(); // 1 month ago
      }
    }
    
    // Add some verified users
    if (index % 2 === 0) {
      user.verified = true;
    }
    
    // Add some complete profiles
    if (index % 4 === 0) {
      user.bio = user.bio || 'This is a complete profile with enough bio text to satisfy the completion requirements.';
      user.valueAnswers = user.valueAnswers || [{ question: 'test', answer: 'test' }];
    }
  });
  
  setAllUsers(allUsers);
  
  // Create some test matches
  const matches = getMatches();
  if (matches.length === 0 && allUsers.length >= 2) {
    const newMatches = [];
    for (let i = 0; i < Math.min(5, Math.floor(allUsers.length / 2)); i++) {
      const user1 = allUsers[i * 2];
      const user2 = allUsers[i * 2 + 1];
      if (user1 && user2) {
        newMatches.push({
          userId1: user1.id,
          userId2: user2.id,
          timestamp: new Date(now - (i * 24 * 60 * 60 * 1000)).toISOString(),
        });
      }
    }
    setMatches(newMatches);
  }
  
  // Create test likes
  const likes = JSON.parse(localStorage.getItem('likes') || '[]');
  if (likes.length === 0 && allUsers.length >= 2) {
    const newLikes = [];
    for (let i = 0; i < Math.min(10, allUsers.length * 2); i++) {
      const fromUser = allUsers[i % allUsers.length];
      const toUser = allUsers[(i + 1) % allUsers.length];
      if (fromUser && toUser && fromUser.id !== toUser.id) {
        newLikes.push({
          fromUserId: fromUser.id,
          toUserId: toUser.id,
          timestamp: new Date(now - (i * 60 * 60 * 1000)).toISOString(),
        });
      }
    }
    localStorage.setItem('likes', JSON.stringify(newLikes));
  }
  
  // Create test conversations with messages
  const conversations = getConversations();
  const conversationIds = Object.keys(conversations);
  
  if (conversationIds.length === 0 && allUsers.length >= 2) {
    const matches = getMatches();
    const newConversations = {};
    
    matches.slice(0, 3).forEach((match, index) => {
      const conversationId = `${match.userId1}_${match.userId2}`;
      const messages = [];
      
      // Create 10+ messages for successful matches
      for (let i = 0; i < 12; i++) {
        messages.push({
          id: `msg-${index}-${i}`,
          senderId: i % 2 === 0 ? match.userId1 : match.userId2,
          text: `Test message ${i + 1}`,
          timestamp: new Date(now - ((12 - i) * 60 * 60 * 1000)).toISOString(),
          createdAt: new Date(now - ((12 - i) * 60 * 60 * 1000)).toISOString(),
          readAt: i > 0 ? new Date(now - ((12 - i - 1) * 60 * 60 * 1000)).toISOString() : null,
        });
      }
      
      newConversations[conversationId] = {
        userId1: match.userId1,
        userId2: match.userId2,
        participants: [match.userId1, match.userId2],
        messages,
      };
    });
    
    // Store conversations (bypassing the disabled setConversations)
    try {
      localStorage.setItem('conversations', JSON.stringify(newConversations));
    } catch (error) {
      console.error('Error saving test conversations:', error);
    }
  }
  
  return {
    users: allUsers.length,
    matches: getMatches().length,
    likes: JSON.parse(localStorage.getItem('likes') || '[]').length,
    conversations: Object.keys(getConversations()).length,
  };
}

