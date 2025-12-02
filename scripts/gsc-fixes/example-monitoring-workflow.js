#!/usr/bin/env node

/**
 * Example Monitoring Workflow
 * Demonstrates how to use the monitoring service
 */

import IndexingMonitor from './monitor-indexing.js';
import MonitoringService from './MonitoringService.js';
import Logger from './logger.js';

const logger = new Logger();

/**
 * Example 1: Basic Monitoring
 * Run a complete monitoring workflow
 */
async function example1_basicMonitoring() {
  logger.info('='.repeat(80));
  logger.info('EXAMPLE 1: Basic Monitoring');
  logger.info('='.repeat(80));
  logger.info('');

  const monitor = new IndexingMonitor({
    baseUrl: 'https://scrapiz.com',
    sitemapPath: 'public/sitemap.xml'
  });

  const result = await monitor.runMonitoring();

  if (result.success) {
    logger.info('✓ Monitoring completed successfully');
    logger.info(`Total Issues: ${result.currentAudit.summary.totalIssues}`);
    logger.info(`Alerts Generated: ${result.alerts.length}`);
  } else {
    logger.error('✗ Monitoring failed:', result.error);
  }

  logger.info('');
}

/**
 * Example 2: Custom Monitoring with Options
 * Run monitoring with custom options
 */
async function example2_customMonitoring() {
  logger.info('='.repeat(80));
  logger.info('EXAMPLE 2: Custom Monitoring with Options');
  logger.info('='.repeat(80));
  logger.info('');

  const monitor = new IndexingMonitor({
    baseUrl: 'https://scrapiz.com',
    sitemapPath: 'public/sitemap.xml',
    includeSchemaValidation: true,
    includeDuplicateDetection: true,
    includeInternalLinkScan: false, // Skip internal link scanning for speed
    trendLimit: 20 // Analyze last 20 audits
  });

  const result = await monitor.runMonitoring();

  if (result.success) {
    logger.info('✓ Custom monitoring completed');
    
    // Access specific data
    if (!result.comparison.isFirstAudit) {
      logger.info(`Change in total issues: ${result.comparison.totalIssues.change}`);
      logger.info(`Change in critical issues: ${result.comparison.criticalIssues.change}`);
    }
    
    if (result.trendReport.success !== false) {
      logger.info(`Overall trend: ${result.trendReport.trends.totalIssues.trend}`);
    }
  }

  logger.info('');
}

/**
 * Example 3: Programmatic Access to Monitoring Data
 * Access monitoring data programmatically
 */
async function example3_programmaticAccess() {
  logger.info('='.repeat(80));
  logger.info('EXAMPLE 3: Programmatic Access to Monitoring Data');
  logger.info('='.repeat(80));
  logger.info('');

  const monitoring = new MonitoringService(logger);
  await monitoring.initialize();

  // Get audit history
  const history = await monitoring.getAuditHistory();
  logger.info(`Total audits in history: ${history.length}`);

  if (history.length >= 2) {
    // Compare last two audits
    const latest = history[0];
    const previous = history[1];
    
    const comparison = monitoring.compareAudits(latest, previous);
    
    logger.info('');
    logger.info('Comparison Results:');
    logger.info(`  Time between audits: ${comparison.timeBetweenFormatted}`);
    logger.info(`  Total issues change: ${comparison.totalIssues.change}`);
    logger.info(`  Critical issues change: ${comparison.criticalIssues.change}`);
    
    // Check for new issues
    const newIssueTypes = Object.keys(comparison.newIssues);
    if (newIssueTypes.length > 0) {
      logger.info('');
      logger.info('New Issues:');
      newIssueTypes.forEach(type => {
        logger.info(`  ${type}: ${comparison.newIssues[type].length} new`);
      });
    }
    
    // Check for resolved issues
    const resolvedIssueTypes = Object.keys(comparison.resolvedIssues);
    if (resolvedIssueTypes.length > 0) {
      logger.info('');
      logger.info('Resolved Issues:');
      resolvedIssueTypes.forEach(type => {
        logger.info(`  ${type}: ${comparison.resolvedIssues[type].length} resolved`);
      });
    }
  }

  logger.info('');
}

/**
 * Example 4: Generate Trend Report
 * Generate and analyze trend report
 */
