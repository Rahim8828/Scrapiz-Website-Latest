#!/usr/bin/env node

/**
 * Script to verify that all pages have canonical tags
 * This script checks all JSX files in pages and scrap category folders
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../src/pages');
const scrapCategoryDir = path.join(__dirname, '../src/Scrap Category Pages');
const extraLocationDir = path.join(__dirname, '../src/Extra Location pages ');

function checkCanonicalTag(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const hasCanonical = content.includes('rel="canonical"');
  return hasCanonical;
}

function checkDirectory(dir, label) {
  console.log(`\n${label}:`);
  console.log('='.repeat(50));
  
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
  let missingCount = 0;
  let totalCount = files.length;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const hasCanonical = checkCanonicalTag(filePath);
    
    if (!hasCanonical) {
      console.log(`❌ MISSING: ${file}`);
      missingCount++;
    } else {
      console.log(`✅ OK: ${file}`);
    }
  });
  
  console.log(`\nSummary: ${totalCount - missingCount}/${totalCount} pages have canonical tags`);
  return { total: totalCount, missing: missingCount };
}

console.log('\n🔍 Verifying Canonical Tags Across All Pages\n');

const results = {
  pages: checkDirectory(pagesDir, 'Main Pages'),
  scrapCategory: checkDirectory(scrapCategoryDir, 'Scrap Category Pages'),
  extraLocation: checkDirectory(extraLocationDir, 'Extra Location Pages')
};

const totalPages = results.pages.total + results.scrapCategory.total + results.extraLocation.total;
const totalMissing = results.pages.missing + results.scrapCategory.missing + results.extraLocation.missing;

console.log('\n' + '='.repeat(50));
console.log('📊 OVERALL SUMMARY');
console.log('='.repeat(50));
console.log(`Total Pages: ${totalPages}`);
console.log(`Pages with Canonical Tags: ${totalPages - totalMissing}`);
console.log(`Pages Missing Canonical Tags: ${totalMissing}`);

if (totalMissing === 0) {
  console.log('\n✅ SUCCESS: All pages have canonical tags!');
  process.exit(0);
} else {
  console.log('\n❌ FAILURE: Some pages are missing canonical tags');
  process.exit(1);
}
