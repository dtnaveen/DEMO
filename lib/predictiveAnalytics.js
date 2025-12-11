/**
 * Predictive Analytics System
 * Predicts relationship success, match quality, user behavior
 */

/**
 * Predict relationship success probability
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @param {Object} matchData - Match data (messages, interactions)
 * @returns {Object} Success prediction
 */
export function predictRelationshipSuccess(user1, user2, matchData = {}) {
  let score = 0;
  const factors = {};

  // 1. Match Score (30%)
  const matchScore = calculateMatchScore(user1, user2);
  factors.matchScore = matchScore.percentage;
  score += (matchScore.percentage / 100) * 30;

  // 2. Communication Quality (25%)
  const communicationScore = analyzeCommunication(matchData.messages || []);
  factors.communication = communicationScore;
  score += (communicationScore / 100) * 25;

  // 3. Response Time (15%)
  const responseTimeScore = analyzeResponseTime(matchData.messages || []);
  factors.responseTime = responseTimeScore;
  score += (responseTimeScore / 100) * 15;

  // 4. Profile Completeness (10%)
  const completeness1 = analyzeProfileCompleteness(user1);
  const completeness2 = analyzeProfileCompleteness(user2);
  const avgCompleteness = (completeness1.percentage + completeness2.percentage) / 2;
  factors.profileCompleteness = avgCompleteness;
  score += (avgCompleteness / 100) * 10;

  // 5. Shared Interests (10%)
  const sharedInterests = getSharedInterests(user1, user2);
  const interestScore = Math.min(sharedInterests.length * 10, 100);
  factors.sharedInterests = interestScore;
  score += (interestScore / 100) * 10;

  // 6. Verification Status (5%)
  const verificationScore = (user1.isVerified ? 50 : 0) + (user2.isVerified ? 50 : 0);
  factors.verification = verificationScore;
  score += (verificationScore / 100) * 5;

  // 7. Activity Level (5%)
  const activityScore = analyzeActivityLevel(user1, user2);
  factors.activity = activityScore;
  score += (activityScore / 100) * 5;

  const successRate = Math.round(score);
  const category = successRate >= 75 ? 'high' : 
                   successRate >= 50 ? 'medium' : 
                   successRate >= 25 ? 'low' : 'very_low';

  return {
    successRate,
    category,
    factors,
    prediction: generatePrediction(successRate, category),
    recommendations: generateSuccessRecommendations(factors),
  };
}

/**
 * Analyze communication quality
 * @param {Array} messages - Conversation messages
 * @returns {number} Communication score (0-100)
 */
function analyzeCommunication(messages) {
  if (messages.length === 0) return 50; // Neutral if no messages

  let score = 50;

  // Message length (longer = better)
  const avgLength = messages.reduce((sum, m) => sum + (m.text?.length || 0), 0) / messages.length;
  score += Math.min(avgLength / 20, 20); // 20 chars = +20 points

  // Response ratio
  const responses = messages.filter(m => m.text && m.text.length > 5).length;
  const responseRatio = responses / messages.length;
  score += responseRatio * 20;

  // Question asking (engagement)
  const questions = messages.filter(m => m.text && m.text.includes('?')).length;
  score += Math.min(questions * 5, 10);

  return Math.min(Math.round(score), 100);
}

/**
 * Analyze response time
 * @param {Array} messages - Conversation messages
 * @returns {number} Response time score (0-100)
 */
function analyzeResponseTime(messages) {
  if (messages.length < 2) return 50;

  let totalDelay = 0;
  let delays = 0;

  for (let i = 1; i < messages.length; i++) {
    const prev = new Date(messages[i - 1].timestamp);
    const curr = new Date(messages[i].timestamp);
    const delay = (curr - prev) / (1000 * 60 * 60); // hours

    if (delay < 24) { // Only count responses within 24 hours
      totalDelay += delay;
      delays++;
    }
  }

  if (delays === 0) return 50;

  const avgDelay = totalDelay / delays;
  
  // Score: < 1 hour = 100, < 6 hours = 80, < 12 hours = 60, < 24 hours = 40, > 24 hours = 20
  if (avgDelay < 1) return 100;
  if (avgDelay < 6) return 80;
  if (avgDelay < 12) return 60;
  if (avgDelay < 24) return 40;
  return 20;
}

/**
 * Analyze user activity level
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {number} Activity score (0-100)
 */
function analyzeActivityLevel(user1, user2) {
  // In production, track: last login, messages sent, profile views, etc.
  // For now, use mock data
  return 75; // Default moderate activity
}

/**
 * Generate success prediction text
 * @param {number} successRate - Success rate percentage
 * @param {string} category - Success category
 * @returns {string} Prediction text
 */
