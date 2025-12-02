#!/usr/bin/env node

/**
 * Source Schema Audit Script
 * Audits schema markup directly from source files
 * 
 * Usage:
 *   node scripts/gsc-fixes/audit-source-schema.js [--fix]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to audit
const FILES_TO_AUDIT = [
  // Location pages
  'src/pages/Bandra.jsx',
  'src/pages/BandraEast.jsx',
  'src/pages/Dharavi.jsx',
  'src/pages/DharaviKoliwada.jsx',
  'src/pages/Goregaon.jsx',
  'src/pages/Jogeshwari.jsx',
  'src/pages/Kandivali.jsx',
  'src/pages/Mahim.jsx',
  'src/pages/Nalasopara.jsx',
  
  // Service pages
  'src/pages/ScrapCollectionPage.jsx',
  'src/pages/DemolitionServicePage.jsx',
  'src/pages/DismantlingPage.jsx',
  'src/pages/PaperShreddingPage.jsx',
  'src/pages/SocietyTieUpPage.jsx',
  'src/pages/JunkRemovalServicePage.jsx',
  'src/pages/VehicleScrappingPage.jsx',
  
  // Scrap category pages
  'src/Scrap Category Pages/AluminiumScrapPage.jsx',
  'src/Scrap Category Pages/BrassScrapPage.jsx',
  'src/Scrap Category Pages/CopperScrapPage.jsx',
  'src/Scrap Category Pages/Iron&SteelScrapPage.jsx',
  'src/Scrap Category Pages/StainlessSteelScrapPage.jsx',
  'src/Scrap Category Pages/E-wasteScrapPage.jsx',
  'src/Scrap Category Pages/ACScrapPage.jsx',
  'src/Scrap Category Pages/RefrigiratorScrapPage.jsx',
  'src/Scrap Category Pages/WashingmachineScrapPage.jsx',
  'src/Scrap Category Pages/MicrowaveScrapPage.jsx',
  
  // Other pages
  'src/pages/Home.jsx',
  'src/pages/About.jsx',
  'src/pages/Contact.jsx',
  'src/pages/Blog.jsx'
];

/**
 * Extract schema from JSX file content
 */
function extractSchemaFromJSX(content) {
  const schemas = [];
  
  // Look for JSON.stringify(schema) patterns
  const schemaRegex = /JSON\.stringify\((\w+)\)/g;
  let match;
  
  while ((match = schemaRegex.exec(content)) !== null) {
    const varName = match[1];
    
    // Try to find the variable definition
    const varRegex = new RegExp(`const\\s+${varName}\\s*=\\s*({[\\s\\S]*?});`, 'm');
    const varMatch = content.match(varRegex);
    
    if (varMatch) {
      try {
        // This is a simplified extraction - in reality we'd need a proper parser
        schemas.push({
          variableName: varName,
          raw: varMatch[1]
        });
      } catch (error) {
        // Skip if can't parse
      }
    }
  }
  
  return schemas;
}

/**
 * Check if file has schema markup
 */
async function checkFileForSchema(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    
    // Check for schema-related patterns
    const hasSchemaImport = content.includes('generateLocationSchema') || 
                           content.includes('application/ld+json');
    const hasSchemaTag = content.includes('type="application/ld+json"');
    const hasJSONStringify = content.includes('JSON.stringify');
    
    // Extract schemas
    const schemas = extractSchemaFromJSX(content);
    
    // Check for common schema issues
    const issues = [];
    
    if (!hasSchemaTag && !hasSchemaImport) {
      issues.push({
        severity: 'error',
        field: 'schema',
        message: 'No schema markup found in file'
      });
    }
    
    // Check for LocalBusiness schema patterns
    if (content.includes('LocalBusiness') || content.includes('RecyclingCenter')) {
      // Check for required fields
      if (!content.includes('address')) {
        issues.push({
          severity: 'error',
          field: 'address',
          message: 'LocalBusiness schema missing address field'
        });
      }
      if (!content.includes('telephone')) {
        issues.push({
          severity: 'error',
          field: 'telephone',
          message: 'LocalBusiness schema missing telephone field'
        });
      }
      if (!content.includes('name')) {
        issues.push({
          severity: 'warning',
          field: 'name',
          message: 'LocalBusiness schema may be missing name field'
        });
      }
    }
    
    // Check for FAQPage schema
    if (content.includes('FAQPage')) {
      if (!content.includes('mainEntity')) {
        issues.push({
          severity: 'error',
          field: 'mainEntity',
          message: 'FAQPage schema missing mainEntity field'
        });
      }
    }
    
    return {
      filePath,
      hasSchema: hasSchemaTag || hasSchemaImport,
      schemas,
      issues
    };
  } catch (error) {
    return {
      filePath,
      hasSchema: false,
      schemas: [],
      issues: [{
        severity: 'error',
        field: 'file',
        message: `Failed to read file: ${error.message}`
      }],
      error: error.message
    };
  }
}

