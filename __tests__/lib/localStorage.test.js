import {
  getCurrentUser,
  setCurrentUser,
  getAllUsers,
} from '@/lib/localStorage'

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

