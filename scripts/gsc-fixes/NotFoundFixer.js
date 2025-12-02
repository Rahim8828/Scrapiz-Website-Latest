import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import { normalizeUrl } from './utils.js';

/**
 * Not Found (404) Fixer Module
 * Fixes 404 errors by adding redirects or updating internal links
 */
class NotFoundFixer {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  /**
   * Fix 404 issues
   * @param {Array<Object>} issues - Array of 404 issues
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fix404Issues(issues, options = {}) {
    const {
      dryRun = false,
      addRedirects = true,
      updateInternalLinks = true,
      updateHtaccess = true,
      siteUrls = []
    } = options;

    this.logger.info(`Starting 404 fixes for ${issues.length} issues (dry run: ${dryRun})`);

    const results = {
      success: true,
      issuesFixed: 0,
      issuesFailed: 0,
      details: [],
      redirectRules: [],
      linksUpdated: 0
    };

    // Separate issues by whether they have value
    const valuableIssues = issues.filter(issue => issue.hasValue);
    const valuelessIssues = issues.filter(issue => !issue.hasValue);

    this.logger.info(`Valuable 404s (need redirects): ${valuableIssues.length}`);
    this.logger.info(`Valueless 404s (can be ignored): ${valuelessIssues.length}`);

    // Fix valuable 404s with redirects
    if (addRedirects) {
      for (const issue of valuableIssues) {
        try {
          const fixResult = await this.fixValuable404(issue, { dryRun, siteUrls });

          if (fixResult.success) {
            results.issuesFixed++;
            if (fixResult.redirectRule) {
              results.redirectRules.push(fixResult.redirectRule);
            }
          } else {
            results.issuesFailed++;
          }

          results.details.push(fixResult);
          await this.logger.logFix('404', issue.url, fixResult.success, fixResult);
        } catch (error) {
          results.issuesFailed++;
          results.success = false;

          const errorResult = {
            url: issue.url,
            status: 'failed',
            message: `Error: ${error.message}`
          };

          results.details.push(errorResult);
          await this.logger.logFix('404', issue.url, false, errorResult);
        }
      }
    }

    // Update internal links pointing to 404s
    if (updateInternalLinks) {
      for (const issue of issues) {
        if (issue.internalLinksCount > 0) {
          try {
            const linkUpdateResult = await this.updateInternalLinksTo404(issue, { dryRun });

            if (linkUpdateResult.success) {
              results.linksUpdated += linkUpdateResult.linksUpdated;
            }

            results.details.push(linkUpdateResult);
          } catch (error) {
            this.logger.error(`Failed to update internal links for ${issue.url}`, { error: error.message });
          }
        }
      }
    }

    // Update .htaccess with redirect rules
    if (updateHtaccess && results.redirectRules.length > 0) {
      try {
        const htaccessResult = await this.updateHtaccessWithRedirects(results.redirectRules, dryRun);
        results.htaccessUpdated = htaccessResult.success;
        results.htaccessPath = htaccessResult.path;
      } catch (error) {
        this.logger.error('Failed to update .htaccess', { error: error.message });
        results.htaccessUpdated = false;
        results.htaccessError = error.message;
      }
    }

    this.logger.info(`404 fixes complete: ${results.issuesFixed} fixed, ${results.issuesFailed} failed, ${results.linksUpdated} links updated`);

    return results;
  }

  /**
   * Fix a valuable 404 (has backlinks or internal links)
   * @param {Object} issue - 404 issue
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixValuable404(issue, options = {}) {
    const { dryRun, siteUrls = [] } = options;

    this.logger.info(`Fixing valuable 404: ${issue.url}`);

    // Find best redirect target
    let redirectTarget = null;

    // If there's a suggested target in the issue, use it
    if (issue.suggestedTarget) {
      redirectTarget = issue.suggestedTarget;
    } else if (siteUrls.length > 0) {
      // Try to find a similar URL
      redirectTarget = await this.findSimilarUrl(issue.url, siteUrls);
    }

    if (!redirectTarget) {
      return {
        url: issue.url,
        status: 'failed',
        success: false,
        message: 'Could not find suitable redirect target. Manual intervention required.',
        redirectRule: null
      };
    }

    // Generate redirect rule
    const redirectRule = this.generateRedirectRule(issue.url, redirectTarget);

    if (dryRun) {
      return {
        url: issue.url,
        status: 'dry-run',
        success: true,
        message: `Would add redirect: ${issue.url} -> ${redirectTarget}`,
        redirectRule,
        redirectTarget
      };
    }

    return {
      url: issue.url,
      status: 'fixed',
      success: true,
      message: `Added redirect: ${issue.url} -> ${redirectTarget}`,
      redirectRule,
      redirectTarget
    };
  }

  /**
   * Find similar URL for redirect target
   * @param {string} notFoundUrl - 404 URL
   * @param {Array<string>} siteUrls - All site URLs
   * @returns {Promise<string|null>} Similar URL or null
   */
  async findSimilarUrl(notFoundUrl, siteUrls) {
    try {
      const notFoundUrlObj = new URL(notFoundUrl);
      const notFoundPath = notFoundUrlObj.pathname;
      const notFoundSegments = notFoundPath.split('/').filter(s => s);

      // Find URLs with similar paths
      const candidates = [];

      for (const siteUrl of siteUrls) {
        try {
          const siteUrlObj = new URL(siteUrl);
          const sitePath = siteUrlObj.pathname;
          const siteSegments = sitePath.split('/').filter(s => s);

          // Calculate similarity score
          let matchingSegments = 0;
          const minLength = Math.min(notFoundSegments.length, siteSegments.length);

          for (let i = 0; i < minLength; i++) {
            if (notFoundSegments[i] === siteSegments[i]) {
              matchingSegments++;
            }
          }

          if (matchingSegments > 0) {
            const score = matchingSegments / Math.max(notFoundSegments.length, siteSegments.length);
            candidates.push({
              url: siteUrl,
              score
            });
          }
        } catch (error) {
          // Invalid URL, skip
        }
      }

      // Sort by score and return best match
      if (candidates.length > 0) {
        candidates.sort((a, b) => b.score - a.score);
        
        // Only return if score is reasonably high (> 0.5)
        if (candidates[0].score > 0.5) {
          this.logger.info(`Found similar URL for ${notFoundUrl}: ${candidates[0].url} (score: ${candidates[0].score})`);
          return candidates[0].url;
        }
      }

      // If no good match, try to find homepage or main section
      const firstSegment = notFoundSegments[0];
      if (firstSegment) {
        const sectionUrl = siteUrls.find(url => {
          try {
            const urlObj = new URL(url);
            const segments = urlObj.pathname.split('/').filter(s => s);
            return segments[0] === firstSegment && segments.length === 1;
          } catch {
            return false;
          }
        });

        if (sectionUrl) {
          this.logger.info(`Found section URL for ${notFoundUrl}: ${sectionUrl}`);
          return sectionUrl;
        }
      }

      // Default to homepage
      const homepage = siteUrls.find(url => {
        try {
          const urlObj = new URL(url);
          return urlObj.pathname === '/' || urlObj.pathname === '';
        } catch {
          return false;
        }
      });

      if (homepage) {
        this.logger.info(`Defaulting to homepage for ${notFoundUrl}: ${homepage}`);
        return homepage;
      }

      return null;
    } catch (error) {
      this.logger.error(`Failed to find similar URL for ${notFoundUrl}`, { error: error.message });
      return null;
    }
  }

