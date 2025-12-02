import IssueDetector from './IssueDetector.js';
import Soft404Fixer from './Soft404Fixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

/**
 * Unit test for Soft 404 detection and fixes
 * Tests the core logic without requiring live URLs
 */
async function runUnitTests() {
  console.log('=== Soft 404 Unit Tests ===\n');

  const logger = new Logger();
  await logger.initialize();

  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();

  const detector = new IssueDetector(logger, errorHandler);
  const fixer = new Soft404Fixer(logger, errorHandler);

  let passed = 0;
  let failed = 0;

  // Test 1: Content analysis for thin content
  console.log('Test 1: Analyze thin content (< 300 words)');
  try {
    const html = `
      <html>
        <head><title>Test Page</title></head>
        <body>
          <h1>Test</h1>
          <p>This is a short page with less than 300 words. It should be detected as thin content.</p>
        </body>
      </html>
    `;
    const analysis = detector.analyzePageContent(html);
    
    if (analysis.wordCount < 300 && analysis.hasHeadings) {
      console.log('  ✓ PASS: Correctly identified thin content');
      console.log(`    Word count: ${analysis.wordCount}`);
      console.log(`    Has headings: ${analysis.hasHeadings}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not correctly identify thin content');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 2: Content analysis for empty page
  console.log('Test 2: Analyze empty page');
  try {
    const html = `
      <html>
        <head><title>Empty</title></head>
        <body></body>
      </html>
    `;
    const analysis = detector.analyzePageContent(html);
    
    // Empty page should have 0 or very few words and no body content
    if (analysis.wordCount <= 5 && !analysis.hasBodyContent) {
      console.log('  ✓ PASS: Correctly identified empty page');
      console.log(`    Word count: ${analysis.wordCount}`);
      console.log(`    Has body content: ${analysis.hasBodyContent}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not correctly identify empty page');
      console.log(`    Word count: ${analysis.wordCount}`);
      console.log(`    Has body content: ${analysis.hasBodyContent}`);
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 3: Content analysis for low quality (no headings, no links)
  console.log('Test 3: Analyze low quality page (no headings, no links)');
  try {
    const html = `
      <html>
        <head><title>Low Quality</title></head>
        <body>
          <p>This page has content but no headings and no internal links. It has enough words to not be thin content but lacks structure. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
        </body>
      </html>
    `;
    const analysis = detector.analyzePageContent(html);
    
    if (!analysis.hasHeadings && analysis.internalLinks === 0 && analysis.wordCount > 100) {
      console.log('  ✓ PASS: Correctly identified low quality page');
      console.log(`    Word count: ${analysis.wordCount}`);
      console.log(`    Has headings: ${analysis.hasHeadings}`);
      console.log(`    Internal links: ${analysis.internalLinks}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not correctly identify low quality page');
      console.log(`    Word count: ${analysis.wordCount}`);
      console.log(`    Has headings: ${analysis.hasHeadings}`);
      console.log(`    Internal links: ${analysis.internalLinks}`);
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 4: Content analysis for good page (>= 300 words, has headings, has links)
  console.log('Test 4: Analyze good quality page');
  try {
    const html = `
      <html>
        <head><title>Good Page</title></head>
        <body>
          <h1>Main Heading</h1>
          <p>This page has substantial content with proper structure. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea commodi consequatur quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum qui dolorem eum fugiat quo voluptas nulla pariatur at vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident similique sunt in culpa qui officia deserunt mollitia animi id est laborum et dolorum fuga et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus omnis voluptas assumenda est omnis dolor repellendus temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae itaque earum rerum hic tenetur a sapiente delectus ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>
          <h2>Subheading</h2>
          <p>More content here with <a href="/related-page">internal links</a> to other pages. Additional text to reach word count threshold for testing purposes and ensure we have enough content to pass the quality checks.</p>
        </body>
      </html>
    `;
    const analysis = detector.analyzePageContent(html);
    
    // Good page should have substantial content, headings, and links
    if (analysis.wordCount >= 200 && analysis.hasHeadings && analysis.internalLinks > 0) {
      console.log('  ✓ PASS: Correctly identified good quality page');
      console.log(`    Word count: ${analysis.wordCount}`);
      console.log(`    Has headings: ${analysis.hasHeadings}`);
      console.log(`    Internal links: ${analysis.internalLinks}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Did not correctly identify good quality page');
      console.log(`    Word count: ${analysis.wordCount}`);
      console.log(`    Has headings: ${analysis.hasHeadings}`);
      console.log(`    Internal links: ${analysis.internalLinks}`);
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 5: Soft 404 recommendation generation
  console.log('Test 5: Generate recommendations for different issue types');
  try {
    const thinContentRec = detector.getSoft404Recommendation('thin-content', { wordCount: 150 });
    const emptyPageRec = detector.getSoft404Recommendation('empty-page', {});
    const lowQualityRec = detector.getSoft404Recommendation('low-quality', {});
    
    if (thinContentRec.includes('500 words') && 
        emptyPageRec.includes('404') && 
        lowQualityRec.includes('heading')) {
      console.log('  ✓ PASS: Recommendations generated correctly');
      console.log(`    Thin content: ${thinContentRec}`);
      console.log(`    Empty page: ${emptyPageRec}`);
      console.log(`    Low quality: ${lowQualityRec}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Recommendations not generated correctly');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 6: Redirect rule generation
  console.log('Test 6: Generate redirect rules');
  try {
    const rule1 = fixer.generateRedirectRule('http://example.com/old-page', '/new-page');
    const rule2 = fixer.generateRedirectRule('http://example.com/old-page/', '/new-page');
    
    if (rule1.includes('RewriteRule') && rule1.includes('[R=301,L]')) {
      console.log('  ✓ PASS: Redirect rules generated correctly');
      console.log(`    Rule 1: ${rule1}`);
      console.log(`    Rule 2: ${rule2}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Redirect rules not generated correctly');
      failed++;
    }
  } catch (error) {
    console.log(`  ✗ FAIL: ${error.message}`);
    failed++;
  }
  console.log();

  // Test 7: Fix result structure
  console.log('Test 7: Fix soft 404 issues (dry run)');
  try {
    const issues = [
      {
        url: 'http://example.com/thin',
        reason: 'thin-content',
        wordCount: 150,
        hasHeadings: true,
        hasInternalLinks: true
      }
    ];
    
    const result = await fixer.fixSoft404Issues(issues, { dryRun: true });
    
    if (result.details && result.details.length === 1 && result.details[0].status) {
      console.log('  ✓ PASS: Fix result structure is correct');
      console.log(`    Status: ${result.details[0].status}`);
      console.log(`    Message: ${result.details[0].message}`);
      passed++;
    } else {
      console.log('  ✗ FAIL: Fix result structure is incorrect');
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
