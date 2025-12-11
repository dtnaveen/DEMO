/**
 * Regional Customization System
 * Adapts features and content for different regions
 */

/**
 * Supported regions
 */
export const REGIONS = {
  US: { code: 'US', name: 'United States', currency: 'USD', timezone: 'America/New_York' },
  UK: { code: 'UK', name: 'United Kingdom', currency: 'GBP', timezone: 'Europe/London' },
  CA: { code: 'CA', name: 'Canada', currency: 'CAD', timezone: 'America/Toronto' },
  AU: { code: 'AU', name: 'Australia', currency: 'AUD', timezone: 'Australia/Sydney' },
  DE: { code: 'DE', name: 'Germany', currency: 'EUR', timezone: 'Europe/Berlin' },
  FR: { code: 'FR', name: 'France', currency: 'EUR', timezone: 'Europe/Paris' },
  ES: { code: 'ES', name: 'Spain', currency: 'EUR', timezone: 'Europe/Madrid' },
  IT: { code: 'IT', name: 'Italy', currency: 'EUR', timezone: 'Europe/Rome' },
  JP: { code: 'JP', name: 'Japan', currency: 'JPY', timezone: 'Asia/Tokyo' },
  CN: { code: 'CN', name: 'China', currency: 'CNY', timezone: 'Asia/Shanghai' },
  IN: { code: 'IN', name: 'India', currency: 'INR', timezone: 'Asia/Kolkata' },
  BR: { code: 'BR', name: 'Brazil', currency: 'BRL', timezone: 'America/Sao_Paulo' },
  MX: { code: 'MX', name: 'Mexico', currency: 'MXN', timezone: 'America/Mexico_City' },
};

/**
 * Regional features and preferences
 */
const REGIONAL_FEATURES = {
  US: {
    ageOfConsent: 18,
    paymentMethods: ['credit_card', 'paypal', 'apple_pay', 'google_pay'],
    dateFormats: ['MM/DD/YYYY'],
    popularFeatures: ['video_chat', 'super_likes', 'boosts'],
    culturalNotes: {
      directCommunication: true,
      casualDating: true,
    },
  },
  UK: {
    ageOfConsent: 18,
    paymentMethods: ['credit_card', 'paypal'],
    dateFormats: ['DD/MM/YYYY'],
    popularFeatures: ['video_chat', 'read_receipts'],
    culturalNotes: {
      directCommunication: false,
      casualDating: true,
    },
  },
  JP: {
    ageOfConsent: 18,
    paymentMethods: ['credit_card', 'konbini'],
    dateFormats: ['YYYY/MM/DD'],
    popularFeatures: ['profile_verification', 'group_events'],
    culturalNotes: {
      directCommunication: false,
      casualDating: false,
      groupActivities: true,
    },
  },
  IN: {
    ageOfConsent: 18,
    paymentMethods: ['credit_card', 'upi', 'wallet'],
    dateFormats: ['DD/MM/YYYY'],
    popularFeatures: ['family_values', 'education_filter'],
    culturalNotes: {
      directCommunication: false,
      casualDating: false,
      familyOriented: true,
    },
  },
  // Add more regions as needed...
};

/**
 * Get user's region
 * @param {Object} user - User object
 * @returns {string} Region code
 */
export function getUserRegion(user) {
  // In production, detect from:
  // - User's location
  // - IP geolocation
  // - User preferences
  // - Browser locale
  
  if (user.region) {
    return user.region;
  }

  // Default to US
  return 'US';
}

/**
 * Get regional configuration
 * @param {string} regionCode - Region code
 * @returns {Object} Regional configuration
 */
export function getRegionalConfig(regionCode) {
  const region = REGIONS[regionCode] || REGIONS.US;
  const features = REGIONAL_FEATURES[regionCode] || REGIONAL_FEATURES.US;

  return {
    region,
    features,
    currency: region.currency,
    timezone: region.timezone,
  };
}

/**
 * Format currency for region
 * @param {number} amount - Amount to format
 * @param {string} regionCode - Region code
 * @returns {string} Formatted currency
 */
export function formatCurrency(amount, regionCode) {
  const config = getRegionalConfig(regionCode);
  const currency = config.currency;

  const formatters = {
    USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    GBP: new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }),
    EUR: new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }),
    JPY: new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }),
    CNY: new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }),
    INR: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
    BRL: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    MXN: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }),
    CAD: new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }),
    AUD: new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }),
  };

  const formatter = formatters[currency] || formatters.USD;
  return formatter.format(amount);
}

/**
 * Get regional pricing
 * @param {number} basePrice - Base price in USD
 * @param {string} regionCode - Region code
 * @returns {number} Regional price
 */
export function getRegionalPricing(basePrice, regionCode) {
  // In production, use real exchange rates
  const exchangeRates = {
    USD: 1.0,
    GBP: 0.79,
    EUR: 0.92,
    JPY: 149.5,
    CNY: 7.24,
    INR: 83.2,
    BRL: 4.95,
    MXN: 17.1,
    CAD: 1.36,
    AUD: 1.52,
  };

  const config = getRegionalConfig(regionCode);
  const rate = exchangeRates[config.currency] || 1.0;
  
  // Apply regional pricing adjustments
  const adjustments = {
    IN: 0.7, // 30% discount for India
    BR: 0.8, // 20% discount for Brazil
    MX: 0.85, // 15% discount for Mexico
  };

  const adjustment = adjustments[regionCode] || 1.0;
  return Math.round(basePrice * rate * adjustment * 100) / 100;
}

/**
 * Get region-specific features
 * @param {string} regionCode - Region code
 * @returns {Array} Available features
 */
export function getRegionalFeatures(regionCode) {
  const config = getRegionalConfig(regionCode);
  return config.features.popularFeatures || [];
}

/**
 * Adapt content for region
 * @param {Object} content - Content object
 * @param {string} regionCode - Region code
 * @returns {Object} Adapted content
 */
export function adaptContentForRegion(content, regionCode) {
  const config = getRegionalConfig(regionCode);
  const culturalNotes = config.features.culturalNotes || {};

  // Adapt messaging tone
  if (!culturalNotes.directCommunication) {
    // Use more polite, indirect language
    content.tone = 'polite';
  }

  // Adapt dating preferences
  if (culturalNotes.familyOriented) {
    content.emphasizeFamily = true;
  }

  // Adapt group activities
  if (culturalNotes.groupActivities) {
    content.promoteGroups = true;
  }

  return content;
}

/**
 * Get region-specific date format
 * @param {string} regionCode - Region code
 * @returns {string} Date format
 */
export function getDateFormat(regionCode) {
  const config = getRegionalConfig(regionCode);
  return config.features.dateFormats?.[0] || 'MM/DD/YYYY';
}

