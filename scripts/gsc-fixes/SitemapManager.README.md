# Sitemap Manager

## Overview

The Sitemap Manager module provides comprehensive functionality for managing XML sitemaps, including parsing, generation, validation, and cleaning operations.

## Features

- **Parse Sitemap**: Read and parse existing sitemap.xml files
- **Generate Sitemap**: Create properly formatted XML sitemaps
- **Validate Sitemap**: Check for redirects, 404s, noindex tags, and metadata completeness
- **Clean Sitemap**: Remove invalid URLs from sitemap
- **Add URLs**: Add new URLs to existing sitemap
- **Update URLs**: Update metadata for existing URLs
- **Statistics**: Get comprehensive sitemap statistics

## Requirements Addressed

- **Requirement 10.1**: Include only indexable pages (no redirects, 404s, or noindexed pages)
- **Requirement 10.2**: Include proper lastmod dates and priority values

## Usage

### Basic Setup

```javascript
import SitemapManager from './SitemapManager.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

const logger = new Logger();
await logger.initialize();

const errorHandler = new ErrorHandler(logger);
await errorHandler.initialize();

const sitemapManager = new SitemapManager(logger, errorHandler);
```

### Parse Existing Sitemap

```javascript
const parsed = await sitemapManager.parseSitemap();
const urls = sitemapManager.extractUrls(parsed);

console.log(`Found ${urls.length} URLs in sitemap`);
```

### Generate New Sitemap

```javascript
const pages = [
  {
    url: 'https://www.scrapiz.in/',
    lastmod: '2025-12-01',
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    url: 'https://www.scrapiz.in/about',
    lastmod: '2025-12-01',
    priority: '0.8',
    changefreq: 'monthly'
  }
];

const xml = sitemapManager.generateSitemap(pages);
console.log(xml);
```

### Validate Sitemap

```javascript
// Define a status checker function
const statusChecker = async (url) => {
  // Your logic to check URL status
  return {
    status: 200,
    noindex: false,
    isRedirect: false,
    finalUrl: url
  };
};

const parsed = await sitemapManager.parseSitemap();
const urls = sitemapManager.extractUrls(parsed);
const issues = await sitemapManager.validateSitemap(urls, statusChecker);

console.log(`Found ${issues.length} issues`);
issues.forEach(issue => {
  console.log(`${issue.url}: ${issue.message}`);
});
```

### Clean Sitemap

```javascript
// Remove invalid URLs
const urlsToRemove = [
  'https://www.scrapiz.in/old-page',
  'https://www.scrapiz.in/deleted-page'
];

const result = await sitemapManager.cleanSitemap(urlsToRemove);
console.log(`Removed ${result.removedCount} URLs`);
console.log(`Remaining: ${result.remainingCount} URLs`);
```

### Add URLs to Sitemap

```javascript
const newPages = [
  {
    url: 'https://www.scrapiz.in/new-page',
    lastmod: '2025-12-01',
    priority: '0.7',
    changefreq: 'monthly'
  }
];

const result = await sitemapManager.addUrls(newPages);
console.log(`Added ${result.addedCount} URLs`);
console.log(`Skipped ${result.skippedCount} duplicates`);
```

### Update URL Metadata

```javascript
const result = await sitemapManager.updateUrl(
  'https://www.scrapiz.in/about',
  {
    lastmod: '2025-12-01',
    priority: '0.9'
  }
);

console.log(`Updated: ${result.url}`);
```

### Get Statistics

```javascript
const stats = await sitemapManager.getStatistics();

console.log(`Total URLs: ${stats.totalUrls}`);
console.log(`With lastmod: ${stats.withLastmod}`);
console.log(`With priority: ${stats.withPriority}`);
console.log('By priority:', stats.byPriority);
console.log('By changefreq:', stats.byChangefreq);
```

### Validate Structure

```javascript
const validation = await sitemapManager.validateStructure();

if (validation.valid) {
  console.log('Sitemap structure is valid');
} else {
  console.log('Sitemap structure has issues:');
  validation.issues.forEach(issue => {
    console.log(`${issue.severity}: ${issue.message}`);
  });
}
```

## Validation Issues

The validator checks for the following issues:

