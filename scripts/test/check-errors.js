/**
 * Error Check Script for VibeMatch
 * Run this to check for common errors
 */

console.log('🔍 Checking for errors...\n');

const fs = require('fs');
const path = require('path');

const errors = [];
const warnings = [];

// Check if all required files exist
const requiredFiles = [
  'app/layout.js',
  'app/page.js',
  'components/ErrorBoundary.js',
  'components/Navigation.js',
  'app/help/page.js',
  'jest.config.js',
  'jest.setup.js'
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    errors.push(`Missing file: ${file}`);
    console.log(`  ❌ ${file} - MISSING`);
  }
});

// Check for common import issues
console.log('\n📦 Checking imports...');
const checkImports = (filePath, content) => {
  const importRegex = /import\s+.*\s+from\s+['"]([^'"]+)['"]/g;
  const imports = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  imports.forEach(imp => {
    // Check for @/ aliases
    if (imp.startsWith('@/')) {
      const relativePath = imp.replace('@/', '');
      const fullPath = path.join(process.cwd(), relativePath);
      
      // Check if it's a directory (needs /index.js or page.js)
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        const hasIndex = fs.existsSync(path.join(fullPath, 'index.js')) ||
                        fs.existsSync(path.join(fullPath, 'page.js'));
        if (!hasIndex) {
          warnings.push(`Possible import issue in ${filePath}: ${imp} (directory without index)`);
        }
      } else if (!fs.existsSync(fullPath + '.js') && !fs.existsSync(fullPath + '.jsx')) {
        // Check if file exists
        if (!fs.existsSync(fullPath)) {
          warnings.push(`Possible missing import in ${filePath}: ${imp}`);
        }
      }
    }
  });
};

// Check key files
const keyFiles = [
  'app/layout.js',
  'app/help/page.js',
  'components/ErrorBoundary.js',
  'components/Navigation.js'
];

keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      checkImports(file, content);
      console.log(`  ✅ ${file} - imports checked`);
    } catch (err) {
      errors.push(`Error reading ${file}: ${err.message}`);
      console.log(`  ❌ ${file} - ${err.message}`);
    }
  }
});

// Check package.json scripts
console.log('\n📜 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['dev', 'build', 'test'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`  ✅ Script '${script}' exists`);
    } else {
      errors.push(`Missing script: ${script}`);
      console.log(`  ❌ Script '${script}' - MISSING`);
    }
  });
} catch (err) {
  errors.push(`Error reading package.json: ${err.message}`);
}

// Summary
console.log('\n📊 Summary:');
console.log(`  Errors: ${errors.length}`);
console.log(`  Warnings: ${warnings.length}\n`);

if (errors.length > 0) {
  console.log('❌ ERRORS FOUND:');
  errors.forEach(err => console.log(`  - ${err}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(warn => console.log(`  - ${warn}`));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ No errors found!');
}

process.exit(errors.length > 0 ? 1 : 0);

