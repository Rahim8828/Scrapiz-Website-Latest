# Redirect Detection and Fixing

This module provides comprehensive redirect detection and optimization for Google Search Console indexing issues.

## Overview

The redirect system consists of two main components:

1. **RedirectDetector**: Detects redirect chains and identifies redirect type issues
2. **RedirectFixer**: Flattens redirect chains and updates .htaccess with optimized redirects

## Features

### RedirectDetector

- **Redirect Chain Detection**: Follows all redirects and maps the complete chain
- **Redirect Type Identification**: Identifies 301, 302, 303, 307, 308 redirects
- **Chain Analysis**: Detects multi-hop redirect chains that waste crawl budget
- **Pattern Analysis**: Analyzes redirect patterns across the entire site

### RedirectFixer

- **Chain Flattening**: Converts A→B→C chains to direct A→C redirects
- **Type Conversion**: Converts temporary (302, 307) to permanent (301) redirects
- **Htaccess Generation**: Generates proper Apache RewriteRule directives
- **Backup & Rollback**: Creates backups before changes and rolls back on errors

## Usage

### Basic Detection

```javascript
import RedirectDetector from './RedirectDetector.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const detector = new RedirectDetector(logger, errorHandler);

// Check single URL
const issue = await detector.checkRedirect('https://example.com/old-page');

if (issue) {
  console.log('Redirect found:', issue);
  console.log('Chain:', issue.redirectChain);
  console.log('Final destination:', issue.finalDestination);
  console.log('Type:', issue.redirectTypeName);
}

// Check multiple URLs
const urls = [
  'https://example.com/page1',
  'https://example.com/page2',
  'https://example.com/page3'
];

const issues = await detector.checkRedirects(urls);
console.log(`Found ${issues.length} redirect issues`);
```

### Fixing Redirects

```javascript
import RedirectFixer from './RedirectFixer.js';

const fixer = new RedirectFixer(logger, errorHandler);

// Dry run (preview changes)
const dryRunResult = await fixer.fixRedirectIssues(issues, {
  dryRun: true,
  flattenChains: true,
  convertToPermament: true,
  updateHtaccess: true
});

console.log('Would fix:', dryRunResult.issuesFixed);
console.log('Redirect rules:', dryRunResult.redirectRules);

// Apply fixes
const result = await fixer.fixRedirectIssues(issues, {
  dryRun: false,
  flattenChains: true,
  convertToPermament: true,
  updateHtaccess: true
});

console.log('Fixed:', result.issuesFixed);
console.log('Failed:', result.issuesFailed);
console.log('Htaccess updated:', result.htaccessUpdated);
```

### Complete Workflow

```javascript
// 1. Detect redirect issues
const detector = new RedirectDetector(logger, errorHandler);
const issues = await detector.checkRedirects(urls);

// 2. Analyze patterns
const analysis = detector.analyzeRedirectPatterns(issues);
console.log('Analysis:', analysis);

// 3. Fix issues (dry run first)
const fixer = new RedirectFixer(logger, errorHandler);
const dryRun = await fixer.fixRedirectIssues(issues, { dryRun: true });
console.log('Preview:', dryRun);

// 4. Apply fixes
const result = await fixer.fixRedirectIssues(issues, { dryRun: false });
console.log('Result:', result);

// 5. Get statistics
const stats = fixer.getRedirectStatistics(issues);
console.log('Statistics:', stats);
```

## Issue Object Structure

```javascript
{
  url: 'https://example.com/old-page',
  redirectChain: [
    'https://example.com/old-page',
    'https://example.com/temp-page',
    'https://example.com/new-page'
  ],
  finalDestination: 'https://example.com/new-page',
  redirectType: 302,
  redirectTypeName: '302 Found',
  isPermanent: false,
  isTemporary: true,
  hasChain: true,
  chainLength: 3,
  inSitemap: false,
  internalLinksCount: 0,
  recommendation: 'Flatten redirect chain (3 hops) to direct redirect. Change from 302 Found to 301 Permanent Redirect. Update sitemap to use final destination URL. Update internal links to point directly to final destination',
  fixable: true
}
```

## Redirect Types

### Permanent Redirects (Recommended)
- **301 Moved Permanently**: Standard permanent redirect
- **308 Permanent Redirect**: Permanent redirect that preserves request method

### Temporary Redirects (Not Recommended for SEO)
- **302 Found**: Temporary redirect (legacy)
- **303 See Other**: Temporary redirect with GET method
- **307 Temporary Redirect**: Temporary redirect that preserves request method

## Generated .htaccess Rules

The fixer generates Apache RewriteRule directives:

