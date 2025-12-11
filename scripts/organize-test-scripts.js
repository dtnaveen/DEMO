/**
 * Organize test scripts into scripts/test/ directory
 * Run with: node scripts/organize-test-scripts.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const testScriptsDir = path.join(rootDir, 'scripts', 'test');

// Test scripts to move
const testScripts = [
  'auto-test-login.js',
  'auto-test-premium-login.js',
  'browser-test-gps.js',
  'browser-test-login.js',
  'check-errors.js',
  'inject-test-user.js',
  'set-test-user.js',
  'test-audit.js',
  'test-bot-console.js',
  'test-bot-sexual-chat.js',
  'test-gps-browser-console.js',
  'test-gps-complete.js',
  'test-gps-filtering.js',
  'test-premium-features.js',
  'test-subscription.js',
  'test-validation-script.js',
  'verify-gps-in-browser.js',
  'verify-tests.js',
];

// Create scripts/test directory
if (!fs.existsSync(testScriptsDir)) {
  fs.mkdirSync(testScriptsDir, { recursive: true });
  console.log('✅ Created scripts/test/ directory');
}

let moved = 0;
let skipped = 0;

testScripts.forEach(script => {
  const sourcePath = path.join(rootDir, script);
  const destPath = path.join(testScriptsDir, script);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.renameSync(sourcePath, destPath);
      console.log(`✅ Moved: ${script}`);
      moved++;
    } catch (error) {
      console.log(`❌ Failed to move ${script}: ${error.message}`);
    }
  } else {
    skipped++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`  ✅ Moved: ${moved} scripts`);
console.log(`  ⏭️  Skipped: ${skipped} scripts (not found)`);
console.log(`\n💡 Scripts moved to: scripts/test/`);

