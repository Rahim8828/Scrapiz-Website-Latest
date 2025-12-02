import axios from 'axios';
import { normalizeUrl, isValidUrl, isPermanentRedirect, isTemporaryRedirect } from './utils.js';

/**
 * Redirect Detector Module
 * Detects redirect chains and redirect type issues
 */
class RedirectDetector {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.httpClient = axios.create({
      timeout: 10000,
      maxRedirects: 0, // Don't follow redirects automatically
      validateStatus: () => true // Accept all status codes
    });
  }

  /**
   * Follow redirect chain and collect all hops
   * @param {string} url - Starting URL
   * @param {number} maxHops - Maximum number of redirects to follow
   * @returns {Promise<Object>} Redirect chain information
   */
  async followRedirectChain(url, maxHops = 10) {
    if (!isValidUrl(url)) {
      return {
        url,
        isRedirect: false,
        redirectChain: [],
        finalDestination: url,
        error: 'Invalid URL'
      };
    }

    try {
      const redirectChain = [];
      let currentUrl = url;
      let hopCount = 0;

      while (hopCount < maxHops) {
        const response = await this.httpClient.get(currentUrl);
        
        const hop = {
          url: currentUrl,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        };

        redirectChain.push(hop);

        // Check if it's a redirect status
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.location;
          
          if (!location) {
            // Redirect without location header
            this.logger.warn(`Redirect without location header: ${currentUrl}`);
            break;
          }

          // Resolve relative URLs
          currentUrl = this.resolveRedirectUrl(currentUrl, location);
          hopCount++;
        } else {
          // Not a redirect, we've reached the end
          break;
        }
      }

      const isRedirect = redirectChain.length > 1 || 
                        (redirectChain.length === 1 && redirectChain[0].status >= 300 && redirectChain[0].status < 400);
      
      return {
        url,
        isRedirect,
        redirectChain,
        finalDestination: currentUrl,
        redirectType: isRedirect ? redirectChain[0].status : null,
        chainLength: redirectChain.length,
        hasChain: redirectChain.length > 2
      };
    } catch (error) {
      this.logger.error(`Error following redirect chain for ${url}`, { error: error.message });
      return {
        url,
        isRedirect: false,
        redirectChain: [],
        finalDestination: url,
        error: error.message
      };
    }
  }

  /**
   * Resolve redirect URL (handle relative URLs)
   * @param {string} baseUrl - Base URL
   * @param {string} location - Location header value
   * @returns {string} Resolved URL
   */
  resolveRedirectUrl(baseUrl, location) {
    try {
      // Absolute URL
      if (location.startsWith('http://') || location.startsWith('https://')) {
        return location;
      }

      const baseUrlObj = new URL(baseUrl);

      // Protocol-relative URL
      if (location.startsWith('//')) {
        return `${baseUrlObj.protocol}${location}`;
      }

      // Absolute path
      if (location.startsWith('/')) {
        return `${baseUrlObj.protocol}//${baseUrlObj.host}${location}`;
      }

      // Relative path
      const basePath = baseUrlObj.pathname.substring(0, baseUrlObj.pathname.lastIndexOf('/') + 1);
      return `${baseUrlObj.protocol}//${baseUrlObj.host}${basePath}${location}`;
    } catch (error) {
      this.logger.error(`Error resolving redirect URL: ${baseUrl} -> ${location}`, { error: error.message });
      return location;
    }
  }

  /**
   * Identify redirect type (301 vs 302 vs others)
   * @param {number} statusCode - HTTP status code
   * @returns {Object} Redirect type information
   */
  identifyRedirectType(statusCode) {
    const types = {
      301: { type: 'permanent', name: '301 Moved Permanently', recommended: true },
      302: { type: 'temporary', name: '302 Found', recommended: false },
      303: { type: 'temporary', name: '303 See Other', recommended: false },
      307: { type: 'temporary', name: '307 Temporary Redirect', recommended: false },
      308: { type: 'permanent', name: '308 Permanent Redirect', recommended: true }
    };

    return types[statusCode] || { 
      type: 'unknown', 
      name: `${statusCode} Unknown`, 
      recommended: false 
    };
  }

  /**
   * Check for redirect issues on a single URL
   * @param {string} url - URL to check
   * @returns {Promise<Object|null>} Redirect issue or null
   */
  async checkRedirect(url) {
    try {
      const chainInfo = await this.followRedirectChain(url);

      // No redirect found
      if (!chainInfo.isRedirect) {
        return null;
      }

      const redirectType = chainInfo.redirectType;
      const redirectTypeInfo = this.identifyRedirectType(redirectType);
      const hasChain = chainInfo.chainLength > 2;

      // Build issue object
      const issue = {
        url,
        redirectChain: chainInfo.redirectChain.map(hop => hop.url),
        finalDestination: chainInfo.finalDestination,
        redirectType,
        redirectTypeName: redirectTypeInfo.name,
        isPermanent: redirectTypeInfo.type === 'permanent',
        isTemporary: redirectTypeInfo.type === 'temporary',
        hasChain,
        chainLength: chainInfo.chainLength,
        inSitemap: false, // Will be checked later
        internalLinksCount: 0, // Will be checked later
        recommendation: this.getRedirectRecommendation(chainInfo, redirectTypeInfo),
        fixable: true
      };

      return issue;
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `checkRedirect: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get recommendation for redirect issue
   * @param {Object} chainInfo - Redirect chain information
   * @param {Object} redirectTypeInfo - Redirect type information
   * @returns {string} Recommendation
   */
  getRedirectRecommendation(chainInfo, redirectTypeInfo) {
    const recommendations = [];

    // Check for redirect chains
    if (chainInfo.hasChain) {
      recommendations.push(
        `Flatten redirect chain (${chainInfo.chainLength} hops) to direct redirect`
      );
    }

    // Check redirect type
    if (!redirectTypeInfo.recommended) {
      recommendations.push(
        `Change from ${redirectTypeInfo.name} to 301 Permanent Redirect`
      );
    }

    // Always recommend updating sitemap and internal links
    recommendations.push(
      'Update sitemap to use final destination URL',
      'Update internal links to point directly to final destination'
    );

    return recommendations.join('. ');
  }

  /**
   * Batch check redirects for multiple URLs
   * @param {Array<string>} urls - URLs to check
   * @returns {Promise<Array<Object>>} Array of redirect issues
   */
  async checkRedirects(urls) {
    this.logger.info(`Checking redirects for ${urls.length} URLs`);

    const issues = [];
    const batchSize = 5;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => this.checkRedirect(url))
      );

      issues.push(...batchResults.filter(issue => issue !== null));

      // Small delay between batches
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.logger.info(`Redirect check complete. Found ${issues.length} issues`);
    return issues;
  }

  /**
   * Analyze redirect patterns across all URLs
   * @param {Array<Object>} redirectIssues - Array of redirect issues
   * @returns {Object} Analysis summary
   */
  analyzeRedirectPatterns(redirectIssues) {
    const analysis = {
      totalRedirects: redirectIssues.length,
      redirectChains: 0,
      temporaryRedirects: 0,
      permanentRedirects: 0,
      longestChain: 0,
      redirectsByType: {}
    };

    redirectIssues.forEach(issue => {
      // Count chains
      if (issue.hasChain) {
        analysis.redirectChains++;
      }

      // Count by permanence
      if (issue.isPermanent) {
        analysis.permanentRedirects++;
      } else if (issue.isTemporary) {
        analysis.temporaryRedirects++;
      }

      // Track longest chain
      if (issue.chainLength > analysis.longestChain) {
        analysis.longestChain = issue.chainLength;
      }

      // Count by type
      const typeName = issue.redirectTypeName;
      analysis.redirectsByType[typeName] = (analysis.redirectsByType[typeName] || 0) + 1;
    });

    return analysis;
  }
}

export default RedirectDetector;
