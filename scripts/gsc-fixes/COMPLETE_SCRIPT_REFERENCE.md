# Complete Script Reference Guide

## Overview

This document provides a comprehensive reference for all scripts in the GSC Fix System, including their purpose, usage, parameters, and examples.

---

## Core Scripts

### 1. audit-all-issues.js

**Purpose**: Comprehensive audit of all indexing issues across the website.

**Usage**:
```bash
node scripts/gsc-fixes/audit-all-issues.js
```

**What it does**:
- Scans all pages for soft 404 errors
- Checks canonical tag implementation
- Detects redirect chains
- Identifies noindex tags
- Finds duplicate content
- Validates schema markup
- Checks sitemap validity
- Analyzes robots.txt

**Output**:
- Console report with issue summary
- JSON report: `scripts/gsc-fixes/reports/example-complete-audit.json`
- CSV report: `scripts/gsc-fixes/reports/example-complete-audit.csv`
- Detailed text report: `scripts/gsc-fixes/reports/example-complete-audit-detailed.txt`

**Example Output**:
```
=== GSC Indexing Issues Audit ===
Total Pages Scanned: 45
Total Issues Found: 23

Issues by Type:
- Soft 404: 5 pages
- Canonical Issues: 8 pages
- Redirect Issues: 4 pages
- Noindex Issues: 2 pages
- Duplicate Content: 3 pages
- Schema Errors: 1 page
```

**See Also**: [AUDIT_SCRIPT_README.md](./AUDIT_SCRIPT_README.md)

---

### 2. apply-all-fixes.js

**Purpose**: Automated application of all detected fixes.

**Usage**:
```bash
# Dry run (preview changes without applying)
node scripts/gsc-fixes/apply-all-fixes.js --dry-run

# Apply fixes
node scripts/gsc-fixes/apply-all-fixes.js

# Apply specific fix types only
node scripts/gsc-fixes/apply-all-fixes.js --types=canonical,redirects
```

**Parameters**:
- `--dry-run`: Preview changes without applying them
- `--types=<types>`: Comma-separated list of fix types to apply
  - Available types: `soft404`, `canonical`, `redirects`, `noindex`, `duplicates`, `schema`, `sitemap`, `robotstxt`
- `--skip-backup`: Skip backup creation (not recommended)

**What it does**:
- Creates backups of all files before changes
- Applies fixes based on audit results
- Updates .htaccess with redirects
- Adds/updates canonical tags
- Removes inappropriate noindex tags
- Fixes schema markup errors
- Updates sitemap
- Logs all changes

**Output**:
- Fix summary report
- Updated files with backups
- Fix tracking log: `scripts/gsc-fixes/fix-tracking.json`

**See Also**: [AUTOMATED_FIX_README.md](./AUTOMATED_FIX_README.md), [AUTOMATED_FIX_QUICK_START.md](./AUTOMATED_FIX_QUICK_START.md)

---

### 3. rollback-fixes.js

**Purpose**: Rollback applied fixes to previous state.

**Usage**:
```bash
# Rollback all fixes
node scripts/gsc-fixes/rollback-fixes.js

# Rollback specific backup
node scripts/gsc-fixes/rollback-fixes.js --backup=master-1234567890
```

**Parameters**:
- `--backup=<id>`: Specific backup ID to restore
- `--list`: List available backups

**What it does**:
- Restores files from backup directory
- Reverts .htaccess changes
- Restores sitemap
- Updates fix tracking log

**See Also**: [AUTOMATED_FIX_README.md](./AUTOMATED_FIX_README.md)

---

### 4. monitor-indexing.js

**Purpose**: Continuous monitoring of indexing status and issue detection.

**Usage**:
```bash
# Run monitoring check
node scripts/gsc-fixes/monitor-indexing.js

# Schedule with cron (daily at 2 AM)
0 2 * * * cd /path/to/project && node scripts/gsc-fixes/monitor-indexing.js
```

**What it does**:
- Runs comprehensive audit
- Compares with previous audit results
- Detects new issues
- Generates trend reports
- Sends alerts for critical issues
- Tracks improvements over time

**Output**:
- Monitoring history: `scripts/gsc-fixes/monitoring-history/audit-{timestamp}.json`
- Alert logs: `scripts/gsc-fixes/alerts/alerts-{timestamp}.json`
- Trend reports in console

**See Also**: [MONITORING_QUICK_START.md](./MONITORING_QUICK_START.md), [Monitoring.README.md](./Monitoring.README.md)

