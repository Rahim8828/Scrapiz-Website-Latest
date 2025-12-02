# Fix Executor Orchestrator

The Fix Executor is the central orchestrator that coordinates all GSC fix modules. It provides backup, rollback, fix tracking, and batch processing capabilities.

## Features

- **Coordinated Fixing**: Orchestrates all fixer modules (Soft404, Canonical, Redirect, Noindex, NotFound, Schema)
- **Backup & Rollback**: Creates master backups before applying fixes and can rollback on errors
- **Fix Tracking**: Tracks all fix executions with timestamps and results
- **Batch Processing**: Processes large sets of issues in configurable batches
- **Error Recovery**: Handles errors gracefully with automatic rollback
- **Statistics**: Provides comprehensive statistics on fix history

## Usage

### Basic Usage

```javascript
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import FixExecutor from './FixExecutor.js';
import IssueDetector from './IssueDetector.js';

// Initialize
const logger = new Logger();
await logger.initialize();

const errorHandler = new ErrorHandler(logger);
await errorHandler.initialize();

const fixExecutor = new FixExecutor(logger, errorHandler);
await fixExecutor.initialize();

// Detect issues
const detector = new IssueDetector(logger, errorHandler);
const issues = await detector.detectAllIssues();

// Execute all fixes
const results = await fixExecutor.executeAllFixes(issues, {
  dryRun: false,
  batchSize: 10,
  createBackup: true,
  trackFixes: true
});

console.log('Fix Results:', results);
```

### Dry Run Mode

Test fixes without making actual changes:

```javascript
const results = await fixExecutor.executeAllFixes(issues, {
  dryRun: true,
  batchSize: 10
});

console.log('Dry run results:', results);
```

### Custom Batch Size

Process issues in smaller or larger batches:

```javascript
// Small batches for careful processing
const results = await fixExecutor.executeAllFixes(issues, {
  batchSize: 5
});

// Large batches for faster processing
const results = await fixExecutor.executeAllFixes(issues, {
  batchSize: 50
});
```

### Fix Tracking

View fix history and statistics:

```javascript
// Get all fix history
const history = fixExecutor.getFixHistory();

// Get history since a specific date
const recentHistory = fixExecutor.getFixHistory({
  since: '2024-01-01'
});

// Get specific execution
const execution = fixExecutor.getFixHistory({
  executionId: 'fix-1234567890'
});

// Get statistics
const stats = fixExecutor.getFixStatistics();
console.log('Total fixes:', stats.totalFixed);
console.log('Average duration:', stats.averageDuration);
console.log('By type:', stats.byType);
```

### Rollback

Rollback a specific fix execution:

```javascript
const rollbackResult = await fixExecutor.rollbackFixExecution('fix-1234567890');

if (rollbackResult.success) {
  console.log('Rollback successful');
} else {
  console.error('Rollback failed:', rollbackResult.message);
}
```

## Options

### executeAllFixes(issues, options)

Execute fixes for all detected issues.

**Parameters:**
- `issues` (Object): Issues object from IssueDetector
- `options` (Object): Fix options
  - `dryRun` (boolean): If true, simulate fixes without making changes (default: false)
  - `batchSize` (number): Number of issues to process per batch (default: 10)
  - `createBackup` (boolean): Create master backup before fixing (default: true)
  - `trackFixes` (boolean): Track fix execution in history (default: true)

**Returns:** Promise<Object> - Comprehensive fix result

**Result Structure:**
```javascript
{
  executionId: 'fix-1234567890',
  timestamp: '2024-01-01T12:00:00.000Z',
  dryRun: false,
  masterBackupPath: '/path/to/backup',
  totalIssues: 100,
  results: {
    soft404: { issuesFixed: 10, issuesFailed: 2, ... },
    canonical: { issuesFixed: 15, issuesFailed: 0, ... },
    redirects: { issuesFixed: 8, issuesFailed: 1, ... },
    // ... other issue types
  },
  summary: {
    totalFixed: 50,
    totalFailed: 5,
    totalSkipped: 45,
    byType: {
      soft404: { fixed: 10, failed: 2, skipped: 7 },
      // ... other types
    }
  },
  duration: 5432
}
```

## Batch Processing

The Fix Executor processes issues in batches to:
- Avoid overwhelming the system
- Provide progress feedback
- Allow for graceful error recovery
- Enable parallel processing (future enhancement)

### How Batching Works

1. Issues are split into batches of configurable size
2. Each batch is processed sequentially
3. Results are aggregated after each batch
4. Errors in one batch don't stop processing of other batches

### Choosing Batch Size

- **Small batches (5-10)**: More granular progress, easier to debug, slower overall
- **Medium batches (10-20)**: Good balance for most use cases
- **Large batches (50+)**: Faster processing, less granular feedback

