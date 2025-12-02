#!/usr/bin/env node

/**
 * Main Audit Script
 * Comprehensive audit that runs all detectors and generates detailed reports
 */

import IssueDetector from './IssueDetector.js';
import CanonicalDetector from './CanonicalDetector.js';
import RedirectDetector from './RedirectDetector.js';
import NoindexDetector from './NoindexDetector.js';
import DuplicateDetector from './DuplicateDetector.js';
import CrawlAnalyzer from './CrawlAnalyzer.js';
import NotFoundDetector from './NotFoundDetector.js';
import SchemaValidator from './SchemaValidator.js';
import SitemapManager from './SitemapManager.js';
import ReportGenerator from './ReportGenerator.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import { normalizeUrl } from './utils.js';

/**
 * Main Audit Class
 * Orchestrates all detectors and generates comprehensive reports
 */
class MainAudit {
  constructor(options = {}) {
    this.options = {
      baseUrl: options.baseUrl || 'https://scrapiz.com',
      sitemapPath: options.sitemapPath || 'public/sitemap.xml',
      includeSchemaValidation: options.includeSchemaValidation !== false,
      includeDuplicateDetection: options.includeDuplicateDetection !== false,
      includeInternalLinkScan: options.includeInternalLinkScan !== false,
      batchSize: options.batchSize || 5,
      ...options
    };

    // Initialize logger and error handler
    this.logger = new Logger();
    this.errorHandler = new ErrorHandler(this.logger);

    // Initialize all detectors
    this.issueDetector = new IssueDetector(this.logger, this.errorHandler);
    this.canonicalDetector = new CanonicalDetector(this.logger, this.errorHandler);
    this.redirectDetector = new RedirectDetector(this.logger, this.errorHandler);
    this.noindexDetector = new NoindexDetector(this.logger, this.errorHandler);
    this.duplicateDetector = new DuplicateDetector(this.logger, this.errorHandler);
    this.crawlAnalyzer = new CrawlAnalyzer(this.logger, this.errorHandler);
    this.notFoundDetector = new NotFoundDetector(this.logger, this.errorHandler);
    this.schemaValidator = new SchemaValidator(this.logger, this.errorHandler);
    this.sitemapManager = new SitemapManager(this.logger, this.errorHandler);
    this.reportGenerator = new ReportGenerator(this.logger);
  }

  /**
   * Initialize audit system
   */
  async initialize() {
    this.logger.info('Initializing audit system...');
    await this.reportGenerator.initialize();
    this.logger.info('Audit system initialized');
  }

  /**
   * Get all URLs to audit
   * @returns {Promise<Array<string>>} Array of URLs
   */
  async getAllUrls() {
    this.logger.info('Collecting URLs to audit...');

    try {
      // Get URLs from sitemap
      const sitemapUrls = await this.sitemapManager.extractUrlsFromSitemap(this.options.sitemapPath);
      this.logger.info(`Found ${sitemapUrls.length} URLs in sitemap`);

      // You can add additional URL sources here
      // For example: crawl the site, read from a file, etc.

      return sitemapUrls;
    } catch (error) {
      this.logger.error('Failed to collect URLs', { error: error.message });
      throw error;
    }
  }

