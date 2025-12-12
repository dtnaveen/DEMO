/**
 * Currency Pricing System
 * Handles local currency detection and dynamic pricing per country
 */

/**
 * Country to Currency mapping
 * Extended list of countries with their currencies
 */
export const COUNTRY_CURRENCIES = {
  // North America
  US: 'USD', // United States
  CA: 'CAD', // Canada
  MX: 'MXN', // Mexico
  
  // Europe
  GB: 'GBP', // United Kingdom
  UK: 'GBP', // United Kingdom (alternative)
  IE: 'EUR', // Ireland
  FR: 'EUR', // France
  DE: 'EUR', // Germany
  ES: 'EUR', // Spain
  IT: 'EUR', // Italy
  NL: 'EUR', // Netherlands
  BE: 'EUR', // Belgium
  AT: 'EUR', // Austria
  PT: 'EUR', // Portugal
  GR: 'EUR', // Greece
  CH: 'CHF', // Switzerland
  NO: 'NOK', // Norway
  SE: 'SEK', // Sweden
  DK: 'DKK', // Denmark
  PL: 'PLN', // Poland
  CZ: 'CZK', // Czech Republic
  HU: 'HUF', // Hungary
  RO: 'RON', // Romania
  
  // Asia Pacific
  JP: 'JPY', // Japan
  CN: 'CNY', // China
  IN: 'INR', // India
  KR: 'KRW', // South Korea
  SG: 'SGD', // Singapore
  MY: 'MYR', // Malaysia
  TH: 'THB', // Thailand
  PH: 'PHP', // Philippines
  ID: 'IDR', // Indonesia
  VN: 'VND', // Vietnam
  AU: 'AUD', // Australia
  NZ: 'NZD', // New Zealand
  HK: 'HKD', // Hong Kong
  TW: 'TWD', // Taiwan
  
  // Middle East & Africa
  AE: 'AED', // United Arab Emirates
  SA: 'SAR', // Saudi Arabia
  IL: 'ILS', // Israel
  TR: 'TRY', // Turkey
  ZA: 'ZAR', // South Africa
  EG: 'EGP', // Egypt
  
  // South America
  BR: 'BRL', // Brazil
  AR: 'ARS', // Argentina
  CL: 'CLP', // Chile
  CO: 'COP', // Colombia
  PE: 'PEN', // Peru
  
  // Default
  DEFAULT: 'USD',
};

/**
 * Exchange rates (relative to USD)
 * In production, fetch from a real-time API
 */
export const EXCHANGE_RATES = {
  USD: 1.0,
  CAD: 1.36,
  MXN: 17.1,
  GBP: 0.79,
  EUR: 0.92,
  CHF: 0.88,
  NOK: 10.7,
  SEK: 10.4,
  DKK: 6.87,
  PLN: 4.0,
  CZK: 22.5,
  HUF: 360,
  RON: 4.6,
  JPY: 149.5,
  CNY: 7.24,
  INR: 83.2,
  KRW: 1330,
  SGD: 1.34,
  MYR: 4.7,
  THB: 35.5,
  PHP: 56.0,
  IDR: 15700,
  VND: 24500,
  AUD: 1.52,
  NZD: 1.64,
  HKD: 7.82,
  TWD: 31.5,
  AED: 3.67,
  SAR: 3.75,
  ILS: 3.65,
  TRY: 32.0,
  ZAR: 18.5,
  EGP: 31.0,
  BRL: 4.95,
  ARS: 850,
  CLP: 920,
  COP: 4100,
  PEN: 3.7,
};

/**
 * Regional pricing adjustments
 * Apply discounts or premiums based on purchasing power
 */
export const PRICING_ADJUSTMENTS = {
  // Discounts for lower purchasing power regions
  IN: 0.7,   // 30% discount for India
  BR: 0.8,   // 20% discount for Brazil
  MX: 0.85,  // 15% discount for Mexico
  PH: 0.75,  // 25% discount for Philippines
  ID: 0.7,   // 30% discount for Indonesia
  VN: 0.65,  // 35% discount for Vietnam
  TH: 0.8,   // 20% discount for Thailand
  AR: 0.9,   // 10% discount for Argentina
  TR: 0.85,  // 15% discount for Turkey
  ZA: 0.8,   // 20% discount for South Africa
  
  // Premiums for higher purchasing power regions
  CH: 1.15,  // 15% premium for Switzerland
  NO: 1.1,   // 10% premium for Norway
  DK: 1.1,   // 10% premium for Denmark
  AU: 1.05,  // 5% premium for Australia
  SG: 1.05,  // 5% premium for Singapore
  AE: 1.1,   // 10% premium for UAE
  SA: 1.1,   // 10% premium for Saudi Arabia
  
  // Default: no adjustment
  DEFAULT: 1.0,
};

