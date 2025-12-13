/**
 * Subscription and Premium Features Management
 */

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  BASIC: 'basic',
  PLUS: 'plus',
  VIP: 'vip'
};

// Daily limits for free users
export const FREE_USER_LIMITS = {
  DAILY_LIKES: 10,
  DAILY_PASSES: 50,
  REWINDS: 0,
  ADVANCED_FILTERS: false,
  READ_RECEIPTS: false,
  SEE_WHO_LIKED: false,
  PROFILE_BOOST: false,
  PRIORITY_MATCHING: false,
  AD_FREE: false
};

// Premium user benefits
export const PREMIUM_FEATURES = {
  UNLIMITED_LIKES: true,
  UNLIMITED_PASSES: true,
  UNLIMITED_REWINDS: true,
  ADVANCED_FILTERS: true,
  READ_RECEIPTS: true,
  SEE_WHO_LIKED: true,
  PROFILE_BOOST: true,
  PRIORITY_MATCHING: true,
  AD_FREE: true,
  MATCH_BREAKDOWN: true
};

/**
 * Get user's subscription tier
 */
export function getUserSubscriptionTier(user) {
  if (!user) return SUBSCRIPTION_TIERS.FREE;
  return user.subscriptionTier || SUBSCRIPTION_TIERS.FREE;
}

/**
 * Check if user is premium (any paid tier)
 */
export function isPremiumUser(user) {
  const tier = getUserSubscriptionTier(user);
  return tier !== SUBSCRIPTION_TIERS.FREE;
}

/**
 * Check if user has specific tier
 */
export function hasTier(user, tier) {
  return getUserSubscriptionTier(user) === tier;
}

/**
 * Check if user has a specific premium feature
 */
export function hasPremiumFeature(user, feature) {
  if (!user) return false;
  const tier = getUserSubscriptionTier(user);
  
  // Free tier
  if (tier === SUBSCRIPTION_TIERS.FREE) {
    return FREE_USER_LIMITS[feature] || false;
  }
  
  // Basic tier features
  if (tier === SUBSCRIPTION_TIERS.BASIC) {
    const basicFeatures = {
      UNLIMITED_LIKES: true,
      ADVANCED_FILTERS: true,
      AD_FREE: true
    };
    return basicFeatures[feature] || false;
  }
  
  // Plus tier features (includes Basic)
  if (tier === SUBSCRIPTION_TIERS.PLUS) {
    const plusFeatures = {
      UNLIMITED_LIKES: true,
      ADVANCED_FILTERS: true,
      AD_FREE: true,
      READ_RECEIPTS: true,
      SEE_WHO_LIKED: true,
      UNLIMITED_REWINDS: true,
      PROFILE_BOOST: true
    };
    return plusFeatures[feature] || false;
  }
  
  // VIP tier (all features)
  if (tier === SUBSCRIPTION_TIERS.VIP) {
    return PREMIUM_FEATURES[feature] || false;
  }
  
  return false;
}

/**
 * Get subscription tier pricing
 * @param {Object} user - User object (optional, for localized pricing)
 * @returns {Object} Subscription tier pricing
 */
export function getTierPricing(user = null) {
  // Import dynamically to avoid circular dependencies
  let localizedPricing;
  
  if (typeof window !== 'undefined' && user) {
    try {
      const { getLocalizedSubscriptionPricing } = require('./currencyPricing');
      localizedPricing = getLocalizedSubscriptionPricing(user);
    } catch (e) {
      // Fallback to base pricing if currency module not available
      localizedPricing = null;
    }
  }
  
  // Base pricing in USD
  const basePricing = {
    [SUBSCRIPTION_TIERS.BASIC]: {
      name: 'Basic',
      usdPrice: 9.99,
      price: 9.99,
      period: 'month',
      currency: 'USD',
      formattedPrice: '$9.99',
      features: ['Unlimited Likes', 'Advanced Filters', 'Ad-Free']
    },
    [SUBSCRIPTION_TIERS.PLUS]: {
      name: 'Plus',
      usdPrice: 19.99,
      price: 19.99,
      period: 'month',
      currency: 'USD',
      formattedPrice: '$19.99',
      features: ['Everything in Basic', 'Read Receipts', 'See Who Liked You', 'Unlimited Rewinds', 'Profile Boost']
    },
    [SUBSCRIPTION_TIERS.VIP]: {
      name: 'VIP',
      usdPrice: 49.99,
      price: 49.99,
      period: 'month',
      currency: 'USD',
      formattedPrice: '$49.99',
      features: ['Everything in Plus', 'Priority Matching', 'Match Breakdown', 'Exclusive Features']
    }
  };
  
  // If localized pricing is available, merge it
  if (localizedPricing) {
    return {
      [SUBSCRIPTION_TIERS.BASIC]: {
        ...basePricing[SUBSCRIPTION_TIERS.BASIC],
        ...localizedPricing.basic,
      },
      [SUBSCRIPTION_TIERS.PLUS]: {
        ...basePricing[SUBSCRIPTION_TIERS.PLUS],
        ...localizedPricing.plus,
      },
      [SUBSCRIPTION_TIERS.VIP]: {
        ...basePricing[SUBSCRIPTION_TIERS.VIP],
        ...localizedPricing.vip,
      },
    };
  }
  
  return basePricing;
}

