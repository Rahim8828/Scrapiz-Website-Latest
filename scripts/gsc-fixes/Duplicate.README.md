# Duplicate Content Detector

## Overview

The DuplicateDetector module identifies duplicate content across your website and provides recommendations for canonical tag implementation. It handles content-based duplicates, URL parameter variations, protocol inconsistencies (HTTP vs HTTPS), and trailing slash variations.

## Features

- **Content Similarity Detection**: Uses text similarity algorithms to identify duplicate or near-duplicate content
- **Primary Version Selection**: Intelligently selects the best primary version based on multiple criteria
- **URL Parameter Handling**: Normalizes URLs with tracking parameters and query strings
- **Protocol Consistency**: Detects HTTP/HTTPS variations of the same content
- **Trailing Slash Normalization**: Identifies URLs that differ only by trailing slashes
- **Canonical Tag Detection**: Checks existing canonical tags to avoid duplicate fixes

## Usage

### Basic Usage

```javascript
import DuplicateDetector from './DuplicateDetector.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const detector = new DuplicateDetector(logger, errorHandler);

// Check for duplicates
const urls = [
  'https://example.com/page',
  'https://example.com/page/',
  'http://example.com/page',
  'https://example.com/page?utm_source=google'
];

const duplicateIssues = await detector.checkDuplicates(urls);
console.log('Duplicate issues found:', duplicateIssues);
```

### Comprehensive Analysis

```javascript
// Get comprehensive duplicate analysis
const analysis = await detector.analyzeDuplicates(urls);

console.log('Total URLs:', analysis.totalUrls);
console.log('Duplicate groups:', analysis.duplicateGroups);
console.log('Protocol issues:', analysis.protocolAnalysis.duplicateProtocols.length);
console.log('Trailing slash issues:', analysis.trailingSlashAnalysis.trailingSlashIssues.length);
```

### Custom Similarity Threshold

```javascript
// Use custom similarity threshold (default is 0.8)
const duplicates = await detector.checkDuplicates(urls, 0.9);
```

### Protocol Consistency Check

```javascript
// Check for HTTP/HTTPS variations
const protocolAnalysis = detector.checkProtocolConsistency(urls);

if (protocolAnalysis.hasProtocolIssues) {
  console.log('Protocol issues found:');
  protocolAnalysis.duplicateProtocols.forEach(issue => {
    console.log(`Path: ${issue.path}`);
    console.log(`URLs: ${issue.urls.join(', ')}`);
    console.log(`Preferred: ${issue.preferredUrl}`);
  });
}
```

### Trailing Slash Normalization

```javascript
// Check for trailing slash variations
const trailingSlashAnalysis = detector.normalizeTrailingSlashes(urls);

if (trailingSlashAnalysis.hasIssues) {
  console.log('Trailing slash issues found:');
  trailingSlashAnalysis.trailingSlashIssues.forEach(issue => {
    console.log(`URLs: ${issue.urls.join(', ')}`);
    console.log(`Preferred: ${issue.preferredUrl}`);
  });
}
```

## API Reference

### Constructor

```javascript
new DuplicateDetector(logger, errorHandler)
```

- `logger`: Logger instance for logging operations
- `errorHandler`: ErrorHandler instance for error recovery

### Methods

#### `detectDuplicateContent(url, compareUrls, threshold)`

Detects duplicate content by comparing a URL against a list of URLs.

**Parameters:**
- `url` (string): URL to check
- `compareUrls` (Array<string>): URLs to compare against
- `threshold` (number, optional): Similarity threshold (0-1), default 0.8

**Returns:** Promise<Array<Object>> - Array of duplicate matches

#### `selectPrimaryVersion(urls)`

Selects the best primary version from duplicate URLs using scoring criteria.

**Parameters:**
- `urls` (Array<string>): Array of duplicate URLs

**Returns:** string - Primary URL

**Selection Criteria:**
- Prefers HTTPS over HTTP (+10 points)
- Prefers URLs without parameters (+5 points)
- Prefers URLs without trailing slash (+3 points)
- Prefers shorter URLs (simpler is better)
- Prefers URLs without fragments (+2 points)

#### `normalizeUrlParameters(url, ignoreParams)`

Normalizes URLs by removing tracking parameters.

**Parameters:**
- `url` (string): URL to normalize
- `ignoreParams` (Array<string>, optional): Parameters to ignore, defaults to common tracking params

**Returns:** string - Normalized URL

#### `checkProtocolConsistency(urls)`

Checks for HTTP/HTTPS variations of the same content.

**Parameters:**
- `urls` (Array<string>): URLs to check

**Returns:** Object - Protocol consistency analysis

#### `normalizeTrailingSlashes(urls)`

Identifies URLs that differ only by trailing slashes.

