import {
  getUserActions,
  setUserActions,
  addLike,
  addPass,
  isLiked,
  isPassed,
  getLikes
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

describe('User Actions', () => {
  describe('getUserActions', () => {
    it('returns default actions when none exist', () => {
      const actions = getUserActions()
      expect(actions).toEqual({ likes: [], passes: [] })
    })

    it('returns stored actions', () => {
      const storedActions = { likes: ['1', '2'], passes: ['3'] }
      // Use localStorage directly (not localStorageMock) to match how the code uses it
      localStorage.setItem('userActions', JSON.stringify(storedActions))
      
      const actions = getUserActions()
      expect(actions).toEqual(storedActions)
    })
  })

  describe('setUserActions', () => {
    it('saves actions to localStorage', () => {
      const actions = { likes: ['1'], passes: ['2'] }
      setUserActions(actions)
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'userActions',
        JSON.stringify(actions)
      )
    })
  })

  describe('addLike', () => {
    it('adds user ID to likes', () => {
      addLike('user1')
      const actions = getUserActions()
      expect(actions.likes).toContain('user1')
    })

    it('does not add duplicate likes', () => {
      addLike('user1')
      addLike('user1')
      const actions = getUserActions()
      expect(actions.likes.filter(id => id === 'user1').length).toBe(1)
    })
  })

  describe('addPass', () => {
    it('adds user ID to passes', () => {
      addPass('user1')
      const actions = getUserActions()
      expect(actions.passes).toContain('user1')
    })

    it('does not add duplicate passes', () => {
      addPass('user1')
      addPass('user1')
      const actions = getUserActions()
      expect(actions.passes.filter(id => id === 'user1').length).toBe(1)
    })
  })

  describe('isLiked', () => {
    it('returns true for liked user', () => {
      addLike('user1')
      expect(isLiked('user1')).toBe(true)
    })

    it('returns false for not liked user', () => {
      expect(isLiked('user1')).toBe(false)
    })
  })

  describe('isPassed', () => {
    it('returns true for passed user', () => {
      addPass('user1')
      expect(isPassed('user1')).toBe(true)
    })

    it('returns false for not passed user', () => {
      expect(isPassed('user1')).toBe(false)
    })
  })

  describe('getLikes', () => {
    it('returns all liked user IDs', () => {
      addLike('user1')
      addLike('user2')
      
      const likes = getLikes()
      expect(likes).toContain('user1')
      expect(likes).toContain('user2')
    })

    it('returns empty array when no likes', () => {
      const likes = getLikes()
      expect(likes).toEqual([])
    })
  })
})

