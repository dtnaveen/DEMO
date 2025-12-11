/**
 * User Analytics & Insights Library
 * Innovative metrics to help users analyze their performance and improve their experience
 */

import { getCurrentUser, getAllUsers, getMatches, getMessages, getLikes, getUserActions } from './localStorage';
import { calculateMatchScore } from './matchingAlgorithm';
import { deepValueAnalysis, predictLongTermCompatibility } from './enhancedValueMatching';
import { RelationshipHealthTracker } from './relationshipHealthTracking';

/**
 * Get comprehensive user analytics
 */
export function getUserAnalytics(userId = null) {
  const currentUser = userId ? getAllUsers().find(u => u.id === userId) : getCurrentUser();
  if (!currentUser) return null;

  const userIdToUse = currentUser.id;
  
  return {
    overview: getOverviewMetrics(userIdToUse),
    matching: getMatchingInsights(userIdToUse),
    communication: getCommunicationAnalytics(userIdToUse),
    profile: getProfileAnalytics(userIdToUse),
    engagement: getEngagementPatterns(userIdToUse),
    success: getSuccessPredictions(userIdToUse),
    recommendations: getPersonalizedRecommendations(userIdToUse),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Overview Metrics - Quick stats
 */
function getOverviewMetrics(userId) {
  const allUsers = getAllUsers();
  const matches = getMatches();
  const messages = getMessages();
  const likes = getLikes();
  const user = allUsers.find(u => u.id === userId);
  
  const userMatches = matches.filter(m => m.userId1 === userId || m.userId2 === userId);
  const userLikes = likes.filter(l => l.userId === userId);
  const userConversations = messages.filter(conv => 
    conv.userId1 === userId || conv.userId2 === userId
  );
  
  // Profile views (estimated from matches + likes)
  const profileViews = userMatches.length + userLikes.length;
  
  // Like-to-match conversion rate
  const likeToMatchRate = userLikes.length > 0 
    ? (userMatches.length / userLikes.length) * 100 
    : 0;
  
  // Average match score
  let totalMatchScore = 0;
  let matchCount = 0;
  userMatches.forEach(match => {
    const otherUserId = match.userId1 === userId ? match.userId2 : match.userId1;
    const otherUser = allUsers.find(u => u.id === otherUserId);
    if (otherUser) {
      const score = calculateMatchScore(user, otherUser);
      totalMatchScore += score.percentage;
      matchCount++;
    }
  });
  const averageMatchScore = matchCount > 0 ? totalMatchScore / matchCount : 0;
  
  // Active conversations
  const activeConversations = userConversations.filter(conv => {
    const lastMessage = conv.messages && conv.messages[conv.messages.length - 1];
    if (!lastMessage) return false;
    const daysSinceLastMessage = (Date.now() - new Date(lastMessage.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceLastMessage <= 7;
  }).length;
  
  return {
    totalMatches: userMatches.length,
    totalLikes: userLikes.length,
    profileViews: profileViews,
    likeToMatchRate: Math.round(likeToMatchRate * 100) / 100,
    averageMatchScore: Math.round(averageMatchScore * 100) / 100,
    activeConversations: activeConversations,
    totalConversations: userConversations.length,
  };
}

/**
 * Matching Insights - Deep analysis
 */
function getMatchingInsights(userId) {
  const allUsers = getAllUsers();
  const matches = getMatches();
  const user = allUsers.find(u => u.id === userId);
  
  const userMatches = matches.filter(m => m.userId1 === userId || m.userId2 === userId);
  
  // Match quality distribution
  const matchScores = userMatches.map(match => {
    const otherUserId = match.userId1 === userId ? match.userId2 : match.userId1;
    const otherUser = allUsers.find(u => u.id === otherUserId);
    if (otherUser) {
      return calculateMatchScore(user, otherUser).percentage;
    }
    return 0;
  }).filter(score => score > 0);
  
  const highQualityMatches = matchScores.filter(s => s >= 80).length;
  const mediumQualityMatches = matchScores.filter(s => s >= 60 && s < 80).length;
  const lowQualityMatches = matchScores.filter(s => s < 60).length;
  
  // Value alignment analysis
  const valueAlignments = userMatches.map(match => {
    const otherUserId = match.userId1 === userId ? match.userId2 : match.userId1;
    const otherUser = allUsers.find(u => u.id === otherUserId);
    if (otherUser) {
      const analysis = deepValueAnalysis(user, otherUser);
      return analysis.overallAlignment;
    }
    return 0;
  }).filter(a => a > 0);
  
  const averageValueAlignment = valueAlignments.length > 0
    ? valueAlignments.reduce((a, b) => a + b, 0) / valueAlignments.length
    : 0;
  
  // Compatibility trends
  const recentMatches = userMatches
    .sort((a, b) => new Date(b.timestamp || b.matchedAt || 0) - new Date(a.timestamp || a.matchedAt || 0))
    .slice(0, 5);
  
  const recentMatchScores = recentMatches.map(match => {
    const otherUserId = match.userId1 === userId ? match.userId2 : match.userId1;
    const otherUser = allUsers.find(u => u.id === otherUserId);
    if (otherUser) {
      return calculateMatchScore(user, otherUser).percentage;
    }
    return 0;
  });
  
  const trendDirection = recentMatchScores.length >= 2
    ? (recentMatchScores[0] - recentMatchScores[recentMatchScores.length - 1]) > 0 ? 'improving' : 'declining'
    : 'stable';
  
  return {
    highQualityMatches,
    mediumQualityMatches,
    lowQualityMatches,
    averageValueAlignment: Math.round(averageValueAlignment * 100) / 100,
    matchQualityTrend: trendDirection,
    bestMatchScore: matchScores.length > 0 ? Math.max(...matchScores) : 0,
    averageMatchScore: matchScores.length > 0 
      ? matchScores.reduce((a, b) => a + b, 0) / matchScores.length 
      : 0,
  };
}

/**
 * Communication Analytics
 */
function getCommunicationAnalytics(userId) {
  const messages = getMessages();
  const userConversations = messages.filter(conv => 
    conv.userId1 === userId || conv.userId2 === userId
  );
  
  // Response time analysis
  const responseTimes = [];
  userConversations.forEach(conv => {
    const userMessages = (conv.messages || []).filter(m => m.senderId === userId);
    const otherMessages = (conv.messages || []).filter(m => m.senderId !== userId);
    
    userMessages.forEach((userMsg, idx) => {
      const nextOtherMsg = otherMessages.find(m => 
        new Date(m.createdAt) > new Date(userMsg.createdAt)
      );
      if (nextOtherMsg) {
        const responseTime = new Date(nextOtherMsg.createdAt) - new Date(userMsg.createdAt);
        responseTimes.push(responseTime / (1000 * 60 * 60)); // Convert to hours
      }
    });
  });
  
  const averageResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;
  
  // Conversation length analysis
  const conversationLengths = userConversations.map(conv => 
    (conv.messages || []).length
  );
  
  const averageConversationLength = conversationLengths.length > 0
    ? conversationLengths.reduce((a, b) => a + b, 0) / conversationLengths.length
    : 0;
  
  // Message engagement rate
  const totalSent = userConversations.reduce((sum, conv) => 
    sum + (conv.messages || []).filter(m => m.senderId === userId).length, 0
  );
  const totalReceived = userConversations.reduce((sum, conv) => 
    sum + (conv.messages || []).filter(m => m.senderId !== userId).length, 0
  );
  
  const engagementRate = totalReceived > 0 
    ? (totalSent / totalReceived) * 100 
    : 0;
  
  // Conversation starters vs responders
  const conversationsStarted = userConversations.filter(conv => {
    const firstMessage = (conv.messages || [])[0];
    return firstMessage && firstMessage.senderId === userId;
  }).length;
  
  const conversationStarterRate = userConversations.length > 0
    ? (conversationsStarted / userConversations.length) * 100
    : 0;
  
  return {
    averageResponseTime: Math.round(averageResponseTime * 100) / 100,
    averageConversationLength: Math.round(averageConversationLength * 100) / 100,
    engagementRate: Math.round(engagementRate * 100) / 100,
    conversationStarterRate: Math.round(conversationStarterRate * 100) / 100,
    totalMessagesSent: totalSent,
    totalMessagesReceived: totalReceived,
  };
}

/**
 * Profile Analytics
 */
function getProfileAnalytics(userId) {
  const allUsers = getAllUsers();
  const user = allUsers.find(u => u.id === userId);
  
  // Profile completeness score
  let completenessScore = 0;
  let maxScore = 0;
  
  // Photo (20 points)
  maxScore += 20;
  if (user.photos && user.photos.length > 0) {
    completenessScore += 20;
  } else if (user.photoUrl) {
    completenessScore += 15;
  }
  
  // Bio (20 points)
  maxScore += 20;
  if (user.bio && user.bio.length > 50) {
    completenessScore += 20;
  } else if (user.bio && user.bio.length > 20) {
    completenessScore += 10;
  }
  
  // Location (10 points)
  maxScore += 10;
  if (user.location) completenessScore += 10;
  
  // Values (20 points)
  maxScore += 20;
  if (user.valueAnswers && user.valueAnswers.length > 0) {
    completenessScore += 20;
  }
  
  // Education/Occupation (15 points)
  maxScore += 15;
  if (user.education) completenessScore += 7.5;
  if (user.occupation) completenessScore += 7.5;
  
  // Lifestyle (10 points)
  maxScore += 10;
  if (user.lifestyle && Array.isArray(user.lifestyle) && user.lifestyle.length > 0) {
    completenessScore += 10;
  }
  
  // Social Media (5 points)
  maxScore += 5;
  if (user.socialMedia && Object.keys(user.socialMedia).length > 0) {
    completenessScore += 5;
  }
  
  const profileCompleteness = (completenessScore / maxScore) * 100;
  
  // Profile attractiveness score (based on engagement)
  const matches = getMatches();
  const likes = getLikes();
  const userMatches = matches.filter(m => m.userId1 === userId || m.userId2 === userId).length;
  const userLikes = likes.filter(l => l.userId === userId).length;
  const profileLiked = likes.filter(l => l.targetUserId === userId).length;
  
  const attractivenessScore = userMatches + userLikes + profileLiked;
  
  // Verification status
  const isVerified = user.verified || false;
  
  return {
    profileCompleteness: Math.round(profileCompleteness * 100) / 100,
    attractivenessScore,
    isVerified,
    photoCount: user.photos ? user.photos.length : (user.photoUrl ? 1 : 0),
    bioLength: user.bio ? user.bio.length : 0,
    hasEducation: !!user.education,
    hasOccupation: !!user.occupation,
    hasLifestyle: !!(user.lifestyle && Array.isArray(user.lifestyle) && user.lifestyle.length > 0),
    hasSocialMedia: !!(user.socialMedia && Object.keys(user.socialMedia).length > 0),
  };
}

/**
 * Engagement Patterns
 */
function getEngagementPatterns(userId) {
  const messages = getMessages();
  const userConversations = messages.filter(conv => 
    conv.userId1 === userId || conv.userId2 === userId
  );
  
  // Activity by day of week
  const dayActivity = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };
  
  userConversations.forEach(conv => {
    (conv.messages || []).forEach(msg => {
      if (msg.senderId === userId) {
        const day = new Date(msg.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
        dayActivity[day] = (dayActivity[day] || 0) + 1;
      }
    });
  });
  
  // Most active day
  const mostActiveDay = Object.entries(dayActivity).reduce((a, b) => 
    dayActivity[a[0]] > dayActivity[b[0]] ? a : b
  )[0];
  
  // Activity by time of day
  const timeActivity = {
    morning: 0, // 6am-12pm
    afternoon: 0, // 12pm-6pm
    evening: 0, // 6pm-12am
    night: 0, // 12am-6am
  };
  
  userConversations.forEach(conv => {
    (conv.messages || []).forEach(msg => {
      if (msg.senderId === userId) {
        const hour = new Date(msg.createdAt).getHours();
        if (hour >= 6 && hour < 12) timeActivity.morning++;
        else if (hour >= 12 && hour < 18) timeActivity.afternoon++;
        else if (hour >= 18 && hour < 24) timeActivity.evening++;
        else timeActivity.night++;
      }
    });
  });
  
  const mostActiveTime = Object.entries(timeActivity).reduce((a, b) => 
    timeActivity[a[0]] > timeActivity[b[0]] ? a : b
  )[0];
  
  // Engagement streak (consecutive days with activity)
  const activityDates = new Set();
  userConversations.forEach(conv => {
    (conv.messages || []).forEach(msg => {
      if (msg.senderId === userId) {
        const date = new Date(msg.createdAt).toDateString();
        activityDates.add(date);
      }
    });
  });
  
  const sortedDates = Array.from(activityDates).sort();
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;
  
  for (let i = 0; i < sortedDates.length; i++) {
    const date = new Date(sortedDates[i]);
    const prevDate = i > 0 ? new Date(sortedDates[i - 1]) : null;
    
    if (prevDate) {
      const daysDiff = (date - prevDate) / (1000 * 60 * 60 * 24);
      if (daysDiff === 1) {
        tempStreak++;
      } else {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
  }
  maxStreak = Math.max(maxStreak, tempStreak);
  
  // Check current streak
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  if (activityDates.has(today) || activityDates.has(yesterday)) {
    currentStreak = tempStreak;
  }
  
  return {
    mostActiveDay,
    mostActiveTime,
    maxStreak,
    currentStreak,
    totalActiveDays: activityDates.size,
    dayActivity,
    timeActivity,
  };
}

/**
 * Success Predictions
 */
function getSuccessPredictions(userId) {
  const allUsers = getAllUsers();
  const matches = getMatches();
  const messages = getMessages();
  const user = allUsers.find(u => u.id === userId);
  
  const userMatches = matches.filter(m => m.userId1 === userId || m.userId2 === userId);
  
  // Relationship success probability
  const successProbabilities = userMatches.map(match => {
    const otherUserId = match.userId1 === userId ? match.userId2 : match.userId1;
    const otherUser = allUsers.find(u => u.id === otherUserId);
    if (otherUser) {
      const prediction = predictLongTermCompatibility(user, otherUser);
      return prediction.successProbability;
    }
    return 0;
  }).filter(p => p > 0);
  
  const averageSuccessProbability = successProbabilities.length > 0
    ? successProbabilities.reduce((a, b) => a + b, 0) / successProbabilities.length
    : 0;
  
  // Next match success score
  const profileAnalytics = getProfileAnalytics(userId);
  const matchingInsights = getMatchingInsights(userId);
  
  const nextMatchScore = (
    profileAnalytics.profileCompleteness * 0.3 +
    matchingInsights.averageMatchScore * 0.3 +
    (user.verified ? 20 : 0) +
    (profileAnalytics.attractivenessScore > 10 ? 20 : 0)
  );
  
  return {
    averageSuccessProbability: Math.round(averageSuccessProbability * 100) / 100,
    nextMatchSuccessScore: Math.min(100, Math.round(nextMatchScore)),
    highPotentialMatches: successProbabilities.filter(p => p >= 70).length,
    totalAnalyzed: successProbabilities.length,
  };
}

/**
 * Personalized Recommendations
 */
function getPersonalizedRecommendations(userId) {
  const recommendations = [];
  const profileAnalytics = getProfileAnalytics(userId);
  const matchingInsights = getMatchingInsights(userId);
  const communicationAnalytics = getCommunicationAnalytics(userId);
  const engagementPatterns = getEngagementPatterns(userId);
  
  // Profile recommendations
  if (profileAnalytics.profileCompleteness < 80) {
    recommendations.push({
      type: 'profile',
      priority: 'high',
      title: 'Complete Your Profile',
      description: `Your profile is ${Math.round(profileAnalytics.profileCompleteness)}% complete. Add more details to increase your match rate.`,
      action: 'Add photos, education, and lifestyle information',
    });
  }
  
  if (!profileAnalytics.isVerified) {
    recommendations.push({
      type: 'verification',
      priority: 'high',
      title: 'Verify Your Profile',
      description: 'Verified profiles get 3x more matches and messages.',
      action: 'Complete photo verification',
    });
  }
  
  if (profileAnalytics.photoCount < 3) {
    recommendations.push({
      type: 'photos',
      priority: 'medium',
      title: 'Add More Photos',
      description: 'Profiles with 3+ photos get 40% more likes.',
      action: 'Upload at least 3 photos',
    });
  }
  
  // Matching recommendations
  if (matchingInsights.averageMatchScore < 70) {
    recommendations.push({
      type: 'matching',
      priority: 'medium',
      title: 'Improve Match Quality',
      description: 'Your average match score is below 70%. Consider adjusting your preferences.',
      action: 'Review your value answers and preferences',
    });
  }
  
  // Communication recommendations
  if (communicationAnalytics.averageResponseTime > 24) {
    recommendations.push({
      type: 'communication',
      priority: 'medium',
      title: 'Respond Faster',
      description: `Your average response time is ${Math.round(communicationAnalytics.averageResponseTime)} hours. Faster responses lead to better connections.`,
      action: 'Try to respond within 24 hours',
    });
  }
  
  if (communicationAnalytics.conversationStarterRate < 50) {
    recommendations.push({
      type: 'communication',
      priority: 'low',
      title: 'Start More Conversations',
      description: 'Initiating conversations shows confidence and increases engagement.',
      action: 'Send the first message to your matches',
    });
  }
  
  // Engagement recommendations
  if (engagementPatterns.currentStreak < 3) {
    recommendations.push({
      type: 'engagement',
      priority: 'low',
      title: 'Build Your Engagement Streak',
      description: 'Consistent daily activity improves your visibility and match rate.',
      action: 'Log in and interact daily',
    });
  }
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Get insights summary (quick overview)
 */
export function getInsightsSummary(userId = null) {
  const analytics = getUserAnalytics(userId);
  if (!analytics) return null;
  
  return {
    overallScore: calculateOverallScore(analytics),
    topStrength: getTopStrength(analytics),
    topImprovement: getTopImprovement(analytics),
    quickStats: {
      matches: analytics.overview.totalMatches,
      averageMatchScore: analytics.matching.averageMatchScore,
      profileCompleteness: analytics.profile.profileCompleteness,
      responseTime: analytics.communication.averageResponseTime,
    },
  };
}

function calculateOverallScore(analytics) {
  return Math.round((
    analytics.profile.profileCompleteness * 0.25 +
    analytics.matching.averageMatchScore * 0.25 +
    analytics.communication.engagementRate * 0.2 +
    analytics.success.averageSuccessProbability * 0.15 +
    (analytics.profile.isVerified ? 15 : 0)
  ));
}

function getTopStrength(analytics) {
  const strengths = [];
  
  if (analytics.profile.profileCompleteness >= 90) {
    strengths.push('Complete Profile');
  }
  if (analytics.profile.isVerified) {
    strengths.push('Verified Account');
  }
  if (analytics.matching.averageMatchScore >= 75) {
    strengths.push('High Match Quality');
  }
  if (analytics.communication.averageResponseTime < 12) {
    strengths.push('Quick Responder');
  }
  if (analytics.engagement.currentStreak >= 7) {
    strengths.push('Consistent Engagement');
  }
  
  return strengths[0] || 'Active User';
}

function getTopImprovement(analytics) {
  const improvements = [];
  
  if (analytics.profile.profileCompleteness < 70) {
    improvements.push('Complete Your Profile');
  }
  if (!analytics.profile.isVerified) {
    improvements.push('Verify Your Profile');
  }
  if (analytics.communication.averageResponseTime > 24) {
    improvements.push('Respond Faster');
  }
  if (analytics.matching.averageMatchScore < 60) {
    improvements.push('Improve Match Quality');
  }
  
  return improvements[0] || 'Keep Engaging';
}

