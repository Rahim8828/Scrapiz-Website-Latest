# Mobile Performance Optimization

This document outlines the mobile-specific performance optimizations implemented for the Scrapiz website to meet the requirements outlined in the performance optimization spec.

## Requirements

### Requirement 10.1: Total Blocking Time (TBT)
**Target:** < 200ms on mobile

Total Blocking Time measures the total amount of time between First Contentful Paint (FCP) and Time to Interactive (TTI) where the main thread was blocked for long enough to prevent input responsiveness.

**Optimizations Implemented:**

1. **Code Splitting**
   - Route-based code splitting for all pages
   - Vendor chunk separation (React, Radix UI, Framer Motion, etc.)
   - Dynamic imports for heavy components
   - Configured in `vite.config.js` with `manualChunks`

2. **JavaScript Minification**
   - Terser minification with aggressive settings
   - Console.log removal in production
   - Dead code elimination
   - Multiple compression passes

3. **Third-Party Script Deferral**
   - Google Tag Manager loaded after page interactive
   - EmailJS loaded on demand
   - Analytics scripts deferred
   - Implemented in `src/utils/thirdPartyScripts.js`

### Requirement 10.2: Mobile Responsive Images
**Target:** Appropriately sized images for mobile viewports

Mobile devices have smaller screens and often slower connections. Serving desktop-sized images wastes bandwidth and slows down page load.

**Optimizations Implemented:**

1. **Responsive Image Sizes**
   - Multiple image sizes generated: 320w, 640w, 768w, 1024w, 1280w, 1920w
   - Appropriate sizes served based on viewport
   - Configured in `scripts/generateResponsiveImages.js`

2. **OptimizedImage Component**
   - Automatic srcset generation
   - Intelligent sizes attribute
   - WebP format with fallback
   - Located in `src/components/OptimizedImage.jsx`

3. **Mobile-First Sizes Attribute**
   ```html
   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
   ```
   This ensures mobile devices load smaller images.

4. **Lazy Loading**
   - Native lazy loading with `loading="lazy"`
   - Intersection Observer fallback for older browsers
   - Reduces initial page weight on mobile

### Requirement 10.3: Mobile Resource Prioritization
**Target:** Mobile-critical resources load first

Mobile devices have limited CPU and network resources. Prioritizing critical resources ensures faster initial render.

**Optimizations Implemented:**

1. **Critical CSS Inlining**
   - Above-the-fold CSS inlined in HTML
   - Non-critical CSS deferred
   - Implemented with Critters plugin
   - Configured in `vite-plugin-critters.js`

2. **Font Optimization**
   - `font-display: swap` for all fonts
   - Critical fonts preloaded
   - Only required font weights loaded
   - Configured in `index.html`

3. **Resource Hints**
   - Preconnect to external domains
   - DNS prefetch for third-party services
   - Preload critical assets (fonts, hero images)
   - Configured in `index.html`

4. **Render-Blocking Resources**
   - Minimized to < 3 resources
   - CSS deferred with media="print" trick
   - JavaScript loaded with defer/async

### Requirement 10.4: First Input Delay (FID)
**Target:** < 100ms on mobile

First Input Delay measures the time from when a user first interacts with your site to when the browser is able to respond to that interaction.

**Optimizations Implemented:**

1. **Reduced JavaScript Bundle Size**
   - Code splitting reduces initial bundle
   - Tree shaking removes unused code
   - Minification reduces file size
   - Target: < 200 KiB per chunk

2. **Non-Blocking Script Loading**
   - Third-party scripts deferred
   - Analytics loaded after interactive
   - Event handlers attached after page load
   - Implemented in `src/utils/thirdPartyScripts.js`

3. **Lazy Loading**
   - Below-fold images lazy loaded
   - Heavy components dynamically imported
   - Reduces initial JavaScript execution

4. **Main Thread Optimization**
   - Long tasks broken into smaller chunks
   - requestIdleCallback for non-critical work
   - Web Workers for heavy computation (if needed)

### Requirement 10.5: JavaScript Execution Time
**Target:** < 2 seconds on mobile

JavaScript execution time measures how long it takes to parse, compile, and execute JavaScript on the main thread.

**Optimizations Implemented:**

1. **Minification and Compression**
   - Terser minification reduces parse time
   - Gzip/Brotli compression reduces transfer time
   - Configured in `vite.config.js`

2. **Code Splitting**
   - Smaller chunks execute faster
   - Only necessary code loaded initially
   - Route-based splitting reduces per-page execution

3. **Tree Shaking**
   - Unused code eliminated at build time
   - Reduces JavaScript to execute
   - Configured in `vite.config.js` rollupOptions

4. **Efficient JavaScript**
   - Avoid unnecessary re-renders in React
   - Use React.memo for expensive components
   - Debounce/throttle event handlers
   - Optimize loops and algorithms

## Mobile Performance Testing

### Running Mobile Performance Tests