/**
 * Validate schema structure in locationData
 */
async function validateLocationData() {
  try {
    const locationDataPath = path.join(process.cwd(), 'src/data/locationData.js');
    const content = await fs.readFile(locationDataPath, 'utf-8');
    
    const issues = [];
    
    // Check for required fields in location data
    const requiredFields = [
      'nap.businessName',
      'nap.address',
      'nap.phone',
      'nap.email',
      'geo.latitude',
      'geo.longitude'
    ];
    
    requiredFields.forEach(field => {
      if (!content.includes(field.split('.')[1])) {
        issues.push({
          severity: 'warning',
          field,
          message: `Location data may be missing ${field}`
        });
      }
    });
    
    return {
      filePath: 'src/data/locationData.js',
      issues
    };
  } catch (error) {
    return {
      filePath: 'src/data/locationData.js',
      issues: [{
        severity: 'error',
        field: 'file',
        message: `Failed to read locationData: ${error.message}`
      }]
    };
  }
}

/**
 * Main audit function
 */
async function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');

  console.log('\n' + '='.repeat(80));
  console.log('🔍 SOURCE FILE SCHEMA AUDIT');
  console.log('='.repeat(80) + '\n');

  console.log(`📋 Auditing ${FILES_TO_AUDIT.length} source files for schema markup...\n`);

  const results = [];
  
  for (const filePath of FILES_TO_AUDIT) {
    const result = await checkFileForSchema(filePath);
    results.push(result);
  }

  // Also check locationData
  const locationDataResult = await validateLocationData();
  results.push(locationDataResult);

  // Filter files with issues
  const filesWithIssues = results.filter(r => r.issues && r.issues.length > 0);
  const filesWithoutSchema = results.filter(r => !r.hasSchema);
  const filesWithSchema = results.filter(r => r.hasSchema);

  console.log('📊 Summary:');
  console.log(`   Total files audited: ${results.length}`);
  console.log(`   Files with schema: ${filesWithSchema.length}`);
  console.log(`   Files without schema: ${filesWithoutSchema.length}`);
  console.log(`   Files with issues: ${filesWithIssues.length}\n`);

  if (filesWithoutSchema.length > 0) {
    console.log('⚠️  Files without schema markup:');
    filesWithoutSchema.forEach(file => {
      console.log(`   - ${file.filePath}`);
    });
    console.log('');
  }

  if (filesWithIssues.length > 0) {
    console.log('❌ Files with schema issues:\n');
    filesWithIssues.forEach((file, index) => {
      console.log(`${index + 1}. ${file.filePath}`);
      file.issues.forEach(issue => {
        const icon = issue.severity === 'error' ? '❌' : '⚠️';
        console.log(`   ${icon} ${issue.field}: ${issue.message}`);
      });
      console.log('');
    });
  }

  // Save detailed report
  const reportPath = path.join(__dirname, 'reports', 'source-schema-audit.json');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed report saved to: ${reportPath}\n`);

  if (shouldFix) {
    console.log('🔧 Automatic fixing not yet implemented for source files');
    console.log('   Manual review and fixes required\n');
  }

  console.log('='.repeat(80) + '\n');
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