async function example4_trendReport() {
  logger.info('='.repeat(80));
  logger.info('EXAMPLE 4: Generate Trend Report');
  logger.info('='.repeat(80));
  logger.info('');

  const monitoring = new MonitoringService(logger);
  await monitoring.initialize();

  // Generate trend report for last 10 audits
  const trendReport = await monitoring.generateTrendReport(10);

  if (trendReport.success === false) {
    logger.info(trendReport.message);
  } else {
    logger.info(`Audits analyzed: ${trendReport.auditsAnalyzed}`);
    logger.info(`Time range: ${trendReport.timeRange.from} to ${trendReport.timeRange.to}`);
    logger.info('');
    
    logger.info('Overall Trends:');
    logger.info(`  Total Issues: ${trendReport.trends.totalIssues.trend} (${trendReport.trends.totalIssues.first} → ${trendReport.trends.totalIssues.last})`);
    logger.info(`  Critical Issues: ${trendReport.trends.criticalIssues.trend} (${trendReport.trends.criticalIssues.first} → ${trendReport.trends.criticalIssues.last})`);
    logger.info(`  Warning Issues: ${trendReport.trends.warningIssues.trend} (${trendReport.trends.warningIssues.first} → ${trendReport.trends.warningIssues.last})`);
    
    // Check which issue types are improving
    logger.info('');
    logger.info('Issue Types Improving:');
    Object.entries(trendReport.trendsByType).forEach(([type, trend]) => {
      if (trend.trend === 'improving') {
        logger.info(`  ${type}: ${trend.first} → ${trend.last} (${trend.percentChange}%)`);
      }
    });
    
    // Check which issue types are worsening
    logger.info('');
    logger.info('Issue Types Worsening:');
    Object.entries(trendReport.trendsByType).forEach(([type, trend]) => {
      if (trend.trend === 'worsening') {
        logger.info(`  ${type}: ${trend.first} → ${trend.last} (${trend.percentChange}%)`);
      }
    });
  }

  logger.info('');
}

/**
 * Example 5: Alert Handling
 * Check for alerts and handle them
 */
async function example5_alertHandling() {
  logger.info('='.repeat(80));
  logger.info('EXAMPLE 5: Alert Handling');
  logger.info('='.repeat(80));
  logger.info('');

  const monitor = new IndexingMonitor();
  const result = await monitor.runMonitoring();

  if (result.success && result.alerts.length > 0) {
    logger.info(`${result.alerts.length} alert(s) generated`);
    logger.info('');

    // Separate by severity
    const criticalAlerts = result.alerts.filter(a => a.severity === 'critical');
    const warningAlerts = result.alerts.filter(a => a.severity === 'warning');

    if (criticalAlerts.length > 0) {
      logger.warn('CRITICAL ALERTS:');
      criticalAlerts.forEach((alert, index) => {
        logger.warn(`${index + 1}. [${alert.type}] ${alert.message}`);
        
        // Handle specific alert types
        switch (alert.type) {
          case 'new_404_with_backlinks':
            logger.warn('   → Action: Implement 301 redirects for these URLs');
            break;
          case 'new_invalid_schema':
            logger.warn('   → Action: Fix schema markup errors');
            break;
          case 'new_critical_issues':
            logger.warn('   → Action: Review and fix new critical issues');
            break;
          case 'high_critical_count':
            logger.warn('   → Action: Prioritize fixing critical issues');
            break;
        }
      });
      logger.info('');
    }

    if (warningAlerts.length > 0) {
      logger.info('WARNING ALERTS:');
      warningAlerts.forEach((alert, index) => {
        logger.info(`${index + 1}. [${alert.type}] ${alert.message}`);
      });
      logger.info('');
    }

    // Example: Send email notification for critical alerts
    if (criticalAlerts.length > 0) {
      logger.info('📧 Sending email notification for critical alerts...');
      // await sendEmailNotification(criticalAlerts);
      logger.info('✓ Email notification sent');
    }
  } else if (result.success) {
    logger.info('✓ No alerts - all metrics within acceptable ranges');
  }

  logger.info('');
}

/**
 * Example 6: Scheduled Monitoring
 * Simulate scheduled monitoring with different intervals
 */
async function example6_scheduledMonitoring() {
  logger.info('='.repeat(80));
  logger.info('EXAMPLE 6: Scheduled Monitoring Simulation');
  logger.info('='.repeat(80));
  logger.info('');

  logger.info('This example demonstrates how to set up scheduled monitoring.');
  logger.info('');

  logger.info('Daily Monitoring (Recommended):');
  logger.info('  Cron: 0 9 * * *');
  logger.info('  Command: node scripts/gsc-fixes/monitor-indexing.js');
  logger.info('  Purpose: Track daily progress and catch new issues quickly');
  logger.info('');

  logger.info('Weekly Monitoring:');
  logger.info('  Cron: 0 9 * * 1');
  logger.info('  Command: TREND_LIMIT=30 node scripts/gsc-fixes/monitor-indexing.js');
  logger.info('  Purpose: Review weekly trends and long-term progress');
  logger.info('');

  logger.info('Post-Fix Monitoring:');
  logger.info('  Run immediately after applying fixes');
  logger.info('  Command: node scripts/gsc-fixes/monitor-indexing.js');
  logger.info('  Purpose: Verify that fixes were applied correctly');
  logger.info('');

  logger.info('Example crontab entry:');
  logger.info('  # Daily SEO monitoring at 9 AM');
  logger.info('  0 9 * * * cd /path/to/project && node scripts/gsc-fixes/monitor-indexing.js >> /var/log/seo-monitor.log 2>&1');
  logger.info('');
}

