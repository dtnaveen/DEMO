/**
 * Test Credentials Helper
 * Reads test user credentials from environment variables
 * 
 * SECURITY: Credentials should be stored in .env.local (gitignored)
 * Never commit .env.local to version control
 */

/**
 * Get test credentials from environment variables
 * All passwords default to empty strings to ensure .env.local is configured
 * 
 * SECURITY: Empty passwords will cause authentication to fail if .env.local is not set.
 * This prevents silent failures and forces proper configuration.
 */
export function getTestCredentials() {
  // Use environment variables if available, otherwise fall back to empty strings
  // In production, these should always come from environment variables
  const credentials = {
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
      // Consistent with other passwords - defaults to empty string
      password: process.env.NEXT_PUBLIC_TEST_MATCHING_PASSWORD || '',
    },
  };

  // Warn in development if credentials are not configured
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    const missingPasswords = [];
    if (!credentials.admin.password) missingPasswords.push('admin');
    if (!credentials.free.password) missingPasswords.push('free');
    if (!credentials.basic.password) missingPasswords.push('basic');
    if (!credentials.plus.password) missingPasswords.push('plus');
    if (!credentials.premium.password) missingPasswords.push('premium');
    if (!credentials.regular.password) missingPasswords.push('regular');
    if (!credentials.matching.password) missingPasswords.push('matching');

    if (missingPasswords.length > 0) {
      console.warn(
        '⚠️  Test credentials not configured. Missing passwords for:',
        missingPasswords.join(', '),
        '\nPlease create .env.local from .env.example and add your test credentials.',
        '\nSee ENV_SETUP.md for instructions.'
      );
    }
  }

  return credentials;
}

/**
 * Validate that test credentials are configured
 * Returns true if all credentials are set, false otherwise
 * Includes matching profile password for consistency
 */
export function areTestCredentialsConfigured() {
  const creds = getTestCredentials();
  return !!(
    creds.admin.password &&
    creds.free.password &&
    creds.basic.password &&
    creds.plus.password &&
    creds.premium.password &&
    creds.regular.password &&
    creds.matching.password
  );
}

