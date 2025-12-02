import fs from 'fs/promises';
import path from 'path';
import Soft404Fixer from './Soft404Fixer.js';
import CanonicalFixer from './CanonicalFixer.js';
import RedirectFixer from './RedirectFixer.js';
import NoindexFixer from './NoindexFixer.js';
import NotFoundFixer from './NotFoundFixer.js';
import SchemaFixer from './SchemaFixer.js';

/**
 * Fix Executor Orchestrator
 * Coordinates all fixers with backup, rollback, fix tracking, and batch processing
 */
class FixExecutor {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    
    // Initialize all fixers
    this.soft404Fixer = new Soft404Fixer(logger, errorHandler);
    this.canonicalFixer = new CanonicalFixer(logger, errorHandler);
    this.redirectFixer = new RedirectFixer(logger, errorHandler);
    this.noindexFixer = new NoindexFixer(logger, errorHandler);
    this.notFoundFixer = new NotFoundFixer(logger, errorHandler);
    this.schemaFixer = new SchemaFixer(logger, errorHandler);
    
    // Fix tracking
    this.fixHistory = [];
    this.fixTrackingFile = path.join(process.cwd(), 'scripts/gsc-fixes/fix-tracking.json');
  }

  /**
   * Initialize fix executor
   */
  async initialize() {
    try {
      // Load existing fix history
      await this.loadFixHistory();
      this.logger.info('Fix executor initialized');
    } catch (error) {
      this.logger.error('Failed to initialize fix executor', { error: error.message });
      throw error;
    }
  }

  /**
   * Execute all fixes for detected issues
   * @param {Object} issues - Issues object from IssueDetector
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Comprehensive fix result
   */
  async executeAllFixes(issues, options = {}) {
    const {
      dryRun = false,
      batchSize = 10,
      createBackup = true,
      trackFixes = true
    } = options;

    this.logger.info(`Starting fix execution (dry run: ${dryRun}, batch size: ${batchSize})`);

    const startTime = Date.now();
    const executionId = `fix-${startTime}`;

    // Create master backup if requested
    let masterBackupPath = null;
    if (createBackup && !dryRun) {
      masterBackupPath = await this.createMasterBackup();
    }

    const results = {
      executionId,
      timestamp: new Date().toISOString(),
      dryRun,
      masterBackupPath,
      totalIssues: this.countTotalIssues(issues),
      results: {},
      summary: {
        totalFixed: 0,
        totalFailed: 0,
        totalSkipped: 0
      },
      duration: 0
    };

    try {
      // Fix soft 404 issues
      if (issues.soft404 && issues.soft404.length > 0) {
        this.logger.info(`Processing ${issues.soft404.length} soft 404 issues`);
        results.results.soft404 = await this.executeBatchFixes(
          'soft404',
          issues.soft404,
          (batch, opts) => this.soft404Fixer.fixSoft404Issues(batch, opts),
          { ...options, batchSize }
        );
      }

      // Fix canonical issues
      if (issues.canonical && issues.canonical.length > 0) {
        this.logger.info(`Processing ${issues.canonical.length} canonical issues`);
        results.results.canonical = await this.executeBatchFixes(
          'canonical',
          issues.canonical,
          (batch, opts) => this.canonicalFixer.fixCanonicalIssues(batch, opts),
          { ...options, batchSize }
        );
      }

      // Fix redirect issues
      if (issues.redirects && issues.redirects.length > 0) {
        this.logger.info(`Processing ${issues.redirects.length} redirect issues`);
        results.results.redirects = await this.executeBatchFixes(
          'redirects',
          issues.redirects,
          (batch, opts) => this.redirectFixer.fixRedirectIssues(batch, opts),
          { ...options, batchSize }
        );
      }

      // Fix noindex issues
      if (issues.noindex && issues.noindex.length > 0) {
        this.logger.info(`Processing ${issues.noindex.length} noindex issues`);
        results.results.noindex = await this.executeBatchFixes(
          'noindex',
          issues.noindex,
          (batch, opts) => this.noindexFixer.fixNoindexIssues(batch, opts),
          { ...options, batchSize }
        );
      }

      // Fix duplicate content issues
      if (issues.duplicates && issues.duplicates.length > 0) {
        this.logger.info(`Processing ${issues.duplicates.length} duplicate content issues`);
        results.results.duplicates = await this.executeBatchFixes(
          'duplicates',
          issues.duplicates,
          (batch, opts) => this.canonicalFixer.fixDuplicateContent(batch, opts.dryRun),
          { ...options, batchSize }
        );
      }

      // Fix 404 issues
      if (issues.notFound && issues.notFound.length > 0) {
        this.logger.info(`Processing ${issues.notFound.length} 404 issues`);
        results.results.notFound = await this.executeBatchFixes(
          'notFound',
          issues.notFound,
          (batch, opts) => this.notFoundFixer.fix404Issues(batch, opts),
          { ...options, batchSize }
        );
      }

      // Fix schema issues
      if (issues.invalidSchema && issues.invalidSchema.length > 0) {
        this.logger.info(`Processing ${issues.invalidSchema.length} schema issues`);
        results.results.schema = await this.fixSchemaIssues(
          issues.invalidSchema,
          { ...options, batchSize }
        );
      }

      // Calculate summary
      results.summary = this.calculateSummary(results.results);
      results.duration = Date.now() - startTime;

      // Track fixes if requested
      if (trackFixes && !dryRun) {
        await this.trackFixExecution(results);
      }

      this.logger.info(`Fix execution complete: ${results.summary.totalFixed} fixed, ${results.summary.totalFailed} failed, ${results.summary.totalSkipped} skipped (${results.duration}ms)`);

      return results;
    } catch (error) {
      this.logger.error('Fix execution failed', { error: error.message });

      // Attempt rollback if master backup exists
      if (masterBackupPath && !dryRun) {
        this.logger.warn('Attempting to rollback all changes...');
        await this.rollbackMasterBackup(masterBackupPath);
      }

      throw error;
    }
  }

  /**
   * Execute fixes in batches
   * @param {string} issueType - Type of issue
   * @param {Array} issues - Array of issues
   * @param {Function} fixerFunction - Fixer function to call
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Batch fix result
   */
  async executeBatchFixes(issueType, issues, fixerFunction, options = {}) {
    const { batchSize = 10, dryRun = false } = options;

    const batchResults = {
      issueType,
      totalIssues: issues.length,
      batches: [],
      issuesFixed: 0,
      issuesFailed: 0,
      issuesSkipped: 0
    };

    // Split issues into batches
    const batches = this.createBatches(issues, batchSize);
    this.logger.info(`Processing ${batches.length} batches for ${issueType}`);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      this.logger.info(`Processing batch ${i + 1}/${batches.length} (${batch.length} issues)`);

      try {
        const batchResult = await fixerFunction(batch, options);

        batchResults.batches.push({
          batchNumber: i + 1,
          batchSize: batch.length,
          result: batchResult
        });

        // Aggregate results
        batchResults.issuesFixed += batchResult.issuesFixed || 0;
        batchResults.issuesFailed += batchResult.issuesFailed || 0;

        // Count skipped issues
        if (batchResult.details) {
          const skipped = batchResult.details.filter(d => 
            d.status === 'skipped' || d.status === 'manual-action-required'
          ).length;
          batchResults.issuesSkipped += skipped;
        }

        this.logger.info(`Batch ${i + 1} complete: ${batchResult.issuesFixed} fixed, ${batchResult.issuesFailed} failed`);
      } catch (error) {
        this.logger.error(`Batch ${i + 1} failed`, { error: error.message });
        batchResults.issuesFailed += batch.length;
        batchResults.batches.push({
          batchNumber: i + 1,
          batchSize: batch.length,
          error: error.message
        });
      }
    }

    return batchResults;
  }

  /**
   * Fix schema issues (special handling)
   * @param {Array} schemaIssues - Array of schema issues
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Schema fix result
   */
  async fixSchemaIssues(schemaIssues, options = {}) {
    const { dryRun = false } = options;

    this.logger.info(`Fixing ${schemaIssues.length} schema issues`);

    const results = {
      issueType: 'schema',
      totalIssues: schemaIssues.length,
      issuesFixed: 0,
      issuesFailed: 0,
      issuesSkipped: 0,
      details: []
    };

    for (const issue of schemaIssues) {
      try {
        // Find source file for the URL
        const filePath = await this.findSourceFileForUrl(issue.url);

        if (!filePath) {
          results.issuesSkipped++;
          results.details.push({
            url: issue.url,
            status: 'skipped',
            message: 'Could not find source file'
          });
          continue;
        }

        if (dryRun) {
          results.issuesSkipped++;
          results.details.push({
            url: issue.url,
            status: 'dry-run',
            message: `Would fix schema in ${filePath}`
          });
          continue;
        }

        const fixResult = await this.schemaFixer.fixSchemaIssue(issue, filePath);

        if (fixResult.success) {
          results.issuesFixed++;
        } else {
          results.issuesFailed++;
        }

        results.details.push({
          url: issue.url,
          status: fixResult.success ? 'fixed' : 'failed',
          message: fixResult.message
        });
      } catch (error) {
        results.issuesFailed++;
        results.details.push({
          url: issue.url,
          status: 'failed',
          message: error.message
        });
      }
    }

    return results;
  }

  /**
   * Create batches from array
   * @param {Array} items - Items to batch
   * @param {number} batchSize - Size of each batch
   * @returns {Array<Array>} Array of batches
   */
  createBatches(items, batchSize) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Count total issues
   * @param {Object} issues - Issues object
   * @returns {number} Total issue count
   */
  countTotalIssues(issues) {
    let total = 0;
    for (const key in issues) {
      if (Array.isArray(issues[key])) {
        total += issues[key].length;
      }
    }
    return total;
  }

  /**
   * Calculate summary from results
   * @param {Object} results - Results object
   * @returns {Object} Summary
   */
  calculateSummary(results) {
    const summary = {
      totalFixed: 0,
      totalFailed: 0,
      totalSkipped: 0,
      byType: {}
    };

    for (const [type, result] of Object.entries(results)) {
      summary.totalFixed += result.issuesFixed || 0;
      summary.totalFailed += result.issuesFailed || 0;
      summary.totalSkipped += result.issuesSkipped || 0;

      summary.byType[type] = {
        fixed: result.issuesFixed || 0,
        failed: result.issuesFailed || 0,
        skipped: result.issuesSkipped || 0
      };
    }

    return summary;
  }

  /**
   * Create master backup of critical files
   * @returns {Promise<string>} Backup directory path
   */
  async createMasterBackup() {
    const timestamp = Date.now();
    const backupDir = path.join(process.cwd(), 'scripts/gsc-fixes/backups', `master-${timestamp}`);

    try {
      await fs.mkdir(backupDir, { recursive: true });

      // Files to backup
      const filesToBackup = [
        'public/.htaccess',
        'public/sitemap.xml',
        'public/robots.txt'
      ];

      for (const file of filesToBackup) {
        const sourcePath = path.join(process.cwd(), file);
        const destPath = path.join(backupDir, path.basename(file));

        try {
          await fs.copyFile(sourcePath, destPath);
          this.logger.info(`Backed up: ${file}`);
        } catch (error) {
          // File might not exist, that's okay
          this.logger.warn(`Could not backup ${file}: ${error.message}`);
        }
      }

      this.logger.info(`Master backup created: ${backupDir}`);
      return backupDir;
    } catch (error) {
      this.logger.error('Failed to create master backup', { error: error.message });
      throw error;
    }
  }

  /**
   * Rollback from master backup
   * @param {string} backupDir - Backup directory path
   * @returns {Promise<void>}
   */
  async rollbackMasterBackup(backupDir) {
    try {
      const files = await fs.readdir(backupDir);

      for (const file of files) {
        const sourcePath = path.join(backupDir, file);
        const destPath = path.join(process.cwd(), 'public', file);

        await fs.copyFile(sourcePath, destPath);
        this.logger.info(`Restored: ${file}`);
      }

      this.logger.info('Master backup rollback complete');
    } catch (error) {
      this.logger.error('Failed to rollback master backup', { error: error.message });
      throw error;
    }
  }

  /**
   * Track fix execution
   * @param {Object} results - Fix execution results
   * @returns {Promise<void>}
   */
  async trackFixExecution(results) {
    try {
      const fixRecord = {
        executionId: results.executionId,
        timestamp: results.timestamp,
        summary: results.summary,
        duration: results.duration,
        masterBackupPath: results.masterBackupPath
      };

      this.fixHistory.push(fixRecord);

      // Save to file
      await this.saveFixHistory();

      this.logger.info(`Fix execution tracked: ${results.executionId}`);
    } catch (error) {
      this.logger.error('Failed to track fix execution', { error: error.message });
    }
  }

  /**
   * Load fix history from file
   * @returns {Promise<void>}
   */
  async loadFixHistory() {
    try {
      const content = await fs.readFile(this.fixTrackingFile, 'utf-8');
      this.fixHistory = JSON.parse(content);
      this.logger.info(`Loaded ${this.fixHistory.length} fix history records`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, start with empty history
        this.fixHistory = [];
        this.logger.info('No existing fix history found, starting fresh');
      } else {
        this.logger.error('Failed to load fix history', { error: error.message });
        this.fixHistory = [];
      }
    }
  }

  /**
   * Save fix history to file
   * @returns {Promise<void>}
   */
  async saveFixHistory() {
    try {
      const content = JSON.stringify(this.fixHistory, null, 2);
      await fs.writeFile(this.fixTrackingFile, content, 'utf-8');
      this.logger.info('Fix history saved');
    } catch (error) {
      this.logger.error('Failed to save fix history', { error: error.message });
      throw error;
    }
  }

  /**
   * Get fix history
   * @param {Object} filters - Optional filters
   * @returns {Array} Filtered fix history
   */
  getFixHistory(filters = {}) {
    let history = [...this.fixHistory];

    if (filters.since) {
      const sinceDate = new Date(filters.since);
      history = history.filter(record => 
        new Date(record.timestamp) >= sinceDate
      );
    }

    if (filters.executionId) {
      history = history.filter(record => 
        record.executionId === filters.executionId
      );
    }

    return history;
  }

  /**
   * Get fix statistics
   * @returns {Object} Fix statistics
   */
  getFixStatistics() {
    const stats = {
      totalExecutions: this.fixHistory.length,
      totalFixed: 0,
      totalFailed: 0,
      totalSkipped: 0,
      averageDuration: 0,
      byType: {}
    };

    let totalDuration = 0;

    this.fixHistory.forEach(record => {
      stats.totalFixed += record.summary.totalFixed || 0;
      stats.totalFailed += record.summary.totalFailed || 0;
      stats.totalSkipped += record.summary.totalSkipped || 0;
      totalDuration += record.duration || 0;

      // Aggregate by type
      if (record.summary.byType) {
        for (const [type, typeSummary] of Object.entries(record.summary.byType)) {
          if (!stats.byType[type]) {
            stats.byType[type] = { fixed: 0, failed: 0, skipped: 0 };
          }
          stats.byType[type].fixed += typeSummary.fixed || 0;
          stats.byType[type].failed += typeSummary.failed || 0;
          stats.byType[type].skipped += typeSummary.skipped || 0;
        }
      }
    });

    stats.averageDuration = this.fixHistory.length > 0 
      ? Math.round(totalDuration / this.fixHistory.length) 
      : 0;

    return stats;
  }

  /**
   * Find source file for URL
   * @param {string} url - URL to find source for
   * @returns {Promise<string|null>} File path or null
   */
  async findSourceFileForUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      // Use canonical fixer's file finding logic
      return await this.canonicalFixer.findSourceFile(url);
    } catch (error) {
      this.logger.error(`Error finding source file for ${url}`, { error: error.message });
      return null;
    }
  }

  /**
   * Rollback specific fix execution
   * @param {string} executionId - Execution ID to rollback
   * @returns {Promise<Object>} Rollback result
   */
  async rollbackFixExecution(executionId) {
    try {
      const record = this.fixHistory.find(r => r.executionId === executionId);

      if (!record) {
        return {
          success: false,
          message: `Execution ${executionId} not found in history`
        };
      }

      if (!record.masterBackupPath) {
        return {
          success: false,
          message: `No backup found for execution ${executionId}`
        };
      }

      await this.rollbackMasterBackup(record.masterBackupPath);

      return {
        success: true,
        message: `Successfully rolled back execution ${executionId}`,
        backupPath: record.masterBackupPath
      };
    } catch (error) {
      this.logger.error(`Failed to rollback execution ${executionId}`, { error: error.message });
      return {
        success: false,
        message: `Rollback failed: ${error.message}`
      };
    }
  }
}

export default FixExecutor;
