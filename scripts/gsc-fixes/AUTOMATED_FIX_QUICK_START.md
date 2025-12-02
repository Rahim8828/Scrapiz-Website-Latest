# Automated Fix Script - Quick Start Guide

## TL;DR

```bash
# 1. Test what would be fixed (DRY RUN - SAFE)
node scripts/gsc-fixes/apply-all-fixes.js --dry-run

# 2. Review the reports in scripts/gsc-fixes/reports/

# 3. Apply fixes for real
node scripts/gsc-fixes/apply-all-fixes.js

# 4. If something goes wrong, rollback
node scripts/gsc-fixes/rollback-fixes.js --list
node scripts/gsc-fixes/rollback-fixes.js <executionId>
```

## Quick Commands

### Run Dry-Run (No Changes)
```bash
node scripts/gsc-fixes/apply-all-fixes.js --dry-run
```

### Apply All Fixes
```bash
node scripts/gsc-fixes/apply-all-fixes.js
```

### Use Existing Audit
```bash
node scripts/gsc-fixes/apply-all-fixes.js --audit-file reports/audit.json
```

### Custom Batch Size
```bash
node scripts/gsc-fixes/apply-all-fixes.js --batch-size 5
```

### Show Help
```bash
node scripts/gsc-fixes/apply-all-fixes.js --help
```

## Rollback Commands

### List All Executions
```bash
node scripts/gsc-fixes/rollback-fixes.js --list
```

### Rollback Specific Execution
```bash
node scripts/gsc-fixes/rollback-fixes.js <executionId>
```

### Show Statistics
```bash
node scripts/gsc-fixes/rollback-fixes.js --stats
```

## What Gets Fixed

- ✅ Soft 404 errors (thin content, empty pages)
- ✅ Canonical tag issues (missing, incorrect)
- ✅ Redirect chains (A→B→C becomes A→C)
- ✅ Noindex tags on valuable pages
- ✅ Duplicate content (adds canonicals)
- ✅ 404 errors (adds redirects for valuable pages)
- ✅ Invalid structured data (schema errors)

## Output Files

Reports are saved to: `scripts/gsc-fixes/reports/`

- `fix-<timestamp>-summary.txt` - Quick overview
- `fix-<timestamp>-detailed.txt` - Full details
- `fix-<timestamp>-results.json` - Machine-readable

Backups are saved to: `scripts/gsc-fixes/backups/`

Logs are saved to: `scripts/gsc-fixes/logs/`

## Safety Features

- 🛡️ **Dry-run mode** - Test without changes
- 💾 **Automatic backups** - Before every change
- 📝 **Comprehensive logging** - Track everything
- ↩️ **Rollback capability** - Undo if needed
- 🔄 **Batch processing** - Handles large sites
- ⚠️ **Error recovery** - Continues on failures

## Recommended Workflow

1. **Run Audit** (optional but recommended)
   ```bash
   node scripts/gsc-fixes/audit-all-issues.js
   ```

2. **Test Fixes (Dry Run)**
   ```bash
   node scripts/gsc-fixes/apply-all-fixes.js --dry-run
   ```

3. **Review Reports**
   - Check `reports/fix-dryrun-<timestamp>-summary.txt`
   - Verify planned changes

4. **Apply Fixes**
   ```bash
   node scripts/gsc-fixes/apply-all-fixes.js
   ```

5. **Verify Changes**
   - Test sample pages
   - Check redirects
   - Validate schema
   - Test in browser

6. **Submit to GSC**
   - Submit updated sitemap
   - Request re-indexing
   - Monitor status

## Common Issues

### Script doesn't run
```bash
# Make sure it's executable
chmod +x scripts/gsc-fixes/apply-all-fixes.js

# Check Node.js version (need v14+)
node --version
```

### Permission errors
```bash
# Check file permissions
ls -la scripts/gsc-fixes/
ls -la public/

# Fix if needed
chmod 644 public/.htaccess
chmod 644 public/sitemap.xml
```

### Some fixes fail
- Check detailed report for specific errors
- Some fixes may require manual intervention
- Review logs for stack traces

### Need to undo changes
```bash
# List executions
node scripts/gsc-fixes/rollback-fixes.js --list

# Rollback
node scripts/gsc-fixes/rollback-fixes.js <executionId>
```

## Important Notes

⚠️ **Always run dry-run first** before applying fixes

⚠️ **Keep backups enabled** - don't use `--no-backup`

⚠️ **Review reports** before and after applying fixes

⚠️ **Test in staging** if possible before production

⚠️ **Monitor GSC** after applying fixes

## Need Help?

1. Check [AUTOMATED_FIX_README.md](./AUTOMATED_FIX_README.md) for full documentation
2. Review logs in `scripts/gsc-fixes/logs/`
3. Check reports in `scripts/gsc-fixes/reports/`
4. Review fix tracking in `scripts/gsc-fixes/fix-tracking.json`

## Example Output

```
================================================================================
AUTOMATED FIX SUMMARY
================================================================================

Execution ID: fix-1234567890
Timestamp: 2024-01-15T10:30:00.000Z
Mode: LIVE
Duration: 45.23s

OVERALL RESULTS
--------------------------------------------------------------------------------
Total Issues: 47
Issues Fixed: 42
Issues Failed: 2
Issues Skipped: 3

Success Rate: 89.4%

RESULTS BY ISSUE TYPE
--------------------------------------------------------------------------------
Soft 404 Errors:
  Fixed: 8
  Failed: 0
  Skipped: 1

Canonical Tag Issues:
  Fixed: 15
  Failed: 0
  Skipped: 0

Redirect Issues:
  Fixed: 10
  Failed: 1
  Skipped: 0

[... more results ...]

BACKUP INFORMATION
--------------------------------------------------------------------------------
Master Backup: scripts/gsc-fixes/backups/master-1234567890

To rollback all changes, run:
  node scripts/gsc-fixes/rollback-fixes.js fix-1234567890

NEXT STEPS
--------------------------------------------------------------------------------
1. Review the fix details in the generated reports
2. Test sample pages in your browser
3. Validate sitemap in Google Search Console
4. Test redirects to ensure they work correctly
5. Verify schema markup with Google Rich Results Test
6. Request re-indexing for fixed pages in GSC

================================================================================
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `--dry-run` | Test without making changes |
| `--no-backup` | Skip backups (not recommended) |
| `--no-tracking` | Skip fix tracking |
| `--batch-size N` | Set batch size (default: 10) |
| `--audit-file PATH` | Use existing audit file |
| `--help` | Show help message |

## Status Codes

- `0` - Success
- `1` - Failure

## File Locations

- **Script**: `scripts/gsc-fixes/apply-all-fixes.js`
- **Rollback**: `scripts/gsc-fixes/rollback-fixes.js`
- **Reports**: `scripts/gsc-fixes/reports/`
- **Backups**: `scripts/gsc-fixes/backups/`
- **Logs**: `scripts/gsc-fixes/logs/`
- **Tracking**: `scripts/gsc-fixes/fix-tracking.json`

---

**Ready to fix your GSC issues? Start with a dry-run!**

```bash
node scripts/gsc-fixes/apply-all-fixes.js --dry-run
```
