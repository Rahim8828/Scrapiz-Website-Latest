#!/usr/bin/env node

/**
 * Automated Fix Script
 * Applies all automated fixes for GSC indexing issues
 * 
 * Features:
 * - Dry-run mode for testing
 * - Automatic backups before applying fixes
 * - Comprehensive logging of all changes
 * - Fix summary report generation
 * - Rollback capability on errors
 * 
 * Usage:
 *   node scripts/gsc-fixes/apply-all-fixes.js [options]
 * 
 * Options:
 *   --dry-run              Run in dry-run mode (no actual changes)
 *   --no-backup            Skip backup creation (not recommended)
 *   --no-tracking          Skip fix tracking
 *   --batch-size <number>  Batch size for processing (default: 10)
 *   --audit-file <path>    Path to audit JSON file (optional)
 *   --help                 Show help
 */

import MainAudit from './audit-all-issues.js';
import FixExecutor from './FixExecutor.js';
import ReportGenerator from './ReportGenerator.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import fs from 'fs/promises';
import path from 'path';

class AutomatedFixScript {
  constructor(options = {}) {
    this.options = {
      dryRun: options.dryRun || false,
      createBackup: options.createBackup !== false,
      trackFixes: options.trackFixes !== false,
      batchSize: options.batchSize || 10,
      auditFile: options.auditFile || null,
      baseUrl: options.baseUrl || 'https://scrapiz.com',
      sitemapPath: options.sitemapPath || 'public/sitemap.xml',
      ...options
    };

    // Initialize logger and error handler
    this.logger = new Logger();
    this.errorHandler = new ErrorHandler(this.logger);

    // Initialize fix executor
    this.fixExecutor = new FixExecutor(this.logger, this.errorHandler);

    // Initialize report generator
    this.reportGenerator = new ReportGenerator(this.logger);

    // Initialize audit system
    this.audit = new MainAudit({
      baseUrl: this.options.baseUrl,
      sitemapPath: this.options.sitemapPath
    });
  }

  /**
   * Initialize the fix script
   */
  async initialize() {
    this.logger.info('Initializing automated fix script...');
    
    await this.fixExecutor.initialize();
    await this.reportGenerator.initialize();
    
    this.logger.info('Automated fix script initialized');
  }

  /**
   * Load issues from audit file or run new audit
   * @returns {Promise<Object>} Issue report
   */
  async loadOrRunAudit() {
    // If audit file is provided, load from file
    if (this.options.auditFile) {
      this.logger.info(`Loading issues from audit file: ${this.options.auditFile}`);
      
      try {
        const content = await fs.readFile(this.options.auditFile, 'utf-8');
        const issueReport = JSON.parse(content);
        
        this.logger.info(`Loaded ${issueReport.summary.totalIssues} issues from file`);
        return issueReport;
      } catch (error) {
        this.logger.error('Failed to load audit file', { error: error.message });
        throw new Error(`Failed to load audit file: ${error.message}`);
      }
    }

    // Otherwise, run a new audit
    this.logger.info('Running new audit to detect issues...');
    
    const auditResult = await this.audit.runCompleteAudit();
    
    if (!auditResult.success) {
      throw new Error(`Audit failed: ${auditResult.error || auditResult.message}`);
    }

    return auditResult.issueReport;
  }

  /**
   * Apply all fixes
   * @param {Object} issueReport - Issue report from audit
   * @returns {Promise<Object>} Fix results
   */
  async applyAllFixes(issueReport) {
    this.logger.info('='.repeat(80));
    this.logger.info('STARTING AUTOMATED FIX PROCESS');
    this.logger.info('='.repeat(80));
    this.logger.info(`Mode: ${this.options.dryRun ? 'DRY RUN' : 'LIVE'}`);
    this.logger.info(`Backup: ${this.options.createBackup ? 'Enabled' : 'Disabled'}`);
    this.logger.info(`Tracking: ${this.options.trackFixes ? 'Enabled' : 'Disabled'}`);
    this.logger.info(`Batch Size: ${this.options.batchSize}`);
    this.logger.info('='.repeat(80));
    this.logger.info('');

    // Execute all fixes using FixExecutor
    const fixResults = await this.fixExecutor.executeAllFixes(issueReport.issues, {
      dryRun: this.options.dryRun,
      batchSize: this.options.batchSize,
      createBackup: this.options.createBackup,
      trackFixes: this.options.trackFixes
    });

    return fixResults;
  }

