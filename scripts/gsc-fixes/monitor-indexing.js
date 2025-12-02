#!/usr/bin/env node

/**
 * Monitoring Script
 * Tracks indexing status over time, compares with previous audits,
 * generates trend reports, and sets up alerts for critical issues
 */

import MainAudit from './audit-all-issues.js';
import MonitoringService from './MonitoringService.js';
import Logger from './logger.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * Main Monitoring Class
 * Orchestrates audit execution, comparison, trend analysis, and alerting
 */
class IndexingMonitor {
  constructor(options = {}) {
    this.options = {
      baseUrl: options.baseUrl || 'https://scrapiz.com',
      sitemapPath: options.sitemapPath || 'public/sitemap.xml',
      includeSchemaValidation: options.includeSchemaValidation !== false,
      includeDuplicateDetection: options.includeDuplicateDetection !== false,
      includeInternalLinkScan: options.includeInternalLinkScan !== false,
      trendLimit: options.trendLimit || 10,
      ...options
    };

    this.logger = new Logger();
    this.audit = new MainAudit(this.options);
    this.monitoring = new MonitoringService(this.logger);
    this.reportsDir = path.join(process.cwd(), 'scripts/gsc-fixes/reports');
  }

  /**
   * Initialize monitoring system
   */
  async initialize() {
    this.logger.info('Initializing monitoring system...');
    await this.monitoring.initialize();
    this.logger.info('Monitoring system initialized');
  }

