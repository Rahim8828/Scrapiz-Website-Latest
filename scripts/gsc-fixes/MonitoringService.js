import fs from 'fs/promises';
import path from 'path';
import { formatTimestamp } from './utils.js';

/**
 * Monitoring Service Module
 * Tracks indexing status over time and generates trend reports
 */
class MonitoringService {
  constructor(logger) {
    this.logger = logger;
    this.historyDir = path.join(process.cwd(), 'scripts/gsc-fixes/monitoring-history');
    this.alertsDir = path.join(process.cwd(), 'scripts/gsc-fixes/alerts');
    this.reportsDir = path.join(process.cwd(), 'scripts/gsc-fixes/reports');
  }

  /**
   * Initialize monitoring directories
   */
  async initialize() {
    try {
      await fs.mkdir(this.historyDir, { recursive: true });
      await fs.mkdir(this.alertsDir, { recursive: true });
      await fs.mkdir(this.reportsDir, { recursive: true });
      this.logger.info('Monitoring directories initialized');
    } catch (error) {
      this.logger.error('Failed to initialize monitoring directories', error);
      throw error;
    }
  }

  /**
   * Save current audit results to history
   * @param {Object} issueReport - Current audit report
   * @returns {Promise<string>} Path to saved history file
   */
  async saveAuditHistory(issueReport) {
    const timestamp = Date.now();
    const filename = `audit-${timestamp}.json`;
    const filePath = path.join(this.historyDir, filename);

    const historyEntry = {
      timestamp: issueReport.timestamp,
      timestampMs: timestamp,
      totalPages: issueReport.totalPages,
      summary: issueReport.summary,
      issueCounts: {
        soft404: issueReport.issues.soft404?.length || 0,
        canonical: issueReport.issues.canonical?.length || 0,
        redirects: issueReport.issues.redirects?.length || 0,
        noindex: issueReport.issues.noindex?.length || 0,
        duplicates: issueReport.issues.duplicates?.length || 0,
        crawled: issueReport.issues.crawled?.length || 0,
        discovered: issueReport.issues.discovered?.length || 0,
        notFound: issueReport.issues.notFound?.length || 0,
        invalidSchema: issueReport.issues.invalidSchema?.length || 0
      },
      issues: issueReport.issues
    };

    await fs.writeFile(filePath, JSON.stringify(historyEntry, null, 2), 'utf-8');
    this.logger.info(`Audit history saved: ${filePath}`);

    return filePath;
  }

