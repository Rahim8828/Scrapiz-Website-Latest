#!/usr/bin/env node

/**
 * Sitemap Validation Script
 * Validates that sitemap URLs match actual application routes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Service routes that should be in the sitemap
const expectedServiceRoutes = [
  '/services/scrap-collection',
  '/services/demolition-service',
  '/services/dismantling',
  '/services/paper-shredding',
  '/services/society-tie-up',
  '/services/junk-removal-service',
  '/services/vehicle-scrapping'
];

// Old routes that should NOT be in the sitemap
const deprecatedRoutes = [
  '/scrap-collection-page',
  '/demolition-service-page',
  '/dismantling-page',
  '/paper-shredding-page',
  '/society-tie-up-page',
  '/junk-removal-service-page',
  '/vehicle-scrapping-page'
];

async function validateSitemap() {
  console.log('🔍 Validating sitemap.xml...\n');
  
  const sitemapPath = path.join(__dirname, '../../public/sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ Sitemap not found at:', sitemapPath);
    process.exit(1);
  }
  
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  
  // Parse XML
  const parser = new xml2js.Parser();
  const result = await parser.parseStringPromise(sitemapContent);
  
  const urls = result.urlset.url.map(entry => {
    const loc = entry.loc[0];
    return loc.replace('https://www.scrapiz.in', '');
  });
  
  console.log(`📊 Total URLs in sitemap: ${urls.length}\n`);
  
  // Check for expected service routes
  console.log('✅ Checking for expected service routes:');
  let allExpectedFound = true;
  expectedServiceRoutes.forEach(route => {
    if (urls.includes(route)) {
      console.log(`  ✓ ${route}`);
    } else {
      console.log(`  ✗ MISSING: ${route}`);
      allExpectedFound = false;
    }
  });
  
  console.log('\n❌ Checking for deprecated routes:');
  let noDeprecatedFound = true;
  deprecatedRoutes.forEach(route => {
    if (urls.includes(route)) {
      console.log(`  ✗ FOUND (should be removed): ${route}`);
      noDeprecatedFound = false;
    } else {
      console.log(`  ✓ Not found (good): ${route}`);
    }
  });
  
  // Validate XML structure
  console.log('\n🔧 Validating XML structure:');
  let structureValid = true;
  
  result.urlset.url.forEach((entry, index) => {
    if (!entry.loc || !entry.loc[0]) {
      console.log(`  ✗ Entry ${index + 1}: Missing <loc> tag`);
      structureValid = false;
    }
    if (!entry.lastmod || !entry.lastmod[0]) {
      console.log(`  ✗ Entry ${index + 1}: Missing <lastmod> tag`);
      structureValid = false;
    }
    if (!entry.changefreq || !entry.changefreq[0]) {
      console.log(`  ✗ Entry ${index + 1}: Missing <changefreq> tag`);
      structureValid = false;
    }
    if (!entry.priority || !entry.priority[0]) {
      console.log(`  ✗ Entry ${index + 1}: Missing <priority> tag`);
      structureValid = false;
    }
  });
  
  if (structureValid) {
    console.log('  ✓ All entries have required tags (loc, lastmod, changefreq, priority)');
  }
  
  // Final summary
  console.log('\n' + '='.repeat(60));
  if (allExpectedFound && noDeprecatedFound && structureValid) {
    console.log('✅ VALIDATION PASSED: Sitemap is correctly configured!');
    console.log('='.repeat(60));
    process.exit(0);
  } else {
    console.log('❌ VALIDATION FAILED: Issues found in sitemap');
    console.log('='.repeat(60));
    process.exit(1);
  }
}

validateSitemap().catch(err => {
  console.error('Error validating sitemap:', err);
  process.exit(1);
});
