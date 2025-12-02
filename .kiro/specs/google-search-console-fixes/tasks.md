# Implementation Plan

- [x] 1. Set up project structure and core utilities
  - Create directory structure for GSC fix system (scripts/gsc-fixes/)
  - Set up error handling utilities with backup/rollback functionality
  - Create logging utility for tracking issues and fixes
  - Install required dependencies (fast-check, cheerio, xml2js, axios)
  - _Requirements: All requirements (foundational)_

- [x] 2. Implement Issue Detector Module
  - Create base IssueDetector class with common detection logic
  - Implement page content analyzer (word count, headings, internal links)
  - Implement HTTP status checker with redirect following
  - Implement HTML parser for meta tags and canonical detection
  - _Requirements: 1.1, 1.2, 1.5, 2.1, 4.5_

- [ ]* 2.1 Write property test for content validation
  - **Property 1: Soft 404 Content Validation**
  - **Validates: Requirements 1.1**

- [ ]* 2.2 Write property test for page structure validation
  - **Property 4: Page Structure Validation**
  - **Validates: Requirements 1.5**

- [x] 3. Implement Soft 404 Detection and Fixes
  - Create Soft404Detector class
  - Implement thin content detection (< 300 words)
  - Implement empty page detection
  - Implement low quality signal detection (no headings, no links)
  - Create Soft404Fixer class to enhance content or add redirects
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [ ]* 3.1 Write property test for non-existent page status
  - **Property 2: Non-existent Page Status**
  - **Validates: Requirements 1.2**

- [ ]* 3.2 Write property test for thin content handling
  - **Property 3: Thin Content Handling**
  - **Validates: Requirements 1.3**

- [x] 4. Implement Canonical Tag Detection and Fixes
  - Create CanonicalDetector class
  - Implement canonical tag extraction from HTML
  - Implement canonical target validation (200 status, not blocked)
  - Implement duplicate content detection using similarity scoring
  - Create CanonicalFixer class to add/update canonical tags
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2_

- [ ]* 4.1 Write property test for canonical target validation
  - **Property 5: Canonical Target Validation**
  - **Validates: Requirements 2.1, 2.5**

- [ ]* 4.2 Write property test for duplicate canonical implementation
  - **Property 6: Duplicate Canonical Implementation**
  - **Validates: Requirements 2.2, 5.2**

- [ ]* 4.3 Write property test for self-referencing canonical
  - **Property 7: Self-referencing Canonical**
  - **Validates: Requirements 2.3**

- [ ]* 4.4 Write property test for canonical consistency
  - **Property 8: Canonical Consistency**
  - **Validates: Requirements 2.4**

- [x] 5. Implement Redirect Detection and Optimization
  - Create RedirectDetector class
  - Implement redirect chain detection (follow all redirects)
  - Implement redirect type identification (301 vs 302)
  - Create RedirectFixer class to flatten redirect chains
  - Implement .htaccess redirect rule generator
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 5.1 Write property test for redirect type validation
  - **Property 9: Redirect Type Validation**
  - **Validates: Requirements 3.1**

- [ ]* 5.2 Write property test for redirect chain flattening
  - **Property 10: Redirect Chain Flattening**
  - **Validates: Requirements 3.2**

- [ ]* 5.3 Write property test for sitemap redirect exclusion
  - **Property 11: Sitemap Redirect Exclusion**
  - **Validates: Requirements 3.3**

- [ ]* 5.4 Write property test for internal link redirect optimization
  - **Property 12: Internal Link Redirect Optimization**
  - **Validates: Requirements 3.4**

- [ ]* 5.5 Write property test for server-level redirect implementation
  - **Property 13: Server-level Redirect Implementation**
  - **Validates: Requirements 3.5**

- [x] 6. Implement Noindex Detection and Fixes
  - Create NoindexDetector class
  - Implement meta robots tag detection
  - Implement X-Robots-Tag HTTP header detection
  - Implement robots.txt blocking detection
  - Create NoindexFixer class to remove inappropriate noindex tags
  - _Requirements: 4.2, 4.3, 4.5, 7.3_

- [ ]* 6.1 Write property test for noindex removal
  - **Property 14: Noindex Removal for Valuable Pages**
  - **Validates: Requirements 4.2**

- [ ]* 6.2 Write property test for noindexed page consistency
  - **Property 15: Noindexed Page Consistency**
  - **Validates: Requirements 4.3**

- [ ]* 6.3 Write property test for comprehensive noindex detection
  - **Property 16: Comprehensive Noindex Detection**
  - **Validates: Requirements 4.5**