/**
 * Example 7: Integration with CI/CD
 * Show how to integrate monitoring with CI/CD
 */
async function example7_cicdIntegration() {
  logger.info('='.repeat(80));
  logger.info('EXAMPLE 7: CI/CD Integration');
  logger.info('='.repeat(80));
  logger.info('');

  const monitor = new IndexingMonitor();
  const result = await monitor.runMonitoring();

  if (result.success) {
    // Check if there are critical alerts
    const criticalAlerts = result.alerts.filter(a => a.severity === 'critical');
    
    if (criticalAlerts.length > 0) {
      logger.warn(`⚠ ${criticalAlerts.length} critical alert(s) detected`);
      logger.warn('CI/CD should be notified but not fail the build');
      
      // In a real CI/CD pipeline, you might:
      // - Post to Slack/Teams
      // - Create GitHub issue
      // - Send email notification
      // - Update dashboard
      
      // Exit with warning code (2) instead of failure (1)
      process.exitCode = 2;
    } else {
      logger.info('✓ No critical alerts - CI/CD can proceed');
      process.exitCode = 0;
    }
    
    // Always save reports as artifacts
    logger.info('');
    logger.info('Reports saved to:');
    logger.info(`  ${result.reportPaths.full}`);
    logger.info('');
    logger.info('In CI/CD, upload these as build artifacts');
  } else {
    logger.error('✗ Monitoring failed - CI/CD should fail');
    process.exitCode = 1;
  }

  logger.info('');
}

// Main execution
async function main() {
  const examples = [
    { name: 'Basic Monitoring', fn: example1_basicMonitoring },
    { name: 'Custom Monitoring', fn: example2_customMonitoring },
    { name: 'Programmatic Access', fn: example3_programmaticAccess },
    { name: 'Trend Report', fn: example4_trendReport },
    { name: 'Alert Handling', fn: example5_alertHandling },
    { name: 'Scheduled Monitoring', fn: example6_scheduledMonitoring },
    { name: 'CI/CD Integration', fn: example7_cicdIntegration }
  ];

  // Get example number from command line or run all
  const exampleNum = process.argv[2] ? parseInt(process.argv[2], 10) : null;

  if (exampleNum && exampleNum >= 1 && exampleNum <= examples.length) {
    // Run specific example
    const example = examples[exampleNum - 1];
    logger.info(`Running Example ${exampleNum}: ${example.name}`);
    logger.info('');
    await example.fn();
  } else if (exampleNum) {
    logger.error(`Invalid example number: ${exampleNum}`);
    logger.info('');
    logger.info('Available examples:');
    examples.forEach((ex, index) => {
      logger.info(`  ${index + 1}. ${ex.name}`);
    });
    process.exit(1);
  } else {
    // Run all examples
    logger.info('Running all examples...');
    logger.info('');
    
    for (let i = 0; i < examples.length; i++) {
      const example = examples[i];
      logger.info(`Running Example ${i + 1}: ${example.name}`);
      logger.info('');
      
      try {
        await example.fn();
      } catch (error) {
        logger.error(`Example ${i + 1} failed:`, error.message);
      }
      
      if (i < examples.length - 1) {
        logger.info('');
        logger.info('Press Enter to continue to next example...');
        // In a real scenario, you might want to pause here
        // await new Promise(resolve => process.stdin.once('data', resolve));
      }
    }
  }

  logger.info('');
  logger.info('Examples completed!');
  logger.info('');
  logger.info('Usage:');
  logger.info('  node scripts/gsc-fixes/example-monitoring-workflow.js [example_number]');
  logger.info('');
  logger.info('Examples:');
  examples.forEach((ex, index) => {
    logger.info(`  ${index + 1}. ${ex.name}`);
  });
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export {
  example1_basicMonitoring,
  example2_customMonitoring,
  example3_programmaticAccess,
  example4_trendReport,
  example5_alertHandling,
  example6_scheduledMonitoring,
  example7_cicdIntegration
};
