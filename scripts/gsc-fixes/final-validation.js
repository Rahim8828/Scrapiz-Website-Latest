#!/usr/bin/env node

/**
 * Final Validation Script
 * Comprehensive validation of all GSC fixes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n' + '='.repeat(80));
console.log('🎯 FINAL VALIDATION - GSC FIXES');
console.log('='.repeat(80) + '\n');

const results = {
  timestamp: new Date().toISOString(),
  validations: [],
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  }
};

// Validation 1: Check Sitemap
console.log('📋 1. SITEMAP VALIDATION');
console.log('-'.repeat(80));
try {
  const sitemapPath = path.join(__dirname, '../../public/sitemap.xml');
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  
  const urlCount = (sitemap.match(/<loc>/g) || []).length;
  const hasServiceRoutes = sitemap.includes('/services/scrap-collection') &&
                           sitemap.includes('/services/demolition-service');
  const hasOldRoutes = sitemap.includes('/scrap-collection-page') ||
                       sitemap.includes('/demolition-service-page');
  
  const validation = {
    name: 'Sitemap Validation',
    status: hasServiceRoutes && !hasOldRoutes ? 'PASSED' : 'FAILED',
    details: {
      totalUrls: urlCount,
      hasCorrectServiceRoutes: hasServiceRoutes,
      hasDeprecatedRoutes: hasOldRoutes
    }
  };
  
  results.validations.push(validation);
  results.summary.total++;
  
  if (validation.status === 'PASSED') {
    results.summary.passed++;
    console.log('✅ PASSED');
    console.log(`   - Total URLs: ${urlCount}`);
    console.log('   - Service routes: Correct format (/services/*)');
    console.log('   - No deprecated routes found');
  } else {
    results.summary.failed++;
    console.log('❌ FAILED');
    console.log(`   - Has deprecated routes: ${hasOldRoutes}`);
  }
} catch (error) {
  console.log('❌ ERROR:', error.message);
  results.summary.failed++;
}

console.log();

// Validation 2: Check .htaccess Redirects
console.log('🔀 2. REDIRECT VALIDATION');
console.log('-'.repeat(80));
try {
  const htaccessPath = path.join(__dirname, '../../public/.htaccess');
  const htaccess = fs.readFileSync(htaccessPath, 'utf-8');
  
  const redirectCount = (htaccess.match(/RewriteRule.*\[R=301,L\]/g) || []).length;
  const hasServiceRedirects = htaccess.includes('scrap-collection-page') &&
                               htaccess.includes('/services/scrap-collection');
  const uses301 = !htaccess.includes('[R=302');
  
  const validation = {
    name: 'Redirect Validation',
    status: hasServiceRedirects && uses301 ? 'PASSED' : 'FAILED',
    details: {
      totalRedirects: redirectCount,
      hasServiceRedirects: hasServiceRedirects,
      uses301Only: uses301
    }
  };
  
  results.validations.push(validation);
  results.summary.total++;
  
  if (validation.status === 'PASSED') {
    results.summary.passed++;
    console.log('✅ PASSED');
    console.log(`   - Total 301 redirects: ${redirectCount}`);
    console.log('   - Service page redirects: Configured');
    console.log('   - All redirects are 301 (permanent)');
  } else {
    results.summary.failed++;
    console.log('❌ FAILED');
  }
} catch (error) {
  console.log('❌ ERROR:', error.message);
  results.summary.failed++;
}

console.log();

// Validation 3: Check Schema Markup
console.log('📊 3. SCHEMA MARKUP VALIDATION');
console.log('-'.repeat(80));
try {
  const schemaReportPath = path.join(__dirname, 'reports/source-schema-audit.json');
  
  if (fs.existsSync(schemaReportPath)) {
    const schemaReport = JSON.parse(fs.readFileSync(schemaReportPath, 'utf-8'));
    
    const filesWithIssues = schemaReport.summary?.filesWithIssues || 0;
    
    const validation = {
      name: 'Schema Markup Validation',
      status: filesWithIssues === 0 ? 'PASSED' : 'WARNING',
      details: {
        totalFiles: schemaReport.summary?.totalFiles || 0,
        filesWithSchema: schemaReport.summary?.filesWithSchema || 0,
        filesWithIssues: filesWithIssues
      }
    };
    
    results.validations.push(validation);
    results.summary.total++;
    
    if (validation.status === 'PASSED') {
      results.summary.passed++;
      console.log('✅ PASSED');
    } else {
      results.summary.warnings++;
      console.log('⚠️  WARNING');
    }
    
    console.log(`   - Files audited: ${validation.details.totalFiles}`);
    console.log(`   - Files with schema: ${validation.details.filesWithSchema}`);
    console.log(`   - Files with issues: ${validation.details.filesWithIssues}`);
  } else {
    console.log('⚠️  Schema audit report not found');
    results.validations.push({
      name: 'Schema Markup Validation',
      status: 'WARNING',
      details: { message: 'Report not found' }
    });
    results.summary.total++;
    results.summary.warnings++;
  }
} catch (error) {
  console.log('❌ ERROR:', error.message);
  results.validations.push({
    name: 'Schema Markup Validation',
    status: 'FAILED',
    details: { error: error.message }
  });
  results.summary.total++;
  results.summary.failed++;
}

console.log();

// Validation 4: Check Canonical Tags
console.log('🔗 4. CANONICAL TAG VALIDATION');
console.log('-'.repeat(80));
try {
  const samplePages = [
    'src/pages/Home.jsx',
    'src/pages/Bandra.jsx',
    'src/pages/ScrapCollectionPage.jsx',
    'src/Scrap Category Pages/AluminiumScrapPage.jsx'
  ];
  
  let pagesWithCanonical = 0;
  let totalPages = 0;
  
  for (const pagePath of samplePages) {
    const fullPath = path.join(__dirname, '../../', pagePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes('rel="canonical"') || content.includes('rel=\'canonical\'')) {
        pagesWithCanonical++;
      }
      totalPages++;
    }
  }
  
  const validation = {
    name: 'Canonical Tag Validation',
    status: pagesWithCanonical === totalPages ? 'PASSED' : 'WARNING',
    details: {
      sampleSize: totalPages,
      pagesWithCanonical: pagesWithCanonical
    }
  };
  
  results.validations.push(validation);
  results.summary.total++;
  
  if (validation.status === 'PASSED') {
    results.summary.passed++;
    console.log('✅ PASSED');
    console.log(`   - Sample pages checked: ${totalPages}`);
    console.log(`   - Pages with canonical tags: ${pagesWithCanonical}`);
  } else {
    results.summary.warnings++;
    console.log('⚠️  WARNING');
    console.log(`   - Some pages missing canonical tags: ${totalPages - pagesWithCanonical}`);
  }
} catch (error) {
  console.log('❌ ERROR:', error.message);
  results.summary.failed++;
}

console.log();

// Validation 5: Check Robots.txt
console.log('🤖 5. ROBOTS.TXT VALIDATION');
console.log('-'.repeat(80));
try {
  const robotsPath = path.join(__dirname, '../../public/robots.txt');
  const robots = fs.readFileSync(robotsPath, 'utf-8');
  
  const hasSitemap = robots.includes('Sitemap:');
  const allowsResources = !robots.includes('Disallow: *.css') && 
                         !robots.includes('Disallow: *.js');
  
  const validation = {
    name: 'Robots.txt Validation',
    status: hasSitemap && allowsResources ? 'PASSED' : 'FAILED',
    details: {
      hasSitemapDirective: hasSitemap,
      allowsResources: allowsResources
    }
  };
  
  results.validations.push(validation);
  results.summary.total++;
  
  if (validation.status === 'PASSED') {
    results.summary.passed++;
    console.log('✅ PASSED');
    console.log('   - Sitemap directive: Present');
    console.log('   - Resources (CSS/JS): Not blocked');
  } else {
    results.summary.failed++;
    console.log('❌ FAILED');
  }
} catch (error) {
  console.log('❌ ERROR:', error.message);
  results.summary.failed++;
}

console.log();

// Validation 6: Check for Noindex Issues
console.log('🚫 6. NOINDEX TAG VALIDATION');
console.log('-'.repeat(80));
try {
  const samplePages = [
    'src/pages/Home.jsx',
    'src/pages/Bandra.jsx',
    'src/pages/ScrapCollectionPage.jsx'
  ];
  
  let pagesWithNoindex = 0;
  let totalPages = 0;
  
  for (const pagePath of samplePages) {
    const fullPath = path.join(__dirname, '../../', pagePath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes('noindex')) {
        pagesWithNoindex++;
      }
      totalPages++;
    }
  }
  
  const validation = {
    name: 'Noindex Tag Validation',
    status: pagesWithNoindex === 0 ? 'PASSED' : 'WARNING',
    details: {
      sampleSize: totalPages,
      pagesWithNoindex: pagesWithNoindex
    }
  };
  
  results.validations.push(validation);
  results.summary.total++;
  
  if (validation.status === 'PASSED') {
    results.summary.passed++;
    console.log('✅ PASSED');
    console.log(`   - Sample pages checked: ${totalPages}`);
    console.log('   - No inappropriate noindex tags found');
  } else {
    results.summary.warnings++;
    console.log('⚠️  WARNING');
    console.log(`   - Pages with noindex: ${pagesWithNoindex}`);
  }
} catch (error) {
  console.log('❌ ERROR:', error.message);
  results.summary.failed++;
}

console.log();

// Final Summary
console.log('='.repeat(80));
console.log('📊 FINAL VALIDATION SUMMARY');
console.log('='.repeat(80));
console.log(`Total Validations: ${results.summary.total}`);
console.log(`✅ Passed: ${results.summary.passed}`);
console.log(`⚠️  Warnings: ${results.summary.warnings}`);
console.log(`❌ Failed: ${results.summary.failed}`);
console.log();

const overallStatus = results.summary.failed === 0 ? 'PASSED' : 'FAILED';
const statusIcon = overallStatus === 'PASSED' ? '✅' : '❌';

console.log(`${statusIcon} Overall Status: ${overallStatus}`);
console.log('='.repeat(80));
console.log();

// Save results
const reportPath = path.join(__dirname, 'reports/final-validation-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`📄 Detailed report saved to: ${reportPath}`);
console.log();

// Exit with appropriate code
process.exit(results.summary.failed > 0 ? 1 : 0);
