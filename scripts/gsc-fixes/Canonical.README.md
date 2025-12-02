# Canonical Tag Detection and Fixes

This module provides comprehensive canonical tag detection and fixing capabilities for the GSC Fix System.

## Overview

The canonical tag system consists of two main components:

1. **CanonicalDetector**: Detects canonical tag issues and duplicate content
2. **CanonicalFixer**: Fixes canonical tag issues by adding or updating tags

## Features

### CanonicalDetector

- **Extract Canonical Tags**: Extracts canonical tags from HTML and resolves relative URLs
- **Validate Canonical Targets**: Validates that canonical URLs return 200 status and are not blocked
- **Detect Duplicate Content**: Uses similarity scoring to identify duplicate pages
- **Batch Processing**: Efficiently processes multiple URLs with caching
- **Content Similarity**: Calculates text similarity between pages using Levenshtein distance

### CanonicalFixer

- **Add Missing Canonicals**: Adds self-referencing canonical tags to pages without them
- **Update Invalid Canonicals**: Updates canonical tags that point to invalid targets
- **Fix Duplicate Content**: Adds canonical tags to duplicate pages pointing to primary version
- **Backup and Rollback**: Creates backups before making changes and can rollback on errors
- **Dry Run Mode**: Test fixes without making actual changes

## Usage

### Basic Detection

```javascript
import CanonicalDetector from './CanonicalDetector.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const detector = new CanonicalDetector(logger, errorHandler);

// Check single URL
const issue = await detector.checkCanonical('https://example.com/page');

// Check multiple URLs
const urls = ['https://example.com/page1', 'https://example.com/page2'];
const issues = await detector.checkCanonicals(urls);
```

### Duplicate Content Detection

```javascript
// Detect duplicates for a URL
const url = 'https://example.com/page';
const compareUrls = ['https://example.com/page1', 'https://example.com/page2'];
const duplicates = await detector.findDuplicates(url, compareUrls);

// Adjust similarity threshold (default 0.8)
const duplicates = await detector.detectDuplicateContent(url, compareUrls, 0.9);
```

### Canonical Target Validation

```javascript
// Validate a canonical URL
const validation = await detector.validateCanonicalTarget('https://example.com/canonical');

if (!validation.valid) {
  console.log(`Invalid: ${validation.reason}`);
  console.log(`Status: ${validation.status}`);
  console.log(`Noindex: ${validation.noindex}`);
}
```

### Fixing Canonical Issues

```javascript
import CanonicalFixer from './CanonicalFixer.js';

const fixer = new CanonicalFixer(logger, errorHandler);

// Fix canonical issues (dry run)
const results = await fixer.fixCanonicalIssues(issues, { dryRun: true });

// Fix canonical issues (actual)
const results = await fixer.fixCanonicalIssues(issues, {
  dryRun: false,
  addMissing: true,
  updateInvalid: true
});

console.log(`Fixed: ${results.issuesFixed}`);
console.log(`Failed: ${results.issuesFailed}`);
```

### Fixing Duplicate Content

```javascript
// Fix duplicate content by adding canonical tags
const duplicateIssues = [
  {
    url: 'https://example.com/page1',
    duplicateOf: 'https://example.com/primary',
    hasCanonical: false,
    fixable: true
  }
];

const results = await fixer.fixDuplicateContent(duplicateIssues, false);
```

## Issue Types

### Canonical Issues

1. **missing**: Page has no canonical tag
   - Fix: Add self-referencing canonical tag

2. **invalid-target-invalid-url**: Canonical URL is malformed
   - Fix: Update to valid URL or make self-referencing

3. **invalid-target-non-200-status**: Canonical target returns non-200 status
   - Fix: Update to valid URL or make self-referencing

4. **invalid-target-noindex**: Canonical target has noindex directive
   - Fix: Choose different canonical or remove noindex from target

5. **invalid-target-fetch-error**: Cannot fetch canonical target
   - Fix: Verify URL is accessible and update

6. **alternative-page**: Canonical points to different URL (intentional)
   - Fix: No fix needed - this is intentional for duplicate content

### Duplicate Content Issues

- **duplicateOf**: URL is a duplicate of another page
  - Fix: Add canonical tag pointing to primary version

## Data Models

### Canonical Issue

