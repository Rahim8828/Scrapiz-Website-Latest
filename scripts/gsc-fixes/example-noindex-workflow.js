/**
 * Example workflow for detecting and fixing noindex issues
 */

import NoindexDetector from './NoindexDetector.js';
import NoindexFixer from './NoindexFixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

async function runNoindexWorkflow() {
  // Initialize components
  const logger = new Logger();
  await logger.initialize();
  
  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();
  
  const detector = new NoindexDetector(logger, errorHandler);
  const fixer = new NoindexFixer(logger, errorHandler);

  console.log('=== Noindex Detection and Fix Workflow ===\n');

  // Step 1: Define URLs to check
  const baseUrl = 'https://scrapiz.com';
  const urlsToCheck = [
    'https://scrapiz.com/',
    'https://scrapiz.com/about',
    'https://scrapiz.com/services',
    'https://scrapiz.com/services/scrap-collection',
    'https://scrapiz.com/scrap-dealer-in-bandra',
    'https://scrapiz.com/scrap-dealer-in-dharavi',
    'https://scrapiz.com/blog'
  ];

  console.log(`Step 1: Checking ${urlsToCheck.length} URLs for noindex issues...\n`);

  // Step 2: Detect noindex issues
  const issues = [];
  
  for (const url of urlsToCheck) {
    console.log(`Checking: ${url}`);
    
    // In a real implementation, you would fetch page data
    // For this example, we'll use mock data
    const pageData = {
      wordCount: 800,
      hasHeadings: true,
      hasInternalLinks: true,
      hasBacklinks: url.includes('home') || url.includes('services'),
      isImportantPage: url === baseUrl || url.includes('services')
    };

    const issue = await detector.checkNoindex(url, {
      baseUrl,
      pageData
    });

    if (issue) {
      issues.push(issue);
      console.log(`  ⚠️  Noindex found: ${issue.noindexSource}`);
    } else {
      console.log(`  ✓ No noindex issues`);
    }
  }

  console.log(`\nFound ${issues.length} noindex issues\n`);

  if (issues.length === 0) {
    console.log('No noindex issues to fix. Workflow complete.');
    return;
  }

  // Step 3: Analyze issues
  console.log('Step 2: Analyzing noindex patterns...\n');
  const analysis = detector.analyzeNoindexPatterns(issues);
  
  console.log('Analysis Summary:');
  console.log(`  Total noindex pages: ${analysis.totalNoindex}`);
  console.log(`  Should be indexed: ${analysis.shouldBeIndexed}`);
  console.log(`  Correctly noindexed: ${analysis.correctlyNoindexed}`);
  console.log(`  By source:`);
  console.log(`    Meta tag: ${analysis.bySource['meta-tag']}`);
  console.log(`    HTTP header: ${analysis.bySource['http-header']}`);
  console.log(`    robots.txt: ${analysis.bySource['robots.txt']}`);
  console.log();

  // Step 4: Display issues that need fixing
  const fixableIssues = issues.filter(issue => issue.shouldBeIndexed && issue.fixable);
  
  console.log(`Step 3: Found ${fixableIssues.length} fixable issues:\n`);
  
  fixableIssues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.url}`);
    console.log(`   Source: ${issue.noindexSource}`);
    console.log(`   Recommendation: ${issue.recommendation}`);
    console.log();
  });

  if (fixableIssues.length === 0) {
    console.log('No fixable issues found. Manual intervention required for remaining issues.');
    return;
  }

  // Step 5: Dry run
  console.log('Step 4: Running dry run to preview changes...\n');
  
  const dryRunResult = await fixer.fixNoindexIssues(fixableIssues, {
    dryRun: true,
    removeMetaNoindex: true,
    removeHeaderNoindex: true
  });

  console.log('Dry Run Results:');
  dryRunResult.details.forEach((detail, index) => {
    console.log(`${index + 1}. ${detail.url}`);
    console.log(`   Status: ${detail.status}`);
    console.log(`   Message: ${detail.message}`);
    if (detail.actions) {
      detail.actions.forEach(action => {
        console.log(`   - ${action.action}: ${action.message}`);
      });
    }
    console.log();
  });

  // Step 6: Apply fixes (in real scenario, you'd prompt for confirmation)
  console.log('Step 5: Applying fixes...\n');
  
  const fixResult = await fixer.fixNoindexIssues(fixableIssues, {
    dryRun: false,
    removeMetaNoindex: true,
    removeHeaderNoindex: true
  });

  console.log('Fix Results:');
  console.log(`  Success: ${fixResult.success}`);
  console.log(`  Issues fixed: ${fixResult.issuesFixed}`);
  console.log(`  Issues failed: ${fixResult.issuesFailed}`);
  console.log();

  // Step 7: Display detailed results
  console.log('Detailed Results:\n');
  
  fixResult.details.forEach((detail, index) => {
    const icon = detail.status === 'fixed' ? '✓' : 
                 detail.status === 'manual-action-required' ? '⚠️' : '✗';
    
    console.log(`${icon} ${index + 1}. ${detail.url}`);
    console.log(`   Status: ${detail.status}`);
    console.log(`   Message: ${detail.message}`);
    console.log();
  });

  // Step 8: Next steps
  console.log('Step 6: Next Steps:\n');
  console.log('1. Review the changes in the modified files');
  console.log('2. Test the pages in a browser to verify noindex is removed');
  console.log('3. For manual action items:');
  console.log('   - Update server configuration for X-Robots-Tag headers');
  console.log('   - Update robots.txt file for blocked URLs');
  console.log('4. Update sitemap to include newly indexable pages');
  console.log('5. Submit URLs for re-indexing in Google Search Console');
  console.log('6. Monitor indexing status in GSC over the next few days');
  console.log();

  console.log('=== Workflow Complete ===');
}

// Run the workflow
runNoindexWorkflow().catch(error => {
  console.error('Workflow failed:', error);
  process.exit(1);
});
