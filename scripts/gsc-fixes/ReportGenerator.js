import fs from 'fs/promises';
import path from 'path';
import { formatTimestamp, groupBy } from './utils.js';

/**
 * Report Generator Module
 * Generates comprehensive reports for GSC indexing issues
 */
class ReportGenerator {
  constructor(logger) {
    this.logger = logger;
    this.reportDir = path.join(process.cwd(), 'scripts/gsc-fixes/reports');
  }

  /**
   * Initialize report directory
   */
  async initialize() {
    try {
      await fs.mkdir(this.reportDir, { recursive: true });
      this.logger.info('Report directory initialized');
    } catch (error) {
      this.logger.error('Failed to initialize report directory', error);
      throw error;
    }
  }

  /**
   * Generates issue summary report
   * @param {Object} issueReport - Complete issue report
   * @returns {string} Formatted summary report
   */
  generateSummaryReport(issueReport) {
    const lines = [];
    
    lines.push('='.repeat(80));
    lines.push('GSC INDEXING ISSUES - SUMMARY REPORT');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Generated: ${formatTimestamp(issueReport.timestamp)}`);
    lines.push(`Total Pages Analyzed: ${issueReport.totalPages}`);
    lines.push('');
    
    // Overall summary
    lines.push('OVERALL SUMMARY');
    lines.push('-'.repeat(80));
    lines.push(`Total Issues: ${issueReport.summary.totalIssues}`);
    lines.push(`Critical Issues: ${issueReport.summary.criticalIssues}`);
    lines.push(`Warning Issues: ${issueReport.summary.warningIssues}`);
    lines.push(`Fixable Issues: ${issueReport.summary.fixableIssues}`);
    lines.push('');
    
    // Issues by type
    lines.push('ISSUES BY TYPE');
    lines.push('-'.repeat(80));
    
    const issueTypes = [
      { key: 'soft404', label: 'Soft 404 Errors' },
      { key: 'canonical', label: 'Canonical Tag Issues' },
      { key: 'redirects', label: 'Redirect Issues' },
      { key: 'noindex', label: 'Noindex Tag Issues' },
      { key: 'duplicates', label: 'Duplicate Content' },
      { key: 'crawled', label: 'Crawled But Not Indexed' },
      { key: 'discovered', label: 'Discovered But Not Indexed' },
      { key: 'notFound', label: '404 Not Found Errors' },
      { key: 'invalidSchema', label: 'Invalid Structured Data' }
    ];
    
    issueTypes.forEach(({ key, label }) => {
      const count = issueReport.issues[key]?.length || 0;
      if (count > 0) {
        lines.push(`${label}: ${count}`);
      }
    });
    
    lines.push('');
    lines.push('='.repeat(80));
    
    return lines.join('\n');
  }

  /**
   * Generates detailed issue report with recommendations
   * @param {Object} issueReport - Complete issue report
   * @returns {string} Detailed report with recommendations
   */
  generateDetailedReport(issueReport) {
    const lines = [];
    
    lines.push('='.repeat(80));
    lines.push('GSC INDEXING ISSUES - DETAILED REPORT');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Generated: ${formatTimestamp(issueReport.timestamp)}`);
    lines.push(`Total Pages Analyzed: ${issueReport.totalPages}`);
    lines.push('');
    
    // Soft 404 Issues
    if (issueReport.issues.soft404?.length > 0) {
      lines.push('');
      lines.push('SOFT 404 ERRORS');
      lines.push('='.repeat(80));
      lines.push(`Total: ${issueReport.issues.soft404.length}`);
      lines.push('');
      
      issueReport.issues.soft404.forEach((issue, index) => {
        lines.push(`${index + 1}. ${issue.url}`);
        lines.push(`   Reason: ${issue.reason}`);
        lines.push(`   Word Count: ${issue.wordCount}`);
        lines.push(`   Has Headings: ${issue.hasHeadings ? 'Yes' : 'No'}`);
        lines.push(`   Has Internal Links: ${issue.hasInternalLinks ? 'Yes' : 'No'}`);
        lines.push(`   Recommendation: ${issue.recommendation}`);
        lines.push(`   Fixable: ${issue.fixable ? 'Yes' : 'No'}`);
        lines.push('');
      });
    }
    
