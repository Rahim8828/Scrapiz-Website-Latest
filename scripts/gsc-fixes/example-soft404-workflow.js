import IssueDetector from './IssueDetector.js';
import Soft404Fixer from './Soft404Fixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

/**
 * Example workflow for detecting and fixing soft 404 issues
 * This demonstrates the complete process from detection to fix
 */
async function runSoft404Workflow() {
  console.log('=== Soft 404 Detection and Fix Workflow ===\n');

  // Step 1: Initialize components
  console.log('Step 1: Initializing components...');
  const logger = new Logger();
  await logger.initialize();

  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();

  const detector = new IssueDetector(logger, errorHandler);
  const fixer = new Soft404Fixer(logger, errorHandler);
  console.log('✓ Components initialized\n');

  // Step 2: Define URLs to check
  console.log('Step 2: Defining URLs to check...');
  const urlsToCheck = [
    'https://www.scrapiz.com/',
    'https://www.scrapiz.com/about',
    'https://www.scrapiz.com/services',
    'https://www.scrapiz.com/contact'
  ];
  console.log(`✓ ${urlsToCheck.length} URLs to check\n`);

  // Step 3: Detect soft 404 issues
  console.log('Step 3: Detecting soft 404 issues...');
  const detectedIssues = [];
  
  for (const url of urlsToCheck) {
    console.log(`  Checking: ${url}`);
    try {
      const issue = await detector.checkSoft404(url);
      if (issue) {
        detectedIssues.push(issue);
        console.log(`    ✗ Soft 404 detected: ${issue.reason}`);
      } else {
        console.log(`    ✓ No issues`);
      }
    } catch (error) {
      console.log(`    ✗ Error: ${error.message}`);
    }
  }
  
  console.log(`\n✓ Detection complete: ${detectedIssues.length} issues found\n`);

  // Step 4: Review detected issues
  if (detectedIssues.length > 0) {
    console.log('Step 4: Reviewing detected issues...');
    detectedIssues.forEach((issue, index) => {
      console.log(`\n  Issue ${index + 1}:`);
      console.log(`    URL: ${issue.url}`);
      console.log(`    Reason: ${issue.reason}`);
      console.log(`    Word count: ${issue.wordCount}`);
      console.log(`    Has headings: ${issue.hasHeadings}`);
      console.log(`    Has internal links: ${issue.hasInternalLinks}`);
      console.log(`    Recommendation: ${issue.recommendation}`);
    });
    console.log();

    // Step 5: Dry run fixes
    console.log('Step 5: Running dry run fixes...');
    const dryRunResult = await fixer.fixSoft404Issues(detectedIssues, {
      dryRun: true,
      enhanceContent: true,
      addRedirects: true
    });

    console.log(`\n  Dry run results:`);
    console.log(`    Would fix: ${dryRunResult.issuesFixed}`);
    console.log(`    Would fail: ${dryRunResult.issuesFailed}`);
    console.log();

    dryRunResult.details.forEach((detail, index) => {
      console.log(`  ${index + 1}. ${detail.url}`);
      console.log(`     Status: ${detail.status}`);
      console.log(`     Message: ${detail.message}`);
      if (detail.suggestions) {
        console.log(`     Suggestions:`, JSON.stringify(detail.suggestions, null, 2));
      }
    });
    console.log();

    // Step 6: Apply fixes (commented out for safety)
    console.log('Step 6: Apply fixes (skipped in example)');
    console.log('  To apply fixes, uncomment the following code:');
    console.log('  /*');
    console.log('  const fixResult = await fixer.fixSoft404Issues(detectedIssues, {');
    console.log('    dryRun: false,');
    console.log('    enhanceContent: true,');
    console.log('    addRedirects: true');
    console.log('  });');
    console.log('  */');
    console.log();

  } else {
    console.log('Step 4: No issues detected - nothing to fix!\n');
  }

  // Step 7: Generate summary
  console.log('Step 7: Generating summary...');
  const issueSummary = await logger.getIssueSummary();
  const fixSummary = await logger.getFixSummary();

  console.log('\n  Issue Summary:');
  Object.entries(issueSummary).forEach(([type, count]) => {
    console.log(`    ${type}: ${count}`);
  });

  console.log('\n  Fix Summary:');
  console.log(`    Successful: ${fixSummary.successful}`);
  console.log(`    Failed: ${fixSummary.failed}`);
  console.log();

  console.log('=== Workflow Complete ===');
  console.log(`Log file: ${logger.getLogFilePath()}`);
}

// Run workflow
runSoft404Workflow().catch(error => {
  console.error('Workflow failed:', error);
  process.exit(1);
});
