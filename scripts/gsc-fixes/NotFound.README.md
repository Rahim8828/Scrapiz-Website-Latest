# 404 Not Found Detection and Fixing

This module detects and fixes 404 (Not Found) errors on your website.

## Overview

The 404 detection and fixing system:
1. Identifies URLs that return 404 status codes
2. Checks if 404 URLs have backlinks or internal links pointing to them
3. Determines which 404s are valuable (need redirects) vs valueless (can be ignored)
4. Adds 301 redirects for valuable 404s
5. Updates or removes internal links pointing to 404s

## Components

### NotFoundDetector

Detects 404 errors and analyzes their impact.

**Key Methods:**
- `check404(url)` - Check if a single URL returns 404
- `check404s(urls)` - Batch check multiple URLs for 404 status
- `checkBacklinks(url)` - Check if URL has external backlinks (placeholder)
- `scanInternalLinks(siteUrls, notFoundUrls)` - Find internal links pointing to 404s
- `detect404Issues(urlsToCheck, siteUrls)` - Full 404 detection with analysis
- `findBestRedirectTarget(notFoundUrl, siteUrls)` - Find similar URL for redirect

### NotFoundFixer

Fixes 404 errors by adding redirects or updating links.

**Key Methods:**
- `fix404Issues(issues, options)` - Fix all 404 issues
- `fixValuable404(issue, options)` - Add redirect for valuable 404
- `updateInternalLinksTo404(issue, options)` - Update internal links
- `updateHtaccessWithRedirects(redirectRules, dryRun)` - Update .htaccess file

## Usage

### Basic Detection

```javascript
import NotFoundDetector from './NotFoundDetector.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const detector = new NotFoundDetector(logger, errorHandler);

// Check specific URLs for 404
const urlsToCheck = [
  'https://example.com/old-page',
  'https://example.com/deleted-product',
  'https://example.com/moved-article'
];

const issues = await detector.check404s(urlsToCheck);
console.log(`Found ${issues.length} 404 errors`);
```

### Full Detection with Internal Link Scanning

```javascript
// All URLs on your site
const siteUrls = [
  'https://example.com/',
  'https://example.com/about',
  'https://example.com/products',
  // ... more URLs
];

// URLs to check for 404
const urlsToCheck = [
  'https://example.com/old-page',
  'https://example.com/deleted-product'
];

// Detect 404s with full analysis
const issues = await detector.detect404Issues(urlsToCheck, siteUrls);

issues.forEach(issue => {
  console.log(`404: ${issue.url}`);
  console.log(`  Has backlinks: ${issue.hasBacklinks}`);
  console.log(`  Internal links: ${issue.internalLinksCount}`);
  console.log(`  Should exist: ${issue.shouldExist}`);
  console.log(`  Recommendation: ${issue.recommendation}`);
});
```

### Fixing 404 Issues

```javascript
import NotFoundFixer from './NotFoundFixer.js';

const fixer = new NotFoundFixer(logger, errorHandler);

// Fix 404 issues (dry run first)
const result = await fixer.fix404Issues(issues, {
  dryRun: true,
  addRedirects: true,
  updateInternalLinks: true,
  updateHtaccess: true,
  siteUrls: siteUrls
});

console.log(`Would fix ${result.issuesFixed} issues`);
console.log(`Would add ${result.redirectRules.length} redirects`);
console.log(`Would update ${result.linksUpdated} internal links`);

// Apply fixes for real
const realResult = await fixer.fix404Issues(issues, {
  dryRun: false,
  addRedirects: true,
  updateInternalLinks: true,
  updateHtaccess: true,
  siteUrls: siteUrls
});
```

### Finding Redirect Targets

```javascript
// Find best redirect target for a 404 URL
const notFoundUrl = 'https://example.com/old-product-page';
const redirectTarget = await detector.findBestRedirectTarget(notFoundUrl, siteUrls);

console.log(`Best redirect: ${notFoundUrl} -> ${redirectTarget}`);
```

## 404 Issue Object

