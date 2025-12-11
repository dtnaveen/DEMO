/**
 * Admin Metrics & KPIs Tracking Library
 * Calculates all success metrics, business metrics, and quality metrics
 */

import { getAllUsers, getMatches, getMessages, getLikes } from './localStorage';
import { calculateMatchScore } from './matchingAlgorithm';
import { isPremiumUser, getUserSubscriptionTier, SUBSCRIPTION_TIERS } from './subscription';
import { getAdRevenueMetrics, getDailyAdMetrics } from './adTracking';

/**
 * Get all user engagement metrics
 */
export function getUserEngagementMetrics() {
  const allUsers = getAllUsers();
  const matches = getMatches();
  const messages = getMessages();
  const likes = getLikes();
  
  const now = Date.now();
  const oneDayAgo = now - (24 * 60 * 60 * 1000);
  const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
  
  // Daily Active Users (DAU)
  const dau = allUsers.filter(user => {
    if (!user.lastActive) return false;
    const lastActive = new Date(user.lastActive).getTime();
    return lastActive >= oneDayAgo;
  }).length;
  
  // Monthly Active Users (MAU)
  const mau = allUsers.filter(user => {
    if (!user.lastActive) return false;
    const lastActive = new Date(user.lastActive).getTime();
    return lastActive >= oneMonthAgo;
  }).length;
  
  // Match rate (matches / total likes)
  const totalLikes = likes.length;
  const totalMatches = matches.length;
  const matchRate = totalLikes > 0 ? (totalMatches / totalLikes) * 100 : 0;
  
  // Message response rate
  const allMessages = messages.flatMap(conv => conv.messages || []);
  const sentMessages = allMessages.filter(m => m.senderId);
  const respondedMessages = allMessages.filter(m => 
    m.senderId && m.readAt && m.readAt !== m.createdAt
  );
  const messageResponseRate = sentMessages.length > 0 
    ? (respondedMessages.length / sentMessages.length) * 100 
    : 0;
  
  // Video call usage
  const videoCalls = allMessages.filter(m => m.type === 'video_call').length;
  const videoCallUsage = allUsers.length > 0 ? (videoCalls / allUsers.length) : 0;
  
  // Profile completion rate
  const completedProfiles = allUsers.filter(user => {
    const hasPhoto = user.photoUrl || (user.photos && user.photos.length > 0);
    const hasBio = user.bio && user.bio.length > 20;
    const hasLocation = user.location && user.location.length > 0;
    const hasValues = user.valueAnswers && user.valueAnswers.length > 0;
    return hasPhoto && hasBio && hasLocation && hasValues;
  }).length;
  const profileCompletionRate = allUsers.length > 0 
    ? (completedProfiles / allUsers.length) * 100 
    : 0;
  
  return {
    dailyActiveUsers: dau,
    monthlyActiveUsers: mau,
    matchRate: Math.round(matchRate * 100) / 100,
    messageResponseRate: Math.round(messageResponseRate * 100) / 100,
    videoCallUsage: Math.round(videoCallUsage * 100) / 100,
    profileCompletionRate: Math.round(profileCompletionRate * 100) / 100,
  };
}

/**
 * Get all business metrics
 */
export function getBusinessMetrics() {
  const allUsers = getAllUsers();
  const matches = getMatches();
  
  // Premium conversion rate
  const premiumUsers = allUsers.filter(u => isPremiumUser(u)).length;
  const totalUsers = allUsers.length;
  const premiumConversionRate = totalUsers > 0 
    ? (premiumUsers / totalUsers) * 100 
    : 0;
  
  // Average Revenue Per User (ARPU)
  const tierPricing = {
    [SUBSCRIPTION_TIERS.BASIC]: 9.99,
    [SUBSCRIPTION_TIERS.PLUS]: 19.99,
    [SUBSCRIPTION_TIERS.VIP]: 49.99,
  };
  
  let totalRevenue = 0;
  allUsers.forEach(user => {
    const tier = getUserSubscriptionTier(user);
    if (tier !== 'free' && tierPricing[tier]) {
      totalRevenue += tierPricing[tier];
    }
  });
  const arpu = totalUsers > 0 ? totalRevenue / totalUsers : 0;
  
  // Customer Lifetime Value (CLV)
  // Simplified: ARPU * average subscription duration (months)
  // For demo, assume average subscription of 6 months
  const averageSubscriptionMonths = 6;
  const clv = arpu * averageSubscriptionMonths;
  
  // Churn rate (users who haven't been active in 30+ days)
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  const churnedUsers = allUsers.filter(user => {
    if (!user.lastActive) return true;
    const lastActive = new Date(user.lastActive).getTime();
    return lastActive < thirtyDaysAgo;
  }).length;
  const churnRate = totalUsers > 0 ? (churnedUsers / totalUsers) * 100 : 0;
  
  // User acquisition cost (CAC) - mock value
  // In production, this would come from marketing data
  const mockCAC = 15.00; // $15 per user acquisition
  
  // Ad revenue metrics
  let adMetrics = { estimatedRevenue: 0, totalImpressions: 0, totalClicks: 0, clickThroughRate: 0, conversionRate: 0 };
  try {
    if (typeof window !== 'undefined') {
      adMetrics = getAdRevenueMetrics();
    }
  } catch (error) {
    console.error('Error getting ad metrics:', error);
  }
  
  const totalRevenueWithAds = totalRevenue + adMetrics.estimatedRevenue;
  const arpuWithAds = totalUsers > 0 ? totalRevenueWithAds / totalUsers : 0;
  
  return {
    premiumConversionRate: Math.round(premiumConversionRate * 100) / 100,
    averageRevenuePerUser: Math.round(arpu * 100) / 100,
    averageRevenuePerUserWithAds: Math.round(arpuWithAds * 100) / 100,
    customerLifetimeValue: Math.round(clv * 100) / 100,
    churnRate: Math.round(churnRate * 100) / 100,
    userAcquisitionCost: mockCAC,
    adRevenue: adMetrics.estimatedRevenue,
    adImpressions: adMetrics.totalImpressions,
    adClicks: adMetrics.totalClicks,
    adClickThroughRate: adMetrics.clickThroughRate,
    adConversionRate: adMetrics.conversionRate,
  };
}

