# Automated Fix Script

Comprehensive automated fix script for Google Search Console indexing issues.

## Overview

The automated fix script (`apply-all-fixes.js`) orchestrates all GSC fix modules to automatically resolve indexing issues detected by the audit system. It provides:

- **Dry-run mode** for safe testing before applying changes
- **Automatic backups** of critical files before modifications
- **Comprehensive logging** of all changes made
- **Fix tracking** with execution history
- **Rollback capability** to revert changes if needed
- **Batch processing** for efficient handling of large issue sets
- **Detailed reporting** of fix results

## Features

### 1. Dry-Run Mode

Test fixes without making actual changes:

```bash
node scripts/gsc-fixes/apply-all-fixes.js --dry-run
```

This will:
- Analyze all issues
- Determine what fixes would be applied
- Generate reports showing planned changes
- Not modify any files

### 2. Automatic Backups

Before applying fixes, the script creates:
- Master backup of critical files (.htaccess, sitemap.xml, robots.txt)
- Individual backups for each modified file
- Timestamped backup directories for easy identification

Backups are stored in: `scripts/gsc-fixes/backups/`

### 3. Comprehensive Logging

All operations are logged to: `scripts/gsc-fixes/logs/`

Logs include:
- Timestamp of each operation
- Issue detection details
- Fix application results
- Error messages and stack traces
- Backup and rollback operations

### 4. Fix Tracking

The script maintains a history of all fix executions in: `scripts/gsc-fixes/fix-tracking.json`

Each execution record includes:
- Unique execution ID
- Timestamp
- Summary statistics (fixed, failed, skipped)
- Duration
- Backup path for rollback

### 5. Rollback Capability

If fixes cause issues, you can rollback to the previous state:

```bash
# List all fix executions
node scripts/gsc-fixes/rollback-fixes.js --list

# Rollback a specific execution
node scripts/gsc-fixes/rollback-fixes.js <executionId>

# View fix statistics
node scripts/gsc-fixes/rollback-fixes.js --stats
```

## Usage

### Basic Usage

Apply all fixes with default settings:

```bash
node scripts/gsc-fixes/apply-all-fixes.js
```

### Command Line Options

```bash
node scripts/gsc-fixes/apply-all-fixes.js [options]
```

**Options:**

- `--dry-run` - Run in dry-run mode (no actual changes)
- `--no-backup` - Skip backup creation (not recommended)
- `--no-tracking` - Skip fix tracking
- `--batch-size <number>` - Batch size for processing (default: 10)
- `--audit-file <path>` - Path to existing audit JSON file
- `--help, -h` - Show help message

### Examples

**1. Test fixes before applying (recommended first step):**

```bash
node scripts/gsc-fixes/apply-all-fixes.js --dry-run
```

**2. Apply fixes with default settings:**

```bash
node scripts/gsc-fixes/apply-all-fixes.js
```

**3. Use existing audit results:**

```bash
# First, run audit and save results
node scripts/gsc-fixes/audit-all-issues.js

# Then apply fixes using the audit file
node scripts/gsc-fixes/apply-all-fixes.js --audit-file scripts/gsc-fixes/reports/gsc-issues-<timestamp>.json
```

**4. Apply fixes with custom batch size:**

```bash
node scripts/gsc-fixes/apply-all-fixes.js --batch-size 5
```

**5. Apply fixes without tracking (not recommended):**

```bash
node scripts/gsc-fixes/apply-all-fixes.js --no-tracking
```

## What Gets Fixed

The automated fix script handles the following issue types:

### 1. Soft 404 Errors
- Enhances thin content pages
- Adds redirects for empty pages
- Improves page structure (headings, links)

### 2. Canonical Tag Issues
- Adds missing canonical tags
- Updates incorrect canonical targets
- Ensures self-referencing canonicals for primary pages

### 3. Redirect Issues
- Flattens redirect chains (A→B→C becomes A→C)
- Converts temporary (302) to permanent (301) redirects
- Updates .htaccess with optimized redirect rules

### 4. Noindex Tag Issues
- Removes noindex from valuable pages
- Updates meta robots tags
- Identifies pages that should remain noindexed

### 5. Duplicate Content
- Adds canonical tags to duplicate pages
- Points duplicates to primary version
- Handles URL parameter variations

### 6. 404 Not Found Errors
- Adds 301 redirects for valuable 404s (with backlinks)
- Updates internal links pointing to 404s
- Identifies valueless 404s that can be ignored

### 7. Invalid Structured Data
- Fixes LocalBusiness schema errors
- Corrects FAQPage schema issues
- Adds missing required fields
- Fixes format errors

## Output Reports

After execution, the script generates several reports in `scripts/gsc-fixes/reports/`:

### 1. Summary Report (`fix-<timestamp>-summary.txt`)

Contains:
- Execution metadata (ID, timestamp, duration)
- Overall statistics (fixed, failed, skipped)
- Success rate
- Results by issue type
- Backup information
- Next steps

### 2. Detailed Report (`fix-<timestamp>-detailed.txt`)

Contains:
- Detailed results for each issue type
- Individual fix status for each URL
- Redirect rules applied
- Canonical tags added/updated
- Backup paths for each file modified

### 3. JSON Results (`fix-<timestamp>-results.json`)

Machine-readable format containing:
- Complete fix execution results
- All fix details
- Batch processing information
- Error messages and stack traces

## Workflow

