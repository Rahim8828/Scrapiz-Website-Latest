import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

/**
 * Soft 404 Fixer Module
 * Fixes soft 404 issues by enhancing content or adding redirects
 */
class Soft404Fixer {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  /**
   * Fix soft 404 issues
   * @param {Array<Object>} issues - Array of soft 404 issues
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixSoft404Issues(issues, options = {}) {
    const {
      dryRun = false,
      enhanceContent = true,
      addRedirects = true
    } = options;

    this.logger.info(`Starting soft 404 fixes for ${issues.length} issues (dry run: ${dryRun})`);

    const results = {
      success: true,
      issuesFixed: 0,
      issuesFailed: 0,
      details: []
    };

    for (const issue of issues) {
      try {
        const fixResult = await this.fixSingleSoft404(issue, { dryRun, enhanceContent, addRedirects });
        
        if (fixResult.success) {
          results.issuesFixed++;
        } else {
          results.issuesFailed++;
        }
        
        results.details.push(fixResult);
        
        await this.logger.logFix('soft404', issue.url, fixResult.success, fixResult);
      } catch (error) {
        results.issuesFailed++;
        results.success = false;
        
        const errorResult = {
          url: issue.url,
          status: 'failed',
          message: `Error: ${error.message}`
        };
        
        results.details.push(errorResult);
        await this.logger.logFix('soft404', issue.url, false, errorResult);
      }
    }

    this.logger.info(`Soft 404 fixes complete: ${results.issuesFixed} fixed, ${results.issuesFailed} failed`);

    return results;
  }

  /**
   * Fix a single soft 404 issue
   * @param {Object} issue - Soft 404 issue
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixSingleSoft404(issue, options = {}) {
    const { dryRun, enhanceContent, addRedirects } = options;

    this.logger.info(`Fixing soft 404: ${issue.url} (reason: ${issue.reason})`);

    switch (issue.reason) {
      case 'thin-content':
        if (enhanceContent) {
          return await this.enhanceThinContent(issue, dryRun);
        }
        return {
          url: issue.url,
          status: 'skipped',
          message: 'Content enhancement disabled'
        };

      case 'empty-page':
        // For empty pages, we should either add content or redirect
        if (enhanceContent) {
          return await this.addContentToEmptyPage(issue, dryRun);
        } else if (addRedirects) {
          return await this.addRedirectForEmptyPage(issue, dryRun);
        }
        return {
          url: issue.url,
          status: 'skipped',
          message: 'Both content enhancement and redirects disabled'
        };

      case 'low-quality':
        if (enhanceContent) {
          return await this.improveLowQualityPage(issue, dryRun);
        }
        return {
          url: issue.url,
          status: 'skipped',
          message: 'Content enhancement disabled'
        };

      default:
        return {
          url: issue.url,
          status: 'skipped',
          message: `Unknown reason: ${issue.reason}`
        };
    }
  }

  /**
   * Enhance thin content page
   * @param {Object} issue - Soft 404 issue
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Fix result
   */
  async enhanceThinContent(issue, dryRun) {
    try {
      // Find the source file for this URL
      const filePath = await this.findSourceFile(issue.url);
      
      if (!filePath) {
        return {
          url: issue.url,
          status: 'failed',
          message: 'Could not find source file for URL'
        };
      }

      // Read the file
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Analyze current content
      const $ = cheerio.load(content);
      
      // Generate enhancement suggestions
      const suggestions = this.generateContentSuggestions(issue, $);
      
      if (dryRun) {
        return {
          url: issue.url,
          status: 'dry-run',
          message: `Would enhance content (current: ${issue.wordCount} words, target: 500+ words)`,
          suggestions,
          filePath
        };
      }

      // For now, we'll return a manual action required message
      // In a real implementation, this would integrate with a content generation system
      return {
        url: issue.url,
        status: 'manual-action-required',
        message: `Manual content enhancement needed (current: ${issue.wordCount} words, target: 500+ words)`,
        suggestions,
        filePath
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `enhanceThinContent: ${issue.url}`);
      return {
        url: issue.url,
        status: 'failed',
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Add content to empty page
   * @param {Object} issue - Soft 404 issue
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Fix result
   */
  async addContentToEmptyPage(issue, dryRun) {
    try {
      const filePath = await this.findSourceFile(issue.url);
      
      if (!filePath) {
        return {
          url: issue.url,
          status: 'failed',
          message: 'Could not find source file for URL'
        };
      }

      if (dryRun) {
        return {
          url: issue.url,
          status: 'dry-run',
          message: 'Would add content to empty page or configure 404 status',
          filePath
        };
      }

      // For empty pages, we should return proper 404 status
      return {
        url: issue.url,
        status: 'manual-action-required',
        message: 'Empty page detected. Consider: 1) Adding substantial content, or 2) Returning proper 404 status',
        filePath
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `addContentToEmptyPage: ${issue.url}`);
      return {
        url: issue.url,
        status: 'failed',
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Add redirect for empty page
   * @param {Object} issue - Soft 404 issue
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Fix result
   */
  async addRedirectForEmptyPage(issue, dryRun) {
    try {
      // Find a relevant page to redirect to
      const redirectTarget = await this.findRedirectTarget(issue.url);
      
      if (!redirectTarget) {
        return {
          url: issue.url,
          status: 'failed',
          message: 'Could not determine appropriate redirect target'
        };
      }

      if (dryRun) {
        return {
          url: issue.url,
          status: 'dry-run',
          message: `Would add 301 redirect to ${redirectTarget}`,
          redirectTarget
        };
      }

      // Add redirect to .htaccess
      const htaccessPath = path.join(process.cwd(), 'public/.htaccess');
      const redirectRule = this.generateRedirectRule(issue.url, redirectTarget);
      
      // Create backup
      const backupPath = await this.errorHandler.createBackup(htaccessPath);
      
      try {
        await this.addRedirectToHtaccess(htaccessPath, redirectRule);
        
        return {
          url: issue.url,
          status: 'fixed',
          message: `Added 301 redirect to ${redirectTarget}`,
          redirectTarget,
          backupPath
        };
      } catch (error) {
        // Rollback on error
        await this.errorHandler.rollback(backupPath, htaccessPath);
        throw error;
      }
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `addRedirectForEmptyPage: ${issue.url}`);
      return {
        url: issue.url,
        status: 'failed',
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Improve low quality page
   * @param {Object} issue - Soft 404 issue
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Fix result
   */
  async improveLowQualityPage(issue, dryRun) {
    try {
      const filePath = await this.findSourceFile(issue.url);
      
      if (!filePath) {
        return {
          url: issue.url,
          status: 'failed',
          message: 'Could not find source file for URL'
        };
      }

      const suggestions = {
        addHeadings: !issue.hasHeadings,
        addInternalLinks: !issue.hasInternalLinks,
        improveStructure: true
      };

      if (dryRun) {
        return {
          url: issue.url,
          status: 'dry-run',
          message: 'Would improve page structure (add headings and internal links)',
          suggestions,
          filePath
        };
      }

      return {
        url: issue.url,
        status: 'manual-action-required',
        message: 'Low quality page detected. Add proper heading structure (H1, H2) and internal links',
        suggestions,
        filePath
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `improveLowQualityPage: ${issue.url}`);
      return {
        url: issue.url,
        status: 'failed',
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Generate content enhancement suggestions
   * @param {Object} issue - Soft 404 issue
   * @param {Object} $ - Cheerio instance
   * @returns {Object} Suggestions
   */
  generateContentSuggestions(issue, $) {
    const suggestions = {
      currentWordCount: issue.wordCount,
      targetWordCount: 500,
      missingElements: []
    };

    if (!issue.hasHeadings) {
      suggestions.missingElements.push('Add H1 and H2 headings');
    }

    if (!issue.hasInternalLinks) {
      suggestions.missingElements.push('Add internal links to related pages');
    }

    if (issue.wordCount < 300) {
      suggestions.missingElements.push(`Add ${500 - issue.wordCount} more words of content`);
    }

    return suggestions;
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
      // This is a simplified implementation - would need to be expanded for real use
      const pathMappings = {
        '/': 'src/pages/Home.jsx',
        '/about': 'src/pages/About.jsx',
        '/contact': 'src/pages/Contact.jsx',
        '/services': 'src/pages/Services.jsx',
        '/blog': 'src/pages/Blog.jsx'
      };

      // Check for location pages
      if (pathname.startsWith('/scrap-dealer-in-')) {
        const location = pathname.replace('/scrap-dealer-in-', '').replace('/', '');
        const locationName = location.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        return `src/Extra Location pages /ScrapDealerin${locationName}.jsx`;
      }

      // Check for service pages
      if (pathname.startsWith('/services/')) {
        const service = pathname.replace('/services/', '').replace('/', '');
        const serviceName = service.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        return `src/pages/${serviceName}Page.jsx`;
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
   * Find appropriate redirect target for URL
   * @param {string} url - URL to find redirect target for
   * @returns {Promise<string|null>} Redirect target or null
   */
  async findRedirectTarget(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      
      // Simple heuristic: redirect to parent path or home
      if (pathname.includes('/')) {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length > 1) {
          parts.pop();
          return '/' + parts.join('/');
        }
      }
      
      // Default to home page
      return '/';
    } catch (error) {
      this.logger.error(`Error finding redirect target for ${url}`, { error: error.message });
      return null;
    }
  }

  /**
   * Generate redirect rule for .htaccess
   * @param {string} fromUrl - Source URL
   * @param {string} toUrl - Target URL
   * @returns {string} Redirect rule
   */
  generateRedirectRule(fromUrl, toUrl) {
    try {
      const urlObj = new URL(fromUrl);
      const pathname = urlObj.pathname;
      
      // Remove leading slash for RewriteRule
      const pattern = pathname.startsWith('/') ? pathname.substring(1) : pathname;
      
      // Escape special regex characters
      const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      return `RewriteRule ^${escapedPattern}/?$ ${toUrl} [R=301,L]`;
    } catch (error) {
      this.logger.error(`Error generating redirect rule`, { error: error.message });
      return '';
    }
  }

  /**
   * Add redirect rule to .htaccess
   * @param {string} htaccessPath - Path to .htaccess file
   * @param {string} redirectRule - Redirect rule to add
   * @returns {Promise<void>}
   */
  async addRedirectToHtaccess(htaccessPath, redirectRule) {
    try {
      let content = '';
      
      try {
        content = await fs.readFile(htaccessPath, 'utf-8');
      } catch (error) {
        // File doesn't exist, create new content
        content = '# Apache configuration\nRewriteEngine On\n\n';
      }

      // Check if rule already exists
      if (content.includes(redirectRule)) {
        this.logger.info('Redirect rule already exists in .htaccess');
        return;
      }

      // Find the RewriteEngine On line and add after it
      const lines = content.split('\n');
      const rewriteEngineIndex = lines.findIndex(line => line.includes('RewriteEngine On'));
      
      if (rewriteEngineIndex !== -1) {
        // Add after RewriteEngine On
        lines.splice(rewriteEngineIndex + 1, 0, '', '# Soft 404 fix', redirectRule);
      } else {
        // Add at the beginning
        lines.unshift('RewriteEngine On', '', '# Soft 404 fix', redirectRule, '');
      }

      const newContent = lines.join('\n');
      await fs.writeFile(htaccessPath, newContent, 'utf-8');
      
      this.logger.info(`Added redirect rule to .htaccess: ${redirectRule}`);
    } catch (error) {
      this.logger.error(`Failed to add redirect to .htaccess`, { error: error.message });
      throw error;
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

export default Soft404Fixer;
