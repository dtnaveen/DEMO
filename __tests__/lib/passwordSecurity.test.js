/**
 * Password Security Tests
 * Tests for password hashing, verification, and rate limiting
 */

import { 
  hashPassword, 
  verifyPassword, 
  validatePasswordStrength, 
  isSecureHash,
  loginRateLimiter 
} from '@/lib/passwordSecurity';

// Crypto is mocked in jest.setup.js, but we need to re-implement it in beforeEach
// because Jest's resetMocks clears the implementations

const cryptoHashStore = new Map();

// Mock localStorage for rate limiter tests
let rateLimiterStore = {};
const rateLimiterLocalStorage = {
  getItem: jest.fn((key) => {
    return rateLimiterStore[key] || null;
  }),
  setItem: jest.fn((key, value) => {
    rateLimiterStore[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete rateLimiterStore[key];
  }),
  clear: jest.fn(() => {
    rateLimiterStore = {};
  })
};

// Ensure window exists
if (typeof window === 'undefined') {
  global.window = {};
}

beforeEach(() => {
  // Reset rate limiter store
  rateLimiterStore = {};
  
  // Re-implement localStorage mocks for rate limiter
  rateLimiterLocalStorage.getItem.mockImplementation((key) => {
    return rateLimiterStore[key] || null;
  });
  rateLimiterLocalStorage.setItem.mockImplementation((key, value) => {
    rateLimiterStore[key] = value.toString();
  });
  rateLimiterLocalStorage.removeItem.mockImplementation((key) => {
    delete rateLimiterStore[key];
  });
  rateLimiterLocalStorage.clear.mockImplementation(() => {
    rateLimiterStore = {};
  });
  
  // Set up localStorage for rate limiter
  Object.defineProperty(window, 'localStorage', {
    value: rateLimiterLocalStorage,
    writable: true,
    configurable: true,
  });
  global.localStorage = rateLimiterLocalStorage;
  
  // Ensure crypto is set up (Jest's resetMocks might clear it)
  if (!global.crypto) {
    global.crypto = {};
  }
  if (!global.crypto.subtle) {
    global.crypto.subtle = {};
  }
  
  // Re-implement crypto mocks (Jest's resetMocks might clear them)
  global.crypto.getRandomValues = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (i * 17) % 256;
    }
    return arr;
  };
  
  // Store password data with keyMaterial for hash generation
  const passwordDataMap = new WeakMap();
  
  global.crypto.subtle.importKey = jest.fn().mockImplementation(async (format, keyData, algorithm, extractable, keyUsages) => {
    // Store the password data (keyData is the password bytes) with the returned keyMaterial
    const keyMaterial = { 
      format, 
      algorithm, 
      extractable, 
      keyUsages,
      _passwordData: new Uint8Array(keyData) // Store password bytes for hash generation
    };
    passwordDataMap.set(keyMaterial, keyData);
    return keyMaterial;
  });
  
  global.crypto.subtle.deriveBits = jest.fn().mockImplementation(async (algorithm, keyMaterial, length) => {
    // Create a consistent hash based on salt AND password
    const saltHex = Array.from(algorithm.salt).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Get password data from keyMaterial
    let passwordHash = 0;
    if (keyMaterial && keyMaterial._passwordData) {
      const passwordBytes = keyMaterial._passwordData;
      for (let i = 0; i < Math.min(passwordBytes.length, 20); i++) {
        passwordHash = (passwordHash * 31 + passwordBytes[i]) % 1000000;
      }
    }
    
    const key = `${saltHex}-${length}-${passwordHash}`;
    
    if (!cryptoHashStore.has(key)) {
      // Generate a predictable hash based on salt and password
      const hash = new Uint8Array(length / 8);
      for (let i = 0; i < hash.length; i++) {
        hash[i] = (i * 7 + saltHex.charCodeAt(i % saltHex.length) + passwordHash) % 256;
      }
      cryptoHashStore.set(key, hash.buffer);
    }
    
    return cryptoHashStore.get(key);
  });
  
  // Clear hash store between tests
  cryptoHashStore.clear();
});

