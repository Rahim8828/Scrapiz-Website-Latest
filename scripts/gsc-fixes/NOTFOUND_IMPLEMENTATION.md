# 404 Not Found Implementation Guide

This guide explains how to implement 404 error detection and fixing for your website.

## Overview

The 404 detection and fixing system helps you:
1. Find all 404 errors on your site
2. Determine which 404s are valuable (have backlinks or internal links)
3. Add 301 redirects for valuable 404s
4. Update or remove internal links pointing to 404s
5. Ensure valueless 404s are properly handled

## Implementation Steps

### Step 1: Gather URLs to Check

Collect URLs that might be returning 404 errors from:

**Google Search Console:**
- Go to Coverage report
- Look for "Not found (404)" errors
- Export the list of URLs

**Analytics:**
- Check for pages with high bounce rates
- Look for pages with declining traffic
- Review exit pages

**Sitemap:**
- Compare current sitemap with old versions
- Identify removed pages

**Server Logs:**
- Parse access logs for 404 responses
- Identify frequently requested 404 URLs

```javascript
const urlsToCheck = [
  'https://scrapiz.com/old-page',
  'https://scrapiz.com/deleted-product',
  // ... more URLs from GSC, analytics, etc.
];
```

### Step 2: Collect All Site URLs

You need a list of all current URLs on your site to:
- Scan for internal links pointing to 404s
- Find similar URLs for redirect targets

**Methods to collect site URLs:**

1. **From Sitemap:**
```javascript
import xml2js from 'xml2js';
import fs from 'fs/promises';

async function getUrlsFromSitemap() {
  const sitemapXml = await fs.readFile('public/sitemap.xml', 'utf-8');
  const result = await xml2js.parseStringPromise(sitemapXml);
  
  return result.urlset.url.map(entry => entry.loc[0]);
}
```

2. **From Routes (React/Vite):**
```javascript
import { routes } from './src/App.jsx';

function getUrlsFromRoutes(baseUrl) {
  return routes.map(route => `${baseUrl}${route.path}`);
}
```

3. **From Crawling:**
```javascript
// Use a crawler to discover all pages
// Libraries: crawler, simplecrawler, etc.
```

### Step 3: Run Detection

```javascript
import NotFoundDetector from './scripts/gsc-fixes/NotFoundDetector.js';
import Logger from './scripts/gsc-fixes/logger.js';
import ErrorHandler from './scripts/gsc-fixes/errorHandler.js';

const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const detector = new NotFoundDetector(logger, errorHandler);

// Detect 404 issues with full analysis
const issues = await detector.detect404Issues(urlsToCheck, siteUrls);

console.log(`Found ${issues.length} 404 errors`);
```

### Step 4: Analyze Results

```javascript
// Analyze patterns
const analysis = detector.analyze404Patterns(issues);

console.log('404 Analysis:');
console.log(`  Total: ${analysis.total404s}`);
console.log(`  With backlinks: ${analysis.with404Backlinks}`);
console.log(`  With internal links: ${analysis.withInternalLinks}`);
console.log(`  Valuable: ${analysis.shouldRedirect}`);
console.log(`  Valueless: ${analysis.valueless}`);

// Separate valuable from valueless
const valuableIssues = issues.filter(issue => issue.hasValue);
const valuelessIssues = issues.filter(issue => !issue.hasValue);
```

### Step 5: Find Redirect Targets

For each valuable 404, find the best redirect target:

```javascript
for (const issue of valuableIssues) {
  const redirectTarget = await detector.findBestRedirectTarget(
    issue.url, 
    siteUrls
  );
  
  issue.suggestedTarget = redirectTarget;
  
  console.log(`${issue.url} -> ${redirectTarget}`);
}
```

**Manual Review:**

Some 404s may need manual review to choose the best redirect target:

```javascript
const needsManualReview = valuableIssues.filter(
  issue => !issue.suggestedTarget || issue.internalLinksCount > 10
);

console.log('These 404s need manual review:');
needsManualReview.forEach(issue => {
  console.log(`  ${issue.url}`);
  console.log(`    Internal links: ${issue.internalLinksCount}`);
  console.log(`    Has backlinks: ${issue.hasBacklinks}`);
});
```

### Step 6: Preview Fixes (Dry Run)

Always run in dry-run mode first to preview changes:

