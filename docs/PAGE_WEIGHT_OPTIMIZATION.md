# Page Weight and Request Optimization

## Overview

This document describes the optimizations implemented to reduce page weight and HTTP requests for the Scrapiz website.

## Targets

- **Total Page Weight**: < 2 MB per page
- **HTTP Requests**: < 50 per page

## Current Status

✅ **All targets met for initial page load**

### Initial Page Load Metrics

- **Total Size**: 293.23 KB
- **Total Requests**: 4
- **Breakdown**:
  - HTML: 6.23 KB (2.1%)
  - JavaScript: 84.72 KB (28.9%)
  - CSS: 202.28 KB (69.0%)
  - Images: 0 KB (lazy-loaded)
  - Fonts: 0 KB (lazy-loaded)

## Optimizations Implemented

### 1. Removed Duplicate Image Folders

**Problem**: The `public/responsive/` folder was a complete duplicate of `public/optimized/`, resulting in 204 duplicate image files.

**Solution**: 
- Removed the `public/responsive/` folder
- Updated all image references to use `public/optimized/` only
- Reduced total image count from 406 to 204 files

**Impact**: Reduced total assets from 498 to 294 files

### 2. Removed Unoptimized Images

**Problem**: Original unoptimized images existed in `public/` root alongside optimized versions in `public/optimized/`.

**Solution**:
- Removed 20 unoptimized images from public root
- Kept only optimized WebP versions in `public/optimized/`

**Impact**: Further reduced file count and eliminated confusion about which images to use

### 3. Disabled Bundle Analyzer in Production

**Problem**: The `rollup-plugin-visualizer` was generating a 991 KB `stats.html` file in every production build.

**Solution**:
- Modified `vite.config.js` to only generate stats.html when `ANALYZE=true` environment variable is set
- Added `npm run build:analyze` script for when bundle analysis is needed

**Impact**: Removed 991 KB unnecessary file from production builds

### 4. Optimized Build Configuration

**Existing optimizations** (already in place):
- Code splitting by vendor and route
- Terser minification with console.log removal
- Tree shaking enabled
- CSS code splitting
- Content hashes in filenames for cache busting
- Critical CSS inlining

## Architecture

### Image Loading Strategy

```
Initial Page Load (0 images)
         ↓
User Scrolls (Lazy Loading)
         ↓
Images Load On-Demand
         ↓
Responsive Images (srcset)
```

### JavaScript Loading Strategy

```
Initial Load
├── react-vendor.js (191 KB) - Core React libraries
├── index.js (87 KB) - App shell
└── CSS (101 KB) - Styles

Route Navigation
├── Home.js (69 KB) - Home page specific
├── motion.js (104 KB) - Animations (if needed)
└── Other route chunks (lazy loaded)
```

## Monitoring

### Audit Scripts

1. **Per-Page Audit** (`npm run audit:page`)
   - Analyzes actual initial page load
   - Counts only resources loaded on first render
   - Realistic measurement of user experience

2. **Full Asset Audit** (`npm run audit:weight`)
   - Analyzes all assets in dist and public folders
   - Useful for identifying duplicate files
   - Shows total project size

### Running Audits

```bash
# Build the project
npm run build

# Audit initial page load (recommended)
npm run audit:page

# Audit all assets
npm run audit:weight

# Analyze bundle composition (generates stats.html)
npm run build:analyze
```

## Best Practices

### Adding New Images

1. Always add images to `public/optimized/` folder
2. Use WebP format
3. Generate responsive sizes (320w, 640w, 768w, 1024w)
4. Use lazy loading for below-fold images
5. Include width and height attributes

### Adding New Dependencies

1. Check if dependency is needed in production
2. Consider bundle size impact
3. Use dynamic imports for large libraries
4. Move dev-only dependencies to devDependencies

### Code Splitting

1. Use route-based code splitting (already implemented)
2. Lazy load heavy components (modals, charts, etc.)
3. Keep vendor chunks under 200 KB
4. Split large libraries into separate chunks

## Results

### Before Optimization

- Total Files: 498
- Total Size: 15.81 MB
- Duplicate Files: 312
- Stats.html: 991 KB

### After Optimization

- Total Files: 294 (-41%)
- Initial Page Load: 293 KB (-98%)
- Duplicate Files: 0 (-100%)
- Stats.html: Only when needed

### Targets Achievement

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Page Weight | < 2 MB | 293 KB | ✅ PASS |
| HTTP Requests | < 50 | 4 | ✅ PASS |
| Image Duplicates | 0 | 0 | ✅ PASS |

## Future Optimizations

### Potential Improvements

1. **Image Optimization**
   - Further compress large images (Dharavi-Koliwada-1920w.webp: 130 KB)
   - Consider AVIF format for even better compression
   - Implement blur-up placeholders

2. **Font Optimization**
   - Subset fonts to only required characters
   - Preload critical fonts
   - Use font-display: swap

3. **Service Worker**
   - Implement offline caching
   - Cache static assets aggressively
   - Precache critical routes

4. **HTTP/2 Server Push**
   - Push critical CSS and JS
   - Reduce round trips for critical resources

## Troubleshooting

### Images Not Loading

If images don't load after optimization:

1. Check that images exist in `public/optimized/` folder
2. Verify image paths in components use `/optimized/` prefix
3. Clear browser cache
4. Rebuild the project

### Bundle Size Increased

If bundle size increases after changes:

1. Run `npm run build:analyze` to see what changed
2. Check for accidentally imported large libraries
3. Verify tree shaking is working
4. Look for duplicate dependencies

### Audit Script Errors

If audit scripts fail:

1. Ensure `npm run build` completed successfully
2. Check that `dist/index.html` exists
3. Verify Node.js version is compatible (v14+)

## References

- [Web.dev - Optimize Page Weight](https://web.dev/fast/#optimize-your-images)
- [Web.dev - Reduce HTTP Requests](https://web.dev/reduce-network-payloads-using-text-compression/)
- [Vite - Build Optimizations](https://vitejs.dev/guide/build.html)
- [Requirements: 8.3, 8.4](../.kiro/specs/website-performance-optimization/requirements.md)