  /**
   * Generate fix summary report
   * @param {Object} issueReport - Original issue report
   * @param {Object} fixResults - Fix execution results
   * @returns {string} Summary report
   */
  generateFixSummary(issueReport, fixResults) {
    const lines = [];

    lines.push('='.repeat(80));
    lines.push('AUTOMATED FIX SUMMARY');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Execution ID: ${fixResults.executionId}`);
    lines.push(`Timestamp: ${fixResults.timestamp}`);
    lines.push(`Mode: ${fixResults.dryRun ? 'DRY RUN' : 'LIVE'}`);
    lines.push(`Duration: ${(fixResults.duration / 1000).toFixed(2)}s`);
    lines.push('');

    // Overall summary
    lines.push('OVERALL RESULTS');
    lines.push('-'.repeat(80));
    lines.push(`Total Issues: ${fixResults.totalIssues}`);
    lines.push(`Issues Fixed: ${fixResults.summary.totalFixed}`);
    lines.push(`Issues Failed: ${fixResults.summary.totalFailed}`);
    lines.push(`Issues Skipped: ${fixResults.summary.totalSkipped}`);
    lines.push('');

    // Success rate
    const successRate = fixResults.totalIssues > 0
      ? ((fixResults.summary.totalFixed / fixResults.totalIssues) * 100).toFixed(1)
      : 0;
    lines.push(`Success Rate: ${successRate}%`);
    lines.push('');

    // Results by type
    lines.push('RESULTS BY ISSUE TYPE');
    lines.push('-'.repeat(80));

    const issueTypes = [
      { key: 'soft404', label: 'Soft 404 Errors' },
      { key: 'canonical', label: 'Canonical Tag Issues' },
      { key: 'redirects', label: 'Redirect Issues' },
      { key: 'noindex', label: 'Noindex Tag Issues' },
      { key: 'duplicates', label: 'Duplicate Content' },
      { key: 'notFound', label: '404 Not Found Errors' },
      { key: 'schema', label: 'Invalid Structured Data' }
    ];

    issueTypes.forEach(({ key, label }) => {
      if (fixResults.results[key]) {
        const result = fixResults.results[key];
        lines.push(`${label}:`);
        lines.push(`  Fixed: ${result.issuesFixed || 0}`);
        lines.push(`  Failed: ${result.issuesFailed || 0}`);
        lines.push(`  Skipped: ${result.issuesSkipped || 0}`);
        lines.push('');
      }
    });

    // Backup information
    if (fixResults.masterBackupPath) {
      lines.push('BACKUP INFORMATION');
      lines.push('-'.repeat(80));
      lines.push(`Master Backup: ${fixResults.masterBackupPath}`);
      lines.push('');
      lines.push('To rollback all changes, run:');
      lines.push(`  node scripts/gsc-fixes/rollback-fixes.js ${fixResults.executionId}`);
      lines.push('');
    }

    // .htaccess updates
    if (fixResults.htaccessUpdated) {
      lines.push('HTACCESS UPDATES');
      lines.push('-'.repeat(80));
      lines.push(`Status: ${fixResults.htaccessUpdated ? 'Updated' : 'Failed'}`);
      lines.push(`Path: ${fixResults.htaccessPath || 'N/A'}`);
      
      // Count redirect rules
      let totalRedirectRules = 0;
      if (fixResults.results.redirects?.redirectRules) {
        totalRedirectRules += fixResults.results.redirects.redirectRules.length;
      }
      if (fixResults.results.notFound?.redirectRules) {
        totalRedirectRules += fixResults.results.notFound.redirectRules.length;
      }
      
      lines.push(`Redirect Rules Added: ${totalRedirectRules}`);
      lines.push('');
    }

    // Next steps
    lines.push('NEXT STEPS');
    lines.push('-'.repeat(80));
    
    if (fixResults.dryRun) {
      lines.push('This was a DRY RUN. No actual changes were made.');
      lines.push('');
      lines.push('To apply fixes for real, run:');
      lines.push('  node scripts/gsc-fixes/apply-all-fixes.js');
      lines.push('');
    } else {
      lines.push('1. Review the fix details in the generated reports');
      lines.push('2. Test sample pages in your browser');
      lines.push('3. Validate sitemap in Google Search Console');
      lines.push('4. Test redirects to ensure they work correctly');
      lines.push('5. Verify schema markup with Google Rich Results Test');
      lines.push('6. Request re-indexing for fixed pages in GSC');
      lines.push('');
      
      if (fixResults.summary.totalFailed > 0) {
        lines.push('⚠ Some fixes failed. Review the detailed report for manual actions required.');
        lines.push('');
      }
      
      if (fixResults.summary.totalSkipped > 0) {
        lines.push('ℹ Some issues were skipped. Review the detailed report for reasons.');
        lines.push('');
      }
    }

    lines.push('='.repeat(80));

    return lines.join('\n');
  }

  /**
   * Generate detailed fix report
   * @param {Object} fixResults - Fix execution results
   * @returns {string} Detailed report
   */
  generateDetailedFixReport(fixResults) {
    const lines = [];

    lines.push('='.repeat(80));
    lines.push('DETAILED FIX REPORT');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Execution ID: ${fixResults.executionId}`);
    lines.push(`Timestamp: ${fixResults.timestamp}`);
    lines.push('');