```javascript
{
  url: string,                    // Page URL
  currentCanonical: string|null,  // Current canonical tag value
  expectedCanonical: string,      // Expected canonical value
  issueType: string,              // Type of issue
  inSitemap: boolean,             // Whether URL is in sitemap
  recommendation: string,         // Fix recommendation
  fixable: boolean,               // Whether issue can be auto-fixed
  validationDetails: Object       // Validation result (if applicable)
}
```

### Duplicate Issue

```javascript
{
  url: string,                    // Page URL
  duplicateOf: string|null,       // Primary version URL (null if this is primary)
  duplicates: Array<string>,      // List of duplicate URLs
  similarityScore: number,        // Similarity score (0-1)
  hasCanonical: boolean,          // Whether page has canonical tag
  canonicalTarget: string|null,   // Current canonical target
  recommendation: string,         // Fix recommendation
  fixable: boolean                // Whether issue can be auto-fixed
}
```

### Validation Result

```javascript
{
  valid: boolean,                 // Whether canonical target is valid
  reason: string|null,            // Reason if invalid
  status: number|null,            // HTTP status code
  noindex: boolean,               // Whether target has noindex
  robotsBlocked: boolean,         // Whether blocked by robots.txt
  error: string                   // Error message (if applicable)
}
```

## Configuration Options

### Detection Options

- **threshold**: Similarity threshold for duplicate detection (default: 0.8)
- **batchSize**: Number of URLs to process in parallel (default: 5)
- **caching**: Enable/disable page content caching (default: enabled)

### Fix Options

- **dryRun**: Test fixes without making changes (default: false)
- **addMissing**: Add missing canonical tags (default: true)
- **updateInvalid**: Update invalid canonical tags (default: true)

## Example Workflow

See `example-canonical-workflow.js` for a complete example:

```bash
node scripts/gsc-fixes/example-canonical-workflow.js
```

## Testing

Run unit tests:

```bash
npm test scripts/gsc-fixes/canonical.test.js
```

## Implementation Details

### Canonical Tag Extraction

The detector extracts canonical tags from HTML using Cheerio and resolves relative URLs to absolute URLs based on the page URL.

### Content Similarity

Content similarity is calculated using the Levenshtein distance algorithm on extracted text content. HTML tags are stripped, and only text content is compared.

### File Mapping

The fixer maps URLs to source files using these patterns:

- `/` → `src/pages/Home.jsx`
- `/about` → `src/pages/About.jsx`
- `/services/[service]` → `src/pages/[Service]Page.jsx`
- `/scrap-dealer-in-[location]` → `src/Extra Location pages /ScrapDealerin[Location].jsx`

### Helmet Integration

Canonical tags are added to React components using the `react-helmet` library:

```jsx
<Helmet>
  <link rel="canonical" href="https://example.com/page" />
</Helmet>
```

## Error Handling

- **Network Errors**: Retried with exponential backoff
- **File System Errors**: Logged and skipped
- **Validation Errors**: Logged with specific error details
- **Backup/Rollback**: Automatic backup before changes, rollback on error

## Performance Considerations

- **Caching**: Page content is cached to avoid redundant fetches
- **Batch Processing**: URLs are processed in batches to avoid overwhelming the system
- **Rate Limiting**: Small delays between batches to respect server limits
- **Parallel Execution**: Independent operations run in parallel using Promise.all

## Limitations

- Duplicate detection uses text similarity, which may not catch all duplicates
- File mapping is based on URL patterns and may need updates for new page types
- Canonical tag insertion requires `react-helmet` to be present in the component
- Some fixes may require manual intervention (marked as 'manual-action-required')

## Related Modules

- **IssueDetector**: General issue detection including canonical checks
- **Soft404Fixer**: Fixes soft 404 issues which may involve canonical tags
- **SitemapManager**: Manages sitemap which should only include canonical URLs
- **Logger**: Logs all detection and fix operations
- **ErrorHandler**: Handles errors with backup and rollback

## Requirements Validated

This module validates the following requirements from the design document:

- **2.1**: Canonical URL is preferred version and indexable
- **2.2**: Proper canonical tags for duplicate pages
- **2.3**: Self-referencing canonical for primary pages
- **2.4**: Consistency between canonical tags, sitemap, and internal links
- **2.5**: Canonical target returns 200 and not blocked
- **5.1**: Identify primary version for duplicates
- **5.2**: Add canonical tags to duplicate versions
