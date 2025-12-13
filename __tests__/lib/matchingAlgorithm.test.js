import { calculateMatchScore, getSharedInterests } from '@/lib/matchingAlgorithm'

describe('Matching Algorithm', () => {
  const createUser = (overrides = {}) => ({
    id: '1',
    name: 'Test User',
    age: 25,
    gender: 'Male',
    ageGroup: 'young',
    valueAnswers: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    contentAnswers: [1, 2, 3, 4, 5],
    ...overrides
  })

  describe('calculateMatchScore', () => {
    it('returns 0% match for users with no common data', () => {
      const user1 = createUser({ valueAnswers: null })
      const user2 = createUser({ valueAnswers: null })
      
      const result = calculateMatchScore(user1, user2)
      expect(result.percentage).toBe(0)
    })

    it('calculates high match for identical users', () => {
      const user1 = createUser()
      const user2 = createUser()
      
      const result = calculateMatchScore(user1, user2)
      expect(result.percentage).toBeGreaterThanOrEqual(80)
    })

    it('calculates match score with value answers', () => {
      const user1 = createUser({ valueAnswers: [1, 1, 1, 1, 1] })
      const user2 = createUser({ valueAnswers: [1, 1, 1, 1, 1] })
      
      const result = calculateMatchScore(user1, user2)
      expect(result.percentage).toBeGreaterThan(0)
      expect(result.valuesScore).toBeGreaterThan(0)
    })

    it('calculates match score with content answers', () => {
      const user1 = createUser({ 
        contentAnswers: [1, 2, 3],
        ageGroup: 'young'
      })
      const user2 = createUser({ 
        contentAnswers: [1, 2, 3],
        ageGroup: 'young'
      })
      
      const result = calculateMatchScore(user1, user2)
      expect(result.contentScore).toBeGreaterThan(0)
    })

    it('handles different age groups', () => {
      const user1 = createUser({ ageGroup: 'young' })
      const user2 = createUser({ ageGroup: 'mature' })
      
      const result = calculateMatchScore(user1, user2)
      expect(result.contentScore).toBe(10) // Base score for different age groups
    })

    it('includes lifestyle compatibility', () => {
      const user1 = createUser({ lifestyle: ['Fitness', 'Travel'] })
      const user2 = createUser({ lifestyle: ['Fitness', 'Travel'] })
      
      const result = calculateMatchScore(user1, user2)
      expect(result.lifestyleScore).toBeGreaterThan(0)
    })

    it('includes education compatibility', () => {
      const user1 = createUser({ education: 'Bachelor' })
      const user2 = createUser({ education: 'Bachelor' })
      
      const result = calculateMatchScore(user1, user2)
      expect(result.educationScore).toBeGreaterThan(0)
    })

    it('returns all score components', () => {
      const user1 = createUser()
      const user2 = createUser()
      
      const result = calculateMatchScore(user1, user2)
      expect(result).toHaveProperty('percentage')
      expect(result).toHaveProperty('valuesScore')
      expect(result).toHaveProperty('contentScore')
      expect(result).toHaveProperty('lifestyleScore')
      expect(result).toHaveProperty('breakdown')
    })

    it('handles missing optional fields gracefully', () => {
      const user1 = createUser({ lifestyle: null, education: null })
      const user2 = createUser({ lifestyle: null, education: null })
      
      const result = calculateMatchScore(user1, user2)
      expect(result.percentage).toBeGreaterThanOrEqual(0)
      expect(result.percentage).toBeLessThanOrEqual(100)
    })
  })

  describe('getSharedInterests', () => {
    it('returns empty array for users with no shared interests', () => {
      const user1 = createUser({ valueAnswers: [1, 1, 1] })
      const user2 = createUser({ valueAnswers: [5, 5, 5] })
      
      const result = getSharedInterests(user1, user2)
      expect(result).toEqual([])
    })

    it('finds shared interests', () => {
      const user1 = createUser({ valueAnswers: [1, 2, 3] })
      const user2 = createUser({ valueAnswers: [1, 2, 4] })
      
      const result = getSharedInterests(user1, user2)
      expect(result.length).toBeGreaterThan(0)
    })

    it('handles missing value answers', () => {
      const user1 = createUser({ valueAnswers: null })
      const user2 = createUser({ valueAnswers: [1, 2, 3] })
      
      const result = getSharedInterests(user1, user2)
      expect(result).toEqual([])
    })
  })
})

