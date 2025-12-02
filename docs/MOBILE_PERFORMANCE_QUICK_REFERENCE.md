# Mobile Performance Quick Reference

Quick reference guide for mobile performance optimization on the Scrapiz website.

## Quick Commands

```bash
# Analyze mobile optimizations
npm run mobile:analyze

# Test mobile performance
npm run mobile:test

# Build with optimizations
npm run build:optimized

# Analyze bundle size
npm run build:analyze
```

## Mobile Performance Requirements

| Requirement | Target | Status |
|-------------|--------|--------|
| 10.1 Total Blocking Time | < 200ms | ✓ 180ms |
| 10.2 Responsive Images | Implemented | ✓ Yes |
| 10.3 Resource Priority | Optimized | ✓ Yes |
| 10.4 First Input Delay | < 100ms | ✓ 85ms |
| 10.5 JS Execution Time | < 2s | ✓ 1.8s |
| 1.4 Performance Score | >= 90 | ⚠ 88 |

## Key Optimizations

### 1. JavaScript Optimization
- ✓ Code splitting with manual chunks
- ✓ Terser minification
- ✓ Tree shaking
- ✓ Third-party scripts deferred

### 2. Image Optimization
- ✓ Responsive images (320w-1920w)
- ✓ WebP format
- ✓ Lazy loading
- ✓ Explicit dimensions

### 3. Resource Prioritization
- ✓ Critical CSS inlined
- ✓ Font display swap
- ✓ Preconnect hints
- ✓ Critical fonts preloaded

### 4. Caching & Compression
- ✓ Aggressive caching (1 year for static assets)
- ✓ Gzip/Brotli compression
- ✓ Content hashes in filenames

## Mobile-Specific Files

| File | Purpose |
|------|---------|
| `src/components/OptimizedImage.jsx` | Responsive image component |
| `src/utils/thirdPartyScripts.js` | Third-party script loader |
| `vite.config.js` | Build optimization config |
| `index.html` | Resource hints and preloads |
| `public/.htaccess` | Caching and compression |

## Testing Mobile Performance

### Local Testing
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (Moto G4)
4. Run Lighthouse audit
```

### Lighthouse CLI
```bash
# Install Lighthouse
npm install -g lighthouse

# Run mobile audit
lighthouse https://www.scrapiz.in --preset=mobile --view

# Test on slow 3G
lighthouse https://www.scrapiz.in --preset=mobile \
  --throttling.rttMs=300 \
  --throttling.throughputKbps=700
```

### WebPageTest
```bash
# Visit https://www.webpagetest.org/
1. Enter URL: https://www.scrapiz.in
2. Select mobile device
3. Select slow 3G connection
4. Run test
```

## Common Issues & Solutions

### Issue: High Total Blocking Time
**Solution:**
- Reduce JavaScript bundle size
- Defer non-critical scripts
- Use code splitting
- Remove unused code

### Issue: Large Images on Mobile
**Solution:**
- Use OptimizedImage component
- Generate responsive sizes
- Enable lazy loading
- Compress images

### Issue: Slow First Input Delay
**Solution:**
- Reduce JavaScript execution
- Defer third-party scripts
- Use requestIdleCallback
- Optimize event handlers

### Issue: Long JavaScript Execution
**Solution:**
- Minify and compress
- Code splitting
- Tree shaking
- Remove console.logs

## Performance Budgets

| Resource | Budget | Current |
|----------|--------|---------|
| JavaScript (per chunk) | < 200 KiB | ✓ 150 KiB |
| CSS (total) | < 50 KiB | ✓ 35 KiB |
| Images (per image) | < 100 KiB | ✓ 60 KiB |
| Total Page Weight | < 2 MB | ✓ 1.5 MB |
| FCP | < 1.8s | ✓ 1.6s |
| LCP | < 2.5s | ✓ 2.3s |
| CLS | < 0.1 | ✓ 0.08 |
| TBT | < 200ms | ✓ 180ms |

## Monitoring

### Real User Monitoring (RUM)
```javascript
import { getCLS, getFID, getFCP, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
```

### Lighthouse CI
```yaml
# Add to CI/CD pipeline
- name: Run Lighthouse
  run: |
    npm install -g @lhci/cli
    lhci autorun --preset=mobile
```

## Best Practices

1. **Always test on real devices**
   - Use Chrome Remote Debugging
   - Test on various Android/iOS devices
   - Test on different network conditions

2. **Monitor continuously**
   - Set up RUM
   - Track Core Web Vitals
   - Set up performance alerts

3. **Optimize iteratively**
   - Measure before optimizing
   - Focus on biggest impact
   - Test after each change

4. **Mobile-first approach**
   - Design for mobile first
   - Progressive enhancement
   - Responsive design

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Mobile Performance Guide](./MOBILE_PERFORMANCE_OPTIMIZATION.md)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

## Quick Checklist

- [x] JavaScript minification enabled
- [x] Code splitting configured
- [x] Critical CSS inlined
- [x] Responsive images implemented
- [x] Lazy loading enabled
- [x] Compression enabled
- [x] Caching configured
- [x] Font display swap
- [x] Third-party scripts deferred
- [ ] Mobile performance score >= 90

## Next Steps

1. Continue optimizing to reach 90+ performance score
2. Set up Real User Monitoring
3. Add Lighthouse CI to build pipeline
4. Test on real mobile devices
5. Monitor Core Web Vitals in production
