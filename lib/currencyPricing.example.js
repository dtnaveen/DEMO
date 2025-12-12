/**
 * Currency Pricing System - Usage Examples
 * 
 * This file demonstrates how to use the currency pricing system
 * for displaying localized prices to users.
 */

import { 
  getCoinPackages, 
  processPurchase 
} from './inAppPurchases';
import { 
  getTierPricing 
} from './subscription';
import { 
  getUserCountry,
  formatLocalPrice,
  convertToLocalPrice,
  getCurrencySymbol,
  getLocalizedPackages,
  getLocalizedSubscriptionPricing
} from './currencyPricing';

/**
 * Example 1: Display coin packages with localized prices
 */
export function ExampleDisplayCoinPackages(user) {
  // Get packages with prices in user's local currency
  const packages = getCoinPackages(user);
  
  // Each package now includes:
  // - price: Local price (number)
  // - formattedPrice: Formatted string (e.g., "₹699.00", "€9.99")
  // - currency: Currency code (e.g., "INR", "EUR")
  // - countryCode: Detected country (e.g., "IN", "DE")
  // - usdPrice: Original USD price (for reference)
  
  return packages.map(pkg => ({
    name: pkg.name,
    coins: pkg.coins,
    price: pkg.formattedPrice, // Use formattedPrice for display
    currency: pkg.currency,
    popular: pkg.popular,
  }));
}

/**
 * Example 2: Display subscription pricing with localized prices
 */
export function ExampleDisplaySubscriptionPricing(user) {
  // Get subscription tiers with localized prices
  const tierPricing = getTierPricing(user);
  
  // Each tier includes:
  // - price: Local price (number)
  // - formattedPrice: Formatted string
  // - currency: Currency code
  // - countryCode: Detected country
  // - usdPrice: Original USD price
  
  return {
    basic: {
      name: tierPricing.basic.name,
      price: tierPricing.basic.formattedPrice,
      period: tierPricing.basic.period,
    },
    plus: {
      name: tierPricing.plus.name,
      price: tierPricing.plus.formattedPrice,
      period: tierPricing.plus.period,
    },
    vip: {
      name: tierPricing.vip.name,
      price: tierPricing.vip.formattedPrice,
      period: tierPricing.vip.period,
    },
  };
}

/**
 * Example 3: Convert a specific USD price to local currency
 */
export function ExampleConvertPrice(usdPrice, user) {
  const countryCode = getUserCountry(user);
  const localPrice = convertToLocalPrice(usdPrice, countryCode);
  const formattedPrice = formatLocalPrice(usdPrice, countryCode);
  
  return {
    usdPrice,
    localPrice,
    formattedPrice,
    countryCode,
  };
}

/**
 * Example 4: Get currency symbol for display
 */
export function ExampleGetCurrencySymbol(user) {
  const countryCode = getUserCountry(user);
  const { getCurrencyForCountry } = require('./currencyPricing');
  const currency = getCurrencyForCountry(countryCode);
  const symbol = getCurrencySymbol(currency);
  
  return {
    countryCode,
    currency,
    symbol,
  };
}

/**
 * Example 5: React component example
 */
/*
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/localStorage';
import { getCoinPackages } from '@/lib/inAppPurchases';

function CoinPackagesList() {
  const [packages, setPackages] = useState([]);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Get localized packages
    const localizedPackages = getCoinPackages(currentUser);
    setPackages(localizedPackages);
  }, []);
  
  return (
    <div>
      {packages.map(pkg => (
        <div key={pkg.id}>
          <h3>{pkg.name}</h3>
          <p>{pkg.formattedPrice}</p>
          <button onClick={() => handlePurchase(pkg.id)}>
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );
}
*/