  /**
   * Get all historical audit results
   * @returns {Promise<Array<Object>>} Array of historical audit results
   */
  async getAuditHistory() {
    try {
      const files = await fs.readdir(this.historyDir);
      const auditFiles = files.filter(f => f.startsWith('audit-') && f.endsWith('.json'));

      const history = [];
      for (const file of auditFiles) {
        const filePath = path.join(this.historyDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const audit = JSON.parse(content);
        history.push(audit);
      }

      // Sort by timestamp (newest first)
      history.sort((a, b) => b.timestampMs - a.timestampMs);

      return history;
    } catch (error) {
      this.logger.error('Failed to load audit history', error);
      return [];
    }
  }

  /**
   * Get the most recent audit result
   * @returns {Promise<Object|null>} Most recent audit or null
   */
  async getLatestAudit() {
    const history = await this.getAuditHistory();
    return history.length > 0 ? history[0] : null;
  }

  /**
   * Compare current audit with previous audit
   * @param {Object} currentAudit - Current audit report
   * @param {Object} previousAudit - Previous audit report
   * @returns {Object} Comparison results
   */
  compareAudits(currentAudit, previousAudit) {
    if (!previousAudit) {
      return {
        isFirstAudit: true,
        message: 'This is the first audit - no comparison available'
      };
    }

    const comparison = {
      isFirstAudit: false,
      timeBetween: currentAudit.timestampMs - previousAudit.timestampMs,
      timeBetweenFormatted: this.formatDuration(currentAudit.timestampMs - previousAudit.timestampMs),
      currentDate: new Date(currentAudit.timestampMs).toISOString(),
      previousDate: new Date(previousAudit.timestampMs).toISOString(),
      totalIssues: {
        current: currentAudit.summary.totalIssues,
        previous: previousAudit.summary.totalIssues,
        change: currentAudit.summary.totalIssues - previousAudit.summary.totalIssues,
        percentChange: this.calculatePercentChange(
          previousAudit.summary.totalIssues,
          currentAudit.summary.totalIssues
        )
      },
      criticalIssues: {
        current: currentAudit.summary.criticalIssues,
        previous: previousAudit.summary.criticalIssues,
        change: currentAudit.summary.criticalIssues - previousAudit.summary.criticalIssues,
        percentChange: this.calculatePercentChange(
          previousAudit.summary.criticalIssues,
          currentAudit.summary.criticalIssues
        )
      },
      warningIssues: {
        current: currentAudit.summary.warningIssues,
        previous: previousAudit.summary.warningIssues,
        change: currentAudit.summary.warningIssues - previousAudit.summary.warningIssues,
        percentChange: this.calculatePercentChange(
          previousAudit.summary.warningIssues,
          currentAudit.summary.warningIssues
        )
      },
      fixableIssues: {
        current: currentAudit.summary.fixableIssues,
        previous: previousAudit.summary.fixableIssues,
        change: currentAudit.summary.fixableIssues - previousAudit.summary.fixableIssues,
        percentChange: this.calculatePercentChange(
          previousAudit.summary.fixableIssues,
          currentAudit.summary.fixableIssues
        )
      },
      byType: {}
    };

    // Compare each issue type
    const issueTypes = [
      'soft404', 'canonical', 'redirects', 'noindex', 
      'duplicates', 'crawled', 'discovered', 'notFound', 'invalidSchema'
    ];

    issueTypes.forEach(type => {
      const current = currentAudit.issueCounts[type] || 0;
      const previous = previousAudit.issueCounts[type] || 0;
      
      comparison.byType[type] = {
        current,
        previous,
        change: current - previous,
        percentChange: this.calculatePercentChange(previous, current)
      };
    });

    // Identify new issues
    comparison.newIssues = this.findNewIssues(currentAudit, previousAudit);
    comparison.resolvedIssues = this.findResolvedIssues(currentAudit, previousAudit);

    return comparison;
  }

  /**
   * Calculate percent change
   * @param {number} oldValue - Old value
   * @param {number} newValue - New value
   * @returns {number} Percent change
   */
  calculatePercentChange(oldValue, newValue) {
    if (oldValue === 0) {
      return newValue > 0 ? 100 : 0;
    }
    return ((newValue - oldValue) / oldValue) * 100;
  }

  /**
   * Format duration in milliseconds to human-readable string
   * @param {number} ms - Duration in milliseconds
   * @returns {string} Formatted duration
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''}`;
    }
  }

  /**
   * Find new issues that appeared since last audit
   * @param {Object} currentAudit - Current audit
   * @param {Object} previousAudit - Previous audit
   * @returns {Object} New issues by type
   */
  findNewIssues(currentAudit, previousAudit) {
    const newIssues = {};
    const issueTypes = [
      'soft404', 'canonical', 'redirects', 'noindex', 
      'duplicates', 'crawled', 'discovered', 'notFound', 'invalidSchema'
    ];

    issueTypes.forEach(type => {
      const currentUrls = new Set(
        (currentAudit.issues[type] || []).map(issue => issue.url)
      );
      const previousUrls = new Set(
        (previousAudit.issues[type] || []).map(issue => issue.url)
      );

      const newUrls = [...currentUrls].filter(url => !previousUrls.has(url));
      
      if (newUrls.length > 0) {
        newIssues[type] = newUrls;
      }
    });

    return newIssues;
  }

  /**
   * Find issues that were resolved since last audit
   * @param {Object} currentAudit - Current audit
   * @param {Object} previousAudit - Previous audit
   * @returns {Object} Resolved issues by type
   */
  findResolvedIssues(currentAudit, previousAudit) {
    const resolvedIssues = {};
    const issueTypes = [
      'soft404', 'canonical', 'redirects', 'noindex', 
      'duplicates', 'crawled', 'discovered', 'notFound', 'invalidSchema'
    ];

    issueTypes.forEach(type => {
      const currentUrls = new Set(
        (currentAudit.issues[type] || []).map(issue => issue.url)
      );
      const previousUrls = new Set(
        (previousAudit.issues[type] || []).map(issue => issue.url)
      );

      const resolvedUrls = [...previousUrls].filter(url => !currentUrls.has(url));
      
      if (resolvedUrls.length > 0) {
        resolvedIssues[type] = resolvedUrls;
      }
    });

    return resolvedIssues;
  }

  /**
   * Generate trend report showing improvements over time
   * @param {number} limit - Number of historical audits to include
   * @returns {Promise<Object>} Trend report
   */
  async generateTrendReport(limit = 10) {
    const history = await this.getAuditHistory();
    
    if (history.length === 0) {
      return {
        success: false,
        message: 'No audit history available'
      };
    }

    const auditsToAnalyze = history.slice(0, limit);

    const trendReport = {
      generatedAt: new Date().toISOString(),
      auditsAnalyzed: auditsToAnalyze.length,
      timeRange: {
        from: new Date(auditsToAnalyze[auditsToAnalyze.length - 1].timestampMs).toISOString(),
        to: new Date(auditsToAnalyze[0].timestampMs).toISOString()
      },
      trends: {
        totalIssues: this.calculateTrend(auditsToAnalyze, 'summary.totalIssues'),
        criticalIssues: this.calculateTrend(auditsToAnalyze, 'summary.criticalIssues'),
        warningIssues: this.calculateTrend(auditsToAnalyze, 'summary.warningIssues'),
        fixableIssues: this.calculateTrend(auditsToAnalyze, 'summary.fixableIssues')
      },
      trendsByType: {},
      dataPoints: auditsToAnalyze.map(audit => ({
        timestamp: audit.timestampMs,
        date: new Date(audit.timestampMs).toISOString(),
        totalIssues: audit.summary.totalIssues,
        criticalIssues: audit.summary.criticalIssues,
        warningIssues: audit.summary.warningIssues,
        issueCounts: audit.issueCounts
      }))
    };

    // Calculate trends by issue type
    const issueTypes = [
      'soft404', 'canonical', 'redirects', 'noindex', 
      'duplicates', 'crawled', 'discovered', 'notFound', 'invalidSchema'
    ];

    issueTypes.forEach(type => {
      trendReport.trendsByType[type] = this.calculateTrend(
        auditsToAnalyze,
        `issueCounts.${type}`
      );
    });

    return trendReport;
  }

  /**
   * Calculate trend for a specific metric
   * @param {Array<Object>} audits - Array of audit results
   * @param {string} metricPath - Path to metric (e.g., 'summary.totalIssues')
   * @returns {Object} Trend analysis
   */
  calculateTrend(audits, metricPath) {
    const values = audits.map(audit => {
      const parts = metricPath.split('.');
      let value = audit;
      for (const part of parts) {
        value = value[part];
        if (value === undefined) return 0;
      }
      return value;
    }).reverse(); // Reverse to get chronological order

    if (values.length === 0) {
      return { trend: 'unknown', change: 0 };
    }

    const first = values[0];
    const last = values[values.length - 1];
    const change = last - first;
    const percentChange = first === 0 ? (last > 0 ? 100 : 0) : (change / first) * 100;

    // Determine trend direction
    let trend = 'stable';
    if (Math.abs(percentChange) > 5) {
      trend = change < 0 ? 'improving' : 'worsening';
    }

    return {
      trend,
      first,
      last,
      change,
      percentChange: Math.round(percentChange * 10) / 10,
      values
    };
  }

  /**
   * Check for critical issues and generate alerts
   * @param {Object} currentAudit - Current audit report
   * @param {Object} comparison - Comparison with previous audit
   * @returns {Promise<Array<Object>>} Array of alerts
   */
  async checkForAlerts(currentAudit, comparison) {
    const alerts = [];

    // Alert: New critical issues
    if (comparison && !comparison.isFirstAudit) {
      if (comparison.criticalIssues.change > 0) {
        alerts.push({
          severity: 'critical',
          type: 'new_critical_issues',
          message: `${comparison.criticalIssues.change} new critical issue(s) detected`,
          details: {
            current: comparison.criticalIssues.current,
            previous: comparison.criticalIssues.previous,
            change: comparison.criticalIssues.change
          }
        });
      }

      // Alert: Significant increase in total issues
      if (comparison.totalIssues.percentChange > 20) {
        alerts.push({
          severity: 'warning',
          type: 'issues_spike',
          message: `Total issues increased by ${Math.round(comparison.totalIssues.percentChange)}%`,
          details: {
            current: comparison.totalIssues.current,
            previous: comparison.totalIssues.previous,
            percentChange: comparison.totalIssues.percentChange
          }
        });
      }

      // Alert: New 404 errors with backlinks
      const new404WithBacklinks = (comparison.newIssues.notFound || [])
        .filter(url => {
          const issue = currentAudit.issues.notFound.find(i => i.url === url);
          return issue && issue.hasBacklinks;
        });

      if (new404WithBacklinks.length > 0) {
        alerts.push({
          severity: 'critical',
          type: 'new_404_with_backlinks',
          message: `${new404WithBacklinks.length} new 404 error(s) with backlinks detected`,
          details: {
            urls: new404WithBacklinks
          }
        });
      }

      // Alert: New invalid schema
      if (comparison.newIssues.invalidSchema && comparison.newIssues.invalidSchema.length > 0) {
        alerts.push({
          severity: 'critical',
          type: 'new_invalid_schema',
          message: `${comparison.newIssues.invalidSchema.length} new invalid schema issue(s) detected`,
          details: {
            urls: comparison.newIssues.invalidSchema
          }
        });
      }
    }

    // Alert: High number of critical issues (regardless of comparison)
    if (currentAudit.summary.criticalIssues > 10) {
      alerts.push({
        severity: 'critical',
        type: 'high_critical_count',
        message: `${currentAudit.summary.criticalIssues} critical issues require immediate attention`,
        details: {
          criticalIssues: currentAudit.summary.criticalIssues
        }
      });
    }

    // Save alerts if any were generated
    if (alerts.length > 0) {
      await this.saveAlerts(alerts, currentAudit.timestampMs);
    }

    return alerts;
  }

  /**
   * Save alerts to file
   * @param {Array<Object>} alerts - Array of alerts
   * @param {number} timestamp - Timestamp of audit
   * @returns {Promise<string>} Path to saved alerts file
   */
  async saveAlerts(alerts, timestamp) {
    const filename = `alerts-${timestamp}.json`;
    const filePath = path.join(this.alertsDir, filename);

    const alertsData = {
      timestamp: new Date(timestamp).toISOString(),
      timestampMs: timestamp,
      alertCount: alerts.length,
      alerts
    };

    await fs.writeFile(filePath, JSON.stringify(alertsData, null, 2), 'utf-8');
    this.logger.info(`Alerts saved: ${filePath}`);

    return filePath;
  }

  /**
   * Generate formatted comparison report
   * @param {Object} comparison - Comparison results
   * @returns {string} Formatted report
   */
  generateComparisonReport(comparison) {
    if (comparison.isFirstAudit) {
      return comparison.message;
    }

    const lines = [];
    
    lines.push('='.repeat(80));
    lines.push('AUDIT COMPARISON REPORT');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Current Audit: ${comparison.currentDate}`);
    lines.push(`Previous Audit: ${comparison.previousDate}`);
    lines.push(`Time Between: ${comparison.timeBetweenFormatted}`);
    lines.push('');
    
    // Overall changes
    lines.push('OVERALL CHANGES');
    lines.push('-'.repeat(80));
    
    const formatChange = (metric) => {
      const sign = metric.change >= 0 ? '+' : '';
      const arrow = metric.change < 0 ? '↓' : (metric.change > 0 ? '↑' : '→');
      return `${metric.previous} → ${metric.current} (${sign}${metric.change}, ${sign}${Math.round(metric.percentChange * 10) / 10}%) ${arrow}`;
    };
    
    lines.push(`Total Issues: ${formatChange(comparison.totalIssues)}`);
    lines.push(`Critical Issues: ${formatChange(comparison.criticalIssues)}`);
    lines.push(`Warning Issues: ${formatChange(comparison.warningIssues)}`);
    lines.push(`Fixable Issues: ${formatChange(comparison.fixableIssues)}`);
    lines.push('');
    
    // Changes by type
    lines.push('CHANGES BY ISSUE TYPE');
    lines.push('-'.repeat(80));
    
    const typeLabels = {
      soft404: 'Soft 404 Errors',
      canonical: 'Canonical Issues',
      redirects: 'Redirect Issues',
      noindex: 'Noindex Issues',
      duplicates: 'Duplicate Content',
      crawled: 'Crawled Not Indexed',
      discovered: 'Discovered Not Indexed',
      notFound: '404 Errors',
      invalidSchema: 'Invalid Schema'
    };
    
    Object.entries(comparison.byType).forEach(([type, metric]) => {
      if (metric.current > 0 || metric.previous > 0) {
        lines.push(`${typeLabels[type]}: ${formatChange(metric)}`);
      }
    });
    
    lines.push('');
    
    // New issues
    const newIssueCount = Object.values(comparison.newIssues).reduce((sum, urls) => sum + urls.length, 0);
    if (newIssueCount > 0) {
      lines.push('NEW ISSUES');
      lines.push('-'.repeat(80));
      Object.entries(comparison.newIssues).forEach(([type, urls]) => {
        lines.push(`${typeLabels[type]}: ${urls.length} new`);
        urls.slice(0, 5).forEach(url => {
          lines.push(`  - ${url}`);
        });
        if (urls.length > 5) {
          lines.push(`  ... and ${urls.length - 5} more`);
        }
      });
      lines.push('');
    }
    
    // Resolved issues
    const resolvedIssueCount = Object.values(comparison.resolvedIssues).reduce((sum, urls) => sum + urls.length, 0);
    if (resolvedIssueCount > 0) {
      lines.push('RESOLVED ISSUES');
      lines.push('-'.repeat(80));
      Object.entries(comparison.resolvedIssues).forEach(([type, urls]) => {
        lines.push(`${typeLabels[type]}: ${urls.length} resolved`);
        urls.slice(0, 5).forEach(url => {
          lines.push(`  - ${url}`);
        });
        if (urls.length > 5) {
          lines.push(`  ... and ${urls.length - 5} more`);
        }
      });
      lines.push('');
    }
    
    lines.push('='.repeat(80));
    
    return lines.join('\n');
  }

  /**
   * Generate formatted trend report
   * @param {Object} trendReport - Trend report data
   * @returns {string} Formatted report
   */
  generateTrendReportText(trendReport) {
    const lines = [];
    
    lines.push('='.repeat(80));
    lines.push('INDEXING TRENDS REPORT');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Generated: ${trendReport.generatedAt}`);
    lines.push(`Audits Analyzed: ${trendReport.auditsAnalyzed}`);
    lines.push(`Time Range: ${trendReport.timeRange.from} to ${trendReport.timeRange.to}`);
    lines.push('');
    
    // Overall trends
    lines.push('OVERALL TRENDS');
    lines.push('-'.repeat(80));
    
    const formatTrend = (metric, label) => {
      const emoji = metric.trend === 'improving' ? '✓' : (metric.trend === 'worsening' ? '✗' : '→');
      const sign = metric.change >= 0 ? '+' : '';
      return `${label}: ${metric.first} → ${metric.last} (${sign}${metric.change}, ${sign}${metric.percentChange}%) ${emoji} ${metric.trend}`;
    };
    
    lines.push(formatTrend(trendReport.trends.totalIssues, 'Total Issues'));
    lines.push(formatTrend(trendReport.trends.criticalIssues, 'Critical Issues'));
    lines.push(formatTrend(trendReport.trends.warningIssues, 'Warning Issues'));
    lines.push(formatTrend(trendReport.trends.fixableIssues, 'Fixable Issues'));
    lines.push('');
    
    // Trends by type
    lines.push('TRENDS BY ISSUE TYPE');
    lines.push('-'.repeat(80));
    
    const typeLabels = {
      soft404: 'Soft 404 Errors',
      canonical: 'Canonical Issues',
      redirects: 'Redirect Issues',
      noindex: 'Noindex Issues',
      duplicates: 'Duplicate Content',
      crawled: 'Crawled Not Indexed',
      discovered: 'Discovered Not Indexed',
      notFound: '404 Errors',
      invalidSchema: 'Invalid Schema'
    };
    
    Object.entries(trendReport.trendsByType).forEach(([type, metric]) => {
      if (metric.first > 0 || metric.last > 0) {
        lines.push(formatTrend(metric, typeLabels[type]));
      }
    });
    
    lines.push('');
    lines.push('='.repeat(80));
    
    return lines.join('\n');
  }