    // Canonical Issues
    if (issueReport.issues.canonical?.length > 0) {
      lines.push('');
      lines.push('CANONICAL TAG ISSUES');
      lines.push('='.repeat(80));
      lines.push(`Total: ${issueReport.issues.canonical.length}`);
      lines.push('');
      
      issueReport.issues.canonical.forEach((issue, index) => {
        lines.push(`${index + 1}. ${issue.url}`);
        lines.push(`   Issue Type: ${issue.issueType}`);
        lines.push(`   Current Canonical: ${issue.currentCanonical || 'None'}`);
        lines.push(`   Expected Canonical: ${issue.expectedCanonical}`);
        lines.push(`   In Sitemap: ${issue.inSitemap ? 'Yes' : 'No'}`);
        lines.push(`   Recommendation: ${issue.recommendation}`);
        lines.push(`   Fixable: ${issue.fixable ? 'Yes' : 'No'}`);
        lines.push('');
      });
    }
    
    // Redirect Issues
    if (issueReport.issues.redirects?.length > 0) {
      lines.push('');
      lines.push('REDIRECT ISSUES');
      lines.push('='.repeat(80));
      lines.push(`Total: ${issueReport.issues.redirects.length}`);
      lines.push('');
      
      issueReport.issues.redirects.forEach((issue, index) => {
        lines.push(`${index + 1}. ${issue.url}`);
        lines.push(`   Redirect Type: ${issue.redirectType}`);
        lines.push(`   Redirect Chain: ${issue.redirectChain.join(' → ')}`);
        lines.push(`   Final Destination: ${issue.finalDestination}`);
        lines.push(`   In Sitemap: ${issue.inSitemap ? 'Yes' : 'No'}`);
        lines.push(`   Internal Links Count: ${issue.internalLinksCount}`);
        lines.push(`   Recommendation: ${issue.recommendation}`);
        lines.push(`   Fixable: ${issue.fixable ? 'Yes' : 'No'}`);
        lines.push('');
      });
    }
    
    // Noindex Issues
    if (issueReport.issues.noindex?.length > 0) {
      lines.push('');
      lines.push('NOINDEX TAG ISSUES');
      lines.push('='.repeat(80));
      lines.push(`Total: ${issueReport.issues.noindex.length}`);
      lines.push('');
      
      issueReport.issues.noindex.forEach((issue, index) => {
        lines.push(`${index + 1}. ${issue.url}`);
        lines.push(`   Noindex Source: ${issue.noindexSource}`);
        lines.push(`   Should Be Indexed: ${issue.shouldBeIndexed ? 'Yes' : 'No'}`);
        lines.push(`   In Sitemap: ${issue.inSitemap ? 'Yes' : 'No'}`);
        lines.push(`   Has Backlinks: ${issue.hasBacklinks ? 'Yes' : 'No'}`);
        lines.push(`   Recommendation: ${issue.recommendation}`);
        lines.push(`   Fixable: ${issue.fixable ? 'Yes' : 'No'}`);
        lines.push('');
      });
    }
    
    // Duplicate Content Issues
    if (issueReport.issues.duplicates?.length > 0) {
      lines.push('');
      lines.push('DUPLICATE CONTENT ISSUES');
      lines.push('='.repeat(80));
      lines.push(`Total: ${issueReport.issues.duplicates.length}`);
      lines.push('');
      
      issueReport.issues.duplicates.forEach((issue, index) => {
        lines.push(`${index + 1}. ${issue.url}`);
        lines.push(`   Duplicate Of: ${issue.duplicateOf}`);
        lines.push(`   Similarity Score: ${(issue.similarityScore * 100).toFixed(1)}%`);
        lines.push(`   Has Canonical: ${issue.hasCanonical ? 'Yes' : 'No'}`);
        lines.push(`   Canonical Target: ${issue.canonicalTarget || 'None'}`);
        lines.push(`   Recommendation: ${issue.recommendation}`);
        lines.push(`   Fixable: ${issue.fixable ? 'Yes' : 'No'}`);
        lines.push('');
      });
    }
    
    // Crawled But Not Indexed
    if (issueReport.issues.crawled?.length > 0) {
      lines.push('');
      lines.push('CRAWLED BUT NOT INDEXED');
      lines.push('='.repeat(80));
      lines.push(`Total: ${issueReport.issues.crawled.length}`);
      lines.push('');
      
      issueReport.issues.crawled.forEach((issue, index) => {
        lines.push(`${index + 1}. ${issue.url}`);
        lines.push(`   Reason: ${issue.reason || 'Unknown'}`);
        lines.push(`   Recommendation: ${issue.recommendation || 'Review page quality'}`);
        lines.push('');
      });
    }
    
