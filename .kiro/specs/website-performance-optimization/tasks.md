# Implementation Plan: Website Performance Optimization

- [x] 1. Set up image optimization pipeline
  - Create image processing scripts using sharp library
  - Convert all existing images to WebP format with quality optimization
  - Generate responsive image sizes for different breakpoints
  - Update image references in components to use optimized versions
  - _Requirements: 2.1, 2.4, 2.5_

- [ ]* 1.1 Write property test for WebP format delivery
  - **Property 6: WebP format delivery**
  - **Validates: Requirements 2.1**

- [ ]* 1.2 Write property test for image compression ratio
  - **Property 9: Image compression ratio**
  - **Validates: Requirements 2.4**

- [ ]* 1.3 Write property test for responsive image delivery
  - **Property 10: Responsive image delivery**
  - **Validates: Requirements 2.5**

- [x] 2. Implement lazy loading for images
  - Add loading="lazy" attribute to all below-fold images
  - Implement Intersection Observer fallback for older browsers
  - Add explicit width and height attributes to all images
  - Test lazy loading behavior across different pages
  - _Requirements: 2.2, 2.3_

- [ ]* 2.1 Write property test for lazy loading
  - **Property 7: Lazy loading for below-fold images**
  - **Validates: Requirements 2.2**

- [ ]* 2.2 Write property test for image dimensions
  - **Property 8: Image dimensions specified**
  - **Validates: Requirements 2.3**

- [x] 3. Optimize JavaScript bundles
  - Analyze current bundle composition using rollup-plugin-visualizer
  - Identify and remove unused code (target 100+ KiB reduction)
  - Improve code splitting configuration for better chunk sizes
  - Ensure all chunks are under 200 KiB
  - Configure tree shaking for better dead code elimination
  - _Requirements: 3.1, 3.2, 3.5_

- [ ]* 3.1 Write property test for unused JavaScript reduction
  - **Property 11: Unused JavaScript reduction**
  - **Validates: Requirements 3.1**

- [ ]* 3.2 Write property test for chunk size limits
  - **Property 12: JavaScript chunk size limit**
  - **Validates: Requirements 3.2**

- [ ]* 3.3 Write property test for route-based code splitting
  - **Property 15: Route-based code splitting**
  - **Validates: Requirements 3.5**

- [x] 4. Optimize third-party scripts
  - Audit all third-party scripts (EmailJS, analytics, etc.)
  - Add defer or async attributes to non-critical scripts
  - Implement lazy loading for third-party widgets
  - Move non-critical scripts to load after page interactive
  - _Requirements: 3.3_

- [ ]* 4.1 Write property test for third-party script deferral
  - **Property 13: Third-party script deferral**
  - **Validates: Requirements 3.3**

- [x] 5. Implement critical CSS extraction and inlining
  - Install and configure critters or critical library
  - Extract critical CSS for key pages (home, location pages, service pages)
  - Inline critical CSS in HTML head
  - Defer loading of non-critical CSS
  - Minimize render-blocking resources to under 3
  - _Requirements: 7.1, 7.3, 7.5_

- [ ]* 5.1 Write property test for critical CSS inlining
  - **Property 30: Critical CSS inlining**
  - **Validates: Requirements 7.1**

- [ ]* 5.2 Write property test for non-critical CSS deferral
  - **Property 32: Non-critical CSS deferral**
  - **Validates: Requirements 7.3**

- [ ]* 5.3 Write property test for render-blocking resource limit
  - **Property 34: Render-blocking resource limit**
  - **Validates: Requirements 7.5**

- [x] 6. Add resource hints for critical assets
  - Add preload links for critical fonts
  - Add preload links for hero images
  - Add preconnect for external domains
  - Prioritize critical JavaScript loading
  - _Requirements: 7.2, 7.4_

- [ ]* 6.1 Write property test for critical asset preloading
  - **Property 31: Critical asset preloading**
  - **Validates: Requirements 7.2**

- [ ]* 6.2 Write property test for critical JavaScript prioritization
  - **Property 33: Critical JavaScript prioritization**
  - **Validates: Requirements 7.4**

- [x] 7. Optimize font loading
  - Add font-display: swap to all font-face declarations
  - Preload critical fonts used above the fold
  - Subset fonts to include only required characters
  - Convert fonts to WOFF2 format if not already
  - Load only required font weights per page
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 7.1 Write property test for font display swap
  - **Property 25: Font display swap**
  - **Validates: Requirements 6.1**

- [ ]* 7.2 Write property test for critical font preloading
  - **Property 26: Critical font preloading**
  - **Validates: Requirements 6.2**

- [ ]* 7.3 Write property test for WOFF2 format usage
  - **Property 28: WOFF2 format usage**
  - **Validates: Requirements 6.4**

- [x] 8. Implement layout stability improvements
  - Add aspect-ratio CSS or explicit dimensions to all images
  - Reserve space for dynamic content before loading
  - Ensure CLS score below 0.1 for all pages
  - Test layout stability across different viewport sizes
  - _Requirements: 4.1, 4.2, 4.4_

- [ ]* 8.1 Write property test for CLS threshold
  - **Property 16: CLS threshold compliance**
  - **Validates: Requirements 4.1**