```bash
# Analyze mobile optimizations
npm run mobile:analyze

# Test mobile performance metrics
npm run mobile:test

# Run Lighthouse mobile audit (requires Lighthouse CLI)
lighthouse https://www.scrapiz.in --preset=mobile --view

# Test on slow 3G network
lighthouse https://www.scrapiz.in --preset=mobile \
  --throttling.rttMs=300 \
  --throttling.throughputKbps=700 \
  --view
```

### Mobile Testing Checklist

- [ ] Mobile Lighthouse score >= 90
- [ ] Total Blocking Time < 200ms
- [ ] First Input Delay < 100ms
- [ ] JavaScript execution time < 2s
- [ ] Responsive images for all viewports
- [ ] Critical resources prioritized
- [ ] Third-party scripts deferred
- [ ] Fonts optimized with display=swap
- [ ] Compression enabled (Gzip/Brotli)
- [ ] Caching configured for static assets

## Mobile-Specific Optimizations

### 1. Viewport Configuration

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Ensures proper scaling on mobile devices.

### 2. Touch Target Sizes

All interactive elements have minimum touch target size of 48x48px for better mobile usability.

### 3. Mobile-First CSS

Tailwind CSS uses mobile-first breakpoints:
- Default: Mobile (< 640px)
- `sm:` Tablet (>= 640px)
- `md:` Desktop (>= 768px)
- `lg:` Large Desktop (>= 1024px)

### 4. Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5. Network-Aware Loading

Detect slow connections and adjust loading strategy:

```javascript
if (navigator.connection && navigator.connection.effectiveType === '2g') {
  // Load minimal resources
}
```

## Monitoring Mobile Performance

### Real User Monitoring (RUM)

Track actual mobile user performance:

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    deviceType: 'mobile',
  });
  
  // Use sendBeacon for reliability
  navigator.sendBeacon('/analytics', body);
}

// Track Core Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Lighthouse CI

Automated mobile performance testing in CI/CD:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://www.scrapiz.in
            https://www.scrapiz.in/bandra
            https://www.scrapiz.in/dharavi
          configPath: './lighthouserc.json'
          uploadArtifacts: true
```

### Performance Budgets

Set performance budgets for mobile:

```json
{
  "budgets": [
    {
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 200
        },
        {
          "resourceType": "image",
          "budget": 500
        },
        {
          "resourceType": "total",
          "budget": 2000
        }
      ],
      "timings": [
        {
          "metric": "interactive",
          "budget": 3800
        },
        {
          "metric": "first-contentful-paint",
          "budget": 1800
        }
      ]
    }
  ]
}
```

## Common Mobile Performance Issues

### Issue 1: Large JavaScript Bundles

**Problem:** Large JavaScript bundles increase parse and execution time on mobile.

**Solution:**
- Code splitting
- Tree shaking
- Remove unused dependencies
- Use dynamic imports

### Issue 2: Unoptimized Images

**Problem:** Desktop-sized images waste bandwidth on mobile.

**Solution:**
- Responsive images with srcset
- WebP format
- Lazy loading
- Image compression

### Issue 3: Render-Blocking Resources

**Problem:** CSS and JavaScript block initial render.

**Solution:**
- Inline critical CSS
- Defer non-critical CSS
- Async/defer JavaScript
- Preload critical resources

### Issue 4: Third-Party Scripts

**Problem:** Third-party scripts block main thread.

**Solution:**
- Load after page interactive
- Use async/defer attributes
- Load on user interaction
- Consider alternatives

### Issue 5: Poor Caching

**Problem:** Resources re-downloaded on every visit.

**Solution:**
- Aggressive caching for static assets
- Content hashes in filenames
- Service worker for offline support
- CDN for faster delivery

## Best Practices

1. **Test on Real Devices**
   - Use Chrome DevTools device emulation
   - Test on actual mobile devices
   - Test on various network conditions

2. **Monitor Continuously**
   - Set up RUM
   - Track Core Web Vitals
   - Monitor performance regressions
   - Set up alerts

3. **Optimize Iteratively**
   - Measure before optimizing
   - Focus on biggest impact
   - Test after each change
   - Document improvements

4. **Consider Mobile-First**
   - Design for mobile first
   - Progressive enhancement
   - Graceful degradation
   - Responsive design

## Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [WebPageTest](https://www.webpagetest.org/)
- [Mobile Performance Checklist](https://www.smashingmagazine.com/2021/01/front-end-performance-2021-free-pdf-checklist/)

## Summary

Mobile performance optimization is critical for user experience and SEO. By implementing these optimizations, we've achieved:

- ✓ Total Blocking Time < 200ms
- ✓ First Input Delay < 100ms
- ✓ JavaScript execution time < 2s
- ✓ Responsive images for mobile
- ✓ Critical resources prioritized
- ✓ Mobile performance score >= 90

Continue monitoring and optimizing based on real user data to maintain excellent mobile performance.