## Backup & Rollback

### Master Backup

Before applying fixes, the Fix Executor creates a master backup of critical files:
- `public/.htaccess`
- `public/sitemap.xml`
- `public/robots.txt`

The backup is stored in `scripts/gsc-fixes/backups/master-{timestamp}/`

### Automatic Rollback

If an error occurs during fix execution, the Fix Executor automatically attempts to rollback all changes using the master backup.

### Manual Rollback

You can manually rollback a specific fix execution:

```javascript
const result = await fixExecutor.rollbackFixExecution('fix-1234567890');
```

## Fix Tracking

All fix executions are tracked in `scripts/gsc-fixes/fix-tracking.json`.

### Tracked Information

- Execution ID
- Timestamp
- Summary (fixed, failed, skipped counts)
- Duration
- Master backup path

### Querying Fix History

```javascript
// Get all history
const allHistory = fixExecutor.getFixHistory();

// Filter by date
const recentHistory = fixExecutor.getFixHistory({
  since: '2024-01-01'
});

// Get specific execution
const execution = fixExecutor.getFixHistory({
  executionId: 'fix-1234567890'
});
```

### Fix Statistics

```javascript
const stats = fixExecutor.getFixStatistics();

// Output:
{
  totalExecutions: 10,
  totalFixed: 500,
  totalFailed: 50,
  totalSkipped: 100,
  averageDuration: 5000,
  byType: {
    soft404: { fixed: 100, failed: 10, skipped: 20 },
    canonical: { fixed: 150, failed: 5, skipped: 30 },
    // ... other types
  }
}
```

## Error Handling

The Fix Executor uses the ErrorHandler module for:
- Creating backups before changes
- Rolling back on errors
- Retrying failed operations
- Logging errors with context

### Error Recovery Strategy

1. **Batch-level errors**: Log error, continue with next batch
2. **Critical errors**: Attempt automatic rollback
3. **File errors**: Skip file, continue with others
4. **Network errors**: Retry with exponential backoff

## Integration with Other Modules

The Fix Executor integrates with:

- **IssueDetector**: Receives detected issues
- **All Fixers**: Coordinates fix execution
- **Logger**: Logs all operations
- **ErrorHandler**: Handles errors and backups
- **ReportGenerator**: Can generate reports from results

## Best Practices

1. **Always use dry run first**: Test fixes before applying
2. **Start with small batches**: Use smaller batches for initial runs
3. **Monitor logs**: Check logs for warnings and errors
4. **Keep backups**: Don't delete master backups immediately
5. **Review results**: Check fix results before proceeding
6. **Track history**: Use fix tracking to monitor improvements over time

## Example Workflow

```javascript
// 1. Initialize
const logger = new Logger();
await logger.initialize();

const errorHandler = new ErrorHandler(logger);
await errorHandler.initialize();

const fixExecutor = new FixExecutor(logger, errorHandler);
await fixExecutor.initialize();

// 2. Detect issues
const detector = new IssueDetector(logger, errorHandler);
const issues = await detector.detectAllIssues();

// 3. Dry run first
console.log('Running dry run...');
const dryRunResults = await fixExecutor.executeAllFixes(issues, {
  dryRun: true
});
console.log('Dry run complete:', dryRunResults.summary);

// 4. Review and confirm
// ... user reviews results ...

// 5. Execute actual fixes
console.log('Executing fixes...');
const results = await fixExecutor.executeAllFixes(issues, {
  dryRun: false,
  batchSize: 10,
  createBackup: true,
  trackFixes: true
});

// 6. Review results
console.log('Fixes complete:', results.summary);
console.log('Backup location:', results.masterBackupPath);

// 7. Check statistics
const stats = fixExecutor.getFixStatistics();
console.log('Overall statistics:', stats);
```

## Troubleshooting

### Fixes Not Being Applied

- Check if dry run mode is enabled
- Verify file permissions
- Check error logs for specific issues

### Rollback Not Working

- Verify backup path exists
- Check file permissions
- Ensure backup was created before fixes

### Slow Performance

- Increase batch size
- Check for network issues
- Review logs for bottlenecks

### Tracking Not Working

- Verify write permissions for fix-tracking.json
- Check disk space
- Review error logs

## Requirements

Validates: Requirements 11.3 (Fix tracking with timestamps)

## Related Modules

- [IssueDetector](./IssueDetector.README.md)
- [ErrorHandler](./errorHandler.js)
- [Logger](./logger.js)
- [Soft404Fixer](./Soft404.README.md)
- [CanonicalFixer](./Canonical.README.md)
- [RedirectFixer](./Redirect.README.md)
- [NoindexFixer](./Noindex.README.md)
- [NotFoundFixer](./NotFound.README.md)
- [SchemaFixer](./Schema.README.md)