---

## Specialized Scripts

### 5. validate-sitemap.js

**Purpose**: Validate sitemap structure and content.

**Usage**:
```bash
node scripts/gsc-fixes/validate-sitemap.js
```

**What it does**:
- Checks XML structure validity
- Verifies all URLs are accessible (200 status)
- Ensures no redirects in sitemap
- Checks for noindexed pages
- Validates lastmod dates
- Verifies priority values

**See Also**: [SITEMAP_QUICK_START.md](./SITEMAP_QUICK_START.md), [SitemapManager.README.md](./SitemapManager.README.md)

---

### 6. scan-and-fix-noindex.js

**Purpose**: Scan for and fix inappropriate noindex tags.

**Usage**:
```bash
# Scan only
node scripts/gsc-fixes/scan-and-fix-noindex.js --scan-only

# Scan and fix
node scripts/gsc-fixes/scan-and-fix-noindex.js
```

**Parameters**:
- `--scan-only`: Only scan, don't apply fixes
- `--pages=<urls>`: Comma-separated list of specific pages to check

**What it does**:
- Scans all pages for noindex tags
- Identifies valuable pages with noindex
- Removes noindex from valuable pages
- Updates sitemap to exclude noindexed pages
- Generates report

**Output**:
- Scan report: `scripts/gsc-fixes/NOINDEX_SCAN_REPORT.md`

**See Also**: [NOINDEX_IMPLEMENTATION.md](./NOINDEX_IMPLEMENTATION.md), [Noindex.README.md](./Noindex.README.md)

---

### 7. verify-noindex-status.js

**Purpose**: Verify noindex status of specific pages.

**Usage**:
```bash
node scripts/gsc-fixes/verify-noindex-status.js
```

**What it does**:
- Checks meta robots tags
- Checks X-Robots-Tag HTTP headers
- Verifies robots.txt blocking
- Reports noindex status for all pages

---

### 8. audit-and-fix-schema.js

**Purpose**: Audit and fix structured data errors.

**Usage**:
```bash
# Audit only
node scripts/gsc-fixes/audit-and-fix-schema.js --audit-only

# Audit and fix
node scripts/gsc-fixes/audit-and-fix-schema.js
```

**Parameters**:
- `--audit-only`: Only audit, don't apply fixes
- `--validate-online`: Use Google Rich Results Test API (requires API key)

**What it does**:
- Extracts schema markup from pages
- Validates against schema.org specifications
- Identifies missing required fields
- Fixes common errors
- Validates LocalBusiness schema
- Validates FAQPage schema

**Output**:
- Audit report: `scripts/gsc-fixes/reports/schema-audit-report.json`

**See Also**: [SCHEMA_IMPLEMENTATION.md](./SCHEMA_IMPLEMENTATION.md), [SCHEMA_MAINTENANCE_GUIDE.md](./SCHEMA_MAINTENANCE_GUIDE.md)

---

### 9. audit-source-schema.js

**Purpose**: Audit schema markup in source JSX files.

**Usage**:
```bash
node scripts/gsc-fixes/audit-source-schema.js
```

**What it does**:
- Scans JSX files for schema markup
- Validates schema structure
- Checks for common errors
- Reports issues by file

**Output**:
- Source audit report: `scripts/gsc-fixes/reports/source-schema-audit.json`

---

### 10. fix-all-schema-issues.js

**Purpose**: Batch fix all schema issues across the site.

**Usage**:
```bash
node scripts/gsc-fixes/fix-all-schema-issues.js
```

**What it does**:
- Fixes all detected schema errors
- Updates JSX files with corrected schema
- Validates fixes
- Generates fix report

---

### 11. analyze-thin-content.js

**Purpose**: Analyze pages for thin content issues.

**Usage**:
```bash
node scripts/gsc-fixes/analyze-thin-content.js
```

**What it does**:
- Identifies pages with < 500 words
- Analyzes content quality signals
- Checks heading structure
- Counts internal links
- Generates enhancement recommendations

**Output**:
- Analysis report: `scripts/gsc-fixes/reports/thin-content-analysis.json`

---

### 12. enhance-thin-content.js

**Purpose**: Enhance thin content pages with additional content.

**Usage**:
```bash
# Preview enhancements
node scripts/gsc-fixes/enhance-thin-content.js --preview

# Apply enhancements
node scripts/gsc-fixes/enhance-thin-content.js
```