```javascript
import NotFoundFixer from './scripts/gsc-fixes/NotFoundFixer.js';

const fixer = new NotFoundFixer(logger, errorHandler);

const dryRunResult = await fixer.fix404Issues(issues, {
  dryRun: true,
  addRedirects: true,
  updateInternalLinks: true,
  updateHtaccess: true,
  siteUrls: siteUrls
});

console.log('Dry Run Results:');
console.log(`  Would fix: ${dryRunResult.issuesFixed}`);
console.log(`  Would fail: ${dryRunResult.issuesFailed}`);
console.log(`  Redirects to add: ${dryRunResult.redirectRules.length}`);
console.log(`  Links to update: ${dryRunResult.linksUpdated}`);

// Review redirect rules
dryRunResult.redirectRules.forEach(rule => {
  console.log(`  ${rule.from} -> ${rule.to}`);
});
```

### Step 7: Apply Fixes

After reviewing the dry run results, apply the fixes:

```javascript
// Create backup first
await errorHandler.createBackup('public/.htaccess');

// Apply fixes
const result = await fixer.fix404Issues(issues, {
  dryRun: false,
  addRedirects: true,
  updateInternalLinks: true,
  updateHtaccess: true,
  siteUrls: siteUrls
});

console.log('Fix Results:');
console.log(`  Fixed: ${result.issuesFixed}`);
console.log(`  Failed: ${result.issuesFailed}`);
console.log(`  Redirects added: ${result.redirectRules.length}`);
console.log(`  Links updated: ${result.linksUpdated}`);

if (result.htaccessUpdated) {
  console.log(`  .htaccess updated: ${result.htaccessPath}`);
  console.log(`  Backup: ${result.htaccessPath}.backup.*`);
}
```

### Step 8: Verify Fixes

After applying fixes, verify they work:

**1. Test Redirects:**
```bash
# Test each redirect
curl -I https://scrapiz.com/old-page
# Should return: HTTP/1.1 301 Moved Permanently
# Location: /new-page
```

**2. Check .htaccess Syntax:**
```bash
# Validate Apache configuration
apachectl configtest
```

**3. Test in Browser:**
- Visit each old URL
- Verify it redirects to the correct new URL
- Check that the redirect is fast (no chains)

**4. Monitor Google Search Console:**
- Wait 1-2 weeks
- Check if 404 errors decrease
- Verify redirected URLs are being crawled

**5. Check Analytics:**
- Monitor traffic to redirect targets
- Verify no increase in bounce rate
- Check that users are finding content

### Step 9: Handle Valueless 404s

For 404s without backlinks or internal links:

```javascript
const valuelessIssues = issues.filter(issue => !issue.hasValue);

console.log('Valueless 404s (can be ignored):');
valuelessIssues.forEach(issue => {
  console.log(`  ${issue.url}`);
});

// Ensure they're not in sitemap
// Ensure they return proper 404 status
// No action needed - let them 404
```

## Backlink Integration

The `checkBacklinks()` method is a placeholder. To implement real backlink checking:

### Option 1: Google Search Console API

```javascript
import { google } from 'googleapis';

async function checkBacklinks(url) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'path/to/service-account-key.json',
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
  });

  const webmasters = google.webmasters({ version: 'v3', auth });

  const response = await webmasters.searchanalytics.query({
    siteUrl: 'https://scrapiz.com',
    requestBody: {
      dimensions: ['page'],
      dimensionFilterGroups: [{
        filters: [{
          dimension: 'page',
          expression: url
        }]
      }],
      startDate: '2024-01-01',
      endDate: '2024-12-31'
    }
  });

  return response.data.rows && response.data.rows.length > 0;
}
```

### Option 2: Ahrefs API

```javascript
import axios from 'axios';

async function checkBacklinks(url) {
  const response = await axios.get('https://api.ahrefs.com/v3/site-explorer/backlinks', {
    params: {
      target: url,
      token: process.env.AHREFS_API_TOKEN
    }
  });

  return response.data.backlinks && response.data.backlinks.length > 0;
}
```

### Option 3: Manual CSV Import

```javascript
import fs from 'fs/promises';
import { parse } from 'csv-parse/sync';

async function loadBacklinksFromCSV() {
  const csvContent = await fs.readFile('backlinks.csv', 'utf-8');
  const records = parse(csvContent, { columns: true });
  
  const backlinksMap = new Map();
  records.forEach(record => {
    backlinksMap.set(record.targetUrl, true);
  });
  
  return backlinksMap;
}

// Use in detector
const backlinksMap = await loadBacklinksFromCSV();

async function checkBacklinks(url) {
  return backlinksMap.has(url);
}
```

