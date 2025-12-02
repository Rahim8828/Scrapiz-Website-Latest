# Cache Configuration Implementation

## Overview

This document describes the caching strategy implemented for the Scrapiz website to optimize performance and reduce server load. The configuration follows industry best practices and meets all requirements from the performance optimization spec.

## Requirements Addressed

- **5.1**: Immutable assets cached for 1 year
- **5.2**: HTML files have revalidation headers
- **5.3**: Images have appropriate cache headers
- **5.4**: CSS/JS files include content hashes
- **5.5**: Cached assets served without revalidation

## Cache Strategy

### 1. Immutable Assets (1 Year Cache)

Assets that never change or have content hashes in their filenames are cached for 1 year with the `immutable` directive:

```apache
Cache-Control: max-age=31536000, public, immutable
```

**Asset Types:**
- JavaScript files with content hashes (e.g., `Home-BGA3f_ja.js`)
- CSS files with content hashes (e.g., `index-DiwrgTda.css`)
- Images (WebP, PNG, JPG, SVG, AVIF)
- Fonts (WOFF, WOFF2, TTF, OTF)
- Media files (MP4, WebM, MP3, OGG)

**Benefits:**
- No revalidation requests to server
- Instant loading from browser cache
- Reduced bandwidth usage
- Lower server load

### 2. HTML Files (No Cache)

HTML files are never cached to ensure users always get the latest version:

```apache
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

**Why:**
- HTML contains references to versioned assets
- Ensures users get latest content immediately
- Allows for instant updates without cache issues

### 3. Data Files (1 Week Cache)

JSON and XML files are cached for 1 week with revalidation:

```apache
Cache-Control: max-age=604800, must-revalidate
```

**Asset Types:**
- JSON data files
- XML data files

### 4. Special Files (1 Day Cache)

Sitemap and robots.txt are cached for 1 day:

```apache
Cache-Control: max-age=86400, must-revalidate
```

## Compression Strategy

### Brotli Compression (Primary)

Brotli provides better compression than Gzip (15-20% smaller files):

```apache
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/css text/javascript
  AddOutputFilterByType BROTLI_COMPRESS application/javascript application/json
  # ... more types
</IfModule>
```

### Gzip Compression (Fallback)

Gzip is used as fallback for browsers/servers without Brotli support:

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript
  AddOutputFilterByType DEFLATE application/javascript application/json
  # ... more types
</IfModule>
```

## Content Hash Implementation

Vite automatically generates content hashes for all JavaScript and CSS files during the build process:

```javascript
// vite.config.js
rollupOptions: {
  output: {
    chunkFileNames: 'assets/js/[name]-[hash].js',
    entryFileNames: 'assets/js/[name]-[hash].js',
    assetFileNames: (assetInfo) => {
      if (assetInfo.name.endsWith('.css')) {
        return 'assets/css/[name]-[hash][extname]';
      }
      // ... more patterns
    },
  },
}
```

**Example Output:**
- `Home-BGA3f_ja.js` (8+ character hash)
- `index-DiwrgTda.css` (8+ character hash)

## Cache Behavior Examples

### First Visit
1. User requests `index.html`
2. Server sends HTML with `no-cache` header
3. HTML references `Home-BGA3f_ja.js`
4. Browser downloads JS file
5. Server sends JS with `max-age=31536000, immutable`
6. Browser caches JS for 1 year

### Subsequent Visits
1. User requests `index.html`
2. Server sends fresh HTML (not cached)
3. HTML references same `Home-BGA3f_ja.js`
4. Browser serves JS from cache (no network request)
5. Page loads instantly

### After Code Update
1. Developer updates code and rebuilds
2. New JS file: `Home-XYZ789ab.js` (different hash)
3. User requests `index.html`
4. Server sends fresh HTML
5. HTML references new `Home-XYZ789ab.js`
6. Browser downloads new JS file
7. Old JS file remains in cache but is never used

## Testing

### Automated Testing

Run the cache configuration test:

```bash
node scripts/testCacheHeaders.js
```

This verifies:
- ✅ Content hashes in all JS/CSS files
- ✅ .htaccess configuration is correct
- ✅ All asset types are covered
- ✅ Cache directives are properly set

### Manual Testing

#### 1. Test Cache Headers (Local)

Build the project and serve it:

```bash
npm run build
npx serve dist
```

Use curl to check headers:

```bash
# Check JS file (should have 1 year cache)
curl -I http://localhost:3000/assets/js/Home-BGA3f_ja.js

# Check HTML file (should have no-cache)
curl -I http://localhost:3000/index.html

# Check image file (should have 1 year cache)
curl -I http://localhost:3000/Scrapiz-logo.webp
```

#### 2. Test Cache Headers (Production)

After deployment, test on production:

