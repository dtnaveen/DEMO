// Helper functions for localStorage operations

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    // Error reading current user (silent in production)
    return null;
  }
}

export function setCurrentUser(user) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    // Error saving current user (silent in production)
    if (error.name === 'QuotaExceededError') {
      alert('Storage quota exceeded. Please clear some data.');
    }
  }
}

export function getAllUsers() {
  if (typeof window === 'undefined') return [];
  
  try {
    const users = localStorage.getItem('allUsers');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    // Error reading all users (silent in production)
    return [];
  }
}

export function setAllUsers(users) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('allUsers', JSON.stringify(users));
  } catch (error) {
    // Error saving all users (silent in production)
  }
}

export function getMatches() {
  if (typeof window === 'undefined') return [];
  
  try {
    const matches = localStorage.getItem('matches');
    return matches ? JSON.parse(matches) : [];
  } catch (error) {
    // Error reading matches (silent in production)
    return [];
  }
}

export function setMatches(matches) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('matches', JSON.stringify(matches));
  } catch (error) {
    // Error saving matches (silent in production)
  }
}

export function getConversations() {
  if (typeof window === 'undefined') return {};
  
  try {
    const convos = localStorage.getItem('conversations');
    return convos ? JSON.parse(convos) : {};
  } catch (error) {
    // Error reading conversations (silent in production)
    return {};
  }
}

export function setConversations(conversations) {
  if (typeof window === 'undefined') return;
  
  // Message storage disabled - do not save conversations to localStorage
  // Messages will not persist after page refresh
  // Uncomment the code below to re-enable message storage:
  /*
  try {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  } catch (error) {
    // Error saving conversations (silent in production)
  }
  */
  return;
}

/**
 * Clear all stored message data
 */
export function clearConversations() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('conversations');
  } catch (error) {
    // Error clearing conversations (silent in production)
  }
}

/**
 * Clear all conversations data - removes message history
 */
export function clearAllConversations() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('conversations');
    return true;
  } catch (error) {
    console.error('Error clearing all conversations:', error);
    return false;
  }
}

export function getUserActions() {
  if (typeof window === 'undefined') return { likes: [], passes: [] };
  
  try {
    const actions = localStorage.getItem('userActions');
    return actions ? JSON.parse(actions) : { likes: [], passes: [] };
  } catch (error) {
    console.error('Error reading user actions:', error);
    return { likes: [], passes: [] };
  }
}

export function setUserActions(actions) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('userActions', JSON.stringify(actions));
  } catch (error) {
    console.error('Error saving user actions:', error);
  }
}

/**
 * Get all likes from user actions
 */
export function getLikes() {
  const actions = getUserActions();
  return actions.likes || [];
}

/**
 * Get all messages from conversations
 */
export function getMessages() {
  const conversations = getConversations();
  return Object.values(conversations) || [];
}

export function addLike(userId) {
  const actions = getUserActions();
  if (!actions.likes.includes(userId)) {
    actions.likes.push(userId);
    setUserActions(actions);
  }
}

export function addPass(userId) {
  const actions = getUserActions();
  if (!actions.passes.includes(userId)) {
    actions.passes.push(userId);
    setUserActions(actions);
  }
}

export function isLiked(userId) {
  const actions = getUserActions();
  return actions.likes.includes(userId);
}

export function isPassed(userId) {
  const actions = getUserActions();
  return actions.passes.includes(userId);
}

export function clearCurrentUser() {
  if (typeof window === 'undefined') return;
  
  // Only clear the current user session, keep all other data (chats, matches, etc.)
  localStorage.removeItem('currentUser');
}

export function clearAllData() {
  if (typeof window === 'undefined') return;
  
  // Clear everything - only use this for complete reset
  localStorage.removeItem('currentUser');
  localStorage.removeItem('allUsers');
  localStorage.removeItem('matches');
  localStorage.removeItem('conversations');
  localStorage.removeItem('userActions');
}

export function checkStorageSupport() {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Update a user's password by name or email
 * @param {string} identifier - User's name or email
 * @param {string} newPassword - New password to set
 * @returns {boolean} - True if password was updated, false otherwise
 */
export function updateUserPasswordByIdentifier(identifier, newPassword) {
  if (typeof window === 'undefined') return false;
  
  try {
    const allUsers = getAllUsers();
    const identifierLower = identifier.toLowerCase();
    
    // Find user by name or email (case-insensitive)
    const userIndex = allUsers.findIndex(u => 
      u.name?.toLowerCase().includes(identifierLower) || 
      u.email?.toLowerCase().includes(identifierLower)
    );
    
    if (userIndex === -1) {
      console.error(`User not found: ${identifier}`);
      return false;
    }
    
    // Update password
    allUsers[userIndex].password = newPassword;
    setAllUsers(allUsers);
    
    return true;
  } catch (error) {
    console.error('Error updating user password:', error);
    return false;
  }
}
