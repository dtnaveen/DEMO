/**
 * Archive duplicate documentation files
 * Run with: node scripts/archive-duplicates.js
 */

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const archiveDir = path.join(rootDir, 'docs', 'archive');

// Files to archive (keep latest, archive older)
const filesToArchive = [
  // Hydration fixes (keep HYDRATION_DEBUG.md)
  'HYDRATION_FIX.md',
  'HYDRATION_FIX_COMPLETE.md',
  'HYDRATION_FIX_COMPLETE_V2.md',
  'HYDRATION_FIX_FINAL.md',
  'HYDRATION_FIX_FINAL_SSR_DISABLED.md',
  'HYDRATION_FIX_LANDING_PAGE.md',
  'HYDRATION_FIX_VERIFICATION.md',
  
  // Test summaries (keep FINAL_SPEED_OPTIMIZATIONS.md)
  'TEST_SUITE_SUMMARY.md',
  'TEST_SPEED_OPTIMIZATIONS.md',
  'TEST_PERFORMANCE_FIX.md',
  'QUICK_TEST_SUMMARY.md',
  'AUTOMATED_TESTS_COMPLETE.md',
  
  // Status reports (keep COMPLETE_IMPLEMENTATION_REPORT.md)
  'FINAL_STATUS_REPORT.md',
  'FINAL_IMPLEMENTATION_STATUS.md',
  'FINAL_IMPLEMENTATION_SUMMARY.md',
  
  // Error reports (keep BROWSER_ERROR_CHECK_COMPLETE.md)
  'ALL_ERRORS_FIXED.md',
  'ERROR_FIX_REPORT.md',
  'ERROR_CHECK_REPORT.md',
  'RUNTIME_ERRORS_FIXED.md',
  
  // Summaries (keep COMPREHENSIVE_AUDIT_SUMMARY.md)
  'TESTING_SUMMARY.md',
  'FINAL_TESTING_SUMMARY.md',
  'BROWSER_TEST_SUMMARY.md',
];

// Create archive directory
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
  console.log('✅ Created docs/archive/ directory');
}

let archived = 0;
let skipped = 0;

filesToArchive.forEach(file => {
  const sourcePath = path.join(rootDir, file);
  const destPath = path.join(archiveDir, file);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.renameSync(sourcePath, destPath);
      console.log(`✅ Archived: ${file}`);
      archived++;
    } catch (error) {
      console.log(`❌ Failed to archive ${file}: ${error.message}`);
    }
  } else {
    skipped++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`  ✅ Archived: ${archived} files`);
console.log(`  ⏭️  Skipped: ${skipped} files (not found)`);
console.log(`\n💡 Files moved to: docs/archive/`);

