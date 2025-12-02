# Design Document: Website Performance Optimization

## Overview

This design document outlines the technical approach for optimizing the Scrapiz website performance from the current score of 63/100 to achieve 90+ on mobile and 95+ on desktop. The optimization focuses on six key areas:

1. **Image Optimization**: Converting to WebP, implementing lazy loading, and responsive images
2. **JavaScript Optimization**: Code splitting, tree shaking, and removing unused code
3. **Core Web Vitals**: Improving FCP, LCP, CLS, and TBT metrics
4. **Caching Strategy**: Implementing aggressive caching for static assets
5. **Resource Prioritization**: Critical CSS inlining and resource hints
6. **Performance Monitoring**: Real User Monitoring (RUM) and synthetic testing

The current tech stack (React + Vite) already has good foundations with lazy loading implemented. We'll build upon this to achieve optimal performance.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Service Worker (Optional)                             │ │
│  │  - Cache Strategy                                      │ │
│  │  - Offline Support                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Performance Monitoring                                │ │
│  │  - Web Vitals API                                      │ │
│  │  - RUM Data Collection                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     CDN / Edge Network                       │
│  - Brotli/Gzip Compression                                  │
│  - Cache-Control Headers                                    │
│  - Image Optimization                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Build Process (Vite)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Image Processing Pipeline                             │ │
│  │  - WebP Conversion                                     │ │
│  │  - Image Compression                                   │ │
│  │  - Responsive Image Generation                         │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  JavaScript Optimization                               │ │
│  │  - Code Splitting                                      │ │
│  │  - Tree Shaking                                        │ │
│  │  - Minification                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  CSS Optimization                                      │ │
│  │  - Critical CSS Extraction                             │ │
│  │  - CSS Minification                                    │ │
│  │  - Unused CSS Removal                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

```
User Request → CDN → Cached? → Yes → Serve from Cache
                  ↓
                  No
                  ↓
            Origin Server
                  ↓
         HTML with Critical CSS
                  ↓
    Preload Critical Resources
                  ↓
      Load JavaScript Chunks
                  ↓
    Lazy Load Below-Fold Images
                  ↓
      Report Web Vitals Metrics
```

## Components and Interfaces

### 1. Image Optimization Module

**Purpose**: Convert, compress, and serve optimized images

**Components**:
- `ImageConverter`: Converts images to WebP format
- `ImageCompressor`: Compresses images while maintaining quality
- `ResponsiveImageGenerator`: Creates multiple sizes for responsive images
- `LazyLoadWrapper`: React component for lazy loading images

**Interfaces**:

```typescript
interface ImageOptimizationConfig {
  quality: number; // 0-100
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
  sizes: number[]; // Responsive breakpoints
  lazyLoad: boolean;
}

interface OptimizedImage {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  format: string;
  loading: 'lazy' | 'eager';
}
```

### 2. JavaScript Optimization Module

**Purpose**: Reduce JavaScript bundle size and improve loading

**Components**:
- `CodeSplitter`: Implements route-based and component-based code splitting
- `UnusedCodeAnalyzer`: Identifies and removes unused code
- `BundleAnalyzer`: Analyzes bundle composition and suggests optimizations

**Interfaces**:

```typescript
interface CodeSplitConfig {
  routes: boolean;
  components: string[]; // Components to split
  vendors: Record<string, string[]>; // Vendor chunks
}

interface BundleAnalysis {
  totalSize: number;
  chunks: ChunkInfo[];
  unusedCode: number;
  recommendations: string[];
}
```

### 3. Critical CSS Module

**Purpose**: Extract and inline critical CSS for above-the-fold content

**Components**:
- `CriticalCSSExtractor`: Extracts critical CSS from pages
- `CSSInliner`: Inlines critical CSS in HTML
- `NonCriticalCSSLoader`: Defers loading of non-critical CSS

**Interfaces**:

```typescript
interface CriticalCSSConfig {
  viewportWidth: number;
  viewportHeight: number;
  pages: string[]; // Pages to extract critical CSS for
  inline: boolean;
}

interface CriticalCSSResult {
  critical: string;
  nonCritical: string;
  inlineSize: number;
}
```