  /**
   * Run all detectors on URLs
   * @param {Array<string>} urls - URLs to audit
   * @returns {Promise<Object>} Complete issue report
   */
  async runAllDetectors(urls) {
    this.logger.info(`Starting comprehensive audit for ${urls.length} URLs...`);

    const issueReport = {
      timestamp: new Date(),
      totalPages: urls.length,
      baseUrl: this.options.baseUrl,
      issues: {
        soft404: [],
        canonical: [],
        redirects: [],
        noindex: [],
        duplicates: [],
        crawled: [],
        discovered: [],
        notFound: [],
        invalidSchema: []
      },
      summary: {
        totalIssues: 0,
        criticalIssues: 0,
        warningIssues: 0,
        fixableIssues: 0
      }
    };

    // 1. Check for soft 404 errors
    this.logger.info('Checking for soft 404 errors...');
    for (const url of urls) {
      const soft404Issue = await this.issueDetector.checkSoft404(url);
      if (soft404Issue) {
        issueReport.issues.soft404.push(soft404Issue);
      }
    }
    this.logger.info(`Found ${issueReport.issues.soft404.length} soft 404 issues`);

    // 2. Check canonical tags
    this.logger.info('Checking canonical tags...');
    issueReport.issues.canonical = await this.canonicalDetector.checkCanonicals(urls);
    this.logger.info(`Found ${issueReport.issues.canonical.length} canonical issues`);

    // 3. Check redirects
    this.logger.info('Checking redirects...');
    issueReport.issues.redirects = await this.redirectDetector.checkRedirects(urls);
    this.logger.info(`Found ${issueReport.issues.redirects.length} redirect issues`);

    // 4. Check noindex tags
    this.logger.info('Checking noindex tags...');
    issueReport.issues.noindex = await this.noindexDetector.checkNoindexes(urls, {
      baseUrl: this.options.baseUrl
    });
    this.logger.info(`Found ${issueReport.issues.noindex.length} noindex issues`);

    // 5. Check for duplicate content (if enabled)
    if (this.options.includeDuplicateDetection) {
      this.logger.info('Checking for duplicate content...');
      issueReport.issues.duplicates = await this.duplicateDetector.checkDuplicates(urls);
      this.logger.info(`Found ${issueReport.issues.duplicates.length} duplicate content groups`);
    }

    // 6. Check for 404 errors
    this.logger.info('Checking for 404 errors...');
    const siteUrls = this.options.includeInternalLinkScan ? urls : [];
    issueReport.issues.notFound = await this.notFoundDetector.detect404Issues(urls, siteUrls);
    this.logger.info(`Found ${issueReport.issues.notFound.length} 404 errors`);

    // 7. Validate schema markup (if enabled)
    if (this.options.includeSchemaValidation) {
      this.logger.info('Validating schema markup...');
      issueReport.issues.invalidSchema = await this.schemaValidator.validateSchemas(urls);
      this.logger.info(`Found ${issueReport.issues.invalidSchema.length} pages with invalid schema`);
    }

    // 8. Update sitemap status for all issues
    this.logger.info('Checking sitemap status for issues...');
    await this.updateSitemapStatus(issueReport, urls);

    // 9. Calculate summary statistics
    this.calculateSummary(issueReport);

    this.logger.info('Audit complete!');
    return issueReport;
  }

  /**
   * Update sitemap status for all issues
   * @param {Object} issueReport - Issue report
   * @param {Array<string>} sitemapUrls - URLs in sitemap
   */
  async updateSitemapStatus(issueReport, sitemapUrls) {
    const sitemapUrlSet = new Set(sitemapUrls.map(url => normalizeUrl(url)));

    // Update canonical issues
    issueReport.issues.canonical.forEach(issue => {
      issue.inSitemap = sitemapUrlSet.has(normalizeUrl(issue.url));
    });

    // Update redirect issues
    issueReport.issues.redirects.forEach(issue => {
      issue.inSitemap = sitemapUrlSet.has(normalizeUrl(issue.url));
    });

    // Update noindex issues
    issueReport.issues.noindex.forEach(issue => {
      issue.inSitemap = sitemapUrlSet.has(normalizeUrl(issue.url));
    });
  }

