/**
 * Scan and Fix Noindex Tags
 * 
 * This script:
 * 1. Scans all pages for noindex tags
 * 2. Identifies valuable pages with noindex
 * 3. Removes noindex from valuable pages
 * 4. Verifies noindexed pages are excluded from sitemap
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
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
          files.push({
            path: path.join(dirPath, entry),
            relativePath: path.join(dir, entry),
            name: entry
          });
        }
      }
    } catch (error) {
      console.warn(`Could not read directory ${dir}:`, error.message);
    }
  }

  return files;
}

/**
 * Check if file contains noindex
 */
async function checkFileForNoindex(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Check for noindex in various forms
    const hasNoindex = content.includes('noindex') || 
                       content.includes('NOINDEX') ||
                       content.includes('NoIndex');
    
    if (!hasNoindex) {
      return null;
    }

    // Extract the noindex context
    const lines = content.split('\n');
    const noindexLines = [];
    
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes('noindex')) {
        noindexLines.push({
          lineNumber: index + 1,
          content: line.trim()
        });
      }
    });

    return {
      hasNoindex: true,
      occurrences: noindexLines
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Determine if page is valuable and should be indexed
 */
function isValuablePage(filePath, content) {
  const fileName = path.basename(filePath);
  
  // Pages that should definitely be indexed
  const importantPages = [
    'Home.jsx',
    'About.jsx',
    'Services.jsx',
    'Contact.jsx',
    'Locations.jsx',
    'Blog.jsx'
  ];

  if (importantPages.includes(fileName)) {
    return true;
  }

  // Service pages should be indexed
  if (filePath.includes('pages/') && fileName.includes('Page.jsx')) {
    return true;
  }

  // Location pages should be indexed
  if (filePath.includes('Location pages')) {
    return true;
  }

  // Scrap category pages should be indexed
  if (filePath.includes('Scrap Category Pages')) {
    return true;
  }

  // Check content length (rough estimate)
  const wordCount = content.split(/\s+/).length;
  if (wordCount > 500) {
    return true;
  }

  // Pages with less content might not be valuable
  return false;
}

/**
 * Remove noindex from file content
 */
function removeNoindexFromContent(content) {
  let updatedContent = content;
  
  // Pattern 1: <meta name="robots" content="noindex, nofollow" />
  // Pattern 2: <meta name="robots" content="noindex" />
  // Pattern 3: content="noindex, follow"
  
  // Remove entire meta robots tag with noindex
  updatedContent = updatedContent.replace(
    /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["']\s*\/>/gi,
    ''
  );

  // Remove from Helmet component
  updatedContent = updatedContent.replace(
    /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["']\s*\/>/gi,
    ''
  );

  // Clean up any empty lines left behind
  updatedContent = updatedContent.replace(/\n\s*\n\s*\n/g, '\n\n');

  return updatedContent;
}

/**
 * Fix noindex in a single file
 */
async function fixNoindexInFile(filePath, dryRun = false) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const updatedContent = removeNoindexFromContent(content);

    if (content === updatedContent) {
      return {
        success: false,
        message: 'No changes needed',
        changed: false
      };
    }

    if (dryRun) {
      return {
        success: true,
        message: 'Would remove noindex (dry run)',
        changed: true,
        dryRun: true
      };
    }

    // Create backup
    const backupPath = `${filePath}.backup.${Date.now()}`;
    await fs.copyFile(filePath, backupPath);

    // Write updated content
    await fs.writeFile(filePath, updatedContent, 'utf-8');

    return {
      success: true,
      message: 'Removed noindex',
      changed: true,
      backupPath
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`,
      changed: false
    };
  }
}

/**
 * Get URLs from sitemap
 */
async function getSitemapUrls() {
  try {
    const sitemapPath = path.join(projectRoot, 'public/sitemap.xml');
    const sitemapContent = await fs.readFile(sitemapPath, 'utf-8');
    
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(sitemapContent);
    
    const urls = result.urlset.url.map(entry => entry.loc[0]);
    return urls;
  } catch (error) {
    console.error('Error reading sitemap:', error.message);
    return [];
  }
}

/**
 * Map file path to URL
 */
function filePathToUrl(filePath) {
  const fileName = path.basename(filePath, '.jsx');
  
  // Home page
  if (fileName === 'Home') {
    return 'https://www.scrapiz.in/';
  }

  // Simple pages
  const simplePages = {
    'About': '/about',
    'Services': '/services',
    'Contact': '/contact',
    'Locations': '/locations',
    'Blog': '/blog',
    'PrivacyPolicy': '/privacy-policy',
    'TermsAndConditions': '/terms-and-conditions',
    'RequestAccountDeletion': '/request-account-deletion'
  };

  if (simplePages[fileName]) {
    return `https://www.scrapiz.in${simplePages[fileName]}`;
  }

  // Service pages
  if (fileName.endsWith('Page')) {
    const serviceName = fileName.replace('Page', '')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .substring(1);
    return `https://www.scrapiz.in/services/${serviceName}`;
  }

  // Location pages (main)
  const locationPages = {
    'Bandra': '/bandra',
    'BandraEast': '/bandra-east',
    'Jogeshwari': '/jogeshwari',
    'Kandivali': '/kandivali',
    'Mahim': '/mahim',
    'Dharavi': '/dharavi',
    'DharaviKoliwada': '/dharavi-koliwada',
    'Goregaon': '/goregaon',
    'Nalasopara': '/nalasopara'
  };

  if (locationPages[fileName]) {
    return `https://www.scrapiz.in${locationPages[fileName]}`;
  }

  // Extra location pages
  if (fileName.startsWith('ScrapDealerin')) {
    const location = fileName.replace('ScrapDealerin', '')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .substring(1);
    return `https://www.scrapiz.in/scrap-dealer-in-${location}`;
  }

  // Scrap category pages
  if (filePath.includes('Scrap Category Pages')) {
    const category = fileName.replace('ScrapPage', '')
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .substring(1);
    return `https://www.scrapiz.in/sell-${category}-scrap-mumbai`;
  }

  return null;
}

/**
 * Main execution
 */
async function main() {
  console.log('=== Noindex Tag Scanner and Fixer ===\n');

  // Step 1: Get all component files
  console.log('Step 1: Scanning all component files...\n');
  const files = await getAllComponentFiles();
  console.log(`Found ${files.length} component files\n`);

  // Step 2: Check each file for noindex
  console.log('Step 2: Checking for noindex tags...\n');
  const filesWithNoindex = [];

  for (const file of files) {
    const noindexInfo = await checkFileForNoindex(file.path);
    if (noindexInfo) {
      const content = await fs.readFile(file.path, 'utf-8');
      const isValuable = isValuablePage(file.path, content);
      const url = filePathToUrl(file.path);

      filesWithNoindex.push({
        ...file,
        ...noindexInfo,
        isValuable,
        url
      });
    }
  }

  console.log(`Found ${filesWithNoindex.length} files with noindex tags\n`);

  if (filesWithNoindex.length === 0) {
    console.log('✓ No noindex tags found. All pages are indexable.');
    return;
  }

  // Step 3: Display findings
  console.log('Step 3: Noindex Analysis\n');
  console.log('Files with noindex tags:\n');

  const valuableWithNoindex = [];
  const correctlyNoindexed = [];

  filesWithNoindex.forEach((file, index) => {
    console.log(`${index + 1}. ${file.relativePath}`);
    console.log(`   URL: ${file.url || 'Unknown'}`);
    console.log(`   Valuable: ${file.isValuable ? 'YES' : 'NO'}`);
    console.log(`   Occurrences: ${file.occurrences.length}`);
    file.occurrences.forEach(occ => {
      console.log(`     Line ${occ.lineNumber}: ${occ.content}`);
    });
    console.log();

    if (file.isValuable) {
      valuableWithNoindex.push(file);
    } else {
      correctlyNoindexed.push(file);
    }
  });

  console.log(`\nSummary:`);
  console.log(`  Total files with noindex: ${filesWithNoindex.length}`);
  console.log(`  Valuable pages with noindex (should fix): ${valuableWithNoindex.length}`);
  console.log(`  Correctly noindexed pages: ${correctlyNoindexed.length}\n`);

  if (valuableWithNoindex.length === 0) {
    console.log('✓ No valuable pages have inappropriate noindex tags.');
    return;
  }

  // Step 4: Fix valuable pages (dry run first)
  console.log('Step 4: Dry run - Preview changes\n');

  for (const file of valuableWithNoindex) {
    const result = await fixNoindexInFile(file.path, true);
    console.log(`${file.relativePath}: ${result.message}`);
  }

  console.log('\n--- Dry run complete ---\n');

  // Step 5: Apply fixes
  console.log('Step 5: Applying fixes...\n');

  const fixResults = [];
  for (const file of valuableWithNoindex) {
    const result = await fixNoindexInFile(file.path, false);
    fixResults.push({
      file: file.relativePath,
      ...result
    });
    
    const icon = result.success ? '✓' : '✗';
    console.log(`${icon} ${file.relativePath}: ${result.message}`);
  }

  console.log();

  // Step 6: Verify sitemap
  console.log('Step 6: Verifying sitemap...\n');
  const sitemapUrls = await getSitemapUrls();
  console.log(`Sitemap contains ${sitemapUrls.length} URLs\n`);

  // Check if any noindexed pages are in sitemap
  const noindexedInSitemap = [];
  for (const file of correctlyNoindexed) {
    if (file.url && sitemapUrls.includes(file.url)) {
      noindexedInSitemap.push(file);
    }
  }

  if (noindexedInSitemap.length > 0) {
    console.log('⚠️  Warning: Found noindexed pages in sitemap:');
    noindexedInSitemap.forEach(file => {
      console.log(`  - ${file.url}`);
      console.log(`    File: ${file.relativePath}`);
    });
    console.log('\nThese pages should be removed from the sitemap.\n');
  } else {
    console.log('✓ No noindexed pages found in sitemap\n');
  }

  // Step 7: Summary
  console.log('Step 7: Summary\n');
  
  const successCount = fixResults.filter(r => r.success).length;
  const failCount = fixResults.filter(r => !r.success).length;

  console.log(`Results:`);
  console.log(`  ✓ Successfully fixed: ${successCount}`);
  console.log(`  ✗ Failed: ${failCount}`);
  console.log();

  if (successCount > 0) {
    console.log('Next steps:');
    console.log('1. Review the changes in the modified files');
    console.log('2. Test the pages in a browser');
    console.log('3. Verify noindex tags are removed');
    console.log('4. Submit URLs for re-indexing in Google Search Console');
    console.log('5. Monitor indexing status over the next few days');
  }

  console.log('\n=== Scan and Fix Complete ===');
}

// Run the script
main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
