# Slow Network Testing - Quick Reference

## Commands

```bash
# Run all slow network tests
npm run test:slow-network

# Run Lighthouse with slow 3G throttling
npm run lhci:slow3g

# Run specific test types
node scripts/testSlowNetworkPerformance.js --lighthouse
node scripts/testSlowNetworkPerformance.js --transitions
```

## Key Thresholds

| Metric | Threshold | Requirement |
|--------|-----------|-------------|
| TTI | < 5000ms | 8.1 |
| TBT | < 300ms | - |
| CLS | < 0.1 | - |
| Page Weight | < 2 MB | 8.3 |

## Network Settings (Slow 3G)

- RTT: 300ms
- Throughput: 400 Kbps
- CPU Slowdown: 4x

## Quick Fixes

### High TTI
- Split JavaScript bundles
- Defer non-critical scripts
- Inline critical CSS

### Slow Transitions
- Implement code splitting
- Preload route chunks
- Optimize caching

### Large Page Weight
- Compress images to WebP
- Enable Brotli/Gzip
- Remove unused code

## Files

- Config: `lighthouserc.slow3g.js`
- Script: `scripts/testSlowNetworkPerformance.js`
- Docs: `docs/SLOW_NETWORK_TESTING.md`
