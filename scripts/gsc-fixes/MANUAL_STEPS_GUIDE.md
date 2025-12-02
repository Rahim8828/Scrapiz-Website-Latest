# Manual Steps Guide

## Overview

This guide documents manual steps required after running automated fixes. While the GSC Fix System automates most tasks, some steps require manual intervention or verification.

---

## Post-Fix Manual Steps

### 1. Verify Fixes in Browser

**Why**: Automated scripts can't verify visual appearance or user experience.

**Steps**:

1. **Test Sample Pages**:
   - Open 5-10 representative pages in browser
   - Check layout and styling
   - Verify content displays correctly
   - Test navigation links

2. **Check Canonical Tags**:
   ```
   - Right-click → View Page Source
   - Search for: <link rel="canonical"
   - Verify URL is correct
   ```

3. **Verify Schema Markup**:
   - View page source
   - Find `<script type="application/ld+json">`
   - Verify JSON is valid (no syntax errors)

4. **Test Redirects**:
   - Visit old URLs that should redirect
   - Verify redirect happens
   - Check final destination is correct

**Time Required**: 15-30 minutes

---

### 2. Submit Sitemap to Google Search Console

**Why**: Google needs to be notified of sitemap updates.

**Steps**:

1. **Access Google Search Console**:
   - Go to: https://search.google.com/search-console
   - Select your property (scrapiz.com)

2. **Navigate to Sitemaps**:
   - Click "Sitemaps" in left sidebar
   - Or go to: https://search.google.com/search-console/sitemaps

3. **Submit Sitemap**:
   - Enter: `sitemap.xml`
   - Click "Submit"
   - Wait for processing (can take hours to days)

4. **Verify Submission**:
   - Check "Submitted sitemaps" section
   - Status should show "Success"
   - Note: Discovered URLs may take time to update

**Time Required**: 5 minutes (plus waiting for Google processing)

**Frequency**: After any sitemap changes

---

### 3. Request Indexing for Fixed Pages

**Why**: Speeds up Google's re-crawl of fixed pages.

**Steps**:

1. **Access URL Inspection Tool**:
   - In Google Search Console
   - Click "URL Inspection" at top
   - Or go to: https://search.google.com/search-console/inspect

2. **Inspect Fixed URLs**:
   - Enter URL of fixed page
   - Click "Test Live URL"
   - Wait for results

3. **Request Indexing**:
   - If page is valid, click "Request Indexing"
   - Confirm the request
   - Repeat for priority pages

4. **Prioritize**:
   - Focus on high-value pages first
   - Pages with most traffic
   - Pages with most backlinks
   - New or significantly updated pages

**Limitations**:
- Limited to ~10-20 requests per day
- Requests are queued, not immediate
- No guarantee of indexing

**Time Required**: 30-60 minutes for priority pages

**Frequency**: After fixing critical issues

---

### 4. Validate Schema Markup

**Why**: Automated validation may miss edge cases or Google-specific requirements.

**Steps**:

1. **Use Google Rich Results Test**:
   - Go to: https://search.google.com/test/rich-results
   - Enter page URL
   - Click "Test URL"
   - Review results

2. **Check Each Schema Type**:
   - LocalBusiness schema (location pages)
   - FAQPage schema (pages with FAQs)
   - Article schema (blog posts)

3. **Fix Remaining Errors**:
   - Note any errors or warnings
   - Update source files manually if needed
   - Re-test after fixes

4. **Use Schema.org Validator** (optional):
   - Go to: https://validator.schema.org/
   - Paste schema JSON
   - Verify against schema.org specs

**Time Required**: 15-30 minutes

**Frequency**: After schema fixes, before major releases

---

### 5. Test .htaccess Changes

**Why**: Syntax errors in .htaccess can break the entire site.

**Steps**:

1. **Backup Current .htaccess**:
   ```bash
   cp public/.htaccess public/.htaccess.backup.manual
   ```

2. **Test Syntax** (if Apache is available):
   ```bash
   apachectl configtest
   ```

3. **Test Redirects Manually**:
   ```bash
   # Test each redirect
   curl -I https://scrapiz.com/old-url
   # Should show: HTTP/1.1 301 Moved Permanently
   # Location: https://scrapiz.com/new-url
   ```

