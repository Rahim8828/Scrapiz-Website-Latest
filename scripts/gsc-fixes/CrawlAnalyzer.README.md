# CrawlAnalyzer Module

## Overview

The CrawlAnalyzer module analyzes pages that are "Crawled - currently not indexed" or "Discovered - currently not indexed" in Google Search Console. It identifies quality issues, duplicate content, and provides actionable recommendations for getting these pages indexed.

## Features

- **Quality Signal Detection**: Identifies thin content, missing headings, and low internal links
- **Duplicate Content Detection**: Finds duplicate pages that should be canonicalized or redirected
- **Crawled Page Analysis**: Comprehensive analysis of crawled but not indexed pages
- **Discovered Page Analysis**: Analysis of discovered but not indexed pages with sitemap checks
- **Fix Generation**: Creates actionable fixes for identified issues

## Usage

### Basic Usage

```javascript
import CrawlAnalyzer from './CrawlAnalyzer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const analyzer = new CrawlAnalyzer(logger, errorHandler);

// Analyze a crawled page
const crawledUrls = [
  'https://example.com/page1',
  'https://example.com/page2'
];

const allUrls = [
  'https://example.com/page1',
  'https://example.com/page2',
  'https://example.com/page3'
];

const results = await analyzer.analyzeCrawledPages(crawledUrls, allUrls);
console.log('Crawled page analysis:', results);
```

### Analyze Discovered Pages

```javascript
// Analyze discovered pages
const discoveredUrls = [
  'https://example.com/new-page1',
  'https://example.com/new-page2'
];

const sitemapUrls = new Set([
  'https://example.com/page1',
  'https://example.com/page2'
]);

const discoveredResults = await analyzer.analyzeDiscoveredPages(
  discoveredUrls,
  sitemapUrls,
  allUrls
);
console.log('Discovered page analysis:', discoveredResults);
```

### Quality Signal Detection

```javascript
// Detect quality signals for a single page
const qualityAnalysis = await analyzer.detectQualitySignals('https://example.com/page');

console.log('Quality Analysis:', {
  hasThinContent: qualityAnalysis.hasThinContent,
  hasNoHeadings: qualityAnalysis.hasNoHeadings,
  hasLowLinks: qualityAnalysis.hasLowLinks,
  wordCount: qualityAnalysis.wordCount,
  qualityScore: qualityAnalysis.qualityScore,
  recommendation: qualityAnalysis.recommendation
});
```

### Duplicate Detection

```javascript
// Detect duplicates for a crawled page
const duplicateAnalysis = await analyzer.detectDuplicateForCrawledPage(
  'https://example.com/page1',
  allUrls
);

if (duplicateAnalysis) {
  console.log('Duplicate found:', {
    duplicateOf: duplicateAnalysis.duplicateOf,
    similarity: duplicateAnalysis.maxSimilarity,
    recommendation: duplicateAnalysis.recommendation
  });
}
```

### Fix Crawled Pages

```javascript
// Generate fixes for crawled pages
const crawledIssues = await analyzer.analyzeCrawledPages(crawledUrls, allUrls);

const fixResults = await analyzer.fixCrawledPages(crawledIssues, {
  dryRun: false
});

console.log('Fix Results:', {
  issuesFixed: fixResults.issuesFixed,
  issuesFailed: fixResults.issuesFailed,
  details: fixResults.details
});
```

## API Reference

### Constructor

```javascript
new CrawlAnalyzer(logger, errorHandler)
```

- `logger`: Logger instance for logging operations
- `errorHandler`: ErrorHandler instance for error recovery

### Methods

#### `detectQualitySignals(url)`

Analyzes a page for quality signals.

**Parameters:**
- `url` (string): URL to analyze

**Returns:** Promise<Object>
```javascript
{
  url: string,
  hasThinContent: boolean,
  hasNoHeadings: boolean,
  hasLowLinks: boolean,
  wordCount: number,
  headingCount: number,
  linkCount: number,
  qualityScore: number,
  issues: Array<string>,
  recommendation: string
}
```

#### `detectDuplicateForCrawledPage(url, compareUrls)`

Detects duplicate content for a crawled page.

**Parameters:**
- `url` (string): URL to check
- `compareUrls` (Array<string>): URLs to compare against

**Returns:** Promise<Object|null>
```javascript
{
  url: string,
  isDuplicate: boolean,
  duplicateOf: string|null,
  duplicates: Array<string>,
  maxSimilarity: number,
  recommendation: string
}
```

#### `analyzeCrawledPage(url, allUrls)`

Comprehensive analysis of a crawled but not indexed page.

**Parameters:**
- `url` (string): URL to analyze
- `allUrls` (Array<string>): All URLs for duplicate comparison

**Returns:** Promise<Object>
```javascript
{
  url: string,
  status: 'crawled-not-indexed',
  primaryIssue: string,
  fixStrategy: string,
  qualityAnalysis: Object,
  duplicateAnalysis: Object|null,
  recommendation: string,
  fixable: boolean
}
```

#### `analyzeDiscoveredPage(url, sitemapUrls, allUrls)`

Analyzes a discovered but not indexed page.

**Parameters:**
- `url` (string): URL to analyze
- `sitemapUrls` (Set<string>): URLs in sitemap
- `allUrls` (Array<string>): All URLs for analysis

**Returns:** Promise<Object>
```javascript
{
  url: string,
  status: 'discovered-not-indexed',
  inSitemap: boolean,
  isAccessible: boolean,
  issues: Array<string>,
  fixStrategy: string,
  qualityAnalysis: Object,
  recommendation: string,
  fixable: boolean
}
```

#### `fixCrawledPages(issues, options)`