  /**
   * Calculate summary statistics
   * @param {Object} issueReport - Issue report
   */
  calculateSummary(issueReport) {
    let totalIssues = 0;
    let criticalIssues = 0;
    let warningIssues = 0;
    let fixableIssues = 0;

    // Count soft 404 issues
    totalIssues += issueReport.issues.soft404.length;
    criticalIssues += issueReport.issues.soft404.length;
    fixableIssues += issueReport.issues.soft404.filter(i => i.fixable).length;

    // Count canonical issues
    totalIssues += issueReport.issues.canonical.length;
    criticalIssues += issueReport.issues.canonical.filter(i => i.issueType === 'missing').length;
    warningIssues += issueReport.issues.canonical.filter(i => i.issueType !== 'missing').length;
    fixableIssues += issueReport.issues.canonical.filter(i => i.fixable).length;

    // Count redirect issues
    totalIssues += issueReport.issues.redirects.length;
    criticalIssues += issueReport.issues.redirects.filter(i => i.redirectChain.length > 2).length;
    warningIssues += issueReport.issues.redirects.filter(i => i.redirectChain.length <= 2).length;
    fixableIssues += issueReport.issues.redirects.filter(i => i.fixable).length;

    // Count noindex issues
    totalIssues += issueReport.issues.noindex.length;
    criticalIssues += issueReport.issues.noindex.filter(i => i.shouldBeIndexed).length;
    warningIssues += issueReport.issues.noindex.filter(i => !i.shouldBeIndexed).length;
    fixableIssues += issueReport.issues.noindex.filter(i => i.fixable).length;

    // Count duplicate issues
    totalIssues += issueReport.issues.duplicates.length;
    warningIssues += issueReport.issues.duplicates.length;
    fixableIssues += issueReport.issues.duplicates.filter(i => i.fixable).length;

    // Count crawled issues
    totalIssues += issueReport.issues.crawled.length;
    warningIssues += issueReport.issues.crawled.length;

    // Count discovered issues
    totalIssues += issueReport.issues.discovered.length;
    warningIssues += issueReport.issues.discovered.length;

    // Count 404 issues
    totalIssues += issueReport.issues.notFound.length;
    criticalIssues += issueReport.issues.notFound.filter(i => i.hasBacklinks).length;
    warningIssues += issueReport.issues.notFound.filter(i => !i.hasBacklinks).length;
    fixableIssues += issueReport.issues.notFound.filter(i => i.fixable).length;

    // Count schema issues
    totalIssues += issueReport.issues.invalidSchema.length;
    criticalIssues += issueReport.issues.invalidSchema.length;
    fixableIssues += issueReport.issues.invalidSchema.filter(i => i.fixable).length;

    issueReport.summary = {
      totalIssues,
      criticalIssues,
      warningIssues,
      fixableIssues
    };
  }

  /**
   * Categorize issues by priority
   * @param {Object} issueReport - Issue report
   * @returns {Object} Issues categorized by priority
   */
  categorizeByPriority(issueReport) {
    const categorized = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };

    // Critical: 404 with backlinks
    issueReport.issues.notFound
      .filter(i => i.hasBacklinks)
      .forEach(i => categorized.critical.push({ type: '404', ...i }));

    // Critical: Noindex on valuable pages
    issueReport.issues.noindex
      .filter(i => i.shouldBeIndexed)
      .forEach(i => categorized.critical.push({ type: 'noindex', ...i }));

    // Critical: Invalid schema
    issueReport.issues.invalidSchema
      .forEach(i => categorized.critical.push({ type: 'schema', ...i }));

    // High: Soft 404
    issueReport.issues.soft404
      .forEach(i => categorized.high.push({ type: 'soft404', ...i }));

    // High: Redirect chains
    issueReport.issues.redirects
      .filter(i => i.redirectChain.length > 2)
      .forEach(i => categorized.high.push({ type: 'redirect', ...i }));

    // High: Missing canonical
    issueReport.issues.canonical
      .filter(i => i.issueType === 'missing')
      .forEach(i => categorized.high.push({ type: 'canonical', ...i }));

    // Medium: Other redirects
    issueReport.issues.redirects
      .filter(i => i.redirectChain.length <= 2)
      .forEach(i => categorized.medium.push({ type: 'redirect', ...i }));

    // Medium: Other canonical issues
    issueReport.issues.canonical
      .filter(i => i.issueType !== 'missing')
      .forEach(i => categorized.medium.push({ type: 'canonical', ...i }));

