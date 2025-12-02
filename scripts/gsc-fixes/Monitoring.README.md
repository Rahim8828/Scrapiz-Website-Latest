# Monitoring Service - README

## Overview

The Monitoring Service tracks Google Search Console indexing issues over time, compares audit results, generates trend reports, and alerts you to critical issues. This helps you understand if your SEO fixes are working and catch new problems early.

## Features

- **Historical Tracking**: Saves every audit to history for long-term analysis
- **Comparison Reports**: Compares current audit with previous audit to show improvements or regressions
- **Trend Analysis**: Analyzes trends across multiple audits to show overall progress
- **Automated Alerts**: Generates alerts for critical issues that need immediate attention
- **Multiple Report Formats**: Generates comparison, trend, and alert reports in text format

## Quick Start

### Run Monitoring

```bash
node scripts/gsc-fixes/monitor-indexing.js
```

This will:
1. Run a complete audit of your site
2. Save the results to history
3. Compare with the previous audit (if available)
4. Generate trend reports
5. Check for critical issues and generate alerts
6. Create comprehensive monitoring reports

### Environment Variables

You can customize the monitoring behavior with environment variables:

```bash
# Set base URL
BASE_URL=https://scrapiz.com node scripts/gsc-fixes/monitor-indexing.js

# Set sitemap path
SITEMAP_PATH=public/sitemap.xml node scripts/gsc-fixes/monitor-indexing.js

# Disable schema validation
INCLUDE_SCHEMA=false node scripts/gsc-fixes/monitor-indexing.js

# Disable duplicate detection
INCLUDE_DUPLICATES=false node scripts/gsc-fixes/monitor-indexing.js

# Disable internal link scanning
INCLUDE_LINK_SCAN=false node scripts/gsc-fixes/monitor-indexing.js

# Set number of audits to include in trend analysis
TREND_LIMIT=20 node scripts/gsc-fixes/monitor-indexing.js
```

## Directory Structure

```
scripts/gsc-fixes/
├── monitoring-history/     # Historical audit results
│   ├── audit-1234567890.json
│   ├── audit-1234567891.json
│   └── ...
├── alerts/                 # Generated alerts
│   ├── alerts-1234567890.json
│   └── ...
└── reports/               # Monitoring reports
    ├── monitoring-1234567890-comparison.txt
    ├── monitoring-1234567890-trends.txt
    ├── monitoring-1234567890-alerts.txt
    └── monitoring-1234567890-full.txt
```

## Report Types

### 1. Comparison Report

Shows changes between the current audit and the previous audit:

- Overall changes in total issues, critical issues, warnings, and fixable issues
- Changes by issue type (soft 404, canonical, redirects, etc.)
- New issues that appeared since last audit
- Resolved issues that were fixed since last audit

**Example:**
```
AUDIT COMPARISON REPORT
================================================================================

Current Audit: 2024-01-15T10:30:00.000Z
Previous Audit: 2024-01-14T10:30:00.000Z
Time Between: 1 day

OVERALL CHANGES
--------------------------------------------------------------------------------
Total Issues: 45 → 38 (-7, -15.6%) ↓
Critical Issues: 12 → 8 (-4, -33.3%) ↓
Warning Issues: 33 → 30 (-3, -9.1%) ↓
Fixable Issues: 40 → 35 (-5, -12.5%) ↓
```

### 2. Trend Report

Shows trends across multiple audits (default: last 10 audits):

- Overall trends for total issues, critical issues, warnings, and fixable issues
- Trends by issue type
- Data points for each audit in the time range

**Example:**
```
INDEXING TRENDS REPORT
================================================================================

Generated: 2024-01-15T10:30:00.000Z
Audits Analyzed: 10
Time Range: 2024-01-05T10:30:00.000Z to 2024-01-15T10:30:00.000Z

OVERALL TRENDS
--------------------------------------------------------------------------------
Total Issues: 60 → 38 (-22, -36.7%) ✓ improving
Critical Issues: 18 → 8 (-10, -55.6%) ✓ improving
Warning Issues: 42 → 30 (-12, -28.6%) ✓ improving
```

### 3. Alerts Report

Lists critical issues that need immediate attention:

- New critical issues detected
- Significant increases in total issues
- New 404 errors with backlinks
- New invalid schema issues
- High number of critical issues

**Example:**
```
ALERTS REPORT
================================================================================

Total Alerts: 2

CRITICAL ALERTS
--------------------------------------------------------------------------------
1. 2 new 404 error(s) with backlinks detected
   Details: {
     "urls": [
       "https://scrapiz.com/old-page",
       "https://scrapiz.com/deleted-page"
     ]
   }

2. 15 critical issues require immediate attention
   Details: {
     "criticalIssues": 15
   }
```

### 4. Full Monitoring Report

Combines all reports into a single comprehensive document:

- Current status summary
- Alerts section
- Comparison section
- Trends section

## Alert Types

### Critical Alerts

- **new_critical_issues**: New critical issues detected since last audit
- **new_404_with_backlinks**: New 404 errors that have external backlinks
- **new_invalid_schema**: New pages with invalid structured data
- **high_critical_count**: More than 10 critical issues total

### Warning Alerts

- **issues_spike**: Total issues increased by more than 20%

## Exit Codes

The monitoring script uses different exit codes to indicate status:

- `0`: Success, no critical alerts
- `1`: Failure, monitoring encountered an error
- `2`: Success with warnings, critical alerts were generated

