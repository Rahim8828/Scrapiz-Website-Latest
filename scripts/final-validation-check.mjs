#!/usr/bin/env node

/**
 * Final Comprehensive Validation Check
 * Validates all SEO improvements across all pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 FINAL COMPREHENSIVE VALIDATION CHECK\n');
console.log('='.repeat(60));

const locationPagesDir = path.join(__dirname, '..', 'src/Extra Location pages ');
const files = fs.readdirSync(locationPagesDir).filter(f => f.endsWith('.jsx'));

let totalIssues = 0;
let totalWarnings = 0;
const report = {
  address: { pass: 0, fail: 0 },
  geoCoordinates: { pass: 0, fail: 0 },
  reviewSchema: { pass: 0, fail: 0 },
  faqSchema: { pass: 0, fail: 0 },
  breadcrumb: { pass: 0, fail: 0 },
  keywords: { pass: 0, fail: 0 }
};

files.forEach(fileName => {
  const filePath = path.join(locationPagesDir, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract location name
  const locationMatch = content.match(/name: '([^']+)'/);
  const location = locationMatch ? locationMatch[1] : 'Unknown';
  
  // Check 1: Address field
  if (content.includes('address:') && content.match(/address: ['"][^'"]+['"]/)) {
    report.address.pass++;
  } else {
    report.address.fail++;
    totalIssues++;
  }
  
  // Check 2: Geo coordinates
  if (content.includes('"geo":') && content.includes('"latitude"') && content.includes('"longitude"')) {
    report.geoCoordinates.pass++;
  } else {
    report.geoCoordinates.fail++;
    totalIssues++;
  }
  
  // Check 3: Review schema
  if (content.includes('"review":') && content.includes('"@type": "Review"')) {
    report.reviewSchema.pass++;
  } else {
    report.reviewSchema.fail++;
    totalIssues++;
  }
  
  // Check 4: FAQ schema
  if (content.includes('"@type": "FAQPage"')) {
    report.faqSchema.pass++;
  } else {
    report.faqSchema.fail++;
    totalIssues++;
  }
  
  // Check 5: Breadcrumb schema
  if (content.includes('"@type": "BreadcrumbList"')) {
    report.breadcrumb.pass++;
  } else {
    report.breadcrumb.fail++;
    totalIssues++;
  }
  
  // Check 6: Location-specific keywords
  const keywordsMatch = content.match(/keywords" content="([^"]+)"/);
  if (keywordsMatch) {
    const keywords = keywordsMatch[1].toLowerCase();
    if (keywords.includes(location.toLowerCase())) {
      report.keywords.pass++;
    } else {
      report.keywords.fail++;
      totalWarnings++;
    }
  }
});

console.log('\n📊 VALIDATION REPORT\n');
console.log('Total Pages Checked:', files.length);
console.log('');

console.log('✅ Address Field:');
console.log(`   Pass: ${report.address.pass}/${files.length}`);
console.log(`   Fail: ${report.address.fail}/${files.length}`);
console.log('');

console.log('📍 Geo Coordinates:');
console.log(`   Pass: ${report.geoCoordinates.pass}/${files.length}`);
console.log(`   Fail: ${report.geoCoordinates.fail}/${files.length}`);
console.log('');

console.log('⭐ Review Schema:');
console.log(`   Pass: ${report.reviewSchema.pass}/${files.length}`);
console.log(`   Fail: ${report.reviewSchema.fail}/${files.length}`);
console.log('');

console.log('❓ FAQ Schema:');
console.log(`   Pass: ${report.faqSchema.pass}/${files.length}`);
console.log(`   Fail: ${report.faqSchema.fail}/${files.length}`);
console.log('');

console.log('🍞 Breadcrumb Schema:');
console.log(`   Pass: ${report.breadcrumb.pass}/${files.length}`);
console.log(`   Fail: ${report.breadcrumb.fail}/${files.length}`);
console.log('');

console.log('🔑 Location Keywords:');
console.log(`   Pass: ${report.keywords.pass}/${files.length}`);
console.log(`   Fail: ${report.keywords.fail}/${files.length}`);
console.log('');

console.log('='.repeat(60));
console.log('\n📈 OVERALL SCORE\n');

const totalChecks = files.length * 6;
const totalPass = report.address.pass + report.geoCoordinates.pass + 
                  report.reviewSchema.pass + report.faqSchema.pass + 
                  report.breadcrumb.pass + report.keywords.pass;
const score = ((totalPass / totalChecks) * 100).toFixed(1);

console.log(`Score: ${score}%`);
console.log(`Passed: ${totalPass}/${totalChecks} checks`);
console.log(`Issues: ${totalIssues}`);
console.log(`Warnings: ${totalWarnings}`);
console.log('');

if (totalIssues === 0 && totalWarnings === 0) {
  console.log('🎉 PERFECT! All location pages are fully optimized!');
  console.log('');
  console.log('✅ Ready for production deployment');
  console.log('');
  console.log('📝 Next steps:');
  console.log('1. npm run build');
  console.log('2. Deploy to production');
  console.log('3. Test on: https://search.google.com/test/rich-results');
  console.log('4. Request re-indexing in Google Search Console');
  process.exit(0);
} else if (totalIssues === 0) {
  console.log('✅ All critical checks passed!');
  console.log(`⚠️  ${totalWarnings} minor warnings (can be ignored)`);
  console.log('');
  console.log('✅ Ready for production deployment');
  process.exit(0);
} else {
  console.log('❌ Some issues found. Please review and fix.');
  process.exit(1);
}