```apache
# GSC Redirect fixes
RewriteRule ^old-page/?$ /new-page [R=301,L]
RewriteRule ^another-old-page/?$ /another-new-page [R=301,L]
```

### Rule Components

- `^old-page/?$`: Pattern matching the old URL path
- `/new-page`: Target URL path
- `R=301`: Redirect with 301 status code
- `L`: Last rule (stop processing if matched)

## Best Practices

### 1. Always Use Dry Run First

```javascript
// Preview changes before applying
const preview = await fixer.fixRedirectIssues(issues, { dryRun: true });
console.log('Will fix:', preview.issuesFixed);
console.log('Rules:', preview.redirectRules);
```

### 2. Flatten Redirect Chains

Redirect chains waste crawl budget and slow down page loading:

```
❌ Bad: A → B → C → D (3 hops)
✅ Good: A → D (direct)
```

### 3. Use 301 for Permanent Changes

```
❌ Bad: 302 (temporary) for permanent URL changes
✅ Good: 301 (permanent) for permanent URL changes
```

### 4. Update Sitemap and Internal Links

After fixing redirects:
- Remove redirecting URLs from sitemap
- Add final destination URLs to sitemap
- Update internal links to point to final destinations

### 5. Monitor and Verify

```javascript
// Get statistics
const stats = fixer.getRedirectStatistics(issues);
console.log('Total redirects:', stats.total);
console.log('Chains:', stats.chains);
console.log('Temporary:', stats.temporary);
console.log('Longest chain:', stats.longestChain);
```

## Error Handling

The system includes comprehensive error handling:

- **Backup Creation**: Automatic backup before modifying .htaccess
- **Rollback**: Automatic rollback on errors
- **Validation**: Validates redirect rules before applying
- **Logging**: Detailed logging of all operations

```javascript
try {
  const result = await fixer.fixRedirectIssues(issues);
  if (result.success) {
    console.log('All fixes applied successfully');
  } else {
    console.log('Some fixes failed:', result.issuesFailed);
  }
} catch (error) {
  console.error('Error fixing redirects:', error);
  // Automatic rollback has already occurred
}
```

## Requirements Validation

This implementation validates the following requirements:

- **3.1**: Verifies redirects are 301 (permanent), not 302 (temporary)
- **3.2**: Flattens redirect chains (A→B→C becomes A→C)
- **3.3**: Identifies redirected URLs that should be removed from sitemap
- **3.4**: Identifies internal links pointing to redirected URLs
- **3.5**: Implements redirects at server level (.htaccess)

## Integration with Other Modules

### With IssueDetector

```javascript
import IssueDetector from './IssueDetector.js';

const issueDetector = new IssueDetector(logger, errorHandler);
const redirectDetector = new RedirectDetector(logger, errorHandler);

// IssueDetector provides basic redirect detection
const basicIssue = await issueDetector.checkRedirects(url);

// RedirectDetector provides detailed analysis
const detailedIssue = await redirectDetector.checkRedirect(url);
```

### With SitemapManager

```javascript
// After fixing redirects, update sitemap
const redirectIssues = await detector.checkRedirects(urls);
const fixResult = await fixer.fixRedirectIssues(redirectIssues);

// Remove redirecting URLs from sitemap
const redirectingUrls = redirectIssues.map(issue => issue.url);
await sitemapManager.cleanSitemap(redirectingUrls);

// Add final destinations to sitemap
const finalUrls = redirectIssues.map(issue => issue.finalDestination);
// Add finalUrls to sitemap...
```

## Testing

See property-based tests in the test files for comprehensive validation.

## Troubleshooting

### Issue: Redirect rules not working

**Solution**: Check Apache configuration:
```apache
# Ensure mod_rewrite is enabled
RewriteEngine On

# Check rule order (specific rules before general rules)
```

### Issue: Redirect loops

**Solution**: Validate that from and to URLs are different:
```javascript
const isValid = fixer.validateRedirectRule(redirectRule);
```

### Issue: .htaccess syntax errors

**Solution**: The fixer automatically escapes special characters, but verify:
```javascript
const rule = fixer.generateRedirectRule(from, to, 301);
console.log('Generated rule:', rule.rule);
```

## Performance Considerations

- **Batch Processing**: Processes URLs in batches of 5 to avoid overwhelming the server
- **Caching**: Consider caching redirect chain results for frequently checked URLs
- **Rate Limiting**: Includes delays between batches to respect server limits
- **Timeout**: 10-second timeout for HTTP requests

## Security Considerations

- **Backup Before Changes**: Always creates backup before modifying .htaccess
- **Input Validation**: Validates all URLs before processing
- **Regex Escaping**: Properly escapes special characters in redirect patterns
- **Rollback on Error**: Automatically rolls back changes if errors occur
