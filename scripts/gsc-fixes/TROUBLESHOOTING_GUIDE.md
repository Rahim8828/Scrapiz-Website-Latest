# Troubleshooting Guide

## Overview

This guide helps you diagnose and resolve common issues when using the GSC Fix System.

---

## Common Issues

### 1. Script Fails to Run

**Symptoms**:
- Error: `Cannot find module`
- Error: `SyntaxError: Unexpected token`
- Script exits immediately

**Possible Causes**:
- Missing dependencies
- Wrong Node.js version
- Incorrect file paths

**Solutions**:

1. **Install dependencies**:
```bash
npm install
```

2. **Check Node.js version** (requires v14+):
```bash
node --version
```

3. **Verify you're in the project root**:
```bash
pwd
# Should show: /path/to/scrapiz-website
```

4. **Run from correct directory**:
```bash
# Always run from project root
node scripts/gsc-fixes/audit-all-issues.js
```

---

### 2. Permission Errors

**Symptoms**:
- Error: `EACCES: permission denied`
- Error: `EPERM: operation not permitted`

**Solutions**:

1. **Check file permissions**:
```bash
ls -la scripts/gsc-fixes/
```

2. **Fix permissions**:
```bash
chmod +x scripts/gsc-fixes/*.js
```

3. **Check directory permissions**:
```bash
chmod 755 scripts/gsc-fixes/logs
chmod 755 scripts/gsc-fixes/backups
chmod 755 scripts/gsc-fixes/reports
```

4. **Run with appropriate user**:
```bash
# Don't use sudo unless necessary
node scripts/gsc-fixes/audit-all-issues.js
```

---

### 3. Network Errors

**Symptoms**:
- Error: `ETIMEDOUT`
- Error: `ECONNREFUSED`
- Error: `getaddrinfo ENOTFOUND`

**Solutions**:

1. **Check internet connection**:
```bash
ping google.com
```

2. **Check if site is accessible**:
```bash
curl -I https://scrapiz.com
```

3. **Retry with backoff** (automatic in scripts):
- Scripts automatically retry failed requests 3 times
- Wait between retries increases exponentially

4. **Check firewall settings**:
- Ensure Node.js can make outbound HTTP requests
- Check corporate proxy settings if applicable

---

### 4. File Not Found Errors

**Symptoms**:
- Error: `ENOENT: no such file or directory`
- Missing sitemap, .htaccess, or page files

**Solutions**:

1. **Verify file exists**:
```bash
ls -la public/sitemap.xml
ls -la public/.htaccess
```

2. **Check file paths in scripts**:
- Ensure paths are relative to project root
- Check for typos in file names

3. **Create missing directories**:
```bash
mkdir -p scripts/gsc-fixes/logs
mkdir -p scripts/gsc-fixes/backups
mkdir -p scripts/gsc-fixes/reports
```

4. **Restore from backup if needed**:
```bash
node scripts/gsc-fixes/rollback-fixes.js --list
node scripts/gsc-fixes/rollback-fixes.js --backup=<backup-id>
```

---

### 5. Backup/Rollback Issues

**Symptoms**:
- Backups not created
- Rollback fails
- Backup directory full

**Solutions**:

1. **Check backup directory**:
```bash
ls -la scripts/gsc-fixes/backups/
```

2. **Verify disk space**:
```bash
df -h
```

3. **Clean old backups** (older than 7 days):
```bash
find scripts/gsc-fixes/backups/ -name "*.backup.*" -mtime +7 -delete
```

4. **Manual backup**:
```bash
cp public/.htaccess public/.htaccess.backup.$(date +%s)
cp public/sitemap.xml public/sitemap.xml.backup.$(date +%s)
```

5. **Manual restore**:
```bash
cp scripts/gsc-fixes/backups/master-1234567890/.htaccess public/.htaccess
```

---

### 6. Schema Validation Errors

**Symptoms**:
- Schema errors not detected
- Fixes don't resolve errors
- Google Rich Results Test still shows errors

**Solutions**:

1. **Validate manually**:
- Visit: https://search.google.com/test/rich-results
- Enter page URL
- Review errors

2. **Check schema format**:
```javascript
// Ensure proper JSON-LD format
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Scrapiz"
}
</script>
```

3. **Common schema errors**:
- Missing required fields (name, address, telephone)
- Invalid telephone format (use international format: +91-XXX-XXX-XXXX)
- Missing @context or @type
- Incorrect nesting of properties

