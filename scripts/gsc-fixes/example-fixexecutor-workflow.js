import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import FixExecutor from './FixExecutor.js';
import IssueDetector from './IssueDetector.js';

/**
 * Example workflow demonstrating Fix Executor usage
 */

async function main() {
  console.log('=== Fix Executor Example Workflow ===\n');

  // Initialize logger
  const logger = new Logger();
  await logger.initialize();
  console.log('✓ Logger initialized\n');

  // Initialize error handler
  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();
  console.log('✓ Error handler initialized\n');

  // Initialize fix executor
  const fixExecutor = new FixExecutor(logger, errorHandler);
  await fixExecutor.initialize();
  console.log('✓ Fix executor initialized\n');

  // Example 1: Dry Run
  console.log('--- Example 1: Dry Run ---');
  const mockIssues = {
    soft404: [
      {
        url: 'https://example.com/thin-page',
        reason: 'thin-content',
        wordCount: 150,
        hasHeadings: false,
        hasInternalLinks: false,
        fixable: true
      }
    ],
    canonical: [
      {
        url: 'https://example.com/page1',
        currentCanonical: null,
        expectedCanonical: 'https://example.com/page1',
        issueType: 'missing',
        fixable: true
      }
    ],
    redirects: [
      {
        url: 'https://example.com/old-page',
        redirectChain: [
          'https://example.com/old-page',
          'https://example.com/temp-page',
          'https://example.com/new-page'
        ],
        finalDestination: 'https://example.com/new-page',
        redirectType: 301,
        hasChain: true,
        isPermanent: true,
        chainLength: 3
      }
    ]
  };

  console.log('Running dry run with mock issues...');
  const dryRunResults = await fixExecutor.executeAllFixes(mockIssues, {
    dryRun: true,
    batchSize: 5
  });

  console.log('\nDry Run Results:');
  console.log(`- Total issues: ${dryRunResults.totalIssues}`);
  console.log(`- Would fix: ${dryRunResults.summary.totalFixed}`);
  console.log(`- Would fail: ${dryRunResults.summary.totalFailed}`);
  console.log(`- Would skip: ${dryRunResults.summary.totalSkipped}`);
  console.log(`- Duration: ${dryRunResults.duration}ms\n`);

  // Example 2: Batch Processing
  console.log('--- Example 2: Batch Processing ---');
  const largeMockIssues = {
    canonical: Array.from({ length: 25 }, (_, i) => ({
      url: `https://example.com/page${i + 1}`,
      currentCanonical: null,
      expectedCanonical: `https://example.com/page${i + 1}`,
      issueType: 'missing',
      fixable: true
    }))
  };

  console.log(`Processing ${largeMockIssues.canonical.length} issues in batches of 10...`);
  const batchResults = await fixExecutor.executeAllFixes(largeMockIssues, {
    dryRun: true,
    batchSize: 10
  });

  console.log('\nBatch Processing Results:');
  console.log(`- Total batches: ${batchResults.results.canonical?.batches?.length || 0}`);
  console.log(`- Issues per batch: 10`);
  console.log(`- Total processed: ${batchResults.totalIssues}`);
  console.log(`- Duration: ${batchResults.duration}ms\n`);

  // Example 3: Fix Tracking
  console.log('--- Example 3: Fix Tracking ---');
  
  // Simulate a fix execution (dry run)
  await fixExecutor.executeAllFixes(mockIssues, {
    dryRun: false, // Would normally be false for real fixes
    batchSize: 10,
    trackFixes: true
  });

  // Get fix history
  const history = fixExecutor.getFixHistory();
  console.log(`\nFix History: ${history.length} executions`);
  
  if (history.length > 0) {
    const latest = history[history.length - 1];
    console.log('\nLatest Execution:');
    console.log(`- ID: ${latest.executionId}`);
    console.log(`- Timestamp: ${latest.timestamp}`);
    console.log(`- Fixed: ${latest.summary.totalFixed}`);
    console.log(`- Failed: ${latest.summary.totalFailed}`);
    console.log(`- Skipped: ${latest.summary.totalSkipped}`);
    console.log(`- Duration: ${latest.duration}ms`);
  }

  // Get statistics
  const stats = fixExecutor.getFixStatistics();
  console.log('\nOverall Statistics:');
  console.log(`- Total executions: ${stats.totalExecutions}`);
  console.log(`- Total fixed: ${stats.totalFixed}`);
  console.log(`- Total failed: ${stats.totalFailed}`);
  console.log(`- Average duration: ${stats.averageDuration}ms`);
  
  if (Object.keys(stats.byType).length > 0) {
    console.log('\nBy Type:');
    for (const [type, typeStat] of Object.entries(stats.byType)) {
      console.log(`  ${type}:`);
      console.log(`    - Fixed: ${typeStat.fixed}`);
      console.log(`    - Failed: ${typeStat.failed}`);
      console.log(`    - Skipped: ${typeStat.skipped}`);
    }
  }

  // Example 4: Error Recovery
  console.log('\n--- Example 4: Error Recovery ---');
  console.log('Demonstrating backup and rollback...');
  
  // Create a test backup
  const backupPath = await fixExecutor.createMasterBackup();
  console.log(`✓ Master backup created: ${backupPath}`);
  
  // Simulate rollback
  if (history.length > 0) {
    const executionId = history[history.length - 1].executionId;
    console.log(`\nAttempting rollback of execution: ${executionId}`);
    
    const rollbackResult = await fixExecutor.rollbackFixExecution(executionId);
    if (rollbackResult.success) {
      console.log(`✓ Rollback successful`);
    } else {
      console.log(`✗ Rollback failed: ${rollbackResult.message}`);
    }
  }

  // Example 5: Comprehensive Fix Execution
  console.log('\n--- Example 5: Comprehensive Fix Execution ---');
  
  const comprehensiveIssues = {
    soft404: [
      {
        url: 'https://example.com/thin1',
        reason: 'thin-content',
        wordCount: 200,
        hasHeadings: true,
        hasInternalLinks: false,
        fixable: true
      }
    ],
    canonical: [
      {
        url: 'https://example.com/dup1',
        currentCanonical: null,
        expectedCanonical: 'https://example.com/main',
        issueType: 'missing',
        fixable: true
      }
    ],
    redirects: [
      {
        url: 'https://example.com/old',
        redirectChain: ['https://example.com/old', 'https://example.com/new'],
        finalDestination: 'https://example.com/new',
        redirectType: 301,
        hasChain: false,
        isPermanent: true,
        chainLength: 2
      }
    ],
    noindex: [
      {
        url: 'https://example.com/valuable',
        noindexSource: 'meta-tag',
        shouldBeIndexed: true,
        hasMetaNoindex: true,
        hasHeaderNoindex: false,
        isRobotsBlocked: false,
        fixable: true
      }
    ],
    duplicates: [
      {
        url: 'https://example.com/dup2',
        duplicateOf: 'https://example.com/main',
        similarityScore: 0.95,
        hasCanonical: false,
        canonicalTarget: null,
        fixable: true
      }
    ],
    notFound: [
      {
        url: 'https://example.com/missing',
        hasValue: true,
        hasBacklinks: true,
        internalLinksCount: 3,
        suggestedTarget: 'https://example.com/similar'
      }
    ],
    invalidSchema: [
      {
        url: 'https://example.com/page-with-schema',
        schemaType: 'LocalBusiness',
        issues: [
          {
            schemaType: 'LocalBusiness',
            schema: {
              '@type': 'LocalBusiness',
              name: 'Test Business'
            },
            errors: [
              { field: 'address', message: 'Missing required field', severity: 'error' },
              { field: 'telephone', message: 'Missing required field', severity: 'error' }
            ]
          }
        ],
        fixable: true
      }
    ]
  };

  console.log('Executing comprehensive fix with all issue types...');
  const comprehensiveResults = await fixExecutor.executeAllFixes(comprehensiveIssues, {
    dryRun: true,
    batchSize: 5,
    createBackup: true,
    trackFixes: true
  });

  console.log('\nComprehensive Results:');
  console.log(`- Total issues: ${comprehensiveResults.totalIssues}`);
  console.log(`- Fixed: ${comprehensiveResults.summary.totalFixed}`);
  console.log(`- Failed: ${comprehensiveResults.summary.totalFailed}`);
  console.log(`- Skipped: ${comprehensiveResults.summary.totalSkipped}`);
  console.log(`- Duration: ${comprehensiveResults.duration}ms`);
  
  console.log('\nBy Issue Type:');
  for (const [type, result] of Object.entries(comprehensiveResults.results)) {
    console.log(`  ${type}:`);
    console.log(`    - Fixed: ${result.issuesFixed || 0}`);
    console.log(`    - Failed: ${result.issuesFailed || 0}`);
    console.log(`    - Skipped: ${result.issuesSkipped || 0}`);
  }

  console.log('\n=== Workflow Complete ===');
}

// Run the example
main().catch(error => {
  console.error('Error running example:', error);
  process.exit(1);
});
