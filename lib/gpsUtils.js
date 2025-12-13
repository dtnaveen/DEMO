/**
 * GPS and Location Utilities
 * Handles GPS coordinates, distance calculations, and location services
 */

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in miles
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Get user's current GPS location
 * @returns {Promise<{latitude: number, longitude: number} | null>}
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        // Silently handle geolocation errors (expected when GPS unavailable)
        // Error codes: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
        // These are all expected in development/testing environments
        // Only log unexpected errors in development
        if (process.env.NODE_ENV === 'development' && error.code && error.code !== 1 && error.code !== 2 && error.code !== 3) {
          console.debug('Geolocation error:', error.message || 'GPS unavailable');
        }
        // Reject silently - calling code should handle gracefully
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Get location name from coordinates (reverse geocoding)
 * Uses a simple lookup table for common cities
 * In production, this would use a geocoding API
 */
export function getLocationName(latitude, longitude) {
  // Simple lookup table for major cities
  // In production, use a geocoding API like Google Maps or OpenStreetMap
  const cityLookup = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
    { name: 'Houston', lat: 29.7604, lon: -95.3698 },
    { name: 'Phoenix', lat: 33.4484, lon: -112.0740 },
    { name: 'Philadelphia', lat: 39.9526, lon: -75.1652 },
    { name: 'San Antonio', lat: 29.4241, lon: -98.4936 },
    { name: 'San Diego', lat: 32.7157, lon: -117.1611 },
    { name: 'Dallas', lat: 32.7767, lon: -96.7970 },
    { name: 'San Jose', lat: 37.3382, lon: -121.8863 },
    { name: 'Austin', lat: 30.2672, lon: -97.7431 },
    { name: 'Jacksonville', lat: 30.3322, lon: -81.6557 },
    { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
    { name: 'Indianapolis', lat: 39.7684, lon: -86.1581 },
    { name: 'Columbus', lat: 39.9612, lon: -82.9988 },
    { name: 'Fort Worth', lat: 32.7555, lon: -97.3308 },
    { name: 'Charlotte', lat: 35.2271, lon: -80.8431 },
    { name: 'Seattle', lat: 47.6062, lon: -122.3321 },
    { name: 'Denver', lat: 39.7392, lon: -104.9903 },
    { name: 'Washington', lat: 38.9072, lon: -77.0369 },
  ];

  let closestCity = cityLookup[0];
  let minDistance = calculateDistance(latitude, longitude, closestCity.lat, closestCity.lon);

  for (const city of cityLookup) {
    const distance = calculateDistance(latitude, longitude, city.lat, city.lon);
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  }

  // If within 50 miles, return city name, otherwise return coordinates
  if (minDistance < 50) {
    return closestCity.name;
  }
  
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
}

/**
 * Get coordinates from location name (geocoding)
 * Uses a simple lookup table for common cities
 * In production, this would use a geocoding API
 */
export function getCoordinatesFromLocation(locationName) {
  const cityLookup = {
    'New York': { latitude: 40.7128, longitude: -74.0060 },
    'Los Angeles': { latitude: 34.0522, longitude: -118.2437 },
    'Chicago': { latitude: 41.8781, longitude: -87.6298 },
    'Houston': { latitude: 29.7604, longitude: -95.3698 },
    'Phoenix': { latitude: 33.4484, longitude: -112.0740 },
    'Philadelphia': { latitude: 39.9526, longitude: -75.1652 },
    'San Antonio': { latitude: 29.4241, longitude: -98.4936 },
    'San Diego': { latitude: 32.7157, longitude: -117.1611 },
    'Dallas': { latitude: 32.7767, longitude: -96.7970 },
    'San Jose': { latitude: 37.3382, longitude: -121.8863 },
    'Austin': { latitude: 30.2672, longitude: -97.7431 },
    'Jacksonville': { latitude: 30.3322, longitude: -81.6557 },
    'San Francisco': { latitude: 37.7749, longitude: -122.4194 },
    'Indianapolis': { latitude: 39.7684, longitude: -86.1581 },
    'Columbus': { latitude: 39.9612, longitude: -82.9988 },
    'Fort Worth': { latitude: 32.7555, longitude: -97.3308 },
    'Charlotte': { latitude: 35.2271, longitude: -80.8431 },
    'Seattle': { latitude: 47.6062, longitude: -122.3321 },
    'Denver': { latitude: 39.7392, longitude: -104.9903 },
    'Washington': { latitude: 38.9072, longitude: -77.0369 },
  };

  const normalizedName = locationName.trim();
  const coords = cityLookup[normalizedName];
  
  if (coords) {
    return coords;
  }

  // Try to parse as coordinates if it's in "lat,lon" format
  const coordMatch = normalizedName.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    return {
      latitude: parseFloat(coordMatch[1]),
      longitude: parseFloat(coordMatch[2])
    };
  }

  // Return null for unknown locations
  return null;
}

/**
 * Check if user has GPS coordinates
 */
export function hasGPSCoordinates(user) {
  return user && 
         typeof user.latitude === 'number' && 
         typeof user.longitude === 'number' &&
         !isNaN(user.latitude) && 
         !isNaN(user.longitude);
}

/**
 * Get distance between two users
 * @param {Object} user1 - First user object
 * @param {Object} user2 - Second user object
 * @returns {number | null} Distance in miles, or null if coordinates not available
 */
export function getDistanceBetweenUsers(user1, user2) {
  if (!hasGPSCoordinates(user1) || !hasGPSCoordinates(user2)) {
    return null;
  }

  return calculateDistance(
    user1.latitude,
    user1.longitude,
    user2.latitude,
    user2.longitude
  );
}

