import IssueDetector from './IssueDetector.js';
import Soft404Fixer from './Soft404Fixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

/**
 * Test script for Soft 404 detection and fixes
 */
async function testSoft404() {
  console.log('=== Testing Soft 404 Detection and Fixes ===\n');

  // Initialize components
  const logger = new Logger();
  await logger.initialize();

  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();

  const detector = new IssueDetector(logger, errorHandler);
  const fixer = new Soft404Fixer(logger, errorHandler);

  // Test URLs (these would be real URLs in production)
  const testUrls = [
    'http://localhost:5173/',
    'http://localhost:5173/about',
    'http://localhost:5173/contact'
  ];

  console.log('1. Testing Soft 404 Detection\n');
  console.log('Note: This test requires the dev server to be running on localhost:5173\n');

  for (const url of testUrls) {
    console.log(`Checking: ${url}`);
    try {
      const issue = await detector.checkSoft404(url);
      if (issue) {
        console.log('  ✗ Soft 404 detected:');
        console.log(`    Reason: ${issue.reason}`);
        console.log(`    Word count: ${issue.wordCount}`);
        console.log(`    Has headings: ${issue.hasHeadings}`);
        console.log(`    Has internal links: ${issue.hasInternalLinks}`);
        console.log(`    Recommendation: ${issue.recommendation}`);
      } else {
        console.log('  ✓ No soft 404 issue');
      }
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    }
    console.log();
  }

  console.log('\n2. Testing Soft 404 Fixes (Dry Run)\n');

  // Create sample issues for testing
  const sampleIssues = [
    {
      url: 'http://localhost:5173/test-thin-content',
      reason: 'thin-content',
      contentLength: 500,
      wordCount: 150,
      hasHeadings: true,
      hasInternalLinks: true,
      recommendation: 'Enhance content to at least 500 words (currently 150 words)',
      fixable: true
    },
    {
      url: 'http://localhost:5173/test-empty-page',
      reason: 'empty-page',
      contentLength: 100,
      wordCount: 0,
      hasHeadings: false,
      hasInternalLinks: false,
      recommendation: 'Add substantial body content or return proper 404 status',
      fixable: true
    },
    {
      url: 'http://localhost:5173/test-low-quality',
      reason: 'low-quality',
      contentLength: 800,
      wordCount: 400,
      hasHeadings: false,
      hasInternalLinks: false,
      recommendation: 'Add proper heading structure and internal links',
      fixable: true
    }
  ];

  const fixResult = await fixer.fixSoft404Issues(sampleIssues, { dryRun: true });

  console.log('Fix Results:');
  console.log(`  Total issues: ${sampleIssues.length}`);
  console.log(`  Fixed: ${fixResult.issuesFixed}`);
  console.log(`  Failed: ${fixResult.issuesFailed}`);
  console.log(`  Success: ${fixResult.success}`);
  console.log();

  console.log('Details:');
  fixResult.details.forEach((detail, index) => {
    console.log(`  ${index + 1}. ${detail.url}`);
    console.log(`     Status: ${detail.status}`);
    console.log(`     Message: ${detail.message}`);
    if (detail.suggestions) {
      console.log(`     Suggestions:`, detail.suggestions);
    }
    console.log();
  });

  console.log('\n=== Test Complete ===');
  console.log(`Log file: ${logger.getLogFilePath()}`);
}

// Run test
testSoft404().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