function generatePrediction(successRate, category) {
  const predictions = {
    high: `High compatibility! ${successRate}% chance of a successful connection.`,
    medium: `Good potential! ${successRate}% compatibility score suggests a promising match.`,
    low: `Moderate compatibility. ${successRate}% match - worth exploring but may need more effort.`,
    very_low: `Low compatibility. ${successRate}% match - consider if values align.`,
  };

  return predictions[category] || predictions.medium;
}

/**
 * Generate recommendations for improving success
 * @param {Object} factors - Success factors
 * @returns {Array} Recommendations
 */
function generateSuccessRecommendations(factors) {
  const recommendations = [];

  if (factors.communication < 60) {
    recommendations.push({
      type: 'communication',
      message: 'Improve communication by sending longer, more engaging messages.',
    });
  }

  if (factors.responseTime < 50) {
    recommendations.push({
      type: 'responseTime',
      message: 'Respond more quickly to maintain engagement and interest.',
    });
  }

  if (factors.profileCompleteness < 70) {
    recommendations.push({
      type: 'profile',
      message: 'Complete your profile to increase match quality.',
    });
  }

  if (factors.sharedInterests < 30) {
    recommendations.push({
      type: 'interests',
      message: 'Explore shared interests to build connection.',
    });
  }

  return recommendations;
}

/**
 * Predict user churn probability
 * @param {Object} user - User object
 * @param {Object} activityData - User activity data
 * @returns {Object} Churn prediction
 */
export function predictChurn(user, activityData = {}) {
  let churnScore = 0;
  const factors = {};

  // Days since last login
  const lastLogin = activityData.lastLogin ? 
    (Date.now() - new Date(activityData.lastLogin).getTime()) / (1000 * 60 * 60 * 24) : 0;
  factors.daysSinceLogin = Math.round(lastLogin);
  if (lastLogin > 7) churnScore += 30;
  else if (lastLogin > 3) churnScore += 15;

  // Match rate
  const matchRate = activityData.matches / (activityData.likes || 1);
  factors.matchRate = Math.round(matchRate * 100);
  if (matchRate < 0.1) churnScore += 25;

  // Message response rate
  const responseRate = activityData.messageResponses / (activityData.messagesReceived || 1);
  factors.responseRate = Math.round(responseRate * 100);
  if (responseRate < 0.3) churnScore += 20;

  // Profile completeness
  const completeness = analyzeProfileCompleteness(user);
  factors.profileCompleteness = completeness.percentage;
  if (completeness.percentage < 50) churnScore += 15;

  // Premium status
  factors.isPremium = user.subscriptionTier !== 'free';
  if (!factors.isPremium) churnScore += 10;

  const churnProbability = Math.min(churnScore, 100);
  const risk = churnProbability >= 70 ? 'high' : 
               churnProbability >= 40 ? 'medium' : 'low';

  return {
    churnProbability,
    risk,
    factors,
    interventions: generateChurnInterventions(churnProbability, risk, factors),
  };
}

/**
 * Generate interventions to prevent churn
 * @param {number} churnProbability - Churn probability
 * @param {string} risk - Risk level
 * @param {Object} factors - Churn factors
 * @returns {Array} Interventions
 */
function generateChurnInterventions(churnProbability, risk, factors) {
  const interventions = [];

  if (factors.daysSinceLogin > 7) {
    interventions.push({
      type: 're-engagement',
      message: 'Send re-engagement notification with new matches',
      priority: 'high',
    });
  }

  if (factors.matchRate < 0.1) {
    interventions.push({
      type: 'profile_boost',
      message: 'Offer free profile boost to increase visibility',
      priority: 'high',
    });
  }

  if (factors.profileCompleteness < 50) {
    interventions.push({
      type: 'profile_completion',
      message: 'Encourage profile completion with tips',
      priority: 'medium',
    });
  }

  if (!factors.isPremium && churnProbability > 50) {
    interventions.push({
      type: 'premium_offer',
      message: 'Offer discounted premium subscription',
      priority: 'medium',
    });
  }

  return interventions;
}

/**
 * Predict match quality score
 * @param {Object} user1 - First user
 * @param {Object} user2 - Second user
 * @returns {Object} Quality prediction
 */
export function predictMatchQuality(user1, user2) {
  const success = predictRelationshipSuccess(user1, user2);
  
  return {
    qualityScore: success.successRate,
    category: success.category,
    factors: success.factors,
    recommendation: success.successRate >= 60 ? 'pursue' : 
                    success.successRate >= 40 ? 'explore' : 'consider',
  };
}

// Helper functions (import from other modules)
function calculateMatchScore(user1, user2) {
  // Import from matchingAlgorithm.js
  return { percentage: 75 }; // Mock
}

function getSharedInterests(user1, user2) {
  // Import from matchingAlgorithm.js
  return []; // Mock
}

function analyzeProfileCompleteness(user) {
  // Import from aiProfileOptimization.js
  return { percentage: 80 }; // Mock
}

