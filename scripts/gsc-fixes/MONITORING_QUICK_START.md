# Monitoring Quick Start Guide

## What is Monitoring?

The monitoring system tracks your website's indexing issues over time, helping you:
- See if your SEO fixes are working
- Catch new problems early
- Understand trends in your site's health
- Get alerts for critical issues

## Quick Start (3 Steps)

### Step 1: Run Your First Monitoring

```bash
node scripts/gsc-fixes/monitor-indexing.js
```

This will:
- Run a complete audit of your site
- Save the results to history
- Generate monitoring reports

**First time?** You'll see "This is the first audit - no comparison available". That's normal!

### Step 2: Make Some Fixes

Apply fixes to your site:

```bash
node scripts/gsc-fixes/apply-all-fixes.js
```

Or manually fix issues based on the audit report.

### Step 3: Run Monitoring Again

Wait a day (or a few hours) and run monitoring again:

```bash
node scripts/gsc-fixes/monitor-indexing.js
```

Now you'll see:
- ✅ Comparison with previous audit
- 📈 Trend analysis
- 🔔 Alerts for new critical issues

## Understanding the Output

### Console Output

```
MONITORING SUMMARY
================================================================================

CURRENT STATUS:
  Total Issues: 38
  Critical: 8
  Warnings: 30
  Fixable: 35

CHANGES SINCE LAST AUDIT:
  Total Issues: -7 ↓
  Critical: -4 ↓
  Warnings: -3 ↓

OVERALL TRENDS:
  Total Issues: improving
  Critical Issues: improving

ALERTS:
  Critical: 1
  Warnings: 0
```

### What the Symbols Mean

- `↓` - Decreasing (good for issues!)
- `↑` - Increasing (bad for issues!)
- `→` - No change
- `✓` - Improving trend
- `✗` - Worsening trend

### Report Files

After running, you'll find reports in `scripts/gsc-fixes/reports/`:

1. **`monitoring-[timestamp]-comparison.txt`**
   - Shows changes since last audit
   - Lists new and resolved issues

2. **`monitoring-[timestamp]-trends.txt`**
   - Shows trends across multiple audits
   - Identifies improving/worsening metrics

3. **`monitoring-[timestamp]-alerts.txt`**
   - Lists critical issues needing attention
   - Provides recommended actions

4. **`monitoring-[timestamp]-full.txt`**
   - Complete monitoring report
   - Combines all sections

## Common Scenarios

### Scenario 1: After Applying Fixes

**Goal:** Verify fixes worked

```bash
# Before fixes
node scripts/gsc-fixes/monitor-indexing.js

# Apply fixes
node scripts/gsc-fixes/apply-all-fixes.js

# Wait a few hours, then check
node scripts/gsc-fixes/monitor-indexing.js
```

**Look for:**
- Decreasing issue counts (↓)
- "improving" trends
- Resolved issues in comparison report

### Scenario 2: Daily Monitoring

**Goal:** Track progress and catch new issues

```bash
# Add to crontab (runs daily at 9 AM)
0 9 * * * cd /path/to/project && node scripts/gsc-fixes/monitor-indexing.js
```

**Look for:**
- New critical alerts
- Sudden spikes in issues
- Consistent improvement trends

### Scenario 3: Weekly Review

**Goal:** Review long-term trends

```bash
# Analyze last 30 audits
TREND_LIMIT=30 node scripts/gsc-fixes/monitor-indexing.js
```

**Look for:**
- Overall trend direction
- Recurring issue patterns
- Areas needing attention

## Alert Types

### 🔴 Critical Alerts (Take Action Now!)

**New 404 errors with backlinks**
- External sites link to these pages
- You're losing link equity
- **Action:** Implement 301 redirects

**New invalid schema**
- Prevents rich results in search
- **Action:** Fix schema markup errors

**High critical issue count**
- More than 10 critical issues
- **Action:** Prioritize fixing critical issues

### 🟡 Warning Alerts (Monitor Closely)

**Issues spike**
- Total issues increased by >20%
- **Action:** Investigate what changed

## Tips for Success

### 1. Run Regularly

```bash
# Daily monitoring (recommended)
node scripts/gsc-fixes/monitor-indexing.js
```

Regular monitoring helps you:
- Catch issues early
- Track fix effectiveness
- Build historical data

### 2. Review Alerts

Always check alerts after each run:

```bash
# Check latest alerts
cat scripts/gsc-fixes/reports/monitoring-*-alerts.txt | tail -50
```

### 3. Track Trends

Use trend reports to see the big picture:

```bash
# View latest trend report
cat scripts/gsc-fixes/reports/monitoring-*-trends.txt | tail -50
```

### 4. Compare Before/After

When making changes:
1. Run monitoring before changes
2. Make changes
3. Run monitoring after changes
4. Compare the results

## Troubleshooting

### "No previous audit found"

**Cause:** This is your first audit
**Solution:** Run monitoring again tomorrow to see comparisons

### "No audit history available"

**Cause:** History files were deleted
**Solution:** Run monitoring to start fresh history

### No alerts generated

**Cause:** Your site is healthy!
**Solution:** This is good - no action needed

### Monitoring takes too long

**Solution:** Disable slow checks:

```bash
# Skip internal link scanning
INCLUDE_LINK_SCAN=false node scripts/gsc-fixes/monitor-indexing.js

# Skip duplicate detection
INCLUDE_DUPLICATES=false node scripts/gsc-fixes/monitor-indexing.js
```

## Advanced Usage

### Custom Options

```bash
# Custom base URL
BASE_URL=https://example.com node scripts/gsc-fixes/monitor-indexing.js

# Custom sitemap path
SITEMAP_PATH=public/custom-sitemap.xml node scripts/gsc-fixes/monitor-indexing.js

# Analyze more audits in trends
TREND_LIMIT=20 node scripts/gsc-fixes/monitor-indexing.js
```

### Programmatic Usage

```javascript
import IndexingMonitor from './scripts/gsc-fixes/monitor-indexing.js';

const monitor = new IndexingMonitor({
  baseUrl: 'https://scrapiz.com',
  trendLimit: 10
});

const result = await monitor.runMonitoring();

if (result.success) {
  console.log('Issues:', result.currentAudit.summary.totalIssues);
  console.log('Alerts:', result.alerts.length);
}
```

## Next Steps

1. **Set up daily monitoring**
   - Add to cron or CI/CD pipeline
   - Review reports regularly

2. **Fix critical issues**
   - Check alerts report
   - Use automated fix script
   - Verify with monitoring

3. **Track progress**
   - Review trend reports weekly
   - Celebrate improvements!
   - Adjust strategy as needed

## Need Help?

- 📖 Full documentation: [Monitoring.README.md](./Monitoring.README.md)
- 💡 Examples: Run `node scripts/gsc-fixes/example-monitoring-workflow.js`
- 🐛 Issues: Check logs in `scripts/gsc-fixes/logs/`

## Summary

```bash
# Basic workflow
node scripts/gsc-fixes/monitor-indexing.js  # Run monitoring
cat scripts/gsc-fixes/reports/monitoring-*-alerts.txt  # Check alerts
node scripts/gsc-fixes/apply-all-fixes.js  # Fix issues
node scripts/gsc-fixes/monitor-indexing.js  # Verify fixes
```

That's it! You're now monitoring your site's indexing health. 🎉