This allows you to integrate monitoring into CI/CD pipelines or cron jobs.

## Programmatic Usage

You can also use the monitoring service programmatically:

```javascript
import IndexingMonitor from './scripts/gsc-fixes/monitor-indexing.js';

const monitor = new IndexingMonitor({
  baseUrl: 'https://scrapiz.com',
  sitemapPath: 'public/sitemap.xml',
  trendLimit: 10
});

const result = await monitor.runMonitoring();

if (result.success) {
  console.log('Current issues:', result.currentAudit.summary.totalIssues);
  console.log('Alerts:', result.alerts.length);
  
  if (!result.comparison.isFirstAudit) {
    console.log('Change:', result.comparison.totalIssues.change);
  }
}
```

## Monitoring Service API

### MonitoringService Class

#### Methods

**`saveAuditHistory(issueReport)`**
- Saves audit results to history
- Returns: Path to saved history file

**`getAuditHistory()`**
- Retrieves all historical audit results
- Returns: Array of audit results (newest first)

**`getLatestAudit()`**
- Gets the most recent audit result
- Returns: Latest audit or null

**`compareAudits(currentAudit, previousAudit)`**
- Compares two audit results
- Returns: Comparison object with changes and new/resolved issues

**`generateTrendReport(limit)`**
- Generates trend analysis across multiple audits
- Parameters: `limit` - Number of audits to analyze (default: 10)
- Returns: Trend report object

**`checkForAlerts(currentAudit, comparison)`**
- Checks for critical issues and generates alerts
- Returns: Array of alert objects

**`generateComparisonReport(comparison)`**
- Generates formatted comparison report text
- Returns: Formatted text report

**`generateTrendReportText(trendReport)`**
- Generates formatted trend report text
- Returns: Formatted text report

**`generateAlertsReport(alerts)`**
- Generates formatted alerts report text
- Returns: Formatted text report

## Best Practices

### 1. Regular Monitoring

Run monitoring regularly to track progress:

```bash
# Daily monitoring (add to cron)
0 9 * * * cd /path/to/project && node scripts/gsc-fixes/monitor-indexing.js
```

### 2. Review Alerts

Always review critical alerts immediately:
- New 404 errors with backlinks can hurt SEO
- Invalid schema prevents rich results
- Increasing critical issues indicate problems

### 3. Track Trends

Use trend reports to:
- Verify that fixes are working
- Identify recurring issues
- Plan future improvements

### 4. Compare Before/After Fixes

Run monitoring before and after applying fixes to measure impact:

```bash
# Before fixes
node scripts/gsc-fixes/monitor-indexing.js

# Apply fixes
node scripts/gsc-fixes/apply-all-fixes.js

# After fixes (wait a few hours/days)
node scripts/gsc-fixes/monitor-indexing.js
```

### 5. Archive Old History

Periodically archive old history files to keep the system fast:

```bash
# Archive audits older than 90 days
find scripts/gsc-fixes/monitoring-history -name "audit-*.json" -mtime +90 -exec mv {} archive/ \;
```

## Troubleshooting

### No Previous Audit Found

If you see "This is the first audit - no comparison available", this is normal for the first run. Subsequent runs will have comparison data.

### Missing History Files

If history files are missing, they may have been deleted. The monitoring system will start fresh with the next audit.

### Alerts Not Generated

Alerts are only generated when:
- Critical issues increase
- New critical issues appear
- Total issues spike by >20%
- Critical issue count exceeds 10

If your site is healthy, you may not see alerts.

### Trend Report Shows "No audit history available"

This means there are no historical audits saved. Run monitoring at least twice to generate trend reports.

## Integration Examples

### CI/CD Pipeline

```yaml
# .github/workflows/monitor-seo.yml
name: Monitor SEO Issues

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: node scripts/gsc-fixes/monitor-indexing.js
      - name: Upload Reports
        uses: actions/upload-artifact@v2
        with:
          name: monitoring-reports
          path: scripts/gsc-fixes/reports/monitoring-*
```

### Slack Notifications

```javascript
import IndexingMonitor from './scripts/gsc-fixes/monitor-indexing.js';
import { WebClient } from '@slack/web-api';

const monitor = new IndexingMonitor();
const result = await monitor.runMonitoring();

if (result.alerts.length > 0) {
  const slack = new WebClient(process.env.SLACK_TOKEN);
  
  const criticalAlerts = result.alerts.filter(a => a.severity === 'critical');
  
  await slack.chat.postMessage({
    channel: '#seo-alerts',
    text: `🔴 ${criticalAlerts.length} critical SEO issues detected!`,
    attachments: criticalAlerts.map(alert => ({
      text: alert.message,
      color: 'danger'
    }))
  });
}
```

## Requirements

This monitoring service requires:
- Node.js 14+
- All GSC fixes modules (IssueDetector, SchemaValidator, etc.)
- Write access to `scripts/gsc-fixes/monitoring-history/` and `scripts/gsc-fixes/alerts/`

## Related Documentation

- [Audit Script README](./AUDIT_SCRIPT_README.md) - Main audit system
- [Report Generator README](./ReportGenerator.README.md) - Report generation
- [Automated Fix README](./AUTOMATED_FIX_README.md) - Applying fixes

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the generated reports for details
3. Check the logs in `scripts/gsc-fixes/logs/`