/**
 * Get user's country code
 * @param {Object} user - User object
 * @returns {string} Country code (ISO 3166-1 alpha-2)
 */
export function getUserCountry(user) {
  if (typeof window === 'undefined') return 'US';
  
  // Priority 1: User's saved country
  if (user?.country) {
    return user.country.toUpperCase();
  }
  
  // Priority 2: User's location
  if (user?.location) {
    const locationParts = user.location.split(',').map(s => s.trim());
    const country = locationParts[locationParts.length - 1];
    // Try to match country name to code
    const countryCode = getCountryCodeFromName(country);
    if (countryCode) return countryCode;
  }
  
  // Priority 3: Browser locale
  if (typeof navigator !== 'undefined' && navigator.language) {
    const locale = navigator.language;
    const countryCode = locale.split('-')[1]?.toUpperCase();
    if (countryCode && COUNTRY_CURRENCIES[countryCode]) {
      return countryCode;
    }
  }
  
  // Priority 4: Timezone-based detection
  if (typeof Intl !== 'undefined') {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const countryCode = getCountryFromTimezone(timezone);
      if (countryCode) return countryCode;
    } catch (e) {
      // Ignore errors
    }
  }
  
  // Default: US
  return 'US';
}

/**
 * Get country code from country name
 * @param {string} countryName - Country name
 * @returns {string|null} Country code
 */
function getCountryCodeFromName(countryName) {
  const countryMap = {
    'united states': 'US',
    'usa': 'US',
    'canada': 'CA',
    'mexico': 'MX',
    'united kingdom': 'GB',
    'uk': 'GB',
    'france': 'FR',
    'germany': 'DE',
    'spain': 'ES',
    'italy': 'IT',
    'japan': 'JP',
    'china': 'CN',
    'india': 'IN',
    'brazil': 'BR',
    'australia': 'AU',
    // Add more as needed
  };
  
  return countryMap[countryName?.toLowerCase()] || null;
}

/**
 * Get country from timezone
 * @param {string} timezone - Timezone (e.g., 'America/New_York')
 * @returns {string|null} Country code
 */
function getCountryFromTimezone(timezone) {
  const timezoneMap = {
    'America/New_York': 'US',
    'America/Los_Angeles': 'US',
    'America/Chicago': 'US',
    'America/Toronto': 'CA',
    'America/Mexico_City': 'MX',
    'Europe/London': 'GB',
    'Europe/Paris': 'FR',
    'Europe/Berlin': 'DE',
    'Europe/Madrid': 'ES',
    'Europe/Rome': 'IT',
    'Asia/Tokyo': 'JP',
    'Asia/Shanghai': 'CN',
    'Asia/Kolkata': 'IN',
    'America/Sao_Paulo': 'BR',
    'Australia/Sydney': 'AU',
    // Add more as needed
  };
  
  return timezoneMap[timezone] || null;
}

/**
 * Get currency for country
 * @param {string} countryCode - Country code
 * @returns {string} Currency code
 */
export function getCurrencyForCountry(countryCode) {
  return COUNTRY_CURRENCIES[countryCode?.toUpperCase()] || COUNTRY_CURRENCIES.DEFAULT;
}

/**
 * Get exchange rate for currency
 * @param {string} currencyCode - Currency code
 * @returns {number} Exchange rate (relative to USD)
 */
export function getExchangeRate(currencyCode) {
  return EXCHANGE_RATES[currencyCode?.toUpperCase()] || 1.0;
}

/**
 * Get pricing adjustment for country
 * @param {string} countryCode - Country code
 * @returns {number} Pricing adjustment multiplier
 */
export function getPricingAdjustment(countryCode) {
  return PRICING_ADJUSTMENTS[countryCode?.toUpperCase()] || PRICING_ADJUSTMENTS.DEFAULT;
}

/**
 * Convert USD price to local currency with regional adjustments
 * @param {number} usdPrice - Price in USD
 * @param {string} countryCode - Country code
 * @returns {number} Local price
 */
export function convertToLocalPrice(usdPrice, countryCode) {
  const currency = getCurrencyForCountry(countryCode);
  const exchangeRate = getExchangeRate(currency);
  const adjustment = getPricingAdjustment(countryCode);
  
  // Calculate local price
  let localPrice = usdPrice * exchangeRate * adjustment;
  
  // Round based on currency
  if (currency === 'JPY' || currency === 'KRW' || currency === 'VND' || currency === 'IDR') {
    // No decimal places for these currencies
    localPrice = Math.round(localPrice);
  } else if (currency === 'CLP' || currency === 'COP') {
    // Round to nearest 100
    localPrice = Math.round(localPrice / 100) * 100;
  } else {
    // Round to 2 decimal places
    localPrice = Math.round(localPrice * 100) / 100;
  }
  
  return localPrice;
}

