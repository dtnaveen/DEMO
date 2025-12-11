import {
  getUserSubscriptionTier,
  isPremiumUser,
  getDailyLikesRemaining,
  recordLike,
  hasPremiumFeature,
  SUBSCRIPTION_TIERS,
  FREE_USER_LIMITS
} from '@/lib/subscription'

describe('Subscription Functions', () => {
  const createUser = (overrides = {}) => ({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    subscriptionTier: 'free',
    ...overrides
  })

  describe('getUserSubscriptionTier', () => {
    it('returns FREE for null user', () => {
      expect(getUserSubscriptionTier(null)).toBe(SUBSCRIPTION_TIERS.FREE)
    })

    it('returns FREE for user without subscriptionTier', () => {
      const user = createUser({ subscriptionTier: undefined })
      expect(getUserSubscriptionTier(user)).toBe(SUBSCRIPTION_TIERS.FREE)
    })

    it('returns correct tier for premium user', () => {
      const user = createUser({ subscriptionTier: 'plus' })
      expect(getUserSubscriptionTier(user)).toBe('plus')
    })
  })

  describe('isPremiumUser', () => {
    it('returns false for free user', () => {
      const user = createUser({ subscriptionTier: 'free' })
      expect(isPremiumUser(user)).toBe(false)
    })

    it('returns true for basic user', () => {
      const user = createUser({ subscriptionTier: 'basic' })
      expect(isPremiumUser(user)).toBe(true)
    })

    it('returns true for plus user', () => {
      const user = createUser({ subscriptionTier: 'plus' })
      expect(isPremiumUser(user)).toBe(true)
    })

    it('returns true for vip user', () => {
      const user = createUser({ subscriptionTier: 'vip' })
      expect(isPremiumUser(user)).toBe(true)
    })

    it('returns false for null user', () => {
      expect(isPremiumUser(null)).toBe(false)
    })
  })

  describe('getDailyLikesRemaining', () => {
    it('returns unlimited for premium users', () => {
      const user = createUser({ subscriptionTier: 'plus' })
      const remaining = getDailyLikesRemaining(user)
      expect(remaining).toBe('unlimited')
    })

    it('returns limit for free users', () => {
      const user = createUser({ subscriptionTier: 'free' })
      const remaining = getDailyLikesRemaining(user)
      expect(remaining).toBe(FREE_USER_LIMITS.DAILY_LIKES)
    })

    it('tracks daily likes for free users', () => {
      const user = createUser({ subscriptionTier: 'free' })
      
      // Record some likes
      recordLike(user)
      recordLike(user)
      
      const remaining = getDailyLikesRemaining(user)
      expect(remaining).toBe(FREE_USER_LIMITS.DAILY_LIKES - 2)
    })

    it('resets daily likes after 24 hours', () => {
      const user = createUser({ 
        subscriptionTier: 'free',
        lastLikeReset: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
      })
      
      const remaining = getDailyLikesRemaining(user)
      expect(remaining).toBe(FREE_USER_LIMITS.DAILY_LIKES)
    })
  })

  describe('recordLike', () => {
    it('returns true for premium users', () => {
      const user = createUser({ subscriptionTier: 'plus' })
      expect(recordLike(user)).toBe(true)
    })

    it('returns true when likes remaining', () => {
      const user = createUser({ subscriptionTier: 'free' })
      expect(recordLike(user)).toBe(true)
    })

    it('returns false when daily limit reached', () => {
      const user = createUser({ subscriptionTier: 'free' })
      
      // Exhaust daily likes
      for (let i = 0; i < FREE_USER_LIMITS.DAILY_LIKES; i++) {
        recordLike(user)
      }
      
      expect(recordLike(user)).toBe(false)
    })
  })

  describe('hasPremiumFeature', () => {
    it('returns false for free users', () => {
      const user = createUser({ subscriptionTier: 'free' })
      expect(hasPremiumFeature(user, 'ADVANCED_FILTERS')).toBe(false)
    })

    it('returns true for premium users', () => {
      const user = createUser({ subscriptionTier: 'plus' })
      expect(hasPremiumFeature(user, 'ADVANCED_FILTERS')).toBe(true)
    })

    it('returns false for invalid feature', () => {
      const user = createUser({ subscriptionTier: 'plus' })
      expect(hasPremiumFeature(user, 'INVALID_FEATURE')).toBe(false)
    })
  })
})
