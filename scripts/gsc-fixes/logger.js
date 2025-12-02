import fs from 'fs/promises';
import path from 'path';

/**
 * Logger for GSC Fix System
 * Tracks issues, fixes, and system operations
 */
class Logger {
  constructor(logDir = 'scripts/gsc-fixes/logs') {
    this.logDir = path.join(process.cwd(), logDir);
    this.logFile = null;
    this.sessionId = Date.now();
  }

  /**
   * Initialize logger and create log directory
   */
  async initialize() {
    try {
      await fs.mkdir(this.logDir, { recursive: true });
      this.logFile = path.join(this.logDir, `gsc-fixes-${this.sessionId}.log`);
      await this.log('INFO', 'Logger initialized');
    } catch (error) {
      console.error('Failed to initialize logger:', error);
      throw error;
    }
  }

  /**
   * Write log entry
   * @param {string} level - Log level (INFO, WARN, ERROR, DEBUG)
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  async log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      sessionId: this.sessionId,
      ...(data && { data })
    };

    const logLine = JSON.stringify(logEntry) + '\n';

    // Write to file
    try {
      if (this.logFile) {
        await fs.appendFile(this.logFile, logLine);
      }
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }

    // Also output to console
    const consoleMessage = `[${timestamp}] ${level}: ${message}`;
    switch (level) {
      case 'ERROR':
        console.error(consoleMessage, data || '');
        break;
      case 'WARN':
        console.warn(consoleMessage, data || '');
        break;
      case 'DEBUG':
        console.debug(consoleMessage, data || '');
        break;
      default:
        console.log(consoleMessage, data || '');
    }
  }

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  async info(message, data = null) {
    await this.log('INFO', message, data);
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  async warn(message, data = null) {
    await this.log('WARN', message, data);
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  async error(message, data = null) {
    await this.log('ERROR', message, data);
  }

  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  async debug(message, data = null) {
    await this.log('DEBUG', message, data);
  }

  /**
   * Log issue detection
   * @param {string} issueType - Type of issue
   * @param {string} url - Affected URL
   * @param {Object} details - Issue details
   */
  async logIssue(issueType, url, details) {
    await this.log('INFO', `Issue detected: ${issueType}`, {
      issueType,
      url,
      details
    });
  }

  /**
   * Log fix application
   * @param {string} fixType - Type of fix
   * @param {string} url - Affected URL
   * @param {boolean} success - Whether fix was successful
   * @param {Object} details - Fix details
   */
  async logFix(fixType, url, success, details = null) {
    const level = success ? 'INFO' : 'ERROR';
    const message = success 
      ? `Fix applied: ${fixType}` 
      : `Fix failed: ${fixType}`;
    
    await this.log(level, message, {
      fixType,
      url,
      success,
      details
    });
  }

  /**
   * Get log file path
   * @returns {string} Log file path
   */
  getLogFilePath() {
    return this.logFile;
  }

  /**
   * Read logs from file
   * @param {number} lines - Number of lines to read (0 for all)
   * @returns {Promise<Array>} Array of log entries
   */
  async readLogs(lines = 0) {
    try {
      const content = await fs.readFile(this.logFile, 'utf-8');
      const logLines = content.trim().split('\n');
      
      const logs = logLines.map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      }).filter(Boolean);

      if (lines > 0) {
        return logs.slice(-lines);
      }
      
      return logs;
    } catch (error) {
      console.error('Failed to read logs:', error);
      return [];
    }
  }

  /**
   * Get logs by level
   * @param {string} level - Log level to filter
   * @returns {Promise<Array>} Filtered log entries
   */
  async getLogsByLevel(level) {
    const logs = await this.readLogs();
    return logs.filter(log => log.level === level);
  }

  /**
   * Get issue summary from logs
   * @returns {Promise<Object>} Issue summary
   */
  async getIssueSummary() {
    const logs = await this.readLogs();
    const issues = logs.filter(log => 
      log.message && log.message.startsWith('Issue detected:')
    );

    const summary = {};
    issues.forEach(issue => {
      const type = issue.data?.issueType || 'unknown';
      summary[type] = (summary[type] || 0) + 1;
    });

    return summary;
  }

  /**
   * Get fix summary from logs
   * @returns {Promise<Object>} Fix summary
   */
  async getFixSummary() {
    const logs = await this.readLogs();
    const fixes = logs.filter(log => 
      log.message && (log.message.startsWith('Fix applied:') || log.message.startsWith('Fix failed:'))
    );

    const summary = {
      successful: 0,
      failed: 0,
      byType: {}
    };

    fixes.forEach(fix => {
      if (fix.data?.success) {
        summary.successful++;
      } else {
        summary.failed++;
      }

      const type = fix.data?.fixType || 'unknown';
      if (!summary.byType[type]) {
        summary.byType[type] = { successful: 0, failed: 0 };
      }
      
      if (fix.data?.success) {
        summary.byType[type].successful++;
      } else {
        summary.byType[type].failed++;
      }
    });

    return summary;
  }

  /**
   * Clean up old log files
   * @param {number} maxAge - Maximum age in milliseconds
   */
  async cleanupOldLogs(maxAge = 30 * 24 * 60 * 60 * 1000) {
    try {
      const files = await fs.readdir(this.logDir);
      const now = Date.now();
      
      for (const file of files) {
        if (!file.startsWith('gsc-fixes-')) continue;
        
        const filePath = path.join(this.logDir, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filePath);
          console.log(`Deleted old log file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Failed to cleanup old logs:', error);
    }
  }
}

export default Logger;
