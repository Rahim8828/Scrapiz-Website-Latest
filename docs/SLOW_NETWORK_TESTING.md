# Slow Network Performance Testing

This document describes how to test website performance on slow 3G networks to ensure optimal user experience even with poor connectivity.

## Overview

Slow network testing validates:
- **Requirement 8.1**: Time to Interactive (TTI) < 5 seconds on slow 3G
- **Requirement 1.3**: Page transitions < 1 second

## Quick Start

```bash
# Run all slow network tests
npm run test:slow-network

# Run only Lighthouse tests with slow 3G throttling
npm run lhci:slow3g

# Run only Lighthouse tests
node scripts/testSlowNetworkPerformance.js --lighthouse

# Run only page transition tests
node scripts/testSlowNetworkPerformance.js --transitions
```

## Network Throttling Settings

### Slow 3G Configuration

The slow 3G configuration simulates a poor mobile network connection:

- **Round-trip time (RTT)**: 300ms
- **Download throughput**: 400 Kbps
- **Upload throughput**: 400 Kbps
- **CPU slowdown**: 4x (mobile device simulation)

This represents a realistic worst-case scenario for mobile users in areas with poor connectivity.

## Performance Thresholds

### Critical Metrics (Slow 3G)

| Metric | Threshold | Requirement |
|--------|-----------|-------------|
| Time to Interactive (TTI) | < 5000ms | 8.1 (Error) |
| Total Blocking Time (TBT) | < 300ms | - (Error) |
| Cumulative Layout Shift (CLS) | < 0.1 | - (Error) |
| Total Page Weight | < 2 MB | 8.3 (Error) |

### Secondary Metrics (Slow 3G)

| Metric | Threshold | Level |
|--------|-----------|-------|
| First Contentful Paint (FCP) | < 3000ms | Warning |
| Largest Contentful Paint (LCP) | < 4000ms | Warning |
| Speed Index | < 5000ms | Warning |
| Performance Score | ≥ 70 | Warning |

Note: Thresholds are more lenient for slow 3G compared to normal network conditions.

## Test Pages

The following pages are tested on slow 3G:

1. Home page (`/`)
2. About page (`/about`)
3. Blog page (`/blog`)
4. Location pages:
   - Dharavi (`/locations/dharavi`)
   - Bandra (`/locations/bandra`)
   - Goregaon (`/locations/goregaon`)
5. Category pages:
   - Aluminium (`/scrap-categories/aluminium`)
   - Copper (`/scrap-categories/copper`)

## Understanding Results

### Successful Test Output

```
✅ All slow network performance tests passed!
==================================================
✅ Requirements validated:
   - 8.1: TTI < 5s on slow 3G ✅
   - 1.3: Page transitions optimized ✅
```

### Failed Test Output

```
❌ Some slow network performance tests failed
==================================================
⚠️  Please review the results above and optimize accordingly.

📄 /locations/dharavi
   TTI: 5234ms ❌ (target: < 5000ms)
   FCP: 2845ms
   LCP: 4123ms
   TBT: 345ms
   Performance Score: 68/100
```

## Optimization Strategies

### For High TTI (> 5s)

1. **Reduce JavaScript execution time**
   - Split large bundles into smaller chunks
   - Defer non-critical JavaScript
   - Remove unused code

2. **Optimize critical rendering path**
   - Inline critical CSS
   - Preload critical resources
   - Minimize render-blocking resources

3. **Reduce Total Blocking Time**
   - Break up long tasks
   - Use web workers for heavy computation
   - Optimize third-party scripts

### For Slow Page Transitions

1. **Implement code splitting**
   - Use React.lazy() for route components
   - Split vendor bundles
   - Preload next route chunks

2. **Optimize caching**
   - Set long cache times for static assets
   - Use service workers
   - Implement stale-while-revalidate strategy

3. **Reduce bundle sizes**
   - Tree shake unused code
   - Minimize dependencies
   - Use dynamic imports

### General Optimizations

1. **Minimize page weight**
   - Compress images (WebP format)
   - Enable text compression (Brotli/Gzip)
   - Remove unnecessary assets

2. **Optimize images**
   - Use responsive images with srcset
   - Lazy load below-fold images
   - Compress with 60%+ reduction

3. **Improve caching**
   - Set 1-year cache for immutable assets
   - Use content hashes in filenames
   - Implement proper cache-control headers

## CI/CD Integration

### GitHub Actions

Add to your workflow:

```yaml
- name: Test Slow Network Performance
  run: npm run test:slow-network
```

### Local Development

Run before committing:

```bash
npm run build
npm run test:slow-network
```

## Troubleshooting

### Tests Timing Out

If tests timeout, increase the timeout in `lighthouserc.slow3g.js`:

```javascript
startServerReadyTimeout: 60000, // Increase to 60 seconds
```

### High TTI on Specific Pages

1. Check the page's JavaScript bundle size
2. Review third-party scripts
3. Analyze the critical rendering path
4. Check for render-blocking resources

### Inconsistent Results

Run multiple test iterations:

```javascript
numberOfRuns: 5, // Increase from 3 to 5
```

## Best Practices

1. **Test regularly**: Run slow network tests before each release
2. **Monitor trends**: Track TTI over time to catch regressions
3. **Prioritize critical pages**: Focus optimization on high-traffic pages
4. **Test real devices**: Supplement with real device testing when possible
5. **Consider offline**: Implement service workers for offline support

## Related Documentation

- [Lighthouse CI Guide](./LIGHTHOUSE_CI_GUIDE.md)
- [Performance Monitoring](./PERFORMANCE_MONITORING.md)
- [Mobile Performance Optimization](./MOBILE_PERFORMANCE_OPTIMIZATION.md)
- [Page Weight Optimization](./PAGE_WEIGHT_OPTIMIZATION.md)

## References

- [Lighthouse Throttling](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md)
- [Web.dev: Optimize TTI](https://web.dev/tti/)
- [Web.dev: Network Reliability](https://web.dev/reliable/)