```javascript
{
  url: 'https://example.com/old-page',
  status: 404,
  hasBacklinks: true,
  internalLinks: [
    {
      sourceUrl: 'https://example.com/blog',
      linkText: 'Read more',
      linkHref: 'https://example.com/old-page'
    }
  ],
  internalLinksCount: 1,
  hasValue: true,
  shouldExist: true,
  recommendation: 'Implement 301 redirect to relevant page (has backlinks and 1 internal links)',
  fixable: true
}
```

## Fix Options

```javascript
{
  dryRun: false,              // Set to true to preview changes
  addRedirects: true,         // Add 301 redirects for valuable 404s
  updateInternalLinks: true,  // Update internal links pointing to 404s
  updateHtaccess: true,       // Update .htaccess with redirect rules
  siteUrls: []               // All site URLs (for finding redirect targets)
}
```

## Backlink Checking

The `checkBacklinks()` method is currently a placeholder. To implement actual backlink checking, integrate with:

- **Google Search Console API** - Check "Links to your site" data
- **Ahrefs API** - Comprehensive backlink data
- **Moz API** - Domain authority and backlinks
- **Majestic API** - Link intelligence

Example integration:

```javascript
async checkBacklinks(url) {
  // Example: Google Search Console API
  const response = await gscClient.searchanalytics.query({
    siteUrl: 'https://example.com',
    requestBody: {
      dimensions: ['page'],
      dimensionFilterGroups: [{
        filters: [{
          dimension: 'page',
          expression: url
        }]
      }]
    }
  });
  
  return response.data.rows && response.data.rows.length > 0;
}
```

## Best Practices

### 1. Prioritize Valuable 404s

Focus on fixing 404s that have:
- External backlinks (SEO value)
- Internal links (user experience)
- Historical traffic (analytics data)

### 2. Choose Good Redirect Targets

When selecting redirect targets:
- Find pages with similar content
- Use category/section pages if no exact match
- Default to homepage only as last resort

### 3. Update Internal Links

Always update internal links instead of relying solely on redirects:
- Better for performance (no redirect hop)
- Better for SEO (direct link equity)
- Better for user experience (faster page loads)

### 4. Monitor After Fixes

After applying fixes:
- Verify redirects work in browser
- Check .htaccess syntax is valid
- Monitor 404 errors in Google Search Console
- Track redirect performance in analytics

## Common Issues

### Issue: Too Many 404s

**Solution:** Process in batches, prioritize by value

```javascript
// Sort by value (backlinks + internal links)
issues.sort((a, b) => {
  const aValue = (a.hasBacklinks ? 100 : 0) + a.internalLinksCount;
  const bValue = (b.hasBacklinks ? 100 : 0) + b.internalLinksCount;
  return bValue - aValue;
});

// Fix top 50 most valuable
const topIssues = issues.slice(0, 50);
await fixer.fix404Issues(topIssues, options);
```

### Issue: Can't Find Good Redirect Target

**Solution:** Manual review required

```javascript
const issuesNeedingManualReview = issues.filter(issue => 
  issue.hasValue && !issue.suggestedTarget
);

console.log('These 404s need manual redirect targets:');
issuesNeedingManualReview.forEach(issue => {
  console.log(`  ${issue.url} (${issue.internalLinksCount} internal links)`);
});
```

### Issue: .htaccess Getting Too Large

**Solution:** Use RedirectMatch or external redirect map

```apache
# Instead of many individual rules:
RewriteRule ^old-page-1/?$ /new-page-1 [R=301,L]
RewriteRule ^old-page-2/?$ /new-page-2 [R=301,L]

# Use pattern matching:
RedirectMatch 301 ^/old-section/(.*)$ /new-section/$1
```

## Requirements Validation

This module validates the following requirements:

- **8.1** - Determines if 404 page should exist or is obsolete
- **8.2** - Creates pages for 404s that should exist (manual step)
- **8.3** - Implements 301 redirects for obsolete 404s with backlinks
- **8.4** - Ensures valueless 404s return proper 404 status
- **8.5** - Updates internal links pointing to 404 pages

## See Also

- [REDIRECT_IMPLEMENTATION.md](./REDIRECT_IMPLEMENTATION.md) - Redirect handling
- [example-notfound-workflow.js](./example-notfound-workflow.js) - Complete example
