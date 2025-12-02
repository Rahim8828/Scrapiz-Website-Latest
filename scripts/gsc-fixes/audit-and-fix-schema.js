#!/usr/bin/env node

/**
 * Schema Audit and Fix Script
 * Audits all pages with schema markup and fixes errors
 * 
 * Usage:
 *   node scripts/gsc-fixes/audit-and-fix-schema.js [--fix] [--validate-google]
 */

import SchemaValidator from './SchemaValidator.js';
import SchemaFixer from './SchemaFixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'http://localhost:5173'; // Vite dev server
const PAGES_TO_AUDIT = [
  // Location pages
  '/bandra',
  '/bandra-east',
  '/dharavi',
  '/dharavi-koliwada',
  '/goregaon',
  '/jogeshwari',
  '/kandivali',
  '/mahim',
  '/nalasopara',
  
  // Service pages
  '/services/scrap-collection',
  '/services/demolition-service',
  '/services/dismantling',
  '/services/paper-shredding',
  '/services/society-tie-up',
  '/services/junk-removal-service',
  '/services/vehicle-scrapping',
  
  // Scrap category pages
  '/scrap/aluminium',
  '/scrap/brass',
  '/scrap/copper',
  '/scrap/iron-steel',
  '/scrap/stainless-steel',
  '/scrap/e-waste',
  '/scrap/ac',
  '/scrap/refrigerator',
  '/scrap/washing-machine',
  '/scrap/microwave',
  
  // Other pages
  '/',
  '/about',
  '/contact',
  '/blog'
];

// Map URLs to source files
function urlToFilePath(url) {
  const urlMap = {
    '/': 'src/pages/Home.jsx',
    '/about': 'src/pages/About.jsx',
    '/contact': 'src/pages/Contact.jsx',
    '/blog': 'src/pages/Blog.jsx',
    '/bandra': 'src/pages/Bandra.jsx',
    '/bandra-east': 'src/pages/BandraEast.jsx',
    '/dharavi': 'src/pages/Dharavi.jsx',
    '/dharavi-koliwada': 'src/pages/DharaviKoliwada.jsx',
    '/goregaon': 'src/pages/Goregaon.jsx',
    '/jogeshwari': 'src/pages/Jogeshwari.jsx',
    '/kandivali': 'src/pages/Kandivali.jsx',
    '/mahim': 'src/pages/Mahim.jsx',
    '/nalasopara': 'src/pages/Nalasopara.jsx',
    '/services/scrap-collection': 'src/pages/ScrapCollectionPage.jsx',
    '/services/demolition-service': 'src/pages/DemolitionServicePage.jsx',
    '/services/dismantling': 'src/pages/DismantlingPage.jsx',
    '/services/paper-shredding': 'src/pages/PaperShreddingPage.jsx',
    '/services/society-tie-up': 'src/pages/SocietyTieUpPage.jsx',
    '/services/junk-removal-service': 'src/pages/JunkRemovalServicePage.jsx',
    '/services/vehicle-scrapping': 'src/pages/VehicleScrappingPage.jsx',
    '/scrap/aluminium': 'src/Scrap Category Pages/AluminiumScrapPage.jsx',
    '/scrap/brass': 'src/Scrap Category Pages/BrassScrapPage.jsx',
    '/scrap/copper': 'src/Scrap Category Pages/CopperScrapPage.jsx',
    '/scrap/iron-steel': 'src/Scrap Category Pages/Iron&SteelScrapPage.jsx',
    '/scrap/stainless-steel': 'src/Scrap Category Pages/StainlessSteelScrapPage.jsx',
    '/scrap/e-waste': 'src/Scrap Category Pages/E-wasteScrapPage.jsx',
    '/scrap/ac': 'src/Scrap Category Pages/ACScrapPage.jsx',
    '/scrap/refrigerator': 'src/Scrap Category Pages/RefrigiratorScrapPage.jsx',
    '/scrap/washing-machine': 'src/Scrap Category Pages/WashingmachineScrapPage.jsx',
    '/scrap/microwave': 'src/Scrap Category Pages/MicrowaveScrapPage.jsx'
  };

  return urlMap[url] || null;
}

