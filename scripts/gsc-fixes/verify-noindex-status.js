/**
 * Verify Noindex Status
 * 
 * Quick verification script to check:
 * 1. Which pages have noindex tags
 * 2. If any valuable pages are blocked
 * 3. If noindexed pages are in sitemap
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import xml2js from 'xml2js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

/**
 * Get all React component files
 */
async function getAllComponentFiles() {
  const files = [];
  const directories = [
    'src/pages',
    'src/Extra Location pages ',
    'src/Scrap Category Pages'
  ];

  for (const dir of directories) {
    const dirPath = path.join(projectRoot, dir);
    try {
      const entries = await fs.readdir(dirPath);
      for (const entry of entries) {
        if (entry.endsWith('.jsx') || entry.endsWith('.js')) {
          files.push(path.join(dirPath, entry));
        }
      }
    } catch (error) {
      // Directory might not exist
    }
  }

  return files;
}

/**
 * Check if file contains noindex
 */
async function hasNoindex(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content.toLowerCase().includes('noindex');
  } catch (error) {
    return false;
  }
}

/**
 * Get sitemap URLs
 */
async function getSitemapUrls() {
  try {
    const sitemapPath = path.join(projectRoot, 'public/sitemap.xml');
    const sitemapContent = await fs.readFile(sitemapPath, 'utf-8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(sitemapContent);
    return result.urlset.url.map(entry => entry.loc[0]);
  } catch (error) {
    return [];
  }
}

/**
 * Main verification
 */
async function verify() {
  console.log('🔍 Verifying Noindex Status...\n');

  // Get all files
  const files = await getAllComponentFiles();
  console.log(`📁 Scanning ${files.length} files...\n`);

  // Check for noindex
  const noindexFiles = [];
  for (const file of files) {
    if (await hasNoindex(file)) {
      noindexFiles.push(path.relative(projectRoot, file));
    }
  }

  // Get sitemap
  const sitemapUrls = await getSitemapUrls();

  // Report
  console.log('📊 Results:\n');
  console.log(`Files with noindex: ${noindexFiles.length}`);
  
  if (noindexFiles.length > 0) {
    console.log('\nFiles containing noindex:');
    noindexFiles.forEach(file => {
      const isNotFound = file.includes('NotFound');
      const icon = isNotFound ? '✅' : '⚠️';
      console.log(`  ${icon} ${file}`);
    });
  }

  console.log(`\nSitemap URLs: ${sitemapUrls.length}`);

  // Check for issues
  const valuableWithNoindex = noindexFiles.filter(f => !f.includes('NotFound'));
  
  console.log('\n' + '='.repeat(50));
  
  if (valuableWithNoindex.length === 0) {
    console.log('✅ STATUS: HEALTHY');
    console.log('   No valuable pages have noindex tags');
  } else {
    console.log('⚠️  STATUS: ISSUES FOUND');
    console.log(`   ${valuableWithNoindex.length} valuable page(s) have noindex`);
    console.log('\n   Run: node scripts/gsc-fixes/scan-and-fix-noindex.js');
  }
  
  console.log('='.repeat(50) + '\n');
}

verify().catch(console.error);