    // Iterate through each issue type
    for (const [issueType, result] of Object.entries(fixResults.results)) {
      if (!result || !result.details) continue;

      lines.push('');
      lines.push(`${issueType.toUpperCase()} FIXES`);
      lines.push('='.repeat(80));
      lines.push(`Total: ${result.totalIssues || result.details.length}`);
      lines.push(`Fixed: ${result.issuesFixed || 0}`);
      lines.push(`Failed: ${result.issuesFailed || 0}`);
      lines.push(`Skipped: ${result.issuesSkipped || 0}`);
      lines.push('');

      // List each fix detail
      result.details.forEach((detail, index) => {
        lines.push(`${index + 1}. ${detail.url}`);
        lines.push(`   Status: ${detail.status}`);
        lines.push(`   Message: ${detail.message}`);
        
        if (detail.redirectRule) {
          lines.push(`   Redirect: ${detail.redirectRule.from} → ${detail.redirectRule.to}`);
        }
        
        if (detail.canonicalUrl) {
          lines.push(`   Canonical: ${detail.canonicalUrl}`);
        }
        
        if (detail.backupPath) {
          lines.push(`   Backup: ${detail.backupPath}`);
        }
        
        lines.push('');
      });
    }

    lines.push('='.repeat(80));

    return lines.join('\n');
  }

  /**
   * Save fix reports
   * @param {Object} issueReport - Original issue report
   * @param {Object} fixResults - Fix execution results
   * @returns {Promise<Object>} Report paths
   */
  async saveFixReports(issueReport, fixResults) {
    this.logger.info('Generating fix reports...');

    const timestamp = Date.now();
    const baseFilename = `fix-${fixResults.dryRun ? 'dryrun-' : ''}${timestamp}`;

    // Generate summary report
    const summaryReport = this.generateFixSummary(issueReport, fixResults);
    const summaryPath = await this.reportGenerator.exportReport(
      summaryReport,
      `${baseFilename}-summary.txt`
    );

    // Generate detailed report
    const detailedReport = this.generateDetailedFixReport(fixResults);
    const detailedPath = await this.reportGenerator.exportReport(
      detailedReport,
      `${baseFilename}-detailed.txt`
    );

    // Save fix results as JSON
    const jsonPath = await this.reportGenerator.exportToJSON(
      fixResults,
      `${baseFilename}-results.json`
    );

    this.logger.info('Fix reports generated:');
    this.logger.info(`  Summary: ${summaryPath}`);
    this.logger.info(`  Detailed: ${detailedPath}`);
    this.logger.info(`  JSON: ${jsonPath}`);

    return {
      summary: summaryPath,
      detailed: detailedPath,
      json: jsonPath
    };
  }

  /**
   * Run the complete automated fix process
   * @returns {Promise<Object>} Results
   */
  async run() {
    try {
      // Initialize
      await this.initialize();

      // Load or run audit
      const issueReport = await this.loadOrRunAudit();

      // Check if there are any issues to fix
      if (issueReport.summary.totalIssues === 0) {
        this.logger.info('No issues found to fix!');
        return {
          success: true,
          message: 'No issues found to fix'
        };
      }

      // Apply all fixes
      const fixResults = await this.applyAllFixes(issueReport);

      // Save fix reports
      const reportPaths = await this.saveFixReports(issueReport, fixResults);

      // Print summary to console
      const summaryReport = this.generateFixSummary(issueReport, fixResults);
      console.log('\n' + summaryReport);

      return {
        success: true,
        issueReport,
        fixResults,
        reportPaths
      };
    } catch (error) {
      this.logger.error('Automated fix process failed', { 
        error: error.message, 
        stack: error.stack 
      });
      
      console.error('\n✗ Fix process failed:', error.message);
      
      return {
        success: false,
        error: error.message
      };
    }
  }
}