**Parameters**:
- `--preview`: Show proposed enhancements without applying
- `--pages=<urls>`: Specific pages to enhance

**What it does**:
- Adds location-specific content
- Enhances service descriptions
- Adds FAQ sections
- Improves heading structure
- Adds internal links

**Output**:
- Enhancement report: `scripts/gsc-fixes/reports/thin-content-final-report.md`

---

## Testing Scripts

### 13. test-audit-script.js

**Purpose**: Test the audit script functionality.

**Usage**:
```bash
node scripts/gsc-fixes/test-audit-script.js
```

---

### 14. test-monitoring.js

**Purpose**: Test monitoring service functionality.

**Usage**:
```bash
node scripts/gsc-fixes/test-monitoring.js
```

---

### 15. test-imports.js

**Purpose**: Verify all module imports work correctly.

**Usage**:
```bash
node scripts/gsc-fixes/test-imports.js
```

---

## Example Workflow Scripts

These scripts demonstrate how to use individual modules:

- `example-soft404-workflow.js` - Soft 404 detection and fixing
- `example-canonical-workflow.js` - Canonical tag management
- `example-redirect-workflow.js` - Redirect optimization
- `example-noindex-workflow.js` - Noindex tag management
- `example-duplicate-workflow.js` - Duplicate content resolution
- `example-crawl-workflow.js` - Crawl analysis
- `example-notfound-workflow.js` - 404 error handling
- `example-schema-workflow.js` - Schema validation and fixing
- `example-sitemap-workflow.js` - Sitemap management
- `example-robotstxt-workflow.js` - Robots.txt management
- `example-report-workflow.js` - Report generation
- `example-fixexecutor-workflow.js` - Fix execution
- `example-monitoring-workflow.js` - Monitoring setup
- `example-automated-fix-workflow.js` - Complete automated workflow

**Usage**:
```bash
node scripts/gsc-fixes/example-<module>-workflow.js
```

---

## Unit Test Scripts

Run unit tests for individual modules:

```bash
# Test all modules
npm test

# Test specific modules
node scripts/gsc-fixes/test-soft404-unit.js
node scripts/gsc-fixes/test-canonical-integration.js
node scripts/gsc-fixes/test-redirect.js
node scripts/gsc-fixes/test-noindex-unit.js
node scripts/gsc-fixes/test-duplicate-unit.js
node scripts/gsc-fixes/test-notfound-unit.js
node scripts/gsc-fixes/test-schema-unit.js
node scripts/gsc-fixes/test-report-unit.js
node scripts/gsc-fixes/sitemap.test.js
node scripts/gsc-fixes/robotstxt.test.js
node scripts/gsc-fixes/crawl-analyzer.test.js
node scripts/gsc-fixes/canonical.test.js
node scripts/gsc-fixes/redirect-integration.test.js
```

---

## Quick Reference

### Most Common Workflows

**1. Initial Audit**:
```bash
node scripts/gsc-fixes/audit-all-issues.js
```

**2. Apply All Fixes**:
```bash
# Preview first
node scripts/gsc-fixes/apply-all-fixes.js --dry-run

# Apply
node scripts/gsc-fixes/apply-all-fixes.js
```

**3. Monitor Progress**:
```bash
node scripts/gsc-fixes/monitor-indexing.js
```

**4. Rollback if Needed**:
```bash
node scripts/gsc-fixes/rollback-fixes.js
```

---

## File Locations

- **Scripts**: `scripts/gsc-fixes/`
- **Logs**: `scripts/gsc-fixes/logs/`
- **Backups**: `scripts/gsc-fixes/backups/`
- **Reports**: `scripts/gsc-fixes/reports/`
- **Monitoring History**: `scripts/gsc-fixes/monitoring-history/`
- **Alerts**: `scripts/gsc-fixes/alerts/`

---

## Environment Variables

None required. All configuration is handled through command-line parameters or default values.

---

## Dependencies

All dependencies are listed in `package.json`:
- `fast-check` - Property-based testing
- `cheerio` - HTML parsing
- `xml2js` - XML parsing
- `axios` - HTTP client

Install with:
```bash
npm install
```

---

## Support

For detailed documentation on specific modules, see:
- [README.md](./README.md) - Main documentation
- [SETUP.md](./SETUP.md) - Setup instructions
- Individual module README files (e.g., `Canonical.README.md`)
- Implementation summaries (e.g., `CANONICAL_IMPLEMENTATION.md`)
- Quick start guides (e.g., `CANONICAL_QUICK_START.md`)
