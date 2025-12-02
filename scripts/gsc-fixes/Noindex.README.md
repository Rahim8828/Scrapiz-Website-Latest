# Noindex Detection and Fixing Module

## Overview

The Noindex module detects and fixes inappropriate noindex tags that prevent valuable pages from being indexed by search engines. It checks for noindex directives in:
- Meta robots tags (`<meta name="robots" content="noindex">`)
- X-Robots-Tag HTTP headers
- robots.txt file blocking

## Components

### NoindexDetector

Detects noindex issues across multiple sources.

**Key Methods:**
- `checkNoindex(url, options)` - Check single URL for noindex issues
- `checkNoindexes(urls, options)` - Batch check multiple URLs
- `checkMetaRobotsNoindex(html)` - Check for noindex in meta tags
- `checkXRobotsTagNoindex(headers)` - Check for noindex in HTTP headers
- `checkRobotsTxtBlocking(url, baseUrl)` - Check if URL is blocked by robots.txt
- `shouldBeIndexed(pageData)` - Determine if page should be indexed based on content value

### NoindexFixer

Removes inappropriate noindex tags from valuable pages.

**Key Methods:**
- `fixNoindexIssues(issues, options)` - Fix multiple noindex issues
- `fixSingleNoindex(issue, options)` - Fix single noindex issue
- `removeMetaNoindex(issue, dryRun)` - Remove noindex from meta tags
- `removeHeaderNoindex(issue, dryRun)` - Handle HTTP header noindex (manual action)

## Usage

### Basic Detection

```javascript
import NoindexDetector from './NoindexDetector.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const detector = new NoindexDetector(logger, errorHandler);

// Check single URL
const issue = await detector.checkNoindex('https://example.com/page', {
  baseUrl: 'https://example.com',
  pageData: {
    wordCount: 800,
    hasHeadings: true,
    hasInternalLinks: true,
    hasBacklinks: true,
    isImportantPage: true
  }
});

if (issue) {
  console.log('Noindex issue found:', issue);
}

// Batch check multiple URLs
const urls = [
  'https://example.com/page1',
  'https://example.com/page2',
  'https://example.com/page3'
];

const issues = await detector.checkNoindexes(urls, {
  baseUrl: 'https://example.com'
});

console.log(`Found ${issues.length} noindex issues`);
```

### Fixing Issues

```javascript
import NoindexFixer from './NoindexFixer.js';

const fixer = new NoindexFixer(logger, errorHandler);

// Dry run (preview changes)
const dryRunResult = await fixer.fixNoindexIssues(issues, {
  dryRun: true,
  removeMetaNoindex: true,
  removeHeaderNoindex: true
});

console.log('Dry run results:', dryRunResult);

// Apply fixes
const result = await fixer.fixNoindexIssues(issues, {
  dryRun: false,
  removeMetaNoindex: true,
  removeHeaderNoindex: true
});

console.log(`Fixed ${result.issuesFixed} issues`);
console.log(`Failed ${result.issuesFailed} issues`);
```

## Issue Object Structure

```javascript
{
  url: 'https://example.com/page',
  noindexSource: 'meta-tag, http-header',
  hasMetaNoindex: true,
  hasHeaderNoindex: true,
  isRobotsBlocked: false,
  shouldBeIndexed: true,
  inSitemap: false,
  hasBacklinks: true,
  recommendation: 'Remove noindex from meta-tag and http-header. This page has valuable content and should be indexed.',
  fixable: true
}
```

## Page Value Criteria

A page is considered valuable and should be indexed if:
- It's marked as an important page (homepage, main service pages, etc.)
- It has backlinks from external sites
- It has substantial content (500+ words) with proper structure (headings and internal links)

## Fix Capabilities

### Automatic Fixes
- ✅ Remove noindex from meta robots tags
- ✅ Remove noindex from meta googlebot tags

### Manual Fixes Required
- ⚠️ X-Robots-Tag HTTP headers (requires server configuration)
- ⚠️ robots.txt blocking (requires robots.txt file update)

## Options

### Detection Options
```javascript
{
  baseUrl: 'https://example.com',  // Base URL for robots.txt
  pageData: {
    wordCount: 500,                // Number of words on page
    hasHeadings: true,             // Has H1/H2 headings
    hasInternalLinks: true,        // Has internal links
    hasBacklinks: false,           // Has external backlinks
    isImportantPage: false         // Is a critical page
  }
}
```

### Fix Options
```javascript
{
  dryRun: false,                   // Preview changes without applying
  removeMetaNoindex: true,         // Remove noindex from meta tags
  removeHeaderNoindex: true        // Handle HTTP header noindex
}
```

## Best Practices

1. **Always run dry run first** to preview changes
2. **Verify page value** before removing noindex
3. **Check sitemap** - noindexed pages should not be in sitemap
4. **Update internal links** - don't link to noindexed pages from important pages
5. **Monitor GSC** - track indexing status after fixes
6. **Create backups** - backups are created automatically before changes

## Error Handling

The module includes comprehensive error handling:
- Automatic backups before file modifications
- Rollback on errors
- Retry logic for network failures
- Detailed error logging

## Validation

After fixing, verify:
1. Meta robots tags no longer contain noindex
2. X-Robots-Tag headers are updated (if applicable)
3. robots.txt allows crawling (if applicable)
4. Page is included in sitemap
5. GSC shows page as indexable

## Common Issues

### Issue: "Could not find source file for URL"
**Solution:** Update the `findSourceFile` method in NoindexFixer to include the URL-to-file mapping for your site structure.

### Issue: "X-Robots-Tag noindex requires manual server configuration"
**Solution:** Update your server configuration (.htaccess, nginx config, or application code) to remove the X-Robots-Tag header.

### Issue: "robots.txt blocking requires manual update"
**Solution:** Edit your robots.txt file to allow crawling of the blocked URL.

## Integration with Other Modules

The Noindex module works with:
- **SitemapManager** - Ensure noindexed pages are excluded from sitemap
- **CanonicalDetector** - Verify canonical targets are not noindexed
- **IssueDetector** - Part of comprehensive site audit

## Requirements Validation

This module validates:
- **Requirement 4.2:** Remove noindex from valuable pages
- **Requirement 4.3:** Verify noindexed pages are excluded from sitemap
- **Requirement 4.5:** Detect noindex in both meta tags and HTTP headers
- **Requirement 7.3:** Check robots.txt blocking
