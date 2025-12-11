/**
 * Ad Tracking & Revenue Analytics
 * Tracks ad impressions, clicks, and revenue for free users
 */

/**
 * Track ad impression
 * @param {string} adId - Ad identifier
 * @param {string} userId - User who saw the ad
 * @param {string} adType - Type of ad (banner, sponsored, etc.)
 */
export function trackAdImpression(adId, userId, adType = 'banner') {
  if (typeof window === 'undefined') return;
  
  try {
    const impressions = JSON.parse(localStorage.getItem('ad_impressions') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    impressions.push({
      adId,
      userId,
      adType,
      timestamp: new Date().toISOString(),
      date: today
    });
    
    localStorage.setItem('ad_impressions', JSON.stringify(impressions));
    
    // In production, send to analytics API
    // fetch('/api/analytics/ad-impression', { method: 'POST', body: JSON.stringify({ adId, userId, adType }) });
  } catch (error) {
    console.error('Error tracking ad impression:', error);
  }
}

/**
 * Track ad click
 * @param {string} adId - Ad identifier
 * @param {string} userId - User who clicked the ad
 * @param {string} adType - Type of ad
 * @param {string} destination - Where the ad links to
 */
export function trackAdClick(adId, userId, adType = 'banner', destination = '/subscription') {
  if (typeof window === 'undefined') return;
  
  try {
    const clicks = JSON.parse(localStorage.getItem('ad_clicks') || '[]');
    const today = new Date().toISOString().split('T')[0];
    
    clicks.push({
      adId,
      userId,
      adType,
      destination,
      timestamp: new Date().toISOString(),
      date: today
    });
    
    localStorage.setItem('ad_clicks', JSON.stringify(clicks));
    
    // In production, send to analytics API
    // fetch('/api/analytics/ad-click', { method: 'POST', body: JSON.stringify({ adId, userId, adType, destination }) });
  } catch (error) {
    console.error('Error tracking ad click:', error);
  }
}

/**
 * Get ad impressions for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} Array of impressions
 */
export function getAdImpressions(startDate = null, endDate = null) {
  if (typeof window === 'undefined') return [];
  
  try {
    const impressions = JSON.parse(localStorage.getItem('ad_impressions') || '[]');
    
    if (!startDate && !endDate) {
      return impressions;
    }
    
    return impressions.filter(imp => {
      const impDate = imp.date || imp.timestamp.split('T')[0];
      if (startDate && impDate < startDate) return false;
      if (endDate && impDate > endDate) return false;
      return true;
    });
  } catch (error) {
    console.error('Error getting ad impressions:', error);
    return [];
  }
}

/**
 * Get ad clicks for a date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Array} Array of clicks
 */
export function getAdClicks(startDate = null, endDate = null) {
  if (typeof window === 'undefined') return [];
  
  try {
    const clicks = JSON.parse(localStorage.getItem('ad_clicks') || '[]');
    
    if (!startDate && !endDate) {
      return clicks;
    }
    
    return clicks.filter(click => {
      const clickDate = click.date || click.timestamp.split('T')[0];
      if (startDate && clickDate < startDate) return false;
      if (endDate && clickDate > endDate) return false;
      return true;
    });
  } catch (error) {
    console.error('Error getting ad clicks:', error);
    return [];
  }
}

/**
 * Calculate ad revenue metrics
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Object} Revenue metrics
 */
export function getAdRevenueMetrics(startDate = null, endDate = null) {
  const impressions = getAdImpressions(startDate, endDate);
  const clicks = getAdClicks(startDate, endDate);
  
  // Calculate metrics
  const totalImpressions = impressions.length;
  const totalClicks = clicks.length;
  const clickThroughRate = totalImpressions > 0 
    ? (totalClicks / totalImpressions) * 100 
    : 0;
  
  // Revenue calculation
  // CPM (Cost Per Mille) - revenue per 1000 impressions
  // Typical CPM for dating apps: $2-5 per 1000 impressions
  const averageCPM = 3.50; // $3.50 per 1000 impressions
  const estimatedRevenue = (totalImpressions / 1000) * averageCPM;
  
  // CPC (Cost Per Click) - revenue per click
  // Typical CPC for dating apps: $0.50-2.00 per click
  const averageCPC = 1.25; // $1.25 per click
  const estimatedRevenueFromClicks = totalClicks * averageCPC;
  
  // Use the higher of the two estimates (impression-based or click-based)
  const totalEstimatedRevenue = Math.max(estimatedRevenue, estimatedRevenueFromClicks);
  
  // Unique users who saw ads
  const uniqueUsers = new Set(impressions.map(imp => imp.userId));
  const uniqueUserCount = uniqueUsers.size;
  
  // Conversion rate (clicks to subscription page)
  const subscriptionClicks = clicks.filter(c => c.destination === '/subscription').length;
  const conversionRate = totalClicks > 0 
    ? (subscriptionClicks / totalClicks) * 100 
    : 0;
  
  return {
    totalImpressions,
    totalClicks,
    clickThroughRate: Math.round(clickThroughRate * 100) / 100,
    estimatedRevenue: Math.round(totalEstimatedRevenue * 100) / 100,
    estimatedRevenueFromImpressions: Math.round(estimatedRevenue * 100) / 100,
    estimatedRevenueFromClicks: Math.round(estimatedRevenueFromClicks * 100) / 100,
    uniqueUsers: uniqueUserCount,
    conversionRate: Math.round(conversionRate * 100) / 100,
    averageCPM,
    averageCPC
  };
}

/**
 * Get daily ad metrics
 * @param {number} days - Number of days to look back
 * @returns {Array} Array of daily metrics
 */
export function getDailyAdMetrics(days = 7) {
  if (typeof window === 'undefined') return [];
  
  const dailyMetrics = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayImpressions = getAdImpressions(dateStr, dateStr);
    const dayClicks = getAdClicks(dateStr, dateStr);
    
    const metrics = getAdRevenueMetrics(dateStr, dateStr);
    
    dailyMetrics.push({
      date: dateStr,
      impressions: dayImpressions.length,
      clicks: dayClicks.length,
      revenue: metrics.estimatedRevenue,
      ctr: metrics.clickThroughRate
    });
  }
  
  return dailyMetrics;
}

/**
 * Clear old ad tracking data (older than specified days)
 * @param {number} daysToKeep - Number of days of data to keep
 */
export function clearOldAdData(daysToKeep = 90) {
  if (typeof window === 'undefined') return;
  
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0];
    
    // Clear old impressions
    const impressions = JSON.parse(localStorage.getItem('ad_impressions') || '[]');
    const filteredImpressions = impressions.filter(imp => {
      const impDate = imp.date || imp.timestamp.split('T')[0];
      return impDate >= cutoffDateStr;
    });
    localStorage.setItem('ad_impressions', JSON.stringify(filteredImpressions));
    
    // Clear old clicks
    const clicks = JSON.parse(localStorage.getItem('ad_clicks') || '[]');
    const filteredClicks = clicks.filter(click => {
      const clickDate = click.date || click.timestamp.split('T')[0];
      return clickDate >= cutoffDateStr;
    });
    localStorage.setItem('ad_clicks', JSON.stringify(filteredClicks));
  } catch (error) {
    console.error('Error clearing old ad data:', error);
  }
}

