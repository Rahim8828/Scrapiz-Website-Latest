#!/usr/bin/env node

/**
 * Add Address Field to locationData
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Adding Address Field to Location Pages...\n');

const locationPagesDir = path.join(__dirname, '..', 'src/Extra Location pages ');
const files = fs.readdirSync(locationPagesDir).filter(f => f.endsWith('.jsx'));

let fixed = 0;

files.forEach(fileName => {
  const filePath = path.join(locationPagesDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`📄 ${fileName}`);
  
  try {
    // Check if already has address
    if (content.includes('address:') && content.match(/address: ['"][^'"]+['"]/)) {
      console.log(`   ✅ Already has address field\n`);
      return;
    }
    
    // Extract location name
    const locationMatch = content.match(/name: '([^']+)'/);
    if (!locationMatch) {
      console.log(`   ⚠️  Could not find location name\n`);
      return;
    }
    
    const location = locationMatch[1];
    
    // Add address field after name
    const addressLine = `    address: 'Shop No. 07, ${location}, Mumbai',`;
    
    content = content.replace(
      /name: '[^']+',/,
      (match) => `${match}\n${addressLine}`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ Added address field\n`);
    fixed++;
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
});

console.log('='.repeat(60));
console.log(`\n✅ Fixed: ${fixed} files`);
console.log(`📊 Total: ${files.length} files\n`);

if (fixed > 0) {
  console.log('🎉 Address field added successfully!');
  console.log('\n📝 Note: Schema now has proper streetAddress');
}
