/**
 * Integration test for Canonical Detection and Fixing
 * This test demonstrates the full workflow
 */

import CanonicalDetector from './CanonicalDetector.js';
import CanonicalFixer from './CanonicalFixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

async function testCanonicalIntegration() {
  console.log('=== Canonical Detection and Fix Integration Test ===\n');

  const logger = new Logger();
  const errorHandler = new ErrorHandler(logger);
  const detector = new CanonicalDetector(logger, errorHandler);
  const fixer = new CanonicalFixer(logger, errorHandler);

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: Extract canonical tag from HTML
  console.log('Test 1: Extract canonical tag from HTML');
  try {
    const html = '<html><head><link rel="canonical" href="https://example.com/page" /></head></html>';
    const canonical = detector.extractCanonicalTag(html, 'https://example.com/page');
    
    if (canonical === 'https://example.com/page') {
      console.log('✓ PASS: Canonical tag extracted correctly\n');
      testsPassed++;
    } else {
      console.log(`✗ FAIL: Expected https://example.com/page, got ${canonical}\n`);
      testsFailed++;
    }
  } catch (error) {
    console.log(`✗ FAIL: ${error.message}\n`);
    testsFailed++;
  }

  // Test 2: Extract canonical tag with relative URL
  console.log('Test 2: Extract canonical tag with relative URL');
  try {
    const html = '<html><head><link rel="canonical" href="/page" /></head></html>';
    const canonical = detector.extractCanonicalTag(html, 'https://example.com/other');
    
    if (canonical === 'https://example.com/page') {
      console.log('✓ PASS: Relative canonical URL resolved correctly\n');
      testsPassed++;
    } else {
      console.log(`✗ FAIL: Expected https://example.com/page, got ${canonical}\n`);
      testsFailed++;
    }
  } catch (error) {
    console.log(`✗ FAIL: ${error.message}\n`);
    testsFailed++;
  }

  // Test 3: Handle missing canonical tag
  console.log('Test 3: Handle missing canonical tag');
  try {
    const html = '<html><head><title>Test</title></head></html>';
    const canonical = detector.extractCanonicalTag(html, 'https://example.com/page');
    
    if (canonical === null) {
      console.log('✓ PASS: Missing canonical tag handled correctly\n');
      testsPassed++;
    } else {
      console.log(`✗ FAIL: Expected null, got ${canonical}\n`);
      testsFailed++;
    }
  } catch (error) {
    console.log(`✗ FAIL: ${error.message}\n`);
    testsFailed++;
  }

  // Test 4: Calculate content similarity
  console.log('Test 4: Calculate content similarity');
  try {
    const html1 = '<html><body><p>This is test content</p></body></html>';
    const html2 = '<html><body><p>This is test content</p></body></html>';
    const similarity = detector.calculateContentSimilarity(html1, html2);
    
    if (similarity > 0.9) {
      console.log(`✓ PASS: Identical content similarity = ${similarity.toFixed(2)}\n`);
      testsPassed++;
    } else {
      console.log(`✗ FAIL: Expected similarity > 0.9, got ${similarity.toFixed(2)}\n`);
      testsFailed++;
    }
  } catch (error) {
    console.log(`✗ FAIL: ${error.message}\n`);
    testsFailed++;
  }

  // Test 5: Detect different content
  console.log('Test 5: Detect different content');
  try {
    const html1 = '<html><body><p>First content</p></body></html>';
    const html2 = '<html><body><p>Completely different text</p></body></html>';
    const similarity = detector.calculateContentSimilarity(html1, html2);
    
    if (similarity < 0.5) {
      console.log(`✓ PASS: Different content similarity = ${similarity.toFixed(2)}\n`);
      testsPassed++;
    } else {
      console.log(`✗ FAIL: Expected similarity < 0.5, got ${similarity.toFixed(2)}\n`);
      testsFailed++;
    }
  } catch (error) {
    console.log(`✗ FAIL: ${error.message}\n`);
    testsFailed++;
  }

  // Test 6: Insert canonical tag into Helmet
  console.log('Test 6: Insert canonical tag into Helmet');
  try {
    const content = `
import { Helmet } from 'react-helmet';

function Page() {
  return (
    <div>
      <Helmet>
        <title>Test Page</title>
      </Helmet>
    </div>
  );
}
`;
    const canonicalUrl = 'https://example.com/page';
    const updated = fixer.insertCanonicalInHelmet(content, canonicalUrl);
    
    if (updated.includes('rel="canonical"') && updated.includes(canonicalUrl)) {
      console.log('✓ PASS: Canonical tag inserted into Helmet\n');
      testsPassed++;
    } else {
      console.log('✗ FAIL: Canonical tag not inserted correctly\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`✗ FAIL: ${error.message}\n`);
    testsFailed++;
  }

  // Test 7: Don't insert if canonical already exists
  console.log('Test 7: Don\'t insert if canonical already exists');
  try {
    const content = `
import { Helmet } from 'react-helmet';

function Page() {
  return (
    <div>
      <Helmet>
        <title>Test Page</title>
        <link rel="canonical" href="https://example.com/existing" />
      </Helmet>
    </div>
  );
}
`;
    const canonicalUrl = 'https://example.com/page';
    const updated = fixer.insertCanonicalInHelmet(content, canonicalUrl);
    
    if (updated === content) {
      console.log('✓ PASS: Existing canonical tag preserved\n');
      testsPassed++;
    } else {
      console.log('✗ FAIL: Content was modified when it shouldn\'t be\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`✗ FAIL: ${error.message}\n`);
    testsFailed++;
  }

  // Test 8: Replace canonical tag
  console.log('Test 8: Replace canonical tag');
  try {
    const content = `
import { Helmet } from 'react-helmet';

function Page() {
  return (
    <div>
      <Helmet>
        <title>Test Page</title>
        <link rel="canonical" href="https://example.com/old" />
      </Helmet>
    </div>
  );
}
`;
    const oldCanonical = 'https://example.com/old';
    const newCanonical = 'https://example.com/new';
    const updated = fixer.replaceCanonicalInHelmet(content, oldCanonical, newCanonical);
    
    if (updated.includes(newCanonical) && !updated.includes(oldCanonical)) {
      console.log('✓ PASS: Canonical tag replaced correctly\n');
      testsPassed++;
    } else {
      console.log('✗ FAIL: Canonical tag not replaced correctly\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`✗ FAIL: ${error.message}\n`);
    testsFailed++;
  }

  // Test 9: Get recommendation for invalid URL
  console.log('Test 9: Get recommendation for invalid URL');
  try {
    const validation = { reason: 'invalid-url', status: null };
    const recommendation = detector.getCanonicalRecommendation(validation);
    
    if (recommendation.includes('invalid')) {
      console.log('✓ PASS: Recommendation provided for invalid URL\n');
      testsPassed++;
    } else {
      console.log('✗ FAIL: Recommendation not appropriate\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`✗ FAIL: ${error.message}\n`);
    testsFailed++;
  }

  // Test 10: Get recommendation for noindex target
  console.log('Test 10: Get recommendation for noindex target');
  try {
    const validation = { reason: 'noindex', status: 200 };
    const recommendation = detector.getCanonicalRecommendation(validation);
    
    if (recommendation.includes('noindex')) {
      console.log('✓ PASS: Recommendation provided for noindex target\n');
      testsPassed++;
    } else {
      console.log('✗ FAIL: Recommendation not appropriate\n');
      testsFailed++;
    }
  } catch (error) {
    console.log(`✗ FAIL: ${error.message}\n`);
    testsFailed++;
  }

  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Total Tests: ${testsPassed + testsFailed}`);
  console.log(`Passed: ${testsPassed}`);
  console.log(`Failed: ${testsFailed}`);
  console.log(`Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);

  if (testsFailed === 0) {
    console.log('\n✓ All tests passed!');
    process.exit(0);
  } else {
    console.log('\n✗ Some tests failed');
    process.exit(1);
  }
}

// Run the integration test
testCanonicalIntegration().catch(error => {
  console.error('Integration test failed:', error);
  process.exit(1);
});