### Recommended Workflow

1. **Run Audit** (optional, but recommended):
   ```bash
   node scripts/gsc-fixes/audit-all-issues.js
   ```

2. **Test Fixes (Dry Run)**:
   ```bash
   node scripts/gsc-fixes/apply-all-fixes.js --dry-run
   ```

3. **Review Dry Run Reports**:
   - Check `scripts/gsc-fixes/reports/fix-dryrun-<timestamp>-summary.txt`
   - Verify planned changes are correct

4. **Apply Fixes**:
   ```bash
   node scripts/gsc-fixes/apply-all-fixes.js
   ```

5. **Review Results**:
   - Check summary report for success rate
   - Review detailed report for any failures
   - Test sample pages in browser

6. **Verify Changes**:
   - Test redirects
   - Validate sitemap in GSC
   - Check schema markup with Google Rich Results Test
   - Verify canonical tags in browser dev tools

7. **Request Re-indexing** (in Google Search Console):
   - Submit updated sitemap
   - Request re-indexing for fixed pages
   - Monitor indexing status

### If Issues Occur

1. **Check Logs**:
   ```bash
   tail -f scripts/gsc-fixes/logs/gsc-fixes-<timestamp>.log
   ```

2. **Review Detailed Report**:
   - Look for failed fixes
   - Check error messages
   - Identify manual actions required

3. **Rollback if Necessary**:
   ```bash
   # List executions
   node scripts/gsc-fixes/rollback-fixes.js --list
   
   # Rollback specific execution
   node scripts/gsc-fixes/rollback-fixes.js <executionId>
   ```

## Safety Features

### 1. Backup System

- **Master Backup**: Created before any fixes are applied
- **Individual Backups**: Created for each file modification
- **Timestamped**: Easy to identify and restore
- **Automatic Rollback**: On error, changes are automatically reverted

### 2. Dry-Run Mode

- Test all fixes without making changes
- Generate reports showing what would be done
- Identify potential issues before applying fixes

### 3. Batch Processing

- Processes issues in configurable batches
- Prevents overwhelming the system
- Allows for incremental progress
- Continues processing even if individual fixes fail

### 4. Error Handling

- Graceful error recovery
- Automatic rollback on critical errors
- Detailed error logging
- Continues processing other issues after individual failures

### 5. Fix Tracking

- Maintains history of all executions
- Enables rollback to any previous state
- Provides statistics and trends
- Helps identify recurring issues

## Troubleshooting

### Issue: Script fails to start

**Solution**: Ensure all dependencies are installed:
```bash
npm install
```

### Issue: Permission errors

**Solution**: Ensure script has execute permissions:
```bash
chmod +x scripts/gsc-fixes/apply-all-fixes.js
```

### Issue: Backup creation fails

**Solution**: Check disk space and permissions:
```bash
df -h
ls -la scripts/gsc-fixes/backups/
```

### Issue: Some fixes fail

**Solution**: 
1. Check detailed report for specific errors
2. Review logs for stack traces
3. Some fixes may require manual intervention
4. Check if files are locked or in use

### Issue: .htaccess not updated

**Solution**:
1. Verify .htaccess exists and is writable
2. Check for syntax errors in existing .htaccess
3. Review backup to ensure it was created
4. Manually verify redirect rules

### Issue: Need to undo changes

**Solution**: Use rollback script:
```bash
node scripts/gsc-fixes/rollback-fixes.js --list
node scripts/gsc-fixes/rollback-fixes.js <executionId>
```

## Best Practices

1. **Always run dry-run first** before applying fixes
2. **Keep backups** - don't disable backup creation
3. **Review reports** before and after applying fixes
4. **Test in staging** if possible before production
5. **Monitor GSC** after applying fixes to track improvements
6. **Document changes** for your team
7. **Run incrementally** - fix critical issues first, then others
8. **Verify manually** - spot-check a few fixed pages
9. **Track history** - keep fix-tracking.json for reference
10. **Plan rollback** - know how to revert if needed

## Integration with Other Scripts

The automated fix script integrates with:

- **audit-all-issues.js** - Detects issues to fix
- **FixExecutor.js** - Orchestrates all fixers
- **ReportGenerator.js** - Generates reports
- **All detector modules** - Identifies specific issues
- **All fixer modules** - Applies specific fixes

## Performance Considerations

- **Batch Size**: Adjust based on system resources (default: 10)
- **Parallel Processing**: Uses Promise.all for independent operations
- **Rate Limiting**: Respects external API limits
- **Memory Usage**: Processes in batches to avoid memory issues
- **Disk I/O**: Minimizes file reads/writes through caching

## Security Considerations

- **Backup Before Changes**: Always creates backups
- **Input Validation**: Sanitizes all URLs and content
- **Injection Prevention**: Escapes special characters in .htaccess
- **Access Control**: Respects file permissions
- **Audit Trail**: Logs all changes for accountability

## Support

For issues or questions:

1. Check this README
2. Review logs in `scripts/gsc-fixes/logs/`
3. Check detailed reports in `scripts/gsc-fixes/reports/`
4. Review individual module READMEs
5. Check fix-tracking.json for execution history

## Related Documentation

- [Audit Script README](./AUDIT_SCRIPT_README.md)
- [Fix Executor README](./FixExecutor.README.md)
- [Report Generator README](./ReportGenerator.README.md)
- [Individual Module READMEs](./README.md)