- [ ]* 6.4 Write property test for robots.txt blocking validation
  - **Property 24: Robots.txt Blocking Validation**
  - **Validates: Requirements 7.3**

- [x] 7. Implement Duplicate Content Detection and Resolution
  - Create DuplicateDetector class using content similarity algorithms
  - Implement primary version selection logic
  - Implement URL parameter handling
  - Implement protocol consistency checks (HTTP vs HTTPS)
  - Implement trailing slash normalization
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 7.1 Write property test for duplicate detection
  - **Property 17: Duplicate Detection and Primary Selection**
  - **Validates: Requirements 5.1**

- [ ]* 7.2 Write property test for URL parameter canonical handling
  - **Property 18: URL Parameter Canonical Handling**
  - **Validates: Requirements 5.3**

- [ ]* 7.3 Write property test for protocol consistency
  - **Property 19: Protocol Consistency**
  - **Validates: Requirements 5.4**

- [ ]* 7.4 Write property test for trailing slash normalization
  - **Property 20: Trailing Slash Normalization**
  - **Validates: Requirements 5.5**

- [x] 8. Implement Crawled/Discovered Page Analysis
  - Create CrawlAnalyzer class
  - Implement quality signal detection (thin content, no headings, low links)
  - Implement duplicate detection for crawled pages
  - Create fixes for crawled but not indexed pages
  - _Requirements: 6.1, 6.3, 7.1_

- [ ]* 8.1 Write property test for crawled page quality analysis
  - **Property 21: Crawled Page Quality Analysis**
  - **Validates: Requirements 6.1**

- [ ]* 8.2 Write property test for duplicate page resolution
  - **Property 22: Duplicate Page Resolution**
  - **Validates: Requirements 6.3**

- [ ]* 8.3 Write property test for discovered page sitemap inclusion
  - **Property 23: Discovered Page Sitemap Inclusion**
  - **Validates: Requirements 7.1**

- [x] 9. Implement 404 Error Detection and Fixes
  - Create NotFoundDetector class
  - Implement backlink checker (check if 404 has external links)
  - Implement internal link scanner to find links to 404s
  - Create NotFoundFixer class to add redirects or update links
  - _Requirements: 8.3, 8.4, 8.5_

- [ ]* 9.1 Write property test for 404 redirect implementation
  - **Property 25: 404 Redirect Implementation**
  - **Validates: Requirements 8.3**

- [ ]* 9.2 Write property test for valueless 404 handling
  - **Property 26: Valueless 404 Handling**
  - **Validates: Requirements 8.4**

- [ ]* 9.3 Write property test for internal link 404 cleanup
  - **Property 27: Internal Link 404 Cleanup**
  - **Validates: Requirements 8.5**

- [x] 10. Implement Schema Validator Module
  - Create SchemaValidator class
  - Implement JSON-LD extraction from HTML
  - Implement schema type detection (LocalBusiness, FAQPage, etc.)
  - Implement required field validation for each schema type
  - Create SchemaFixer class to add missing fields and fix errors
  - _Requirements: 9.2, 9.3, 9.4_

- [ ]* 10.1 Write property test for schema error detection
  - **Property 28: Schema Error Detection**
  - **Validates: Requirements 9.2**

- [ ]* 10.2 Write property test for FAQPage schema validation
  - **Property 29: FAQPage Schema Validation**
  - **Validates: Requirements 9.3**

- [ ]* 10.3 Write property test for LocalBusiness schema validation
  - **Property 30: LocalBusiness Schema Validation**
  - **Validates: Requirements 9.4**

- [x] 11. Implement Sitemap Manager Module
  - Create SitemapManager class
  - Implement sitemap XML parser
  - Implement sitemap generator with proper structure
  - Implement sitemap validator (check for redirects, 404s, noindex)
  - Implement sitemap cleaner to remove invalid URLs
  - _Requirements: 10.1, 10.2_

- [ ]* 11.1 Write property test for sitemap indexability
  - **Property 31: Sitemap Indexability**
  - **Validates: Requirements 10.1**

- [ ]* 11.2 Write property test for sitemap metadata completeness
  - **Property 32: Sitemap Metadata Completeness**
  - **Validates: Requirements 10.2**

- [x] 12. Implement Robots.txt Manager
  - Create RobotsTxtManager class
  - Implement robots.txt parser
  - Implement resource blocking checker (CSS, JS, images)
  - Implement sitemap directive validator
  - Create robots.txt generator with proper directives
  - _Requirements: 10.4, 10.5_

- [ ]* 12.1 Write property test for robots.txt resource access
  - **Property 33: Robots.txt Resource Access**
  - **Validates: Requirements 10.4**

