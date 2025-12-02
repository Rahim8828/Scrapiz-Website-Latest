# Canonical Tag Detection and Fixes - Quick Start Guide

## Installation

No additional installation required. The canonical detection and fixing modules are part of the GSC Fix System.

## Quick Usage

### 1. Detect Canonical Issues

```javascript
import CanonicalDetector from './scripts/gsc-fixes/CanonicalDetector.js';
import Logger from './scripts/gsc-fixes/logger.js';
import ErrorHandler from './scripts/gsc-fixes/errorHandler.js';

const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const detector = new CanonicalDetector(logger, errorHandler);

// Check a single URL
const issue = await detector.checkCanonical('https://www.scrapiz.in/about');
console.log(issue);

// Check multiple URLs
const urls = [
  'https://www.scrapiz.in/',
  'https://www.scrapiz.in/about',
  'https://www.scrapiz.in/services'
];
const issues = await detector.checkCanonicals(urls);
console.log(`Found ${issues.length} issues`);
```

### 2. Fix Canonical Issues (Dry Run)

```javascript
import CanonicalFixer from './scripts/gsc-fixes/CanonicalFixer.js';

const fixer = new CanonicalFixer(logger, errorHandler);

// Test fixes without making changes
const results = await fixer.fixCanonicalIssues(issues, { dryRun: true });
console.log(`Would fix ${results.issuesFixed} issues`);
```

### 3. Fix Canonical Issues (Actual)

```javascript
// Apply fixes
const results = await fixer.fixCanonicalIssues(issues, {
  dryRun: false,
  addMissing: true,
  updateInvalid: true
});

console.log(`Fixed: ${results.issuesFixed}`);
console.log(`Failed: ${results.issuesFailed}`);
```

### 4. Detect Duplicate Content

```javascript
// Find duplicates for a URL
const url = 'https://www.scrapiz.in/bandra';
const allUrls = [
  'https://www.scrapiz.in/bandra',
  'https://www.scrapiz.in/bandra-east',
  'https://www.scrapiz.in/jogeshwari'
];

const duplicates = await detector.findDuplicates(url, allUrls);
if (duplicates) {
  console.log(`Found ${duplicates.duplicates.length} duplicates`);
  console.log(`Primary version: ${duplicates.duplicateOf || 'this page'}`);
}
```

### 5. Fix Duplicate Content

```javascript
// Fix duplicate content by adding canonical tags
const duplicateIssues = [
  {
    url: 'https://www.scrapiz.in/bandra-east',
    duplicateOf: 'https://www.scrapiz.in/bandra',
    hasCanonical: false,
    fixable: true
  }
];

const results = await fixer.fixDuplicateContent(duplicateIssues, false);
console.log(`Fixed ${results.issuesFixed} duplicate content issues`);
```

## Common Scenarios

### Scenario 1: Add Missing Canonical Tags

```javascript
// Detect pages without canonical tags
const issues = await detector.checkCanonicals(urls);
const missingCanonicals = issues.filter(i => i.issueType === 'missing');

// Add canonical tags
const results = await fixer.fixCanonicalIssues(missingCanonicals, {
  dryRun: false,
  addMissing: true
});
```

### Scenario 2: Fix Invalid Canonical Targets

```javascript
// Detect pages with invalid canonical targets
const issues = await detector.checkCanonicals(urls);
const invalidTargets = issues.filter(i => i.issueType.startsWith('invalid-target'));

// Update canonical tags
const results = await fixer.fixCanonicalIssues(invalidTargets, {
  dryRun: false,
  updateInvalid: true
});
```

### Scenario 3: Validate Canonical Target

```javascript
// Check if a canonical URL is valid
const validation = await detector.validateCanonicalTarget('https://www.scrapiz.in/about');

if (!validation.valid) {
  console.log(`Invalid: ${validation.reason}`);
  console.log(`Status: ${validation.status}`);
  console.log(`Noindex: ${validation.noindex}`);
}
```

