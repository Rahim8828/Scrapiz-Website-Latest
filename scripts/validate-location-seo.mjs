#!/usr/bin/env node

/**
 * Location Pages SEO Validator
 * Checks title, description, keywords, and canonical URLs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Validating Location Pages SEO...\n');

const locationPagesDir = path.join(__dirname, '..', 'src/Extra Location pages ');
const files = fs.readdirSync(locationPagesDir).filter(f => f.endsWith('.jsx'));

let issues = [];
let warnings = [];

files.forEach(fileName => {
  const filePath = path.join(locationPagesDir, fileName);
  const content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`\n📄 ${fileName}`);
  
  // Extract location name
  const locationMatch = content.match(/name: '([^']+)'/);
  const location = locationMatch ? locationMatch[1] : 'Unknown';
  
  // Extract title
  const titleMatch = content.match(/title: '([^']+)'/);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Extract description
  const descMatch = content.match(/description: '([^']+)'/);
  const description = descMatch ? descMatch[1] : '';
  
  // Extract keywords
  const keywordsMatch = content.match(/keywords" content="([^"]+)"/);
  const keywords = keywordsMatch ? keywordsMatch[1] : '';
  
  // Extract canonical
  const canonicalMatch = content.match(/canonical" href="([^"]+)"/);
  const canonical = canonicalMatch ? canonicalMatch[1] : '';
  
  console.log(`  📍 Location: ${location}`);
  
  // Check 1: Title starts with keyword
  if (title) {
    const startsWithKeyword = title.toLowerCase().startsWith('scrap dealer') || 
                             title.toLowerCase().startsWith('scrap buyer');
    console.log(`  ${startsWithKeyword ? '✅' : '❌'} Title starts with keyword`);
    if (!startsWithKeyword) {
      issues.push(`${fileName}: Title doesn't start with primary keyword`);
    }
    
    // Check title includes location
    if (!title.includes(location)) {
      console.log(`  ❌ Title missing location name`);
      issues.push(`${fileName}: Title doesn't include "${location}"`);
    } else {
      console.log(`  ✅ Title includes location`);
    }
    
    // Check title length
    if (title.length > 60) {
      console.log(`  ⚠️  Title too long (${title.length} chars)`);
      warnings.push(`${fileName}: Title is ${title.length} characters (recommended: 50-60)`);
    } else {
      console.log(`  ✅ Title length OK (${title.length} chars)`);
    }
  }
  
  // Check 2: Description starts with keyword
  if (description) {
    const startsWithKeyword = description.toLowerCase().startsWith('sell scrap');
    console.log(`  ${startsWithKeyword ? '✅' : '❌'} Description starts with keyword`);
    if (!startsWithKeyword) {
      issues.push(`${fileName}: Description doesn't start with primary keyword`);
    }
    
    // Check description includes location
    if (!description.includes(location)) {
      console.log(`  ❌ Description missing location`);
      issues.push(`${fileName}: Description doesn't include "${location}"`);
    } else {
      console.log(`  ✅ Description includes location`);
    }
    
    // Check description length
    if (description.length > 160) {
      console.log(`  ⚠️  Description too long (${description.length} chars)`);
      warnings.push(`${fileName}: Description is ${description.length} characters (recommended: 150-160)`);
    } else if (description.length < 120) {
      console.log(`  ⚠️  Description too short (${description.length} chars)`);
      warnings.push(`${fileName}: Description is ${description.length} characters (recommended: 150-160)`);
    } else {
      console.log(`  ✅ Description length OK (${description.length} chars)`);
    }
  }
  
  // Check 3: Keywords are location-specific
  if (keywords) {
    const locationInKeywords = keywords.toLowerCase().includes(location.toLowerCase());
    console.log(`  ${locationInKeywords ? '✅' : '❌'} Keywords include location`);
    if (!locationInKeywords) {
      issues.push(`${fileName}: Keywords don't include "${location}"`);
    }
    
    // Check for generic "andheri" keywords (copy-paste error)
    if (location !== 'Andheri West' && keywords.includes('andheri west')) {
      console.log(`  ❌ Keywords contain wrong location (Andheri West)`);
      issues.push(`${fileName}: Keywords contain "andheri west" but location is "${location}"`);
    }
  }
  
  // Check 4: Canonical URL
  if (canonical) {
    const expectedSlug = location.toLowerCase().replace(/\s+/g, '-');
    if (canonical.includes(expectedSlug) || canonical.includes(location.toLowerCase().replace(/\s+/g, ''))) {
      console.log(`  ✅ Canonical URL matches location`);
    } else {
      console.log(`  ⚠️  Canonical URL might not match location`);
      warnings.push(`${fileName}: Canonical URL "${canonical}" might not match location "${location}"`);
    }
  }
  
  // Check 5: H1 tag
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
  if (h1Match) {
    const h1Text = h1Match[1].replace(/<[^>]+>/g, '');
    if (h1Text.includes(location)) {
      console.log(`  ✅ H1 includes location`);
    } else {
      console.log(`  ❌ H1 missing location`);
      issues.push(`${fileName}: H1 doesn't include "${location}"`);
    }
  }
});

console.log('\n' + '='.repeat(60));
console.log('\n📊 SUMMARY\n');

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ All location pages have proper SEO!');
  console.log(`\n✨ ${files.length} pages validated successfully`);
  process.exit(0);
} else {
  if (issues.length > 0) {
    console.log(`❌ ${issues.length} CRITICAL ISSUES:\n`);
    issues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} WARNINGS:\n`);
    warnings.forEach((warning, i) => {
      console.log(`${i + 1}. ${warning}`);
    });
  }
  
  console.log('\n💡 RECOMMENDATIONS:\n');
  console.log('1. Fix all critical issues before deploying');
  console.log('2. Update keywords to be location-specific');
  console.log('3. Ensure titles are 50-60 characters');
  console.log('4. Ensure descriptions are 150-160 characters');
  console.log('5. Verify canonical URLs match actual routes');
  
  process.exit(1);
}
