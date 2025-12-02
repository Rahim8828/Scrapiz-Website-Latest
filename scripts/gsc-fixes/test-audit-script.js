#!/usr/bin/env node

/**
 * Test script for main audit
 * Tests with a small subset of URLs
 */

import MainAudit from './audit-all-issues.js';

async function testAudit() {
  console.log('Starting audit test...\n');

  const audit = new MainAudit({
    baseUrl: 'https://scrapiz.com',
    sitemapPath: 'public/sitemap.xml',
    includeSchemaValidation: false, // Disable for faster testing
    includeDuplicateDetection: false, // Disable for faster testing
    includeInternalLinkScan: false, // Disable for faster testing
    batchSize: 3
  });

  try {
    // Initialize
    await audit.initialize();
    console.log('✓ Audit system initialized\n');

    // Get URLs (limit to first 5 for testing)
    const allUrls = await audit.getAllUrls();
    const testUrls = allUrls.slice(0, 5);
    console.log(`✓ Found ${allUrls.length} URLs in sitemap`);
    console.log(`  Testing with first ${testUrls.length} URLs\n`);

    // Run detectors
    const issueReport = await audit.runAllDetectors(testUrls);
    
    // Display results
    console.log('\n' + '='.repeat(80));
    console.log('TEST AUDIT RESULTS');
    console.log('='.repeat(80));
    console.log(`Total Pages Tested: ${issueReport.totalPages}`);
    console.log(`Total Issues Found: ${issueReport.summary.totalIssues}`);
    console.log(`  Critical: ${issueReport.summary.criticalIssues}`);
    console.log(`  Warnings: ${issueReport.summary.warningIssues}`);
    console.log(`  Fixable: ${issueReport.summary.fixableIssues}`);
    console.log('');
    console.log('Issues by Type:');
    console.log(`  Soft 404: ${issueReport.issues.soft404.length}`);
    console.log(`  Canonical: ${issueReport.issues.canonical.length}`);
    console.log(`  Redirects: ${issueReport.issues.redirects.length}`);
    console.log(`  Noindex: ${issueReport.issues.noindex.length}`);
    console.log(`  Duplicates: ${issueReport.issues.duplicates.length}`);
    console.log(`  404 Errors: ${issueReport.issues.notFound.length}`);
    console.log(`  Invalid Schema: ${issueReport.issues.invalidSchema.length}`);
    console.log('='.repeat(80));
    console.log('\n✓ Test completed successfully!');
    
    return true;
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error(error.stack);
    return false;
  }
}

testAudit()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
