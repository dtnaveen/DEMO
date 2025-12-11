/**
 * Feature Comparison - Free vs Premium
 * Clear differentiation of features and benefits
 */

import { SUBSCRIPTION_TIERS } from './subscription';

/**
 * Complete feature comparison by tier
 */
export const FEATURE_COMPARISON = {
  FREE: {
    name: 'Free',
    price: 0,
    period: 'forever',
    color: 'gray',
    features: {
      // Discovery & Matching
      dailyLikes: { value: 10, label: '10 Likes per Day', icon: '❤️' },
      unlimitedPasses: { value: true, label: 'Unlimited Passes', icon: '👋' },
      basicFilters: { value: true, label: 'Basic Filters (Age, Distance, Gender)', icon: '🔍' },
      viewProfiles: { value: true, label: 'View All Profiles', icon: '👁️' },
      seeMatches: { value: true, label: 'See Your Matches', icon: '💕' },
      
      // Communication
      sendMessages: { value: true, label: 'Send Messages', icon: '💬' },
      receiveMessages: { value: true, label: 'Receive Messages', icon: '📨' },
      basicChat: { value: true, label: 'Basic Chat Features', icon: '💭' },
      
      // Profile
      createProfile: { value: true, label: 'Create Profile', icon: '👤' },
      uploadPhotos: { value: true, label: 'Upload Photos (up to 9)', icon: '📸' },
      basicProfile: { value: true, label: 'Basic Profile Features', icon: '📝' },
      
      // Limitations
      rewinds: { value: 0, label: '0 Rewinds', icon: '↩️' },
      seeWhoLiked: { value: false, label: 'See Who Liked You', icon: '👀', premium: true },
      readReceipts: { value: false, label: 'Read Receipts', icon: '✓', premium: true },
      advancedFilters: { value: false, label: 'Advanced Filters', icon: '🔍', premium: true },
      profileBoost: { value: false, label: 'Profile Boost', icon: '🚀', premium: true },
      priorityMatching: { value: false, label: 'Priority Matching', icon: '⭐', premium: true },
      adFree: { value: false, label: 'Ad-Free Experience', icon: '✨', premium: true },
      matchBreakdown: { value: false, label: 'Match Breakdown', icon: '📊', premium: true },
      unlimitedLikes: { value: false, label: 'Unlimited Likes', icon: '∞', premium: true },
    },
    limitations: [
      'Limited to 10 likes per day',
      'No advanced filtering options',
      'Cannot see who liked you',
      'No read receipts',
      'No profile boost',
      'May see ads',
      'No rewinds to undo passes',
    ],
    benefits: [
      'Completely free forever',
      'Access to all basic features',
      'Find and match with people',
      'Send and receive messages',
      'Create a complete profile',
    ],
  },
  
  BASIC: {
    name: 'Basic',
    price: 9.99,
    period: 'month',
    color: 'blue',
    features: {
      // Everything in Free, plus:
      unlimitedLikes: { value: true, label: 'Unlimited Likes', icon: '∞' },
      advancedFilters: { value: true, label: 'Advanced Filters', icon: '🔍' },
      adFree: { value: true, label: 'Ad-Free Experience', icon: '✨' },
      
      // Keep Free features
      unlimitedPasses: { value: true, label: 'Unlimited Passes', icon: '👋' },
      viewProfiles: { value: true, label: 'View All Profiles', icon: '👁️' },
      seeMatches: { value: true, label: 'See Your Matches', icon: '💕' },
      sendMessages: { value: true, label: 'Send Messages', icon: '💬' },
      receiveMessages: { value: true, label: 'Receive Messages', icon: '📨' },
      createProfile: { value: true, label: 'Create Profile', icon: '👤' },
      uploadPhotos: { value: true, label: 'Upload Photos', icon: '📸' },
      
      // Still limited
      seeWhoLiked: { value: false, label: 'See Who Liked You', icon: '👀', premium: true },
      readReceipts: { value: false, label: 'Read Receipts', icon: '✓', premium: true },
      rewinds: { value: 0, label: '0 Rewinds', icon: '↩️', premium: true },
      profileBoost: { value: false, label: 'Profile Boost', icon: '🚀', premium: true },
      priorityMatching: { value: false, label: 'Priority Matching', icon: '⭐', premium: true },
      matchBreakdown: { value: false, label: 'Match Breakdown', icon: '📊', premium: true },
    },
    limitations: [
      'Cannot see who liked you',
      'No read receipts',
      'No rewinds',
      'No profile boost',
    ],
    benefits: [
      'Unlimited likes',
      'Advanced filtering',
      'Ad-free experience',
      'All basic features included',
    ],
  },
  
  PLUS: {
    name: 'Plus',
    price: 19.99,
    period: 'month',
    color: 'purple',
    popular: true,
    features: {
      // Everything in Basic, plus:
      seeWhoLiked: { value: true, label: 'See Who Liked You', icon: '👀' },
      readReceipts: { value: true, label: 'Read Receipts', icon: '✓' },
      unlimitedRewinds: { value: true, label: 'Unlimited Rewinds', icon: '↩️' },
      profileBoost: { value: true, label: 'Profile Boost', icon: '🚀' },
      
      // Keep all previous features
      unlimitedLikes: { value: true, label: 'Unlimited Likes', icon: '∞' },
      advancedFilters: { value: true, label: 'Advanced Filters', icon: '🔍' },
      adFree: { value: true, label: 'Ad-Free Experience', icon: '✨' },
      unlimitedPasses: { value: true, label: 'Unlimited Passes', icon: '👋' },
      viewProfiles: { value: true, label: 'View All Profiles', icon: '👁️' },
      seeMatches: { value: true, label: 'See Your Matches', icon: '💕' },
      sendMessages: { value: true, label: 'Send Messages', icon: '💬' },
      receiveMessages: { value: true, label: 'Receive Messages', icon: '📨' },
      
      // Still limited
      priorityMatching: { value: false, label: 'Priority Matching', icon: '⭐', premium: true },
      matchBreakdown: { value: false, label: 'Match Breakdown', icon: '📊', premium: true },
    },
    limitations: [
      'No priority matching',
      'No detailed match breakdown',
    ],
    benefits: [
      'See who liked you',
      'Read receipts',
      'Unlimited rewinds',
      'Profile boost',
      'Everything in Basic',
    ],
  },
  
  VIP: {
    name: 'VIP',
    price: 49.99,
    period: 'month',
    color: 'gold',
    features: {
      // Everything included
      unlimitedLikes: { value: true, label: 'Unlimited Likes', icon: '∞' },
      seeWhoLiked: { value: true, label: 'See Who Liked You', icon: '👀' },
      advancedFilters: { value: true, label: 'Advanced Filters', icon: '🔍' },
      readReceipts: { value: true, label: 'Read Receipts', icon: '✓' },
      unlimitedRewinds: { value: true, label: 'Unlimited Rewinds', icon: '↩️' },
      profileBoost: { value: true, label: 'Profile Boost', icon: '🚀' },
      priorityMatching: { value: true, label: 'Priority Matching', icon: '⭐' },
      adFree: { value: true, label: 'Ad-Free Experience', icon: '✨' },
      matchBreakdown: { value: true, label: 'Match Breakdown', icon: '📊' },
      unlimitedPasses: { value: true, label: 'Unlimited Passes', icon: '👋' },
      viewProfiles: { value: true, label: 'View All Profiles', icon: '👁️' },
      seeMatches: { value: true, label: 'See Your Matches', icon: '💕' },
      sendMessages: { value: true, label: 'Send Messages', icon: '💬' },
      receiveMessages: { value: true, label: 'Receive Messages', icon: '📨' },
      createProfile: { value: true, label: 'Create Profile', icon: '👤' },
      uploadPhotos: { value: true, label: 'Upload Photos', icon: '📸' },
    },
    limitations: [],
    benefits: [
      'All features included',
      'Priority matching',
      'Detailed match breakdown',
      'Exclusive VIP features',
      'Highest visibility',
    ],
  },
};

