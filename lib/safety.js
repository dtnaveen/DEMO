/**
 * Safety and Moderation Functions
 * Handles blocking, reporting, and content moderation
 */

/**
 * Block a user
 */
export function blockUser(userId) {
  if (typeof window === 'undefined') return;
  
  try {
    const blocked = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    if (!blocked.includes(userId)) {
      blocked.push(userId);
      localStorage.setItem('blockedUsers', JSON.stringify(blocked));
    }
  } catch (error) {
    console.error('Error blocking user:', error);
  }
}

/**
 * Unblock a user
 */
export function unblockUser(userId) {
  if (typeof window === 'undefined') return;
  
  try {
    const blocked = JSON.parse(localStorage.getItem('blockedUsers') || '[]');
    const updated = blocked.filter(id => id !== userId);
    localStorage.setItem('blockedUsers', JSON.stringify(updated));
  } catch (error) {
    console.error('Error unblocking user:', error);
  }
}

/**
 * Get list of blocked users
 */
export function getBlockedUsers() {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('blockedUsers') || '[]');
  } catch (error) {
    console.error('Error getting blocked users:', error);
    return [];
  }
}

/**
 * Check if user is blocked
 */
export function isUserBlocked(userId) {
  const blocked = getBlockedUsers();
  return blocked.includes(userId);
}

/**
 * Report a user
 */
export function reportUser(userId, reportData) {
  if (typeof window === 'undefined') return;
  
  try {
    const reports = JSON.parse(localStorage.getItem('userReports') || '[]');
    reports.push({
      userId,
      ...reportData,
      reportedAt: new Date().toISOString()
    });
    localStorage.setItem('userReports', JSON.stringify(reports));
  } catch (error) {
    console.error('Error reporting user:', error);
  }
}

/**
 * Get reports for a user
 */
export function getUserReports(userId) {
  if (typeof window === 'undefined') return [];
  
  try {
    const reports = JSON.parse(localStorage.getItem('userReports') || '[]');
    return reports.filter(r => r.userId === userId);
  } catch (error) {
    console.error('Error getting user reports:', error);
    return [];
  }
}

/**
 * Check if content is inappropriate (basic keyword filtering)
 */
export function containsInappropriateContent(text) {
  if (!text) return false;
  
  const inappropriateKeywords = [
    'spam', 'scam', 'fake', 'bot'
    // Add more keywords as needed
  ];
  
  const lowerText = text.toLowerCase();
  return inappropriateKeywords.some(keyword => lowerText.includes(keyword));
}