4. **Re-run schema audit**:
```bash
node scripts/gsc-fixes/audit-and-fix-schema.js
```

5. **Check source files**:
```bash
node scripts/gsc-fixes/audit-source-schema.js
```

---

### 7. Sitemap Issues

**Symptoms**:
- Sitemap contains redirects
- Sitemap contains 404s
- Sitemap contains noindexed pages
- GSC shows sitemap errors

**Solutions**:

1. **Validate sitemap**:
```bash
node scripts/gsc-fixes/validate-sitemap.js
```

2. **Check sitemap structure**:
```bash
cat public/sitemap.xml | head -20
```

3. **Verify URLs are accessible**:
```bash
# Test a few URLs from sitemap
curl -I https://scrapiz.com/services/scrap-collection
```

4. **Regenerate sitemap**:
```bash
node scripts/gsc-fixes/apply-all-fixes.js --types=sitemap
```

5. **Submit to GSC**:
- Go to Google Search Console
- Navigate to Sitemaps
- Submit: https://scrapiz.com/sitemap.xml

---

### 8. Canonical Tag Issues

**Symptoms**:
- Canonical tags not added
- Canonical points to wrong URL
- GSC shows canonical errors

**Solutions**:

1. **Check canonical in browser**:
- Open page in browser
- View source (Ctrl+U)
- Search for `<link rel="canonical"`

2. **Verify canonical target**:
```bash
curl -I <canonical-url>
# Should return 200 OK
```

3. **Check for conflicts**:
- Ensure only one canonical tag per page
- Check for canonical in both <head> and HTTP headers

4. **Re-apply canonical fixes**:
```bash
node scripts/gsc-fixes/apply-all-fixes.js --types=canonical
```

5. **Test with example workflow**:
```bash
node scripts/gsc-fixes/example-canonical-workflow.js
```

---

### 9. Redirect Issues

**Symptoms**:
- Redirects not working
- Redirect chains still exist
- .htaccess syntax errors

**Solutions**:

1. **Test redirect manually**:
```bash
curl -I https://scrapiz.com/old-url
# Should show 301 and Location header
```

2. **Check .htaccess syntax**:
```bash
# Test Apache config
apachectl configtest
```

3. **Verify redirect order**:
- Redirects should be before React Router handler
- More specific rules should come before general rules

4. **Check for redirect loops**:
```bash
curl -L https://scrapiz.com/page
# Should not loop infinitely
```

5. **Re-apply redirect fixes**:
```bash
node scripts/gsc-fixes/apply-all-fixes.js --types=redirects
```

---

### 10. Monitoring Issues

**Symptoms**:
- Monitoring not detecting changes
- Alerts not generated
- History not saved

**Solutions**:

1. **Check monitoring history**:
```bash
ls -la scripts/gsc-fixes/monitoring-history/
```

2. **Verify cron job** (if scheduled):
```bash
crontab -l
```

3. **Run monitoring manually**:
```bash
node scripts/gsc-fixes/monitor-indexing.js
```

4. **Check alert configuration**:
```bash
cat scripts/gsc-fixes/alerts/alerts-*.json
```

5. **Review logs**:
```bash
tail -f scripts/gsc-fixes/logs/gsc-fixes-*.log
```

---

### 11. Dry Run Not Working

**Symptoms**:
- Changes applied despite --dry-run flag
- No preview shown

**Solutions**:

1. **Verify flag syntax**:
```bash
# Correct
node scripts/gsc-fixes/apply-all-fixes.js --dry-run

# Incorrect
node scripts/gsc-fixes/apply-all-fixes.js -dry-run
node scripts/gsc-fixes/apply-all-fixes.js dry-run
```

2. **Check script output**:
- Should show "DRY RUN MODE" message
- Should show proposed changes
- Should NOT create backups

3. **Review code**:
- Ensure script checks for `--dry-run` flag
- Verify no writes occur in dry-run mode

---

### 12. Performance Issues

**Symptoms**:
- Scripts run very slowly
- High memory usage
- Timeouts

**Solutions**:

1. **Reduce batch size**:
```javascript
// In script, adjust batch size
const results = await utils.batchProcess(items, processor, 5); // Reduce from 10
```

2. **Process fewer pages**:
```bash
# Process specific pages only
node scripts/gsc-fixes/scan-and-fix-noindex.js --pages=url1,url2,url3
```

3. **Check system resources**:
```bash
# Check memory
free -h

# Check CPU
top
```

4. **Increase Node.js memory**:
```bash
node --max-old-space-size=4096 scripts/gsc-fixes/audit-all-issues.js
```