/**
 * Get feature comparison for a specific tier
 */
export function getTierFeatures(tier) {
  return FEATURE_COMPARISON[tier] || FEATURE_COMPARISON.FREE;
}

/**
 * Compare two tiers
 */
export function compareTiers(tier1, tier2) {
  const features1 = getTierFeatures(tier1);
  const features2 = getTierFeatures(tier2);
  
  const differences = [];
  
  Object.keys(features2.features).forEach(key => {
    const f1 = features1.features[key];
    const f2 = features2.features[key];
    
    if (f1 && f2 && f1.value !== f2.value) {
      differences.push({
        feature: f2.label,
        tier1: f1.value,
        tier2: f2.value,
      });
    }
  });
  
  return differences;
}

/**
 * Get what user gets by upgrading
 */
export function getUpgradeBenefits(currentTier, targetTier) {
  if (currentTier === targetTier) return [];
  
  const current = getTierFeatures(currentTier);
  const target = getTierFeatures(targetTier);
  
  const benefits = [];
  
  Object.keys(target.features).forEach(key => {
    const currentFeature = current.features[key];
    const targetFeature = target.features[key];
    
    if (targetFeature && (!currentFeature || !currentFeature.value) && targetFeature.value) {
      benefits.push({
        feature: targetFeature.label,
        icon: targetFeature.icon,
        description: getFeatureDescription(key),
      });
    }
  });
  
  return benefits;
}

/**
 * Get feature description
 */
function getFeatureDescription(featureKey) {
  const descriptions = {
    unlimitedLikes: 'Like as many profiles as you want, no daily limits',
    seeWhoLiked: 'See everyone who liked your profile before you match',
    advancedFilters: 'Filter by education, occupation, lifestyle, and more',
    readReceipts: 'Know when your messages are read',
    unlimitedRewinds: 'Undo any pass and get another chance',
    profileBoost: 'Your profile appears first in discovery feed',
    priorityMatching: 'Higher priority in match algorithm',
    adFree: 'Enjoy without any advertisements',
    matchBreakdown: 'See detailed compatibility analysis',
  };
  
  return descriptions[featureKey] || '';
}

/**
 * Check if feature is premium-only
 */
export function isPremiumFeature(featureKey) {
  const freeFeatures = FEATURE_COMPARISON.FREE.features;
  const feature = freeFeatures[featureKey];
  return feature && feature.premium === true;
}

