import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';
import { normalizeUrl } from './utils.js';

/**
 * Canonical Fixer Module
 * Adds and updates canonical tags on pages
 */
class CanonicalFixer {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
  }

  /**
   * Fix canonical tag issues
   * @param {Array<Object>} issues - Array of canonical issues
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixCanonicalIssues(issues, options = {}) {
    const {
      dryRun = false,
      addMissing = true,
      updateInvalid = true
    } = options;

    this.logger.info(`Starting canonical fixes for ${issues.length} issues (dry run: ${dryRun})`);

    const results = {
      success: true,
      issuesFixed: 0,
      issuesFailed: 0,
      details: []
    };

    for (const issue of issues) {
      try {
        const fixResult = await this.fixSingleCanonical(issue, { dryRun, addMissing, updateInvalid });
        
        if (fixResult.success) {
          results.issuesFixed++;
        } else {
          results.issuesFailed++;
        }
        
        results.details.push(fixResult);
        
        await this.logger.logFix('canonical', issue.url, fixResult.success, fixResult);
      } catch (error) {
        results.issuesFailed++;
        results.success = false;
        
        const errorResult = {
          url: issue.url,
          status: 'failed',
          message: `Error: ${error.message}`
        };
        
        results.details.push(errorResult);
        await this.logger.logFix('canonical', issue.url, false, errorResult);
      }
    }

    this.logger.info(`Canonical fixes complete: ${results.issuesFixed} fixed, ${results.issuesFailed} failed`);

    return results;
  }

  /**
   * Fix a single canonical issue
   * @param {Object} issue - Canonical issue
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixSingleCanonical(issue, options = {}) {
    const { dryRun, addMissing, updateInvalid } = options;

    this.logger.info(`Fixing canonical: ${issue.url} (type: ${issue.issueType})`);

    // Don't fix alternative pages (intentional canonicals)
    if (issue.issueType === 'alternative-page') {
      return {
        url: issue.url,
        status: 'skipped',
        message: 'Alternative page with intentional canonical - no fix needed'
      };
    }

    // Handle missing canonical
    if (issue.issueType === 'missing') {
      if (!addMissing) {
        return {
          url: issue.url,
          status: 'skipped',
          message: 'Adding missing canonicals disabled'
        };
      }
      return await this.addCanonicalTag(issue, dryRun);
    }

    // Handle invalid canonical targets
    if (issue.issueType.startsWith('invalid-target')) {
      if (!updateInvalid) {
        return {
          url: issue.url,
          status: 'skipped',
          message: 'Updating invalid canonicals disabled'
        };
      }
      return await this.updateCanonicalTag(issue, dryRun);
    }

    return {
      url: issue.url,
      status: 'skipped',
      message: `Unknown issue type: ${issue.issueType}`
    };
  }

  /**
   * Add canonical tag to page
   * @param {Object} issue - Canonical issue
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Fix result
   */
  async addCanonicalTag(issue, dryRun) {
    try {
      const filePath = await this.findSourceFile(issue.url);
      
      if (!filePath) {
        return {
          url: issue.url,
          status: 'failed',
          message: 'Could not find source file for URL'
        };
      }

      const canonicalUrl = issue.expectedCanonical;

      if (dryRun) {
        return {
          url: issue.url,
          status: 'dry-run',
          message: `Would add canonical tag: ${canonicalUrl}`,
          filePath,
          canonicalUrl
        };
      }

      // Read the file
      const content = await fs.readFile(filePath, 'utf-8');

      // Check if file already has Helmet component
      const hasHelmet = content.includes('react-helmet') || content.includes('Helmet');

      if (!hasHelmet) {
        return {
          url: issue.url,
          status: 'manual-action-required',
          message: 'File does not use react-helmet. Manual addition required',
          filePath,
          canonicalUrl,
          suggestion: 'Add: <Helmet><link rel="canonical" href="' + canonicalUrl + '" /></Helmet>'
        };
      }

      // Create backup
      const backupPath = await this.errorHandler.createBackup(filePath);

      try {
        const updatedContent = this.insertCanonicalInHelmet(content, canonicalUrl);
        
        if (updatedContent === content) {
          return {
            url: issue.url,
            status: 'manual-action-required',
            message: 'Could not automatically insert canonical tag. Manual addition required',
            filePath,
            canonicalUrl
          };
        }

        await fs.writeFile(filePath, updatedContent, 'utf-8');

        return {
          url: issue.url,
          status: 'fixed',
          message: `Added canonical tag: ${canonicalUrl}`,
          filePath,
          canonicalUrl,
          backupPath
        };
      } catch (error) {
        // Rollback on error
        await this.errorHandler.rollback(backupPath, filePath);
        throw error;
      }
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `addCanonicalTag: ${issue.url}`);
      return {
        url: issue.url,
        status: 'failed',
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Update existing canonical tag
   * @param {Object} issue - Canonical issue
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Fix result
   */
  async updateCanonicalTag(issue, dryRun) {
    try {
      const filePath = await this.findSourceFile(issue.url);
      
      if (!filePath) {
        return {
          url: issue.url,
          status: 'failed',
          message: 'Could not find source file for URL'
        };
      }

      const newCanonicalUrl = issue.expectedCanonical;

      if (dryRun) {
        return {
          url: issue.url,
          status: 'dry-run',
          message: `Would update canonical from ${issue.currentCanonical} to ${newCanonicalUrl}`,
          filePath,
          oldCanonical: issue.currentCanonical,
          newCanonical: newCanonicalUrl
        };
      }

      // Read the file
      const content = await fs.readFile(filePath, 'utf-8');

      // Create backup
      const backupPath = await this.errorHandler.createBackup(filePath);

      try {
        const updatedContent = this.replaceCanonicalInHelmet(content, issue.currentCanonical, newCanonicalUrl);
        
        if (updatedContent === content) {
          return {
            url: issue.url,
            status: 'manual-action-required',
            message: 'Could not automatically update canonical tag. Manual update required',
            filePath,
            oldCanonical: issue.currentCanonical,
            newCanonical: newCanonicalUrl
          };
        }

        await fs.writeFile(filePath, updatedContent, 'utf-8');

        return {
          url: issue.url,
          status: 'fixed',
          message: `Updated canonical from ${issue.currentCanonical} to ${newCanonicalUrl}`,
          filePath,
          oldCanonical: issue.currentCanonical,
          newCanonical: newCanonicalUrl,
          backupPath
        };
      } catch (error) {
        // Rollback on error
        await this.errorHandler.rollback(backupPath, filePath);
        throw error;
      }
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `updateCanonicalTag: ${issue.url}`);
      return {
        url: issue.url,
        status: 'failed',
        message: `Error: ${error.message}`
      };
    }
  }

  /**
   * Insert canonical tag into Helmet component
   * @param {string} content - File content
   * @param {string} canonicalUrl - Canonical URL to insert
   * @returns {string} Updated content
   */
  insertCanonicalInHelmet(content, canonicalUrl) {
    // Look for Helmet component
    const helmetRegex = /<Helmet>([\s\S]*?)<\/Helmet>/;
    const match = content.match(helmetRegex);

    if (!match) {
      return content;
    }

    const helmetContent = match[1];
    
    // Check if canonical already exists
    if (helmetContent.includes('rel="canonical"')) {
      return content;
    }

    // Insert canonical tag
    const canonicalTag = `\n        <link rel="canonical" href="${canonicalUrl}" />`;
    const updatedHelmetContent = helmetContent + canonicalTag;
    
    return content.replace(helmetRegex, `<Helmet>${updatedHelmetContent}\n      </Helmet>`);
  }

  /**
   * Replace canonical tag in Helmet component
   * @param {string} content - File content
   * @param {string} oldCanonical - Old canonical URL
   * @param {string} newCanonical - New canonical URL
   * @returns {string} Updated content
   */
  replaceCanonicalInHelmet(content, oldCanonical, newCanonical) {
    // Try to find and replace the canonical tag
    const canonicalRegex = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/g;
    
    if (!canonicalRegex.test(content)) {
      return content;
    }

    // Replace with new canonical
    return content.replace(
      canonicalRegex,
      `<link rel="canonical" href="${newCanonical}" />`
    );
  }

  /**
   * Fix duplicate content by adding canonical tags
   * @param {Array<Object>} duplicateIssues - Array of duplicate issues
   * @param {boolean} dryRun - Whether to perform dry run
   * @returns {Promise<Object>} Fix result
   */
  async fixDuplicateContent(duplicateIssues, dryRun = false) {
    this.logger.info(`Fixing duplicate content for ${duplicateIssues.length} issues (dry run: ${dryRun})`);

    const results = {
      success: true,
      issuesFixed: 0,
      issuesFailed: 0,
      details: []
    };

    for (const issue of duplicateIssues) {
      try {
        // Skip if this is the primary version
        if (!issue.duplicateOf) {
          results.details.push({
            url: issue.url,
            status: 'skipped',
            message: 'This is the primary version - no canonical needed'
          });
          continue;
        }

        // Skip if already has correct canonical
        if (issue.hasCanonical && normalizeUrl(issue.canonicalTarget) === normalizeUrl(issue.duplicateOf)) {
          results.details.push({
            url: issue.url,
            status: 'skipped',
            message: 'Already has correct canonical tag'
          });
          continue;
        }

        // Add or update canonical to point to primary
        const canonicalIssue = {
          url: issue.url,
          currentCanonical: issue.canonicalTarget,
          expectedCanonical: issue.duplicateOf,
          issueType: issue.hasCanonical ? 'invalid-target' : 'missing'
        };

        const fixResult = await this.fixSingleCanonical(canonicalIssue, { dryRun, addMissing: true, updateInvalid: true });
        
        if (fixResult.success || fixResult.status === 'fixed') {
          results.issuesFixed++;
        } else {
          results.issuesFailed++;
        }
        
        results.details.push(fixResult);
        
      } catch (error) {
        results.issuesFailed++;
        results.success = false;
        
        results.details.push({
          url: issue.url,
          status: 'failed',
          message: `Error: ${error.message}`
        });
      }
    }

    this.logger.info(`Duplicate content fixes complete: ${results.issuesFixed} fixed, ${results.issuesFailed} failed`);

    return results;
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
        '/locations': 'src/pages/Locations.jsx',
        '/privacy-policy': 'src/pages/PrivacyPolicy.jsx',
        '/terms-and-conditions': 'src/pages/TermsAndConditions.jsx'
      };

      // Check for location pages
      if (pathname.startsWith('/scrap-dealer-in-')) {
        const location = pathname.replace('/scrap-dealer-in-', '').replace('/', '');
        const locationName = location.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        const filePath = path.join(process.cwd(), `src/Extra Location pages /ScrapDealerin${locationName}.jsx`);
        try {
          await fs.access(filePath);
          return filePath;
        } catch {
          return null;
        }
      }

      // Check for service pages
      if (pathname.startsWith('/services/')) {
        const service = pathname.replace('/services/', '').replace('/', '');
        const serviceName = service.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        const filePath = path.join(process.cwd(), `src/pages/${serviceName}Page.jsx`);
        try {
          await fs.access(filePath);
          return filePath;
        } catch {
          return null;
        }
      }

      // Check for scrap category pages
      if (pathname.startsWith('/scrap-categories/')) {
        const category = pathname.replace('/scrap-categories/', '').replace('/', '');
        const categoryName = category.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('');
        const filePath = path.join(process.cwd(), `src/Scrap Category Pages/${categoryName}ScrapPage.jsx`);
        try {
          await fs.access(filePath);
          return filePath;
        } catch {
          return null;
        }
      }

      // Check direct mappings
      const mappedPath = pathMappings[pathname];
      if (mappedPath) {
        const fullPath = path.join(process.cwd(), mappedPath);
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
   * Verify canonical fix was applied successfully
   * @param {string} url - URL to verify
   * @param {string} expectedCanonical - Expected canonical URL
   * @returns {Promise<boolean>} True if fix was successful
   */
  async verifyFix(url, expectedCanonical) {
    try {
      const filePath = await this.findSourceFile(url);
      if (!filePath) {
        return false;
      }

      const content = await fs.readFile(filePath, 'utf-8');
      
      // Check if canonical tag exists with expected URL
      return content.includes(`rel="canonical"`) && content.includes(expectedCanonical);
    } catch (error) {
      this.logger.error(`Failed to verify fix for ${url}`, { error: error.message });
      return false;
    }
  }
}

export default CanonicalFixer;
