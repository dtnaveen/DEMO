/**
 * Test script to verify Logo redirect functionality
 * This script checks that the Logo components are properly wrapped in Link components
 * that redirect to home ("/") on both login and signup pages
 * 
 * Usage: node scripts/test/test-logo-redirect.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Logo Redirect Implementation...\n');

// Get project root (two levels up from scripts/test/)
const projectRoot = path.join(__dirname, '../..');

// Test 1: Check login page
console.log('1️⃣ Testing Login Page (app/login/page.js)...');
const loginPagePath = path.join(projectRoot, 'app/login/page.js');
const loginPage = fs.readFileSync(loginPagePath, 'utf8');

const loginHasLinkImport = loginPage.includes("import Link from 'next/link'");
const loginHasLogoLink = loginPage.includes('<Link href="/"') && loginPage.includes('<Logo');
const loginHasLogoImport = loginPage.includes("import Logo from '@/components/ui/Logo'");

if (loginHasLinkImport && loginHasLogoLink && loginHasLogoImport) {
  console.log('   ✅ Login page: Link import found');
  console.log('   ✅ Login page: Logo wrapped in Link with href="/"');
  console.log('   ✅ Login page: Logo import found');
} else {
  console.log('   ❌ Login page: Missing required components');
  if (!loginHasLinkImport) console.log('      - Missing Link import');
  if (!loginHasLogoLink) console.log('      - Logo not wrapped in Link or href not "/"');
  if (!loginHasLogoImport) console.log('      - Missing Logo import');
}

// Test 2: Check signup/onboard page
console.log('\n2️⃣ Testing Signup/Onboard Page (app/onboard/page.js)...');
const onboardPagePath = path.join(projectRoot, 'app/onboard/page.js');
const onboardPage = fs.readFileSync(onboardPagePath, 'utf8');

const onboardHasLinkImport = onboardPage.includes("import Link from 'next/link'");
const onboardHasLogoLink = onboardPage.includes('<Link href="/"') && onboardPage.includes('<Logo');
const onboardHasLogoImport = onboardPage.includes("import Logo from '@/components/ui/Logo'");

if (onboardHasLinkImport && onboardHasLogoLink && onboardHasLogoImport) {
  console.log('   ✅ Onboard page: Link import found');
  console.log('   ✅ Onboard page: Logo wrapped in Link with href="/"');
  console.log('   ✅ Onboard page: Logo import found');
} else {
  console.log('   ❌ Onboard page: Missing required components');
  if (!onboardHasLinkImport) console.log('      - Missing Link import');
  if (!onboardHasLogoLink) console.log('      - Logo not wrapped in Link or href not "/"');
  if (!onboardHasLogoImport) console.log('      - Missing Logo import');
}

// Summary
console.log('\n📊 Test Summary:');
const allTestsPass = loginHasLinkImport && loginHasLogoLink && loginHasLogoImport &&
                     onboardHasLinkImport && onboardHasLogoLink && onboardHasLogoImport;

if (allTestsPass) {
  console.log('   ✅ All tests passed! Logo redirects are properly implemented.');
  console.log('\n📝 Manual Testing Instructions:');
  console.log('   1. Start the dev server: npm run dev');
  console.log('   2. Open http://localhost:3000/login');
  console.log('   3. Click on the Logo/Title at the top');
  console.log('   4. Verify it redirects to http://localhost:3000');
  console.log('   5. Open http://localhost:3000/onboard');
  console.log('   6. Click on the Logo/Title at the top');
  console.log('   7. Verify it redirects to http://localhost:3000');
  process.exit(0);
} else {
  console.log('   ❌ Some tests failed. Please check the implementation.');
  process.exit(1);
}