describe('Password Security', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.includes(':')).toBe(true);
    });

    it('should throw error for empty password', async () => {
      await expect(hashPassword('')).rejects.toThrow();
    });

    it('should throw error for non-string password', async () => {
      await expect(hashPassword(null)).rejects.toThrow();
      await expect(hashPassword(123)).rejects.toThrow();
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword('WrongPassword', hash);
      
      expect(isValid).toBe(false);
    });

    it('should handle plain text passwords (backward compatibility)', async () => {
      const password = 'plaintext123';
      const isValid = await verifyPassword(password, password);
      
      expect(isValid).toBe(true);
    });

    it('should return false for empty inputs', async () => {
      expect(await verifyPassword('', 'hash')).toBe(false);
      expect(await verifyPassword('password', '')).toBe(false);
      expect(await verifyPassword('', '')).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should accept strong passwords', () => {
      const result = validatePasswordStrength('StrongPass123');
      expect(result.isValid).toBe(true);
    });

    it('should reject passwords shorter than 8 characters', () => {
      const result = validatePasswordStrength('Short1');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('8 characters');
    });

    it('should reject passwords without numbers', () => {
      const result = validatePasswordStrength('NoNumbers');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('number');
    });

    it('should reject passwords without letters', () => {
      const result = validatePasswordStrength('12345678');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('letter');
    });

    it('should reject passwords longer than 128 characters', () => {
      const longPassword = 'a'.repeat(129) + '1';
      const result = validatePasswordStrength(longPassword);
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('128 characters');
    });

    it('should reject empty passwords', () => {
      const result = validatePasswordStrength('');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('required');
    });
  });

  describe('isSecureHash', () => {
    it('should identify secure hash format', () => {
      expect(isSecureHash('salt:hash')).toBe(true);
      expect(isSecureHash('abc123:def456')).toBe(true);
    });

    it('should reject plain text as secure hash', () => {
      expect(isSecureHash('plaintext')).toBe(false);
      expect(isSecureHash('password123')).toBe(false);
    });

    it('should handle invalid formats', () => {
      expect(isSecureHash('')).toBe(false);
      expect(isSecureHash(null)).toBe(false);
      expect(isSecureHash('onlysalt:')).toBe(false);
      expect(isSecureHash(':onlyhash')).toBe(false);
    });
  });

  describe('LoginRateLimiter', () => {
    beforeEach(() => {
      // Clear rate limiter state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('login_attempts');
      }
      loginRateLimiter.attempts.clear();
    });

    it('should allow login attempts initially', () => {
      const result = loginRateLimiter.isRateLimited('test@example.com');
      expect(result.isLimited).toBe(false);
      expect(result.attemptsLeft).toBe(5);
    });

    it('should track failed attempts', () => {
      loginRateLimiter.recordFailedAttempt('test@example.com');
      const result = loginRateLimiter.isRateLimited('test@example.com');
      expect(result.attemptsLeft).toBe(4);
    });

    it('should lockout after max attempts', () => {
      for (let i = 0; i < 5; i++) {
        loginRateLimiter.recordFailedAttempt('test@example.com');
      }
      const result = loginRateLimiter.isRateLimited('test@example.com');
      expect(result.isLimited).toBe(true);
      expect(result.attemptsLeft).toBe(0);
    });

    it('should clear attempts on successful login', () => {
      loginRateLimiter.recordFailedAttempt('test@example.com');
      loginRateLimiter.clearAttempts('test@example.com');
      const result = loginRateLimiter.isRateLimited('test@example.com');
      expect(result.isLimited).toBe(false);
      expect(result.attemptsLeft).toBe(5);
    });

    it('should track attempts per identifier', () => {
      loginRateLimiter.recordFailedAttempt('user1@example.com');
      loginRateLimiter.recordFailedAttempt('user2@example.com');
      
      const result1 = loginRateLimiter.isRateLimited('user1@example.com');
      const result2 = loginRateLimiter.isRateLimited('user2@example.com');
      
      expect(result1.attemptsLeft).toBe(4);
      expect(result2.attemptsLeft).toBe(4);
    });
  });
});

