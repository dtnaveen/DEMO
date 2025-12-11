import {
  getCurrentUser,
  setCurrentUser,
  getAllUsers,
  getConversations,
} from '@/lib/localStorage'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })
  localStorageMock.clear()
})

describe('localStorage functions', () => {
  describe('getCurrentUser', () => {
    it('returns null when no user is stored', () => {
      expect(getCurrentUser()).toBeNull()
    })

    it('returns user when user is stored', () => {
      const user = { id: '1', name: 'Test User' }
      localStorageMock.setItem('currentUser', JSON.stringify(user))
      expect(getCurrentUser()).toEqual(user)
    })
  })

  describe('setCurrentUser', () => {
    it('saves user to localStorage', () => {
      const user = { id: '1', name: 'Test User' }
      setCurrentUser(user)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'currentUser',
        JSON.stringify(user)
      )
    })
  })

  describe('getAllUsers', () => {
    it('returns empty array when no users are stored', () => {
      expect(getAllUsers()).toEqual([])
    })

    it('returns users when users are stored', () => {
      const users = [{ id: '1', name: 'User 1' }, { id: '2', name: 'User 2' }]
      localStorageMock.setItem('allUsers', JSON.stringify(users))
      expect(getAllUsers()).toEqual(users)
    })
  })
})

