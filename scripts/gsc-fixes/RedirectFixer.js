import fs from 'fs/promises';
import path from 'path';
import { normalizeUrl } from './utils.js';

/**
 * Redirect Fixer Module
 * Fixes redirect issues by flattening chains and updating .htaccess
 */
class RedirectFixer {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  /**
   * Fix redirect issues
   * @param {Array<Object>} issues - Array of redirect issues
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixRedirectIssues(issues, options = {}) {
    const {
      dryRun = false,
      flattenChains = true,
      convertToPermament = true,
      updateHtaccess = true
    } = options;

    this.logger.info(`Starting redirect fixes for ${issues.length} issues (dry run: ${dryRun})`);

    const results = {
      success: true,
      issuesFixed: 0,
      issuesFailed: 0,
      details: [],
      redirectRules: []
    };

    // Collect all redirect rules to add
    const redirectRules = [];

    for (const issue of issues) {
      try {
        const fixResult = await this.fixSingleRedirect(issue, { 
          dryRun, 
          flattenChains, 
          convertToPermament 
        });

        if (fixResult.success) {
          results.issuesFixed++;
          if (fixResult.redirectRule) {
            redirectRules.push(fixResult.redirectRule);
          }
        } else {
          results.issuesFailed++;
        }

        results.details.push(fixResult);
        await this.logger.logFix('redirect', issue.url, fixResult.success, fixResult);
      } catch (error) {
        results.issuesFailed++;
        results.success = false;

        const errorResult = {
          url: issue.url,
          status: 'failed',
          message: `Error: ${error.message}`
        };

        results.details.push(errorResult);
        await this.logger.logFix('redirect', issue.url, false, errorResult);
      }
    }

    // Always include redirect rules in results
    results.redirectRules = redirectRules;

    // Update .htaccess with all redirect rules
    if (updateHtaccess && redirectRules.length > 0) {
      try {
        const htaccessResult = await this.updateHtaccessWithRedirects(redirectRules, dryRun);
        results.htaccessUpdated = htaccessResult.success;
        results.htaccessPath = htaccessResult.path;
      } catch (error) {
        this.logger.error('Failed to update .htaccess', { error: error.message });
        results.htaccessUpdated = false;
        results.htaccessError = error.message;
      }
    }

    this.logger.info(`Redirect fixes complete: ${results.issuesFixed} fixed, ${results.issuesFailed} failed`);

    return results;
  }

  /**
   * Fix a single redirect issue
   * @param {Object} issue - Redirect issue
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixSingleRedirect(issue, options = {}) {
    const { dryRun, flattenChains, convertToPermament } = options;

    this.logger.info(`Fixing redirect: ${issue.url}`);

    const fixes = [];
    let redirectRule = null;

    // Flatten redirect chain
    if (flattenChains && issue.hasChain) {
      const sourceUrl = issue.url;
      const targetUrl = issue.finalDestination;

      redirectRule = this.generateRedirectRule(sourceUrl, targetUrl, 301);
      fixes.push(`Flatten chain: ${sourceUrl} -> ${targetUrl}`);
    }

    // Convert temporary to permanent
    if (convertToPermament && issue.isTemporary) {
      if (!redirectRule) {
        const sourceUrl = issue.url;
        const targetUrl = issue.finalDestination;
        redirectRule = this.generateRedirectRule(sourceUrl, targetUrl, 301);
      }
      fixes.push(`Convert ${issue.redirectTypeName} to 301 Permanent`);
    }

    // If no chain and already permanent, just create the rule
    if (!redirectRule && issue.isPermanent) {
      const sourceUrl = issue.url;
      const targetUrl = issue.finalDestination;
      redirectRule = this.generateRedirectRule(sourceUrl, targetUrl, 301);
      fixes.push('Ensure redirect is in .htaccess');
    }

    if (dryRun) {
      return {
        url: issue.url,
        status: 'dry-run',
        success: true,
        message: `Would apply fixes: ${fixes.join(', ')}`,
        redirectRule,
        fixes
      };
    }

    return {
      url: issue.url,
      status: 'fixed',
      success: true,
      message: `Applied fixes: ${fixes.join(', ')}`,
      redirectRule,
      fixes
    };
  }

  /**
   * Generate .htaccess redirect rule
   * @param {string} fromUrl - Source URL
   * @param {string} toUrl - Target URL
   * @param {number} statusCode - Redirect status code (301 or 302)
   * @returns {Object} Redirect rule object
   */
  generateRedirectRule(fromUrl, toUrl, statusCode = 301) {
    try {
      const fromUrlObj = new URL(fromUrl);
      const toUrlObj = new URL(toUrl);

      // Extract path from URLs
      let fromPath = fromUrlObj.pathname;
      let toPath = toUrlObj.pathname;

      // Remove leading slash for RewriteRule pattern
      const pattern = fromPath.startsWith('/') ? fromPath.substring(1) : fromPath;

      // Escape special regex characters in pattern
      const escapedPattern = this.escapeRegexPattern(pattern);

      // Determine redirect flag
      const redirectFlag = statusCode === 301 ? 'R=301' : 'R=302';

      // Generate RewriteRule
      const rule = `RewriteRule ^${escapedPattern}/?$ ${toPath} [${redirectFlag},L]`;

      return {
        from: fromUrl,
        to: toUrl,
        fromPath,
        toPath,
        statusCode,
        rule,
        pattern: escapedPattern
      };
    } catch (error) {
      this.logger.error('Error generating redirect rule', { 
        fromUrl, 
        toUrl, 
        error: error.message 
      });
      return null;
    }
  }

