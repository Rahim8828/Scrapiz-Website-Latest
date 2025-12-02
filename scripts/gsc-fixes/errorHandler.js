import fs from 'fs/promises';
import path from 'path';

/**
 * Error Handler for GSC Fix System
 * Provides backup, rollback, and error recovery functionality
 */
class ErrorHandler {
  constructor(logger) {
    this.logger = logger;
    this.backupDir = path.join(process.cwd(), 'scripts/gsc-fixes/backups');
  }

  /**
   * Initialize backup directory
   */
  async initialize() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      this.logger.info('Backup directory initialized');
    } catch (error) {
      this.logger.error('Failed to initialize backup directory', error);
      throw error;
    }
  }

  /**
   * Handles errors with appropriate recovery strategy
   * @param {Error} error - The error object
   * @param {string} context - Context where error occurred
   * @returns {ErrorRecoveryResult}
   */
  handleError(error, context) {
    // Log error with context
    this.logError(error, context);
    
    // Determine recovery strategy
    const strategy = this.getRecoveryStrategy(error);
    
    // Execute recovery
    return this.executeRecovery(strategy, error, context);
  }

  /**
   * Log error with context
   * @param {Error} error - The error object
   * @param {string} context - Context where error occurred
   */
  logError(error, context) {
    this.logger.error(`Error in ${context}`, {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
  }

  /**
   * Determine recovery strategy based on error type
   * @param {Error} error - The error object
   * @returns {string} Recovery strategy
   */
  getRecoveryStrategy(error) {
    if (error.code === 'ENOENT') {
      return 'skip';
    }
    if (error.code === 'EACCES') {
      return 'skip';
    }
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      return 'retry';
    }
    if (error.name === 'ValidationError') {
      return 'log';
    }
    return 'log';
  }

  /**
   * Execute recovery strategy
   * @param {string} strategy - Recovery strategy
   * @param {Error} error - The error object
   * @param {string} context - Context where error occurred
   * @returns {ErrorRecoveryResult}
   */
  executeRecovery(strategy, error, context) {
    switch (strategy) {
      case 'skip':
        this.logger.warn(`Skipping ${context} due to error: ${error.message}`);
        return { recovered: true, action: 'skipped', message: error.message };
      
      case 'retry':
        this.logger.info(`Will retry ${context}`);
        return { recovered: false, action: 'retry', message: error.message };
      
      case 'log':
      default:
        this.logger.error(`Logged error in ${context}: ${error.message}`);
        return { recovered: true, action: 'logged', message: error.message };
    }
  }

  /**
   * Creates backup before making changes
   * @param {string} filePath - File to backup
   * @returns {Promise<string>} Backup file path
   */
  async createBackup(filePath) {
    try {
      const timestamp = Date.now();
      const fileName = path.basename(filePath);
      const backupPath = path.join(this.backupDir, `${fileName}.backup.${timestamp}`);
      
      await fs.copyFile(filePath, backupPath);
      this.logger.info(`Created backup: ${backupPath}`);
      
      return backupPath;
    } catch (error) {
      this.logger.error(`Failed to create backup for ${filePath}`, error);
      throw error;
    }
  }

  /**
   * Rolls back changes if error occurs
   * @param {string} backupPath - Backup file path
   * @param {string} originalPath - Original file path
   * @returns {Promise<void>}
   */
  async rollback(backupPath, originalPath) {
    try {
      await fs.copyFile(backupPath, originalPath);
      await fs.unlink(backupPath);
      this.logger.info(`Rolled back changes to ${originalPath}`);
    } catch (error) {
      this.logger.error(`Failed to rollback ${originalPath}`, error);
      throw error;
    }
  }

  /**
   * Retry operation with exponential backoff
   * @param {Function} operation - Operation to retry
   * @param {number} maxAttempts - Maximum retry attempts
   * @param {number} initialDelay - Initial delay in ms
   * @returns {Promise<any>}
   */
  async retryWithBackoff(operation, maxAttempts = 3, initialDelay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxAttempts) {
          const delay = initialDelay * Math.pow(2, attempt - 1);
          this.logger.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    this.logger.error(`All ${maxAttempts} attempts failed`);
    throw lastError;
  }

  /**
   * Clean up old backups
   * @param {number} maxAge - Maximum age in milliseconds
   */
  async cleanupOldBackups(maxAge = 7 * 24 * 60 * 60 * 1000) {
    try {
      const files = await fs.readdir(this.backupDir);
      const now = Date.now();
      
      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filePath);
          this.logger.info(`Deleted old backup: ${file}`);
        }
      }
    } catch (error) {
      this.logger.error('Failed to cleanup old backups', error);
    }
  }
}

export default ErrorHandler;
