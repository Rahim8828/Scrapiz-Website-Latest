#!/usr/bin/env node

/**
 * Quick Performance Check
 * 
 * Validates that all optimization implementations are in place
 * without running full Lighthouse tests
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

console.log('🔍 Running Quick Performance Check\n');

/**
 * Check if file exists
 */
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, '..', filePath));
}

/**
 * Check file content
 */
function fileContains(filePath, searchString) {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf-8');
    return content.includes(searchString);
  } catch {
    return false;
  }
}

/**
 * Count files in directory
 */
function countFiles(dirPath, extension) {
  try {
    const files = fs.readdirSync(path.join(__dirname, '..', dirPath));
    return files.filter(f => f.endsWith(extension)).length;
  } catch {
    return 0;
  }
}

// Check 1: WebP images exist
console.log('1️⃣  Checking WebP image optimization...');
const webpCount = countFiles('public/optimized', '.webp');
if (webpCount > 50) {
  checks.passed.push(`✅ WebP images: ${webpCount} optimized images found`);
} else {
  checks.failed.push(`❌ WebP images: Only ${webpCount} images found, expected more`);
}

// Check 2: Lazy loading implementation
console.log('2️⃣  Checking lazy loading implementation...');
if (fileContains('src/components/OptimizedImage.jsx', 'loading') && 
    fileContains('src/components/OptimizedImage.jsx', 'lazy')) {
  checks.passed.push('✅ Lazy loading: Implemented in OptimizedImage component');
} else {
  checks.failed.push('❌ Lazy loading: Not found in OptimizedImage component');
}

// Check 3: Vite configuration
console.log('3️⃣  Checking Vite build configuration...');
if (fileContains('vite.config.js', 'rollupOptions')) {
  checks.passed.push('✅ Code splitting: Configured in vite.config.js');
} else {
  checks.warnings.push('⚠️  Code splitting: Check vite.config.js configuration');
}

// Check 4: Critical CSS plugin
console.log('4️⃣  Checking critical CSS setup...');
if (fileExists('vite-plugin-critters.js')) {
  checks.passed.push('✅ Critical CSS: Critters plugin configured');
} else {
  checks.failed.push('❌ Critical CSS: Critters plugin not found');
}

// Check 5: Cache headers
console.log('5️⃣  Checking cache headers configuration...');
if (fileContains('public/.htaccess', 'Cache-Control')) {
  checks.passed.push('✅ Cache headers: Configured in .htaccess');
} else {
  checks.failed.push('❌ Cache headers: Not found in .htaccess');
}

// Check 6: Compression
console.log('6️⃣  Checking compression configuration...');
if (fileContains('public/.htaccess', 'mod_deflate') || fileContains('public/.htaccess', 'mod_brotli')) {
  checks.passed.push('✅ Compression: Configured in .htaccess');
} else {
  checks.failed.push('❌ Compression: Not configured in .htaccess');
}

// Check 7: Performance monitoring
console.log('7️⃣  Checking performance monitoring...');
if (fileExists('src/components/PerformanceMonitor.jsx')) {
  checks.passed.push('✅ Performance monitoring: Component exists');
} else {
  checks.failed.push('❌ Performance monitoring: Component not found');
}

// Check 8: Lighthouse CI
console.log('8️⃣  Checking Lighthouse CI configuration...');
if (fileExists('lighthouserc.js') && fileExists('lighthouserc.mobile.js')) {
  checks.passed.push('✅ Lighthouse CI: Configured for mobile and desktop');
} else {
  checks.failed.push('❌ Lighthouse CI: Configuration files missing');
}

// Check 9: Font optimization
console.log('9️⃣  Checking font optimization...');
if (fileContains('src/index.css', 'font-display: swap')) {
  checks.passed.push('✅ Font optimization: font-display: swap configured');
} else {
  checks.warnings.push('⚠️  Font optimization: Check font-display settings');
}

// Check 10: Resource hints
console.log('🔟 Checking resource hints...');
if (fileContains('index.html', 'rel="preload"') || fileContains('index.html', 'rel="preconnect"')) {
  checks.passed.push('✅ Resource hints: Preload/preconnect configured');
} else {
  checks.warnings.push('⚠️  Resource hints: Consider adding preload/preconnect');
}

// Check 11: Image dimensions
console.log('1️⃣1️⃣  Checking image dimensions...');
if (fileContains('src/components/OptimizedImage.jsx', 'width') && fileContains('src/components/OptimizedImage.jsx', 'height')) {
  checks.passed.push('✅ Image dimensions: Width and height attributes used');
} else {
  checks.warnings.push('⚠️  Image dimensions: Verify width/height attributes');
}

// Check 12: Build output
console.log('1️⃣2️⃣  Checking build output...');
if (fileExists('dist/index.html')) {
  checks.passed.push('✅ Build output: Production build exists');
  
  // Check for hashed filenames in both dist/assets and subdirectories
  try {
    const checkHashedFiles = (dir) => {
      const files = fs.readdirSync(path.join(__dirname, '..', dir));
      return files.filter(f => /-[A-Za-z0-9_-]{8,}\.(js|css)$/.test(f));
    };
    
    let hashedFiles = [];
    if (fs.existsSync(path.join(__dirname, '..', 'dist/assets'))) {
      hashedFiles = checkHashedFiles('dist/assets');
    }
    if (hashedFiles.length === 0 && fs.existsSync(path.join(__dirname, '..', 'dist/assets/js'))) {
      hashedFiles = checkHashedFiles('dist/assets/js');
    }
    if (hashedFiles.length === 0 && fs.existsSync(path.join(__dirname, '..', 'dist/assets/css'))) {
      hashedFiles = [...hashedFiles, ...checkHashedFiles('dist/assets/css')];
    }
    
    if (hashedFiles.length > 0) {
      checks.passed.push(`✅ Cache busting: ${hashedFiles.length} files with content hashes`);
    } else {
      checks.warnings.push('⚠️  Cache busting: No hashed filenames found in dist/assets');
    }
  } catch (error) {
    checks.warnings.push('⚠️  Cache busting: Could not verify hashed filenames');
  }
} else {
  checks.warnings.push('⚠️  Build output: Run "npm run build" to generate production build');
}

// Print results
console.log('\n' + '='.repeat(80));
console.log('📊 QUICK CHECK RESULTS');
console.log('='.repeat(80));

console.log(`\n✅ Passed: ${checks.passed.length}`);
checks.passed.forEach(check => console.log(`  ${check}`));

if (checks.warnings.length > 0) {
  console.log(`\n⚠️  Warnings: ${checks.warnings.length}`);
  checks.warnings.forEach(check => console.log(`  ${check}`));
}

if (checks.failed.length > 0) {
  console.log(`\n❌ Failed: ${checks.failed.length}`);
  checks.failed.forEach(check => console.log(`  ${check}`));
}

console.log('\n' + '='.repeat(80));

if (checks.failed.length === 0) {
  console.log('✅ All critical optimizations are in place!');
  console.log('\nNext step: Run full validation with "npm run validate:performance"');
  console.log('(Make sure dev server is running: npm run dev)');
} else {
  console.log('❌ Some optimizations are missing. Please review failed checks.');
  process.exit(1);
}
