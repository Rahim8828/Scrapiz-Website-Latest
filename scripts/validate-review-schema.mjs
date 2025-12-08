#!/usr/bin/env node

/**
 * Review Schema Validator
 * Validates that review structured data is properly implemented
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const servicePages = [
  'src/pages/DemolitionServicePage.jsx',
  'src/pages/DismantlingPage.jsx',
  'src/pages/JunkRemovalServicePage.jsx',
  'src/pages/PaperShreddingPage.jsx',
  'src/pages/SocietyTieUpPage.jsx',
  'src/pages/VehicleScrappingPage.jsx'
];

let allValid = true;

console.log('🔍 Validating Review Schema Implementation...\n');

servicePages.forEach(filePath => {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Checking: ${fileName}`);
  
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Extract JSON-LD
    const jsonLdMatch = content.match(/const jsonLd = ({[\s\S]*?});/);
    
    if (!jsonLdMatch) {
      console.log('  ❌ No JSON-LD found');
      allValid = false;
      return;
    }
    
    // Parse JSON-LD (basic validation)
    const jsonLdStr = jsonLdMatch[1];
    
    // Check for required fields
    const checks = {
      'aggregateRating': jsonLdStr.includes('"aggregateRating"'),
      'review array': jsonLdStr.includes('"review"'),
      'reviewCount': jsonLdStr.includes('"reviewCount"'),
      'bestRating': jsonLdStr.includes('"bestRating"'),
      'worstRating': jsonLdStr.includes('"worstRating"'),
      'Review type': jsonLdStr.includes('"@type": "Review"'),
      'author': jsonLdStr.includes('"author"'),
      'reviewRating': jsonLdStr.includes('"reviewRating"'),
      'reviewBody': jsonLdStr.includes('"reviewBody"'),
      'datePublished': jsonLdStr.includes('"datePublished"')
    };
    
    let pageValid = true;
    Object.entries(checks).forEach(([field, present]) => {
      if (present) {
        console.log(`  ✅ ${field}`);
      } else {
        console.log(`  ❌ Missing: ${field}`);
        pageValid = false;
        allValid = false;
      }
    });
    
    // Count reviews
    const reviewMatches = jsonLdStr.match(/"@type": "Review"/g);
    const reviewCount = reviewMatches ? reviewMatches.length : 0;
    
    // Extract reviewCount value
    const reviewCountMatch = jsonLdStr.match(/"reviewCount":\s*"(\d+)"/);
    const declaredCount = reviewCountMatch ? parseInt(reviewCountMatch[1]) : 0;
    
    console.log(`\n  📊 Reviews found: ${reviewCount}`);
    console.log(`  📊 Declared count: ${declaredCount}`);
    
    if (reviewCount === declaredCount) {
      console.log(`  ✅ Review count matches`);
    } else {
      console.log(`  ❌ Review count mismatch!`);
      pageValid = false;
      allValid = false;
    }
    
    if (pageValid) {
      console.log(`\n  ✨ ${fileName} is valid!`);
    } else {
      console.log(`\n  ⚠️  ${fileName} has issues`);
    }
    
  } catch (error) {
    console.log(`  ❌ Error reading file: ${error.message}`);
    allValid = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('✅ All service pages have valid review schema!');
  console.log('\n📝 Next steps:');
  console.log('1. Build: npm run build');
  console.log('2. Test: https://search.google.com/test/rich-results');
  console.log('3. Deploy to production');
  console.log('4. Request re-indexing in Google Search Console');
  process.exit(0);
} else {
  console.log('❌ Some pages have invalid review schema');
  console.log('Please fix the issues above before deploying');
  process.exit(1);
}
