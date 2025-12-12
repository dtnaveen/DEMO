/**
 * In-App Purchases System
 * Handles purchases of coins, boosts, super likes, etc.
 */

import { getLocalizedPackages, getUserCountry, formatLocalPrice } from './currencyPricing';

/**
 * Purchase types available
 */
export const PURCHASE_TYPES = {
  COINS: 'coins',
  PROFILE_BOOST: 'profile_boost',
  SUPER_LIKE: 'super_like',
  REWIND: 'rewind',
  READ_RECEIPTS: 'read_receipts',
  SPOTLIGHT: 'spotlight',
};

/**
 * Base coin packages (USD prices)
 * Use getCoinPackages(user) to get localized packages
 */
export const BASE_COIN_PACKAGES = [
  { id: 'coins_100', name: '100 Coins', coins: 100, usdPrice: 0.99, popular: false },
  { id: 'coins_500', name: '500 Coins', coins: 500, usdPrice: 4.99, popular: true, bonus: 50 },
  { id: 'coins_1000', name: '1000 Coins', coins: 1000, usdPrice: 9.99, popular: false, bonus: 150 },
  { id: 'coins_2500', name: '2500 Coins', coins: 2500, usdPrice: 19.99, popular: false, bonus: 500 },
  { id: 'coins_5000', name: '5000 Coins', coins: 5000, usdPrice: 34.99, popular: false, bonus: 1500 },
];

/**
 * Get coin packages with localized prices
 * @param {Object} user - User object (optional, for country detection)
 * @returns {Array} Localized coin packages
 */
export function getCoinPackages(user = null) {
  if (typeof window === 'undefined') {
    // Server-side: return base packages
    return BASE_COIN_PACKAGES.map(pkg => ({
      ...pkg,
      price: pkg.usdPrice,
      formattedPrice: `$${pkg.usdPrice.toFixed(2)}`,
      currency: 'USD',
    }));
  }
  
  return getLocalizedPackages(user);
}

/**
 * Legacy export for backward compatibility
 * @deprecated Use getCoinPackages(user) instead
 */
export const COIN_PACKAGES = BASE_COIN_PACKAGES.map(pkg => ({
  ...pkg,
  price: pkg.usdPrice,
}));

/**
 * Feature purchase costs
 */
export const FEATURE_COSTS = {
  PROFILE_BOOST: 100, // coins
  SUPER_LIKE: 50, // coins
  REWIND: 25, // coins
  READ_RECEIPTS: 10, // coins per message
  SPOTLIGHT: 200, // coins (24 hours)
};

/**
 * Process in-app purchase
 * @param {string} purchaseType - Type of purchase
 * @param {string} productId - Product ID
 * @param {Object} user - Current user
 * @returns {Promise<Object>} Purchase result
 */
export async function processPurchase(purchaseType, productId, user) {
  // In production, integrate with:
  // - iOS: StoreKit / react-native-iap
  // - Android: Google Play Billing / react-native-iap
  // - Web: Stripe / PayPal

  try {
    let result;

    if (purchaseType === PURCHASE_TYPES.COINS) {
      // Get localized packages for user's country
      const packages = getCoinPackages(user);
      const coinPackage = packages.find(p => p.id === productId);
      
      if (!coinPackage) {
        throw new Error('Invalid coin package');
      }

      // In production, verify purchase with backend/App Store/Play Store
      result = {
        success: true,
        type: PURCHASE_TYPES.COINS,
        coins: coinPackage.coins + (coinPackage.bonus || 0),
        package: coinPackage.name,
        price: coinPackage.price,
        currency: coinPackage.currency,
        countryCode: coinPackage.countryCode,
        formattedPrice: coinPackage.formattedPrice,
        transactionId: `txn_${Date.now()}`,
      };
    } else {
      // Feature purchase
      const cost = FEATURE_COSTS[purchaseType];
      if (!cost) {
        throw new Error('Invalid purchase type');
      }

      // Check if user has enough coins
      const userCoins = getUserCoins(user);
      if (userCoins < cost) {
        throw new Error('Insufficient coins');
      }

      result = {
        success: true,
        type: purchaseType,
        cost,
        transactionId: `txn_${Date.now()}`,
      };
    }

    // Store purchase in localStorage (in production, send to backend)
    const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
    purchases.push({
      ...result,
      userId: user.id,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('user_purchases', JSON.stringify(purchases));

    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get user's coin balance
 * @param {Object} user - User object
 * @returns {number} Coin balance
 */
export function getUserCoins(user) {
  // In production, fetch from backend
  const coins = JSON.parse(localStorage.getItem(`user_coins_${user.id}`) || '0');
  return coins;
}

/**
 * Add coins to user account
 * @param {Object} user - User object
 * @param {number} amount - Amount of coins to add
 * @returns {void}
 */
export function addCoins(user, amount) {
  const currentCoins = getUserCoins(user);
  const newBalance = currentCoins + amount;
  localStorage.setItem(`user_coins_${user.id}`, JSON.stringify(newBalance));
}

/**
 * Deduct coins from user account
 * @param {Object} user - User object
 * @param {number} amount - Amount of coins to deduct
 * @returns {boolean} Success
 */
export function deductCoins(user, amount) {
  const currentCoins = getUserCoins(user);
  if (currentCoins < amount) {
    return false;
  }
  const newBalance = currentCoins - amount;
  localStorage.setItem(`user_coins_${user.id}`, JSON.stringify(newBalance));
  return true;
}

/**
 * Purchase profile boost
 * @param {Object} user - User object
 * @returns {Promise<Object>} Purchase result
 */
export async function purchaseProfileBoost(user) {
  const cost = FEATURE_COSTS.PROFILE_BOOST;
  
  if (!deductCoins(user, cost)) {
    return {
      success: false,
      error: 'Insufficient coins',
    };
  }

  // Activate boost (24 hours)
  const boost = {
    userId: user.id,
    type: 'profile_boost',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    active: true,
  };

  const boosts = JSON.parse(localStorage.getItem('user_boosts') || '[]');
  boosts.push(boost);
  localStorage.setItem('user_boosts', JSON.stringify(boosts));

  return {
    success: true,
    boost,
    message: 'Profile boost activated for 24 hours!',
  };
}

/**
 * Purchase super like
 * @param {Object} user - User object
 * @returns {Promise<Object>} Purchase result
 */
export async function purchaseSuperLike(user) {
  const cost = FEATURE_COSTS.SUPER_LIKE;
  
  if (!deductCoins(user, cost)) {
    return {
      success: false,
      error: 'Insufficient coins',
    };
  }

  // Add super like to user account
  const superLikes = JSON.parse(localStorage.getItem(`user_super_likes_${user.id}`) || '0');
  localStorage.setItem(`user_super_likes_${user.id}`, JSON.stringify(superLikes + 1));

  return {
    success: true,
    superLikes: superLikes + 1,
    message: 'Super like added to your account!',
  };
}

/**
 * Get purchase history
 * @param {Object} user - User object
 * @returns {Array} Purchase history
 */
export function getPurchaseHistory(user) {
  const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
  return purchases.filter(p => p.userId === user.id);
}