- [ ]* 8.2 Write property test for image space reservation
  - **Property 17: Image space reservation**
  - **Validates: Requirements 4.2**

- [ ]* 8.3 Write property test for dynamic content dimensions
  - **Property 19: Dynamic content dimensions**
  - **Validates: Requirements 4.4**

- [x] 9. Configure caching headers
  - Update .htaccess with aggressive caching for immutable assets (1 year)
  - Set revalidation headers for HTML files
  - Configure appropriate cache headers for images
  - Ensure build output includes content hashes in filenames
  - Test cache behavior for different asset types
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 9.1 Write property test for immutable asset caching
  - **Property 20: Immutable asset caching**
  - **Validates: Requirements 5.1**

- [ ]* 9.2 Write property test for HTML cache revalidation
  - **Property 21: HTML cache revalidation**
  - **Validates: Requirements 5.2**

- [ ]* 9.3 Write property test for content hash in filenames
  - **Property 23: Content hash in filenames**
  - **Validates: Requirements 5.4**

- [x] 10. Enable compression
  - Configure Brotli compression in .htaccess
  - Fallback to Gzip for older browsers
  - Verify compression for all text-based resources
  - Test compression ratios
  - _Requirements: 8.2_

- [ ]* 10.1 Write property test for text compression
  - **Property 36: Text compression enabled**
  - **Validates: Requirements 8.2**

- [x] 11. Optimize for mobile performance
  - Test mobile performance scores
  - Ensure mobile-specific optimizations (smaller images, reduced JS)
  - Optimize Total Blocking Time for mobile
  - Test First Input Delay on mobile devices
  - Reduce JavaScript execution time on mobile
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 11.1 Write property test for mobile TBT threshold
  - **Property 39: Mobile TBT threshold**
  - **Validates: Requirements 10.1**

- [ ]* 11.2 Write property test for mobile responsive images
  - **Property 40: Mobile responsive images**
  - **Validates: Requirements 10.2**

- [ ]* 11.3 Write property test for mobile input responsiveness
  - **Property 42: Mobile input responsiveness**
  - **Validates: Requirements 10.4**

- [x] 12. Implement performance monitoring
  - Install web-vitals library
  - Create performance monitoring component
  - Collect Core Web Vitals (FCP, LCP, CLS, FID, TBT)
  - Send metrics to analytics or monitoring service
  - Set up Real User Monitoring (RUM)
  - _Requirements: 9.1, 9.5_

- [ ]* 12.1 Write unit tests for metrics collection
  - Test Web Vitals collector functionality
  - Test RUM reporter functionality
  - Test metric calculation accuracy
  - _Requirements: 9.1, 9.5_

- [x] 13. Set up Lighthouse CI
  - Configure Lighthouse CI in build pipeline
  - Set performance budgets (FCP < 1.8s, LCP < 2.5s, etc.)
  - Configure automated Lighthouse runs on every build
  - Set up alerts for performance regressions
  - _Requirements: 1.1, 1.2, 1.4, 1.5_

- [ ]* 13.1 Write property test for FCP threshold
  - **Property 1: FCP threshold compliance**
  - **Validates: Requirements 1.1**

- [ ]* 13.2 Write property test for LCP threshold
  - **Property 2: LCP threshold compliance**
  - **Validates: Requirements 1.2**

- [ ]* 13.3 Write property test for mobile performance score
  - **Property 4: Mobile performance score**
  - **Validates: Requirements 1.4**

- [ ]* 13.4 Write property test for desktop performance score
  - **Property 5: Desktop performance score**
  - **Validates: Requirements 1.5**

- [x] 14. Optimize page weight and requests
  - Audit total page weight for all pages
  - Reduce total page weight to under 2 MB
  - Minimize HTTP requests to under 50 per page
  - Combine small assets where appropriate
  - Remove unnecessary dependencies
  - _Requirements: 8.3, 8.4_

- [ ]* 14.1 Write property test for page weight limit
  - **Property 37: Total page weight limit**
  - **Validates: Requirements 8.3**

- [ ]* 14.2 Write property test for request count limit
  - **Property 38: HTTP request count limit**
  - **Validates: Requirements 8.4**

- [x] 15. Test slow network performance
  - Configure Lighthouse to test with slow 3G throttling
  - Ensure Time to Interactive under 5 seconds on slow networks
  - Test page transitions on slow networks
  - Optimize for poor connectivity scenarios
  - _Requirements: 8.1, 1.3_

- [ ]* 15.1 Write property test for TTI on slow networks
  - **Property 35: TTI on slow networks**
  - **Validates: Requirements 8.1**

- [ ]* 15.2 Write property test for page transition speed
  - **Property 3: Page transition speed**
  - **Validates: Requirements 1.3**

- [x] 16. Final performance validation
  - Run comprehensive Lighthouse tests on all key pages
  - Verify all Core Web Vitals meet thresholds
  - Test on multiple devices and network conditions
  - Verify mobile score >= 90 and desktop score >= 95
  - Document performance improvements and metrics
  - _Requirements: All_

- [ ]* 16.1 Write integration tests for complete optimization pipeline
  - Test build process produces optimized assets
  - Test optimized assets load correctly in browser
  - Test performance metrics meet all thresholds
  - Test caching works end-to-end
  - _Requirements: All_

- [x] 17. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
