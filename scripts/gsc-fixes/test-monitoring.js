#!/usr/bin/env node

/**
 * Test Monitoring Service
 * Quick test to verify monitoring functionality
 */

import MonitoringService from './MonitoringService.js';
import Logger from './logger.js';

async function testMonitoring() {
  console.log('Testing Monitoring Service...\n');

  const logger = new Logger();
  const monitoring = new MonitoringService(logger);

  try {
    // Test 1: Initialize
    console.log('Test 1: Initialize monitoring service');
    await monitoring.initialize();
    console.log('✓ Initialization successful\n');

    // Test 2: Create mock audit data
    console.log('Test 2: Create mock audit data');
    const mockAudit1 = {
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      timestampMs: Date.now() - 86400000,
      totalPages: 50,
      summary: {
        totalIssues: 45,
        criticalIssues: 12,
        warningIssues: 33,
        fixableIssues: 40
      },
      issueCounts: {
        soft404: 5,
        canonical: 8,
        redirects: 10,
        noindex: 4,
        duplicates: 6,
        crawled: 3,
        discovered: 2,
        notFound: 5,
        invalidSchema: 2
      },
      issues: {
        soft404: [{ url: 'https://example.com/page1' }],
        canonical: [],
        redirects: [],
        noindex: [],
        duplicates: [],
        crawled: [],
        discovered: [],
        notFound: [{ url: 'https://example.com/404', hasBacklinks: true }],
        invalidSchema: []
      }
    };

    const mockAudit2 = {
      timestamp: new Date(),
      timestampMs: Date.now(),
      totalPages: 50,
      summary: {
        totalIssues: 38,
        criticalIssues: 8,
        warningIssues: 30,
        fixableIssues: 35
      },
      issueCounts: {
        soft404: 3,
        canonical: 7,
        redirects: 8,
        noindex: 3,
        duplicates: 5,
        crawled: 3,
        discovered: 2,
        notFound: 5,
        invalidSchema: 2
      },
      issues: {
        soft404: [{ url: 'https://example.com/page2' }],
        canonical: [],
        redirects: [],
        noindex: [],
        duplicates: [],
        crawled: [],
        discovered: [],
        notFound: [
          { url: 'https://example.com/404', hasBacklinks: true },
          { url: 'https://example.com/new-404', hasBacklinks: true }
        ],
        invalidSchema: []
      }
    };
    console.log('✓ Mock audit data created\n');

    // Test 3: Save audit history
    console.log('Test 3: Save audit history');
    await monitoring.saveAuditHistory(mockAudit1);
    await monitoring.saveAuditHistory(mockAudit2);
    console.log('✓ Audit history saved\n');

    // Test 4: Get audit history
    console.log('Test 4: Get audit history');
    const history = await monitoring.getAuditHistory();
    console.log(`✓ Retrieved ${history.length} audit(s) from history\n`);

    // Test 5: Compare audits
    console.log('Test 5: Compare audits');
    const comparison = monitoring.compareAudits(mockAudit2, mockAudit1);
    console.log('✓ Comparison completed');
    console.log(`  Total issues change: ${comparison.totalIssues.change}`);
    console.log(`  Critical issues change: ${comparison.criticalIssues.change}`);
    console.log(`  Time between: ${comparison.timeBetweenFormatted}\n`);

    // Test 6: Generate comparison report
    console.log('Test 6: Generate comparison report');
    const comparisonReport = monitoring.generateComparisonReport(comparison);
    console.log('✓ Comparison report generated');
    console.log(`  Report length: ${comparisonReport.length} characters\n`);

    // Test 7: Check for alerts
    console.log('Test 7: Check for alerts');
    const alerts = await monitoring.checkForAlerts(mockAudit2, comparison);
    console.log(`✓ ${alerts.length} alert(s) generated`);
    if (alerts.length > 0) {
      alerts.forEach(alert => {
        console.log(`  - [${alert.severity}] ${alert.message}`);
      });
    }
    console.log('');

    // Test 8: Generate alerts report
    console.log('Test 8: Generate alerts report');
    const alertsReport = monitoring.generateAlertsReport(alerts);
    console.log('✓ Alerts report generated');
    console.log(`  Report length: ${alertsReport.length} characters\n`);

    // Test 9: Generate trend report
    console.log('Test 9: Generate trend report');
    const trendReport = await monitoring.generateTrendReport(10);
    if (trendReport.success === false) {
      console.log(`ℹ ${trendReport.message}\n`);
    } else {
      console.log('✓ Trend report generated');
      console.log(`  Audits analyzed: ${trendReport.auditsAnalyzed}`);
      console.log(`  Total issues trend: ${trendReport.trends.totalIssues.trend}\n`);
    }

    // Test 10: Calculate percent change
    console.log('Test 10: Calculate percent change');
    const percentChange = monitoring.calculatePercentChange(45, 38);
    console.log(`✓ Percent change: ${percentChange.toFixed(1)}%\n`);

    console.log('='.repeat(80));
    console.log('ALL TESTS PASSED ✓');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('✗ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testMonitoring();