    // Discovered But Not Indexed
    if (issueReport.issues.discovered?.length > 0) {
      lines.push('');
      lines.push('DISCOVERED BUT NOT INDEXED');
      lines.push('='.repeat(80));
      lines.push(`Total: ${issueReport.issues.discovered.length}`);
      lines.push('');
      
      issueReport.issues.discovered.forEach((issue, index) => {
        lines.push(`${index + 1}. ${issue.url}`);
        lines.push(`   Reason: ${issue.reason || 'Unknown'}`);
        lines.push(`   Recommendation: ${issue.recommendation || 'Add to sitemap and improve internal linking'}`);
        lines.push('');
      });
    }
    
    // 404 Not Found Errors
    if (issueReport.issues.notFound?.length > 0) {
      lines.push('');
      lines.push('404 NOT FOUND ERRORS');
      lines.push('='.repeat(80));
      lines.push(`Total: ${issueReport.issues.notFound.length}`);
      lines.push('');
      
      issueReport.issues.notFound.forEach((issue, index) => {
        lines.push(`${index + 1}. ${issue.url}`);
        lines.push(`   Has Backlinks: ${issue.hasBacklinks ? 'Yes' : 'No'}`);
        lines.push(`   Internal Links Count: ${issue.internalLinksCount || 0}`);
        lines.push(`   Recommendation: ${issue.recommendation}`);
        lines.push(`   Fixable: ${issue.fixable ? 'Yes' : 'No'}`);
        lines.push('');
      });
    }
    
    // Invalid Structured Data
    if (issueReport.issues.invalidSchema?.length > 0) {
      lines.push('');
      lines.push('INVALID STRUCTURED DATA');
      lines.push('='.repeat(80));
      lines.push(`Total: ${issueReport.issues.invalidSchema.length}`);
      lines.push('');
      
      issueReport.issues.invalidSchema.forEach((issue, index) => {
        lines.push(`${index + 1}. ${issue.url}`);
        lines.push(`   Schema Type: ${issue.schemaType}`);
        lines.push(`   Errors:`);
        issue.errors.forEach(error => {
          lines.push(`     - ${error.field}: ${error.message} (${error.severity})`);
        });
        lines.push(`   Fixable: ${issue.fixable ? 'Yes' : 'No'}`);
        lines.push('');
      });
    }
    
    // Priority Recommendations
    lines.push('');
    lines.push('PRIORITY RECOMMENDATIONS');
    lines.push('='.repeat(80));
    lines.push('');
    
    const recommendations = this.generatePriorityRecommendations(issueReport);
    recommendations.forEach((rec, index) => {
      lines.push(`${index + 1}. [${rec.priority}] ${rec.title}`);
      lines.push(`   ${rec.description}`);
      lines.push(`   Affected URLs: ${rec.affectedCount}`);
      lines.push('');
    });
    
    lines.push('='.repeat(80));
    
