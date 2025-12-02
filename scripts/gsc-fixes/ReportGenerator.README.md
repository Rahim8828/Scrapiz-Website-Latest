# Report Generator Module

## Overview

The Report Generator module creates comprehensive reports for Google Search Console indexing issues. It provides multiple report formats including summary reports, detailed reports with recommendations, CSV exports for tracking, and JSON exports for programmatic access.

## Features

- **Summary Reports**: High-level overview of all detected issues
- **Detailed Reports**: In-depth analysis with specific recommendations for each issue
- **CSV Export**: Spreadsheet-compatible format for issue tracking and management
- **JSON Export**: Machine-readable format for integration with other tools
- **Priority Recommendations**: Actionable recommendations organized by priority level
- **Complete Report Packages**: Generate all report formats at once

## Usage

### Basic Usage

```javascript
import Logger from './logger.js';
import ReportGenerator from './ReportGenerator.js';

// Initialize
const logger = new Logger();
await logger.initialize();

const reportGenerator = new ReportGenerator(logger);
await reportGenerator.initialize();

// Create issue report structure
const issueReport = {
  timestamp: new Date(),
  totalPages: 100,
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

// Generate summary report
const summaryReport = reportGenerator.generateSummaryReport(issueReport);
console.log(summaryReport);

// Generate detailed report
const detailedReport = reportGenerator.generateDetailedReport(issueReport);
console.log(detailedReport);

// Export to CSV
const csvPath = await reportGenerator.exportToCSV(issueReport);
console.log(`CSV exported to: ${csvPath}`);

// Export to JSON
const jsonPath = await reportGenerator.exportToJSON(issueReport);
console.log(`JSON exported to: ${jsonPath}`);

// Generate complete report package
const reportPaths = await reportGenerator.generateCompleteReportPackage(issueReport);
console.log('Reports generated:', reportPaths);
```

### Generate Complete Report Package

```javascript
// Generate all report formats at once
const reportPaths = await reportGenerator.generateCompleteReportPackage(
  issueReport,
  'my-site-audit'
);

console.log('Summary Report:', reportPaths.summary);
console.log('Detailed Report:', reportPaths.detailed);
console.log('CSV Report:', reportPaths.csv);
console.log('JSON Report:', reportPaths.json);
```

## Report Formats

### Summary Report

Provides a high-level overview:
- Total pages analyzed
- Overall issue counts
- Issues grouped by type
- Critical vs warning issues
- Fixable vs non-fixable issues

### Detailed Report

Includes comprehensive information:
- All issues with full details
- Specific recommendations for each issue
- Priority-based action items
- Affected URL counts
- Technical details (word counts, redirect chains, etc.)

### CSV Export

Spreadsheet-compatible format with columns:
- Issue Type
- URL
- Status
- Priority
- Fixable (Yes/No)
- Recommendation
- Details

Perfect for:
- Tracking fixes over time
- Sharing with team members
- Importing into project management tools

### JSON Export

Machine-readable format containing:
- Complete issue report structure
- All metadata and timestamps
- Nested issue details
- Summary statistics

Perfect for:
- Integration with other tools
- Automated processing
- API consumption
- Data analysis

## Priority Levels

Reports categorize issues by priority:

### CRITICAL
- 404 errors with backlinks
- Noindex on valuable pages
- Invalid structured data

### HIGH
- Soft 404 errors
- Redirect chains
- Missing canonical tags

### MEDIUM
- Duplicate content
- Crawled but not indexed pages

### LOW
- Discovered but not indexed pages

## Issue Report Structure

