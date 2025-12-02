# Lighthouse CI Quick Reference

## Quick Commands

```bash
# Build and run all tests
npm run lhci:full

# Desktop tests only
npm run lhci:desktop

# Mobile tests only
npm run lhci:mobile

# Custom script with options
node scripts/runLighthouseCI.js [--desktop|--mobile|--all]
```

## Performance Thresholds

| Metric | Threshold | Requirement |
|--------|-----------|-------------|
| FCP | < 1.8s | 1.1 |
| LCP | < 2.5s | 1.2 |
| CLS | < 0.1 | 4.1 |
| TBT | < 200ms | 10.1 |
| TTI | < 5s (slow 3G) | 8.1 |
| Mobile Score | >= 90 | 1.4 |
| Desktop Score | >= 95 | 1.5 |

## Resource Budgets

| Resource | Budget | Requirement |
|----------|--------|-------------|
| JavaScript Chunk | < 200 KiB | 3.2 |
| Total CSS | < 50 KiB | - |
| Total Images | < 500 KiB | - |
| Total Page | < 2 MB | 8.3 |
| HTTP Requests | < 50 | 8.4 |

## Configuration Files

- `lighthouserc.js` - Desktop configuration
- `lighthouserc.mobile.js` - Mobile configuration
- `performance-budgets.json` - Resource budgets
- `.github/workflows/lighthouse-ci.yml` - CI/CD workflow

## Tested Pages

1. Home: `/`
2. About: `/about`
3. Blog: `/blog`
4. Locations: `/locations/dharavi`, `/locations/bandra`, `/locations/goregaon`
5. Categories: `/scrap-categories/aluminium`, `/scrap-categories/copper`

## Common Fixes

### FCP/LCP Too High
- ✅ Optimize images (WebP, compression)
- ✅ Inline critical CSS
- ✅ Preload critical assets
- ✅ Reduce render-blocking resources

### CLS Too High
- ✅ Add image dimensions
- ✅ Reserve space for dynamic content
- ✅ Use font-display: swap

### TBT Too High
- ✅ Split JavaScript bundles
- ✅ Defer non-critical scripts
- ✅ Reduce JavaScript execution time

### Page Weight Too High
- ✅ Compress images
- ✅ Remove unused code
- ✅ Enable Gzip/Brotli compression

## CI/CD Integration

### Automatic Runs
- ✅ On push to `main` or `develop`
- ✅ On pull requests
- ✅ Results saved as artifacts

### Manual Trigger
1. Go to GitHub Actions
2. Select "Lighthouse CI" workflow
3. Click "Run workflow"

## Viewing Results

### Local
```bash
# Results saved in .lighthouseci/
open .lighthouseci/lhr-*.html
```

### GitHub Actions
1. Go to Actions tab
2. Click on workflow run
3. Download artifacts
4. Open HTML reports

## Alert Conditions

Alerts trigger when:
- ❌ Performance score < 90 (mobile) or < 95 (desktop)
- ❌ FCP > 1.8s
- ❌ LCP > 2.5s
- ❌ CLS > 0.1
- ❌ Page weight > 2 MB

## Need Help?

📖 Full Guide: `docs/LIGHTHOUSE_CI_GUIDE.md`
📋 Design Doc: `.kiro/specs/website-performance-optimization/design.md`
📝 Requirements: `.kiro/specs/website-performance-optimization/requirements.md`
