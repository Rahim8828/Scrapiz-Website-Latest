#!/usr/bin/env node

/**
 * FAQ Schema Validator
 * Validates that FAQ structured data is properly implemented
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const scrapPages = [
  'src/Scrap Category Pages/AluminiumScrapPage.jsx',
  'src/Scrap Category Pages/BrassScrapPage.jsx',
  'src/Scrap Category Pages/CopperScrapPage.jsx',
  'src/Scrap Category Pages/Iron&SteelScrapPage.jsx',
  'src/Scrap Category Pages/StainlessSteelScrapPage.jsx'
];

let allValid = true;

console.log('🔍 Validating FAQ Schema Implementation...\n');

scrapPages.forEach(filePath => {
  const fileName = path.basename(filePath);
  console.log(`\n📄 Checking: ${fileName}`);
  
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log('  ⚠️  File not found, skipping...');
      return;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Check for duplicate schema implementations
    const hasMicrodata = content.includes('itemScope') && content.includes('itemType="https://schema.org/FAQPage"');
    const hasJsonLd = content.includes('"@type": "FAQPage"');
    
    console.log(`  ${hasJsonLd ? '✅' : '❌'} JSON-LD FAQPage schema`);
    console.log(`  ${hasMicrodata ? '⚠️' : '✅'} ${hasMicrodata ? 'Microdata found (should be removed)' : 'No duplicate microdata'}`);
    
    if (hasMicrodata) {
      console.log('  ⚠️  WARNING: Duplicate schema markup detected!');
      console.log('     Both JSON-LD and microdata (itemScope/itemProp) are present.');
      console.log('     This can confuse Google. Use only JSON-LD.');
      allValid = false;
    }
    
    if (!hasJsonLd) {
      console.log('  ❌ Missing FAQPage JSON-LD schema');
      allValid = false;
      return;
    }
    
    // Extract JSON-LD
    const jsonLdMatch = content.match(/const jsonLd = ({[\s\S]*?});/);
    
    if (!jsonLdMatch) {
      console.log('  ❌ No JSON-LD found');
      allValid = false;
      return;
    }
    
    const jsonLdStr = jsonLdMatch[1];
    
    // Check for FAQPage in @graph
    const hasFaqInGraph = jsonLdStr.includes('"@type": "FAQPage"');
    
    if (!hasFaqInGraph) {
      console.log('  ❌ FAQPage not found in @graph');
      allValid = false;
      return;
    }
    
    // Count FAQ questions
    const faqsMatch = content.match(/const faqs = \[([\s\S]*?)\];/);
    if (faqsMatch) {
      const faqsStr = faqsMatch[1];
      const questionMatches = faqsStr.match(/question:/g);
      const questionCount = questionMatches ? questionMatches.length : 0;
      
      console.log(`  📊 FAQ questions found: ${questionCount}`);
      
      if (questionCount === 0) {
        console.log('  ⚠️  No FAQ questions found');
        allValid = false;
      } else if (questionCount < 3) {
        console.log('  ⚠️  Less than 3 FAQs (recommended: 5-10)');
      }
    }
    
    // Check for proper FAQ structure in JSON-LD
    const checks = {
      'mainEntity': jsonLdStr.includes('"mainEntity"'),
      'Question type': jsonLdStr.includes('"@type": "Question"'),
      'acceptedAnswer': jsonLdStr.includes('"acceptedAnswer"'),
      'Answer type': jsonLdStr.includes('"@type": "Answer"')
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
    
    if (pageValid && !hasMicrodata) {
      console.log(`\n  ✨ ${fileName} is valid!`);
    } else if (hasMicrodata) {
      console.log(`\n  ⚠️  ${fileName} needs cleanup (remove microdata)`);
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
  console.log('✅ All scrap pages have valid FAQ schema!');
  console.log('\n📝 Next steps:');
  console.log('1. Build: npm run build');
  console.log('2. Test: https://search.google.com/test/rich-results');
  console.log('3. Deploy to production');
  console.log('4. Request re-indexing in Google Search Console');
  process.exit(0);
} else {
  console.log('❌ Some pages have invalid FAQ schema');
  console.log('\n💡 Common issues:');
  console.log('- Duplicate schema (both JSON-LD and microdata)');
  console.log('- Missing FAQPage structure');
  console.log('- Insufficient FAQ questions');
  console.log('\nPlease fix the issues above before deploying');
  process.exit(1);
}
