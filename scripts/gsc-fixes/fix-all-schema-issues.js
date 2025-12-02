#!/usr/bin/env node

/**
 * Fix All Schema Issues Script
 * Systematically fixes all schema markup issues across the website
 * 
 * Usage:
 *   node scripts/gsc-fixes/fix-all-schema-issues.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n' + '='.repeat(80));
console.log('🔧 FIXING ALL SCHEMA MARKUP ISSUES');
console.log('='.repeat(80) + '\n');

let fixCount = 0;
let errorCount = 0;

// Standard address for Scrapiz
const STANDARD_ADDRESS = {
  streetAddress: "Shop No. 07, Dharavi",
  addressLocality: "Mumbai",
  addressRegion: "Maharashtra",
  postalCode: "400017",
  addressCountry: "IN"
};

/**
 * Fix 1: Add Blog schema markup
 */
async function fixBlogSchema() {
  console.log('📝 Fix 1: Adding schema markup to Blog page...');
  
  try {
    const blogPath = path.join(process.cwd(), 'src/pages/Blog.jsx');
    let content = await fs.readFile(blogPath, 'utf-8');
    
    // Check if schema already exists
    if (content.includes('application/ld+json')) {
      console.log('   ✓ Blog page already has schema markup\n');
      return;
    }
    
    // Add schema after the Helmet opening tag
    const schemaMarkup = `
        <script type="application/ld+json">
          {\`
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Scrapiz Blog",
            "description": "Expert advice on scrap management, recycling best practices, and industry insights",
            "url": "https://www.scrapiz.in/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Scrapiz",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.scrapiz.in/Scrapiz-logo.webp"
              }
            }
          \`}
        </script>`;
    
    // Insert after <link rel="canonical"
    content = content.replace(
      /<link rel="canonical" href="https:\/\/www\.scrapiz\.in\/blog" \/>/,
      `<link rel="canonical" href="https://www.scrapiz.in/blog" />${schemaMarkup}`
    );
    
    await fs.writeFile(blogPath, content, 'utf-8');
    console.log('   ✅ Added Blog schema markup\n');
    fixCount++;
  } catch (error) {
    console.error('   ❌ Failed to fix Blog schema:', error.message, '\n');
    errorCount++;
  }
}

/**
 * Fix 2: Enhance Copper page schema with complete address
 */
async function fixCopperSchema() {
  console.log('📝 Fix 2: Enhancing Copper page schema with complete address...');
  
  try {
    const copperPath = path.join(process.cwd(), 'src/Scrap Category Pages/CopperScrapPage.jsx');
    let content = await fs.readFile(copperPath, 'utf-8');
    
    // Replace incomplete address with complete one
    const oldAddress = '"address": { "@type": "PostalAddress", "addressLocality": "Mumbai", "addressRegion": "Maharashtra", "addressCountry": "IN" }';
    const newAddress = `"address": { 
            "@type": "PostalAddress", 
            "streetAddress": "${STANDARD_ADDRESS.streetAddress}",
            "addressLocality": "${STANDARD_ADDRESS.addressLocality}", 
            "addressRegion": "${STANDARD_ADDRESS.addressRegion}",
            "postalCode": "${STANDARD_ADDRESS.postalCode}",
            "addressCountry": "${STANDARD_ADDRESS.addressCountry}" 
          }`;
    
    if (content.includes(oldAddress)) {
      content = content.replace(oldAddress, newAddress);
      
      // Also add email and priceRange if missing
      if (!content.includes('"email":') && content.includes('"telephone": "+91-8828700630"')) {
        content = content.replace(
          '"telephone": "+91-8828700630"',
          '"telephone": "+91-8828700630",\n          "email": "contact@scrapiz.in",\n          "priceRange": "₹₹"'
        );
      }
      
      await fs.writeFile(copperPath, content, 'utf-8');
      console.log('   ✅ Enhanced Copper page schema\n');
      fixCount++;
    } else {
      console.log('   ✓ Copper page schema already complete\n');
    }
  } catch (error) {
    console.error('   ❌ Failed to fix Copper schema:', error.message, '\n');
    errorCount++;
  }
}

/**
 * Fix 3: Enhance all other scrap category pages with complete schema
 */
async function fixOtherScrapPages() {
  console.log('📝 Fix 3: Checking other scrap category pages...');
  
  const scrapPages = [
    'StainlessSteelScrapPage.jsx',
    'ACScrapPage.jsx',
    'RefrigiratorScrapPage.jsx',
    'WashingmachineScrapPage.jsx',
    'MicrowaveScrapPage.jsx'
  ];
  
  for (const page of scrapPages) {
    try {
      const pagePath = path.join(process.cwd(), 'src/Scrap Category Pages', page);
      let content = await fs.readFile(pagePath, 'utf-8');
      
      // Check if it has proper address
      if (content.includes('"streetAddress"') && content.includes('"postalCode"')) {
        console.log(`   ✓ ${page} already has complete schema`);
        continue;
      }
      
      // If it has incomplete address, enhance it
      if (content.includes('"addressLocality": "Mumbai"') && !content.includes('"streetAddress"')) {
        // Replace incomplete address
        const addressPattern = /"address":\s*\{[^}]+\}/;
        const newAddress = `"address": {
        "@type": "PostalAddress",
        "streetAddress": "${STANDARD_ADDRESS.streetAddress}",
        "addressLocality": "${STANDARD_ADDRESS.addressLocality}",
        "addressRegion": "${STANDARD_ADDRESS.addressRegion}",
        "postalCode": "${STANDARD_ADDRESS.postalCode}",
        "addressCountry": "${STANDARD_ADDRESS.addressCountry}"
      }`;
        
        content = content.replace(addressPattern, newAddress);
        
        // Add email if missing
        if (!content.includes('"email":')) {
          content = content.replace(
            '"telephone": "+91-8828700630"',
            '"telephone": "+91-8828700630",\n      "email": "contact@scrapiz.in"'
          );
        }
        
        await fs.writeFile(pagePath, content, 'utf-8');
        console.log(`   ✅ Enhanced ${page} schema`);
        fixCount++;
      } else {
        console.log(`   ℹ️  ${page} needs manual review`);
      }
    } catch (error) {
      console.error(`   ❌ Failed to fix ${page}:`, error.message);
      errorCount++;
    }
  }
  console.log('');
}

/**
 * Main execution
 */
async function main() {
  await fixBlogSchema();
  await fixCopperSchema();
  await fixOtherScrapPages();
  
  console.log('='.repeat(80));
  console.log('📊 SUMMARY');
  console.log('='.repeat(80));
  console.log(`✅ Fixes applied: ${fixCount}`);
  console.log(`❌ Errors encountered: ${errorCount}`);
  console.log('');
  
  if (fixCount > 0) {
    console.log('✨ Schema markup has been improved!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Review the changes in your editor');
    console.log('2. Test the pages in browser');
    console.log('3. Validate using Google Rich Results Test:');
    console.log('   https://search.google.com/test/rich-results');
    console.log('');
  }
  
  console.log('='.repeat(80) + '\n');
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