    // Medium: Duplicates
    issueReport.issues.duplicates
      .forEach(i => categorized.medium.push({ type: 'duplicate', ...i }));

    // Medium: Crawled not indexed
    issueReport.issues.crawled
      .forEach(i => categorized.medium.push({ type: 'crawled', ...i }));

    // Low: 404 without backlinks
    issueReport.issues.notFound
      .filter(i => !i.hasBacklinks)
      .forEach(i => categorized.low.push({ type: '404', ...i }));

    // Low: Discovered not indexed
    issueReport.issues.discovered
      .forEach(i => categorized.low.push({ type: 'discovered', ...i }));

    // Low: Correctly noindexed pages
    issueReport.issues.noindex
      .filter(i => !i.shouldBeIndexed)
      .forEach(i => categorized.low.push({ type: 'noindex', ...i }));

    return categorized;
  }

  /**
   * Run complete audit and generate all reports
   * @returns {Promise<Object>} Audit results and report paths
   */
  async runCompleteAudit() {
    try {
      // Initialize
      await this.initialize();

      // Get URLs
      const urls = await this.getAllUrls();

      if (urls.length === 0) {
        this.logger.warn('No URLs found to audit');
        return {
          success: false,
          message: 'No URLs found to audit'
        };
      }

      // Run all detectors
      const issueReport = await this.runAllDetectors(urls);

      // Categorize by priority
      const categorized = this.categorizeByPriority(issueReport);

      // Log summary
      this.logger.info('='.repeat(80));
      this.logger.info('AUDIT SUMMARY');
      this.logger.info('='.repeat(80));
      this.logger.info(`Total Pages: ${issueReport.totalPages}`);
      this.logger.info(`Total Issues: ${issueReport.summary.totalIssues}`);
      this.logger.info(`Critical Issues: ${issueReport.summary.criticalIssues}`);
      this.logger.info(`Warning Issues: ${issueReport.summary.warningIssues}`);
      this.logger.info(`Fixable Issues: ${issueReport.summary.fixableIssues}`);
      this.logger.info('');
      this.logger.info('Issues by Priority:');
      this.logger.info(`  Critical: ${categorized.critical.length}`);
      this.logger.info(`  High: ${categorized.high.length}`);
      this.logger.info(`  Medium: ${categorized.medium.length}`);
      this.logger.info(`  Low: ${categorized.low.length}`);
      this.logger.info('='.repeat(80));

      // Generate reports
      this.logger.info('Generating reports...');
      const reportPaths = await this.reportGenerator.generateCompleteReportPackage(issueReport);

      this.logger.info('');
      this.logger.info('Reports generated:');
      this.logger.info(`  Summary: ${reportPaths.summary}`);
      this.logger.info(`  Detailed: ${reportPaths.detailed}`);
      this.logger.info(`  CSV: ${reportPaths.csv}`);
      this.logger.info(`  JSON: ${reportPaths.json}`);

      return {
        success: true,
        issueReport,
        categorized,
        reportPaths
      };
    } catch (error) {
      this.logger.error('Audit failed', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const audit = new MainAudit({
    baseUrl: process.env.BASE_URL || 'https://scrapiz.com',
    sitemapPath: process.env.SITEMAP_PATH || 'public/sitemap.xml',
    includeSchemaValidation: process.env.INCLUDE_SCHEMA !== 'false',
    includeDuplicateDetection: process.env.INCLUDE_DUPLICATES !== 'false',
    includeInternalLinkScan: process.env.INCLUDE_LINK_SCAN !== 'false'
  });

  audit.runCompleteAudit()
    .then(result => {
      if (result.success) {
        console.log('\n✓ Audit completed successfully');
        process.exit(0);
      } else {
        console.error('\n✗ Audit failed:', result.error || result.message);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n✗ Audit failed with error:', error);
      process.exit(1);
    });
}

export default MainAudit;
