// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Ensure window exists
if (typeof window === 'undefined') {
  global.window = {};
}

// Mock localStorage with a working store that persists across tests
// This will be overridden by individual test files, but provides a fallback
let localStorageStore = {};
const localStorageMock = {
  getItem: jest.fn((key) => {
    return localStorageStore[key] || null;
  }),
  setItem: jest.fn((key, value) => {
    localStorageStore[key] = value.toString();
  }),
  removeItem: jest.fn((key) => {
    delete localStorageStore[key];
  }),
  clear: jest.fn(() => {
    localStorageStore = {};
  }),
};

// Set up localStorage on window and as a global
// This ensures localStorage is available as a global variable (not just window.localStorage)
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Make localStorage available as a global (browser behavior)
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Polyfill TextEncoder/TextDecoder for Node.js environment
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock crypto.subtle for password security tests
// Store hashes by salt to ensure consistent verification
const cryptoHashStore = new Map();

// Always set up crypto mock for tests
global.crypto = {
  getRandomValues: (arr) => {
    // Return predictable values for testing (based on array length for consistency)
    for (let i = 0; i < arr.length; i++) {
      arr[i] = (i * 17) % 256; // Use prime number for better distribution
    }
    return arr;
  },
  subtle: {
    importKey: jest.fn().mockImplementation(async () => {
      return { format: 'raw', algorithm: { name: 'PBKDF2' }, extractable: false, keyUsages: ['deriveBits'] };
    }),
    deriveBits: jest.fn().mockImplementation(async (algorithm, keyMaterial, length) => {
      // Create a consistent hash based on salt
      const saltHex = Array.from(algorithm.salt).map(b => b.toString(16).padStart(2, '0')).join('');
      const key = `${saltHex}-${length}`;
      
      if (!cryptoHashStore.has(key)) {
        // Generate a predictable hash based on salt
        const hash = new Uint8Array(length / 8);
        for (let i = 0; i < hash.length; i++) {
          hash[i] = (i * 7 + saltHex.charCodeAt(i % saltHex.length)) % 256;
        }
        cryptoHashStore.set(key, hash.buffer);
      }
      
      return cryptoHashStore.get(key);
    })
  }
};

