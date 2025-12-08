#!/usr/bin/env node

/**
 * Fix Schema to Use Address Field
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Fixing Schema Address References...\n');

const locationPagesDir = path.join(__dirname, '..', 'src/Extra Location pages ');
const files = fs.readdirSync(locationPagesDir).filter(f => f.endsWith('.jsx'));

let fixed = 0;

files.forEach(fileName => {
  const filePath = path.join(locationPagesDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`📄 ${fileName}`);
  
  try {
    // Check if schema has proper address structure
    if (!content.includes('"address": {')) {
      console.log(`   ⚠️  No address schema found\n`);
      return;
    }
    
    // Add streetAddress field if missing
    if (!content.includes('"streetAddress":')) {
      content = content.replace(
        /"address": {\s*"@type": "PostalAddress",/,
        `"address": {
          "@type": "PostalAddress",
          "streetAddress": locationData.address,`
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`   ✅ Added streetAddress to schema\n`);
      fixed++;
    } else {
      console.log(`   ✅ Already has streetAddress\n`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
});

console.log('='.repeat(60));
console.log(`\n✅ Fixed: ${fixed} files`);
console.log(`📊 Total: ${files.length} files\n`);

if (fixed > 0) {
  console.log('🎉 Schema address references fixed!');
}
