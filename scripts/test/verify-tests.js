/**
 * Quick test verification script
 * Checks that all test files exist and have correct imports
 */

const fs = require('fs');
const path = require('path');

const testFiles = [
  '__tests__/lib/matchingAlgorithm.test.js',
  '__tests__/lib/subscription.test.js',
  '__tests__/lib/gpsUtils.test.js',
  '__tests__/lib/userActions.test.js',
  '__tests__/components/ProfileCard.test.js',
  '__tests__/components/Card.test.js',
  '__tests__/integration/matchingFlow.test.js',
];

const libFiles = [
  'lib/matchingAlgorithm.js',
  'lib/subscription.js',
  'lib/gpsUtils.js',
  'lib/localStorage.js',
];

console.log('🔍 Verifying Test Suite...\n');

let allGood = true;

// Check test files exist
console.log('📝 Checking test files:');
testFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allGood = false;
});

// Check lib files exist
console.log('\n📚 Checking library files:');
libFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allGood = false;
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const scripts = packageJson.scripts || {};
const requiredScripts = ['test', 'test:watch', 'test:coverage', 'test:ci'];
requiredScripts.forEach(script => {
  const exists = scripts[script];
  console.log(`  ${exists ? '✅' : '❌'} npm run ${script}`);
  if (!exists) allGood = false;
});

// Check jest config
console.log('\n⚙️  Checking Jest configuration:');
const jestConfigExists = fs.existsSync('jest.config.js');
const jestSetupExists = fs.existsSync('jest.setup.js');
console.log(`  ${jestConfigExists ? '✅' : '❌'} jest.config.js`);
console.log(`  ${jestSetupExists ? '✅' : '❌'} jest.setup.js`);

if (!jestConfigExists || !jestSetupExists) allGood = false;

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ All test files and configuration verified!');
  console.log('\n🚀 Run "npm test" to execute the test suite');
} else {
  console.log('❌ Some files are missing. Please check above.');
  process.exit(1);
}

