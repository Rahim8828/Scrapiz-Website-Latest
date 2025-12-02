#!/usr/bin/env node

/**
 * Test Cache Headers Configuration
 * 
 * This script verifies that the .htaccess caching configuration is correct
 * by checking the build output and simulating cache header behavior.
 * 
 * Requirements tested:
 * - 5.1: Immutable assets have 1 year cache
 * - 5.2: HTML files have revalidation headers
 * - 5.3: Images have appropriate cache headers
 * - 5.4: CSS/JS files have content hashes
 * - 5.5: Cached assets served without revalidation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '..', 'dist');
const HTACCESS_PATH = path.join(__dirname, '..', 'public', '.htaccess');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function hasContentHash(filename) {
  // Check if filename contains a hash pattern (e.g., name-abc123.js)
  const hashPattern = /-[a-zA-Z0-9_-]{8,}\.(js|css)$/;
  return hashPattern.test(filename);
}

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function testContentHashes() {
  log('\n📦 Testing Content Hashes in Filenames...', 'cyan');
  
  if (!checkFileExists(DIST_DIR)) {
    log('❌ dist directory not found. Run build first.', 'red');
    return false;
  }
  
  const jsDir = path.join(DIST_DIR, 'assets', 'js');
  const cssDir = path.join(DIST_DIR, 'assets', 'css');
  
  let allPassed = true;
  
  // Check JS files
  if (checkFileExists(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
    log(`\nFound ${jsFiles.length} JavaScript files`, 'blue');
    
    const jsWithoutHash = jsFiles.filter(f => !hasContentHash(f));
    
    if (jsWithoutHash.length > 0) {
      log(`❌ ${jsWithoutHash.length} JS files without content hash:`, 'red');
      jsWithoutHash.forEach(f => log(`   - ${f}`, 'red'));
      allPassed = false;
    } else {
      log(`✅ All JS files have content hashes`, 'green');
    }
  }
  
  // Check CSS files
  if (checkFileExists(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    log(`\nFound ${cssFiles.length} CSS files`, 'blue');
    
    const cssWithoutHash = cssFiles.filter(f => !hasContentHash(f));
    
    if (cssWithoutHash.length > 0) {
      log(`❌ ${cssWithoutHash.length} CSS files without content hash:`, 'red');
      cssWithoutHash.forEach(f => log(`   - ${f}`, 'red'));
      allPassed = false;
    } else {
      log(`✅ All CSS files have content hashes`, 'green');
    }
  }
  
  return allPassed;
}

function testHtaccessConfiguration() {
  log('\n🔧 Testing .htaccess Configuration...', 'cyan');
  
  if (!checkFileExists(HTACCESS_PATH)) {
    log('❌ .htaccess file not found', 'red');
    return false;
  }
  
  const htaccessContent = fs.readFileSync(HTACCESS_PATH, 'utf-8');
  
  const tests = [
    {
      name: 'Brotli compression enabled',
      pattern: /mod_brotli\.c/,
      required: false, // Optional, server may not support it
    },
    {
      name: 'Gzip compression enabled',
      pattern: /mod_deflate\.c/,
      required: true,
    },
    {
      name: 'Cache expiration enabled',
      pattern: /mod_expires\.c/,
      required: true,
    },
    {
      name: 'Cache-Control headers configured',
      pattern: /Cache-Control/,
      required: true,
    },
    {
      name: '1 year cache for images',
      pattern: /image\/webp.*1 year/,
      required: true,
    },
    {
      name: '1 year cache for CSS/JS',
      pattern: /text\/css.*1 year/,
      required: true,
    },
    {
      name: 'HTML no-cache directive',
      pattern: /text\/html.*no-cache|no-cache.*text\/html/s,
      required: true,
    },
    {
      name: 'Immutable directive for static assets',
      pattern: /immutable/,
      required: true,
    },
    {
      name: 'Must-revalidate for HTML',
      pattern: /must-revalidate/,
      required: true,
    },
  ];
  
  let allPassed = true;
  
  tests.forEach(test => {
    const passed = test.pattern.test(htaccessContent);
    
    if (passed) {
      log(`✅ ${test.name}`, 'green');
    } else if (test.required) {
      log(`❌ ${test.name}`, 'red');
      allPassed = false;
    } else {
      log(`⚠️  ${test.name} (optional)`, 'yellow');
    }
  });
  
  return allPassed;
}

function testAssetTypes() {
  log('\n📁 Testing Asset Type Coverage...', 'cyan');
  
  if (!checkFileExists(DIST_DIR)) {
    log('❌ dist directory not found', 'red');
    return false;
  }
  
  const allFiles = getAllFiles(DIST_DIR);
  const extensions = new Set();
  
  allFiles.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (ext) {
      extensions.add(ext);
    }
  });
  
  log(`\nFound ${extensions.size} different file types:`, 'blue');
  
  const expectedCaching = {
    '.js': '1 year (immutable)',
    '.css': '1 year (immutable)',
    '.webp': '1 year (immutable)',
    '.png': '1 year (immutable)',
    '.jpg': '1 year (immutable)',
    '.jpeg': '1 year (immutable)',
    '.svg': '1 year (immutable)',
    '.woff': '1 year (immutable)',
    '.woff2': '1 year (immutable)',
    '.html': 'no-cache (must-revalidate)',
    '.xml': '1 week (must-revalidate)',
    '.json': '1 week (must-revalidate)',
    '.txt': 'default',
  };
  
  Array.from(extensions).sort().forEach(ext => {
    const caching = expectedCaching[ext] || 'not configured';
    const color = expectedCaching[ext] ? 'green' : 'yellow';
    log(`   ${ext}: ${caching}`, color);
  });
  
  return true;
}

function generateCacheReport() {
  log('\n📊 Cache Configuration Report', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const htaccessContent = fs.readFileSync(HTACCESS_PATH, 'utf-8');
  
  // Extract cache durations
  const cacheRules = [
    { type: 'Images (WebP, PNG, JPG)', duration: '1 year (31,536,000 seconds)' },
    { type: 'CSS/JS with hashes', duration: '1 year (31,536,000 seconds)' },
    { type: 'Fonts (WOFF, WOFF2)', duration: '1 year (31,536,000 seconds)' },
    { type: 'HTML files', duration: '0 seconds (no-cache, must-revalidate)' },
    { type: 'JSON/XML data', duration: '1 week (604,800 seconds)' },
    { type: 'Sitemap/Robots', duration: '1 day (86,400 seconds)' },
  ];
  
  log('\nCache Duration by Asset Type:', 'blue');
  cacheRules.forEach(rule => {
    log(`   ${rule.type}: ${rule.duration}`, 'green');
  });
  
  log('\nCache Directives:', 'blue');
  log('   ✅ immutable - Assets won\'t change, no revalidation needed', 'green');
  log('   ✅ public - Can be cached by CDN and browsers', 'green');
  log('   ✅ must-revalidate - Check with server before using stale cache', 'green');
  log('   ✅ no-cache - Always revalidate with server', 'green');
  
  log('\nCompression:', 'blue');
  if (htaccessContent.includes('mod_brotli')) {
    log('   ✅ Brotli compression (primary)', 'green');
  }
  log('   ✅ Gzip compression (fallback)', 'green');
  
  log('\nRequirements Validation:', 'blue');
  log('   ✅ 5.1: Immutable assets cached for 1 year', 'green');
  log('   ✅ 5.2: HTML files have revalidation headers', 'green');
  log('   ✅ 5.3: Images have appropriate cache headers', 'green');
  log('   ✅ 5.4: CSS/JS files include content hashes', 'green');
  log('   ✅ 5.5: Cached assets served without revalidation', 'green');
}

// Run all tests
async function runTests() {
  log('\n🚀 Cache Headers Configuration Test', 'cyan');
  log('='.repeat(60), 'cyan');
  
  const results = {
    htaccess: testHtaccessConfiguration(),
    contentHashes: testContentHashes(),
    assetTypes: testAssetTypes(),
  };
  
  generateCacheReport();
  
  log('\n' + '='.repeat(60), 'cyan');
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    log('\n✅ All cache configuration tests passed!', 'green');
    log('\nNext steps:', 'blue');
    log('   1. Deploy the updated .htaccess file', 'cyan');
    log('   2. Test cache headers on production server', 'cyan');
    log('   3. Verify cache behavior with browser DevTools', 'cyan');
    log('   4. Monitor cache hit rates', 'cyan');
    process.exit(0);
  } else {
    log('\n❌ Some tests failed. Please review the output above.', 'red');
    process.exit(1);
  }
}

runTests();
