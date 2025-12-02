# Main Audit Script

Comprehensive audit script that runs all GSC issue detectors and generates detailed reports.

## Overview

The main audit script (`audit-all-issues.js`) orchestrates all detection modules to provide a complete analysis of Google Search Console indexing issues on your website.

## Features

- **Comprehensive Detection**: Runs all issue detectors in a single execution
- **Priority Categorization**: Automatically categorizes issues by priority (Critical, High, Medium, Low)
- **Multiple Report Formats**: Generates summary, detailed, CSV, and JSON reports
- **Configurable**: Flexible options for customizing the audit scope
- **Batch Processing**: Efficiently processes large numbers of URLs

## Usage

### Basic Usage

```bash
node scripts/gsc-fixes/audit-all-issues.js
```

### With Environment Variables

```bash
# Set base URL
BASE_URL=https://scrapiz.com node scripts/gsc-fixes/audit-all-issues.js

# Set custom sitemap path
SITEMAP_PATH=public/sitemap.xml node scripts/gsc-fixes/audit-all-issues.js

# Disable schema validation
INCLUDE_SCHEMA=false node scripts/gsc-fixes/audit-all-issues.js

# Disable duplicate detection
INCLUDE_DUPLICATES=false node scripts/gsc-fixes/audit-all-issues.js

# Disable internal link scanning
INCLUDE_LINK_SCAN=false node scripts/gsc-fixes/audit-all-issues.js
```

### Programmatic Usage

```javascript
import MainAudit from './scripts/gsc-fixes/audit-all-issues.js';

const audit = new MainAudit({
  baseUrl: 'https://scrapiz.com',
  sitemapPath: 'public/sitemap.xml',
  includeSchemaValidation: true,
  includeDuplicateDetection: true,
  includeInternalLinkScan: true,
  batchSize: 5
});

const result = await audit.runCompleteAudit();

if (result.success) {
  console.log('Audit completed successfully');
  console.log('Report paths:', result.reportPaths);
  console.log('Total issues:', result.issueReport.summary.totalIssues);
} else {
  console.error('Audit failed:', result.error);
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | string | `'https://scrapiz.com'` | Base URL of the website |
| `sitemapPath` | string | `'public/sitemap.xml'` | Path to sitemap file |
| `includeSchemaValidation` | boolean | `true` | Enable schema markup validation |
| `includeDuplicateDetection` | boolean | `true` | Enable duplicate content detection |
| `includeInternalLinkScan` | boolean | `true` | Enable internal link scanning for 404s |
| `batchSize` | number | `5` | Number of URLs to process in parallel |

## What Gets Detected

The audit script detects the following issue types:

### 1. Soft 404 Errors
- Pages returning 200 status but with thin or low-quality content
- Empty pages
- Pages without proper structure

### 2. Canonical Tag Issues
- Missing canonical tags
- Invalid canonical targets
- Incorrect canonical implementations

### 3. Redirect Issues
- Redirect chains (A→B→C)
- Temporary redirects (302) that should be permanent (301)
- Redirected URLs in sitemap

### 4. Noindex Tag Issues
- Valuable pages blocked by noindex
- Noindex in meta tags or HTTP headers
- Pages blocked by robots.txt

### 5. Duplicate Content
- Pages with similar content (>80% similarity)
- Protocol variations (HTTP vs HTTPS)
- Trailing slash variations

### 6. Crawled But Not Indexed
- Pages with thin content
- Pages with duplicate content
- Pages with low quality signals

### 7. Discovered But Not Indexed
- Pages not in sitemap
- Pages with accessibility issues
- Pages with low internal linking

### 8. 404 Not Found Errors
- 404 pages with backlinks
- 404 pages with internal links
- Valueless 404 pages

### 9. Invalid Structured Data
- Missing required schema fields
- Invalid schema format
- Incorrect schema values

## Generated Reports

The audit generates four types of reports:

### 1. Summary Report (`*-summary.txt`)
- High-level overview of all issues
- Issue counts by type
- Overall statistics

### 2. Detailed Report (`*-detailed.txt`)
- Complete details for each issue
- Specific recommendations
- Priority-based organization

### 3. CSV Report (`*.csv`)
- Spreadsheet-compatible format
- Easy filtering and sorting
- Suitable for tracking fixes

### 4. JSON Report (`*.json`)
- Machine-readable format
- Complete issue data
- Suitable for programmatic processing

## Report Location

All reports are saved to: `scripts/gsc-fixes/reports/`

## Priority Levels

Issues are categorized into four priority levels:

### Critical
- 404 errors with backlinks
- Noindex on valuable pages
- Invalid structured data

### High
- Soft 404 errors
- Redirect chains
- Missing canonical tags

### Medium
- Other redirect issues
- Other canonical issues
- Duplicate content
- Crawled but not indexed pages

### Low
- 404 errors without backlinks
- Discovered but not indexed pages
- Correctly noindexed pages

## Performance Considerations

- **Batch Processing**: URLs are processed in batches to avoid overwhelming the system
- **Rate Limiting**: Small delays between batches prevent server overload
- **Caching**: Page content is cached to avoid redundant requests
- **Configurable Scope**: Disable expensive checks if not needed

## Example Output

```
================================================================================
AUDIT SUMMARY
================================================================================
Total Pages: 45
Total Issues: 23
Critical Issues: 5
Warning Issues: 18
Fixable Issues: 20

Issues by Priority:
  Critical: 5
  High: 8
  Medium: 7
  Low: 3
================================================================================

Reports generated:
  Summary: scripts/gsc-fixes/reports/gsc-report-1234567890-summary.txt
  Detailed: scripts/gsc-fixes/reports/gsc-report-1234567890-detailed.txt
  CSV: scripts/gsc-fixes/reports/gsc-report-1234567890.csv
  JSON: scripts/gsc-fixes/reports/gsc-report-1234567890.json
```

## Troubleshooting

### No URLs Found
- Verify sitemap path is correct
- Check sitemap file exists and is readable
- Ensure sitemap contains valid URLs

### Timeout Errors
- Reduce batch size
- Disable expensive checks (schema validation, duplicate detection)
- Check network connectivity

### Memory Issues
- Process URLs in smaller batches
- Disable duplicate detection for large sites
- Clear caches periodically

## Next Steps

After running the audit:

1. Review the summary report for an overview
2. Check the detailed report for specific recommendations
3. Use the CSV report to track fixes
4. Prioritize critical and high-priority issues
5. Run the automated fix script (task 23) to apply fixes
6. Re-run the audit to verify fixes

## Related Scripts

- `example-fixexecutor-workflow.js` - Apply automated fixes
- `validate-sitemap.js` - Validate sitemap structure
- `scan-and-fix-noindex.js` - Fix noindex issues
- `audit-and-fix-schema.js` - Fix schema issues

## Requirements

- Node.js 14+
- Dependencies: axios, cheerio, xml2js
- Valid sitemap file
- Network access to website

## Support

For issues or questions:
1. Check the logs in `scripts/gsc-fixes/logs/`
2. Review the error messages in the console
3. Consult the individual detector README files
4. Check the design document for expected behavior
