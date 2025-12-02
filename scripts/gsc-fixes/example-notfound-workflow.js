import NotFoundDetector from './NotFoundDetector.js';
import NotFoundFixer from './NotFoundFixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

/**
 * Example workflow for detecting and fixing 404 errors
 */

async function main() {
  // Initialize components
  const logger = new Logger();
  const errorHandler = new ErrorHandler(logger);
  const detector = new NotFoundDetector(logger, errorHandler);
  const fixer = new NotFoundFixer(logger, errorHandler);

  console.log('=== 404 Detection and Fixing Workflow ===\n');

  // Step 1: Define URLs to check
  console.log('Step 1: Defining URLs to check for 404 errors...');
  
  // URLs that might be 404s (from GSC, analytics, or sitemap)
  const urlsToCheck = [
    'https://scrapiz.com/old-service-page',
    'https://scrapiz.com/deleted-location',
    'https://scrapiz.com/moved-article',
    'https://scrapiz.com/scrap-collection-page', // Old URL format
    'https://scrapiz.com/demolition-service-page' // Old URL format
  ];

  // All current site URLs (for internal link scanning and finding redirect targets)
  const siteUrls = [
    'https://scrapiz.com/',
    'https://scrapiz.com/about',
    'https://scrapiz.com/services',
    'https://scrapiz.com/services/scrap-collection',
    'https://scrapiz.com/services/demolition-service',
    'https://scrapiz.com/locations/bandra',
    'https://scrapiz.com/locations/jogeshwari',
    'https://scrapiz.com/blog',
    // ... add all your site URLs
  ];

  console.log(`  Checking ${urlsToCheck.length} URLs`);
  console.log(`  Scanning ${siteUrls.length} site URLs for internal links\n`);

  // Step 2: Detect 404 issues
  console.log('Step 2: Detecting 404 errors...');
  const issues = await detector.detect404Issues(urlsToCheck, siteUrls);
  
  console.log(`  Found ${issues.length} 404 errors\n`);

  if (issues.length === 0) {
    console.log('No 404 errors found. Exiting.');
    return;
  }

  // Step 3: Analyze 404 patterns
  console.log('Step 3: Analyzing 404 patterns...');
  const analysis = detector.analyze404Patterns(issues);
  
  console.log(`  Total 404s: ${analysis.total404s}`);
  console.log(`  With backlinks: ${analysis.with404Backlinks}`);
  console.log(`  With internal links: ${analysis.withInternalLinks} (${analysis.totalInternalLinks} total links)`);
  console.log(`  Valuable (need redirects): ${analysis.shouldRedirect}`);
  console.log(`  Valueless (can ignore): ${analysis.valueless}\n`);

  // Step 4: Display issues
  console.log('Step 4: Reviewing 404 issues...\n');
  
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.url}`);
    console.log(`   Status: ${issue.status}`);
    console.log(`   Has backlinks: ${issue.hasBacklinks}`);
    console.log(`   Internal links: ${issue.internalLinksCount}`);
    console.log(`   Has value: ${issue.hasValue}`);
    console.log(`   Recommendation: ${issue.recommendation}`);
    
    if (issue.internalLinks && issue.internalLinks.length > 0) {
      console.log(`   Links from:`);
      issue.internalLinks.slice(0, 3).forEach(link => {
        console.log(`     - ${link.sourceUrl}`);
      });
      if (issue.internalLinks.length > 3) {
        console.log(`     ... and ${issue.internalLinks.length - 3} more`);
      }
    }
    console.log('');
  });

  // Step 5: Find redirect targets for valuable 404s
  console.log('Step 5: Finding redirect targets for valuable 404s...\n');
  
  const valuableIssues = issues.filter(issue => issue.hasValue);
  
  for (const issue of valuableIssues) {
    const redirectTarget = await detector.findBestRedirectTarget(issue.url, siteUrls);
    issue.suggestedTarget = redirectTarget;
    
    console.log(`${issue.url}`);
    console.log(`  -> ${redirectTarget || 'No suitable target found'}\n`);
  }

  // Step 6: Preview fixes (dry run)
  console.log('Step 6: Previewing fixes (dry run)...\n');
  
  const dryRunResult = await fixer.fix404Issues(issues, {
    dryRun: true,
    addRedirects: true,
    updateInternalLinks: true,
    updateHtaccess: true,
    siteUrls: siteUrls
  });

  console.log(`Would fix ${dryRunResult.issuesFixed} issues`);
  console.log(`Would fail ${dryRunResult.issuesFailed} issues`);
  console.log(`Would add ${dryRunResult.redirectRules.length} redirects`);
  console.log(`Would update ${dryRunResult.linksUpdated} internal links\n`);

  if (dryRunResult.redirectRules.length > 0) {
    console.log('Redirect rules to add:');
    dryRunResult.redirectRules.forEach(rule => {
      console.log(`  ${rule.rule}`);
    });
    console.log('');
  }

  // Step 7: Apply fixes
  console.log('Step 7: Applying fixes...\n');
  console.log('⚠️  This will modify .htaccess and potentially update source files.');
  console.log('⚠️  Make sure you have backups before proceeding.\n');

  // In production, you might want to prompt for confirmation here
  // For this example, we'll use dry run mode
  const applyFixes = false; // Set to true to actually apply fixes

  if (applyFixes) {
    const result = await fixer.fix404Issues(issues, {
      dryRun: false,
      addRedirects: true,
      updateInternalLinks: true,
      updateHtaccess: true,
      siteUrls: siteUrls
    });

    console.log(`✓ Fixed ${result.issuesFixed} issues`);
    console.log(`✗ Failed ${result.issuesFailed} issues`);
    console.log(`✓ Added ${result.redirectRules.length} redirects`);
    console.log(`✓ Updated ${result.linksUpdated} internal links`);
    
    if (result.htaccessUpdated) {
      console.log(`✓ Updated .htaccess: ${result.htaccessPath}`);
    }
    
    console.log('\nFix details:');
    result.details.forEach(detail => {
      console.log(`  ${detail.status}: ${detail.url}`);
      console.log(`    ${detail.message}`);
    });
  } else {
    console.log('Skipping actual fixes (applyFixes = false)');
    console.log('Set applyFixes = true to apply changes');
  }

  // Step 8: Generate report
  console.log('\nStep 8: Generating report...\n');
  
  const stats = fixer.get404Statistics(issues);
  
  console.log('=== 404 Fix Report ===');
  console.log(`Total 404s: ${stats.total}`);
  console.log(`Valuable (need redirects): ${stats.valuable}`);
  console.log(`Valueless (can ignore): ${stats.valueless}`);
  console.log(`With backlinks: ${stats.withBacklinks}`);
  console.log(`With internal links: ${stats.withInternalLinks} (${stats.totalInternalLinks} total)`);
  console.log(`Needs redirect: ${stats.needsRedirect}`);
  console.log(`Can ignore: ${stats.canIgnore}`);

  console.log('\n=== Workflow Complete ===');
}

// Run the workflow
main().catch(error => {
  console.error('Error in 404 workflow:', error);
  process.exit(1);
});
