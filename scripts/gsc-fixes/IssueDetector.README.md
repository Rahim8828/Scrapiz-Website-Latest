# Issue Detector Module

## Overview

The Issue Detector Module is a core component of the GSC Fix System that scans web pages and identifies various indexing issues that can prevent proper Google Search Console indexing.

## Features

### 1. Page Content Analysis
- **Word Count**: Counts words in page content
- **Heading Detection**: Identifies H1, H2, H3 headings
- **Internal Link Analysis**: Counts internal links
- **Body Content Validation**: Checks for substantial content

### 2. HTTP Status Checking
- **Status Code Detection**: Identifies HTTP status codes (200, 301, 302, 404, etc.)
- **Redirect Following**: Tracks complete redirect chains
- **Redirect Type Identification**: Distinguishes between 301 and 302 redirects

### 3. HTML Metadata Parsing
- **Canonical Tag Extraction**: Finds and validates canonical URLs
- **Meta Robots Detection**: Identifies noindex/nofollow directives
- **Title and Description**: Extracts SEO metadata
- **Open Graph Tags**: Parses OG tags

### 4. Issue Detection

#### Soft 404 Detection
Identifies pages that return 200 status but have characteristics of 404 pages:
- Thin content (< 300 words)
- Empty pages
- Low quality signals (no headings, no links)

#### Canonical Tag Issues
Detects problems with canonical tags:
- Missing canonical tags
- Invalid canonical targets
- Canonical targets with noindex
- Canonical chains

#### Redirect Issues
Identifies redirect problems:
- Redirect chains (A→B→C)
- Temporary redirects (302) that should be permanent (301)
- Redirects in sitemap

#### Noindex Tag Detection
Finds pages with noindex directives:
- Meta robots noindex
- X-Robots-Tag HTTP header noindex
- Identifies valuable pages that shouldn't be noindexed

#### Duplicate Content Detection
Basic duplicate content detection (to be enhanced in DuplicateDetector class)

## Usage

### Basic Usage

```javascript
import { initializeSystem } from './index.js';

// Initialize the system
const { logger, errorHandler, issueDetector } = await initializeSystem();

// Check a single URL for all issues
const issues = await issueDetector.detectIssuesForUrl('https://example.com/page');

// Check multiple URLs
const urls = [
  'https://example.com/page1',
  'https://example.com/page2',
  'https://example.com/page3'
];
const allIssues = await issueDetector.detectAllIssues(urls);
```

### Individual Checks

```javascript
// Check for soft 404
const soft404Issue = await issueDetector.checkSoft404(url);

// Check canonical tags
const canonicalIssue = await issueDetector.checkCanonicalTags(url);

// Check redirects
const redirectIssue = await issueDetector.checkRedirects(url);

// Check noindex tags
const noindexIssue = await issueDetector.checkNoindexTags(url);
```

### Content Analysis

```javascript
// Analyze page content
const html = '<html>...</html>';
const analysis = issueDetector.analyzePageContent(html);

console.log(analysis);
// {
//   wordCount: 450,
//   hasHeadings: true,
//   headings: { h1: 1, h2: 3, h3: 5 },
//   internalLinks: 12,
//   hasBodyContent: true,
//   textContent: '...'
// }
```

### HTTP Status Checking

```javascript
// Check HTTP status with redirect following
const statusResult = await issueDetector.checkHttpStatus(url);

console.log(statusResult);
// {
//   url: 'https://example.com/old',
//   status: 301,
//   redirectChain: [...],
//   finalUrl: 'https://example.com/new',
//   isRedirect: true,
//   redirectType: 301
// }
```

### Metadata Parsing

```javascript
// Parse HTML metadata
const html = '<html>...</html>';
const metadata = issueDetector.parseHtmlMetadata(html, url);

console.log(metadata);
// {
//   canonical: 'https://example.com/page',
//   metaRobots: 'index, follow',
//   noindex: false,
//   nofollow: false,
//   title: 'Page Title',
//   description: 'Page description',
//   ogTags: { 'og:title': '...' }
// }
```

## Issue Objects

### Soft404Issue
```javascript
{
  url: string,
  reason: 'thin-content' | 'empty-page' | 'low-quality',
  contentLength: number,
  wordCount: number,
  hasHeadings: boolean,
  hasInternalLinks: boolean,
  recommendation: string,
  fixable: boolean
}
```

### CanonicalIssue
```javascript
{
  url: string,
  currentCanonical: string | null,
  expectedCanonical: string,
  issueType: 'missing' | 'incorrect' | 'invalid-target' | 'noindex-target' | 'alternative-page',
  inSitemap: boolean,
  recommendation: string,
  fixable: boolean
}
```

### RedirectIssue
```javascript
{
  url: string,
  redirectChain: Array<string>,
  finalDestination: string,
  redirectType: number,
  inSitemap: boolean,
  internalLinksCount: number,
  recommendation: string,
  fixable: boolean
}
```

### NoindexIssue
```javascript
{
  url: string,
  noindexSource: 'meta-tag' | 'http-header' | 'meta-tag, http-header',
  shouldBeIndexed: boolean,
  inSitemap: boolean,
  hasBacklinks: boolean,
  recommendation: string,
  fixable: boolean
}
```

## Error Handling

The Issue Detector uses the ErrorHandler to gracefully handle errors:

- **Network Errors**: Retries with exponential backoff
- **Invalid URLs**: Skips and logs
- **Parsing Errors**: Logs and continues
- **Timeout Errors**: Retries up to 3 times

## Performance

- **Batch Processing**: Processes URLs in batches of 5 to avoid overwhelming the system
- **Delay Between Batches**: 1 second delay between batches
- **Timeout**: 10 second timeout per HTTP request
- **Max Redirects**: Follows up to 10 redirects

## Requirements Validation

This module validates the following requirements:

- **1.1**: Soft 404 content validation (>= 300 words)
- **1.2**: Non-existent page status (proper 404)
- **1.5**: Page structure validation (headings, links)
- **2.1**: Canonical target validation
- **4.5**: Comprehensive noindex detection (meta tags + HTTP headers)

## Testing

Run the test script to verify functionality:

```bash
node scripts/gsc-fixes/test-issue-detector.js
```

## Dependencies

- **axios**: HTTP client for making requests
- **cheerio**: HTML parsing and manipulation
- **utils.js**: Utility functions (countWords, extractTextFromHtml, normalizeUrl, etc.)
- **logger.js**: Logging functionality
- **errorHandler.js**: Error handling and recovery

## Future Enhancements

1. **Robots.txt Checking**: Add robots.txt parsing to detect blocked pages
2. **Enhanced Duplicate Detection**: Implement content similarity scoring
3. **Schema Validation**: Add structured data validation
4. **Sitemap Integration**: Check if URLs are in sitemap
5. **Backlink Checking**: Verify if pages have external backlinks