/**
 * Get all quality metrics
 */
export function getQualityMetrics() {
  const allUsers = getAllUsers();
  const matches = getMatches();
  const messages = getMessages();
  
  // Relationship success rate
  // Simplified: Matches with high engagement (10+ messages)
  const successfulMatches = matches.filter(match => {
    const conversation = messages.find(conv => 
      (conv.userId1 === match.userId1 && conv.userId2 === match.userId2) ||
      (conv.userId1 === match.userId2 && conv.userId2 === match.userId1)
    );
    return conversation && conversation.messages && conversation.messages.length >= 10;
  }).length;
  const relationshipSuccessRate = matches.length > 0 
    ? (successfulMatches / matches.length) * 100 
    : 0;
  
  // User satisfaction scores
  // Mock: In production, this would come from surveys/ratings
  // For demo, calculate based on engagement metrics
  const engagementMetrics = getUserEngagementMetrics();
  const satisfactionScore = (
    engagementMetrics.matchRate * 0.3 +
    engagementMetrics.messageResponseRate * 0.3 +
    engagementMetrics.profileCompletionRate * 0.2 +
    (100 - engagementMetrics.churnRate) * 0.2
  );
  
  // Safety incident rate
  const reports = JSON.parse(localStorage.getItem('safetyReports') || '[]');
  const safetyIncidentRate = allUsers.length > 0 
    ? (reports.length / allUsers.length) * 100 
    : 0;
  
  // Profile verification rate
  const verifiedUsers = allUsers.filter(u => u.verified).length;
  const profileVerificationRate = allUsers.length > 0 
    ? (verifiedUsers / allUsers.length) * 100 
    : 0;
  
  // Match quality scores
  // Average match score percentage
  let totalMatchScore = 0;
  let matchCount = 0;
  matches.forEach(match => {
    const user1 = allUsers.find(u => u.id === match.userId1);
    const user2 = allUsers.find(u => u.id === match.userId2);
    if (user1 && user2) {
      const score = calculateMatchScore(user1, user2);
      totalMatchScore += score.percentage;
      matchCount++;
    }
  });
  const averageMatchQuality = matchCount > 0 ? totalMatchScore / matchCount : 0;
  
  return {
    relationshipSuccessRate: Math.round(relationshipSuccessRate * 100) / 100,
    userSatisfactionScore: Math.round(satisfactionScore * 100) / 100,
    safetyIncidentRate: Math.round(safetyIncidentRate * 100) / 100,
    profileVerificationRate: Math.round(profileVerificationRate * 100) / 100,
    matchQualityScore: Math.round(averageMatchQuality * 100) / 100,
  };
}

/**
 * Get comprehensive dashboard metrics
 */
export function getAllMetrics() {
  return {
    engagement: getUserEngagementMetrics(),
    business: getBusinessMetrics(),
    quality: getQualityMetrics(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get metrics trend (comparing current vs previous period)
 */
export function getMetricsTrend(currentMetrics, previousMetrics) {
  if (!previousMetrics) {
    return null;
  }
  
  const calculateTrend = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };
  
  return {
    engagement: {
      dailyActiveUsers: calculateTrend(
        currentMetrics.engagement.dailyActiveUsers,
        previousMetrics.engagement?.dailyActiveUsers || 0
      ),
      monthlyActiveUsers: calculateTrend(
        currentMetrics.engagement.monthlyActiveUsers,
        previousMetrics.engagement?.monthlyActiveUsers || 0
      ),
      matchRate: calculateTrend(
        currentMetrics.engagement.matchRate,
        previousMetrics.engagement?.matchRate || 0
      ),
      messageResponseRate: calculateTrend(
        currentMetrics.engagement.messageResponseRate,
        previousMetrics.engagement?.messageResponseRate || 0
      ),
    },
    business: {
      premiumConversionRate: calculateTrend(
        currentMetrics.business.premiumConversionRate,
        previousMetrics.business?.premiumConversionRate || 0
      ),
      averageRevenuePerUser: calculateTrend(
        currentMetrics.business.averageRevenuePerUser,
        previousMetrics.business?.averageRevenuePerUser || 0
      ),
      churnRate: calculateTrend(
        currentMetrics.business.churnRate,
        previousMetrics.business?.churnRate || 0
      ),
    },
    quality: {
      relationshipSuccessRate: calculateTrend(
        currentMetrics.quality.relationshipSuccessRate,
        previousMetrics.quality?.relationshipSuccessRate || 0
      ),
      userSatisfactionScore: calculateTrend(
        currentMetrics.quality.userSatisfactionScore,
        previousMetrics.quality?.userSatisfactionScore || 0
      ),
      profileVerificationRate: calculateTrend(
        currentMetrics.quality.profileVerificationRate,
        previousMetrics.quality?.profileVerificationRate || 0
      ),
    },
  };
}