```javascript
{
  timestamp: Date,
  totalPages: number,
  issues: {
    soft404: [
      {
        url: string,
        reason: string,
        wordCount: number,
        hasHeadings: boolean,
        hasInternalLinks: boolean,
        recommendation: string,
        fixable: boolean
      }
    ],
    canonical: [
      {
        url: string,
        currentCanonical: string | null,
        expectedCanonical: string,
        issueType: string,
        inSitemap: boolean,
        recommendation: string,
        fixable: boolean
      }
    ],
    redirects: [
      {
        url: string,
        redirectChain: Array<string>,
        finalDestination: string,
        redirectType: number,
        inSitemap: boolean,
        internalLinksCount: number,
        recommendation: string,
        fixable: boolean
      }
    ],
    noindex: [
      {
        url: string,
        noindexSource: string,
        shouldBeIndexed: boolean,
        inSitemap: boolean,
        hasBacklinks: boolean,
        recommendation: string,
        fixable: boolean
      }
    ],
    duplicates: [
      {
        url: string,
        duplicateOf: string,
        similarityScore: number,
        hasCanonical: boolean,
        canonicalTarget: string | null,
        recommendation: string,
        fixable: boolean
      }
    ],
    notFound: [
      {
        url: string,
        hasBacklinks: boolean,
        internalLinksCount: number,
        recommendation: string,
        fixable: boolean
      }
    ],
    invalidSchema: [
      {
        url: string,
        schemaType: string,
        errors: Array<{
          field: string,
          message: string,
          severity: string
        }>,
        fixable: boolean
      }
    ],
    crawled: Array<Object>,
    discovered: Array<Object>
  },
  summary: {
    totalIssues: number,
    criticalIssues: number,
    warningIssues: number,
    fixableIssues: number
  }
}
```

## Output Location

All reports are saved to: `scripts/gsc-fixes/reports/`

## Requirements

Validates requirements:
- **11.1**: Issue logging completeness - All detected issues are logged with type, URL, and detection date
- **11.2**: Critical issue reporting - Critical issues are highlighted in reports with priority levels
- **11.5**: Report recommendations - Each issue type includes actionable recommendations

## Integration

The Report Generator integrates with:
- **Logger**: For tracking report generation
- **IssueDetector**: Consumes issue detection results
- **All Detector Modules**: Processes issues from all detectors

## Example Workflow

```javascript
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import IssueDetector from './IssueDetector.js';
import ReportGenerator from './ReportGenerator.js';

async function generateAuditReport() {
  // Initialize
  const logger = new Logger();
  await logger.initialize();
  
  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();
  
  const issueDetector = new IssueDetector(logger, errorHandler);
  const reportGenerator = new ReportGenerator(logger);
  await reportGenerator.initialize();
  
  // Detect issues
  const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    // ... more URLs
  ];
  
  const detectedIssues = await issueDetector.detectAllIssues(urls);
  
  // Build issue report
  const issueReport = {
    timestamp: new Date(),
    totalPages: urls.length,
    issues: {
      soft404: detectedIssues.filter(i => i.soft404).map(i => i.soft404),
      canonical: detectedIssues.filter(i => i.canonical).map(i => i.canonical),
      redirects: detectedIssues.filter(i => i.redirect).map(i => i.redirect),
      noindex: detectedIssues.filter(i => i.noindex).map(i => i.noindex),
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
  
  // Calculate summary
  Object.values(issueReport.issues).forEach(issueArray => {
    issueReport.summary.totalIssues += issueArray.length;
    issueReport.summary.fixableIssues += issueArray.filter(i => i.fixable).length;
  });
  
  // Generate reports
  const reportPaths = await reportGenerator.generateCompleteReportPackage(
    issueReport,
    'site-audit'
  );
  
  console.log('Audit complete! Reports generated:');
  console.log('- Summary:', reportPaths.summary);
  console.log('- Detailed:', reportPaths.detailed);
  console.log('- CSV:', reportPaths.csv);
  console.log('- JSON:', reportPaths.json);
}

generateAuditReport().catch(console.error);
```

## Best Practices

1. **Always initialize** the report generator before use
2. **Use complete report packages** for comprehensive audits
3. **Export to CSV** for team collaboration and tracking
4. **Export to JSON** for automated processing and integration
5. **Review priority recommendations** to focus on critical issues first
6. **Generate reports regularly** to track improvements over time

## Error Handling

The Report Generator handles errors gracefully:
- Creates report directory if it doesn't exist
- Logs all operations through the Logger
- Escapes special characters in CSV exports
- Validates data before generating reports

## Performance

- Efficient string building for large reports
- Minimal memory footprint
- Fast CSV and JSON serialization
- Handles thousands of issues without performance degradation
