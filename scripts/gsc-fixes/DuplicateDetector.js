import axios from 'axios';
import * as cheerio from 'cheerio';
import { normalizeUrl, isValidUrl, calculateSimilarity, extractTextFromHtml } from './utils.js';

/**
 * Duplicate Content Detector Module
 * Detects duplicate content and URL variations
 */
class DuplicateDetector {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.httpClient = axios.create({
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true
    });
    this.pageCache = new Map(); // Cache for page content
    this.similarityThreshold = 0.8; // Default similarity threshold
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
        text: extractTextFromHtml(response.data),
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
        text: '',
        success: false,
        error: error.message
      };
      
      this.pageCache.set(url, errorData);
      return errorData;
    }
  }

  /**
   * Calculate content similarity between two pages
   * @param {string} text1 - First page text content
   * @param {string} text2 - Second page text content
   * @returns {number} Similarity score (0-1)
   */
  calculateContentSimilarity(text1, text2) {
    if (!text1 || !text2) {
      return 0;
    }

    try {
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
  async detectDuplicateContent(url, compareUrls, threshold = null) {
    const similarityThreshold = threshold !== null ? threshold : this.similarityThreshold;

    try {
      const targetPage = await this.fetchPage(url);
      
      if (!targetPage.success || !targetPage.text) {
        return [];
      }

      const duplicates = [];

      for (const compareUrl of compareUrls) {
        // Skip comparing with itself
        if (normalizeUrl(url) === normalizeUrl(compareUrl)) {
          continue;
        }

        const comparePage = await this.fetchPage(compareUrl);
        
        if (!comparePage.success || !comparePage.text) {
          continue;
        }

        const similarity = this.calculateContentSimilarity(targetPage.text, comparePage.text);

        if (similarity >= similarityThreshold) {
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
   * Select primary version from duplicate URLs
   * Uses multiple criteria to determine the best primary version
   * @param {Array<string>} urls - Array of duplicate URLs
   * @returns {string} Primary URL
   */
  selectPrimaryVersion(urls) {
    if (!urls || urls.length === 0) {
      return null;
    }

    if (urls.length === 1) {
      return urls[0];
    }

    // Scoring system for selecting primary version
    const scores = urls.map(url => {
      let score = 0;
      const urlObj = new URL(url);

      // Prefer HTTPS over HTTP
      if (urlObj.protocol === 'https:') {
        score += 10;
      }

      // Prefer URLs without parameters
      if (!urlObj.search) {
        score += 5;
      }

      // Prefer URLs without trailing slash (normalized)
      if (!urlObj.pathname.endsWith('/') || urlObj.pathname === '/') {
        score += 3;
      }

      // Prefer shorter URLs (simpler is better)
      score -= url.length * 0.01;

      // Prefer URLs without fragments
      if (!urlObj.hash) {
        score += 2;
      }

      return { url, score };
    });

    // Sort by score (highest first), then alphabetically for consistency
    scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.url.localeCompare(b.url);
    });

    return scores[0].url;
  }

  /**
   * Handle URL parameters - normalize URLs with parameters
   * @param {string} url - URL to normalize
   * @param {Array<string>} ignoreParams - Parameters to ignore
   * @returns {string} Normalized URL
   */
  normalizeUrlParameters(url, ignoreParams = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid']) {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);

      // Remove ignored parameters
      ignoreParams.forEach(param => {
        params.delete(param);
      });

      // Sort remaining parameters for consistency
      const sortedParams = new URLSearchParams(
        Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0]))
      );

      urlObj.search = sortedParams.toString();
      
      return urlObj.toString();
    } catch (error) {
      this.logger.error(`Error normalizing URL parameters: ${url}`, { error: error.message });
      return url;
    }
  }

  /**
   * Check protocol consistency (HTTP vs HTTPS)
   * @param {Array<string>} urls - URLs to check
   * @returns {Object} Protocol consistency analysis
   */
  checkProtocolConsistency(urls) {
    const httpUrls = [];
    const httpsUrls = [];
    const urlsByPath = new Map();

    urls.forEach(url => {
      try {
        const urlObj = new URL(url);
        const pathKey = `${urlObj.host}${urlObj.pathname}${urlObj.search}`;

        if (!urlsByPath.has(pathKey)) {
          urlsByPath.set(pathKey, []);
        }
        urlsByPath.get(pathKey).push(url);

        if (urlObj.protocol === 'http:') {
          httpUrls.push(url);
        } else if (urlObj.protocol === 'https:') {
          httpsUrls.push(url);
        }
      } catch (error) {
        this.logger.error(`Invalid URL in protocol check: ${url}`, { error: error.message });
      }
    });

    // Find URLs that exist in both HTTP and HTTPS
    const duplicateProtocols = [];
    urlsByPath.forEach((urlList, pathKey) => {
      if (urlList.length > 1) {
        const protocols = urlList.map(u => new URL(u).protocol);
        if (protocols.includes('http:') && protocols.includes('https:')) {
          duplicateProtocols.push({
            path: pathKey,
            urls: urlList,
            preferredUrl: urlList.find(u => u.startsWith('https://'))
          });
        }
      }
    });

    return {
      totalUrls: urls.length,
      httpCount: httpUrls.length,
      httpsCount: httpsUrls.length,
      duplicateProtocols,
      hasProtocolIssues: duplicateProtocols.length > 0,
      recommendation: duplicateProtocols.length > 0 
        ? 'Add canonical tags to HTTP versions pointing to HTTPS versions'
        : 'No protocol consistency issues found'
    };
  }

  /**
   * Normalize trailing slashes
   * @param {Array<string>} urls - URLs to check
   * @returns {Object} Trailing slash analysis
   */
  normalizeTrailingSlashes(urls) {
    const urlsByPath = new Map();
    const trailingSlashIssues = [];

    urls.forEach(url => {
      try {
        const urlObj = new URL(url);
        const pathWithoutSlash = urlObj.pathname.endsWith('/') && urlObj.pathname.length > 1
          ? urlObj.pathname.slice(0, -1)
          : urlObj.pathname;
        
        const pathKey = `${urlObj.protocol}//${urlObj.host}${pathWithoutSlash}${urlObj.search}`;

        if (!urlsByPath.has(pathKey)) {
          urlsByPath.set(pathKey, []);
        }
        urlsByPath.get(pathKey).push(url);
      } catch (error) {
        this.logger.error(`Invalid URL in trailing slash check: ${url}`, { error: error.message });
      }
    });

    // Find URLs that differ only by trailing slash
    urlsByPath.forEach((urlList, pathKey) => {
      if (urlList.length > 1) {
        // Prefer URL without trailing slash (unless it's the root path)
        const preferredUrl = urlList.find(u => {
          const urlObj = new URL(u);
          return urlObj.pathname === '/' || !urlObj.pathname.endsWith('/');
        }) || urlList[0];

        trailingSlashIssues.push({
          urls: urlList,
          preferredUrl,
          issue: 'trailing-slash-variation'
        });
      }
    });

    return {
      totalUrls: urls.length,
      trailingSlashIssues,
      hasIssues: trailingSlashIssues.length > 0,
      recommendation: trailingSlashIssues.length > 0
        ? 'Add canonical tags to ensure consistent trailing slash handling'
        : 'No trailing slash issues found'
    };
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
   * Find duplicate pages for a URL
   * @param {string} url - URL to check
   * @param {Array<string>} allUrls - All URLs to compare against
   * @param {number} threshold - Similarity threshold
   * @returns {Promise<Object|null>} Duplicate issue or null
   */
  async findDuplicates(url, allUrls, threshold = null) {
    try {
      const duplicates = await this.detectDuplicateContent(url, allUrls, threshold);

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

      // Select primary version
      const allDuplicateUrls = [url, ...duplicates.map(d => d.url)];
      const primaryUrl = this.selectPrimaryVersion(allDuplicateUrls);

      return {
        url,
        duplicateOf: primaryUrl !== url ? primaryUrl : null,
        duplicates: duplicates.map(d => d.url),
        similarityScore: duplicates.length > 0 ? Math.max(...duplicates.map(d => d.similarity)) : 0,
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
   * Comprehensive duplicate detection across all URLs
   * @param {Array<string>} urls - All URLs to analyze
   * @param {number} threshold - Similarity threshold
   * @returns {Promise<Object>} Comprehensive duplicate analysis
   */
  async analyzeDuplicates(urls, threshold = null) {
    this.logger.info(`Analyzing duplicates for ${urls.length} URLs`);

    try {
      // Check protocol consistency
      const protocolAnalysis = this.checkProtocolConsistency(urls);

      // Check trailing slash consistency
      const trailingSlashAnalysis = this.normalizeTrailingSlashes(urls);

      // Detect content-based duplicates
      const duplicateIssues = [];
      const processedUrls = new Set();

      for (const url of urls) {
        if (processedUrls.has(normalizeUrl(url))) {
          continue;
        }

        const duplicateInfo = await this.findDuplicates(url, urls, threshold);
        
        if (duplicateInfo) {
          duplicateIssues.push(duplicateInfo);
          
          // Mark all duplicates as processed
          processedUrls.add(normalizeUrl(url));
          duplicateInfo.duplicates.forEach(dupUrl => {
            processedUrls.add(normalizeUrl(dupUrl));
          });
        }

        // Small delay to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      this.logger.info(`Duplicate analysis complete. Found ${duplicateIssues.length} duplicate groups`);

      return {
        totalUrls: urls.length,
        duplicateGroups: duplicateIssues.length,
        protocolAnalysis,
        trailingSlashAnalysis,
        duplicateIssues,
        summary: {
          contentDuplicates: duplicateIssues.length,
          protocolIssues: protocolAnalysis.duplicateProtocols.length,
          trailingSlashIssues: trailingSlashAnalysis.trailingSlashIssues.length,
          totalIssues: duplicateIssues.length + 
                      protocolAnalysis.duplicateProtocols.length + 
                      trailingSlashAnalysis.trailingSlashIssues.length
        }
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, 'analyzeDuplicates');
      if (recovery.action === 'skip') {
        return {
          totalUrls: urls.length,
          duplicateGroups: 0,
          duplicateIssues: [],
          error: error.message
        };
      }
      throw error;
    }
  }

  /**
   * Batch check duplicates for multiple URLs
   * @param {Array<string>} urls - URLs to check
   * @param {number} threshold - Similarity threshold
   * @returns {Promise<Array<Object>>} Array of duplicate issues
   */
  async checkDuplicates(urls, threshold = null) {
    this.logger.info(`Checking duplicates for ${urls.length} URLs`);

    const issues = [];
    const processedUrls = new Set();

    for (const url of urls) {
      if (processedUrls.has(normalizeUrl(url))) {
        continue;
      }

      const duplicateInfo = await this.findDuplicates(url, urls, threshold);
      
      if (duplicateInfo) {
        issues.push(duplicateInfo);
        
        // Mark all duplicates as processed
        processedUrls.add(normalizeUrl(url));
        duplicateInfo.duplicates.forEach(dupUrl => {
          processedUrls.add(normalizeUrl(dupUrl));
        });
      }

      // Small delay between checks
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.logger.info(`Duplicate check complete. Found ${issues.length} duplicate groups`);
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

export default DuplicateDetector;
