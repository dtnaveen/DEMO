/**
 * Advanced GPS Features
 * Real-time location updates, travel mode, location-based events
 */

import { calculateDistance, getCurrentLocation } from './gpsUtils';

/**
 * Real-time location tracking
 * Updates user location periodically
 */
export class RealTimeLocationTracker {
  constructor(userId, updateInterval = 300000) { // 5 minutes default
    this.userId = userId;
    this.updateInterval = updateInterval;
    this.watchId = null;
    this.isTracking = false;
  }

  /**
   * Start real-time location tracking
   * @param {Function} onLocationUpdate - Callback for location updates
   * @returns {Promise<void>}
   */
  async startTracking(onLocationUpdate) {
    if (this.isTracking) {
      return;
    }

    if (typeof window === 'undefined' || !navigator.geolocation) {
      throw new Error('Geolocation not supported');
    }

    this.isTracking = true;

    // Get initial location
    try {
      const location = await getCurrentLocation();
      if (onLocationUpdate) {
        onLocationUpdate(location);
      }
      this.saveLocation(location);
    } catch (error) {
      // Silently handle geolocation errors (expected when GPS unavailable)
      // Error codes: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
      // These are all expected in development/testing environments
      // Only log unexpected errors in development
      if (process.env.NODE_ENV === 'development' && error.code && error.code !== 1 && error.code !== 2 && error.code !== 3) {
        console.debug('Initial location error:', error.message || 'GPS unavailable');
      }
      // Continue silently - location tracking is optional
    }

    // Watch position
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        };

        if (onLocationUpdate) {
          onLocationUpdate(location);
        }
        this.saveLocation(location);
      },
      (error) => {
        // Silently handle geolocation errors (expected when GPS unavailable)
        // Error codes: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
        // These are all expected in development/testing environments
        // Only log unexpected errors in development
        if (process.env.NODE_ENV === 'development' && error.code && error.code !== 1 && error.code !== 2 && error.code !== 3) {
          console.debug('Location tracking error:', error.message || 'GPS unavailable');
        }
        this.isTracking = false;
        // Continue silently - location tracking is optional
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  /**
   * Stop location tracking
   */
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
  }

  /**
   * Save location to storage
   * @param {Object} location - Location object
   */
  saveLocation(location) {
    const locations = JSON.parse(localStorage.getItem(`user_locations_${this.userId}`) || '[]');
    locations.push({
      ...location,
      userId: this.userId,
    });

    // Keep only last 100 locations
    if (locations.length > 100) {
      locations.shift();
    }

    localStorage.setItem(`user_locations_${this.userId}`, JSON.stringify(locations));
  }

  /**
   * Get location history
   * @returns {Array} Location history
   */
  getLocationHistory() {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(`user_locations_${this.userId}`) || '[]');
  }
}

/**
 * Travel Mode
 * Allows users to see matches in different locations
 */
export class TravelMode {
  /**
   * Enable travel mode
   * @param {Object} user - User object
   * @param {string} destination - Destination location
   * @param {Date} startDate - Travel start date
   * @param {Date} endDate - Travel end date
   * @returns {Object} Travel mode configuration
   */
  static enableTravelMode(user, destination, startDate, endDate) {
    if (typeof window === 'undefined') return null;
    const travelMode = {
      enabled: true,
      destination,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      originalLocation: user.location,
      originalCoordinates: {
        latitude: user.latitude,
        longitude: user.longitude,
      },
      createdAt: new Date().toISOString(),
    };

    // Save travel mode
    localStorage.setItem(`travel_mode_${user.id}`, JSON.stringify(travelMode));

    return travelMode;
  }

  /**
   * Disable travel mode
   * @param {Object} user - User object
   */
  static disableTravelMode(user) {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`travel_mode_${user.id}`);
  }

  /**
   * Get travel mode status
   * @param {Object} user - User object
   * @returns {Object|null} Travel mode configuration
   */
  static getTravelMode(user) {
    if (typeof window === 'undefined') return null;
    const travelMode = JSON.parse(localStorage.getItem(`travel_mode_${user.id}`) || 'null');
    
    if (!travelMode || !travelMode.enabled) {
      return null;
    }

    // Check if travel mode is still active
    const now = new Date();
    const endDate = new Date(travelMode.endDate);
    
    if (now > endDate) {
      // Travel mode expired
      this.disableTravelMode(user);
      return null;
    }

    return travelMode;
  }

  /**
   * Get effective location for user (travel mode or regular)
   * @param {Object} user - User object
   * @returns {Object} Effective location
   */
  static getEffectiveLocation(user) {
    if (typeof window === 'undefined') {
      return {
        location: user.location,
        latitude: user.latitude,
        longitude: user.longitude,
        isTravelMode: false,
      };
    }
    const travelMode = this.getTravelMode(user);
    
    if (travelMode) {
      return {
        location: travelMode.destination,
        latitude: travelMode.destinationCoordinates?.latitude || user.latitude,
        longitude: travelMode.destinationCoordinates?.longitude || user.longitude,
        isTravelMode: true,
        travelMode,
      };
    }

    return {
      location: user.location,
      latitude: user.latitude,
      longitude: user.longitude,
      isTravelMode: false,
    };
  }
}