- [ ]* 12.2 Write property test for robots.txt sitemap directive
  - **Property 34: Robots.txt Sitemap Directive**
  - **Validates: Requirements 10.5**

- [x] 13. Implement Report Generator Module
  - Create ReportGenerator class
  - Implement issue summary report generator
  - Implement detailed issue report with recommendations
  - Implement CSV export for issue tracking
  - Implement JSON export for programmatic access
  - _Requirements: 11.1, 11.2, 11.5_

- [ ]* 13.1 Write property test for issue logging completeness
  - **Property 35: Issue Logging Completeness**
  - **Validates: Requirements 11.1**

- [ ]* 13.2 Write property test for critical issue reporting
  - **Property 36: Critical Issue Reporting**
  - **Validates: Requirements 11.2**

- [ ]* 13.3 Write property test for report recommendations
  - **Property 38: Report Recommendations**
  - **Validates: Requirements 11.5**

- [x] 14. Implement Fix Executor Orchestrator
  - Create FixExecutor class to coordinate all fixers
  - Implement backup creation before applying fixes
  - Implement rollback mechanism on errors
  - Implement fix tracking with timestamps
  - Implement batch processing for large page sets
  - _Requirements: 11.3_

- [ ]* 14.1 Write property test for fix tracking
  - **Property 37: Fix Tracking**
  - **Validates: Requirements 11.3**

- [x] 15. Fix Critical Sitemap URL Mismatches
  - Update sitemap.xml to match actual routes
  - Change `/scrap-collection-page` to `/services/scrap-collection`
  - Change `/demolition-service-page` to `/services/demolition-service`
  - Update all other service page URLs to use `/services/` prefix
  - Validate sitemap XML structure
  - _Requirements: 10.1_

- [x] 16. Add Canonical Tags to All Pages
  - Add canonical tags to all location pages (Bandra, Jogeshwari, etc.)
  - Add canonical tags to all service pages
  - Add canonical tags to all scrap category pages
  - Add canonical tags to blog pages
  - Ensure self-referencing canonicals for primary pages
  - _Requirements: 2.3, 5.4, 5.5_

- [x] 17. Fix Service Page Routes in App.jsx
  - Verify all service page routes use `/services/` prefix
  - Update any mismatched routes
  - Test all service page navigation
  - _Requirements: 3.3, 3.4_

- [x] 18. Update .htaccess with Optimized Redirects
  - Add redirects for old service page URLs to new URLs
  - Flatten any existing redirect chains
  - Ensure all redirects are 301 (permanent)
  - Add trailing slash handling rules
  - Test all redirects
  - _Requirements: 3.1, 3.2, 3.5_

- [x] 19. Fix Invalid Structured Data
  - Audit all pages with schema markup
  - Fix LocalBusiness schema errors (missing fields, invalid format)
  - Fix FAQPage schema errors
  - Validate using Google Rich Results Test
  - _Requirements: 9.2, 9.3, 9.4_

- [x] 20. Remove Inappropriate Noindex Tags
  - Scan all pages for noindex tags
  - Identify valuable pages with noindex
  - Remove noindex from valuable pages
  - Verify noindexed pages are excluded from sitemap
  - _Requirements: 4.2, 4.3_

- [x] 21. Enhance Thin Content Pages
  - Identify pages with < 500 words
  - Add location-specific content to thin location pages
  - Add detailed descriptions to service pages
  - Ensure all pages have proper heading structure
  - _Requirements: 1.3, 6.2_

- [x] 22. Create Main Audit Script
  - Create comprehensive audit script that runs all detectors
  - Generate detailed report of all issues
  - Categorize issues by priority (Critical, High, Medium, Low)
  - Export report to JSON and CSV
  - _Requirements: 11.1, 11.2, 11.5_

- [x] 23. Create Automated Fix Script
  - Create script that applies all automated fixes
  - Implement dry-run mode for testing
  - Create backups before applying fixes
  - Log all changes made
  - Generate fix summary report
  - _Requirements: All fix requirements_

- [x] 24. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 25. Create Monitoring Script
  - Create script to track indexing status over time
  - Implement comparison with previous audit results
  - Generate trend reports showing improvements
  - Set up alerts for new critical issues
  - _Requirements: 11.4_

- [x] 26. Update Documentation
  - Document all scripts and their usage
  - Create troubleshooting guide
  - Document manual steps required after automated fixes
  - Create GSC submission checklist
  - _Requirements: All requirements_

- [x] 27. Final Checkpoint - Validate all fixes
  - Run comprehensive audit to verify all issues are resolved
  - Test sample pages in browser
  - Validate sitemap in GSC
  - Test redirects
  - Verify schema markup with Google Rich Results Test
  - Generate final report