## Internal Link Updates

The `removeLinksFromPage()` method is a placeholder. To implement actual link updates:

### For React/JSX Files:

```javascript
import fs from 'fs/promises';

async function updateLinksInJSX(filePath, oldUrl, newUrl) {
  let content = await fs.readFile(filePath, 'utf-8');
  
  // Replace href attributes
  content = content.replace(
    new RegExp(`href=["']${oldUrl}["']`, 'g'),
    `href="${newUrl}"`
  );
  
  // Replace to prop in Link components
  content = content.replace(
    new RegExp(`to=["']${oldUrl}["']`, 'g'),
    `to="${newUrl}"`
  );
  
  await fs.writeFile(filePath, content, 'utf-8');
}
```

### For HTML Files:

```javascript
import * as cheerio from 'cheerio';

async function updateLinksInHTML(filePath, oldUrl, newUrl) {
  const html = await fs.readFile(filePath, 'utf-8');
  const $ = cheerio.load(html);
  
  $(`a[href="${oldUrl}"]`).attr('href', newUrl);
  
  await fs.writeFile(filePath, $.html(), 'utf-8');
}
```

## Best Practices

### 1. Prioritize by Value

Fix 404s in this order:
1. High backlinks + high internal links
2. High backlinks + low internal links
3. Low backlinks + high internal links
4. No backlinks + high internal links

```javascript
issues.sort((a, b) => {
  const aScore = (a.hasBacklinks ? 1000 : 0) + a.internalLinksCount;
  const bScore = (b.hasBacklinks ? 1000 : 0) + b.internalLinksCount;
  return bScore - aScore;
});
```

### 2. Choose Quality Redirect Targets

- Same topic/category is best
- Parent category is good
- Homepage is last resort
- Never redirect to another 404

### 3. Update Links, Don't Just Redirect

- Redirects have performance cost
- Direct links are better for SEO
- Better user experience

### 4. Monitor and Iterate

- Check GSC weekly for new 404s
- Review redirect performance
- Update targets if needed

## Troubleshooting

### Issue: Too Many 404s

**Solution:** Process in batches

```javascript
const batchSize = 50;
for (let i = 0; i < issues.length; i += batchSize) {
  const batch = issues.slice(i, i + batchSize);
  await fixer.fix404Issues(batch, options);
}
```

### Issue: Can't Find Good Redirect Target

**Solution:** Manual review or redirect to section page

```javascript
// Fallback to section page
const urlObj = new URL(issue.url);
const firstSegment = urlObj.pathname.split('/')[1];
const sectionUrl = `https://scrapiz.com/${firstSegment}`;

issue.suggestedTarget = sectionUrl;
```

### Issue: Redirect Loops

**Solution:** Validate redirect targets

```javascript
async function validateRedirectTarget(targetUrl) {
  const status = await detector.checkHttpStatus(targetUrl);
  
  if (status.status === 404) {
    throw new Error('Redirect target is also 404');
  }
  
  if (status.isRedirect) {
    throw new Error('Redirect target is itself a redirect');
  }
  
  return true;
}
```

## Requirements Validation

This implementation validates:

- **Requirement 8.1** - Determines if 404 should exist
- **Requirement 8.2** - Creates pages (manual step)
- **Requirement 8.3** - Implements 301 redirects for valuable 404s
- **Requirement 8.4** - Ensures valueless 404s return proper status
- **Requirement 8.5** - Updates internal links to 404s

## Next Steps

After implementing 404 fixes:

1. **Monitor Results:**
   - Track 404 errors in GSC
   - Monitor redirect performance
   - Check analytics for impact

2. **Automate:**
   - Set up weekly 404 checks
   - Create alerts for new 404s
   - Automate common fixes

3. **Prevent Future 404s:**
   - Validate links before deployment
   - Use proper redirects when moving pages
   - Keep sitemap updated

## See Also

- [NotFound.README.md](./NotFound.README.md) - API documentation
- [example-notfound-workflow.js](./example-notfound-workflow.js) - Complete example
- [REDIRECT_IMPLEMENTATION.md](./REDIRECT_IMPLEMENTATION.md) - Redirect handling
