#!/usr/bin/env node

console.log('Testing imports...');

try {
  console.log('Importing MainAudit...');
  const { default: MainAudit } = await import('./audit-all-issues.js');
  console.log('✓ MainAudit imported');

  console.log('Importing FixExecutor...');
  const { default: FixExecutor } = await import('./FixExecutor.js');
  console.log('✓ FixExecutor imported');

  console.log('Importing ReportGenerator...');
  const { default: ReportGenerator } = await import('./ReportGenerator.js');
  console.log('✓ ReportGenerator imported');

  console.log('Importing Logger...');
  const { default: Logger } = await import('./logger.js');
  console.log('✓ Logger imported');

  console.log('Importing ErrorHandler...');
  const { default: ErrorHandler } = await import('./errorHandler.js');
  console.log('✓ ErrorHandler imported');

  console.log('\n✓ All imports successful!');
} catch (error) {
  console.error('✗ Import failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
