#!/usr/bin/env node

/**
 * Fix Location-Specific Keywords
 * Updates keywords meta tag to match each location
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Fixing Location-Specific Keywords...\n');

const locationPagesDir = path.join(__dirname, '..', 'src/Extra Location pages ');
const files = fs.readdirSync(locationPagesDir).filter(f => f.endsWith('.jsx'));

let fixed = 0;
let skipped = 0;

files.forEach(fileName => {
  const filePath = path.join(locationPagesDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Extract location name
  const locationMatch = content.match(/name: '([^']+)'/);
  if (!locationMatch) {
    console.log(`⚠️  ${fileName}: Could not find location name, skipping...`);
    skipped++;
    return;
  }
  
  const location = locationMatch[1];
  const locationLower = location.toLowerCase().replace(/\s+/g, ' ');
  const locationSlug = location.toLowerCase().replace(/\s+/g, '-');
  
  console.log(`📄 ${fileName}`);
  console.log(`   Location: ${location}`);
  
  // Generate location-specific keywords
  const newKeywords = [
    `scrap dealer ${locationLower}`,
    `scrap buyer ${locationLower}`,
    `kabadiwala ${locationLower}`,
    `sell scrap ${locationLower}`,
    `scrap pickup ${locationLower}`,
    `${locationLower} scrap dealer`,
    `best scrap rates ${locationLower}`,
    `scrap collection ${locationLower}`
  ].join(', ');
  
  // Find and replace keywords meta tag
  const keywordsRegex = /<meta name="keywords" content="[^"]*" \/>/;
  
  if (keywordsRegex.test(content)) {
    const oldKeywordsMatch = content.match(/<meta name="keywords" content="([^"]*)" \/>/);
    const oldKeywords = oldKeywordsMatch ? oldKeywordsMatch[1] : '';
    
    // Check if keywords already contain wrong location
    if (oldKeywords.includes('andheri west') && location !== 'Andheri West') {
      console.log(`   ❌ Found wrong keywords (Andheri West)`);
      console.log(`   ✅ Fixing with: ${newKeywords.substring(0, 60)}...`);
      
      content = content.replace(
        keywordsRegex,
        `<meta name="keywords" content="${newKeywords}" />`
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      fixed++;
      console.log(`   ✨ Fixed!\n`);
    } else if (oldKeywords.toLowerCase().includes(locationLower)) {
      console.log(`   ✅ Keywords already correct\n`);
      skipped++;
    } else {
      console.log(`   ⚠️  Keywords might need manual review\n`);
      skipped++;
    }
  } else {
    console.log(`   ⚠️  No keywords meta tag found\n`);
    skipped++;
  }
});

console.log('='.repeat(60));
console.log(`\n✅ Fixed: ${fixed} files`);
console.log(`⏭️  Skipped: ${skipped} files`);
console.log(`📊 Total: ${files.length} files\n`);

if (fixed > 0) {
  console.log('🎉 Keywords updated successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Review changes: git diff');
  console.log('2. Validate: npm run validate:location-seo');
  console.log('3. Build: npm run build');
  console.log('4. Deploy to production');
} else {
  console.log('ℹ️  No changes needed');
}