5. **Run during off-peak hours**:
- Schedule intensive operations for low-traffic times

---

## Debugging Tips

### Enable Debug Logging

Add debug flag to see detailed logs:
```bash
DEBUG=* node scripts/gsc-fixes/audit-all-issues.js
```

### Check Log Files

Review recent logs:
```bash
# View latest log
tail -100 scripts/gsc-fixes/logs/gsc-fixes-*.log | tail -1

# Search for errors
grep "ERROR" scripts/gsc-fixes/logs/gsc-fixes-*.log
```

### Test Individual Modules

Test modules in isolation:
```bash
node scripts/gsc-fixes/example-canonical-workflow.js
node scripts/gsc-fixes/test-canonical-integration.js
```

### Verify Dependencies

Check all dependencies are installed:
```bash
npm list
```

### Clear Cache

Sometimes clearing Node.js cache helps:
```bash
rm -rf node_modules
npm install
```

---

## Getting Help

### Check Documentation

1. **Main README**: `scripts/gsc-fixes/README.md`
2. **Module READMEs**: `scripts/gsc-fixes/<Module>.README.md`
3. **Implementation Docs**: `scripts/gsc-fixes/<MODULE>_IMPLEMENTATION.md`
4. **Quick Start Guides**: `scripts/gsc-fixes/<MODULE>_QUICK_START.md`

### Review Examples

Check example workflows:
```bash
ls scripts/gsc-fixes/example-*.js
```

### Check Issue Tracker

Review known issues and solutions in:
- Task completion summaries
- Implementation summaries
- Fix reports

### Contact Support

If issues persist:
1. Gather error messages and logs
2. Note steps to reproduce
3. Check system information (Node version, OS, etc.)
4. Review recent changes

---

## Prevention

### Best Practices

1. **Always run dry-run first**:
```bash
node scripts/gsc-fixes/apply-all-fixes.js --dry-run
```

2. **Keep backups**:
- Don't delete backup files immediately
- Verify fixes before cleaning backups

3. **Test on staging first**:
- Apply fixes to staging environment
- Verify everything works
- Then apply to production

4. **Monitor regularly**:
```bash
# Set up cron job
0 2 * * * cd /path/to/project && node scripts/gsc-fixes/monitor-indexing.js
```

5. **Review logs periodically**:
```bash
# Weekly log review
grep "ERROR\|WARN" scripts/gsc-fixes/logs/gsc-fixes-*.log
```

6. **Keep dependencies updated**:
```bash
npm outdated
npm update
```

7. **Document custom changes**:
- Note any manual modifications
- Keep change log
- Document workarounds

---

## Emergency Procedures

### Complete Rollback

If everything breaks:
```bash
# 1. Stop any running processes
pkill -f "gsc-fixes"

# 2. Rollback to last known good state
node scripts/gsc-fixes/rollback-fixes.js

# 3. Verify site is working
curl -I https://scrapiz.com

# 4. Review what went wrong
tail -100 scripts/gsc-fixes/logs/gsc-fixes-*.log
```

### Manual File Restoration

If rollback script fails:
```bash
# Restore .htaccess
cp scripts/gsc-fixes/backups/master-<timestamp>/.htaccess public/.htaccess

# Restore sitemap
cp scripts/gsc-fixes/backups/master-<timestamp>/sitemap.xml public/sitemap.xml

# Restore robots.txt
cp scripts/gsc-fixes/backups/master-<timestamp>/robots.txt public/robots.txt
```

### Contact Emergency Support

Critical issues requiring immediate attention:
1. Site completely down
2. All pages returning errors
3. Data loss
4. Security concerns

---

## Appendix: Error Codes

### File System Errors
- `ENOENT`: File or directory not found
- `EACCES`: Permission denied
- `EPERM`: Operation not permitted
- `EEXIST`: File already exists

### Network Errors
- `ETIMEDOUT`: Connection timeout
- `ECONNREFUSED`: Connection refused
- `ENOTFOUND`: DNS lookup failed
- `ECONNRESET`: Connection reset

### HTTP Status Codes
- `200`: OK
- `301`: Moved Permanently
- `302`: Found (Temporary Redirect)
- `404`: Not Found
- `500`: Internal Server Error
- `503`: Service Unavailable

---

## Version History

- **v1.0** (2024-01): Initial troubleshooting guide
- **v1.1** (2024-01): Added emergency procedures
- **v1.2** (2024-01): Added performance troubleshooting
