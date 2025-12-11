const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx}',
    'components/**/*.{js,jsx}',
    'lib/**/*.{js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  // Performance optimizations - MAXIMUM SPEED
  maxWorkers: 1, // Single worker for fastest execution (no overhead)
  testTimeout: 2000, // 2 second timeout (very fast failure)
  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  // Speed optimizations
  bail: false,
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  // Fast mode - skip all slow checks
  detectOpenHandles: false,
  forceExit: true,
  // Skip coverage collection (only use test:coverage)
  collectCoverage: false,
  // Faster module resolution
  moduleFileExtensions: ['js', 'jsx', 'json'],
  verbose: false,
  // Skip slow transforms
  transformIgnorePatterns: [
    'node_modules/(?!(@heroicons|lucide-react))'
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)

