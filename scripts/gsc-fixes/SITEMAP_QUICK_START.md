# Sitemap Manager Quick Start Guide

## Installation

No additional installation needed. The module uses existing dependencies:
- xml2js (already installed)
- fs/promises (Node.js built-in)
- path (Node.js built-in)

## Basic Usage

### 1. Initialize

```javascript
import SitemapManager from './scripts/gsc-fixes/SitemapManager.js';
import Logger from './scripts/gsc-fixes/logger.js';
import ErrorHandler from './scripts/gsc-fixes/errorHandler.js';

const logger = new Logger();
await logger.initialize();

const errorHandler = new ErrorHandler(logger);
await errorHandler.initialize();

const sitemapManager = new SitemapManager(logger, errorHandler);
```

### 2. Parse Existing Sitemap

```javascript
const parsed = await sitemapManager.parseSitemap();
const urls = sitemapManager.extractUrls(parsed);
console.log(`Found ${urls.length} URLs`);
```

### 3. Validate Sitemap

```javascript
// Define status checker
const statusChecker = async (url) => {
  // Your logic to check URL
  return {
    status: 200,
    noindex: false,
    isRedirect: false,
    finalUrl: url
  };
};

const issues = await sitemapManager.validateSitemap(urls, statusChecker);
console.log(`Found ${issues.length} issues`);
```

### 4. Clean Invalid URLs

```javascript
const urlsToRemove = issues
  .filter(i => i.severity === 'error')
  .map(i => i.url);

const result = await sitemapManager.cleanSitemap(urlsToRemove);
console.log(`Removed ${result.removedCount} URLs`);
```

### 5. Add New URLs

```javascript
const newPages = [
  {
    url: 'https://www.scrapiz.in/new-page',
    lastmod: '2025-12-01',
    priority: '0.7',
    changefreq: 'monthly'
  }
];

await sitemapManager.addUrls(newPages);
```

### 6. Get Statistics

```javascript
const stats = await sitemapManager.getStatistics();
console.log('Total URLs:', stats.totalUrls);
console.log('By priority:', stats.byPriority);
```

## Common Tasks

### Check Sitemap Health

```javascript
// Validate structure
const structureCheck = await sitemapManager.validateStructure();
if (!structureCheck.valid) {
  console.log('Structure issues:', structureCheck.issues);
}

// Get statistics
const stats = await sitemapManager.getStatistics();
console.log(`${stats.withLastmod}/${stats.totalUrls} URLs have lastmod`);
console.log(`${stats.withPriority}/${stats.totalUrls} URLs have priority`);
```

### Remove Redirects and 404s

```javascript
const parsed = await sitemapManager.parseSitemap();
const urls = sitemapManager.extractUrls(parsed);

const statusChecker = async (url) => {
  // Check URL status
  const response = await fetch(url, { redirect: 'manual' });
  return {
    status: response.status,
    isRedirect: response.status >= 300 && response.status < 400,
    noindex: false, // Check response headers/HTML
    finalUrl: url
  };
};

const issues = await sitemapManager.validateSitemap(urls, statusChecker);
const badUrls = issues
  .filter(i => ['redirect', 'not-found'].includes(i.issue))
  .map(i => i.url);

await sitemapManager.cleanSitemap(badUrls);
```

### Update All URLs with Current Date

```javascript
const parsed = await sitemapManager.parseSitemap();
const urls = sitemapManager.extractUrls(parsed);
const today = new Date().toISOString().split('T')[0];

for (const entry of urls) {
  await sitemapManager.updateUrl(entry.loc, { lastmod: today });
}
```

### Generate New Sitemap from Scratch

```javascript
const pages = [
  { url: 'https://www.scrapiz.in/', lastmod: '2025-12-01', priority: '1.0', changefreq: 'weekly' },
  { url: 'https://www.scrapiz.in/about', lastmod: '2025-12-01', priority: '0.8', changefreq: 'monthly' },
  // ... more pages
];

const xml = sitemapManager.generateSitemap(pages);
console.log(xml);
```

## Running the Example

```bash
node scripts/gsc-fixes/example-sitemap-workflow.js
```

## Running Tests

```bash
npm test -- scripts/gsc-fixes/sitemap.test.js
```

## Issue Severity Levels

### Error (Must Fix)
- invalid-url
- redirect
- not-found
- server-error
- noindex

### Warning (Should Fix)
- missing-lastmod
- missing-priority
- non-200-status
- check-failed

## Best Practices

1. **Always validate before cleaning**: Run validation to see what will be removed
2. **Use status checker**: Provide a status checker for comprehensive validation
3. **Check statistics regularly**: Monitor sitemap health with `getStatistics()`
4. **Validate structure**: Run `validateStructure()` after modifications
5. **Review logs**: Check logs for detailed operation information

## Troubleshooting

### "Failed to parse sitemap"
- Check that `public/sitemap.xml` exists
- Verify XML is well-formed
- Check file permissions

### "Failed to create backup"
- Ensure `scripts/gsc-fixes/backups/` directory exists
- Check write permissions

### "URL not found in sitemap"
- URL might have different trailing slash
- Check URL normalization
- Verify exact URL format

## Integration with Other Modules

```javascript
// With IssueDetector
import IssueDetector from './IssueDetector.js';
const detector = new IssueDetector(logger);
const allIssues = await detector.detectAllIssues();

// Remove problematic URLs from sitemap
const urlsToRemove = [
  ...allIssues.redirects.map(i => i.url),
  ...allIssues.notFound.map(i => i.url),
  ...allIssues.noindex.map(i => i.url)
];

await sitemapManager.cleanSitemap(urlsToRemove);
```

## API Quick Reference

| Method | Purpose |
|--------|---------|
| `parseSitemap()` | Parse sitemap XML file |
| `extractUrls(parsed)` | Extract URLs from parsed sitemap |
| `generateSitemap(pages)` | Generate XML sitemap |
| `validateSitemap(urls, checker)` | Validate sitemap entries |
| `cleanSitemap(urlsToRemove)` | Remove invalid URLs |
| `addUrls(newPages)` | Add new URLs |
| `updateUrl(url, updates)` | Update URL metadata |
| `getStatistics()` | Get sitemap statistics |
| `validateStructure()` | Validate XML structure |

## Support

For detailed documentation, see:
- `SitemapManager.README.md` - Full documentation
- `SITEMAP_IMPLEMENTATION.md` - Implementation details
- `example-sitemap-workflow.js` - Working example
