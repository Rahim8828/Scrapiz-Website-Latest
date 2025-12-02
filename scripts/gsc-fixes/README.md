# GSC Fix System

Google Search Console indexing issue detection and resolution system for the Scrapiz website.

## Directory Structure

```
scripts/gsc-fixes/
├── index.js              # Main entry point
├── logger.js             # Logging utility
├── errorHandler.js       # Error handling and backup/rollback
├── utils.js              # Common utility functions
├── backups/              # Backup files (auto-created)
├── logs/                 # Log files (auto-created)
└── README.md            # This file
```

## Core Utilities

### Logger

Tracks all system operations, issues detected, and fixes applied.

```javascript
import { Logger } from './index.js';

const logger = new Logger();
await logger.initialize();

// Log messages
await logger.info('Operation started');
await logger.warn('Warning message');
await logger.error('Error occurred', { details: 'error details' });

// Log issues and fixes
await logger.logIssue('soft-404', 'https://example.com/page', { reason: 'thin-content' });
await logger.logFix('canonical', 'https://example.com/page', true);

// Get summaries
const issueSummary = await logger.getIssueSummary();
const fixSummary = await logger.getFixSummary();
```

### Error Handler

Provides backup, rollback, and error recovery functionality.

```javascript
import { ErrorHandler } from './index.js';

const errorHandler = new ErrorHandler(logger);
await errorHandler.initialize();

// Create backup before changes
const backupPath = await errorHandler.createBackup('/path/to/file');

try {
  // Make changes...
} catch (error) {
  // Rollback on error
  await errorHandler.rollback(backupPath, '/path/to/file');
}

// Retry with exponential backoff
const result = await errorHandler.retryWithBackoff(
  async () => await someOperation(),
  3,  // max attempts
  1000 // initial delay
);
```

### Utilities

Common helper functions for URL handling, text processing, and more.

```javascript
import { utils } from './index.js';

// URL utilities
const normalized = utils.normalizeUrl('https://example.com/page/');
const isValid = utils.isValidUrl('https://example.com');
const domain = utils.extractDomain('https://example.com/page');

// Text utilities
const wordCount = utils.countWords('Some text content');
const text = utils.extractTextFromHtml('<p>Hello <b>world</b></p>');
const similarity = utils.calculateSimilarity('text1', 'text2');

// Batch processing
const results = await utils.batchProcess(
  items,
  async (item) => await processItem(item),
  10 // batch size
);

// HTTP utilities
const category = utils.getStatusCategory(404); // 'client-error'
const isPermanent = utils.isPermanentRedirect(301); // true
```

## Initialization

```javascript
import { initializeSystem } from './index.js';

// Initialize all components
const { logger, errorHandler, utils } = await initializeSystem();

// Use components...
await logger.info('System ready');
```

## Dependencies

- **fast-check**: Property-based testing
- **cheerio**: HTML parsing
- **xml2js**: XML parsing for sitemaps
- **axios**: HTTP client

## Log Files

Logs are stored in `scripts/gsc-fixes/logs/` with format:
- `gsc-fixes-{timestamp}.log`

Each log entry is a JSON object with:
- `timestamp`: ISO timestamp
- `level`: INFO, WARN, ERROR, DEBUG
- `message`: Log message
- `sessionId`: Session identifier
- `data`: Additional data (optional)

## Backup Files

Backups are stored in `scripts/gsc-fixes/backups/` with format:
- `{filename}.backup.{timestamp}`

Backups are automatically cleaned up after 7 days.

## Error Handling

The system handles various error types:

1. **File System Errors** (ENOENT, EACCES): Skip and continue
2. **Network Errors** (ETIMEDOUT, ECONNREFUSED): Retry with backoff
3. **Validation Errors**: Log and continue
4. **Configuration Errors**: Validate before writing, rollback on error

## Documentation

