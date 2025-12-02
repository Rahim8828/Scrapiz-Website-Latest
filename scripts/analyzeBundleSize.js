#!/usr/bin/env node

/**
 * Bundle Size Analysis Script
 * Analyzes the Vite build output to identify optimization opportunities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const SIZE_LIMIT_KB = 200;

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      analyzeDirectory(filePath, results);
    } else if (file.endsWith('.js')) {
      const size = getFileSize(filePath);
      const sizeKB = size / 1024;
      results.push({
        file: path.relative(DIST_DIR, filePath),
        size,
        sizeKB,
        exceedsLimit: sizeKB > SIZE_LIMIT_KB
      });
    }
  }
  
  return results;
}

function generateReport() {
  console.log('\n📊 Bundle Size Analysis Report\n');
  console.log('=' .repeat(80));
  
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ Error: dist directory not found. Please run "npm run build" first.');
    process.exit(1);
  }
  
  const results = analyzeDirectory(DIST_DIR);
  
  // Sort by size descending
  results.sort((a, b) => b.size - a.size);
  
  // Calculate totals
  const totalSize = results.reduce((sum, item) => sum + item.size, 0);
  const chunksExceedingLimit = results.filter(item => item.exceedsLimit);
  
  console.log(`\n📦 Total JavaScript Size: ${formatBytes(totalSize)}`);
  console.log(`📄 Total Chunks: ${results.length}`);
  console.log(`⚠️  Chunks Exceeding ${SIZE_LIMIT_KB}KB: ${chunksExceedingLimit.length}\n`);
  
  // Show largest chunks
  console.log('🔝 Top 10 Largest Chunks:\n');
  console.log('File'.padEnd(60) + 'Size'.padStart(15) + 'Status'.padStart(10));
  console.log('-'.repeat(85));
  
  results.slice(0, 10).forEach(item => {
    const status = item.exceedsLimit ? '⚠️  LARGE' : '✅ OK';
    console.log(
      item.file.padEnd(60) + 
      formatBytes(item.size).padStart(15) + 
      status.padStart(10)
    );
  });
  
  // Show chunks exceeding limit
  if (chunksExceedingLimit.length > 0) {
    console.log(`\n⚠️  Chunks Exceeding ${SIZE_LIMIT_KB}KB Limit:\n`);
    console.log('File'.padEnd(60) + 'Size'.padStart(15) + 'Over Limit'.padStart(15));
    console.log('-'.repeat(90));
    
    chunksExceedingLimit.forEach(item => {
      const overLimit = item.sizeKB - SIZE_LIMIT_KB;
      console.log(
        item.file.padEnd(60) + 
        formatBytes(item.size).padStart(15) + 
        `+${overLimit.toFixed(2)} KB`.padStart(15)
      );
    });
  }
  
  // Recommendations
  console.log('\n💡 Optimization Recommendations:\n');
  
  if (chunksExceedingLimit.length === 0) {
    console.log('✅ All chunks are under the 200KB limit!');
  } else {
    console.log('1. Consider further code splitting for large chunks');
    console.log('2. Review and remove unused dependencies');
    console.log('3. Use dynamic imports for heavy libraries');
    console.log('4. Enable compression (Brotli/Gzip) on your server');
  }
  
  // Check for potential optimizations
  const vendorChunks = results.filter(r => r.file.includes('vendor'));
  if (vendorChunks.length > 0) {
    const totalVendorSize = vendorChunks.reduce((sum, item) => sum + item.size, 0);
    console.log(`\n📚 Vendor Chunks: ${formatBytes(totalVendorSize)}`);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
  
  // Exit with error if chunks exceed limit
  if (chunksExceedingLimit.length > 0) {
    console.log('⚠️  Warning: Some chunks exceed the 200KB limit');
    // Don't exit with error, just warn
    // process.exit(1);
  }
}

generateReport();