  /**
   * Escape special regex characters in pattern
   * @param {string} pattern - Pattern to escape
   * @returns {string} Escaped pattern
   */
  escapeRegexPattern(pattern) {
    // Escape special regex characters: . * + ? ^ $ { } ( ) | [ ] \
    return pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Update .htaccess file with redirect rules
   * @param {Array<Object>} redirectRules - Array of redirect rule objects
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Update result
   */
  async updateHtaccessWithRedirects(redirectRules, dryRun = false) {
    const htaccessPath = path.join(process.cwd(), 'public/.htaccess');

    try {
      // Read existing .htaccess or create new content
      let content = '';
      try {
        content = await fs.readFile(htaccessPath, 'utf-8');
      } catch (error) {
        // File doesn't exist, create new content
        content = '# Apache configuration\nRewriteEngine On\n\n';
        this.logger.info('.htaccess file not found, will create new one');
      }

      if (dryRun) {
        return {
          success: true,
          path: htaccessPath,
          message: `Would add ${redirectRules.length} redirect rules to .htaccess`,
          rules: redirectRules.map(r => r.rule)
        };
      }

      // Create backup
      const backupPath = await this.errorHandler.createBackup(htaccessPath);
      this.logger.info(`Created backup: ${backupPath}`);

      try {
        // Add redirect rules
        const updatedContent = this.addRedirectRulesToContent(content, redirectRules);

        // Write updated content
        await fs.writeFile(htaccessPath, updatedContent, 'utf-8');

        this.logger.info(`Updated .htaccess with ${redirectRules.length} redirect rules`);

        return {
          success: true,
          path: htaccessPath,
          backupPath,
          message: `Added ${redirectRules.length} redirect rules to .htaccess`,
          rules: redirectRules.map(r => r.rule)
        };
      } catch (error) {
        // Rollback on error
        await this.errorHandler.rollback(backupPath, htaccessPath);
        throw error;
      }
    } catch (error) {
      this.logger.error('Failed to update .htaccess', { error: error.message });
      return {
        success: false,
        path: htaccessPath,
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Add redirect rules to .htaccess content
   * @param {string} content - Current .htaccess content
   * @param {Array<Object>} redirectRules - Redirect rules to add
   * @returns {string} Updated content
   */
  addRedirectRulesToContent(content, redirectRules) {
    const lines = content.split('\n');

    // Find RewriteEngine On line
    let rewriteEngineIndex = lines.findIndex(line => 
      line.trim().toLowerCase() === 'rewriteengine on'
    );

    // If RewriteEngine On doesn't exist, add it at the beginning
    if (rewriteEngineIndex === -1) {
      lines.unshift('RewriteEngine On', '');
      rewriteEngineIndex = 0;
    }

    // Find where to insert redirect rules (after RewriteEngine On)
    let insertIndex = rewriteEngineIndex + 1;

    // Skip empty lines after RewriteEngine On
    while (insertIndex < lines.length && lines[insertIndex].trim() === '') {
      insertIndex++;
    }

    // Check for existing redirect section
    const redirectSectionIndex = lines.findIndex(line => 
      line.includes('# Redirect fixes') || line.includes('# GSC Redirect fixes')
    );

    if (redirectSectionIndex !== -1) {
      // Insert after existing redirect section header
      insertIndex = redirectSectionIndex + 1;
    } else {
      // Add redirect section header
      lines.splice(insertIndex, 0, '# GSC Redirect fixes');
      insertIndex++;
    }

    // Add each redirect rule
    const rulesToAdd = [];
    for (const redirectRule of redirectRules) {
      // Check if rule already exists
      if (!content.includes(redirectRule.rule)) {
        rulesToAdd.push(redirectRule.rule);
      } else {
        this.logger.info(`Redirect rule already exists: ${redirectRule.rule}`);
      }
    }

    if (rulesToAdd.length > 0) {
      lines.splice(insertIndex, 0, ...rulesToAdd, '');
    }

    return lines.join('\n');
  }

  /**
   * Flatten redirect chain
   * @param {Array<string>} chain - Redirect chain URLs
   * @returns {Object} Flattened redirect
   */
  flattenRedirectChain(chain) {
    if (chain.length < 2) {
      return null;
    }

    return {
      from: chain[0],
      to: chain[chain.length - 1],
      originalChainLength: chain.length
    };
  }

  /**
   * Validate redirect rule
   * @param {Object} redirectRule - Redirect rule to validate
   * @returns {boolean} True if valid
   */
  validateRedirectRule(redirectRule) {
    if (!redirectRule || !redirectRule.rule) {
      return false;
    }

    // Check that from and to URLs are different
    if (normalizeUrl(redirectRule.from) === normalizeUrl(redirectRule.to)) {
      this.logger.warn('Redirect from and to URLs are the same', redirectRule);
      return false;
    }

    // Check that rule is properly formatted
    if (!redirectRule.rule.includes('RewriteRule')) {
      return false;
    }

    return true;
  }

  /**
   * Remove redirect rule from .htaccess
   * @param {string} pattern - Pattern to remove
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Remove result
   */
  async removeRedirectRule(pattern, dryRun = false) {
    const htaccessPath = path.join(process.cwd(), 'public/.htaccess');

    try {
      const content = await fs.readFile(htaccessPath, 'utf-8');
      const lines = content.split('\n');

      // Find and remove lines matching the pattern
      const filteredLines = lines.filter(line => !line.includes(pattern));

      if (filteredLines.length === lines.length) {
        return {
          success: false,
          message: 'Pattern not found in .htaccess'
        };
      }

      if (dryRun) {
        return {
          success: true,
          message: `Would remove ${lines.length - filteredLines.length} lines matching pattern`,
          pattern
        };
      }

      // Create backup
      const backupPath = await this.errorHandler.createBackup(htaccessPath);

      try {
        await fs.writeFile(htaccessPath, filteredLines.join('\n'), 'utf-8');

        return {
          success: true,
          message: `Removed ${lines.length - filteredLines.length} lines matching pattern`,
          pattern,
          backupPath
        };
      } catch (error) {
        // Rollback on error
        await this.errorHandler.rollback(backupPath, htaccessPath);
        throw error;
      }
    } catch (error) {
      this.logger.error('Failed to remove redirect rule', { error: error.message });
      return {
        success: false,
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Get redirect statistics
   * @param {Array<Object>} issues - Redirect issues
   * @returns {Object} Statistics
   */
  getRedirectStatistics(issues) {
    const stats = {
      total: issues.length,
      chains: 0,
      temporary: 0,
      permanent: 0,
      longestChain: 0,
      averageChainLength: 0
    };

    let totalChainLength = 0;

    issues.forEach(issue => {
      if (issue.hasChain) {
        stats.chains++;
      }

      if (issue.isTemporary) {
        stats.temporary++;
      } else if (issue.isPermanent) {
        stats.permanent++;
      }

      if (issue.chainLength > stats.longestChain) {
        stats.longestChain = issue.chainLength;
      }

      totalChainLength += issue.chainLength;
    });

    stats.averageChainLength = issues.length > 0 
      ? (totalChainLength / issues.length).toFixed(2) 
      : 0;

    return stats;
  }
}

export default RedirectFixer;