### Error Level Issues
- **invalid-url**: URL format is invalid
- **redirect**: URL returns a redirect status (301, 302, etc.)
- **not-found**: URL returns 404
- **server-error**: URL returns 5xx status
- **noindex**: URL has noindex directive

### Warning Level Issues
- **non-200-status**: URL returns non-200 status (excluding redirects and 404s)
- **check-failed**: Failed to check URL status
- **missing-lastmod**: URL entry missing lastmod date
- **missing-priority**: URL entry missing priority value

## API Reference

### Constructor

```javascript
new SitemapManager(logger, errorHandler)
```

### Methods

#### `parseSitemap()`
Parse the sitemap XML file.

**Returns**: `Promise<Object>` - Parsed sitemap object

#### `extractUrls(parsedSitemap)`
Extract URLs from parsed sitemap.

**Parameters**:
- `parsedSitemap` (Object): Parsed sitemap object

**Returns**: `Array<Object>` - Array of URL entries with metadata

#### `generateSitemap(pages)`
Generate sitemap XML with proper structure.

**Parameters**:
- `pages` (Array): Array of page objects with url, lastmod, priority, changefreq

**Returns**: `string` - XML sitemap content

#### `validateSitemap(urlEntries, statusChecker)`
Validate sitemap entries.

**Parameters**:
- `urlEntries` (Array): Array of URL entries from sitemap
- `statusChecker` (Function): Function to check URL status

**Returns**: `Promise<Array<Object>>` - Array of validation issues

#### `cleanSitemap(urlsToRemove)`
Remove invalid URLs from sitemap.

**Parameters**:
- `urlsToRemove` (Array): URLs to remove from sitemap

**Returns**: `Promise<Object>` - Result with removed count and new sitemap

#### `addUrls(newPages)`
Add URLs to sitemap.

**Parameters**:
- `newPages` (Array): Array of page objects to add

**Returns**: `Promise<Object>` - Result with added count

#### `updateUrl(url, updates)`
Update existing URL in sitemap.

**Parameters**:
- `url` (string): URL to update
- `updates` (Object): Fields to update (lastmod, priority, changefreq)

**Returns**: `Promise<Object>` - Result

#### `getStatistics()`
Get sitemap statistics.

**Returns**: `Promise<Object>` - Sitemap statistics

#### `validateStructure()`
Validate sitemap structure.

**Returns**: `Promise<Object>` - Validation result

## Error Handling

The SitemapManager uses the ErrorHandler for:
- Creating backups before modifications
- Rolling back changes on errors
- Logging all operations

All operations that modify the sitemap create automatic backups and rollback on failure.

## Best Practices

1. **Always validate before cleaning**: Run validation to identify issues before removing URLs
2. **Use status checker**: Provide a status checker function to validate for comprehensive validation
3. **Check statistics**: Use `getStatistics()` to understand your sitemap composition
4. **Validate structure**: Run `validateStructure()` after generating or modifying sitemaps
5. **Monitor logs**: Check logs for detailed operation information

## Example Workflow

```javascript
// 1. Parse existing sitemap
const parsed = await sitemapManager.parseSitemap();
const urls = sitemapManager.extractUrls(parsed);

// 2. Validate all URLs
const issues = await sitemapManager.validateSitemap(urls, statusChecker);

// 3. Identify URLs to remove
const urlsToRemove = issues
  .filter(i => i.severity === 'error')
  .map(i => i.url);

// 4. Clean sitemap
if (urlsToRemove.length > 0) {
  const result = await sitemapManager.cleanSitemap(urlsToRemove);
  console.log(`Cleaned ${result.removedCount} invalid URLs`);
}

// 5. Get final statistics
const stats = await sitemapManager.getStatistics();
console.log('Final sitemap:', stats);
```

## Integration with Other Modules

The SitemapManager integrates with:
- **IssueDetector**: Use detected issues to clean sitemap
- **RedirectDetector**: Remove redirecting URLs from sitemap
- **NoindexDetector**: Remove noindexed URLs from sitemap
- **NotFoundDetector**: Remove 404 URLs from sitemap

## Notes

- The sitemap path is hardcoded to `public/sitemap.xml`
- Base URL is set to `https://www.scrapiz.in`
- All modifications create automatic backups
- URL normalization is used for comparison to handle trailing slashes and protocol variations
