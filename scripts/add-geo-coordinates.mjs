#!/usr/bin/env node

/**
 * Add Geo Coordinates to Location Pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Adding Geo Coordinates to Location Pages...\n');

// Load coordinates
const coordsPath = path.join(__dirname, 'location-coordinates.json');
const coordinates = JSON.parse(fs.readFileSync(coordsPath, 'utf8'));

const locationPagesDir = path.join(__dirname, '..', 'src/Extra Location pages ');
const files = fs.readdirSync(locationPagesDir).filter(f => f.endsWith('.jsx'));

let fixed = 0;

files.forEach(fileName => {
  const filePath = path.join(locationPagesDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`📄 ${fileName}`);
  
  try {
    // Extract location name
    const locationMatch = content.match(/name: '([^']+)'/);
    if (!locationMatch) {
      console.log(`   ⚠️  Could not find location name\n`);
      return;
    }
    
    const location = locationMatch[1];
    const coords = coordinates[location];
    
    if (!coords) {
      console.log(`   ⚠️  No coordinates found for ${location}\n`);
      return;
    }
    
    // Check if already has geo
    if (content.includes('"geo":')) {
      console.log(`   ✅ Already has geo coordinates\n`);
      return;
    }
    
    // Add geo after addressCountry
    const geoSchema = `,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "${coords.latitude}",
          "longitude": "${coords.longitude}"
        }`;
    
    content = content.replace(
      /"addressCountry": "IN"\s*}/,
      `"addressCountry": "IN"${geoSchema}\n        }`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ Added coordinates: ${coords.latitude}, ${coords.longitude}\n`);
    fixed++;
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
});

console.log('='.repeat(60));
console.log(`\n✅ Fixed: ${fixed} files`);
console.log(`📊 Total: ${files.length} files\n`);

if (fixed > 0) {
  console.log('🎉 Geo coordinates added successfully!');
  console.log('\n📍 Benefits:');
  console.log('- Better local search rankings');
  console.log('- Improved Google Maps visibility');
  console.log('- Enhanced "near me" search results');
}
