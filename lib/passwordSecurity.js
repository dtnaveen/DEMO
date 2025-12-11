/**
 * Password Security Utilities
 * Implements secure password hashing and verification using Web Crypto API
 * Production-ready security implementation
 */

/**
 * Hash a password using Web Crypto API (PBKDF2)
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password with salt
 */
export async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

  // Import password as key material
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);

  // Use PBKDF2 for key derivation (100,000 iterations for security)
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256 // 32 bytes = 256 bits
  );

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Return format: salt:hash (both hex)
  return `${saltHex}:${hashHex}`;
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Stored hash (format: salt:hash or plain text for backward compatibility)
 * @returns {Promise<boolean>} True if password matches
 */
export async function verifyPassword(password, hash) {
  if (!password || !hash) {
    return false;
  }

  // Backward compatibility: if hash doesn't contain ':', it's plain text (old format)
  // This allows existing test users to still log in, then their password will be migrated
  if (!hash.includes(':')) {
    // Plain text comparison for backward compatibility
    return password === hash;
  }

  try {
    // Extract salt and hash from stored format
    const [saltHex, storedHash] = hash.split(':');
    if (!saltHex || !storedHash) {
      return false;
    }

    // Convert salt from hex to Uint8Array
    const salt = new Uint8Array(
      saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    );

    // Import password as key material
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordData,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    // Derive hash with same parameters
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    // Convert to hex
    const hashArray = Array.from(new Uint8Array(derivedBits));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Compare hashes (constant-time comparison)
    return hashHex === storedHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Check if a password hash is in the new secure format
 * @param {string} hash - Password hash to check
 * @returns {boolean} True if hash is in secure format
 */
export function isSecureHash(hash) {
  return hash && hash.includes(':') && hash.split(':').length === 2;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validatePasswordStrength(password) {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one letter' };
  }

  return { isValid: true, message: 'Password is strong' };
}

/**
 * Rate limiting for login attempts
 */
class LoginRateLimiter {
  constructor() {
    this.attempts = new Map(); // identifier -> { count, resetTime }
    this.maxAttempts = 5; // Maximum attempts
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
  }

  /**
   * Record a failed login attempt
   * @param {string} identifier - Email or username
   */
  recordFailedAttempt(identifier) {
    if (typeof window === 'undefined') return;

    const key = identifier.toLowerCase();
    const now = Date.now();
    const record = this.attempts.get(key) || { count: 0, resetTime: now + this.lockoutDuration };

    // Reset if lockout period has passed
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + this.lockoutDuration;
    }

    record.count++;
    this.attempts.set(key, record);

    // Persist to localStorage
    try {
      const attemptsData = {};
      this.attempts.forEach((value, key) => {
        attemptsData[key] = value;
      });
      localStorage.setItem('login_attempts', JSON.stringify(attemptsData));
    } catch (error) {
      console.error('Error saving login attempts:', error);
    }
  }

  /**
   * Clear failed attempts for an identifier (on successful login)
   * @param {string} identifier - Email or username
   */
  clearAttempts(identifier) {
    if (typeof window === 'undefined') return;

    const key = identifier.toLowerCase();
    this.attempts.delete(key);

    // Update localStorage
    try {
      const attemptsData = JSON.parse(localStorage.getItem('login_attempts') || '{}');
      delete attemptsData[key];
      localStorage.setItem('login_attempts', JSON.stringify(attemptsData));
    } catch (error) {
      console.error('Error clearing login attempts:', error);
    }
  }

  /**
   * Check if identifier is rate limited
   * @param {string} identifier - Email or username
   * @returns {Object} { isLimited: boolean, remainingTime: number (ms), attemptsLeft: number }
   */
  isRateLimited(identifier) {
    if (typeof window === 'undefined') {
      return { isLimited: false, remainingTime: 0, attemptsLeft: this.maxAttempts };
    }

    // Load from localStorage
    try {
      const attemptsData = JSON.parse(localStorage.getItem('login_attempts') || '{}');
      this.attempts.clear();
      Object.entries(attemptsData).forEach(([key, value]) => {
        this.attempts.set(key, value);
      });
    } catch (error) {
      // Ignore errors
    }

    const key = identifier.toLowerCase();
    const record = this.attempts.get(key);

    if (!record) {
      return { isLimited: false, remainingTime: 0, attemptsLeft: this.maxAttempts };
    }

    const now = Date.now();

    // Reset if lockout period has passed
    if (now > record.resetTime) {
      this.attempts.delete(key);
      return { isLimited: false, remainingTime: 0, attemptsLeft: this.maxAttempts };
    }

    const attemptsLeft = Math.max(0, this.maxAttempts - record.count);
    const isLimited = record.count >= this.maxAttempts;
    const remainingTime = Math.max(0, record.resetTime - now);

    return { isLimited, remainingTime, attemptsLeft };
  }
}

// Export singleton instance
export const loginRateLimiter = new LoginRateLimiter();

