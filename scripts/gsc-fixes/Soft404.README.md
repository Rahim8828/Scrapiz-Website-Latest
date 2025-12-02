# Soft 404 Detection and Fixes

This module provides functionality to detect and fix soft 404 errors on web pages.

## Overview

A **soft 404** is a page that returns a 200 OK status code but contains little or no content, which Google treats as a 404 error. This negatively impacts SEO and indexing.

## Components

### Soft404Detector (part of IssueDetector)

The detection functionality is integrated into the `IssueDetector` class.

#### Detection Criteria

A page is identified as a soft 404 if it returns 200 status but meets one of these conditions:

1. **Thin Content**: Less than 300 words
2. **Empty Page**: No substantial body content
3. **Low Quality**: No headings AND no internal links

#### Usage

```javascript
import IssueDetector from './IssueDetector.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

const logger = new Logger();
await logger.initialize();

const errorHandler = new ErrorHandler(logger);
await errorHandler.initialize();

const detector = new IssueDetector(logger, errorHandler);

// Check a single URL
const issue = await detector.checkSoft404('https://example.com/page');

if (issue) {
  console.log('Soft 404 detected:');
  console.log('Reason:', issue.reason);
  console.log('Word count:', issue.wordCount);
  console.log('Recommendation:', issue.recommendation);
}
```

#### Detection Result

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

### Soft404Fixer

The `Soft404Fixer` class provides automated and semi-automated fixes for soft 404 issues.

#### Fix Strategies

1. **Thin Content**: 
   - Suggests content enhancement to reach 500+ words
   - Provides manual action guidance

2. **Empty Page**:
   - Option 1: Add substantial content
   - Option 2: Return proper 404 status
   - Option 3: Add 301 redirect to relevant page

3. **Low Quality**:
   - Suggests adding proper heading structure (H1, H2)
   - Suggests adding internal links

#### Usage

```javascript
import Soft404Fixer from './Soft404Fixer.js';

const fixer = new Soft404Fixer(logger, errorHandler);

// Fix multiple issues
const issues = [
  {
    url: 'https://example.com/thin-page',
    reason: 'thin-content',
    wordCount: 150,
    hasHeadings: true,
    hasInternalLinks: true
  }
];

// Dry run (no actual changes)
const result = await fixer.fixSoft404Issues(issues, { 
  dryRun: true,
  enhanceContent: true,
  addRedirects: true
});

console.log('Fixed:', result.issuesFixed);
console.log('Failed:', result.issuesFailed);
console.log('Details:', result.details);
```

#### Fix Options

```javascript
{
  dryRun: boolean,        // If true, only simulate fixes
  enhanceContent: boolean, // If true, attempt content enhancement
  addRedirects: boolean   // If true, add redirects for empty pages
}
```

#### Fix Result

```javascript
{
  success: boolean,
  issuesFixed: number,
  issuesFailed: number,
  details: [
    {
      url: string,
      status: 'fixed' | 'failed' | 'skipped' | 'manual-action-required' | 'dry-run',
      message: string,
      suggestions?: object,
      filePath?: string,
      redirectTarget?: string
    }
  ]
}
```

## Content Analysis

The module analyzes page content to determine quality:

```javascript
const analysis = detector.analyzePageContent(html);

// Returns:
{
  wordCount: number,
  hasHeadings: boolean,
  headings: {
    h1: number,
    h2: number,
    h3: number
  },
  internalLinks: number,
  hasBodyContent: boolean,
  textContent: string
}
```

## Redirect Management

For empty pages that should redirect, the fixer can:

1. Determine appropriate redirect target
2. Generate .htaccess redirect rules
3. Add redirects with automatic backup/rollback

```javascript
// Generate redirect rule
const rule = fixer.generateRedirectRule(
  'http://example.com/old-page',
  '/new-page'
);
// Returns: "RewriteRule ^old-page/?$ /new-page [R=301,L]"

// Add to .htaccess (with backup)
await fixer.addRedirectToHtaccess(htaccessPath, rule);
```

## Testing

Run the unit tests to verify functionality:

```bash
node scripts/gsc-fixes/test-soft404-unit.js
```

Tests cover:
- Thin content detection (< 300 words)
- Empty page detection
- Low quality page detection (no headings, no links)
- Good quality page validation
- Recommendation generation
- Redirect rule generation
- Fix result structure

## Requirements Validation

This implementation validates the following requirements:

- **Requirement 1.1**: Pages with valuable content (≥300 words) return 200 status
- **Requirement 1.2**: Truly non-existent pages return proper 404 status
- **Requirement 1.3**: Thin content pages are enhanced or redirected
- **Requirement 1.5**: Pages are checked for proper structure (headings, links)

## Integration

The Soft404Detector and Soft404Fixer integrate with:

- **Logger**: Tracks all detections and fixes
- **ErrorHandler**: Provides backup/rollback functionality
- **IssueDetector**: Part of comprehensive issue detection system

## Best Practices

1. **Always use dry run first** to preview changes
2. **Review manual action items** before implementing
3. **Create backups** before modifying files
4. **Verify fixes** after application
5. **Monitor logs** for errors and warnings

## Limitations

- Source file mapping is simplified and may need expansion
- Content enhancement requires manual intervention
- Redirect target selection uses basic heuristics
- Does not automatically generate content

## Future Enhancements

- AI-powered content generation
- Smarter redirect target selection
- Automatic internal link suggestions
- Integration with CMS systems
- Batch processing optimization
