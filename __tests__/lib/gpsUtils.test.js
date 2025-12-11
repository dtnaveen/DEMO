import {
  calculateDistance,
  hasGPSCoordinates,
  getCoordinatesFromLocation,
  getDistanceBetweenUsers
} from '@/lib/gpsUtils'

describe('GPS Utilities', () => {
  describe('calculateDistance', () => {
    it('calculates distance between two points', () => {
      // New York to Los Angeles (approximately 2445 miles)
      const distance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437)
      expect(distance).toBeGreaterThan(2400)
      expect(distance).toBeLessThan(2500)
    })

    it('returns 0 for same coordinates', () => {
      const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060)
      expect(distance).toBe(0)
    })

    it('handles negative coordinates', () => {
      const distance = calculateDistance(-40.7128, -74.0060, -34.0522, -118.2437)
      expect(distance).toBeGreaterThan(0)
    })

    it('returns positive distance for any two points', () => {
      const distance = calculateDistance(0, 0, 1, 1)
      expect(distance).toBeGreaterThan(0)
    })
  })

  describe('hasGPSCoordinates', () => {
    it('returns true for user with GPS coordinates', () => {
      const user = {
        latitude: 40.7128,
        longitude: -74.0060
      }
      expect(hasGPSCoordinates(user)).toBe(true)
    })

    it('returns false for user without GPS coordinates', () => {
      const user = {
        latitude: null,
        longitude: null
      }
      expect(hasGPSCoordinates(user)).toBe(false)
    })

    it('returns false for user with only latitude', () => {
      const user = {
        latitude: 40.7128,
        longitude: null
      }
      expect(hasGPSCoordinates(user)).toBe(false)
    })

    it('returns false for user with only longitude', () => {
      const user = {
        latitude: null,
        longitude: -74.0060
      }
      expect(hasGPSCoordinates(user)).toBe(false)
    })
  })

  describe('getCoordinatesFromLocation', () => {
    it('returns coordinates for known city', () => {
      const coords = getCoordinatesFromLocation('New York')
      expect(coords).toHaveProperty('latitude')
      expect(coords).toHaveProperty('longitude')
      expect(coords.latitude).toBeGreaterThan(0)
    })

    it('returns null for unknown location', () => {
      const coords = getCoordinatesFromLocation('UnknownCity12345')
      expect(coords).toBeNull()
    })

    it('handles case-insensitive city names', () => {
      const coords1 = getCoordinatesFromLocation('new york')
      const coords2 = getCoordinatesFromLocation('NEW YORK')
      expect(coords1).toEqual(coords2)
    })
  })

  describe('getDistanceBetweenUsers', () => {
    it('calculates distance between two users with GPS', () => {
      const user1 = {
        latitude: 40.7128,
        longitude: -74.0060
      }
      const user2 = {
        latitude: 34.0522,
        longitude: -118.2437
      }
      
      const distance = getDistanceBetweenUsers(user1, user2)
      expect(distance).toBeGreaterThan(0)
    })

    it('returns null when first user has no GPS', () => {
      const user1 = { latitude: null, longitude: null }
      const user2 = { latitude: 34.0522, longitude: -118.2437 }
      
      const distance = getDistanceBetweenUsers(user1, user2)
      expect(distance).toBeNull()
    })

    it('returns null when second user has no GPS', () => {
      const user1 = { latitude: 40.7128, longitude: -74.0060 }
      const user2 = { latitude: null, longitude: null }
      
      const distance = getDistanceBetweenUsers(user1, user2)
      expect(distance).toBeNull()
    })
  })
})