### 4. Caching Strategy Module

**Purpose**: Implement aggressive caching for static assets

**Components**:
- `CacheHeaderGenerator`: Generates appropriate cache headers
- `ServiceWorkerManager`: Manages service worker for offline support
- `CacheInvalidator`: Handles cache invalidation strategies

**Interfaces**:

```typescript
interface CacheConfig {
  immutableAssets: {
    maxAge: number; // seconds
    pattern: RegExp;
  };
  htmlFiles: {
    maxAge: number;
    revalidate: boolean;
  };
  images: {
    maxAge: number;
  };
}

interface CacheHeaders {
  'Cache-Control': string;
  'ETag'?: string;
  'Last-Modified'?: string;
}
```

### 5. Performance Monitoring Module

**Purpose**: Track and report performance metrics

**Components**:
- `WebVitalsCollector`: Collects Core Web Vitals metrics
- `RUMReporter`: Reports Real User Monitoring data
- `PerformanceAnalyzer`: Analyzes performance trends

**Interfaces**:

```typescript
interface WebVitalsMetrics {
  FCP: number;
  LCP: number;
  CLS: number;
  FID: number;
  TBT: number;
  TTFB: number;
}

interface PerformanceReport {
  url: string;
  metrics: WebVitalsMetrics;
  deviceType: 'mobile' | 'desktop';
  timestamp: number;
  userAgent: string;
}
```

### 6. Resource Prioritization Module

**Purpose**: Prioritize critical resources for faster initial load

**Components**:
- `ResourceHintGenerator`: Generates preload/prefetch hints
- `FontOptimizer`: Optimizes font loading
- `ThirdPartyScriptManager`: Manages third-party script loading

**Interfaces**:

```typescript
interface ResourceHints {
  preload: Array<{
    href: string;
    as: string;
    type?: string;
  }>;
  prefetch: string[];
  preconnect: string[];
}

interface FontConfig {
  family: string;
  weights: number[];
  display: 'swap' | 'block' | 'fallback' | 'optional';
  preload: boolean;
  subset: string; // Character ranges
}
```

## Data Models

### Performance Metrics Model

```typescript
interface PerformanceMetrics {
  id: string;
  url: string;
  timestamp: Date;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  connectionType: string;
  
  // Core Web Vitals
  fcp: number; // First Contentful Paint (ms)
  lcp: number; // Largest Contentful Paint (ms)
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay (ms)
  tbt: number; // Total Blocking Time (ms)
  ttfb: number; // Time to First Byte (ms)
  
  // Additional Metrics
  domContentLoaded: number;
  loadComplete: number;
  totalPageSize: number;
  requestCount: number;
  
  // Scores
  performanceScore: number; // 0-100
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
}
```

### Image Asset Model

```typescript
interface ImageAsset {
  originalPath: string;
  optimizedPath: string;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  width: number;
  height: number;
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  srcSet: string[];
  lazyLoad: boolean;
}
```

### Bundle Analysis Model

