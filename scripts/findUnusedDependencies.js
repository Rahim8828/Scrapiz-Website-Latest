#!/usr/bin/env node

/**
 * Find Unused Dependencies Script
 * Scans the codebase to identify potentially unused npm packages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const PACKAGE_JSON = path.join(ROOT_DIR, 'package.json');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
const dependencies = Object.keys(packageJson.dependencies || {});

// Packages to exclude from analysis (build tools, etc.)
const EXCLUDE_PACKAGES = [
  'vite',
  'vitest',
  '@vitejs/plugin-react',
  'autoprefixer',
  'postcss',
  'tailwindcss',
  'eslint',
  'terser'
];

function scanDirectory(dir, pattern, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      scanDirectory(filePath, pattern, results);
    } else if (file.match(/\.(jsx?|tsx?)$/)) {
      const content = fs.readFileSync(filePath, 'utf8');
      results.push({ file: filePath, content });
    }
  }
  
  return results;
}

function findUnusedDependencies() {
  console.log('\n🔍 Scanning for Unused Dependencies\n');
  console.log('=' .repeat(80));
  
  const files = scanDirectory(SRC_DIR);
  const allContent = files.map(f => f.content).join('\n');
  
  const unusedDeps = [];
  const usedDeps = [];
  
  for (const dep of dependencies) {
    if (EXCLUDE_PACKAGES.includes(dep)) continue;
    
    // Check if dependency is imported anywhere
    const importPatterns = [
      new RegExp(`from ['"]${dep}['"]`, 'g'),
      new RegExp(`require\\(['"]${dep}['"]\\)`, 'g'),
      new RegExp(`import\\(['"]${dep}['"]\\)`, 'g'),
      // Check for scoped packages
      new RegExp(`from ['"]${dep.replace('/', '\\/')}`, 'g'),
    ];
    
    const isUsed = importPatterns.some(pattern => pattern.test(allContent));
    
    if (isUsed) {
      usedDeps.push(dep);
    } else {
      unusedDeps.push(dep);
    }
  }
  
  console.log(`\n📦 Total Dependencies: ${dependencies.length}`);
  console.log(`✅ Used Dependencies: ${usedDeps.length}`);
  console.log(`⚠️  Potentially Unused: ${unusedDeps.length}\n`);
  
  if (unusedDeps.length > 0) {
    console.log('⚠️  Potentially Unused Dependencies:\n');
    unusedDeps.forEach(dep => {
      console.log(`   - ${dep}`);
    });
    
    console.log('\n💡 Note: These packages might be:');
    console.log('   • Used in build configuration');
    console.log('   • Used in scripts or tests');
    console.log('   • Peer dependencies');
    console.log('   • Used indirectly by other packages');
    console.log('\n   Please verify before removing!\n');
  } else {
    console.log('✅ All dependencies appear to be in use!\n');
  }
  
  console.log('=' .repeat(80) + '\n');
}

findUnusedDependencies();
