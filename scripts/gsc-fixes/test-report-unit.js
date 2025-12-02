import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';
import Logger from './logger.js';
import ReportGenerator from './ReportGenerator.js';

/**
 * Unit tests for ReportGenerator
 */

describe('ReportGenerator', () => {
  let logger;
  let reportGenerator;
  let testReportDir;
  
  beforeEach(async () => {
    // Initialize with test directory
    logger = new Logger('scripts/gsc-fixes/logs/test');
    await logger.initialize();
    
    reportGenerator = new ReportGenerator(logger);
    testReportDir = reportGenerator.reportDir;
    await reportGenerator.initialize();
  });
  
  afterEach(async () => {
    // Clean up test reports
    try {
      const files = await fs.readdir(testReportDir);
      for (const file of files) {
        if (file.startsWith('test-')) {
          await fs.unlink(path.join(testReportDir, file));
        }
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });
  
  describe('generateSummaryReport', () => {
    it('should generate summary report with correct structure', () => {
      const issueReport = {
        timestamp: new Date('2025-01-01T00:00:00Z'),
        totalPages: 100,
        issues: {
          soft404: [{ url: 'test1' }, { url: 'test2' }],
          canonical: [{ url: 'test3' }],
          redirects: [],
          noindex: [],
          duplicates: [],
          crawled: [],
          discovered: [],
          notFound: [],
          invalidSchema: []
        },
        summary: {
          totalIssues: 3,
          criticalIssues: 1,
          warningIssues: 2,
          fixableIssues: 3
        }
      };
      
      const report = reportGenerator.generateSummaryReport(issueReport);
      
      assert.ok(report.includes('GSC INDEXING ISSUES - SUMMARY REPORT'));
      assert.ok(report.includes('Total Pages Analyzed: 100'));
      assert.ok(report.includes('Total Issues: 3'));
      assert.ok(report.includes('Critical Issues: 1'));
      assert.ok(report.includes('Soft 404 Errors: 2'));
      assert.ok(report.includes('Canonical Tag Issues: 1'));
    });
    
    it('should handle empty issue report', () => {
      const issueReport = {
        timestamp: new Date(),
        totalPages: 0,
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
      
      const report = reportGenerator.generateSummaryReport(issueReport);
      
      assert.ok(report.includes('Total Issues: 0'));
      assert.ok(report.includes('Total Pages Analyzed: 0'));
    });
  });
  
  describe('generateDetailedReport', () => {
    it('should generate detailed report with all issue types', () => {
      const issueReport = {
        timestamp: new Date('2025-01-01T00:00:00Z'),
        totalPages: 50,
        issues: {
          soft404: [{
            url: 'https://example.com/thin',
            reason: 'thin-content',
            wordCount: 100,
            hasHeadings: false,
            hasInternalLinks: false,
            recommendation: 'Add more content',
            fixable: true
          }],
          canonical: [{
            url: 'https://example.com/page',
            currentCanonical: null,
            expectedCanonical: 'https://example.com/page',
            issueType: 'missing',
            inSitemap: true,
            recommendation: 'Add canonical tag',
            fixable: true
          }],
          redirects: [],
          noindex: [],
          duplicates: [],
          crawled: [],
          discovered: [],
          notFound: [],
          invalidSchema: []
        },
        summary: {
          totalIssues: 2,
          criticalIssues: 0,
          warningIssues: 2,
          fixableIssues: 2
        }
      };
      
      const report = reportGenerator.generateDetailedReport(issueReport);
      
      assert.ok(report.includes('DETAILED REPORT'));
      assert.ok(report.includes('SOFT 404 ERRORS'));
      assert.ok(report.includes('https://example.com/thin'));
      assert.ok(report.includes('Word Count: 100'));
      assert.ok(report.includes('CANONICAL TAG ISSUES'));
      assert.ok(report.includes('PRIORITY RECOMMENDATIONS'));
    });
    
    it('should include recommendations section', () => {
      const issueReport = {
        timestamp: new Date(),
        totalPages: 10,
        issues: {
          soft404: [],
          canonical: [],
          redirects: [],
          noindex: [{
            url: 'https://example.com/valuable',
            noindexSource: 'meta-tag',
            shouldBeIndexed: true,
            inSitemap: true,
            hasBacklinks: true,
            recommendation: 'Remove noindex',
            fixable: true
          }],
          duplicates: [],
          crawled: [],
          discovered: [],
          notFound: [],
          invalidSchema: []
        },
        summary: {
          totalIssues: 1,
          criticalIssues: 1,
          warningIssues: 0,
          fixableIssues: 1
        }
      };
      
      const report = reportGenerator.generateDetailedReport(issueReport);
      
      assert.ok(report.includes('PRIORITY RECOMMENDATIONS'));
      assert.ok(report.includes('CRITICAL'));
      assert.ok(report.includes('Remove noindex from valuable pages'));
    });
  });
  
  describe('generatePriorityRecommendations', () => {
    it('should prioritize critical issues first', () => {
      const issueReport = {
        timestamp: new Date(),
        totalPages: 10,
        issues: {
          soft404: [],
          canonical: [],
          redirects: [],
          noindex: [{
            url: 'test',
            shouldBeIndexed: true,
            fixable: true
          }],
          duplicates: [],
          crawled: [],
          discovered: [],
          notFound: [{
            url: 'test',
            hasBacklinks: true,
            fixable: true
          }],
          invalidSchema: [{
            url: 'test',
            schemaType: 'LocalBusiness',
            errors: [],
            fixable: true
          }]
        },
        summary: {
          totalIssues: 3,
          criticalIssues: 3,
          warningIssues: 0,
          fixableIssues: 3
        }
      };
      
      const recommendations = reportGenerator.generatePriorityRecommendations(issueReport);
      
      assert.ok(recommendations.length > 0);
      assert.strictEqual(recommendations[0].priority, 'CRITICAL');
      assert.ok(recommendations.some(r => r.title.includes('404 errors with backlinks')));
      assert.ok(recommendations.some(r => r.title.includes('noindex from valuable pages')));
      assert.ok(recommendations.some(r => r.title.includes('invalid structured data')));
    });
    
    it('should include high priority recommendations', () => {
      const issueReport = {
        timestamp: new Date(),
        totalPages: 10,
        issues: {
          soft404: [{ url: 'test', fixable: true }],
          canonical: [{ url: 'test', issueType: 'missing', fixable: true }],
          redirects: [{
            url: 'test',
            redirectChain: ['a', 'b', 'c'],
            fixable: true
          }],
          noindex: [],
          duplicates: [],
          crawled: [],
          discovered: [],
          notFound: [],
          invalidSchema: []
        },
        summary: {
          totalIssues: 3,
          criticalIssues: 0,
          warningIssues: 3,
          fixableIssues: 3
        }
      };
      
      const recommendations = reportGenerator.generatePriorityRecommendations(issueReport);
      
      assert.ok(recommendations.some(r => r.priority === 'HIGH'));
      assert.ok(recommendations.some(r => r.title.includes('soft 404')));
      assert.ok(recommendations.some(r => r.title.includes('redirect chains')));
      assert.ok(recommendations.some(r => r.title.includes('canonical tags')));
    });
  });
  
  describe('exportToCSV', () => {
    it('should export issues to CSV format', async () => {
      const issueReport = {
        timestamp: new Date(),
        totalPages: 10,
        issues: {
          soft404: [{
            url: 'https://example.com/test',
            reason: 'thin-content',
            wordCount: 100,
            hasHeadings: false,
            hasInternalLinks: false,
            recommendation: 'Add more content',
            fixable: true
          }],
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
          totalIssues: 1,
          criticalIssues: 0,
          warningIssues: 1,
          fixableIssues: 1
        }
      };
      
      const csvPath = await reportGenerator.exportToCSV(issueReport, 'test-export.csv');
      
      assert.ok(csvPath.endsWith('test-export.csv'));
      
      const csvContent = await fs.readFile(csvPath, 'utf-8');
      assert.ok(csvContent.includes('Issue Type,URL,Status,Priority,Fixable,Recommendation,Details'));
      assert.ok(csvContent.includes('Soft 404'));
      assert.ok(csvContent.includes('https://example.com/test'));
      assert.ok(csvContent.includes('thin-content'));
    });
    
    it('should escape CSV special characters', async () => {
      const issueReport = {
        timestamp: new Date(),
        totalPages: 1,
        issues: {
          soft404: [{
            url: 'https://example.com/test',
            reason: 'content, with, commas',
            wordCount: 100,
            hasHeadings: false,
            hasInternalLinks: false,
            recommendation: 'Add "quoted" content',
            fixable: true
          }],
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
          totalIssues: 1,
          criticalIssues: 0,
          warningIssues: 1,
          fixableIssues: 1
        }
      };
      
      const csvPath = await reportGenerator.exportToCSV(issueReport, 'test-escape.csv');
      const csvContent = await fs.readFile(csvPath, 'utf-8');
      
      // Should escape commas and quotes
      assert.ok(csvContent.includes('"content, with, commas"'));
      assert.ok(csvContent.includes('"Add ""quoted"" content"'));
    });
  });
  
  describe('exportToJSON', () => {
    it('should export issues to JSON format', async () => {
      const issueReport = {
        timestamp: new Date('2025-01-01T00:00:00Z'),
        totalPages: 10,
        issues: {
          soft404: [{
            url: 'https://example.com/test',
            reason: 'thin-content',
            wordCount: 100,
            hasHeadings: false,
            hasInternalLinks: false,
            recommendation: 'Add more content',
            fixable: true
          }],
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
          totalIssues: 1,
          criticalIssues: 0,
          warningIssues: 1,
          fixableIssues: 1
        }
      };
      
      const jsonPath = await reportGenerator.exportToJSON(issueReport, 'test-export.json');
      
      assert.ok(jsonPath.endsWith('test-export.json'));
      
      const jsonContent = await fs.readFile(jsonPath, 'utf-8');
      const parsed = JSON.parse(jsonContent);
      
      assert.strictEqual(parsed.totalPages, 10);
      assert.strictEqual(parsed.issues.soft404.length, 1);
      assert.strictEqual(parsed.issues.soft404[0].url, 'https://example.com/test');
      assert.strictEqual(parsed.summary.totalIssues, 1);
    });
  });
  
  describe('generateCompleteReportPackage', () => {
    it('should generate all report formats', async () => {
      const issueReport = {
        timestamp: new Date(),
        totalPages: 10,
        issues: {
          soft404: [{
            url: 'https://example.com/test',
            reason: 'thin-content',
            wordCount: 100,
            hasHeadings: false,
            hasInternalLinks: false,
            recommendation: 'Add more content',
            fixable: true
          }],
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
          totalIssues: 1,
          criticalIssues: 0,
          warningIssues: 1,
          fixableIssues: 1
        }
      };
      
      const reportPaths = await reportGenerator.generateCompleteReportPackage(
        issueReport,
        'test-complete'
      );
      
      assert.ok(reportPaths.summary);
      assert.ok(reportPaths.detailed);
      assert.ok(reportPaths.csv);
      assert.ok(reportPaths.json);
      
      // Verify all files exist
      await fs.access(reportPaths.summary);
      await fs.access(reportPaths.detailed);
      await fs.access(reportPaths.csv);
      await fs.access(reportPaths.json);
      
      // Clean up
      await fs.unlink(reportPaths.summary);
      await fs.unlink(reportPaths.detailed);
      await fs.unlink(reportPaths.csv);
      await fs.unlink(reportPaths.json);
    });
  });
  
  describe('Requirements Validation', () => {
    it('should validate Requirement 11.1: Issue logging completeness', () => {
      // All detected issues should be logged with type, URL, and detection date
      const issueReport = {
        timestamp: new Date(),
        totalPages: 10,
        issues: {
          soft404: [{
            url: 'https://example.com/test',
            reason: 'thin-content',
            wordCount: 100,
            hasHeadings: false,
            hasInternalLinks: false,
            recommendation: 'Add more content',
            fixable: true
          }],
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
          totalIssues: 1,
          criticalIssues: 0,
          warningIssues: 1,
          fixableIssues: 1
        }
      };
      
      const report = reportGenerator.generateDetailedReport(issueReport);
      
      // Should include issue type
      assert.ok(report.includes('SOFT 404 ERRORS'));
      // Should include URL
      assert.ok(report.includes('https://example.com/test'));
      // Should include timestamp
      assert.ok(report.includes('Generated:'));
    });
    
    it('should validate Requirement 11.2: Critical issue reporting', () => {
      // Critical issues should be highlighted in reports
      const issueReport = {
        timestamp: new Date(),
        totalPages: 10,
        issues: {
          soft404: [],
          canonical: [],
          redirects: [],
          noindex: [{
            url: 'https://example.com/valuable',
            noindexSource: 'meta-tag',
            shouldBeIndexed: true,
            inSitemap: true,
            hasBacklinks: true,
            recommendation: 'Remove noindex',
            fixable: true
          }],
          duplicates: [],
          crawled: [],
          discovered: [],
          notFound: [],
          invalidSchema: []
        },
        summary: {
          totalIssues: 1,
          criticalIssues: 1,
          warningIssues: 0,
          fixableIssues: 1
        }
      };
      
      const recommendations = reportGenerator.generatePriorityRecommendations(issueReport);
      
      // Should have critical priority
      assert.ok(recommendations.some(r => r.priority === 'CRITICAL'));
      // Should list affected URLs
      assert.ok(recommendations.some(r => r.affectedCount === 1));
    });
    
    it('should validate Requirement 11.5: Report recommendations', () => {
      // Each issue type should include actionable recommendations
      const issueReport = {
        timestamp: new Date(),
        totalPages: 10,
        issues: {
          soft404: [{
            url: 'test',
            reason: 'thin-content',
            wordCount: 100,
            hasHeadings: false,
            hasInternalLinks: false,
            recommendation: 'Enhance content to at least 500 words',
            fixable: true
          }],
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
          totalIssues: 1,
          criticalIssues: 0,
          warningIssues: 1,
          fixableIssues: 1
        }
      };
      
      const report = reportGenerator.generateDetailedReport(issueReport);
      
      // Should include recommendation
      assert.ok(report.includes('Recommendation:'));
      assert.ok(report.includes('Enhance content to at least 500 words'));
      
      // Priority recommendations should have descriptions
      const recommendations = reportGenerator.generatePriorityRecommendations(issueReport);
      assert.ok(recommendations.every(r => r.description && r.description.length > 0));
    });
  });
});
