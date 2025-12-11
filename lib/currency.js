/**
 * In-App Currency System
 * Manages coins/credits for purchases and rewards
 */

const CURRENCY_NAME = 'Coins';
const DEFAULT_COINS = 100; // Free coins for new users

/**
 * Get user's coin balance
 */
export function getCoinBalance(userId) {
  if (typeof window === 'undefined') return 0;
  
  try {
    const currencyData = JSON.parse(localStorage.getItem('currency') || '{}');
    return currencyData[userId]?.balance || 0;
  } catch (error) {
    console.error('Error getting coin balance:', error);
    return 0;
  }
}

/**
 * Add coins to user's balance
 */
export function addCoins(userId, amount, reason = '') {
  if (typeof window === 'undefined') return false;
  
  try {
    const currencyData = JSON.parse(localStorage.getItem('currency') || '{}');
    if (!currencyData[userId]) {
      currencyData[userId] = { balance: DEFAULT_COINS, transactions: [] };
    }
    
    currencyData[userId].balance = (currencyData[userId].balance || 0) + amount;
    currencyData[userId].transactions = currencyData[userId].transactions || [];
    currencyData[userId].transactions.push({
      type: 'credit',
      amount,
      reason,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('currency', JSON.stringify(currencyData));
    return true;
  } catch (error) {
    console.error('Error adding coins:', error);
    return false;
  }
}

/**
 * Deduct coins from user's balance
 */
export function deductCoins(userId, amount, reason = '') {
  if (typeof window === 'undefined') return false;
  
  try {
    const balance = getCoinBalance(userId);
    if (balance < amount) {
      return false; // Insufficient balance
    }
    
    const currencyData = JSON.parse(localStorage.getItem('currency') || '{}');
    currencyData[userId].balance = balance - amount;
    currencyData[userId].transactions = currencyData[userId].transactions || [];
    currencyData[userId].transactions.push({
      type: 'debit',
      amount,
      reason,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('currency', JSON.stringify(currencyData));
    return true;
  } catch (error) {
    console.error('Error deducting coins:', error);
    return false;
  }
}

/**
 * Check if user has enough coins
 */
export function hasEnoughCoins(userId, amount) {
  return getCoinBalance(userId) >= amount;
}

/**
 * Get coin prices for features
 */
export function getCoinPrices() {
  return {
    PROFILE_BOOST: 50,
    SUPER_LIKE: 25,
    REWIND: 10,
    READ_RECEIPT: 5,
    SEE_WHO_LIKED: 100,
    EXTRA_LIKES: 20 // Per 10 likes
  };
}

/**
 * Purchase feature with coins
 */
export function purchaseWithCoins(userId, feature) {
  const prices = getCoinPrices();
  const price = prices[feature];
  
  if (!price) {
    return { success: false, error: 'Invalid feature' };
  }
  
  if (!hasEnoughCoins(userId, price)) {
    return { success: false, error: 'Insufficient coins' };
  }
  
  const success = deductCoins(userId, price, `Purchased ${feature}`);
  return { success, price };
}

/**
 * Get transaction history
 */
export function getTransactionHistory(userId) {
  if (typeof window === 'undefined') return [];
  
  try {
    const currencyData = JSON.parse(localStorage.getItem('currency') || '{}');
    return currencyData[userId]?.transactions || [];
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return [];
  }
}

/**
 * Initialize coins for new user
 */
export function initializeUserCoins(userId) {
  if (getCoinBalance(userId) === 0) {
    addCoins(userId, DEFAULT_COINS, 'Welcome bonus');
  }
}

export {
  CURRENCY_NAME,
  DEFAULT_COINS
};