Creates fixes for crawled page issues.

**Parameters:**
- `issues` (Array<Object>): Array of crawled page issues
- `options` (Object): Fix options
  - `dryRun` (boolean): Whether to perform dry run

**Returns:** Promise<Object>
```javascript
{
  success: boolean,
  issuesFixed: number,
  issuesFailed: number,
  details: Array<Object>
}
```

#### `analyzeCrawledPages(urls, allUrls)`

Batch analyze multiple crawled pages.

**Parameters:**
- `urls` (Array<string>): URLs to analyze
- `allUrls` (Array<string>): All URLs for duplicate comparison

**Returns:** Promise<Array<Object>>

#### `analyzeDiscoveredPages(urls, sitemapUrls, allUrls)`

Batch analyze multiple discovered pages.

**Parameters:**
- `urls` (Array<string>): URLs to analyze
- `sitemapUrls` (Set<string>): URLs in sitemap
- `allUrls` (Array<string>): All URLs for analysis

**Returns:** Promise<Array<Object>>

#### `clearCache()`

Clears the internal page cache.

## Quality Signals

The analyzer checks for the following quality signals:

1. **Thin Content**: Pages with less than 500 words
2. **No Headings**: Pages without H1, H2, or H3 tags
3. **Low Links**: Pages with fewer than 3 internal links

### Quality Score

Quality score is calculated on a scale of 0-100:
- Thin content: -40 points
- No headings: -30 points
- Low links: -30 points

## Fix Strategies

### For Crawled Pages

1. **add-canonical-or-redirect**: Add canonical tag or 301 redirect to primary version
2. **enhance-content**: Improve content quality (add words, headings, links)
3. **ensure-duplicates-canonicalize-here**: Ensure duplicate pages point to this URL
4. **manual-review**: Requires manual investigation

### For Discovered Pages

1. **add-to-sitemap**: Add page to XML sitemap
2. **fix-accessibility**: Fix page accessibility issues
3. **enhance-content**: Improve content quality
4. **request-indexing**: Submit via GSC URL Inspection tool

## Examples

### Complete Workflow

```javascript
import CrawlAnalyzer from './CrawlAnalyzer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

async function analyzeCrawlIssues() {
  const logger = new Logger();
  const errorHandler = new ErrorHandler(logger);
  const analyzer = new CrawlAnalyzer(logger, errorHandler);

  // Define URLs
  const crawledUrls = [
    'https://example.com/thin-page',
    'https://example.com/duplicate-page'
  ];

  const discoveredUrls = [
    'https://example.com/new-page'
  ];

  const allUrls = [
    ...crawledUrls,
    ...discoveredUrls,
    'https://example.com/main-page'
  ];

  const sitemapUrls = new Set([
    'https://example.com/main-page'
  ]);

  // Analyze crawled pages
  console.log('Analyzing crawled pages...');
  const crawledResults = await analyzer.analyzeCrawledPages(crawledUrls, allUrls);
  
  crawledResults.forEach(result => {
    console.log(`\nPage: ${result.url}`);
    console.log(`Primary Issue: ${result.primaryIssue}`);
    console.log(`Fix Strategy: ${result.fixStrategy}`);
    console.log(`Recommendation: ${result.recommendation}`);
  });

  // Analyze discovered pages
  console.log('\nAnalyzing discovered pages...');
  const discoveredResults = await analyzer.analyzeDiscoveredPages(
    discoveredUrls,
    sitemapUrls,
    allUrls
  );
  
  discoveredResults.forEach(result => {
    console.log(`\nPage: ${result.url}`);
    console.log(`In Sitemap: ${result.inSitemap}`);
    console.log(`Issues: ${result.issues.join(', ')}`);
    console.log(`Recommendation: ${result.recommendation}`);
  });

  // Generate fixes (dry run)
  console.log('\nGenerating fixes (dry run)...');
  const fixResults = await analyzer.fixCrawledPages(crawledResults, {
    dryRun: true
  });
  
  console.log(`\nFixes: ${fixResults.issuesFixed} successful, ${fixResults.issuesFailed} failed`);
  
  fixResults.details.forEach(detail => {
    console.log(`\n${detail.url}: ${detail.message}`);
  });

  // Clear cache
  analyzer.clearCache();
}

analyzeCrawlIssues().catch(console.error);
```

## Integration with Other Modules

The CrawlAnalyzer works with:

- **IssueDetector**: For basic page analysis
- **DuplicateDetector**: For advanced duplicate detection
- **SitemapManager**: For sitemap validation
- **CanonicalFixer**: For adding canonical tags
- **RedirectFixer**: For implementing redirects

## Error Handling

The module uses the ErrorHandler for consistent error recovery:

```javascript
try {
  const result = await analyzer.analyzeCrawledPage(url, allUrls);
} catch (error) {
  // Error is logged and handled by ErrorHandler
  console.error('Analysis failed:', error.message);
}
```

## Performance Considerations

- Pages are processed in batches of 5 to avoid overwhelming the system
- Page content is cached to avoid redundant fetches
- Small delays between batches prevent rate limiting
- Use `clearCache()` to free memory after processing

## Requirements Validation

This module validates the following requirements:

- **Requirement 6.1**: Analyzes crawled pages for thin content, duplicate content, and low quality signals
- **Requirement 6.3**: Implements canonical tags or redirects for duplicate crawled pages
- **Requirement 7.1**: Verifies discovered pages are in sitemap

## Related Files

- `IssueDetector.js`: Base detection functionality
- `DuplicateDetector.js`: Advanced duplicate detection
- `utils.js`: Utility functions
- `logger.js`: Logging functionality
- `errorHandler.js`: Error handling