    return lines.join('\n');
  }

  /**
   * Generate priority recommendations
   * @param {Object} issueReport - Complete issue report
   * @returns {Array<Object>} Priority recommendations
   */
  generatePriorityRecommendations(issueReport) {
    const recommendations = [];
    
    // Critical: 404 errors with backlinks
    const notFoundWithBacklinks = issueReport.issues.notFound?.filter(i => i.hasBacklinks) || [];
    if (notFoundWithBacklinks.length > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        title: 'Fix 404 errors with backlinks',
        description: 'These pages have external links pointing to them but return 404. Implement 301 redirects to preserve link equity.',
        affectedCount: notFoundWithBacklinks.length
      });
    }
    
    // Critical: Noindex on valuable pages
    const valuableNoindex = issueReport.issues.noindex?.filter(i => i.shouldBeIndexed) || [];
    if (valuableNoindex.length > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        title: 'Remove noindex from valuable pages',
        description: 'These pages have substantial content but are blocked from indexing by noindex tags.',
        affectedCount: valuableNoindex.length
      });
    }
    
    // Critical: Invalid schema markup
    if (issueReport.issues.invalidSchema?.length > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        title: 'Fix invalid structured data',
        description: 'Invalid schema markup prevents rich results in search. Fix missing required fields and format errors.',
        affectedCount: issueReport.issues.invalidSchema.length
      });
    }
    
    // High: Soft 404 errors
    if (issueReport.issues.soft404?.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        title: 'Resolve soft 404 errors',
        description: 'These pages return 200 status but have thin or low-quality content. Enhance content or implement proper 404 status.',
        affectedCount: issueReport.issues.soft404.length
      });
    }
    
    // High: Redirect chains
    const redirectChains = issueReport.issues.redirects?.filter(i => i.redirectChain.length > 2) || [];
    if (redirectChains.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        title: 'Flatten redirect chains',
        description: 'Multiple redirects waste crawl budget and slow page load. Implement direct redirects.',
        affectedCount: redirectChains.length
      });
    }
    
    // High: Missing canonical tags
    const missingCanonical = issueReport.issues.canonical?.filter(i => i.issueType === 'missing') || [];
    if (missingCanonical.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        title: 'Add missing canonical tags',
        description: 'Pages without canonical tags may have indexing issues. Add self-referencing canonical tags.',
        affectedCount: missingCanonical.length
      });
    }
    
    // Medium: Duplicate content
    if (issueReport.issues.duplicates?.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Resolve duplicate content',
        description: 'Implement canonical tags or 301 redirects to consolidate duplicate pages.',
        affectedCount: issueReport.issues.duplicates.length
      });
    }
    
    // Medium: Crawled but not indexed
    if (issueReport.issues.crawled?.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        title: 'Improve crawled but not indexed pages',
        description: 'Enhance content quality, add internal links, or consolidate with canonical tags.',
        affectedCount: issueReport.issues.crawled.length
      });
    }
    
    // Low: Discovered but not indexed
    if (issueReport.issues.discovered?.length > 0) {
      recommendations.push({
        priority: 'LOW',
        title: 'Optimize discovered pages',
        description: 'Add to sitemap and improve internal linking to help Google crawl these pages.',
        affectedCount: issueReport.issues.discovered.length
      });
    }
    
    return recommendations;
  }

  /**
   * Implement CSV export for issue tracking
   * @param {Object} issueReport - Complete issue report
   * @param {string} filename - Output filename
   * @returns {Promise<string>} Path to exported file
   */
  async exportToCSV(issueReport, filename = null) {
    if (!filename) {
      filename = `gsc-issues-${Date.now()}.csv`;
    }
    
    const filePath = path.join(this.reportDir, filename);
    const rows = [];
    
    // CSV Header
    rows.push([
      'Issue Type',
      'URL',
      'Status',
      'Priority',
      'Fixable',
      'Recommendation',
      'Details'
    ].join(','));
    
    // Helper to escape CSV values
    const escapeCSV = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    // Add soft 404 issues
    issueReport.issues.soft404?.forEach(issue => {
      rows.push([
        'Soft 404',
        escapeCSV(issue.url),
        escapeCSV(issue.reason),
        'HIGH',
        issue.fixable ? 'Yes' : 'No',
        escapeCSV(issue.recommendation),
        escapeCSV(`Word count: ${issue.wordCount}, Has headings: ${issue.hasHeadings}`)
      ].join(','));
    });
    
    // Add canonical issues
    issueReport.issues.canonical?.forEach(issue => {
      rows.push([
        'Canonical',
        escapeCSV(issue.url),
        escapeCSV(issue.issueType),
        issue.issueType === 'missing' ? 'HIGH' : 'MEDIUM',
        issue.fixable ? 'Yes' : 'No',
        escapeCSV(issue.recommendation),
        escapeCSV(`Current: ${issue.currentCanonical || 'None'}, Expected: ${issue.expectedCanonical}`)
      ].join(','));
    });
    
    // Add redirect issues
    issueReport.issues.redirects?.forEach(issue => {
      const priority = issue.redirectChain.length > 2 ? 'HIGH' : 'MEDIUM';
      rows.push([
        'Redirect',
        escapeCSV(issue.url),
        escapeCSV(`${issue.redirectType} redirect`),
        priority,
        issue.fixable ? 'Yes' : 'No',
        escapeCSV(issue.recommendation),
        escapeCSV(`Chain length: ${issue.redirectChain.length}, Final: ${issue.finalDestination}`)
      ].join(','));
    });
    
    // Add noindex issues
    issueReport.issues.noindex?.forEach(issue => {
      const priority = issue.shouldBeIndexed ? 'CRITICAL' : 'LOW';
      rows.push([
        'Noindex',
        escapeCSV(issue.url),
        escapeCSV(issue.noindexSource),
        priority,
        issue.fixable ? 'Yes' : 'No',
        escapeCSV(issue.recommendation),
        escapeCSV(`Should be indexed: ${issue.shouldBeIndexed}`)
      ].join(','));
    });
    
    // Add duplicate issues
    issueReport.issues.duplicates?.forEach(issue => {
      rows.push([
        'Duplicate',
        escapeCSV(issue.url),
        'Duplicate content',
        'MEDIUM',
        issue.fixable ? 'Yes' : 'No',
        escapeCSV(issue.recommendation),
        escapeCSV(`Duplicate of: ${issue.duplicateOf}, Similarity: ${(issue.similarityScore * 100).toFixed(1)}%`)
      ].join(','));
    });
    
    // Add 404 issues
    issueReport.issues.notFound?.forEach(issue => {
      const priority = issue.hasBacklinks ? 'CRITICAL' : 'MEDIUM';
      rows.push([
        '404 Not Found',
        escapeCSV(issue.url),
        '404',
        priority,
        issue.fixable ? 'Yes' : 'No',
        escapeCSV(issue.recommendation),
        escapeCSV(`Has backlinks: ${issue.hasBacklinks}, Internal links: ${issue.internalLinksCount || 0}`)
      ].join(','));
    });
    
    // Add schema issues
    issueReport.issues.invalidSchema?.forEach(issue => {
      const errorSummary = issue.errors.map(e => `${e.field}: ${e.message}`).join('; ');
      rows.push([
        'Invalid Schema',
        escapeCSV(issue.url),
        escapeCSV(issue.schemaType),
        'CRITICAL',
        issue.fixable ? 'Yes' : 'No',
        'Fix schema errors',
        escapeCSV(errorSummary)
      ].join(','));
    });
    
    // Add crawled issues
    issueReport.issues.crawled?.forEach(issue => {
      rows.push([
        'Crawled Not Indexed',
        escapeCSV(issue.url),
        escapeCSV(issue.reason || 'Unknown'),
        'MEDIUM',
        'Yes',
        escapeCSV(issue.recommendation || 'Review page quality'),
        ''
      ].join(','));
    });
    
    // Add discovered issues
    issueReport.issues.discovered?.forEach(issue => {
      rows.push([
        'Discovered Not Indexed',
        escapeCSV(issue.url),
        escapeCSV(issue.reason || 'Unknown'),
        'LOW',
        'Yes',
        escapeCSV(issue.recommendation || 'Add to sitemap'),
        ''
      ].join(','));
    });
    
    const csvContent = rows.join('\n');
    await fs.writeFile(filePath, csvContent, 'utf-8');
    
    this.logger.info(`CSV report exported to: ${filePath}`);
    return filePath;
  }

  /**
   * Implement JSON export for programmatic access
   * @param {Object} issueReport - Complete issue report
   * @param {string} filename - Output filename
   * @returns {Promise<string>} Path to exported file
   */
  async exportToJSON(issueReport, filename = null) {
    if (!filename) {
      filename = `gsc-issues-${Date.now()}.json`;
    }
    
    const filePath = path.join(this.reportDir, filename);
    const jsonContent = JSON.stringify(issueReport, null, 2);
    
    await fs.writeFile(filePath, jsonContent, 'utf-8');
    
    this.logger.info(`JSON report exported to: ${filePath}`);
    return filePath;
  }

  /**
   * Exports report to file
   * @param {string} report - Report content
   * @param {string} filename - Output filename
   * @returns {Promise<string>} Path to exported file
   */
  async exportReport(report, filename) {
    const filePath = path.join(this.reportDir, filename);
    await fs.writeFile(filePath, report, 'utf-8');
    
    this.logger.info(`Report exported to: ${filePath}`);
    return filePath;
  }

  /**
   * Generate complete report package (summary, detailed, CSV, JSON)
   * @param {Object} issueReport - Complete issue report
   * @param {string} baseFilename - Base filename for reports
   * @returns {Promise<Object>} Paths to all generated reports
   */
  async generateCompleteReportPackage(issueReport, baseFilename = null) {
    if (!baseFilename) {
      baseFilename = `gsc-report-${Date.now()}`;
    }
    
    this.logger.info('Generating complete report package...');
    
    // Generate all report formats
    const summaryReport = this.generateSummaryReport(issueReport);
    const detailedReport = this.generateDetailedReport(issueReport);
    
    // Export all formats
    const summaryPath = await this.exportReport(summaryReport, `${baseFilename}-summary.txt`);
    const detailedPath = await this.exportReport(detailedReport, `${baseFilename}-detailed.txt`);
    const csvPath = await this.exportToCSV(issueReport, `${baseFilename}.csv`);
    const jsonPath = await this.exportToJSON(issueReport, `${baseFilename}.json`);
    
    this.logger.info('Complete report package generated');
    
    return {
      summary: summaryPath,
      detailed: detailedPath,
      csv: csvPath,
      json: jsonPath
    };
  }
}

export default ReportGenerator;
