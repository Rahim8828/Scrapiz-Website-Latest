#!/usr/bin/env node

/**
 * Example Automated Fix Workflow
 * Demonstrates how to use the automated fix script programmatically
 */

import AutomatedFixScript from './apply-all-fixes.js';

async function runExampleWorkflow() {
  console.log('='.repeat(80));
  console.log('EXAMPLE: Automated Fix Workflow');
  console.log('='.repeat(80));
  console.log('');

  // Example 1: Dry run to see what would be fixed
  console.log('Example 1: Running dry-run to preview fixes...');
  console.log('-'.repeat(80));
  
  const dryRunScript = new AutomatedFixScript({
    dryRun: true,
    batchSize: 5
  });

  const dryRunResult = await dryRunScript.run();

  if (dryRunResult.success) {
    console.log('✓ Dry run completed successfully');
    console.log(`  Total issues: ${dryRunResult.issueReport?.summary.totalIssues || 0}`);
    console.log(`  Would fix: ${dryRunResult.fixResults?.summary.totalFixed || 0}`);
    console.log(`  Would skip: ${dryRunResult.fixResults?.summary.totalSkipped || 0}`);
  } else {
    console.log('✗ Dry run failed:', dryRunResult.error);
  }

  console.log('');
  console.log('='.repeat(80));
  console.log('');

  // Example 2: Apply fixes (commented out for safety)
  console.log('Example 2: Applying fixes (COMMENTED OUT FOR SAFETY)');
  console.log('-'.repeat(80));
  console.log('To apply fixes for real, uncomment the code below:');
  console.log('');
  console.log('  const fixScript = new AutomatedFixScript({');
  console.log('    dryRun: false,');
  console.log('    createBackup: true,');
  console.log('    trackFixes: true,');
  console.log('    batchSize: 10');
  console.log('  });');
  console.log('');
  console.log('  const result = await fixScript.run();');
  console.log('');

  /*
  // Uncomment to actually apply fixes
  const fixScript = new AutomatedFixScript({
    dryRun: false,
    createBackup: true,
    trackFixes: true,
    batchSize: 10
  });

  const result = await fixScript.run();

  if (result.success) {
    console.log('✓ Fixes applied successfully');
    console.log(`  Fixed: ${result.fixResults.summary.totalFixed}`);
    console.log(`  Failed: ${result.fixResults.summary.totalFailed}`);
    console.log(`  Skipped: ${result.fixResults.summary.totalSkipped}`);
    console.log('');
    console.log('Reports generated:');
    console.log(`  Summary: ${result.reportPaths.summary}`);
    console.log(`  Detailed: ${result.reportPaths.detailed}`);
    console.log(`  JSON: ${result.reportPaths.json}`);
  } else {
    console.log('✗ Fix process failed:', result.error);
  }
  */

  console.log('='.repeat(80));
}

// Run the example
runExampleWorkflow()
  .then(() => {
    console.log('\n✓ Example workflow completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n✗ Example workflow failed:', error);
    process.exit(1);
  });
