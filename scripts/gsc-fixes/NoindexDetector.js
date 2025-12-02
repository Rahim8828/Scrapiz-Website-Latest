import axios from 'axios';
import * as cheerio from 'cheerio';
import { normalizeUrl, isValidUrl } from './utils.js';

/**
 * Noindex Detector Module
 * Detects noindex tags in meta tags, HTTP headers, and robots.txt
 */
class NoindexDetector {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.httpClient = axios.create({
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true
    });
    this.robotsTxtCache = null;
  }

  /**
   * Check for noindex in meta robots tag
   * @param {string} html - HTML content
   * @returns {boolean} True if noindex found in meta tag
   */
  checkMetaRobotsNoindex(html) {
    if (!html) {
      return false;
    }

    try {
      const $ = cheerio.load(html);
      
      // Check meta robots tag
      const metaRobots = $('meta[name="robots"]').attr('content') || '';
      if (metaRobots.toLowerCase().includes('noindex')) {
        return true;
      }

      // Check meta googlebot tag
      const metaGooglebot = $('meta[name="googlebot"]').attr('content') || '';
      if (metaGooglebot.toLowerCase().includes('noindex')) {
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error('Error checking meta robots noindex', { error: error.message });
      return false;
    }
  }

  /**
   * Check for noindex in X-Robots-Tag HTTP header
   * @param {Object} headers - HTTP response headers
   * @returns {boolean} True if noindex found in header
   */
  checkXRobotsTagNoindex(headers) {
    if (!headers) {
      return false;
    }

    try {
      const xRobotsTag = headers['x-robots-tag'] || '';
      return xRobotsTag.toLowerCase().includes('noindex');
    } catch (error) {
      this.logger.error('Error checking X-Robots-Tag noindex', { error: error.message });
      return false;
    }
  }

  /**
   * Fetch and parse robots.txt
   * @param {string} baseUrl - Base URL of the site
   * @returns {Promise<Object>} Parsed robots.txt rules
   */
  async fetchRobotsTxt(baseUrl) {
    if (this.robotsTxtCache) {
      return this.robotsTxtCache;
    }

    try {
      const urlObj = new URL(baseUrl);
      const robotsTxtUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;
      
      const response = await this.httpClient.get(robotsTxtUrl);
      
      if (response.status !== 200) {
        this.logger.warn(`robots.txt not found at ${robotsTxtUrl}`);
        this.robotsTxtCache = { rules: [], exists: false };
        return this.robotsTxtCache;
      }

      const rules = this.parseRobotsTxt(response.data);
      this.robotsTxtCache = { rules, exists: true, content: response.data };
      
      return this.robotsTxtCache;
    } catch (error) {
      this.logger.error('Error fetching robots.txt', { error: error.message });
      this.robotsTxtCache = { rules: [], exists: false, error: error.message };
      return this.robotsTxtCache;
    }
  }

  /**
   * Parse robots.txt content
   * @param {string} content - robots.txt content
   * @returns {Array<Object>} Parsed rules
   */
  parseRobotsTxt(content) {
    const rules = [];
    const lines = content.split('\n');
    let currentUserAgent = '*';

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Parse User-agent
      if (trimmed.toLowerCase().startsWith('user-agent:')) {
        currentUserAgent = trimmed.substring(11).trim();
        continue;
      }

      // Parse Disallow
      if (trimmed.toLowerCase().startsWith('disallow:')) {
        const path = trimmed.substring(9).trim();
        rules.push({
          userAgent: currentUserAgent,
          type: 'disallow',
          path
        });
      }

      // Parse Allow
      if (trimmed.toLowerCase().startsWith('allow:')) {
        const path = trimmed.substring(6).trim();
        rules.push({
          userAgent: currentUserAgent,
          type: 'allow',
          path
        });
      }
    }

    return rules;
  }

  /**
   * Check if URL is blocked by robots.txt
   * @param {string} url - URL to check
   * @param {string} baseUrl - Base URL of the site
   * @returns {Promise<boolean>} True if blocked
   */
  async checkRobotsTxtBlocking(url, baseUrl) {
    try {
      const robotsTxt = await this.fetchRobotsTxt(baseUrl);
      
      if (!robotsTxt.exists) {
        return false;
      }

      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      // Check rules for Googlebot and * user agents
      const relevantRules = robotsTxt.rules.filter(rule => 
        rule.userAgent === '*' || 
        rule.userAgent.toLowerCase() === 'googlebot'
      );

      // Check if path is disallowed
      for (const rule of relevantRules) {
        if (rule.type === 'disallow' && rule.path) {
          // Simple pattern matching
          if (pathname.startsWith(rule.path)) {
            return true;
          }
          
          // Wildcard matching
          if (rule.path.includes('*')) {
            const pattern = rule.path.replace(/\*/g, '.*');
            const regex = new RegExp(`^${pattern}`);
            if (regex.test(pathname)) {
              return true;
            }
          }
        }
      }

      return false;
    } catch (error) {
      this.logger.error(`Error checking robots.txt blocking for ${url}`, { error: error.message });
      return false;
    }
  }

  /**
   * Determine if page should be indexed based on content value
   * @param {Object} pageData - Page data including content analysis
   * @returns {boolean} True if page should be indexed
   */
  shouldBeIndexed(pageData) {
    const {
      wordCount = 0,
      hasHeadings = false,
      hasInternalLinks = false,
      hasBacklinks = false,
      isImportantPage = false
    } = pageData;

    // Important pages should always be indexed
    if (isImportantPage) {
      return true;
    }

    // Pages with backlinks should be indexed
    if (hasBacklinks) {
      return true;
    }

    // Pages with substantial content should be indexed
    if (wordCount >= 500 && hasHeadings && hasInternalLinks) {
      return true;
    }

    // Thin content pages should not be indexed
    return false;
  }

  /**
   * Check for noindex issues on a single URL
   * @param {string} url - URL to check
   * @param {Object} options - Check options
   * @returns {Promise<Object|null>} Noindex issue or null
   */
  async checkNoindex(url, options = {}) {
    const {
      baseUrl = url,
      pageData = {}
    } = options;

    if (!isValidUrl(url)) {
      return null;
    }

    try {
      // Fetch the page
      const response = await this.httpClient.get(url);
      
      if (response.status !== 200) {
        return null;
      }

      // Check for noindex in meta tags
      const hasMetaNoindex = this.checkMetaRobotsNoindex(response.data);

      // Check for noindex in HTTP headers
      const hasHeaderNoindex = this.checkXRobotsTagNoindex(response.headers);

      // Check for robots.txt blocking
      const isRobotsBlocked = await this.checkRobotsTxtBlocking(url, baseUrl);

      // If no noindex found, return null
      if (!hasMetaNoindex && !hasHeaderNoindex && !isRobotsBlocked) {
        return null;
      }

      // Determine noindex source
      const noindexSources = [];
      if (hasMetaNoindex) noindexSources.push('meta-tag');
      if (hasHeaderNoindex) noindexSources.push('http-header');
      if (isRobotsBlocked) noindexSources.push('robots.txt');

      const noindexSource = noindexSources.join(', ');

      // Determine if page should be indexed
      const shouldBeIndexed = this.shouldBeIndexed(pageData);

      // Build issue object
      const issue = {
        url,
        noindexSource,
        hasMetaNoindex,
        hasHeaderNoindex,
        isRobotsBlocked,
        shouldBeIndexed,
        inSitemap: false, // Will be checked later
        hasBacklinks: pageData.hasBacklinks || false,
        recommendation: this.getNoindexRecommendation(
          shouldBeIndexed,
          noindexSources,
          pageData
        ),
        fixable: shouldBeIndexed && (hasMetaNoindex || hasHeaderNoindex)
      };

      return issue;
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `checkNoindex: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get recommendation for noindex issue
   * @param {boolean} shouldBeIndexed - Whether page should be indexed
   * @param {Array<string>} noindexSources - Sources of noindex
   * @param {Object} pageData - Page data
   * @returns {string} Recommendation
   */
  getNoindexRecommendation(shouldBeIndexed, noindexSources, pageData) {
    if (shouldBeIndexed) {
      const sources = noindexSources.join(' and ');
      return `Remove noindex from ${sources}. This page has valuable content and should be indexed.`;
    } else {
      return `Page correctly has noindex. Ensure it's excluded from sitemap and not linked from important pages.`;
    }
  }

  /**
   * Batch check noindex for multiple URLs
   * @param {Array<string>} urls - URLs to check
   * @param {Object} options - Check options
   * @returns {Promise<Array<Object>>} Array of noindex issues
   */
  async checkNoindexes(urls, options = {}) {
    this.logger.info(`Checking noindex for ${urls.length} URLs`);

    const issues = [];
    const batchSize = 5;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => this.checkNoindex(url, options))
      );

      issues.push(...batchResults.filter(issue => issue !== null));

      // Small delay between batches
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.logger.info(`Noindex check complete. Found ${issues.length} issues`);
    return issues;
  }

  /**
   * Analyze noindex patterns across all URLs
   * @param {Array<Object>} noindexIssues - Array of noindex issues
   * @returns {Object} Analysis summary
   */
  analyzeNoindexPatterns(noindexIssues) {
    const analysis = {
      totalNoindex: noindexIssues.length,
      shouldBeIndexed: 0,
      correctlyNoindexed: 0,
      bySource: {
        'meta-tag': 0,
        'http-header': 0,
        'robots.txt': 0
      }
    };

    noindexIssues.forEach(issue => {
      if (issue.shouldBeIndexed) {
        analysis.shouldBeIndexed++;
      } else {
        analysis.correctlyNoindexed++;
      }

      if (issue.hasMetaNoindex) {
        analysis.bySource['meta-tag']++;
      }
      if (issue.hasHeaderNoindex) {
        analysis.bySource['http-header']++;
      }
      if (issue.isRobotsBlocked) {
        analysis.bySource['robots.txt']++;
      }
    });

    return analysis;
  }

  /**
   * Clear robots.txt cache
   */
  clearCache() {
    this.robotsTxtCache = null;
    this.logger.info('Robots.txt cache cleared');
  }
}

export default NoindexDetector;