### Quick Start Guides
- [SETUP.md](./SETUP.md) - Initial setup instructions
- [AUTOMATED_FIX_QUICK_START.md](./AUTOMATED_FIX_QUICK_START.md) - Quick start for automated fixes
- [MONITORING_QUICK_START.md](./MONITORING_QUICK_START.md) - Quick start for monitoring
- [SITEMAP_QUICK_START.md](./SITEMAP_QUICK_START.md) - Sitemap management quick start
- [CANONICAL_QUICK_START.md](./CANONICAL_QUICK_START.md) - Canonical tags quick start
- [ROBOTSTXT_QUICK_START.md](./ROBOTSTXT_QUICK_START.md) - Robots.txt quick start

### Comprehensive Guides
- [COMPLETE_SCRIPT_REFERENCE.md](./COMPLETE_SCRIPT_REFERENCE.md) - Complete reference for all scripts
- [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md) - Troubleshooting common issues
- [MANUAL_STEPS_GUIDE.md](./MANUAL_STEPS_GUIDE.md) - Manual steps required after automated fixes
- [GSC_SUBMISSION_CHECKLIST.md](./GSC_SUBMISSION_CHECKLIST.md) - Checklist for GSC submission

### Module Documentation
- [IssueDetector.README.md](./IssueDetector.README.md) - Issue detection module
- [Soft404.README.md](./Soft404.README.md) - Soft 404 detection and fixing
- [Canonical.README.md](./Canonical.README.md) - Canonical tag management
- [Redirect.README.md](./Redirect.README.md) - Redirect optimization
- [Noindex.README.md](./Noindex.README.md) - Noindex tag management
- [Duplicate.README.md](./Duplicate.README.md) - Duplicate content detection
- [CrawlAnalyzer.README.md](./CrawlAnalyzer.README.md) - Crawl analysis
- [NotFound.README.md](./NotFound.README.md) - 404 error handling
- [Schema.README.md](./Schema.README.md) - Schema validation and fixing
- [SitemapManager.README.md](./SitemapManager.README.md) - Sitemap management
- [RobotsTxt.README.md](./RobotsTxt.README.md) - Robots.txt management
- [ReportGenerator.README.md](./ReportGenerator.README.md) - Report generation
- [FixExecutor.README.md](./FixExecutor.README.md) - Fix execution
- [Monitoring.README.md](./Monitoring.README.md) - Monitoring service

### Implementation Summaries
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Overall implementation summary
- [CANONICAL_IMPLEMENTATION.md](./CANONICAL_IMPLEMENTATION.md) - Canonical implementation details
- [REDIRECT_IMPLEMENTATION.md](./REDIRECT_IMPLEMENTATION.md) - Redirect implementation details
- [NOINDEX_IMPLEMENTATION.md](./NOINDEX_IMPLEMENTATION.md) - Noindex implementation details
- [DUPLICATE_IMPLEMENTATION.md](./DUPLICATE_IMPLEMENTATION.md) - Duplicate detection implementation
- [CRAWL_IMPLEMENTATION.md](./CRAWL_IMPLEMENTATION.md) - Crawl analysis implementation
- [NOTFOUND_IMPLEMENTATION.md](./NOTFOUND_IMPLEMENTATION.md) - 404 handling implementation
- [SCHEMA_IMPLEMENTATION.md](./SCHEMA_IMPLEMENTATION.md) - Schema validation implementation
- [SITEMAP_IMPLEMENTATION.md](./SITEMAP_IMPLEMENTATION.md) - Sitemap implementation
- [ROBOTSTXT_IMPLEMENTATION.md](./ROBOTSTXT_IMPLEMENTATION.md) - Robots.txt implementation
- [REPORT_IMPLEMENTATION.md](./REPORT_IMPLEMENTATION.md) - Report generation implementation
- [FIXEXECUTOR_IMPLEMENTATION.md](./FIXEXECUTOR_IMPLEMENTATION.md) - Fix executor implementation

## Next Steps

After setting up the core utilities, the next tasks will implement:

1. Issue Detector Module
2. Schema Validator Module
3. Sitemap Manager Module
4. Fix Executor Module
5. Report Generator Module

Each module will use these core utilities for logging, error handling, and common operations.
