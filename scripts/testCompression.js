#!/usr/bin/env node

/**
 * Compression Testing Script
 * 
 * This script verifies that Brotli and Gzip compression are properly configured
 * and tests compression ratios for various file types.
 * 
 * Requirements: 8.2 - Enable Gzip or Brotli compression for all text-based resources
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gzip = promisify(zlib.gzip);
const brotliCompress = promisify(zlib.brotliCompress);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate compression ratio as percentage
 */
function calculateCompressionRatio(original, compressed) {
  return ((1 - compressed / original) * 100).toFixed(2);
}

/**
 * Test compression for a single file
 */
async function testFileCompression(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    const originalSize = content.length;

    // Test Gzip compression
    const gzipCompressed = await gzip(content, { level: 9 });
    const gzipSize = gzipCompressed.length;
    const gzipRatio = calculateCompressionRatio(originalSize, gzipSize);

    // Test Brotli compression
    const brotliCompressed = await brotliCompress(content, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11
      }
    });
    const brotliSize = brotliCompressed.length;
    const brotliRatio = calculateCompressionRatio(originalSize, brotliSize);

    return {
      file: path.basename(filePath),
      originalSize,
      gzipSize,
      gzipRatio,
      brotliSize,
      brotliRatio,
      success: true
    };
  } catch (error) {
    return {
      file: path.basename(filePath),
      error: error.message,
      success: false
    };
  }
}

/**
 * Find files in dist directory by extension
 */