```typescript
interface BundleChunk {
  name: string;
  size: number;
  gzipSize: number;
  modules: string[];
  isEntry: boolean;
  isDynamic: boolean;
}

interface BundleReport {
  totalSize: number;
  totalGzipSize: number;
  chunks: BundleChunk[];
  unusedCode: {
    file: string;
    unusedBytes: number;
    totalBytes: number;
  }[];
  recommendations: string[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Performance Metrics Properties

**Property 1: FCP threshold compliance**
*For any* page load, the First Contentful Paint time should be less than or equal to 1.8 seconds under normal network conditions.
**Validates: Requirements 1.1**

**Property 2: LCP threshold compliance**
*For any* page load, the Largest Contentful Paint time should be less than or equal to 2.5 seconds under normal network conditions.
**Validates: Requirements 1.2**

**Property 3: Page transition speed**
*For any* client-side navigation between pages, the transition should complete within 1 second.
**Validates: Requirements 1.3**

**Property 4: Mobile performance score**
*For any* page accessed on mobile devices, the Lighthouse performance score should be at least 90.
**Validates: Requirements 1.4**

**Property 5: Desktop performance score**
*For any* page accessed on desktop devices, the Lighthouse performance score should be at least 95.
**Validates: Requirements 1.5**

### Image Optimization Properties

**Property 6: WebP format delivery**
*For any* image served by the system, the response should be in WebP format with appropriate fallback for unsupported browsers.
**Validates: Requirements 2.1**

**Property 7: Lazy loading for below-fold images**
*For any* image that is not in the initial viewport, the image should have loading="lazy" attribute or use Intersection Observer for lazy loading.
**Validates: Requirements 2.2**

**Property 8: Image dimensions specified**
*For any* image element in the DOM, it should have explicit width and height attributes to prevent layout shifts.
**Validates: Requirements 2.3**

**Property 9: Image compression ratio**
*For any* image processed by the optimization pipeline, the compressed size should be at least 60% smaller than the original without visible quality degradation.
**Validates: Requirements 2.4**

**Property 10: Responsive image delivery**
*For any* image request, the system should serve an appropriately sized image based on the device viewport using srcset and sizes attributes.
**Validates: Requirements 2.5**

### JavaScript Optimization Properties

**Property 11: Unused JavaScript reduction**
*For any* page load, the total unused JavaScript should be reduced by at least 100 KiB compared to the baseline.
**Validates: Requirements 3.1**

**Property 12: JavaScript chunk size limit**
*For any* JavaScript chunk generated by the build process, the size should be less than 200 KiB.
**Validates: Requirements 3.2**

**Property 13: Third-party script deferral**
*For any* non-critical third-party script, it should have the defer or async attribute to prevent blocking.
**Validates: Requirements 3.3**

**Property 14: JavaScript minification**
*For any* JavaScript file served in production, it should be minified and compressed.
**Validates: Requirements 3.4**

**Property 15: Route-based code splitting**
*For any* route in the application, it should use dynamic imports for code splitting.
**Validates: Requirements 3.5**

### Layout Stability Properties

**Property 16: CLS threshold compliance**
*For any* page load, the Cumulative Layout Shift score should be below 0.1.
**Validates: Requirements 4.1**

**Property 17: Image space reservation**
*For any* image element, space should be reserved before the image loads using width/height attributes or aspect-ratio CSS.
**Validates: Requirements 4.2**

**Property 18: Font display strategy**
*For any* font-face declaration, it should include font-display: swap to prevent invisible text.
**Validates: Requirements 4.3**

**Property 19: Dynamic content dimensions**
*For any* dynamically loaded content element, it should have fixed dimensions allocated before content loads.
**Validates: Requirements 4.4**

### Caching Properties

**Property 20: Immutable asset caching**
*For any* immutable static asset (JS, CSS with hash), the Cache-Control header should specify at least 1 year max-age.
**Validates: Requirements 5.1**

**Property 21: HTML cache revalidation**
*For any* HTML file served, the Cache-Control header should include must-revalidate or no-cache directives.
**Validates: Requirements 5.2**

**Property 22: Image caching headers**
*For any* image served, the response should include appropriate Cache-Control headers with reasonable expiration times.
**Validates: Requirements 5.3**

**Property 23: Content hash in filenames**
*For any* CSS or JavaScript file in the build output, the filename should include a content hash for cache busting.
**Validates: Requirements 5.4**

**Property 24: Cache hit on revisit**
*For any* immutable resource, a revisit should serve the resource from cache without revalidation.
**Validates: Requirements 5.5**

### Font Optimization Properties

**Property 25: Font display swap**
*For any* font loaded by the system, it should use font-display: swap to show fallback fonts immediately.
**Validates: Requirements 6.1**

**Property 26: Critical font preloading**
*For any* font used above the fold, it should have a preload link in the HTML head.
**Validates: Requirements 6.2**

**Property 27: Font subsetting**
*For any* font file served, it should be subsetted to include only required character ranges.
**Validates: Requirements 6.3**

**Property 28: WOFF2 format usage**
*For any* font served, it should be in WOFF2 format for optimal compression.
**Validates: Requirements 6.4**

**Property 29: Minimal font weights**
*For any* page, only the font weights actually used on that page should be loaded.
**Validates: Requirements 6.5**

### Resource Prioritization Properties

**Property 30: Critical CSS inlining**
*For any* page, critical CSS for above-the-fold content should be inlined in the HTML head.
**Validates: Requirements 7.1**

**Property 31: Critical asset preloading**
*For any* critical asset (hero image, critical font), it should have a preload link in the HTML head.
**Validates: Requirements 7.2**

**Property 32: Non-critical CSS deferral**
*For any* non-critical CSS, it should be loaded asynchronously or with media="print" trick.
**Validates: Requirements 7.3**

**Property 33: Critical JavaScript prioritization**
*For any* critical JavaScript, it should be loaded before non-critical scripts.
**Validates: Requirements 7.4**

**Property 34: Render-blocking resource limit**
*For any* page, the number of render-blocking resources should be fewer than 3.
**Validates: Requirements 7.5**

### Network Efficiency Properties

**Property 35: TTI on slow networks**
*For any* page load on a simulated slow 3G connection, Time to Interactive should be within 5 seconds.
**Validates: Requirements 8.1**

**Property 36: Text compression enabled**
*For any* text-based resource (HTML, CSS, JS, JSON), the response should include Content-Encoding: gzip or br header.
**Validates: Requirements 8.2**

**Property 37: Total page weight limit**
*For any* initial page load, the total transfer size should be under 2 MB.
**Validates: Requirements 8.3**

**Property 38: HTTP request count limit**
*For any* initial page load, the total number of HTTP requests should be fewer than 50.
**Validates: Requirements 8.4**

### Mobile Optimization Properties

**Property 39: Mobile TBT threshold**
*For any* page load on mobile, the Total Blocking Time should be below 200 milliseconds.
**Validates: Requirements 10.1**

**Property 40: Mobile responsive images**
*For any* image served to mobile devices, it should be appropriately sized for mobile viewports.
**Validates: Requirements 10.2**

**Property 41: Mobile resource prioritization**
*For any* page load on mobile, mobile-critical resources should load before non-critical resources.
**Validates: Requirements 10.3**

**Property 42: Mobile input responsiveness**
*For any* user interaction on mobile, the First Input Delay should be within 100 milliseconds.
**Validates: Requirements 10.4**

**Property 43: Mobile JavaScript execution time**
*For any* page load on mobile, JavaScript execution time should be under 2 seconds.
**Validates: Requirements 10.5**

## Error Handling

### Image Optimization Errors

1. **WebP Conversion Failure**
   - Fallback to original format
   - Log error for monitoring
   - Continue build process

2. **Image Compression Failure**
   - Use original image
   - Alert developer
   - Track failure rate

3. **Lazy Loading Failure**
   - Fallback to eager loading
   - Ensure images still display
   - Log error

### JavaScript Optimization Errors

1. **Code Splitting Failure**
   - Fallback to single bundle
   - Alert developer
   - Investigate chunk dependencies

2. **Minification Failure**
   - Use unminified version
   - Alert developer
   - Check for syntax errors

3. **Dynamic Import Failure**
   - Show error boundary
   - Retry loading
   - Fallback to error page

### Caching Errors

1. **Cache Header Misconfiguration**
   - Use safe defaults
   - Alert developer
   - Monitor cache hit rates

2. **Service Worker Registration Failure**
   - Continue without service worker
   - Log error
   - Graceful degradation

### Performance Monitoring Errors

1. **Metrics Collection Failure**
   - Continue normal operation
   - Log error locally
   - Retry sending metrics

2. **RUM Reporting Failure**
   - Queue metrics for retry
   - Don't block user experience
   - Alert if persistent

## Testing Strategy

### Unit Testing

We'll write unit tests for individual optimization functions:

- Image conversion and compression functions
- Cache header generation logic
- Critical CSS extraction logic
- Bundle analysis utilities
- Performance metric calculation functions

**Testing Framework**: Vitest (already configured)

**Example Unit Tests**:
- Test image compression reduces file size by expected ratio
- Test cache header generation for different asset types
- Test critical CSS extraction produces valid CSS
- Test bundle chunk size calculations

### Property-Based Testing

We'll use property-based testing to verify universal properties across all inputs using **fast-check** library (already in package.json).

**Property Testing Framework**: fast-check

**Configuration**: Each property test should run at least 100 iterations to ensure thorough coverage.

**Property Test Tagging**: Each property-based test must include a comment with the format:
`// Feature: website-performance-optimization, Property {number}: {property_text}`