**Parameters:**
- `urls` (Array<string>): URLs to check

**Returns:** Object - Trailing slash analysis

#### `findDuplicates(url, allUrls, threshold)`

Finds all duplicates for a specific URL.

**Parameters:**
- `url` (string): URL to check
- `allUrls` (Array<string>): All URLs to compare against
- `threshold` (number, optional): Similarity threshold

**Returns:** Promise<Object|null> - Duplicate issue or null

#### `analyzeDuplicates(urls, threshold)`

Performs comprehensive duplicate analysis across all URLs.

**Parameters:**
- `urls` (Array<string>): All URLs to analyze
- `threshold` (number, optional): Similarity threshold

**Returns:** Promise<Object> - Comprehensive analysis

#### `checkDuplicates(urls, threshold)`

Batch checks duplicates for multiple URLs.

**Parameters:**
- `urls` (Array<string>): URLs to check
- `threshold` (number, optional): Similarity threshold

**Returns:** Promise<Array<Object>> - Array of duplicate issues

#### `clearCache()`

Clears the internal page cache.

## Output Format

### Duplicate Issue Object

```javascript
{
  url: 'https://example.com/page',
  duplicateOf: 'https://example.com/primary-page', // null if this is primary
  duplicates: ['https://example.com/page2', 'https://example.com/page3'],
  similarityScore: 0.95,
  hasCanonical: false,
  canonicalTarget: null,
  recommendation: 'Add canonical tag pointing to https://example.com/primary-page',
  fixable: true
}
```

### Analysis Object

```javascript
{
  totalUrls: 100,
  duplicateGroups: 5,
  protocolAnalysis: {
    totalUrls: 100,
    httpCount: 10,
    httpsCount: 90,
    duplicateProtocols: [...],
    hasProtocolIssues: true,
    recommendation: '...'
  },
  trailingSlashAnalysis: {
    totalUrls: 100,
    trailingSlashIssues: [...],
    hasIssues: true,
    recommendation: '...'
  },
  duplicateIssues: [...],
  summary: {
    contentDuplicates: 5,
    protocolIssues: 3,
    trailingSlashIssues: 2,
    totalIssues: 10
  }
}
```

## Best Practices

1. **Set Appropriate Threshold**: Use 0.8-0.9 for most cases. Lower values may produce false positives.

2. **Process in Batches**: For large sites, process URLs in batches to avoid memory issues.

3. **Clear Cache Periodically**: Call `clearCache()` after processing large batches.

4. **Handle Errors**: Always wrap calls in try-catch blocks and handle errors appropriately.

5. **Review Results**: Manually review duplicate groups before applying fixes, especially for edge cases.

## Requirements Validation

This module validates the following requirements:

- **5.1**: Detects duplicate content and identifies primary version
- **5.2**: Implements canonical tags for duplicate pages
- **5.3**: Handles URL parameters creating duplicates
- **5.4**: Ensures protocol consistency (HTTP vs HTTPS)
- **5.5**: Normalizes trailing slash variations

## Example Workflow

```javascript
// 1. Initialize detector
const detector = new DuplicateDetector(logger, errorHandler);

// 2. Get all URLs from sitemap
const urls = await getSitemapUrls();

// 3. Run comprehensive analysis
const analysis = await detector.analyzeDuplicates(urls);

// 4. Log summary
console.log(`Found ${analysis.summary.totalIssues} total issues`);
console.log(`- Content duplicates: ${analysis.summary.contentDuplicates}`);
console.log(`- Protocol issues: ${analysis.summary.protocolIssues}`);
console.log(`- Trailing slash issues: ${analysis.summary.trailingSlashIssues}`);

// 5. Process each duplicate group
for (const issue of analysis.duplicateIssues) {
  console.log(`\nDuplicate group for: ${issue.url}`);
  console.log(`Primary version: ${issue.duplicateOf || issue.url}`);
  console.log(`Recommendation: ${issue.recommendation}`);
}

// 6. Clear cache
detector.clearCache();
```

## Troubleshooting

### High Memory Usage

If you experience high memory usage:
- Process URLs in smaller batches
- Call `clearCache()` more frequently
- Reduce the number of concurrent operations

### False Positives

If you get too many false positives:
- Increase the similarity threshold (e.g., 0.9 or 0.95)
- Review the content extraction logic
- Consider excluding certain URL patterns

### Slow Performance

If detection is slow:
- Enable caching (enabled by default)
- Process URLs in parallel batches
- Reduce the number of URLs being compared

## Related Modules

- **CanonicalDetector**: Detects canonical tag issues
- **CanonicalFixer**: Applies canonical tag fixes
- **RedirectDetector**: Detects redirect chains
- **IssueDetector**: Base detection functionality