### Scenario 4: Calculate Content Similarity

```javascript
// Compare two pages for similarity
const page1 = await detector.fetchPage('https://www.scrapiz.in/bandra');
const page2 = await detector.fetchPage('https://www.scrapiz.in/bandra-east');

const similarity = detector.calculateContentSimilarity(page1.html, page2.html);
console.log(`Similarity: ${(similarity * 100).toFixed(1)}%`);

if (similarity > 0.8) {
  console.log('Pages are duplicates');
}
```

## Running Examples

### Example Workflow

```bash
node scripts/gsc-fixes/example-canonical-workflow.js
```

### Integration Test

```bash
node scripts/gsc-fixes/test-canonical-integration.js
```

### Unit Tests

```bash
npx vitest run scripts/gsc-fixes/canonical.test.js
```

## Configuration Options

### Detection Options

```javascript
const detector = new CanonicalDetector(logger, errorHandler);

// Adjust similarity threshold for duplicate detection
const duplicates = await detector.detectDuplicateContent(url, compareUrls, 0.9); // 90% similarity
```

### Fix Options

```javascript
const results = await fixer.fixCanonicalIssues(issues, {
  dryRun: false,        // Set to true to test without making changes
  addMissing: true,     // Add missing canonical tags
  updateInvalid: true   // Update invalid canonical tags
});
```

## Issue Types

| Issue Type | Description | Fixable |
|------------|-------------|---------|
| `missing` | No canonical tag | ✓ Yes |
| `invalid-target-invalid-url` | Canonical URL is malformed | ✓ Yes |
| `invalid-target-non-200-status` | Canonical returns non-200 | ✓ Yes |
| `invalid-target-noindex` | Canonical has noindex | ✓ Yes |
| `invalid-target-fetch-error` | Cannot fetch canonical | ✓ Yes |
| `alternative-page` | Intentional canonical to different URL | ✗ No |

## Output Examples

### Detection Output

```javascript
{
  url: 'https://www.scrapiz.in/about',
  currentCanonical: null,
  expectedCanonical: 'https://www.scrapiz.in/about',
  issueType: 'missing',
  inSitemap: false,
  recommendation: 'Add self-referencing canonical tag',
  fixable: true
}
```

### Fix Output

```javascript
{
  success: true,
  issuesFixed: 5,
  issuesFailed: 0,
  details: [
    {
      url: 'https://www.scrapiz.in/about',
      status: 'fixed',
      message: 'Added canonical tag: https://www.scrapiz.in/about',
      filePath: '/path/to/src/pages/About.jsx',
      canonicalUrl: 'https://www.scrapiz.in/about'
    }
  ]
}
```

## Troubleshooting

### Issue: "Could not find source file for URL"

**Solution**: The URL pattern may not be mapped. Add the mapping in `CanonicalFixer.findSourceFile()`.

### Issue: "File does not use react-helmet"

**Solution**: Add react-helmet to the component:

```jsx
import { Helmet } from 'react-helmet';

function Page() {
  return (
    <div>
      <Helmet>
        <title>Page Title</title>
      </Helmet>
      {/* content */}
    </div>
  );
}
```

### Issue: "Could not automatically insert canonical tag"

**Solution**: Manually add the canonical tag to the Helmet component:

```jsx
<Helmet>
  <link rel="canonical" href="https://www.scrapiz.in/page" />
</Helmet>
```

## Best Practices

1. **Always run dry run first** to see what changes would be made
2. **Backup your files** before running actual fixes
3. **Verify fixes** by checking the modified files
4. **Test in browser** to ensure canonical tags are rendered correctly
5. **Use Google Search Console** to validate canonical tags after deployment

## Support

For more information, see:
- `Canonical.README.md` - Full documentation
- `CANONICAL_IMPLEMENTATION.md` - Implementation details
- `example-canonical-workflow.js` - Complete example workflow
