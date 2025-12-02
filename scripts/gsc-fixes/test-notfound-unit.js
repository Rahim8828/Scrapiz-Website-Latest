import NotFoundDetector from './NotFoundDetector.js';
import NotFoundFixer from './NotFoundFixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

/**
 * Unit tests for 404 detection and fixing
 */

async function testNotFoundDetector() {
  console.log('Testing NotFoundDetector...\n');

  const logger = new Logger();
  const errorHandler = new ErrorHandler(logger);
  const detector = new NotFoundDetector(logger, errorHandler);

  // Test 1: Extract links from page
  console.log('Test 1: Extract links from page');
  try {
    const links = await detector.extractLinksFromPage('https://scrapiz.com');
    console.log(`  ✓ Extracted ${links.length} links`);
    if (links.length > 0) {
      console.log(`  Sample link: ${links[0].href}`);
    }
  } catch (error) {
    console.log(`  ✗ Failed: ${error.message}`);
  }

  // Test 2: Get 404 recommendation
  console.log('\nTest 2: Get 404 recommendation');
  const rec1 = detector.get404Recommendation(true, 5);
  console.log(`  With backlinks and 5 internal links:`);
  console.log(`    ${rec1}`);
  
  const rec2 = detector.get404Recommendation(false, 0);
  console.log(`  Without backlinks or internal links:`);
  console.log(`    ${rec2}`);

  // Test 3: Analyze 404 patterns
  console.log('\nTest 3: Analyze 404 patterns');
  const mockIssues = [
    {
      url: 'https://example.com/page1',
      hasBacklinks: true,
      internalLinksCount: 5,
      hasValue: true
    },
    {
      url: 'https://example.com/page2',
      hasBacklinks: false,
      internalLinksCount: 3,
      hasValue: true
    },
    {
      url: 'https://example.com/page3',
      hasBacklinks: false,
      internalLinksCount: 0,
      hasValue: false
    }
  ];

  const analysis = detector.analyze404Patterns(mockIssues);
  console.log(`  Total 404s: ${analysis.total404s}`);
  console.log(`  With backlinks: ${analysis.with404Backlinks}`);
  console.log(`  With internal links: ${analysis.withInternalLinks}`);
  console.log(`  Should redirect: ${analysis.shouldRedirect}`);
  console.log(`  Valueless: ${analysis.valueless}`);

  // Test 4: Find best redirect target
  console.log('\nTest 4: Find best redirect target');
  const siteUrls = [
    'https://example.com/',
    'https://example.com/services',
    'https://example.com/services/scrap-collection',
    'https://example.com/services/demolition',
    'https://example.com/about'
  ];

  const notFoundUrl = 'https://example.com/services/old-service';
  const redirectTarget = await detector.findBestRedirectTarget(notFoundUrl, siteUrls);
  console.log(`  404 URL: ${notFoundUrl}`);
  console.log(`  Best target: ${redirectTarget}`);

  console.log('\n✓ NotFoundDetector tests complete\n');
}

async function testNotFoundFixer() {
  console.log('Testing NotFoundFixer...\n');

  const logger = new Logger();
  const errorHandler = new ErrorHandler(logger);
  const fixer = new NotFoundFixer(logger, errorHandler);

  // Test 1: Generate redirect rule
  console.log('Test 1: Generate redirect rule');
  const rule = fixer.generateRedirectRule(
    'https://example.com/old-page',
    'https://example.com/new-page'
  );
  
  if (rule) {
    console.log(`  From: ${rule.fromPath}`);
    console.log(`  To: ${rule.toPath}`);
    console.log(`  Rule: ${rule.rule}`);
    console.log(`  ✓ Redirect rule generated`);
  } else {
    console.log(`  ✗ Failed to generate redirect rule`);
  }

  // Test 2: Escape regex pattern
  console.log('\nTest 2: Escape regex pattern');
  const patterns = [
    'simple-page',
    'page-with-dots.html',
    'page-with-special-chars?param=value',
    'page/with/slashes'
  ];

  patterns.forEach(pattern => {
    const escaped = fixer.escapeRegexPattern(pattern);
    console.log(`  ${pattern} -> ${escaped}`);
  });

  // Test 3: Get 404 statistics
  console.log('\nTest 3: Get 404 statistics');
  const mockIssues = [
    {
      url: 'https://example.com/page1',
      hasBacklinks: true,
      internalLinksCount: 5,
      hasValue: true
    },
    {
      url: 'https://example.com/page2',
      hasBacklinks: false,
      internalLinksCount: 3,
      hasValue: true
    },
    {
      url: 'https://example.com/page3',
      hasBacklinks: false,
      internalLinksCount: 0,
      hasValue: false
    }
  ];

  const stats = fixer.get404Statistics(mockIssues);
  console.log(`  Total: ${stats.total}`);
  console.log(`  Valuable: ${stats.valuable}`);
  console.log(`  Valueless: ${stats.valueless}`);
  console.log(`  With backlinks: ${stats.withBacklinks}`);
  console.log(`  With internal links: ${stats.withInternalLinks}`);
  console.log(`  Needs redirect: ${stats.needsRedirect}`);

  // Test 4: Find similar URL
  console.log('\nTest 4: Find similar URL');
  const siteUrls = [
    'https://example.com/',
    'https://example.com/services',
    'https://example.com/services/scrap-collection',
    'https://example.com/services/demolition',
    'https://example.com/about'
  ];

  const notFoundUrl = 'https://example.com/services/old-service';
  const similarUrl = await fixer.findSimilarUrl(notFoundUrl, siteUrls);
  console.log(`  404 URL: ${notFoundUrl}`);
  console.log(`  Similar URL: ${similarUrl}`);

  // Test 5: Fix 404 issues (dry run)
  console.log('\nTest 5: Fix 404 issues (dry run)');
  const result = await fixer.fix404Issues(mockIssues, {
    dryRun: true,
    addRedirects: true,
    updateInternalLinks: false,
    updateHtaccess: false,
    siteUrls: siteUrls
  });

  console.log(`  Issues fixed: ${result.issuesFixed}`);
  console.log(`  Issues failed: ${result.issuesFailed}`);
  console.log(`  Redirect rules: ${result.redirectRules.length}`);
  console.log(`  Success: ${result.success}`);

  console.log('\n✓ NotFoundFixer tests complete\n');
}

async function runTests() {
  console.log('=== 404 Detection and Fixing Unit Tests ===\n');

  try {
    await testNotFoundDetector();
    await testNotFoundFixer();

    console.log('=== All Tests Complete ===');
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

runTests();