function findFilesByExtension(dir, extensions) {
  const files = [];
  
  function traverse(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Verify .htaccess compression configuration
 */
function verifyHtaccessConfig() {
  const htaccessPath = path.join(__dirname, '../public/.htaccess');
  
  if (!fs.existsSync(htaccessPath)) {
    return {
      success: false,
      message: '.htaccess file not found'
    };
  }

  const content = fs.readFileSync(htaccessPath, 'utf-8');
  
  const checks = {
    brotli: content.includes('mod_brotli.c') && content.includes('BROTLI_COMPRESS'),
    gzip: content.includes('mod_deflate.c') && content.includes('DEFLATE'),
    textHtml: content.includes('text/html'),
    textCss: content.includes('text/css'),
    textJavascript: content.includes('text/javascript'),
    applicationJavascript: content.includes('application/javascript'),
    applicationJson: content.includes('application/json'),
    imageSvg: content.includes('image/svg+xml')
  };

  const allPassed = Object.values(checks).every(v => v);

  return {
    success: allPassed,
    checks,
    message: allPassed 
      ? 'All compression configurations found in .htaccess'
      : 'Some compression configurations missing in .htaccess'
  };
}

/**
 * Main test function
 */
async function runCompressionTests() {
  console.log(`${colors.bright}${colors.blue}==============================================`);
  console.log(`  COMPRESSION TESTING SCRIPT`);
  console.log(`==============================================${colors.reset}\n`);

  // Step 1: Verify .htaccess configuration
  console.log(`${colors.bright}Step 1: Verifying .htaccess Configuration${colors.reset}`);
  console.log('─'.repeat(50));
  
  const htaccessCheck = verifyHtaccessConfig();
  
  if (htaccessCheck.success) {
    console.log(`${colors.green}✓ ${htaccessCheck.message}${colors.reset}`);
    console.log(`\n${colors.cyan}Configuration checks:${colors.reset}`);
    console.log(`  • Brotli module: ${htaccessCheck.checks.brotli ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  • Gzip module: ${htaccessCheck.checks.gzip ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  • HTML compression: ${htaccessCheck.checks.textHtml ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  • CSS compression: ${htaccessCheck.checks.textCss ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  • JavaScript compression: ${htaccessCheck.checks.textJavascript ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  • JSON compression: ${htaccessCheck.checks.applicationJson ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
    console.log(`  • SVG compression: ${htaccessCheck.checks.imageSvg ? colors.green + '✓' : colors.red + '✗'}${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ ${htaccessCheck.message}${colors.reset}`);
  }

  // Step 2: Test compression on built files
  console.log(`\n${colors.bright}Step 2: Testing Compression on Built Files${colors.reset}`);
  console.log('─'.repeat(50));

  const distDir = path.join(__dirname, '../dist');
  
  if (!fs.existsSync(distDir)) {
    console.log(`${colors.yellow}⚠ Warning: dist directory not found. Run 'npm run build' first.${colors.reset}`);
    console.log(`${colors.cyan}ℹ Skipping file compression tests.${colors.reset}\n`);
  } else {
    // Find text-based files to test
    const textExtensions = ['.html', '.css', '.js', '.json', '.xml', '.svg', '.txt'];
    const filesToTest = findFilesByExtension(distDir, textExtensions);

    if (filesToTest.length === 0) {
      console.log(`${colors.yellow}⚠ No text-based files found in dist directory${colors.reset}\n`);
    } else {
      console.log(`${colors.cyan}Found ${filesToTest.length} text-based files to test${colors.reset}\n`);

      const results = [];
      
      // Test a sample of files (limit to 10 for readability)
      const samplesToTest = filesToTest.slice(0, 10);
      
      for (const file of samplesToTest) {
        const result = await testFileCompression(file);
        results.push(result);
      }

      // Display results in a table format
      console.log(`${colors.bright}Compression Results:${colors.reset}`);
      console.log('─'.repeat(100));
      console.log(
        `${'File'.padEnd(30)} | ` +
        `${'Original'.padEnd(12)} | ` +
        `${'Gzip'.padEnd(12)} | ` +
        `${'Gzip %'.padEnd(10)} | ` +
        `${'Brotli'.padEnd(12)} | ` +
        `${'Brotli %'.padEnd(10)}`
      );
      console.log('─'.repeat(100));

      let totalOriginal = 0;
      let totalGzip = 0;
      let totalBrotli = 0;

      for (const result of results) {
        if (result.success) {
          totalOriginal += result.originalSize;
          totalGzip += result.gzipSize;
          totalBrotli += result.brotliSize;

          const fileName = result.file.length > 28 ? result.file.substring(0, 25) + '...' : result.file;
          
          console.log(
            `${fileName.padEnd(30)} | ` +
            `${formatBytes(result.originalSize).padEnd(12)} | ` +
            `${formatBytes(result.gzipSize).padEnd(12)} | ` +
            `${(result.gzipRatio + '%').padEnd(10)} | ` +
            `${formatBytes(result.brotliSize).padEnd(12)} | ` +
            `${(result.brotliRatio + '%').padEnd(10)}`
          );
        } else {
          console.log(`${colors.red}${result.file}: Error - ${result.error}${colors.reset}`);
        }
      }

      console.log('─'.repeat(100));

      // Calculate average compression ratios
      const avgGzipRatio = calculateCompressionRatio(totalOriginal, totalGzip);
      const avgBrotliRatio = calculateCompressionRatio(totalOriginal, totalBrotli);

      console.log(
        `${'TOTAL'.padEnd(30)} | ` +
        `${formatBytes(totalOriginal).padEnd(12)} | ` +
        `${formatBytes(totalGzip).padEnd(12)} | ` +
        `${(avgGzipRatio + '%').padEnd(10)} | ` +
        `${formatBytes(totalBrotli).padEnd(12)} | ` +
        `${(avgBrotliRatio + '%').padEnd(10)}`
      );
      console.log('─'.repeat(100));

      if (filesToTest.length > samplesToTest.length) {
        console.log(`${colors.cyan}\nℹ Showing ${samplesToTest.length} of ${filesToTest.length} files${colors.reset}`);
      }
    }
  }

  // Step 3: Summary and recommendations
  console.log(`\n${colors.bright}Step 3: Summary${colors.reset}`);
  console.log('─'.repeat(50));

  if (htaccessCheck.success) {
    console.log(`${colors.green}✓ Compression is properly configured${colors.reset}`);
    console.log(`${colors.cyan}  • Brotli compression enabled for modern browsers${colors.reset}`);
    console.log(`${colors.cyan}  • Gzip compression enabled as fallback${colors.reset}`);
    console.log(`${colors.cyan}  • All text-based resources will be compressed${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Compression configuration needs attention${colors.reset}`);
  }

  console.log(`\n${colors.bright}Recommendations:${colors.reset}`);
  console.log(`  1. Ensure mod_deflate and mod_brotli are enabled on your server`);
  console.log(`  2. Test compression on production using browser DevTools Network tab`);
  console.log(`  3. Verify 'Content-Encoding: br' or 'Content-Encoding: gzip' headers`);
  console.log(`  4. Monitor compression ratios for performance improvements`);

  console.log(`\n${colors.bright}${colors.blue}==============================================`);
  console.log(`  COMPRESSION TEST COMPLETE`);
  console.log(`==============================================${colors.reset}\n`);
}

// Run the tests
runCompressionTests().catch(error => {
  console.error(`${colors.red}Error running compression tests:${colors.reset}`, error);
  process.exit(1);
});
