/**
 * Test Credentials Helper
 * Reads test user credentials from environment variables
 * 
 * SECURITY: Credentials should be stored in .env.local (gitignored)
 * Never commit .env.local to version control
 */

/**
 * Get test credentials from environment variables
 * Falls back to defaults if env vars not set (for development)
 */
export function getTestCredentials() {
  // Use environment variables if available, otherwise fall back to defaults
  // In production, these should always come from environment variables
  return {
    admin: {
      email: process.env.NEXT_PUBLIC_TEST_ADMIN_EMAIL || 'admin@vibematch.com',
      password: process.env.NEXT_PUBLIC_TEST_ADMIN_PASSWORD || '',
    },
    free: {
      email: process.env.NEXT_PUBLIC_TEST_FREE_EMAIL || 'free@test.com',
      password: process.env.NEXT_PUBLIC_TEST_FREE_PASSWORD || '',
    },
    basic: {
      email: process.env.NEXT_PUBLIC_TEST_BASIC_EMAIL || 'basic@test.com',
      password: process.env.NEXT_PUBLIC_TEST_BASIC_PASSWORD || '',
    },
    plus: {
      email: process.env.NEXT_PUBLIC_TEST_PLUS_EMAIL || 'plus@test.com',
      password: process.env.NEXT_PUBLIC_TEST_PLUS_PASSWORD || '',
    },
    premium: {
      email: process.env.NEXT_PUBLIC_TEST_PREMIUM_EMAIL || 'premium@test.com',
      password: process.env.NEXT_PUBLIC_TEST_PREMIUM_PASSWORD || '',
    },
    regular: {
      email: process.env.NEXT_PUBLIC_TEST_REGULAR_EMAIL || 'ranjith@example.com',
      password: process.env.NEXT_PUBLIC_TEST_REGULAR_PASSWORD || '',
    },
    matching: {
      // Default password for auto-generated matching profiles
      password: process.env.NEXT_PUBLIC_TEST_MATCHING_PASSWORD || 'match123',
    },
  };
}

/**
 * Validate that test credentials are configured
 * Returns true if all credentials are set, false otherwise
 */
export function areTestCredentialsConfigured() {
  const creds = getTestCredentials();
  return !!(
    creds.admin.password &&
    creds.free.password &&
    creds.basic.password &&
    creds.plus.password &&
    creds.premium.password &&
    creds.regular.password
  );
}