**Key Property Tests**:

1. **Image Optimization Properties** (Properties 6-10)
   - Generate random image configurations
   - Verify WebP format delivery
   - Verify lazy loading attributes
   - Verify dimension attributes present
   - Verify compression ratios
   - Verify responsive image srcset

2. **JavaScript Optimization Properties** (Properties 11-15)
   - Analyze build output
   - Verify chunk sizes under limits
   - Verify minification applied
   - Verify code splitting implemented
   - Verify unused code reduction

3. **Layout Stability Properties** (Properties 16-19)
   - Generate random page configurations
   - Measure CLS scores
   - Verify image dimensions specified
   - Verify font-display settings
   - Verify dynamic content dimensions

4. **Caching Properties** (Properties 20-24)
   - Generate random asset types
   - Verify cache headers present
   - Verify cache durations appropriate
   - Verify content hashes in filenames
   - Verify cache behavior on revisit

5. **Performance Metrics Properties** (Properties 1-5, 35, 37-43)
   - Run Lighthouse tests on random pages
   - Verify FCP, LCP, TBT thresholds
   - Verify performance scores
   - Verify page weight limits
   - Verify request count limits

### Integration Testing

Integration tests will verify the complete optimization pipeline:

- Build process produces optimized assets
- Optimized assets load correctly in browser
- Performance metrics meet thresholds
- Caching works end-to-end
- Monitoring reports metrics correctly