  /**
   * Run monitoring workflow
   * @returns {Promise<Object>} Monitoring results
   */
  async runMonitoring() {
    try {
      await this.initialize();

      this.logger.info('='.repeat(80));
      this.logger.info('STARTING INDEXING MONITORING');
      this.logger.info('='.repeat(80));
      this.logger.info('');

      // Step 1: Run current audit
      this.logger.info('Step 1: Running current audit...');
      const auditResult = await this.audit.runCompleteAudit();

      if (!auditResult.success) {
        throw new Error(auditResult.error || auditResult.message);
      }

      const currentAudit = auditResult.issueReport;
      this.logger.info('✓ Current audit completed');
      this.logger.info('');

      // Step 2: Save audit to history
      this.logger.info('Step 2: Saving audit to history...');
      const historyPath = await this.monitoring.saveAuditHistory(currentAudit);
      this.logger.info(`✓ Audit saved to history: ${historyPath}`);
      this.logger.info('');

      // Step 3: Get previous audit for comparison
      this.logger.info('Step 3: Loading previous audit for comparison...');
      const history = await this.monitoring.getAuditHistory();
      const previousAudit = history.length > 1 ? history[1] : null; // Get second most recent (first is current)
      
      if (previousAudit) {
        this.logger.info(`✓ Previous audit found from ${new Date(previousAudit.timestampMs).toISOString()}`);
      } else {
        this.logger.info('ℹ No previous audit found - this is the first audit');
      }
      this.logger.info('');

      // Step 4: Compare with previous audit
      this.logger.info('Step 4: Comparing with previous audit...');
      const comparison = await this.monitoring.compareAudits(
        { ...currentAudit, timestampMs: Date.now() },
        previousAudit
      );
      this.logger.info('✓ Comparison completed');
      this.logger.info('');

      // Step 5: Generate trend report
      this.logger.info('Step 5: Generating trend report...');
      const trendReport = await this.monitoring.generateTrendReport(this.options.trendLimit);
      this.logger.info('✓ Trend report generated');
      this.logger.info('');

      // Step 6: Check for alerts
      this.logger.info('Step 6: Checking for critical issues and alerts...');
      const alerts = await this.monitoring.checkForAlerts(
        { ...currentAudit, timestampMs: Date.now() },
        comparison
      );
      
      if (alerts.length > 0) {
        this.logger.warn(`⚠ ${alerts.length} alert(s) generated`);
        alerts.forEach(alert => {
          const prefix = alert.severity === 'critical' ? '🔴' : '🟡';
          this.logger.warn(`${prefix} [${alert.severity.toUpperCase()}] ${alert.message}`);
        });
      } else {
        this.logger.info('✓ No alerts - all metrics within acceptable ranges');
      }
      this.logger.info('');

      // Step 7: Generate monitoring reports
      this.logger.info('Step 7: Generating monitoring reports...');
      const reportPaths = await this.generateMonitoringReports(
        currentAudit,
        comparison,
        trendReport,
        alerts
      );
      this.logger.info('✓ Monitoring reports generated');
      this.logger.info('');

      // Display summary
      this.displaySummary(currentAudit, comparison, trendReport, alerts);

      // Display report paths
      this.logger.info('');
      this.logger.info('MONITORING REPORTS GENERATED:');
      this.logger.info('-'.repeat(80));
      this.logger.info(`Comparison Report: ${reportPaths.comparison}`);
      this.logger.info(`Trend Report: ${reportPaths.trend}`);
      this.logger.info(`Alerts Report: ${reportPaths.alerts}`);
      this.logger.info(`Full Monitoring Report: ${reportPaths.full}`);
      this.logger.info('');

      return {
        success: true,
        currentAudit,
        comparison,
        trendReport,
        alerts,
        reportPaths
      };
    } catch (error) {
      this.logger.error('Monitoring failed', { error: error.message, stack: error.stack });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate all monitoring reports
   * @param {Object} currentAudit - Current audit results
   * @param {Object} comparison - Comparison results
   * @param {Object} trendReport - Trend report
   * @param {Array<Object>} alerts - Alerts
   * @returns {Promise<Object>} Paths to generated reports
   */
  async generateMonitoringReports(currentAudit, comparison, trendReport, alerts) {
    const timestamp = Date.now();
    const baseFilename = `monitoring-${timestamp}`;

    // Generate comparison report
    const comparisonText = this.monitoring.generateComparisonReport(comparison);
    const comparisonPath = path.join(this.reportsDir, `${baseFilename}-comparison.txt`);
    await fs.writeFile(comparisonPath, comparisonText, 'utf-8');

    // Generate trend report
    let trendText;
    if (trendReport.success === false) {
      trendText = trendReport.message;
    } else {
      trendText = this.monitoring.generateTrendReportText(trendReport);
    }
    const trendPath = path.join(this.reportsDir, `${baseFilename}-trends.txt`);
    await fs.writeFile(trendPath, trendText, 'utf-8');

    // Generate alerts report
    const alertsText = this.monitoring.generateAlertsReport(alerts);
    const alertsPath = path.join(this.reportsDir, `${baseFilename}-alerts.txt`);
    await fs.writeFile(alertsPath, alertsText, 'utf-8');

    // Generate full monitoring report (combined)
    const fullReport = this.generateFullMonitoringReport(
      currentAudit,
      comparisonText,
      trendText,
      alertsText
    );
    const fullPath = path.join(this.reportsDir, `${baseFilename}-full.txt`);
    await fs.writeFile(fullPath, fullReport, 'utf-8');

    return {
      comparison: comparisonPath,
      trend: trendPath,
      alerts: alertsPath,
      full: fullPath
    };
  }

  /**
   * Generate full monitoring report
   * @param {Object} currentAudit - Current audit results
   * @param {string} comparisonText - Comparison report text
   * @param {string} trendText - Trend report text
   * @param {string} alertsText - Alerts report text
   * @returns {string} Full monitoring report
   */
  generateFullMonitoringReport(currentAudit, comparisonText, trendText, alertsText) {
    const lines = [];

    lines.push('='.repeat(80));
    lines.push('COMPLETE INDEXING MONITORING REPORT');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Base URL: ${this.options.baseUrl}`);
    lines.push('');

    // Current status
    lines.push('CURRENT STATUS');
    lines.push('-'.repeat(80));
    lines.push(`Total Pages: ${currentAudit.totalPages}`);
    lines.push(`Total Issues: ${currentAudit.summary.totalIssues}`);
    lines.push(`Critical Issues: ${currentAudit.summary.criticalIssues}`);
    lines.push(`Warning Issues: ${currentAudit.summary.warningIssues}`);
    lines.push(`Fixable Issues: ${currentAudit.summary.fixableIssues}`);
    lines.push('');
    lines.push('');

    // Alerts section
    lines.push(alertsText);
    lines.push('');
    lines.push('');

    // Comparison section
    lines.push(comparisonText);
    lines.push('');
    lines.push('');

    // Trends section
    lines.push(trendText);
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Display summary to console
   * @param {Object} currentAudit - Current audit results
   * @param {Object} comparison - Comparison results
   * @param {Object} trendReport - Trend report
   * @param {Array<Object>} alerts - Alerts
   */
  displaySummary(currentAudit, comparison, trendReport, alerts) {
    this.logger.info('='.repeat(80));
    this.logger.info('MONITORING SUMMARY');
    this.logger.info('='.repeat(80));
    this.logger.info('');

    // Current status
    this.logger.info('CURRENT STATUS:');
    this.logger.info(`  Total Issues: ${currentAudit.summary.totalIssues}`);
    this.logger.info(`  Critical: ${currentAudit.summary.criticalIssues}`);
    this.logger.info(`  Warnings: ${currentAudit.summary.warningIssues}`);
    this.logger.info(`  Fixable: ${currentAudit.summary.fixableIssues}`);
    this.logger.info('');

    // Comparison
    if (!comparison.isFirstAudit) {
      this.logger.info('CHANGES SINCE LAST AUDIT:');
      const formatChange = (value) => {
        if (value > 0) return `+${value} ↑`;
        if (value < 0) return `${value} ↓`;
        return `${value} →`;
      };
      this.logger.info(`  Total Issues: ${formatChange(comparison.totalIssues.change)}`);
      this.logger.info(`  Critical: ${formatChange(comparison.criticalIssues.change)}`);
      this.logger.info(`  Warnings: ${formatChange(comparison.warningIssues.change)}`);
      this.logger.info('');
    }

    // Trends
    if (trendReport.success !== false && trendReport.auditsAnalyzed > 1) {
      this.logger.info('OVERALL TRENDS:');
      this.logger.info(`  Total Issues: ${trendReport.trends.totalIssues.trend}`);
      this.logger.info(`  Critical Issues: ${trendReport.trends.criticalIssues.trend}`);
      this.logger.info('');
    }

    // Alerts
    if (alerts.length > 0) {
      this.logger.info('ALERTS:');
      const criticalCount = alerts.filter(a => a.severity === 'critical').length;
      const warningCount = alerts.filter(a => a.severity === 'warning').length;
      this.logger.info(`  Critical: ${criticalCount}`);
      this.logger.info(`  Warnings: ${warningCount}`);
      this.logger.info('');
    }

    this.logger.info('='.repeat(80));
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new IndexingMonitor({
    baseUrl: process.env.BASE_URL || 'https://scrapiz.com',
    sitemapPath: process.env.SITEMAP_PATH || 'public/sitemap.xml',
    includeSchemaValidation: process.env.INCLUDE_SCHEMA !== 'false',
    includeDuplicateDetection: process.env.INCLUDE_DUPLICATES !== 'false',
    includeInternalLinkScan: process.env.INCLUDE_LINK_SCAN !== 'false',
    trendLimit: parseInt(process.env.TREND_LIMIT || '10', 10)
  });

  monitor.runMonitoring()
    .then(result => {
      if (result.success) {
        console.log('\n✓ Monitoring completed successfully');
        
        // Exit with warning code if there are critical alerts
        const criticalAlerts = result.alerts.filter(a => a.severity === 'critical');
        if (criticalAlerts.length > 0) {
          console.log(`\n⚠ Warning: ${criticalAlerts.length} critical alert(s) detected`);
          process.exit(2); // Exit code 2 for warnings
        }
        
        process.exit(0);
      } else {
        console.error('\n✗ Monitoring failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n✗ Monitoring failed with error:', error);
      process.exit(1);
    });
}

export default IndexingMonitor;
