import fs from 'fs/promises';
import path from 'path';

/**
 * Robots.txt Manager Module
 * Manages robots.txt parsing, validation, and generation
 * 
 * Requirements: 10.4, 10.5
 */
class RobotsTxtManager {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.robotsPath = path.join(process.cwd(), 'public/robots.txt');
    this.baseUrl = 'https://www.scrapiz.in';
  }

  /**
   * Parse robots.txt file
   * @returns {Promise<Object>} Parsed robots.txt structure
   */
  async parseRobotsTxt() {
    try {
      this.logger.info('Parsing robots.txt file');
      
      const content = await fs.readFile(this.robotsPath, 'utf-8');
      const lines = content.split('\n').map(line => line.trim());
      
      const parsed = {
        userAgents: [],
        sitemaps: [],
        raw: content
      };
      
      let currentAgent = null;
      
      for (const line of lines) {
        // Skip empty lines and comments
        if (!line || line.startsWith('#')) {
          continue;
        }
        
        // Parse User-agent directive
        if (line.toLowerCase().startsWith('user-agent:')) {
          const agent = line.substring(11).trim();
          currentAgent = {
            agent,
            disallow: [],
            allow: [],
            crawlDelay: null
          };
          parsed.userAgents.push(currentAgent);
          continue;
        }
        
        // Parse Disallow directive
        if (line.toLowerCase().startsWith('disallow:')) {
          const path = line.substring(9).trim();
          if (currentAgent) {
            currentAgent.disallow.push(path);
          }
          continue;
        }
        
        // Parse Allow directive
        if (line.toLowerCase().startsWith('allow:')) {
          const path = line.substring(6).trim();
          if (currentAgent) {
            currentAgent.allow.push(path);
          }
          continue;
        }
        
        // Parse Crawl-delay directive
        if (line.toLowerCase().startsWith('crawl-delay:')) {
          const delay = line.substring(12).trim();
          if (currentAgent) {
            currentAgent.crawlDelay = parseInt(delay, 10);
          }
          continue;
        }
        
        // Parse Sitemap directive
        if (line.toLowerCase().startsWith('sitemap:')) {
          const sitemapUrl = line.substring(8).trim();
          parsed.sitemaps.push(sitemapUrl);
          continue;
        }
      }
      
      this.logger.info('Robots.txt parsed successfully', {
        userAgents: parsed.userAgents.length,
        sitemaps: parsed.sitemaps.length
      });
      
      return parsed;
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.warn('Robots.txt file not found');
        return {
          userAgents: [],
          sitemaps: [],
          raw: ''
        };
      }
      this.logger.error('Failed to parse robots.txt', { error: error.message });
      throw error;
    }
  }

  /**
   * Check if a path is blocked by robots.txt
   * @param {string} urlPath - URL path to check
   * @param {string} userAgent - User agent to check for (default: '*')
   * @returns {Promise<Object>} Result with blocked status and reason
   */
  async isPathBlocked(urlPath, userAgent = '*') {
    try {
      const parsed = await this.parseRobotsTxt();
      
      // Find matching user agent rules (check specific agent first, then *)
      const agentRules = parsed.userAgents.filter(ua => 
        ua.agent === userAgent || ua.agent === '*'
      );
      
      if (agentRules.length === 0) {
        return { blocked: false, reason: 'no-rules' };
      }
      
      // Check rules in order (more specific first)
      for (const rules of agentRules) {
        // Check Allow rules first (they take precedence)
        for (const allowPath of rules.allow) {
          if (this.matchesPattern(urlPath, allowPath)) {
            return { blocked: false, reason: 'explicitly-allowed', pattern: allowPath };
          }
        }
        
        // Check Disallow rules
        for (const disallowPath of rules.disallow) {
          if (this.matchesPattern(urlPath, disallowPath)) {
            return { blocked: true, reason: 'disallowed', pattern: disallowPath };
          }
        }
      }
      
      return { blocked: false, reason: 'no-matching-rule' };
    } catch (error) {
      this.logger.error('Failed to check if path is blocked', { error: error.message });
      throw error;
    }
  }

  /**
   * Check if URL matches robots.txt pattern
   * @param {string} urlPath - URL path to check
   * @param {string} pattern - Pattern from robots.txt
   * @returns {boolean} True if matches
   */
  matchesPattern(urlPath, pattern) {
    // Empty pattern matches nothing
    if (!pattern) {
      return false;
    }
    
    // Empty disallow means allow all
    if (pattern === '/') {
      return urlPath.startsWith('/');
    }
    
    // Convert robots.txt pattern to regex
    // * matches any sequence of characters
    // $ at end means exact match
    let regexPattern = pattern
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars
      .replace(/\*/g, '.*'); // Convert * to .*
    
    if (pattern.endsWith('$')) {
      regexPattern = regexPattern.slice(0, -2) + '$'; // Exact match
    } else {
      // Pattern matches if URL starts with it
      regexPattern = '^' + regexPattern;
    }
    
    const regex = new RegExp(regexPattern);
    return regex.test(urlPath);
  }

  /**
   * Check if important resources are blocked (CSS, JS, images)
   * @param {Array<string>} resourcePaths - Array of resource paths to check
   * @returns {Promise<Array<Object>>} Array of blocked resources
   */
  async checkResourceBlocking(resourcePaths) {
    try {
      this.logger.info(`Checking ${resourcePaths.length} resources for blocking`);
      
      const blockedResources = [];
      
      for (const resourcePath of resourcePaths) {
        const result = await this.isPathBlocked(resourcePath, 'Googlebot');
        
        if (result.blocked) {
          blockedResources.push({
            path: resourcePath,
            reason: result.reason,
            pattern: result.pattern,
            type: this.getResourceType(resourcePath)
          });
        }
      }
      
      this.logger.info(`Found ${blockedResources.length} blocked resources`);
      
      return blockedResources;
    } catch (error) {
      this.logger.error('Failed to check resource blocking', { error: error.message });
      throw error;
    }
  }

  /**
   * Get resource type from path
   * @param {string} path - Resource path
   * @returns {string} Resource type
   */
  getResourceType(path) {
    const ext = path.split('.').pop()?.toLowerCase();
    
    if (['css'].includes(ext)) return 'stylesheet';
    if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) return 'script';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico'].includes(ext)) return 'image';
    if (['woff', 'woff2', 'ttf', 'eot'].includes(ext)) return 'font';
    
    return 'other';
  }

  /**
   * Validate sitemap directive in robots.txt
   * @param {string} expectedSitemapUrl - Expected sitemap URL
   * @returns {Promise<Object>} Validation result
   */
  async validateSitemapDirective(expectedSitemapUrl = null) {
    try {
      this.logger.info('Validating sitemap directive in robots.txt');
      
      const parsed = await this.parseRobotsTxt();
      const issues = [];
      
      // Check if sitemap directive exists
      if (parsed.sitemaps.length === 0) {
        issues.push({
          issue: 'missing-sitemap',
          severity: 'error',
          message: 'No Sitemap directive found in robots.txt'
        });
      }
      
      // Check if expected sitemap is present
      if (expectedSitemapUrl) {
        const hasSitemap = parsed.sitemaps.some(url => 
          url === expectedSitemapUrl || url.endsWith(expectedSitemapUrl)
        );
        
        if (!hasSitemap) {
          issues.push({
            issue: 'incorrect-sitemap',
            severity: 'error',
            message: `Expected sitemap ${expectedSitemapUrl} not found`,
            found: parsed.sitemaps
          });
        }
      }
      
      // Check for multiple sitemap directives (valid but unusual)
      if (parsed.sitemaps.length > 1) {
        issues.push({
          issue: 'multiple-sitemaps',
          severity: 'info',
          message: `Found ${parsed.sitemaps.length} sitemap directives`,
          sitemaps: parsed.sitemaps
        });
      }
      
      const valid = issues.filter(i => i.severity === 'error').length === 0;
      
      this.logger.info(`Sitemap directive validation: ${valid ? 'valid' : 'invalid'}`);
      
      return {
        valid,
        issues,
        sitemaps: parsed.sitemaps
      };
    } catch (error) {
      this.logger.error('Failed to validate sitemap directive', { error: error.message });
      throw error;
    }
  }

  /**
   * Generate robots.txt with proper directives
   * @param {Object} config - Configuration object
   * @returns {string} Generated robots.txt content
   */
  generateRobotsTxt(config = {}) {
    try {
      this.logger.info('Generating robots.txt');
      
      const {
        userAgents = [{ agent: '*', disallow: [], allow: [] }],
        sitemaps = [`${this.baseUrl}/sitemap.xml`],
        crawlDelay = null,
        comments = []
      } = config;
      
      const lines = [];
      
      // Add comments
      if (comments.length > 0) {
        comments.forEach(comment => {
          lines.push(`# ${comment}`);
        });
        lines.push('');
      }
      
      // Add user agent rules
      userAgents.forEach((ua, index) => {
        if (index > 0) {
          lines.push(''); // Blank line between user agents
        }
        
        lines.push(`User-agent: ${ua.agent}`);
        
        // Add Allow rules first
        if (ua.allow && ua.allow.length > 0) {
          ua.allow.forEach(path => {
            lines.push(`Allow: ${path}`);
          });
        }
        
        // Add Disallow rules
        if (ua.disallow && ua.disallow.length > 0) {
          ua.disallow.forEach(path => {
            lines.push(`Disallow: ${path}`);
          });
        } else {
          // If no disallow rules, allow all
          lines.push('Disallow:');
        }
        
        // Add Crawl-delay if specified
        if (ua.crawlDelay || crawlDelay) {
          lines.push(`Crawl-delay: ${ua.crawlDelay || crawlDelay}`);
        }
      });
      
      // Add sitemap directives
      if (sitemaps.length > 0) {
        lines.push('');
        sitemaps.forEach(sitemap => {
          lines.push(`Sitemap: ${sitemap}`);
        });
      }
      
      const content = lines.join('\n') + '\n';
      
      this.logger.info('Robots.txt generated successfully');
      
      return content;
    } catch (error) {
      this.logger.error('Failed to generate robots.txt', { error: error.message });
      throw error;
    }
  }

  /**
   * Write robots.txt file
   * @param {string} content - Robots.txt content
   * @returns {Promise<void>}
   */
  async writeRobotsTxt(content) {
    try {
      this.logger.info('Writing robots.txt file');
      
      // Create backup
      const backupPath = await this.errorHandler.createBackup(this.robotsPath);
      
      try {
        await fs.writeFile(this.robotsPath, content, 'utf-8');
        this.logger.info('Robots.txt written successfully');
      } catch (error) {
        // Rollback on error
        await this.errorHandler.rollback(backupPath, this.robotsPath);
        throw error;
      }
    } catch (error) {
      this.logger.error('Failed to write robots.txt', { error: error.message });
      throw error;
    }
  }

  /**
   * Update sitemap directive in robots.txt
   * @param {string} sitemapUrl - Sitemap URL to add/update
   * @returns {Promise<Object>} Result
   */
  async updateSitemapDirective(sitemapUrl) {
    try {
      this.logger.info(`Updating sitemap directive to: ${sitemapUrl}`);
      
      const parsed = await this.parseRobotsTxt();
      
      // Check if sitemap already exists
      const existingIndex = parsed.sitemaps.findIndex(url => 
        url === sitemapUrl || url.endsWith(sitemapUrl)
      );
      
      if (existingIndex !== -1) {
        this.logger.info('Sitemap directive already exists');
        return {
          success: true,
          action: 'no-change',
          message: 'Sitemap directive already exists'
        };
      }
      
      // Add sitemap to list
      parsed.sitemaps.push(sitemapUrl);
      
      // Generate new robots.txt
      const newContent = this.generateRobotsTxt({
        userAgents: parsed.userAgents.length > 0 ? parsed.userAgents : undefined,
        sitemaps: parsed.sitemaps
      });
      
      // Write new robots.txt
      await this.writeRobotsTxt(newContent);
      
      this.logger.info('Sitemap directive updated successfully');
      
      return {
        success: true,
        action: 'added',
        sitemapUrl
      };
    } catch (error) {
      this.logger.error('Failed to update sitemap directive', { error: error.message });
      throw error;
    }
  }

  /**
   * Remove blocking rules for important resources
   * @param {Array<string>} resourcePatterns - Resource patterns to unblock
   * @returns {Promise<Object>} Result
   */
  async unblockResources(resourcePatterns) {
    try {
      this.logger.info(`Unblocking ${resourcePatterns.length} resource patterns`);
      
      const parsed = await this.parseRobotsTxt();
      let modified = false;
      
      // Remove disallow rules that match resource patterns
      parsed.userAgents.forEach(ua => {
        const originalLength = ua.disallow.length;
        
        ua.disallow = ua.disallow.filter(disallowPath => {
          // Check if this disallow rule blocks any of the resource patterns
          const blocksResource = resourcePatterns.some(pattern => 
            this.matchesPattern(pattern, disallowPath)
          );
          return !blocksResource;
        });
        
        if (ua.disallow.length < originalLength) {
          modified = true;
        }
      });
      
      if (!modified) {
        this.logger.info('No blocking rules found for specified resources');
        return {
          success: true,
          action: 'no-change',
          message: 'No blocking rules found'
        };
      }
      
      // Generate new robots.txt
      const newContent = this.generateRobotsTxt({
        userAgents: parsed.userAgents,
        sitemaps: parsed.sitemaps
      });
      
      // Write new robots.txt
      await this.writeRobotsTxt(newContent);
      
      this.logger.info('Resources unblocked successfully');
      
      return {
        success: true,
        action: 'modified',
        message: 'Blocking rules removed'
      };
    } catch (error) {
      this.logger.error('Failed to unblock resources', { error: error.message });
      throw error;
    }
  }

  /**
   * Validate robots.txt structure and rules
   * @returns {Promise<Object>} Validation result
   */
  async validateRobotsTxt() {
    try {
      this.logger.info('Validating robots.txt');
      
      const parsed = await this.parseRobotsTxt();
      const issues = [];
      
      // Check if file exists
      if (!parsed.raw) {
        issues.push({
          issue: 'missing-file',
          severity: 'error',
          message: 'Robots.txt file not found'
        });
        return { valid: false, issues };
      }
      
      // Check for user agent rules
      if (parsed.userAgents.length === 0) {
        issues.push({
          issue: 'no-user-agents',
          severity: 'warning',
          message: 'No User-agent directives found'
        });
      }
      
      // Check for sitemap directive
      if (parsed.sitemaps.length === 0) {
        issues.push({
          issue: 'no-sitemap',
          severity: 'error',
          message: 'No Sitemap directive found'
        });
      }
      
      // Check for blocking of important resources
      const importantPaths = ['/assets/', '/src/', '/public/', '/*.css', '/*.js'];
      const blockedImportant = [];
      
      for (const path of importantPaths) {
        const result = await this.isPathBlocked(path, 'Googlebot');
        if (result.blocked) {
          blockedImportant.push({ path, pattern: result.pattern });
        }
      }
      
      if (blockedImportant.length > 0) {
        issues.push({
          issue: 'important-resources-blocked',
          severity: 'error',
          message: 'Important resources are blocked',
          blocked: blockedImportant
        });
      }
      
      // Check for overly broad disallow rules
      parsed.userAgents.forEach(ua => {
        if (ua.disallow.includes('/')) {
          issues.push({
            issue: 'blocks-all-content',
            severity: 'error',
            message: `User-agent ${ua.agent} blocks all content with "Disallow: /"`
          });
        }
      });
      
      const valid = issues.filter(i => i.severity === 'error').length === 0;
      
      this.logger.info(`Robots.txt validation: ${valid ? 'valid' : 'invalid'}`, {
        issueCount: issues.length
      });
      
      return {
        valid,
        issues,
        userAgents: parsed.userAgents.length,
        sitemaps: parsed.sitemaps.length
      };
    } catch (error) {
      this.logger.error('Failed to validate robots.txt', { error: error.message });
      return {
        valid: false,
        issues: [{
          issue: 'validation-error',
          severity: 'error',
          message: error.message
        }]
      };
    }
  }

  /**
   * Get robots.txt statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    try {
      const parsed = await this.parseRobotsTxt();
      
      const stats = {
        exists: !!parsed.raw,
        userAgents: parsed.userAgents.length,
        sitemaps: parsed.sitemaps.length,
        totalDisallowRules: 0,
        totalAllowRules: 0,
        byUserAgent: {}
      };
      
      parsed.userAgents.forEach(ua => {
        stats.totalDisallowRules += ua.disallow.length;
        stats.totalAllowRules += ua.allow.length;
        
        stats.byUserAgent[ua.agent] = {
          disallow: ua.disallow.length,
          allow: ua.allow.length,
          crawlDelay: ua.crawlDelay
        };
      });
      
      return stats;
    } catch (error) {
      this.logger.error('Failed to get robots.txt statistics', { error: error.message });
      throw error;
    }
  }
}

export default RobotsTxtManager;