/**
 * Get daily likes remaining for free users
 */
export function getDailyLikesRemaining(user) {
  if (isPremiumUser(user)) {
    return 'unlimited';
  }
  
  if (typeof window === 'undefined') return FREE_USER_LIMITS.DAILY_LIKES;
  
  try {
    const now = Date.now();
    const likesData = JSON.parse(localStorage.getItem('dailyLikes') || '{}');
    
    // Check if 24 hours have passed since last reset
    if (user.lastLikeReset) {
      const lastReset = new Date(user.lastLikeReset).getTime();
      const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60);
      if (hoursSinceReset >= 24) {
        return FREE_USER_LIMITS.DAILY_LIKES;
      }
    }
    
    // Fallback to date-based check
    const today = new Date().toDateString();
    if (likesData.date !== today) {
      return FREE_USER_LIMITS.DAILY_LIKES;
    }
    
    return Math.max(0, FREE_USER_LIMITS.DAILY_LIKES - (likesData.count || 0));
  } catch (error) {
    return FREE_USER_LIMITS.DAILY_LIKES;
  }
}

/**
 * Record a like for daily limit tracking
 */
export function recordLike(user) {
  if (isPremiumUser(user)) return true;
  
  if (typeof window === 'undefined') return false;
  
  try {
    const today = new Date().toDateString();
    const likesData = JSON.parse(localStorage.getItem('dailyLikes') || '{}');
    
    if (likesData.date !== today) {
      likesData.date = today;
      likesData.count = 0;
    }
    
    const remaining = FREE_USER_LIMITS.DAILY_LIKES - likesData.count;
    if (remaining <= 0) {
      return false;
    }
    
    likesData.count = (likesData.count || 0) + 1;
    localStorage.setItem('dailyLikes', JSON.stringify(likesData));
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get rewinds remaining for free users
 */
export function getRewindsRemaining(user) {
  if (isPremiumUser(user)) {
    return 'unlimited';
  }
  return FREE_USER_LIMITS.REWINDS;
}

/**
 * Upgrade user to premium
 */
export function upgradeToPremium(user) {
  if (!user) return null;
  
  const updatedUser = {
    ...user,
    subscriptionTier: SUBSCRIPTION_TIERS.PREMIUM,
    premiumSince: new Date().toISOString()
  };
  
  return updatedUser;
}

/**
 * Get premium features list for display
 */
export function getPremiumFeaturesList() {
  return [
    { name: 'Unlimited Likes', icon: '❤️', description: 'Like as many profiles as you want' },
    { name: 'See Who Liked You', icon: '👀', description: 'View everyone who liked your profile' },
    { name: 'Advanced Filters', icon: '🔍', description: 'Access to premium filtering options' },
    { name: 'Read Receipts', icon: '✓', description: 'See when your messages are read' },
    { name: 'Unlimited Rewinds', icon: '↩️', description: 'Undo any pass you made' },
    { name: 'Profile Boost', icon: '🚀', description: 'Get shown to more people first' },
    { name: 'Priority Matching', icon: '⭐', description: 'Higher priority in match algorithm' },
    { name: 'Ad-Free Experience', icon: '✨', description: 'Enjoy without interruptions' },
    { name: 'Match Breakdown', icon: '📊', description: 'See detailed compatibility analysis' }
  ];
}

