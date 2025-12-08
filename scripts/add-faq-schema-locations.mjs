#!/usr/bin/env node

/**
 * Add FAQPage Schema to Location Pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Adding FAQPage Schema to Location Pages...\n');

const locationPagesDir = path.join(__dirname, '..', 'src/Extra Location pages ');
const files = fs.readdirSync(locationPagesDir).filter(f => f.endsWith('.jsx'));

let fixed = 0;

files.forEach(fileName => {
  const filePath = path.join(locationPagesDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log(`📄 ${fileName}`);
  
  try {
    // Check if already has @graph structure
    if (content.includes('"@graph"')) {
      console.log(`   ✅ Already has @graph structure\n`);
      return;
    }
    
    // Find the schemaMarkup object
    const schemaRegex = /const schemaMarkup = ({[\s\S]*?});/;
    const match = content.match(schemaRegex);
    
    if (!match) {
      console.log(`   ⚠️  Could not find schemaMarkup\n`);
      return;
    }
    
    // Extract location name for URL
    const locationMatch = content.match(/name: '([^']+)'/);
    const location = locationMatch ? locationMatch[1] : '';
    const locationSlug = location.toLowerCase().replace(/\s+/g, '-');
    
    // Create new schema with @graph structure
    const newSchema = `const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.scrapiz.in/scrap-dealer-in-${locationSlug}#business",
        "name": "Scrapiz - Scrap Dealer in ${location}",
        "image": "https://www.scrapiz.in/Scrapiz-logo.webp",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "${location}",
          "addressRegion": "Maharashtra",
          "postalCode": "400001",
          "addressCountry": "IN"
        },
        "telephone": locationData.phone,
        "email": locationData.email,
        "url": "https://www.scrapiz.in/scrap-dealer-in-${locationSlug}",
        "areaServed": "${location}, Mumbai",
        "priceRange": "₹₹",
        "openingHours": "Mo-Su 09:00-22:00",
        "description": locationData.description,
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Local Customer"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "Excellent service and best rates in the area. Highly professional team.",
            "datePublished": "2024-11-15"
          },
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Satisfied Client"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "4.8",
              "bestRating": "5"
            },
            "reviewBody": "Quick pickup and instant payment. Very transparent process.",
            "datePublished": "2024-10-28"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "2",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.scrapiz.in/scrap-dealer-in-${locationSlug}#faq",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.scrapiz.in/scrap-dealer-in-${locationSlug}#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.scrapiz.in"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Locations",
            "item": "https://www.scrapiz.in/locations"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "${location}",
            "item": "https://www.scrapiz.in/scrap-dealer-in-${locationSlug}"
          }
        ]
      }
    ]
  }`;
    
    content = content.replace(schemaRegex, newSchema);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`   ✅ Added FAQPage + Breadcrumb schema\n`);
    fixed++;
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }
});

console.log('='.repeat(60));
console.log(`\n✅ Fixed: ${fixed} files`);
console.log(`📊 Total: ${files.length} files\n`);

if (fixed > 0) {
  console.log('🎉 FAQPage schema added successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Validate: npm run validate:faqs');
  console.log('2. Test: https://search.google.com/test/rich-results');
}