**Testing Approach**:
- Use Playwright or Puppeteer for browser automation
- Run Lighthouse programmatically
- Verify actual performance in real browser
- Test on multiple device types and network conditions

### Performance Testing

Continuous performance testing using:

- **Lighthouse CI**: Automated Lighthouse runs on every build
- **WebPageTest**: Periodic tests from multiple locations
- **Real User Monitoring**: Track actual user performance

**Performance Budgets**:
- JavaScript: < 200 KiB per chunk
- CSS: < 50 KiB total
- Images: < 100 KiB per image
- Total Page Weight: < 2 MB
- FCP: < 1.8s
- LCP: < 2.5s
- CLS: < 0.1
- TBT: < 200ms

## Implementation Notes

### Current State Analysis

Based on the provided screenshots and codebase:

**Strengths**:
- Lazy loading already implemented for routes
- Code splitting configured for vendors
- Terser minification enabled
- WebP images already in use

**Issues to Address**:
1. **Render-blocking requests**: 450ms savings available
2. **Image delivery**: 53 KiB savings from better image optimization
3. **LCP breakdown**: Network latency and resource load time issues
4. **Network dependency tree**: Inefficient resource loading order
5. **Unused JavaScript**: 106 KiB can be removed
6. **Accessibility issues**: Missing ARIA attributes, form labels, button names

### Optimization Priorities

1. **High Priority** (Biggest Impact):
   - Optimize images (convert all to WebP, compress better)
   - Reduce unused JavaScript
   - Implement critical CSS inlining
   - Add resource hints (preload, prefetch)
   - Fix render-blocking resources

2. **Medium Priority**:
   - Improve code splitting granularity
   - Optimize font loading
   - Implement better caching headers
   - Add performance monitoring

3. **Low Priority**:
   - Service worker for offline support
   - Advanced image formats (AVIF)
   - HTTP/2 push

### Technology Choices

- **Image Optimization**: sharp library for Node.js
- **Critical CSS**: critters or critical library
- **Bundle Analysis**: rollup-plugin-visualizer
- **Performance Monitoring**: web-vitals library
- **Property Testing**: fast-check
- **E2E Testing**: Playwright with Lighthouse
- **Build Tool**: Vite (already in use)

### Deployment Considerations

- Configure CDN for optimal caching
- Enable Brotli compression on server
- Set up proper cache headers in .htaccess
- Configure HTTP/2 if not already enabled
- Set up performance monitoring dashboard
- Create performance budget alerts
