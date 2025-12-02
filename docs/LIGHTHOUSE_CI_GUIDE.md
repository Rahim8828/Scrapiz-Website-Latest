# Lighthouse CI Guide

## Overview

Lighthouse CI is configured to automatically test website performance on every build. It ensures that performance metrics meet the defined thresholds and alerts when regressions occur.

## Performance Budgets

Based on the requirements, the following performance budgets are enforced:

### Core Web Vitals
- **First Contentful Paint (FCP)**: < 1.8 seconds (Requirement 1.1)
- **Largest Contentful Paint (LCP)**: < 2.5 seconds (Requirement 1.2)
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Total Blocking Time (TBT)**: < 200ms (Requirement 10.1)
- **Time to Interactive (TTI)**: < 5 seconds on slow networks (Requirement 8.1)

### Performance Scores
- **Mobile Performance Score**: >= 90 (Requirement 1.4)
- **Desktop Performance Score**: >= 95 (Requirement 1.5)

### Resource Budgets
- **JavaScript**: < 200 KiB per chunk (Requirement 3.2)
- **CSS**: < 50 KiB total
- **Images**: < 500 KiB total
- **Total Page Weight**: < 2 MB (Requirement 8.3)
- **HTTP Requests**: < 50 per page (Requirement 8.4)

## Running Lighthouse CI Locally

### Prerequisites
1. Build the site: `npm run build`
2. Ensure the preview server can start: `npm run preview`

### Run Tests

#### Desktop Tests Only
```bash
npm run lhci:desktop
```

#### Mobile Tests Only
```bash
npm run lhci:mobile
```

#### Both Desktop and Mobile
```bash
npm run lhci:full
```

#### Using the Custom Script
```bash
# Run all tests
node scripts/runLighthouseCI.js

# Run desktop only
node scripts/runLighthouseCI.js --desktop

# Run mobile only
node scripts/runLighthouseCI.js --mobile
```

## Configuration Files

### `lighthouserc.js` (Desktop)
- Tests desktop performance with desktop throttling
- Requires performance score >= 90
- Tests 8 key pages across the site

### `lighthouserc.mobile.js` (Mobile)
- Tests mobile performance with Slow 4G throttling
- Requires performance score >= 90
- Emulates mobile device (375x667, 2x DPR)

### `performance-budgets.json`
- Defines resource size and count budgets
- Used for monitoring and alerts

## Automated Testing (CI/CD)

### GitHub Actions Workflow
The `.github/workflows/lighthouse-ci.yml` workflow runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Workflow Steps
1. **Checkout code**: Gets the latest code
2. **Setup Node.js**: Installs Node.js 18
3. **Install dependencies**: Runs `npm ci`
4. **Build site**: Runs `npm run build`
5. **Run Lighthouse CI**: Tests both desktop and mobile
6. **Upload results**: Saves results as artifacts

### Viewing Results
1. Go to the GitHub Actions tab
2. Click on the workflow run
3. Download the artifacts:
   - `lighthouse-desktop-results`
   - `lighthouse-mobile-results`
4. Open the HTML reports in a browser

## Understanding Results

### Assertion Levels
- **Error**: Critical failures that must be fixed
- **Warn**: Issues that should be addressed but won't fail the build

### Key Metrics to Monitor

#### Performance Metrics
- **FCP**: When first content appears
- **LCP**: When main content is visible
- **CLS**: Visual stability score
- **TBT**: Time main thread is blocked
- **Speed Index**: How quickly content is visually displayed

#### Resource Metrics
- **Script Size**: Total JavaScript size
- **Stylesheet Size**: Total CSS size
- **Image Size**: Total image size
- **Total Size**: Total page weight

## Troubleshooting

### Build Fails on Lighthouse CI

1. **Check the error message**: Look for which assertion failed
2. **Review the metric**: Understand which performance metric is failing
3. **Analyze the page**: Use Chrome DevTools to investigate
4. **Fix the issue**: Apply optimizations based on the failing metric

### Common Issues

#### FCP/LCP Too High
- Optimize images (WebP, compression, lazy loading)
- Reduce render-blocking resources
- Inline critical CSS
- Preload critical assets

#### CLS Too High
- Add width/height to images
- Reserve space for dynamic content
- Use font-display: swap

#### TBT Too High
- Reduce JavaScript execution time
- Split large bundles
- Defer non-critical scripts

#### Page Weight Too High
- Compress images more aggressively
- Remove unused code
- Enable text compression (Gzip/Brotli)

## Performance Regression Alerts

### Setting Up Alerts

To receive alerts when performance regresses:

1. **GitHub Actions**: Check the workflow status
2. **Email Notifications**: Configure in GitHub settings
3. **Slack Integration**: Use GitHub Actions Slack integration
4. **Custom Webhooks**: Configure in the workflow file

### Alert Thresholds

Alerts are triggered when:
- Performance score drops below 90 (mobile) or 95 (desktop)
- FCP exceeds 1.8 seconds
- LCP exceeds 2.5 seconds
- CLS exceeds 0.1
- Total page weight exceeds 2 MB

## Best Practices

1. **Run tests before committing**: Catch issues early
2. **Test on multiple pages**: Don't just test the homepage
3. **Monitor trends**: Track performance over time
4. **Set realistic budgets**: Balance performance with features
5. **Iterate and improve**: Continuously optimize

## Integration with Development Workflow

### Pre-commit Hook (Optional)
Add to `.husky/pre-commit`:
```bash
npm run lhci:desktop
```

### Pre-push Hook (Recommended)
Add to `.husky/pre-push`:
```bash
npm run build && npm run lhci:mobile
```

### Pull Request Checks
The GitHub Actions workflow automatically runs on PRs, providing:
- Performance scores
- Metric comparisons
- Regression detection

## Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring Guide](https://web.dev/performance-scoring/)
- [Performance Budgets](https://web.dev/performance-budgets-101/)

## Support

For issues or questions:
1. Check the Lighthouse CI logs
2. Review the performance reports
3. Consult the troubleshooting section
4. Refer to the design document: `.kiro/specs/website-performance-optimization/design.md`
