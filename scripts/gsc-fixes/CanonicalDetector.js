import axios from 'axios';
import * as cheerio from 'cheerio';
import { normalizeUrl, isValidUrl, calculateSimilarity, extractTextFromHtml } from './utils.js';

/**
 * Canonical Detector Module
 * Detects canonical tag issues and duplicate content
 */
class CanonicalDetector {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.httpClient = axios.create({
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true
    });
    this.pageCache = new Map(); // Cache for page content
  }

  /**
   * Extract canonical tag from HTML
   * @param {string} html - HTML content
   * @param {string} pageUrl - Page URL for resolving relative URLs
   * @returns {string|null} Canonical URL or null
   */
  extractCanonicalTag(html, pageUrl) {
    if (!html) {
      return null;
    }

    try {
      const $ = cheerio.load(html);
      const canonicalTag = $('link[rel="canonical"]').attr('href');
      
      if (!canonicalTag) {
        return null;
      }

      // Resolve relative URLs
      let canonical = canonicalTag;
      if (canonical.startsWith('/')) {
        const urlObj = new URL(pageUrl);
        canonical = `${urlObj.protocol}//${urlObj.host}${canonical}`;
      } else if (!canonical.startsWith('http')) {
        const urlObj = new URL(pageUrl);
        const basePath = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
        canonical = `${urlObj.protocol}//${urlObj.host}${basePath}${canonical}`;
      }

      return normalizeUrl(canonical);
    } catch (error) {
      this.logger.error(`Error extracting canonical tag from ${pageUrl}`, { error: error.message });
      return null;
    }
  }

  /**
   * Validate canonical target (200 status, not blocked)
   * @param {string} canonicalUrl - Canonical URL to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateCanonicalTarget(canonicalUrl) {
    if (!isValidUrl(canonicalUrl)) {
      return {
        valid: false,
        reason: 'invalid-url',
        status: null,
        noindex: false,
        robotsBlocked: false
      };
    }

    try {
      // Check HTTP status
      const response = await this.httpClient.get(canonicalUrl, {
        maxRedirects: 0,
        validateStatus: () => true
      });

      if (response.status !== 200) {
        return {
          valid: false,
          reason: 'non-200-status',
          status: response.status,
          noindex: false,
          robotsBlocked: false
        };
      }

      // Check for noindex in meta tags
      const $ = cheerio.load(response.data);
      const metaRobots = $('meta[name="robots"]').attr('content') || '';
      const hasNoindex = metaRobots.toLowerCase().includes('noindex');

      // Check for noindex in HTTP headers
      const xRobotsTag = response.headers['x-robots-tag'] || '';
      const hasNoindexHeader = xRobotsTag.toLowerCase().includes('noindex');

      if (hasNoindex || hasNoindexHeader) {
        return {
          valid: false,
          reason: 'noindex',
          status: response.status,
          noindex: true,
          robotsBlocked: false
        };
      }

      // TODO: Check robots.txt blocking (would require fetching and parsing robots.txt)
      
      return {
        valid: true,
        reason: null,
        status: response.status,
        noindex: false,
        robotsBlocked: false
      };
    } catch (error) {
      this.logger.error(`Error validating canonical target ${canonicalUrl}`, { error: error.message });
      return {
        valid: false,
        reason: 'fetch-error',
        status: null,
        noindex: false,
        robotsBlocked: false,
        error: error.message
      };
    }
  }

  /**
   * Fetch and cache page content
   * @param {string} url - URL to fetch
   * @returns {Promise<Object>} Page data
   */
  async fetchPage(url) {
    // Check cache first
    if (this.pageCache.has(url)) {
      return this.pageCache.get(url);
    }

    try {
      const response = await this.httpClient.get(url);
      
      const pageData = {
        url,
        status: response.status,
        headers: response.headers,
        html: response.data,
        success: response.status === 200
      };

      // Cache the result
      this.pageCache.set(url, pageData);
      
      return pageData;
    } catch (error) {
      this.logger.error(`Failed to fetch page: ${url}`, { error: error.message });
      const errorData = {
        url,
        status: null,
        headers: {},
        html: null,
        success: false,
        error: error.message
      };
      
      this.pageCache.set(url, errorData);
      return errorData;
    }
  }

  /**
   * Calculate content similarity between two pages
   * @param {string} html1 - First page HTML
   * @param {string} html2 - Second page HTML
   * @returns {number} Similarity score (0-1)
   */
  calculateContentSimilarity(html1, html2) {
    if (!html1 || !html2) {
      return 0;
    }

    try {
      // Extract text content
      const text1 = extractTextFromHtml(html1);
      const text2 = extractTextFromHtml(html2);

      // If either is empty, return 0
      if (!text1 || !text2) {
        return 0;
      }

      // For very long texts, use a sampling approach
      const maxLength = 5000;
      const sample1 = text1.substring(0, maxLength);
      const sample2 = text2.substring(0, maxLength);

      return calculateSimilarity(sample1, sample2);
    } catch (error) {
      this.logger.error('Error calculating content similarity', { error: error.message });
      return 0;
    }
  }

  /**
   * Detect duplicate content using similarity scoring
   * @param {string} url - URL to check
   * @param {Array<string>} compareUrls - URLs to compare against
   * @param {number} threshold - Similarity threshold (default 0.8)
   * @returns {Promise<Array<Object>>} Array of duplicate matches
   */
  async detectDuplicateContent(url, compareUrls, threshold = 0.8) {
    try {
      const targetPage = await this.fetchPage(url);
      
      if (!targetPage.success || !targetPage.html) {
        return [];
      }

      const duplicates = [];

      for (const compareUrl of compareUrls) {
        // Skip comparing with itself
        if (normalizeUrl(url) === normalizeUrl(compareUrl)) {
          continue;
        }

        const comparePage = await this.fetchPage(compareUrl);
        
        if (!comparePage.success || !comparePage.html) {
          continue;
        }

        const similarity = this.calculateContentSimilarity(targetPage.html, comparePage.html);

        if (similarity >= threshold) {
          duplicates.push({
            url: compareUrl,
            similarity,
            isDuplicate: true
          });
        }
      }

      return duplicates;
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `detectDuplicateContent: ${url}`);
      if (recovery.action === 'skip') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Check canonical tag for a single URL
   * @param {string} url - URL to check
   * @returns {Promise<Object|null>} Canonical issue or null
   */
  async checkCanonical(url) {
    try {
      const pageData = await this.fetchPage(url);
      
      if (!pageData.success) {
        return null;
      }

      const canonical = this.extractCanonicalTag(pageData.html, url);
      const normalizedUrl = normalizeUrl(url);

      // Missing canonical tag
      if (!canonical) {
        return {
          url,
          currentCanonical: null,
          expectedCanonical: normalizedUrl,
          issueType: 'missing',
          inSitemap: false,
          recommendation: 'Add self-referencing canonical tag',
          fixable: true
        };
      }

      const normalizedCanonical = normalizeUrl(canonical);

      // Self-referencing canonical (correct)
      if (normalizedCanonical === normalizedUrl) {
        return null;
      }

      // Canonical points to different URL - validate the target
      const validation = await this.validateCanonicalTarget(canonical);

      if (!validation.valid) {
        return {
          url,
          currentCanonical: canonical,
          expectedCanonical: normalizedUrl,
          issueType: `invalid-target-${validation.reason}`,
          inSitemap: false,
          recommendation: this.getCanonicalRecommendation(validation),
          fixable: true,
          validationDetails: validation
        };
      }

      // Canonical is valid but points to different URL (alternative page)
      return {
        url,
        currentCanonical: canonical,
        expectedCanonical: canonical,
        issueType: 'alternative-page',
        inSitemap: false,
        recommendation: 'Page has canonical pointing to different URL. Verify this is intentional for duplicate content',
        fixable: false
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `checkCanonical: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get recommendation based on validation result
   * @param {Object} validation - Validation result
   * @returns {string} Recommendation
   */
  getCanonicalRecommendation(validation) {
    switch (validation.reason) {
      case 'invalid-url':
        return 'Canonical URL is invalid. Update to valid URL or make self-referencing';
      case 'non-200-status':
        return `Canonical target returns ${validation.status}. Update to valid URL or make self-referencing`;
      case 'noindex':
        return 'Canonical target has noindex. Choose different canonical or remove noindex from target';
      case 'fetch-error':
        return 'Cannot fetch canonical target. Verify URL is accessible';
      default:
        return 'Canonical target validation failed. Review and update canonical tag';
    }
  }

  /**
   * Find duplicate pages for a URL
   * @param {string} url - URL to check
   * @param {Array<string>} allUrls - All URLs to compare against
   * @returns {Promise<Object|null>} Duplicate issue or null
   */
  async findDuplicates(url, allUrls) {
    try {
      const duplicates = await this.detectDuplicateContent(url, allUrls);

      if (duplicates.length === 0) {
        return null;
      }

      // Check if page already has canonical
      const pageData = await this.fetchPage(url);
      const canonical = this.extractCanonicalTag(pageData.html, url);
      const normalizedUrl = normalizeUrl(url);

      // If already has canonical pointing elsewhere, it's handled
      if (canonical && normalizeUrl(canonical) !== normalizedUrl) {
        return null;
      }

      // Select primary version (for now, use the first URL alphabetically)
      const allDuplicateUrls = [url, ...duplicates.map(d => d.url)].sort();
      const primaryUrl = allDuplicateUrls[0];

      return {
        url,
        duplicateOf: primaryUrl !== url ? primaryUrl : null,
        duplicates: duplicates.map(d => d.url),
        similarityScore: duplicates.length > 0 ? duplicates[0].similarity : 0,
        hasCanonical: !!canonical,
        canonicalTarget: canonical,
        recommendation: primaryUrl !== url 
          ? `Add canonical tag pointing to ${primaryUrl}`
          : 'This is the primary version. Ensure other duplicates have canonical pointing here',
        fixable: true
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `findDuplicates: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Batch check canonical tags for multiple URLs
   * @param {Array<string>} urls - URLs to check
   * @returns {Promise<Array<Object>>} Array of canonical issues
   */
  async checkCanonicals(urls) {
    this.logger.info(`Checking canonical tags for ${urls.length} URLs`);
    
    const issues = [];
    const batchSize = 5;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => this.checkCanonical(url))
      );
      
      issues.push(...batchResults.filter(issue => issue !== null));

      // Small delay between batches
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.logger.info(`Canonical check complete. Found ${issues.length} issues`);
    return issues;
  }

  /**
   * Clear page cache
   */
  clearCache() {
    this.pageCache.clear();
    this.logger.info('Page cache cleared');
  }
}

export default CanonicalDetector;