/**
 * Location-based events
 * Find events near user's location
 */
export class LocationBasedEvents {
  /**
   * Find events near location
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {number} radius - Radius in miles
   * @param {Array} allEvents - All available events
   * @returns {Array} Nearby events
   */
  static findNearbyEvents(latitude, longitude, radius = 25, allEvents = []) {
    if (!latitude || !longitude) {
      return [];
    }

    return allEvents
      .filter(event => {
        if (!event.latitude || !event.longitude) {
          return false;
        }

        const distance = calculateDistance(
          latitude,
          longitude,
          event.latitude,
          event.longitude
        );

        return distance <= radius;
      })
      .map(event => {
        const distance = calculateDistance(
          latitude,
          longitude,
          event.latitude,
          event.longitude
        );

        return {
          ...event,
          distance: Math.round(distance * 10) / 10,
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }

  /**
   * Get events for user's location
   * @param {Object} user - User object
   * @param {Array} allEvents - All available events
   * @param {number} radius - Radius in miles
   * @returns {Array} Nearby events
   */
  static getEventsForUser(user, allEvents = [], radius = 25) {
    const effectiveLocation = TravelMode.getEffectiveLocation(user);
    
    if (!effectiveLocation.latitude || !effectiveLocation.longitude) {
      return [];
    }

    return this.findNearbyEvents(
      effectiveLocation.latitude,
      effectiveLocation.longitude,
      radius,
      allEvents
    );
  }

  /**
   * Suggest events based on user interests and location
   * @param {Object} user - User object
   * @param {Array} allEvents - All available events
   * @returns {Array} Suggested events
   */
  static suggestEvents(user, allEvents = []) {
    const nearbyEvents = this.getEventsForUser(user, allEvents);
    
    // Filter by user interests
    const userInterests = user.lifestyle || [];
    const userGroups = user.groups || [];

    return nearbyEvents
      .filter(event => {
        // Match by tags or interests
        if (event.tags) {
          return event.tags.some(tag => 
            userInterests.some(interest => 
              interest.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(interest.toLowerCase())
            )
          );
        }
        return true;
      })
      .slice(0, 10); // Top 10 suggestions
  }
}

/**
 * Location sharing (time-limited)
 * Share location with match for safety
 */
export class LocationSharing {
  /**
   * Share location with user
   * @param {string} fromUserId - User sharing location
   * @param {string} toUserId - User receiving location
   * @param {number} durationMinutes - Duration in minutes
   * @returns {Object} Location share
   */
  static shareLocation(fromUserId, toUserId, durationMinutes = 60) {
    if (typeof window === 'undefined') return null;
    const share = {
      fromUserId,
      toUserId,
      expiresAt: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      active: true,
    };

    // Save share
    const shares = JSON.parse(localStorage.getItem('location_shares') || '[]');
    shares.push(share);
    localStorage.setItem('location_shares', JSON.stringify(shares));

    return share;
  }

  /**
   * Get active location shares for user
   * @param {string} userId - User ID
   * @returns {Array} Active shares
   */
  static getActiveShares(userId) {
    if (typeof window === 'undefined') return [];
    const shares = JSON.parse(localStorage.getItem('location_shares') || '[]');
    const now = new Date();

    return shares.filter(share => {
      if (share.toUserId !== userId && share.fromUserId !== userId) {
        return false;
      }

      const expiresAt = new Date(share.expiresAt);
      if (now > expiresAt) {
        share.active = false;
        return false;
      }

      return share.active;
    });
  }

  /**
   * Revoke location share
   * @param {string} shareId - Share ID
   */
  static revokeShare(shareId) {
    if (typeof window === 'undefined') return;
    const shares = JSON.parse(localStorage.getItem('location_shares') || '[]');
    const updated = shares.map(share => 
      share.id === shareId ? { ...share, active: false } : share
    );
    localStorage.setItem('location_shares', JSON.stringify(updated));
  }
}