4. **Test in Browser**:
   - Visit old URLs
   - Verify redirect happens
   - Check browser address bar shows new URL

5. **Check for Redirect Loops**:
   ```bash
   curl -L https://scrapiz.com/page
   # Should not loop infinitely
   ```

6. **Monitor Error Logs**:
   - Check server error logs for .htaccess errors
   - Fix any syntax issues immediately

**Time Required**: 15-30 minutes

**Frequency**: After any .htaccess changes

---

### 6. Update Internal Links

**Why**: Some internal links may need manual updating in content.

**Steps**:

1. **Review Redirect Report**:
   - Check `scripts/gsc-fixes/reports/` for redirect issues
   - Note pages with internal links to redirected URLs

2. **Update Content Links**:
   - Edit blog posts, page content
   - Update links to point to final destinations
   - Remove links to deleted pages

3. **Update Navigation**:
   - Check header/footer navigation
   - Update menu links if needed
   - Verify all nav links work

4. **Update Hardcoded Links**:
   - Search codebase for hardcoded URLs
   - Update to use relative paths or correct URLs

**Time Required**: 30-60 minutes

**Frequency**: After major URL changes

---

### 7. Monitor Indexing Status

**Why**: Track progress and identify new issues.

**Steps**:

1. **Set Up Regular Monitoring**:
   ```bash
   # Add to crontab (daily at 2 AM)
   crontab -e
   # Add line:
   0 2 * * * cd /path/to/project && node scripts/gsc-fixes/monitor-indexing.js
   ```

2. **Review GSC Weekly**:
   - Check "Coverage" report
   - Monitor "Valid" pages count
   - Watch for new errors
   - Track indexing trends

3. **Check Performance**:
   - Monitor "Performance" report
   - Track clicks, impressions
   - Identify ranking changes

4. **Review Alerts**:
   - Check `scripts/gsc-fixes/alerts/` directory
   - Address critical issues promptly

**Time Required**: 15 minutes weekly

**Frequency**: Weekly ongoing

---

### 8. Content Enhancement

**Why**: Thin content pages may need human-written content.

**Steps**:

1. **Review Thin Content Report**:
   - Check `scripts/gsc-fixes/reports/thin-content-final-report.md`
   - Identify pages needing enhancement

2. **Add Unique Content**:
   - Write location-specific content for location pages
   - Add detailed service descriptions
   - Include relevant keywords naturally
   - Add helpful information for users

3. **Improve Structure**:
   - Add proper heading hierarchy (H1, H2, H3)
   - Break content into readable sections
   - Add bullet points and lists
   - Include relevant images

4. **Add Internal Links**:
   - Link to related pages
   - Use descriptive anchor text
   - Link from high-authority pages

**Time Required**: 2-4 hours per page

**Frequency**: As needed for thin content pages

---

### 9. Mobile Testing

**Why**: Ensure fixes don't break mobile experience.

**Steps**:

1. **Test on Real Devices**:
   - Test on iPhone and Android
   - Check various screen sizes
   - Verify touch interactions work

2. **Use Mobile-Friendly Test**:
   - Go to: https://search.google.com/test/mobile-friendly
   - Enter page URLs
   - Fix any mobile issues

3. **Check Mobile Usability in GSC**:
   - Navigate to "Mobile Usability" report
   - Address any errors
   - Verify fixes resolve issues

4. **Test Page Speed**:
   - Use PageSpeed Insights: https://pagespeed.web.dev/
   - Check mobile performance score
   - Implement recommended optimizations

**Time Required**: 30-60 minutes

**Frequency**: After major changes

---

### 10. Update Documentation

**Why**: Keep team informed of changes.

**Steps**:

1. **Document Changes Made**:
   - List all fixes applied
   - Note any manual changes
   - Record dates and reasons

2. **Update Team**:
   - Notify team of URL changes
   - Share redirect mappings
   - Communicate any breaking changes

3. **Update Internal Docs**:
   - Update SEO documentation
   - Update URL structure docs
   - Update deployment procedures

4. **Create Change Log**:
   - Maintain history of changes
   - Note before/after metrics
   - Track improvements

**Time Required**: 30 minutes

**Frequency**: After each fix session

---

## Critical Manual Checks