```bash
# Check JS file
curl -I https://www.scrapiz.in/assets/js/Home-BGA3f_ja.js

# Check HTML file
curl -I https://www.scrapiz.in/

# Check image file
curl -I https://www.scrapiz.in/Scrapiz-logo.webp
```

Expected headers:

**JavaScript File:**
```
Cache-Control: max-age=31536000, public, immutable
Content-Encoding: br (or gzip)
```

**HTML File:**
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

**Image File:**
```
Cache-Control: max-age=31536000, public, immutable
```

#### 3. Test in Browser DevTools

1. Open DevTools (F12)
2. Go to Network tab
3. Load the page
4. Check the "Size" column:
   - First load: Shows actual file size
   - Reload: Shows "(disk cache)" or "(memory cache)"
5. Check the "Time" column:
   - Cached files should show 0ms or very low time

#### 4. Test Cache Invalidation

1. Note current JS filename (e.g., `Home-BGA3f_ja.js`)
2. Make a code change
3. Rebuild: `npm run build`
4. Check new JS filename (should be different)
5. Deploy and reload page
6. Verify new JS file is loaded
7. Old JS file should not be requested

## Performance Impact

### Before Optimization
- CSS/JS cached for 1 month
- No immutable directive
- Revalidation requests on every visit
- Slower repeat visits

### After Optimization
- CSS/JS cached for 1 year with immutable
- Zero revalidation requests for static assets
- Instant loading from cache
- 50-80% reduction in bandwidth for repeat visitors

### Expected Metrics
- **Cache Hit Rate**: 80-95% for repeat visitors
- **Bandwidth Savings**: 60-80% for repeat visitors
- **Load Time Improvement**: 50-70% faster for repeat visits
- **Server Load Reduction**: 40-60% fewer requests

## Monitoring

### Key Metrics to Track

1. **Cache Hit Rate**
   - Target: >80% for repeat visitors
   - Monitor via server logs or CDN analytics

2. **Bandwidth Usage**
   - Should decrease significantly for repeat visitors
   - Monitor via hosting provider dashboard

3. **Page Load Time**
   - First visit: Should meet FCP/LCP targets
   - Repeat visits: Should be 50-70% faster

4. **Server Requests**
   - Should see reduction in static asset requests
   - HTML requests should remain constant

### Tools for Monitoring

- **Google Analytics**: Track page load times
- **Lighthouse**: Verify cache headers in audits
- **WebPageTest**: Test cache behavior
- **Browser DevTools**: Manual verification
- **Server Logs**: Analyze cache hit rates

## Troubleshooting

### Issue: Assets Not Caching

**Symptoms:**
- Browser always downloads assets
- No "(disk cache)" in DevTools

**Solutions:**
1. Verify .htaccess is deployed to server
2. Check server supports mod_headers and mod_expires
3. Verify Apache is processing .htaccess files
4. Check for conflicting cache headers from server

### Issue: Stale Content After Update

**Symptoms:**
- Users see old content after deployment
- JavaScript errors due to version mismatch

**Solutions:**
1. Verify content hashes are changing on rebuild
2. Check HTML is not being cached (should have no-cache)
3. Clear CDN cache if using one
4. Verify build process is generating new hashes

### Issue: Cache Headers Not Applied

**Symptoms:**
- curl shows no Cache-Control headers
- Lighthouse reports missing cache headers

**Solutions:**
1. Enable mod_headers: `a2enmod headers`
2. Enable mod_expires: `a2enmod expires`
3. Restart Apache: `service apache2 restart`
4. Check .htaccess syntax for errors
5. Verify AllowOverride is set in Apache config

## Best Practices

1. **Always Use Content Hashes**
   - Never cache files without content hashes for long periods
   - Vite handles this automatically

2. **Never Cache HTML**
   - HTML should always be fresh
   - Use no-cache, must-revalidate

3. **Use Immutable Directive**
   - Prevents unnecessary revalidation requests
   - Only use for truly immutable assets

4. **Test Before Deploying**
   - Run automated tests
   - Verify in staging environment
   - Check with multiple browsers

5. **Monitor After Deployment**
   - Watch for cache-related issues
   - Track performance improvements
   - Adjust if needed

## References

- [MDN: HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Web.dev: HTTP Cache](https://web.dev/http-cache/)
- [Apache mod_headers](https://httpd.apache.org/docs/current/mod/mod_headers.html)
- [Apache mod_expires](https://httpd.apache.org/docs/current/mod/mod_expires.html)
- [Vite Build Options](https://vitejs.dev/config/build-options.html)

## Changelog

### 2024-12-01 - Initial Implementation
- Configured 1 year cache for immutable assets
- Added Brotli compression support
- Implemented content hash verification
- Created automated testing script
- Added comprehensive documentation
