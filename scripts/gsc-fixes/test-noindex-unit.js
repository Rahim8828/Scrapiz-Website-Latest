import NoindexDetector from './NoindexDetector.js';
import NoindexFixer from './NoindexFixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

/**
 * Unit test for Noindex detection and fixes
 * Tests the core logic without requiring live URLs
 */
async function runUnitTests() {
  console.log('=== Noindex Unit Tests ===\n');

  const logger = new Logger();
  await logger.initialize();

  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();

  const detector = new NoindexDetector(logger, errorHandler);
  const fixer = new NoindexFixer(logger, errorHandler);

  let passed = 0;
  let failed = 0;

  // Test 1: Detect noindex in meta robots tag
  console.log('Test 1: Detect noindex in meta robots tag');
  try {
    const html = `
      <html>
        <head>
          <title>Test Page</title>
          <meta name="robots" content="noindex, nofollow">
        </head>
        <body>
          <h1>Test</h1>
          <p>This page has noindex in meta tag.</p>
        </body>
      </html>
    `;
    const hasNoindex = detector.checkMetaRobotsNoindex(html);
    
    if (hasNoindex) {
      console.log('  ✓ PASS: Correctly detected noindex in meta robots tag');
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not detect noindex in meta robots tag');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 2: Detect noindex in googlebot meta tag
  console.log('Test 2: Detect noindex in googlebot meta tag');
  try {
    const html = `
      <html>
        <head>
          <title>Test Page</title>
          <meta name="googlebot" content="noindex">
        </head>
        <body>
          <h1>Test</h1>
        </body>
      </html>
    `;
    const hasNoindex = detector.checkMetaRobotsNoindex(html);
    
    if (hasNoindex) {
      console.log('  ✓ PASS: Correctly detected noindex in googlebot meta tag');
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not detect noindex in googlebot meta tag');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 3: No noindex when not present
  console.log('Test 3: No false positive when noindex not present');
  try {
    const html = `
      <html>
        <head>
          <title>Test Page</title>
          <meta name="robots" content="index, follow">
        </head>
        <body>
          <h1>Test</h1>
        </body>
      </html>
    `;
    const hasNoindex = detector.checkMetaRobotsNoindex(html);
    
    if (!hasNoindex) {
      console.log('  ✓ PASS: Correctly identified no noindex');
      passed++;
    } else {
      console.log('  ✗ FAIL: False positive - detected noindex when not present');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 4: Detect noindex in X-Robots-Tag header
  console.log('Test 4: Detect noindex in X-Robots-Tag HTTP header');
  try {
    const headers = {
      'x-robots-tag': 'noindex, nofollow'
    };
    const hasNoindex = detector.checkXRobotsTagNoindex(headers);
    
    if (hasNoindex) {
      console.log('  ✓ PASS: Correctly detected noindex in X-Robots-Tag header');
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not detect noindex in X-Robots-Tag header');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 5: Parse robots.txt
  console.log('Test 5: Parse robots.txt content');
  try {
    const robotsTxtContent = `
# robots.txt
User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /public/

User-agent: Googlebot
Disallow: /temp/
    `;
    const rules = detector.parseRobotsTxt(robotsTxtContent);
    
    if (rules.length >= 4 && 
        rules.some(r => r.path === '/admin/' && r.type === 'disallow') &&
        rules.some(r => r.path === '/public/' && r.type === 'allow')) {
      console.log('  ✓ PASS: Correctly parsed robots.txt');
      console.log(`    Found ${rules.length} rules`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not correctly parse robots.txt');
      console.log(`    Found ${rules.length} rules`);
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 6: Determine if page should be indexed (valuable page)
  console.log('Test 6: Determine if valuable page should be indexed');
  try {
    const pageData = {
      wordCount: 800,
      hasHeadings: true,
      hasInternalLinks: true,
      hasBacklinks: true,
      isImportantPage: false
    };
    const shouldBeIndexed = detector.shouldBeIndexed(pageData);
    
    if (shouldBeIndexed) {
      console.log('  ✓ PASS: Correctly identified valuable page should be indexed');
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not identify valuable page should be indexed');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 7: Determine if page should be indexed (thin content)
  console.log('Test 7: Determine if thin content page should not be indexed');
  try {
    const pageData = {
      wordCount: 150,
      hasHeadings: false,
      hasInternalLinks: false,
      hasBacklinks: false,
      isImportantPage: false
    };
    const shouldBeIndexed = detector.shouldBeIndexed(pageData);
    
    if (!shouldBeIndexed) {
      console.log('  ✓ PASS: Correctly identified thin content should not be indexed');
      passed++;
    } else {
      console.log('  ✗ FAIL: Incorrectly suggested thin content should be indexed');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 8: Important page should always be indexed
  console.log('Test 8: Important page should always be indexed');
  try {
    const pageData = {
      wordCount: 200,
      hasHeadings: false,
      hasInternalLinks: false,
      hasBacklinks: false,
      isImportantPage: true
    };
    const shouldBeIndexed = detector.shouldBeIndexed(pageData);
    
    if (shouldBeIndexed) {
      console.log('  ✓ PASS: Correctly identified important page should be indexed');
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not identify important page should be indexed');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 9: Generate recommendation for valuable page with noindex
  console.log('Test 9: Generate recommendation for valuable page with noindex');
  try {
    const recommendation = detector.getNoindexRecommendation(
      true,
      ['meta-tag', 'http-header'],
      { wordCount: 800, hasBacklinks: true }
    );
    
    if (recommendation.includes('Remove noindex') && recommendation.includes('valuable')) {
      console.log('  ✓ PASS: Correctly generated recommendation');
      console.log(`    Recommendation: ${recommendation}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not generate correct recommendation');
      console.log(`    Recommendation: ${recommendation}`);
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 10: Generate recommendation for correctly noindexed page
  console.log('Test 10: Generate recommendation for correctly noindexed page');
  try {
    const recommendation = detector.getNoindexRecommendation(
      false,
      ['meta-tag'],
      { wordCount: 100 }
    );
    
    if (recommendation.includes('correctly') && recommendation.includes('sitemap')) {
      console.log('  ✓ PASS: Correctly generated recommendation');
      console.log(`    Recommendation: ${recommendation}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not generate correct recommendation');
      console.log(`    Recommendation: ${recommendation}`);
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 11: Remove noindex from content
  console.log('Test 11: Remove noindex from HTML content');
  try {
    const html = `
      <html>
        <head>
          <title>Test</title>
          <meta name="robots" content="noindex, nofollow">
        </head>
        <body>
          <h1>Test</h1>
        </body>
      </html>
    `;
    const updatedContent = fixer.removeNoindexFromContent(html);
    
    // Check that noindex is removed
    if (!updatedContent.includes('noindex')) {
      console.log('  ✓ PASS: Successfully removed noindex from content');
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not remove noindex from content');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 12: Remove noindex but keep other directives
  console.log('Test 12: Remove noindex but keep other directives');
  try {
    const html = `
      <html>
        <head>
          <title>Test</title>
          <meta name="robots" content="noindex, nofollow, noarchive">
        </head>
        <body>
          <h1>Test</h1>
        </body>
      </html>
    `;
    const updatedContent = fixer.removeNoindexFromContent(html);
    
    // Check that noindex is removed but other directives remain
    if (!updatedContent.includes('noindex') && 
        updatedContent.includes('nofollow') && 
        updatedContent.includes('noarchive')) {
      console.log('  ✓ PASS: Removed noindex but kept other directives');
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not correctly handle multiple directives');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 13: Analyze noindex patterns
  console.log('Test 13: Analyze noindex patterns');
  try {
    const issues = [
      {
        url: 'http://example.com/page1',
        shouldBeIndexed: true,
        hasMetaNoindex: true,
        hasHeaderNoindex: false,
        isRobotsBlocked: false
      },
      {
        url: 'http://example.com/page2',
        shouldBeIndexed: false,
        hasMetaNoindex: true,
        hasHeaderNoindex: false,
        isRobotsBlocked: false
      },
      {
        url: 'http://example.com/page3',
        shouldBeIndexed: true,
        hasMetaNoindex: false,
        hasHeaderNoindex: true,
        isRobotsBlocked: false
      }
    ];
    
    const analysis = detector.analyzeNoindexPatterns(issues);
    
    if (analysis.totalNoindex === 3 && 
        analysis.shouldBeIndexed === 2 && 
        analysis.correctlyNoindexed === 1 &&
        analysis.bySource['meta-tag'] === 2 &&
        analysis.bySource['http-header'] === 1) {
      console.log('  ✓ PASS: Correctly analyzed noindex patterns');
      console.log(`    Total: ${analysis.totalNoindex}`);
      console.log(`    Should be indexed: ${analysis.shouldBeIndexed}`);
      console.log(`    Correctly noindexed: ${analysis.correctlyNoindexed}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not correctly analyze noindex patterns');
      console.log(`    Analysis:`, analysis);
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 14: Fix noindex issues (dry run)
  console.log('Test 14: Fix noindex issues (dry run)');
  try {
    const issues = [
      {
        url: 'http://example.com/page1',
        shouldBeIndexed: true,
        fixable: true,
        hasMetaNoindex: true,
        hasHeaderNoindex: false,
        isRobotsBlocked: false,
        noindexSource: 'meta-tag'
      }
    ];
    
    const result = await fixer.fixNoindexIssues(issues, { dryRun: true });
    
    if (result.details && result.details.length === 1 && result.details[0].status === 'dry-run') {
      console.log('  ✓ PASS: Dry run executed correctly');
      console.log(`    Status: ${result.details[0].status}`);
      console.log(`    Message: ${result.details[0].message}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Dry run did not execute correctly');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 15: Skip non-fixable issues
  console.log('Test 15: Skip non-fixable issues');
  try {
    const issues = [
      {
        url: 'http://example.com/page1',
        shouldBeIndexed: false, // Should not be indexed
        fixable: false,
        hasMetaNoindex: true,
        hasHeaderNoindex: false,
        isRobotsBlocked: false,
        noindexSource: 'meta-tag'
      }
    ];
    
    const result = await fixer.fixNoindexIssues(issues, { dryRun: false });
    
    if (result.issuesFixed === 0 && result.issuesFailed === 0) {
      console.log('  ✓ PASS: Correctly skipped non-fixable issues');
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not skip non-fixable issues');
      console.log(`    Fixed: ${result.issuesFixed}, Failed: ${result.issuesFailed}`);
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Summary
  console.log('=== Test Summary ===');
  console.log(`Total tests: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log();
  console.log(`Log file: ${logger.getLogFilePath()}`);

  return failed === 0;
}

// Run tests
runUnitTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
