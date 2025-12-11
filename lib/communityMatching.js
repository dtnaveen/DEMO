/**
 * Community-Driven Matching
 * Friend recommendations, group matching, community validation
 */

/**
 * Get friend recommendations
 * Recommendations from mutual connections
 * @param {Object} user - Current user
 * @param {Array} allUsers - All users
 * @param {Object} connections - User connections graph
 * @returns {Array} Friend recommendations
 */
export function getFriendRecommendations(user, allUsers, connections = {}) {
  const recommendations = [];

  // Get user's connections
  const userConnections = connections[user.id] || [];
  
  // Find users connected to user's connections (friends of friends)
  const friendsOfFriends = {};
  
  userConnections.forEach(connectionId => {
    const connectionConnections = connections[connectionId] || [];
    connectionConnections.forEach(friendId => {
      if (friendId !== user.id && !userConnections.includes(friendId)) {
        if (!friendsOfFriends[friendId]) {
          friendsOfFriends[friendId] = [];
        }
        friendsOfFriends[friendId].push(connectionId);
      }
    });
  });

  // Convert to recommendations
  Object.entries(friendsOfFriends).forEach(([userId, mutualFriends]) => {
    const recommendedUser = allUsers.find(u => u.id === userId);
    if (recommendedUser) {
      recommendations.push({
        user: recommendedUser,
        mutualFriends: mutualFriends.length,
        mutualFriendIds: mutualFriends,
        recommendationReason: `${mutualFriends.length} mutual friend${mutualFriends.length > 1 ? 's' : ''}`,
        trustScore: calculateTrustScore(mutualFriends.length),
      });
    }
  });

  // Sort by trust score (more mutual friends = higher trust)
  return recommendations.sort((a, b) => b.trustScore - a.trustScore);
}

/**
 * Calculate trust score based on mutual connections
 * @param {number} mutualCount - Number of mutual friends
 * @returns {number} Trust score (0-100)
 */
function calculateTrustScore(mutualCount) {
  // More mutual friends = higher trust
  return Math.min(mutualCount * 20, 100);
}

/**
 * Group matching
 * Match users within the same interest groups
 * @param {Object} user - Current user
 * @param {Array} allUsers - All users
 * @param {Object} groups - User groups data
 * @returns {Array} Group-based matches
 */
export function getGroupMatches(user, allUsers, groups = {}) {
  const userGroups = groups[user.id] || [];
  const matches = [];

  // Find users in same groups
  const groupMembers = {};
  
  userGroups.forEach(groupId => {
    const group = groups[groupId];
    if (group && group.members) {
      group.members.forEach(memberId => {
        if (memberId !== user.id) {
          if (!groupMembers[memberId]) {
            groupMembers[memberId] = [];
          }
          groupMembers[memberId].push(groupId);
        }
      });
    }
  });

  // Convert to matches
  Object.entries(groupMembers).forEach(([userId, sharedGroups]) => {
    const matchedUser = allUsers.find(u => u.id === userId);
    if (matchedUser) {
      matches.push({
        user: matchedUser,
        sharedGroups: sharedGroups.length,
        groupIds: sharedGroups,
        recommendationReason: `Both in ${sharedGroups.length} group${sharedGroups.length > 1 ? 's' : ''}`,
        compatibility: calculateGroupCompatibility(user, matchedUser, sharedGroups),
      });
    }
  });

  // Sort by compatibility
  return matches.sort((a, b) => b.compatibility - a.compatibility);
}

/**
 * Calculate group-based compatibility
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @param {Array} sharedGroups - Shared group IDs
 * @returns {number} Compatibility score
 */
function calculateGroupCompatibility(user1, user2, sharedGroups) {
  let score = 50; // Base score

  // More shared groups = higher compatibility
  score += sharedGroups.length * 10;

  // Shared interests from groups
  if (user1.lifestyle && user2.lifestyle) {
    const sharedLifestyle = user1.lifestyle.filter(l => user2.lifestyle.includes(l));
    score += sharedLifestyle.length * 5;
  }

  return Math.min(score, 100);
}

/**
 * Community validation
 * Get community validation score for user
 * @param {Object} user - User to validate
 * @param {Object} communityData - Community data (reviews, reports, etc.)
 * @returns {Object} Validation score
 */
export function getCommunityValidation(user, communityData = {}) {
  const validation = {
    score: 0,
    factors: {},
    verified: false,
    badges: [],
  };

  // Profile completeness
  const completeness = calculateProfileCompleteness(user);
  validation.factors.profileCompleteness = completeness;
  validation.score += completeness * 0.2;

  // Verification status
  if (user.isVerified) {
    validation.factors.verified = true;
    validation.score += 30;
    validation.verified = true;
    validation.badges.push('Verified');
  }

  // Positive reviews
  const reviews = communityData.reviews?.[user.id] || [];
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const reviewScore = Math.min((positiveReviews / Math.max(reviews.length, 1)) * 30, 30);
  validation.factors.positiveReviews = reviewScore;
  validation.score += reviewScore;

  // Group participation
  const groupCount = user.groups?.length || 0;
  const groupScore = Math.min(groupCount * 5, 20);
  validation.factors.groupParticipation = groupScore;
  validation.score += groupScore;

  // Event participation
  const eventCount = user.eventsAttended?.length || 0;
  const eventScore = Math.min(eventCount * 2, 10);
  validation.factors.eventParticipation = eventScore;
  validation.score += eventScore;

  // Badges
  if (validation.score >= 80) {
    validation.badges.push('Community Trusted');
  }
  if (groupCount >= 3) {
    validation.badges.push('Active Member');
  }
  if (eventCount >= 5) {
    validation.badges.push('Event Enthusiast');
  }

  validation.score = Math.min(Math.round(validation.score), 100);
  validation.category = validation.score >= 80 ? 'high' :
                        validation.score >= 60 ? 'medium' : 'low';

  return validation;
}

/**
 * Calculate profile completeness for validation
 * @param {Object} user - User object
 * @returns {number} Completeness score (0-100)
 */
function calculateProfileCompleteness(user) {
  let score = 0;

  if (user.photos && user.photos.length > 0) score += 20;
  if (user.bio && user.bio.length > 20) score += 15;
  if (user.education) score += 10;
  if (user.occupation) score += 10;
  if (user.lifestyle && user.lifestyle.length > 0) score += 15;
  if (user.socialMedia && Object.keys(user.socialMedia).length > 0) score += 10;
  if (user.valueAnswers && user.valueAnswers.length === 10) score += 10;
  if (user.contentAnswers && user.contentAnswers.length > 0) score += 10;

  return Math.min(score, 100);
}

/**
 * Get community-validated matches
 * Matches with high community validation
 * @param {Object} user - Current user
 * @param {Array} allUsers - All users
 * @param {Object} communityData - Community data
 * @returns {Array} Validated matches
 */
export function getCommunityValidatedMatches(user, allUsers, communityData) {
  return allUsers
    .filter(u => u.id !== user.id)
    .map(u => ({
      user: u,
      validation: getCommunityValidation(u, communityData),
    }))
    .filter(m => m.validation.score >= 60) // Only validated users
    .sort((a, b) => b.validation.score - a.validation.score);
}

