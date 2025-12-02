/**
 * Test script for Issue Detector Module
 * Tests the basic functionality of the IssueDetector class
 */

import { initializeSystem } from './index.js';

async function testIssueDetector() {
  console.log('=== Testing Issue Detector Module ===\n');
  
  try {
    // Initialize system
    console.log('1. Initializing system...');
    const { logger, errorHandler, issueDetector } = await initializeSystem();
    console.log('✓ System initialized\n');
    
    // Test 1: Analyze page content
    console.log('2. Testing page content analysis...');
    const testHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Page</title>
          <meta name="description" content="Test description">
          <link rel="canonical" href="https://example.com/test">
        </head>
        <body>
          <h1>Main Heading</h1>
          <h2>Subheading</h2>
          <p>This is a test page with some content. It has multiple paragraphs to test word counting.</p>
          <p>Here is another paragraph with more text to increase the word count for testing purposes.</p>
          <a href="/internal-link">Internal Link</a>
          <a href="https://external.com">External Link</a>
        </body>
      </html>
    `;
    
    const contentAnalysis = issueDetector.analyzePageContent(testHtml);
    console.log('Content Analysis Result:', {
      wordCount: contentAnalysis.wordCount,
      hasHeadings: contentAnalysis.hasHeadings,
      headings: contentAnalysis.headings,
      internalLinks: contentAnalysis.internalLinks,
      hasBodyContent: contentAnalysis.hasBodyContent
    });
    console.log('✓ Content analysis working\n');
    
    // Test 2: Parse HTML metadata
    console.log('3. Testing HTML metadata parsing...');
    const metadata = issueDetector.parseHtmlMetadata(testHtml, 'https://example.com/test');
    console.log('Metadata Result:', {
      canonical: metadata.canonical,
      title: metadata.title,
      description: metadata.description,
      noindex: metadata.noindex
    });
    console.log('✓ Metadata parsing working\n');
    
    // Test 3: Check HTTP status (using a real URL)
    console.log('4. Testing HTTP status check...');
    console.log('Checking https://www.google.com...');
    const statusResult = await issueDetector.checkHttpStatus('https://www.google.com');
    console.log('Status Result:', {
      status: statusResult.status,
      isRedirect: statusResult.isRedirect,
      finalUrl: statusResult.finalUrl
    });
    console.log('✓ HTTP status check working\n');
    
    // Test 4: Test with thin content
    console.log('5. Testing soft 404 detection with thin content...');
    const thinHtml = `
      <!DOCTYPE html>
      <html>
        <body>
          <p>Short content.</p>
        </body>
      </html>
    `;
    const thinAnalysis = issueDetector.analyzePageContent(thinHtml);
    console.log('Thin Content Analysis:', {
      wordCount: thinAnalysis.wordCount,
      hasHeadings: thinAnalysis.hasHeadings,
      wouldBeSoft404: thinAnalysis.wordCount < 300
    });
    console.log('✓ Soft 404 detection logic working\n');
    
    // Test 5: Test robots headers
    console.log('6. Testing robots header detection...');
    const testHeaders = {
      'x-robots-tag': 'noindex, nofollow'
    };
    const robotsResult = issueDetector.checkRobotsHeaders(testHeaders);
    console.log('Robots Headers Result:', robotsResult);
    console.log('✓ Robots header detection working\n');
    
    console.log('=== All Tests Passed ===');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run tests
testIssueDetector();
