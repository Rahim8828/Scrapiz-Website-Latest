#!/usr/bin/env node

/**
 * Rollback Script
 * Rolls back fixes from a specific execution
 * 
 * Usage:
 *   node scripts/gsc-fixes/rollback-fixes.js <executionId>
 *   node scripts/gsc-fixes/rollback-fixes.js --list
 */

import FixExecutor from './FixExecutor.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

class RollbackScript {
  constructor() {
    this.logger = new Logger();
    this.errorHandler = new ErrorHandler(this.logger);
    this.fixExecutor = new FixExecutor(this.logger, this.errorHandler);
  }

  /**
   * Initialize the rollback script
   */
  async initialize() {
    await this.fixExecutor.initialize();
  }

  /**
   * List all fix executions
   */
  async listExecutions() {
    const history = this.fixExecutor.getFixHistory();

    if (history.length === 0) {
      console.log('No fix executions found in history.');
      return;
    }

    console.log('\n' + '='.repeat(80));
    console.log('FIX EXECUTION HISTORY');
    console.log('='.repeat(80));
    console.log('');

    history.forEach((record, index) => {
      console.log(`${index + 1}. Execution ID: ${record.executionId}`);
      console.log(`   Timestamp: ${record.timestamp}`);
      console.log(`   Fixed: ${record.summary.totalFixed}`);
      console.log(`   Failed: ${record.summary.totalFailed}`);
      console.log(`   Skipped: ${record.summary.totalSkipped}`);
      console.log(`   Duration: ${(record.duration / 1000).toFixed(2)}s`);
      console.log(`   Backup: ${record.masterBackupPath || 'None'}`);
      console.log('');
    });

    console.log('='.repeat(80));
    console.log('');
    console.log('To rollback a specific execution, run:');
    console.log('  node scripts/gsc-fixes/rollback-fixes.js <executionId>');
    console.log('');
  }

  /**
   * Rollback a specific execution
   * @param {string} executionId - Execution ID to rollback
   */
  async rollback(executionId) {
    console.log('\n' + '='.repeat(80));
    console.log('ROLLBACK PROCESS');
    console.log('='.repeat(80));
    console.log(`Execution ID: ${executionId}`);
    console.log('');

    const result = await this.fixExecutor.rollbackFixExecution(executionId);

    if (result.success) {
      console.log('✓ Rollback successful');
      console.log(`  ${result.message}`);
      console.log(`  Backup restored from: ${result.backupPath}`);
      console.log('');
      console.log('='.repeat(80));
      return true;
    } else {
      console.error('✗ Rollback failed');
      console.error(`  ${result.message}`);
      console.log('');
      console.log('='.repeat(80));
      return false;
    }
  }

  /**
   * Show fix statistics
   */
  async showStatistics() {
    const stats = this.fixExecutor.getFixStatistics();

    console.log('\n' + '='.repeat(80));
    console.log('FIX STATISTICS');
    console.log('='.repeat(80));
    console.log('');
    console.log(`Total Executions: ${stats.totalExecutions}`);
    console.log(`Total Fixed: ${stats.totalFixed}`);
    console.log(`Total Failed: ${stats.totalFailed}`);
    console.log(`Total Skipped: ${stats.totalSkipped}`);
    console.log(`Average Duration: ${(stats.averageDuration / 1000).toFixed(2)}s`);
    console.log('');

    if (Object.keys(stats.byType).length > 0) {
      console.log('By Issue Type:');
      for (const [type, typeStat] of Object.entries(stats.byType)) {
        console.log(`  ${type}:`);
        console.log(`    Fixed: ${typeStat.fixed}`);
        console.log(`    Failed: ${typeStat.failed}`);
        console.log(`    Skipped: ${typeStat.skipped}`);
      }
      console.log('');
    }

    console.log('='.repeat(80));
  }

  /**
   * Run the rollback script
   * @param {Array<string>} args - Command line arguments
   */
  async run(args) {
    try {
      await this.initialize();

      if (args.length === 0) {
        console.error('Error: Missing execution ID');
        console.error('');
        console.error('Usage:');
        console.error('  node scripts/gsc-fixes/rollback-fixes.js <executionId>');
        console.error('  node scripts/gsc-fixes/rollback-fixes.js --list');
        console.error('  node scripts/gsc-fixes/rollback-fixes.js --stats');
        process.exit(1);
      }

      const command = args[0];

      if (command === '--list' || command === '-l') {
        await this.listExecutions();
        return { success: true };
      }

      if (command === '--stats' || command === '-s') {
        await this.showStatistics();
        return { success: true };
      }

      // Otherwise, treat as execution ID
      const executionId = command;
      const success = await this.rollback(executionId);

      return { success };
    } catch (error) {
      this.logger.error('Rollback script failed', { error: error.message });
      console.error('\n✗ Rollback failed:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const rollbackScript = new RollbackScript();

  rollbackScript.run(args)
    .then(result => {
      if (result.success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n✗ Rollback script failed with error:', error);
      process.exit(1);
    });
}

export default RollbackScript;
