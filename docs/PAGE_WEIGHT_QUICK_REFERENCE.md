# Page Weight Optimization - Quick Reference

## Current Status

✅ **All targets met**
- Page Weight: 293 KB / 2 MB target
- HTTP Requests: 4 / 50 target

## Quick Commands

```bash
# Build for production
npm run build

# Audit initial page load
npm run audit:page

# Audit all assets
npm run audit:weight

# Analyze bundle with visualization
npm run build:analyze
```

## Key Optimizations

1. ✅ Removed duplicate image folders (204 files saved)
2. ✅ Removed unoptimized images (20 files saved)
3. ✅ Disabled stats.html in production (991 KB saved)
4. ✅ Code splitting by route and vendor
5. ✅ Critical CSS inlining
6. ✅ Lazy loading for images and routes

## Adding New Content

### Images
```bash
# Add to public/optimized/ folder only
# Use WebP format
# Generate responsive sizes
# Use lazy loading
```

### JavaScript
```bash
# Use dynamic imports for large components
# Keep chunks under 200 KB
# Check bundle size with npm run build:analyze
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not loading | Check `/optimized/` path, rebuild |
| Bundle too large | Run `npm run build:analyze` |
| Audit fails | Run `npm run build` first |

## Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Page Weight | < 2 MB | 293 KB | ✅ |
| HTTP Requests | < 50 | 4 | ✅ |

## Related Docs

- [Full Documentation](./PAGE_WEIGHT_OPTIMIZATION.md)
- [Requirements](../.kiro/specs/website-performance-optimization/requirements.md)