### Before Applying Fixes

- [ ] Backup all files
- [ ] Run dry-run mode first
- [ ] Review proposed changes
- [ ] Test on staging environment
- [ ] Schedule during low-traffic period

### After Applying Fixes

- [ ] Verify site is accessible
- [ ] Test sample pages in browser
- [ ] Check for broken links
- [ ] Verify redirects work
- [ ] Test mobile experience
- [ ] Submit sitemap to GSC
- [ ] Request indexing for priority pages
- [ ] Monitor error logs
- [ ] Check GSC for new errors

### Weekly Maintenance

- [ ] Review GSC reports
- [ ] Check monitoring alerts
- [ ] Review error logs
- [ ] Test random pages
- [ ] Check indexing progress
- [ ] Monitor traffic trends

---

## Manual Fix Scenarios

### Scenario 1: Page Needs Complete Rewrite

**When**: Page has very thin content (< 200 words) and automated enhancement isn't sufficient.

**Steps**:
1. Research topic thoroughly
2. Write comprehensive content (500+ words)
3. Add proper heading structure
4. Include relevant keywords
5. Add internal links
6. Add images with alt text
7. Test in browser
8. Request indexing

---

### Scenario 2: Complex Redirect Chain

**When**: Multiple old URLs need to redirect to different new URLs.

**Steps**:
1. Map old URLs to new URLs
2. Create redirect rules in .htaccess
3. Test each redirect manually
4. Update internal links
5. Update sitemap
6. Submit to GSC

---

### Scenario 3: Schema Requires Custom Fields

**When**: Business-specific schema fields need to be added.

**Steps**:
1. Identify required schema properties
2. Gather accurate data
3. Update JSX files with schema
4. Validate with Rich Results Test
5. Deploy changes
6. Monitor GSC for schema errors

---

### Scenario 4: Page Should Be Removed

**When**: Page is no longer relevant and should be deleted.

**Steps**:
1. Identify replacement page (if any)
2. Set up 301 redirect (if replacement exists)
3. Or return 410 Gone (if no replacement)
4. Remove from sitemap
5. Remove internal links
6. Update GSC
7. Monitor 404 reports

---

## Tools and Resources

### Google Tools
- **Search Console**: https://search.google.com/search-console
- **Rich Results Test**: https://search.google.com/test/rich-results
- **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
- **PageSpeed Insights**: https://pagespeed.web.dev/

### Validation Tools
- **Schema.org Validator**: https://validator.schema.org/
- **W3C HTML Validator**: https://validator.w3.org/
- **Redirect Checker**: https://httpstatus.io/

### Testing Tools
- **cURL**: Command-line HTTP testing
- **Browser DevTools**: Inspect elements, network, console
- **Lighthouse**: Performance and SEO auditing

---

## Time Estimates

### Initial Setup (One-time)
- Review all documentation: 2-3 hours
- Set up monitoring: 30 minutes
- Configure GSC: 30 minutes
- **Total**: 3-4 hours

### Per Fix Session
- Run audit: 5 minutes
- Review results: 15 minutes
- Apply fixes (dry-run + actual): 15 minutes
- Manual verification: 30 minutes
- GSC submission: 15 minutes
- **Total**: 1.5 hours

### Ongoing Maintenance (Weekly)
- Review GSC reports: 15 minutes
- Check monitoring alerts: 10 minutes
- Test sample pages: 15 minutes
- **Total**: 40 minutes/week

---

## Best Practices

1. **Always Test First**:
   - Use dry-run mode
   - Test on staging
   - Verify before production

2. **Document Everything**:
   - Keep change logs
   - Note manual changes
   - Track metrics

3. **Monitor Continuously**:
   - Set up automated monitoring
   - Review GSC weekly
   - Track trends

4. **Prioritize**:
   - Fix critical issues first
   - Focus on high-value pages
   - Address errors before warnings

5. **Communicate**:
   - Notify team of changes
   - Share results
   - Coordinate with stakeholders

---

## Support

For questions or issues with manual steps:
1. Review [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)
2. Check [COMPLETE_SCRIPT_REFERENCE.md](./COMPLETE_SCRIPT_REFERENCE.md)
3. Review module-specific README files
4. Consult Google Search Console Help Center
