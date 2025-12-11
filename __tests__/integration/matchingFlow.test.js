import {
  getCurrentUser,
  setCurrentUser,
  getAllUsers,
  setAllUsers,
  getUserActions,
  addLike,
  getMatches,
  setMatches
} from '@/lib/localStorage'
import { calculateMatchScore } from '@/lib/matchingAlgorithm'
import { isPremiumUser, recordLike } from '@/lib/subscription'

// Mock localStorage
let store = {};
const localStorageMock = {
  getItem: jest.fn((key) => {
    return store[key] || null;
  }),
  setItem: jest.fn((key, value) => {
    store[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
  }),
  clear: jest.fn(() => {
    store = {};
  })
};

// Ensure window exists before any tests
if (typeof window === 'undefined') {
  global.window = {};
}

// Set up localStorage before any imports or tests run
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});
global.localStorage = localStorageMock;

beforeEach(() => {
  // Reset the store
  store = {};
  
  // Re-create mock implementations (Jest's resetMocks might clear them)
  localStorageMock.getItem.mockImplementation((key) => {
    return store[key] || null;
  });
  localStorageMock.setItem.mockImplementation((key, value) => {
    store[key] = value.toString();
  });
  localStorageMock.removeItem.mockImplementation((key) => {
    delete store[key];
  });
  localStorageMock.clear.mockImplementation(() => {
    store = {};
  });
  
  // Re-setup localStorage to ensure it's fresh
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true,
  });
  global.localStorage = localStorageMock;
})

describe('Matching Flow Integration', () => {
  const createUser = (id, overrides = {}) => ({
    id,
    name: `User ${id}`,
    email: `user${id}@test.com`,
    age: 25,
    gender: 'Male',
    ageGroup: 'young',
    valueAnswers: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    contentAnswers: [1, 2, 3, 4, 5],
    subscriptionTier: 'free',
    ...overrides
  })

  it('completes full matching flow', () => {
    // Setup: Create users
    const currentUser = createUser('current')
    const otherUser = createUser('other')
    
    setCurrentUser(currentUser)
    setAllUsers([currentUser, otherUser])

    // Step 1: Calculate match score
    const matchScore = calculateMatchScore(currentUser, otherUser)
    expect(matchScore.percentage).toBeGreaterThan(0)

    // Step 2: Check if user can like (free user)
    const canLike = recordLike(currentUser)
    expect(canLike).toBe(true)

    // Step 3: Add like
    addLike(otherUser.id)
    const actions = getUserActions()
    expect(actions.likes).toContain(otherUser.id)

    // Step 4: Check if mutual like (simulate)
    const matches = getMatches()
    // In real app, would check if otherUser also liked currentUser
    expect(Array.isArray(matches)).toBe(true)
  })

  it('handles premium user unlimited likes', () => {
    const premiumUser = createUser('premium', { subscriptionTier: 'plus' })
    setCurrentUser(premiumUser)

    // Premium users can like unlimited times (test with 10 instead of 100 for speed)
    for (let i = 0; i < 10; i++) {
      expect(recordLike(premiumUser)).toBe(true)
    }
    // Verify it still works after multiple likes
    expect(recordLike(premiumUser)).toBe(true)
  })

  it('enforces daily like limit for free users', () => {
    const freeUser = createUser('free', { subscriptionTier: 'free' })
    setCurrentUser(freeUser)

    // Free users have 10 daily likes
    let likeCount = 0
    let canLike = true
    while (canLike && likeCount < 15) {
      canLike = recordLike(freeUser)
      if (canLike) {
        likeCount++
      }
    }

    expect(likeCount).toBeLessThanOrEqual(10)
    // After 10 likes, should not be able to like more
    expect(recordLike(freeUser)).toBe(false)
  })

  it('filters out passed users from discovery', () => {
    const currentUser = createUser('current')
    const user1 = createUser('1')
    const user2 = createUser('2')
    
    setCurrentUser(currentUser)
    setAllUsers([currentUser, user1, user2])

    // Pass on user1
    const { addPass } = require('@/lib/localStorage')
    addPass(user1.id)

    // Filter users (simulate discover page logic)
    const allUsers = getAllUsers()
    const actions = getUserActions()
    const availableUsers = allUsers.filter(
      user => user.id !== currentUser.id && !actions.passes.includes(user.id)
    )

    expect(availableUsers).not.toContainEqual(expect.objectContaining({ id: '1' }))
    expect(availableUsers).toContainEqual(expect.objectContaining({ id: '2' }))
  })
})

