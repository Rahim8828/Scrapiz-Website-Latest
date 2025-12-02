import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

/**
 * Noindex Fixer Module
 * Removes inappropriate noindex tags from valuable pages
 */
class NoindexFixer {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  /**
   * Fix noindex issues
   * @param {Array<Object>} issues - Array of noindex issues
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixNoindexIssues(issues, options = {}) {
    const {
      dryRun = false,
      removeMetaNoindex = true,
      removeHeaderNoindex = true
    } = options;

    this.logger.info(`Starting noindex fixes for ${issues.length} issues (dry run: ${dryRun})`);

    const results = {
      success: true,
      issuesFixed: 0,
      issuesFailed: 0,
      details: []
    };

    // Only fix issues where page should be indexed
    const fixableIssues = issues.filter(issue => issue.shouldBeIndexed && issue.fixable);

    this.logger.info(`${fixableIssues.length} of ${issues.length} issues are fixable`);

    for (const issue of fixableIssues) {
      try {
        const fixResult = await this.fixSingleNoindex(issue, { 
          dryRun, 
          removeMetaNoindex, 
          removeHeaderNoindex 
        });

        if (fixResult.success) {
          results.issuesFixed++;
        } else {
          results.issuesFailed++;
        }

        results.details.push(fixResult);

        await this.logger.logFix('noindex', issue.url, fixResult.success, fixResult);
      } catch (error) {
        results.issuesFailed++;
        results.success = false;

        const errorResult = {
          url: issue.url,
          status: 'failed',
          message: `Error: ${error.message}`
        };

        results.details.push(errorResult);
        await this.logger.logFix('noindex', issue.url, false, errorResult);
      }
    }

    this.logger.info(`Noindex fixes complete: ${results.issuesFixed} fixed, ${results.issuesFailed} failed`);

    return results;
  }

  /**
   * Fix a single noindex issue
   * @param {Object} issue - Noindex issue
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixSingleNoindex(issue, options = {}) {
    const { dryRun, removeMetaNoindex, removeHeaderNoindex } = options;

    this.logger.info(`Fixing noindex: ${issue.url} (sources: ${issue.noindexSource})`);

    const fixActions = [];

    // Handle meta tag noindex
    if (issue.hasMetaNoindex && removeMetaNoindex) {
      const metaResult = await this.removeMetaNoindex(issue, dryRun);
      fixActions.push(metaResult);
    }

    // Handle HTTP header noindex
    if (issue.hasHeaderNoindex && removeHeaderNoindex) {
      const headerResult = await this.removeHeaderNoindex(issue, dryRun);
      fixActions.push(headerResult);
    }

    // Handle robots.txt blocking
    if (issue.isRobotsBlocked) {
      fixActions.push({
        action: 'robots-txt-blocking',
        status: 'manual-action-required',
        message: 'robots.txt blocking requires manual update to robots.txt file'
      });
    }

    // Determine overall result
    const allSuccessful = fixActions.every(action => 
      action.status === 'fixed' || action.status === 'dry-run'
    );
    const anyManual = fixActions.some(action => 
      action.status === 'manual-action-required'
    );

    return {
      url: issue.url,
      status: dryRun ? 'dry-run' : (allSuccessful ? 'fixed' : (anyManual ? 'manual-action-required' : 'failed')),
      success: allSuccessful,
      message: this.buildFixMessage(fixActions),
      actions: fixActions
    };
  }

  /**
   * Remove noindex from meta robots tag
   * @param {Object} issue - Noindex issue
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Fix result
   */
  async removeMetaNoindex(issue, dryRun) {
    try {
      // Find the source file for this URL
      const filePath = await this.findSourceFile(issue.url);

      if (!filePath) {
        return {
          action: 'remove-meta-noindex',
          status: 'failed',
          message: 'Could not find source file for URL'
        };
      }

      // Read the file
      const content = await fs.readFile(filePath, 'utf-8');

      // Check if file contains noindex
      if (!content.includes('noindex')) {
        return {
          action: 'remove-meta-noindex',
          status: 'skipped',
          message: 'No noindex found in source file',
          filePath
        };
      }

      if (dryRun) {
        return {
          action: 'remove-meta-noindex',
          status: 'dry-run',
          message: 'Would remove noindex from meta robots tag',
          filePath
        };
      }

      // Create backup
      const backupPath = await this.errorHandler.createBackup(filePath);

      try {
        // Remove noindex from meta tags
        const updatedContent = this.removeNoindexFromContent(content);

        // Write updated content
        await fs.writeFile(filePath, updatedContent, 'utf-8');

        return {
          action: 'remove-meta-noindex',
          status: 'fixed',
          message: 'Removed noindex from meta robots tag',
          filePath,
          backupPath
        };
      } catch (error) {
        // Rollback on error
        await this.errorHandler.rollback(backupPath, filePath);
        throw error;
      }
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `removeMetaNoindex: ${issue.url}`);
      return {
        action: 'remove-meta-noindex',
        status: 'failed',
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Remove noindex from content
   * @param {string} content - File content
   * @returns {string} Updated content
   */
  removeNoindexFromContent(content) {
    // Parse HTML/JSX content
    const $ = cheerio.load(content, {
      xmlMode: false,
      decodeEntities: false
    });

    // Find and remove/update meta robots tags with noindex
    $('meta[name="robots"]').each((i, elem) => {
      const contentAttr = $(elem).attr('content') || '';
      if (contentAttr.toLowerCase().includes('noindex')) {
        // Remove noindex from content attribute
        const updatedContent = contentAttr
          .split(',')
          .map(s => s.trim())
          .filter(s => s.toLowerCase() !== 'noindex')
          .join(', ');

        if (updatedContent) {
          $(elem).attr('content', updatedContent);
        } else {
          // If no other directives, remove the tag entirely
          $(elem).remove();
        }
      }
    });

    // Also handle googlebot meta tag
    $('meta[name="googlebot"]').each((i, elem) => {
      const contentAttr = $(elem).attr('content') || '';
      if (contentAttr.toLowerCase().includes('noindex')) {
        const updatedContent = contentAttr
          .split(',')
          .map(s => s.trim())
          .filter(s => s.toLowerCase() !== 'noindex')
          .join(', ');

        if (updatedContent) {
          $(elem).attr('content', updatedContent);
        } else {
          $(elem).remove();
        }
      }
    });

    return $.html();
  }

  /**
   * Remove noindex from HTTP header (requires server configuration)
   * @param {Object} issue - Noindex issue
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Fix result
   */
  async removeHeaderNoindex(issue, dryRun) {
    // HTTP header noindex requires server configuration changes
    // This is typically done in .htaccess, nginx config, or application code

    if (dryRun) {
      return {
        action: 'remove-header-noindex',
        status: 'dry-run',
        message: 'Would remove X-Robots-Tag noindex from HTTP headers (requires server config update)'
      };
    }

    return {
      action: 'remove-header-noindex',
      status: 'manual-action-required',
      message: 'X-Robots-Tag noindex requires manual server configuration update (.htaccess, nginx config, or application code)'
    };
  }

  /**
   * Build fix message from actions
   * @param {Array<Object>} actions - Fix actions
   * @returns {string} Fix message
   */
  buildFixMessage(actions) {
    const messages = actions.map(action => action.message);
    return messages.join('. ');
  }

  /**
   * Find source file for URL
   * @param {string} url - URL to find source for
   * @returns {Promise<string|null>} File path or null
   */
  async findSourceFile(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      // Map URL paths to source files
      const pathMappings = {
        '/': 'src/pages/Home.jsx',
        '/about': 'src/pages/About.jsx',
        '/contact': 'src/pages/Contact.jsx',
        '/services': 'src/pages/Services.jsx',
        '/blog': 'src/pages/Blog.jsx',
        '/locations': 'src/pages/Locations.jsx'
      };

      // Check for location pages
      if (pathname.startsWith('/scrap-dealer-in-')) {
        const location = pathname.replace('/scrap-dealer-in-', '').replace('/', '');
        const locationName = location.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        return path.join(process.cwd(), `src/Extra Location pages /ScrapDealerin${locationName}.jsx`);
      }

      // Check for service pages
      if (pathname.startsWith('/services/')) {
        const service = pathname.replace('/services/', '').replace('/', '');
        const serviceName = service.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        return path.join(process.cwd(), `src/pages/${serviceName}Page.jsx`);
      }

      // Check for scrap category pages
      if (pathname.startsWith('/scrap/')) {
        const category = pathname.replace('/scrap/', '').replace('/', '');
        const categoryName = category.split('-').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        return path.join(process.cwd(), `src/Scrap Category Pages/${categoryName}ScrapPage.jsx`);
      }

      const filePath = pathMappings[pathname];
      if (filePath) {
        const fullPath = path.join(process.cwd(), filePath);
        try {
          await fs.access(fullPath);
          return fullPath;
        } catch {
          return null;
        }
      }

      return null;
    } catch (error) {
      this.logger.error(`Error finding source file for ${url}`, { error: error.message });
      return null;
    }
  }

  /**
   * Verify fix was applied successfully
   * @param {string} url - URL to verify
   * @returns {Promise<boolean>} True if fix was successful
   */
  async verifyFix(url) {
    try {
      // This would need to re-check the page to verify the fix
      // For now, return true as a placeholder
      return true;
    } catch (error) {
      this.logger.error(`Failed to verify fix for ${url}`, { error: error.message });
      return false;
    }
  }
}

export default NoindexFixer;