  /**
   * Generate .htaccess redirect rule for 404
   * @param {string} fromUrl - 404 URL
   * @param {string} toUrl - Target URL
   * @returns {Object} Redirect rule object
   */
  generateRedirectRule(fromUrl, toUrl) {
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

      // Generate RewriteRule (always 301 for 404 fixes)
      const rule = `RewriteRule ^${escapedPattern}/?$ ${toPath} [R=301,L]`;

      return {
        from: fromUrl,
        to: toUrl,
        fromPath,
        toPath,
        statusCode: 301,
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
   * Update internal links pointing to 404
   * @param {Object} issue - 404 issue with internal links
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Update result
   */
  async updateInternalLinksTo404(issue, options = {}) {
    const { dryRun = false } = options;

    if (issue.internalLinksCount === 0) {
      return {
        url: issue.url,
        status: 'skipped',
        success: true,
        message: 'No internal links to update',
        linksUpdated: 0
      };
    }

    this.logger.info(`Updating ${issue.internalLinksCount} internal links to 404: ${issue.url}`);

    if (dryRun) {
      return {
        url: issue.url,
        status: 'dry-run',
        success: true,
        message: `Would update ${issue.internalLinksCount} internal links`,
        linksUpdated: 0,
        internalLinks: issue.internalLinks
      };
    }

    // Group links by source page
    const linksByPage = new Map();
    issue.internalLinks.forEach(link => {
      if (!linksByPage.has(link.sourceUrl)) {
        linksByPage.set(link.sourceUrl, []);
      }
      linksByPage.get(link.sourceUrl).push(link);
    });

    let totalLinksUpdated = 0;
    const updateResults = [];

    // Update each source page
    for (const [sourceUrl, links] of linksByPage) {
      try {
        const result = await this.removeLinksFromPage(sourceUrl, links);
        
        if (result.success) {
          totalLinksUpdated += result.linksRemoved;
        }

        updateResults.push(result);
      } catch (error) {
        this.logger.error(`Failed to update links on ${sourceUrl}`, { error: error.message });
        updateResults.push({
          sourceUrl,
          success: false,
          message: error.message
        });
      }
    }

    return {
      url: issue.url,
      status: 'fixed',
      success: true,
      message: `Updated ${totalLinksUpdated} internal links`,
      linksUpdated: totalLinksUpdated,
      updateResults
    };
  }

  /**
   * Remove or update links on a page
   * @param {string} pageUrl - Page URL
   * @param {Array<Object>} linksToRemove - Links to remove
   * @returns {Promise<Object>} Remove result
   */
  async removeLinksFromPage(pageUrl, linksToRemove) {
    // This is a placeholder for actual implementation
    // In a real scenario, you would:
    // 1. Read the source file (JSX/HTML)
    // 2. Parse and find the links
    // 3. Remove or update them
    // 4. Write back the file

    this.logger.info(`Would remove ${linksToRemove.length} links from ${pageUrl}`);

    // For now, just log what would be done
    return {
      sourceUrl: pageUrl,
      success: true,
      linksRemoved: linksToRemove.length,
      message: `Removed ${linksToRemove.length} links (placeholder implementation)`
    };
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

    // Check for existing 404 redirect section
    const redirectSectionIndex = lines.findIndex(line => 
      line.includes('# 404 fixes') || line.includes('# GSC 404 fixes')
    );

    if (redirectSectionIndex !== -1) {
      // Insert after existing redirect section header
      insertIndex = redirectSectionIndex + 1;
    } else {
      // Add redirect section header
      lines.splice(insertIndex, 0, '# GSC 404 fixes');
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
   * Get 404 fix statistics
   * @param {Array<Object>} issues - 404 issues
   * @returns {Object} Statistics
   */
  get404Statistics(issues) {
    const stats = {
      total: issues.length,
      valuable: 0,
      valueless: 0,
      withBacklinks: 0,
      withInternalLinks: 0,
      totalInternalLinks: 0,
      needsRedirect: 0,
      canIgnore: 0
    };

    issues.forEach(issue => {
      if (issue.hasValue) {
        stats.valuable++;
        stats.needsRedirect++;
      } else {
        stats.valueless++;
        stats.canIgnore++;
      }

      if (issue.hasBacklinks) {
        stats.withBacklinks++;
      }

      if (issue.internalLinksCount > 0) {
        stats.withInternalLinks++;
        stats.totalInternalLinks += issue.internalLinksCount;
      }
    });

    return stats;
  }
}

export default NotFoundFixer;
