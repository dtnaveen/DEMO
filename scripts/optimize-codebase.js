/**
 * Codebase Optimization Script
 * Identifies and helps fix:
 * - Duplicate files
 * - Unnecessary files
 * - Files that can be merged
 * - Deprecated code
 */

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const archiveDir = path.join(rootDir, 'docs', 'archive');

// Files to archive (duplicate documentation)
const docsToArchive = [
  // Keep: GEOLOCATION_ERROR_FIX.md, LOGO_REDESIGN_SUMMARY.md
  'HYDRATION_FIX_COMPLETE.md',
  'HYDRATION_DEBUG.md',
  'LOGIN_FIX.md',
  'LOGIN_FIX_SUMMARY.md',
  'LOGIN_DEBUG_STATUS.md',
  'LOGIN_PAGE_REWRITE.md',
  'LOGIN_TEST_COMPLETE.md',
  'LOGIN_TEST_SUMMARY.md',
  'FINAL_LOGIN_TEST_REPORT.md',
  'TEST_ALL_LOGINS.md',
  'TEST_LOGINS_NOW.md',
  'FINAL_TEST_RESULTS.md',
  'COMPLETE_TEST_RESULTS.md',
  'COMPREHENSIVE_TEST_RESULTS.md',
  'COMPLETE_USER_TESTING_RESULTS.md',
  'FINAL_COMPLETE_TESTING_REPORT.md',
  'TESTING_STATUS.md',
  'TESTING_STATUS_REPORT.md',
  'TESTING_VALIDATION.md',
  'TESTING_INSTRUCTIONS.md',
  'QUICK_START_TESTING.md',
  'MANUAL_TESTING_INSTRUCTIONS.md',
  'TEST_EXECUTION_SUMMARY.md',
  'COMPLETE_TEST_VALIDATION.md',
  'FINAL_VALIDATION_SUMMARY.md',
  'VALIDATION_COMPLETE.md',
  'VALIDATION_RESULTS.md',
  'VERIFICATION_REPORT.md',
  'FINAL_CODE_VALIDATION.md',
  'COMPLETE_VALIDATION_REPORT.md',
  'END_TO_END_TEST_PLAN.md',
  'COMPREHENSIVE_TEST_PLAN.md',
  'BROWSER_TESTING_GUIDE.md',
  'MASTER_TESTING_SUMMARY.md',
  'COMPLETE_TESTING_GUIDE.md',
  'TURBOPACK_FIX.md',
  'SERVICE_WORKER_FIX.md',
  'FIX_SERVICE_WORKER_AND_FAVICON.md',
  'WEBSOCKET_HMR_FIX.md',
  'ERROR_FIX_REPORT.md',
  'BROWSER_ERROR_CHECK_COMPLETE.md',
  'FINAL_OPTIMIZATION_REPORT.md',
  'FINAL_OPTIMIZATION_AND_INTEGRATION.md',
  'COMPREHENSIVE_OPTIMIZATION_REPORT.md',
  'OPTIMIZATION_SUMMARY.md',
  'CODEBASE_OPTIMIZATION_PLAN.md',
  'FINAL_SPEED_OPTIMIZATIONS.md',
  'CLEANUP_REPORT.md',
  'CODE_AUDIT_REPORT.md',
  'COMPREHENSIVE_AUDIT_SUMMARY.md',
  'ONBOARDING_COMPLETE_REPORT.md',
  'DESIGN_REDESIGN_REPORT.md',
  'TRENDY_DESIGN_FEATURES.md',
  'TASK_COMPLETION_REPORT.md',
  'IMPLEMENTATION_SUMMARY.md',
  'COMPLETE_IMPLEMENTATION_REPORT.md',
  'COMPLETE_INTEGRATION_SUMMARY.md',
  'INTEGRATION_GUIDE.md',
  'ROADMAP_IMPLEMENTATION_STATUS.md',
  'READY_FOR_TESTING.md',
  'READY_TO_TEST.md',
  'SERVER_RUNNING.md',
  'SERVER_STATUS.md',
  'SERVER_TROUBLESHOOTING.md',
  'START_SERVER.md',
  'QUICK_START.md',
  'STEP_BY_STEP_GUIDE.md',
  'QUICK_TEST_RESULTS.md',
  'GPS_TEST_RESULTS.md',
  'GPS_TEST_VERIFICATION.md',
  'GPS_TESTING_CHECKLIST.md',
  'GPS_TESTING_COMPLETE.md',
  'COMPLETE_GPS_TEST.md',
  'GPS_FILTER_IMPLEMENTATION.md',
  'GPS_TESTING_GUIDE.md',
  'ADVANCED_GPS_INTEGRATION.md',
  'ADVANCED_GPS_INTEGRATION_COMPLETE.md',
  'NON_CRITICAL_ERRORS_GUIDE.md',
  'WEBSITE_AUDIT_REPORT.md'
];

// Test scripts to move to scripts/test/
const testScriptsToMove = [
  'test-all-logins.js',
  'test-all-logins-and-features.js',
  'test-login-debug.html'
];

// Batch files to consolidate (keep RUN.bat, remove others)
const batchFilesToRemove = [
  'START_NOW.bat',
  'start-server.bat'
];

console.log('🔍 Codebase Optimization Analysis\n');
console.log('================================\n');

// Create archive directory
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
  console.log('✅ Created docs/archive/ directory\n');
}

let archived = 0;
let moved = 0;
let removed = 0;

// Archive duplicate documentation
console.log('📁 Archiving duplicate documentation files...\n');
docsToArchive.forEach(file => {
  const sourcePath = path.join(rootDir, file);
  const destPath = path.join(archiveDir, file);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.renameSync(sourcePath, destPath);
      console.log(`  ✅ Archived: ${file}`);
      archived++;
    } catch (error) {
      console.log(`  ❌ Failed: ${file} - ${error.message}`);
    }
  }
});

// Move test scripts
console.log('\n📦 Moving test scripts to scripts/test/...\n');
const scriptsTestDir = path.join(rootDir, 'scripts', 'test');
if (!fs.existsSync(scriptsTestDir)) {
  fs.mkdirSync(scriptsTestDir, { recursive: true });
}

testScriptsToMove.forEach(file => {
  const sourcePath = path.join(rootDir, file);
  const destPath = path.join(scriptsTestDir, file);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.renameSync(sourcePath, destPath);
      console.log(`  ✅ Moved: ${file}`);
      moved++;
    } catch (error) {
      console.log(`  ❌ Failed: ${file} - ${error.message}`);
    }
  }
});

// Remove duplicate batch files
console.log('\n🗑️  Removing duplicate batch files...\n');
batchFilesToRemove.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`  ✅ Removed: ${file}`);
      removed++;
    } catch (error) {
      console.log(`  ❌ Failed: ${file} - ${error.message}`);
    }
  }
});

console.log('\n================================');
console.log('📊 Optimization Summary:');
console.log('================================');
console.log(`  📁 Archived docs: ${archived}`);
console.log(`  📦 Moved scripts: ${moved}`);
console.log(`  🗑️  Removed files: ${removed}`);
console.log('\n✅ Optimization complete!\n');

