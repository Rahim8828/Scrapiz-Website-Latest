import DuplicateDetector from './DuplicateDetector.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

/**
 * Unit tests for DuplicateDetector
 */

async function runTests() {
  const logger = new Logger();
  const errorHandler = new ErrorHandler(logger);
  const detector = new DuplicateDetector(logger, errorHandler);

  console.log('=== DuplicateDetector Unit Tests ===\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Primary version selection - HTTPS preferred
  console.log('Test 1: Primary version selection - HTTPS preferred');
  try {
    const urls = ['http://example.com/page', 'https://example.com/page'];
    const primary = detector.selectPrimaryVersion(urls);
    if (primary === 'https://example.com/page') {
      console.log('✓ PASSED: HTTPS correctly selected as primary\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected https://example.com/page, got ${primary}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 2: Primary version selection - No parameters preferred
  console.log('Test 2: Primary version selection - No parameters preferred');
  try {
    const urls = [
      'https://example.com/page?utm_source=google',
      'https://example.com/page'
    ];
    const primary = detector.selectPrimaryVersion(urls);
    if (primary === 'https://example.com/page') {
      console.log('✓ PASSED: URL without parameters correctly selected\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected https://example.com/page, got ${primary}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 3: Primary version selection - No trailing slash preferred
  console.log('Test 3: Primary version selection - No trailing slash preferred');
  try {
    const urls = [
      'https://example.com/page/',
      'https://example.com/page'
    ];
    const primary = detector.selectPrimaryVersion(urls);
    if (primary === 'https://example.com/page') {
      console.log('✓ PASSED: URL without trailing slash correctly selected\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected https://example.com/page, got ${primary}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 4: URL parameter normalization
  console.log('Test 4: URL parameter normalization');
  try {
    const url = 'https://example.com/page?utm_source=google&id=123&utm_campaign=summer';
    const normalized = detector.normalizeUrlParameters(url);
    const urlObj = new URL(normalized);
    const hasUtmParams = urlObj.searchParams.has('utm_source') || urlObj.searchParams.has('utm_campaign');
    const hasIdParam = urlObj.searchParams.has('id');
    
    if (!hasUtmParams && hasIdParam) {
      console.log('✓ PASSED: UTM parameters removed, other parameters preserved\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected UTM params removed, got ${normalized}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 5: Protocol consistency detection
  console.log('Test 5: Protocol consistency detection');
  try {
    const urls = [
      'http://example.com/page',
      'https://example.com/page',
      'https://example.com/other'
    ];
    const analysis = detector.checkProtocolConsistency(urls);
    
    if (analysis.hasProtocolIssues && analysis.duplicateProtocols.length === 1) {
      console.log('✓ PASSED: Protocol inconsistency detected\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected 1 protocol issue, got ${analysis.duplicateProtocols.length}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 6: Trailing slash normalization
  console.log('Test 6: Trailing slash normalization');
  try {
    const urls = [
      'https://example.com/page',
      'https://example.com/page/',
      'https://example.com/other'
    ];
    const analysis = detector.normalizeTrailingSlashes(urls);
    
    if (analysis.hasIssues && analysis.trailingSlashIssues.length === 1) {
      console.log('✓ PASSED: Trailing slash variation detected\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected 1 trailing slash issue, got ${analysis.trailingSlashIssues.length}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 7: Content similarity calculation
  console.log('Test 7: Content similarity calculation');
  try {
    const text1 = 'This is a test page with some content';
    const text2 = 'This is a test page with some content';
    const text3 = 'This is completely different content';
    
    const similarity1 = detector.calculateContentSimilarity(text1, text2);
    const similarity2 = detector.calculateContentSimilarity(text1, text3);
    
    if (similarity1 === 1.0 && similarity2 < 0.8) {
      console.log('✓ PASSED: Similarity calculation works correctly\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected similarity1=1.0, similarity2<0.8, got ${similarity1}, ${similarity2}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 8: Primary selection with multiple criteria
  console.log('Test 8: Primary selection with multiple criteria');
  try {
    const urls = [
      'http://example.com/page?ref=home',
      'https://example.com/page/',
      'https://example.com/page',
      'http://example.com/page'
    ];
    const primary = detector.selectPrimaryVersion(urls);
    
    // Should select HTTPS, no params, no trailing slash
    if (primary === 'https://example.com/page') {
      console.log('✓ PASSED: Best primary version selected with multiple criteria\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected https://example.com/page, got ${primary}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 9: Empty URL array handling
  console.log('Test 9: Empty URL array handling');
  try {
    const primary = detector.selectPrimaryVersion([]);
    if (primary === null) {
      console.log('✓ PASSED: Empty array handled correctly\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected null, got ${primary}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Test 10: Single URL handling
  console.log('Test 10: Single URL handling');
  try {
    const url = 'https://example.com/page';
    const primary = detector.selectPrimaryVersion([url]);
    if (primary === url) {
      console.log('✓ PASSED: Single URL returned as primary\n');
      passed++;
    } else {
      console.log(`✗ FAILED: Expected ${url}, got ${primary}\n`);
      failed++;
    }
  } catch (error) {
    console.log(`✗ FAILED: ${error.message}\n`);
    failed++;
  }

  // Summary
  console.log('=== Test Summary ===');
  console.log(`Total tests: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  return failed === 0;
}

// Run tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
