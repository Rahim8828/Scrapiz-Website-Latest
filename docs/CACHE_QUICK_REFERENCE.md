# Cache Configuration Quick Reference

## Cache Durations by Asset Type

| Asset Type | Cache Duration | Directive | Revalidation |
|------------|---------------|-----------|--------------|
| JavaScript (with hash) | 1 year | immutable | No |
| CSS (with hash) | 1 year | immutable | No |
| Images (WebP, PNG, JPG) | 1 year | immutable | No |
| Fonts (WOFF, WOFF2) | 1 year | immutable | No |
| HTML files | 0 seconds | no-cache | Always |
| JSON/XML data | 1 week | must-revalidate | Yes |
| Sitemap/Robots | 1 day | must-revalidate | Yes |

## Quick Commands

### Test Cache Configuration
```bash
node scripts/testCacheHeaders.js
```

### Build with Cache-Friendly Hashes
```bash
npm run build
```

### Test Cache Headers Locally
```bash
# Build and serve
npm run build
npx serve dist

# Check headers
curl -I http://localhost:3000/assets/js/[filename].js
curl -I http://localhost:3000/index.html
```

### Test Cache Headers on Production
```bash
curl -I https://www.scrapiz.in/assets/js/[filename].js
curl -I https://www.scrapiz.in/
```

## Expected Cache Headers

### JavaScript/CSS Files
```
Cache-Control: max-age=31536000, public, immutable
Content-Encoding: br
ETag: "..."
```

### HTML Files
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### Images
```
Cache-Control: max-age=31536000, public, immutable
Content-Encoding: br (for SVG)
ETag: "..."
```

## Browser DevTools Verification

1. Open DevTools (F12) → Network tab
2. Load page
3. Check "Size" column:
   - First load: Shows file size (e.g., "45.2 KB")
   - Reload: Shows "(disk cache)" or "(memory cache)"
4. Check "Time" column:
   - Cached files: 0ms or very low

## Common Issues & Solutions

### Assets Not Caching
```bash
# Check if .htaccess is deployed
ls -la dist/.htaccess

# Copy to dist if missing
cp public/.htaccess dist/.htaccess
```

### No Content Hashes
```bash
# Verify Vite config has hash patterns
grep "hash" vite.config.js

# Rebuild
npm run build
```

### Cache Headers Not Applied
```bash
# Enable Apache modules (if you have server access)
sudo a2enmod headers
sudo a2enmod expires
sudo service apache2 restart
```

## Performance Targets

| Metric | Target | Impact |
|--------|--------|--------|
| Cache Hit Rate | >80% | Bandwidth savings |
| Repeat Visit Speed | 50-70% faster | User experience |
| Server Load | 40-60% reduction | Cost savings |
| Bandwidth Usage | 60-80% reduction | Cost savings |

## Files Modified

- `public/.htaccess` - Cache and compression configuration
- `vite.config.js` - Content hash configuration (already done)
- `scripts/testCacheHeaders.js` - Automated testing
- `docs/CACHE_CONFIGURATION.md` - Full documentation

## Deployment Checklist

- [ ] Run `node scripts/testCacheHeaders.js`
- [ ] Verify all tests pass
- [ ] Build project: `npm run build`
- [ ] Verify .htaccess copied to dist
- [ ] Deploy dist folder
- [ ] Test cache headers on production
- [ ] Monitor cache hit rates
- [ ] Verify performance improvements

## Key Concepts

**Immutable**: Asset will never change, browser can cache forever without checking

**No-Cache**: Browser must check with server before using cached version

**Must-Revalidate**: Browser can use cache but must check if stale

**Content Hash**: Unique identifier in filename that changes when content changes

**Cache Busting**: Technique to force browsers to download new versions by changing filenames
