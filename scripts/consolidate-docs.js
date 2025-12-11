/**
 * Script to identify duplicate documentation files
 * Run with: node scripts/consolidate-docs.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const docsDir = rootDir;

// Categories of duplicate files
const categories = {
  hydration: [
    'HYDRATION_FIX.md',
    'HYDRATION_FIX_COMPLETE.md',
    'HYDRATION_FIX_COMPLETE_V2.md',
    'HYDRATION_FIX_FINAL.md',
    'HYDRATION_FIX_FINAL_SSR_DISABLED.md',
    'HYDRATION_FIX_LANDING_PAGE.md',
    'HYDRATION_FIX_VERIFICATION.md',
    'HYDRATION_DEBUG.md',
  ],
  test: [
    'TEST_SUITE_SUMMARY.md',
    'TEST_SPEED_OPTIMIZATIONS.md',
    'TEST_PERFORMANCE_FIX.md',
    'QUICK_TEST_SUMMARY.md',
    'AUTOMATED_TESTS_COMPLETE.md',
    'FINAL_SPEED_OPTIMIZATIONS.md',
  ],
  status: [
    'FINAL_STATUS_REPORT.md',
    'FINAL_IMPLEMENTATION_STATUS.md',
    'FINAL_IMPLEMENTATION_SUMMARY.md',
    'COMPLETE_IMPLEMENTATION_REPORT.md',
  ],
  error: [
    'ALL_ERRORS_FIXED.md',
    'ERROR_FIX_REPORT.md',
    'ERROR_CHECK_REPORT.md',
    'RUNTIME_ERRORS_FIXED.md',
    'BROWSER_ERROR_CHECK_COMPLETE.md',
  ],
  summary: [
    'TESTING_SUMMARY.md',
    'FINAL_TESTING_SUMMARY.md',
    'BROWSER_TEST_SUMMARY.md',
    'COMPREHENSIVE_AUDIT_SUMMARY.md',
  ]
};

console.log('📋 Duplicate Documentation Files Analysis\n');

let totalDuplicates = 0;

Object.entries(categories).forEach(([category, files]) => {
  const existing = files.filter(f => fs.existsSync(path.join(docsDir, f)));
  if (existing.length > 1) {
    console.log(`\n${category.toUpperCase()}:`);
    existing.forEach(f => console.log(`  - ${f}`));
    console.log(`  → Keep: ${existing[existing.length - 1]}`);
    console.log(`  → Archive: ${existing.slice(0, -1).join(', ')}`);
    totalDuplicates += existing.length - 1;
  }
});

console.log(`\n📊 Total duplicate files: ${totalDuplicates}`);
console.log('\n💡 Recommendation: Archive old files to docs/archive/');

