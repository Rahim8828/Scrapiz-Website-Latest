#!/usr/bin/env node

/**
 * Test Lighthouse CI Setup
 * 
 * This script verifies that Lighthouse CI is properly configured.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🔍 Testing Lighthouse CI Setup...\n');

const checks = [];

// Check 1: Lighthouse CI package installed
console.log('1️⃣  Checking if @lhci/cli is installed...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.devDependencies['@lhci/cli']) {
    console.log('   ✅ @lhci/cli is installed\n');
    checks.push(true);
  } else {
    console.log('   ❌ @lhci/cli is not installed\n');
    checks.push(false);
  }
} catch (error) {
  console.log('   ❌ Error reading package.json\n');
  checks.push(false);
}

// Check 2: Configuration files exist
console.log('2️⃣  Checking configuration files...');
const configFiles = [
  'lighthouserc.js',
  'lighthouserc.mobile.js',
  'performance-budgets.json',
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
    checks.push(true);
  } else {
    console.log(`   ❌ ${file} missing`);
    checks.push(false);
  }
});
console.log('');

// Check 3: NPM scripts configured
console.log('3️⃣  Checking NPM scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = [
    'lhci:collect',
    'lhci:assert',
    'lhci:upload',
    'lhci:desktop',
    'lhci:mobile',
    'lhci:full',
  ];

  requiredScripts.forEach(script => {
    if (packageJson.scripts[script]) {
      console.log(`   ✅ ${script} configured`);
      checks.push(true);
    } else {
      console.log(`   ❌ ${script} missing`);
      checks.push(false);
    }
  });
  console.log('');
} catch (error) {
  console.log('   ❌ Error reading package.json\n');
  checks.push(false);
}

// Check 4: GitHub Actions workflow exists
console.log('4️⃣  Checking GitHub Actions workflow...');
if (fs.existsSync('.github/workflows/lighthouse-ci.yml')) {
  console.log('   ✅ GitHub Actions workflow exists\n');
  checks.push(true);
} else {
  console.log('   ❌ GitHub Actions workflow missing\n');
  checks.push(false);
}

// Check 5: Documentation exists
console.log('5️⃣  Checking documentation...');
const docFiles = [
  'docs/LIGHTHOUSE_CI_GUIDE.md',
  'docs/LIGHTHOUSE_CI_QUICK_REFERENCE.md',
  'LIGHTHOUSE_CI_SETUP.md',
];

docFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
    checks.push(true);
  } else {
    console.log(`   ❌ ${file} missing`);
    checks.push(false);
  }
});
console.log('');

// Check 6: Lighthouse CI command available
console.log('6️⃣  Checking if lhci command is available...');
try {
  const result = execSync('npm list @lhci/cli', { encoding: 'utf8' });
  if (result.includes('@lhci/cli')) {
    console.log('   ✅ lhci command is available\n');
    checks.push(true);
  } else {
    console.log('   ❌ lhci command not available\n');
    checks.push(false);
  }
} catch (error) {
  console.log('   ❌ lhci command not available\n');
  checks.push(false);
}

// Check 7: Build directory exists
console.log('7️⃣  Checking if build exists...');
if (fs.existsSync('dist')) {
  console.log('   ✅ dist directory exists\n');
  checks.push(true);
} else {
  console.log('   ⚠️  dist directory not found (run npm run build first)\n');
  checks.push(true); // Not a failure, just a warning
}

// Summary
console.log('━'.repeat(50));
const passed = checks.filter(c => c).length;
const total = checks.length;

if (passed === total) {
  console.log(`✅ All checks passed! (${passed}/${total})`);
  console.log('━'.repeat(50));
  console.log('\n🚀 Lighthouse CI is ready to use!');
  console.log('\nNext steps:');
  console.log('  1. Build the site: npm run build');
  console.log('  2. Run tests: npm run lhci:desktop');
  console.log('  3. View results in .lighthouseci/ directory');
  console.log('\n📖 See LIGHTHOUSE_CI_SETUP.md for more information\n');
  process.exit(0);
} else {
  console.log(`❌ Some checks failed (${passed}/${total})`);
  console.log('━'.repeat(50));
  console.log('\n⚠️  Please review the errors above and fix them.\n');
  process.exit(1);
}