  /**
   * Generate formatted alerts report
   * @param {Array<Object>} alerts - Array of alerts
   * @returns {string} Formatted report
   */
  generateAlertsReport(alerts) {
    if (alerts.length === 0) {
      return 'No alerts generated - all metrics within acceptable ranges.';
    }

    const lines = [];
    
    lines.push('='.repeat(80));
    lines.push('ALERTS REPORT');
    lines.push('='.repeat(80));
    lines.push('');
    lines.push(`Total Alerts: ${alerts.length}`);
    lines.push('');
    
    const criticalAlerts = alerts.filter(a => a.severity === 'critical');
    const warningAlerts = alerts.filter(a => a.severity === 'warning');
    
    if (criticalAlerts.length > 0) {
      lines.push('CRITICAL ALERTS');
      lines.push('-'.repeat(80));
      criticalAlerts.forEach((alert, index) => {
        lines.push(`${index + 1}. ${alert.message}`);
        if (alert.details) {
          lines.push(`   Details: ${JSON.stringify(alert.details, null, 2).split('\n').join('\n   ')}`);
        }
        lines.push('');
      });
    }
    
    if (warningAlerts.length > 0) {
      lines.push('WARNING ALERTS');
      lines.push('-'.repeat(80));
      warningAlerts.forEach((alert, index) => {
        lines.push(`${index + 1}. ${alert.message}`);
        if (alert.details) {
          lines.push(`   Details: ${JSON.stringify(alert.details, null, 2).split('\n').join('\n   ')}`);
        }
        lines.push('');
      });
    }
    
    lines.push('='.repeat(80));
    
    return lines.join('\n');
  }
}

export default MonitoringService;