/**
 * Format price in local currency
 * @param {number} usdPrice - Price in USD
 * @param {string} countryCode - Country code
 * @returns {string} Formatted price string
 */
export function formatLocalPrice(usdPrice, countryCode) {
  const currency = getCurrencyForCountry(countryCode);
  const localPrice = convertToLocalPrice(usdPrice, countryCode);
  
  // Use Intl.NumberFormat for proper formatting
  const locale = getLocaleForCountry(countryCode);
  
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: (currency === 'JPY' || currency === 'KRW' || currency === 'VND' || currency === 'IDR') ? 0 : 2,
      maximumFractionDigits: (currency === 'JPY' || currency === 'KRW' || currency === 'VND' || currency === 'IDR') ? 0 : 2,
    });
    
    return formatter.format(localPrice);
  } catch (e) {
    // Fallback formatting
    return `${currency} ${localPrice.toFixed(2)}`;
  }
}

/**
 * Get locale for country
 * @param {string} countryCode - Country code
 * @returns {string} Locale string
 */
function getLocaleForCountry(countryCode) {
  const localeMap = {
    US: 'en-US',
    CA: 'en-CA',
    GB: 'en-GB',
    AU: 'en-AU',
    NZ: 'en-NZ',
    FR: 'fr-FR',
    DE: 'de-DE',
    ES: 'es-ES',
    IT: 'it-IT',
    JP: 'ja-JP',
    CN: 'zh-CN',
    IN: 'en-IN',
    BR: 'pt-BR',
    MX: 'es-MX',
    KR: 'ko-KR',
    SG: 'en-SG',
    // Add more as needed
  };
  
  return localeMap[countryCode] || 'en-US';
}

/**
 * Get localized packages with prices
 * @param {Object} user - User object
 * @returns {Array} Packages with localized prices
 */
export function getLocalizedPackages(user) {
  const countryCode = getUserCountry(user);
  const currency = getCurrencyForCountry(countryCode);
  
  // Base packages in USD
  const basePackages = [
    { id: 'coins_100', name: '100 Coins', coins: 100, usdPrice: 0.99, popular: false },
    { id: 'coins_500', name: '500 Coins', coins: 500, usdPrice: 4.99, popular: true, bonus: 50 },
    { id: 'coins_1000', name: '1000 Coins', coins: 1000, usdPrice: 9.99, popular: false, bonus: 150 },
    { id: 'coins_2500', name: '2500 Coins', coins: 2500, usdPrice: 19.99, popular: false, bonus: 500 },
    { id: 'coins_5000', name: '5000 Coins', coins: 5000, usdPrice: 34.99, popular: false, bonus: 1500 },
  ];
  
  return basePackages.map(pkg => {
    const localPrice = convertToLocalPrice(pkg.usdPrice, countryCode);
    const formattedPrice = formatLocalPrice(pkg.usdPrice, countryCode);
    
    return {
      ...pkg,
      price: localPrice,
      formattedPrice,
      currency,
      countryCode,
      usdPrice: pkg.usdPrice, // Keep original for reference
    };
  });
}

/**
 * Get localized subscription pricing
 * @param {Object} user - User object
 * @returns {Object} Subscription tiers with localized prices
 */
export function getLocalizedSubscriptionPricing(user) {
  const countryCode = getUserCountry(user);
  const currency = getCurrencyForCountry(countryCode);
  
  // Base subscription prices in USD
  const basePricing = {
    basic: { usdPrice: 9.99, period: 'month' },
    plus: { usdPrice: 19.99, period: 'month' },
    vip: { usdPrice: 49.99, period: 'month' },
  };
  
  const localized = {};
  
  Object.entries(basePricing).forEach(([tier, data]) => {
    const localPrice = convertToLocalPrice(data.usdPrice, countryCode);
    const formattedPrice = formatLocalPrice(data.usdPrice, countryCode);
    
    localized[tier] = {
      ...data,
      price: localPrice,
      formattedPrice,
      currency,
      countryCode,
      usdPrice: data.usdPrice,
    };
  });
  
  return localized;
}

/**
 * Get currency symbol
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export function getCurrencySymbol(currencyCode) {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    BRL: 'R$',
    MXN: '$',
    CAD: 'C$',
    AUD: 'A$',
    KRW: '₩',
    SGD: 'S$',
    HKD: 'HK$',
    THB: '฿',
    PHP: '₱',
    // Add more as needed
  };
  
  return symbols[currencyCode?.toUpperCase()] || currencyCode;
}