/**
 * Parse command line arguments
 * @returns {Object} Parsed options
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: false,
    createBackup: true,
    trackFixes: true,
    batchSize: 10,
    auditFile: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--dry-run':
        options.dryRun = true;
        break;

      case '--no-backup':
        options.createBackup = false;
        break;

      case '--no-tracking':
        options.trackFixes = false;
        break;

      case '--batch-size':
        options.batchSize = parseInt(args[++i], 10);
        break;

      case '--audit-file':
        options.auditFile = args[++i];
        break;

      case '--help':
      case '-h':
        console.log(`
Automated Fix Script - Apply all GSC indexing fixes

Usage:
  node scripts/gsc-fixes/apply-all-fixes.js [options]

Options:
  --dry-run              Run in dry-run mode (no actual changes)
  --no-backup            Skip backup creation (not recommended)
  --no-tracking          Skip fix tracking
  --batch-size <number>  Batch size for processing (default: 10)
  --audit-file <path>    Path to audit JSON file (optional)
  --help, -h             Show this help message

Examples:
  # Run in dry-run mode to see what would be fixed
  node scripts/gsc-fixes/apply-all-fixes.js --dry-run

  # Apply fixes with default settings
  node scripts/gsc-fixes/apply-all-fixes.js

  # Apply fixes using existing audit file
  node scripts/gsc-fixes/apply-all-fixes.js --audit-file reports/audit.json

  # Apply fixes with custom batch size
  node scripts/gsc-fixes/apply-all-fixes.js --batch-size 5
        `);
        process.exit(0);
        break;

      default:
        console.error(`Unknown option: ${arg}`);
        console.error('Use --help for usage information');
        process.exit(1);
    }
  }

  return options;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs();
  
  const fixScript = new AutomatedFixScript(options);

  fixScript.run()
    .then(result => {
      if (result.success) {
        console.log('\n✓ Automated fix process completed successfully');
        process.exit(0);
      } else {
        console.error('\n✗ Automated fix process failed:', result.error || result.message);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n✗ Automated fix process failed with error:', error);
      process.exit(1);
    });
}

export default AutomatedFixScript;