async function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  const validateGoogle = args.includes('--validate-google');

  console.log('\n' + '='.repeat(80));
  console.log('🔍 SCHEMA MARKUP AUDIT');
  console.log('='.repeat(80) + '\n');

  // Initialize components
  const logger = new Logger('scripts/gsc-fixes/logs');
  await logger.initialize();
  const errorHandler = new ErrorHandler(logger);
  const validator = new SchemaValidator(logger, errorHandler);
  const fixer = new SchemaFixer(logger, errorHandler);

  // Build full URLs
  const urls = PAGES_TO_AUDIT.map(path => `${BASE_URL}${path}`);

  console.log(`📋 Auditing ${urls.length} pages for schema markup issues...\n`);

  // Validate all schemas
  const issues = await validator.validateSchemas(urls);

  if (issues.length === 0) {
    console.log('✅ No schema issues found! All pages have valid structured data.\n');
    return;
  }

  console.log(`\n⚠️  Found ${issues.length} pages with schema issues:\n`);

  // Display issues by page
  issues.forEach((issue, index) => {
    const urlPath = issue.url.replace(BASE_URL, '');
    console.log(`${index + 1}. ${urlPath}`);
    console.log(`   ${issue.recommendation}`);
    
    issue.issues.forEach(schemaIssue => {
      console.log(`   Schema Type: ${schemaIssue.schemaType}`);
      
      const errors = schemaIssue.errors.filter(e => e.severity === 'error');
      const warnings = schemaIssue.errors.filter(e => e.severity === 'warning');
      
      if (errors.length > 0) {
        console.log(`   ❌ Errors (${errors.length}):`);
        errors.forEach(err => {
          console.log(`      - ${err.field}: ${err.message}`);
        });
      }
      
      if (warnings.length > 0) {
        console.log(`   ⚠️  Warnings (${warnings.length}):`);
        warnings.forEach(warn => {
          console.log(`      - ${warn.field}: ${warn.message}`);
        });
      }
    });
    console.log('');
  });

  // Generate summary report
  const totalErrors = issues.reduce((sum, issue) => {
    return sum + issue.issues.reduce((issueSum, schemaIssue) => {
      return issueSum + schemaIssue.errors.filter(e => e.severity === 'error').length;
    }, 0);
  }, 0);

  const totalWarnings = issues.reduce((sum, issue) => {
    return sum + issue.issues.reduce((issueSum, schemaIssue) => {
      return issueSum + schemaIssue.errors.filter(e => e.severity === 'warning').length;
    }, 0);
  }, 0);

  console.log('📊 Summary:');
  console.log(`   Pages with issues: ${issues.length}`);
  console.log(`   Total errors: ${totalErrors}`);
  console.log(`   Total warnings: ${totalWarnings}\n`);

  // Save detailed report
  const reportPath = path.join(__dirname, 'reports', 'schema-audit-report.json');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(issues, null, 2));
  console.log(`📄 Detailed report saved to: ${reportPath}\n`);

  // Fix issues if requested
  if (shouldFix) {
    console.log('🔧 Applying fixes...\n');

    const filePathResolver = (url) => {
      const urlPath = url.replace(BASE_URL, '');
      const filePath = urlToFilePath(urlPath);
      if (!filePath) {
        throw new Error(`No file mapping for URL: ${urlPath}`);
      }
      return path.join(process.cwd(), filePath);
    };

    const fixResults = await fixer.fixSchemaIssues(issues, filePathResolver);

    console.log('\n✅ Fix Results:');
    console.log(`   Fixed: ${fixResults.fixed}`);
    console.log(`   Failed: ${fixResults.failed}`);
    console.log(`   Skipped: ${fixResults.skipped}\n`);

    // Save fix report
    const fixReportPath = path.join(__dirname, 'reports', 'schema-fix-report.json');
    await fs.writeFile(fixReportPath, JSON.stringify(fixResults, null, 2));
    console.log(`📄 Fix report saved to: ${fixReportPath}\n`);

    if (fixResults.fixed > 0) {
      console.log('⚠️  Note: Automatic fixes use placeholder values.');
      console.log('   Please review and update with actual business information.\n');
    }
  } else {
    console.log('💡 Tip: Run with --fix flag to automatically fix schema errors');
    console.log('   Example: node scripts/gsc-fixes/audit-and-fix-schema.js --fix\n');
  }

  if (validateGoogle) {
    console.log('🌐 Google Rich Results Test validation not yet implemented');
    console.log('   Please manually test at: https://search.google.com/test/rich-results\n');
  }

  console.log('='.repeat(80) + '\n');
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
