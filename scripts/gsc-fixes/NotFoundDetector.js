import axios from 'axios';
import * as cheerio from 'cheerio';
import { isValidUrl, normalizeUrl } from './utils.js';

/**
 * Not Found (404) Detector Module
 * Detects 404 errors and analyzes their impact
 */
class NotFoundDetector {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.httpClient = axios.create({
      timeout: 10000,
      maxRedirects: 0,
      validateStatus: () => true // Accept all status codes
    });
  }

  /**
   * Check if URL returns 404 status
   * @param {string} url - URL to check
   * @returns {Promise<Object|null>} 404 issue or null
   */
  async check404(url) {
    if (!isValidUrl(url)) {
      return null;
    }

    try {
      const response = await this.httpClient.get(url);

      // Not a 404
      if (response.status !== 404) {
        return null;
      }

      this.logger.info(`404 detected: ${url}`);

      // Check for backlinks (external links pointing to this URL)
      const hasBacklinks = await this.checkBacklinks(url);

      // Check for internal links pointing to this URL
      const internalLinks = []; // Will be populated by scanInternalLinks

      // Determine if URL has value
      const hasValue = hasBacklinks || internalLinks.length > 0;

      return {
        url,
        status: 404,
        hasBacklinks,
        internalLinks,
        internalLinksCount: internalLinks.length,
        hasValue,
        shouldExist: hasValue,
        recommendation: this.get404Recommendation(hasBacklinks, internalLinks.length),
        fixable: true
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `check404: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Check if URL has external backlinks
   * Note: This is a placeholder. In production, you would integrate with
   * backlink checking services like Ahrefs, Moz, or Google Search Console API
   * @param {string} url - URL to check
   * @returns {Promise<boolean>} True if has backlinks
   */
  async checkBacklinks(url) {
    // Placeholder implementation
    // In production, integrate with:
    // - Google Search Console API (links to your site)
    // - Ahrefs API
    // - Moz API
    // - Majestic API
    
    this.logger.info(`Checking backlinks for ${url} (placeholder)`);
    
    // For now, return false
    // TODO: Implement actual backlink checking
    return false;
  }

  /**
   * Scan website for internal links pointing to 404 URLs
   * @param {Array<string>} siteUrls - All URLs on the site
   * @param {Array<string>} notFoundUrls - URLs that return 404
   * @returns {Promise<Map>} Map of 404 URL to array of pages linking to it
   */
  async scanInternalLinks(siteUrls, notFoundUrls) {
    this.logger.info(`Scanning ${siteUrls.length} pages for links to ${notFoundUrls.length} 404 URLs`);

    const linksTo404 = new Map();
    
    // Initialize map
    notFoundUrls.forEach(url => {
      linksTo404.set(url, []);
    });

    // Process pages in batches
    const batchSize = 5;
    for (let i = 0; i < siteUrls.length; i += batchSize) {
      const batch = siteUrls.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (pageUrl) => {
          try {
            const links = await this.extractLinksFromPage(pageUrl);
            
            // Check if any links point to 404 URLs
            links.forEach(link => {
              const normalizedLink = normalizeUrl(link);
              
              notFoundUrls.forEach(notFoundUrl => {
                const normalizedNotFound = normalizeUrl(notFoundUrl);
                
                if (normalizedLink === normalizedNotFound) {
                  linksTo404.get(notFoundUrl).push({
                    sourceUrl: pageUrl,
                    linkText: link.text || '',
                    linkHref: link.href
                  });
                }
              });
            });
          } catch (error) {
            this.logger.error(`Failed to scan links on ${pageUrl}`, { error: error.message });
          }
        })
      );

      // Small delay between batches
      if (i + batchSize < siteUrls.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Log results
    let totalLinks = 0;
    linksTo404.forEach((links, url) => {
      if (links.length > 0) {
        this.logger.info(`Found ${links.length} internal links to 404: ${url}`);
        totalLinks += links.length;
      }
    });

    this.logger.info(`Internal link scan complete. Found ${totalLinks} total links to 404 pages`);

    return linksTo404;
  }

  /**
   * Extract all links from a page
   * @param {string} url - Page URL
   * @returns {Promise<Array>} Array of link objects
   */
  async extractLinksFromPage(url) {
    try {
      const response = await this.httpClient.get(url, {
        maxRedirects: 5
      });

      if (response.status !== 200 || !response.data) {
        return [];
      }

      const $ = cheerio.load(response.data);
      const links = [];

      $('a[href]').each((_, elem) => {
        const href = $(elem).attr('href');
        const text = $(elem).text().trim();

        if (!href) {
          return;
        }

        // Resolve relative URLs
        let absoluteUrl;
        try {
          if (href.startsWith('http://') || href.startsWith('https://')) {
            absoluteUrl = href;
          } else if (href.startsWith('/')) {
            const urlObj = new URL(url);
            absoluteUrl = `${urlObj.protocol}//${urlObj.host}${href}`;
          } else if (href.startsWith('#')) {
            // Skip anchor links
            return;
          } else {
            // Relative path
            const urlObj = new URL(url);
            const basePath = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
            absoluteUrl = `${urlObj.protocol}//${urlObj.host}${basePath}${href}`;
          }

          links.push({
            href: absoluteUrl,
            text,
            sourceUrl: url
          });
        } catch (error) {
          // Invalid URL, skip
        }
      });

      return links;
    } catch (error) {
      this.logger.error(`Failed to extract links from ${url}`, { error: error.message });
      return [];
    }
  }

  /**
   * Get recommendation for 404 issue
   * @param {boolean} hasBacklinks - Whether URL has backlinks
   * @param {number} internalLinksCount - Number of internal links
   * @returns {string} Recommendation
   */
  get404Recommendation(hasBacklinks, internalLinksCount) {
    if (hasBacklinks || internalLinksCount > 0) {
      return `Implement 301 redirect to relevant page (has ${hasBacklinks ? 'backlinks' : ''} ${hasBacklinks && internalLinksCount > 0 ? 'and' : ''} ${internalLinksCount > 0 ? `${internalLinksCount} internal links` : ''})`;
    }

    return 'Return proper 404 status and remove from sitemap';
  }

  /**
   * Batch check 404s for multiple URLs
   * @param {Array<string>} urls - URLs to check
   * @returns {Promise<Array<Object>>} Array of 404 issues
   */
  async check404s(urls) {
    this.logger.info(`Checking 404 status for ${urls.length} URLs`);

    const issues = [];
    const batchSize = 10;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => this.check404(url))
      );

      issues.push(...batchResults.filter(issue => issue !== null));

      // Small delay between batches
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.logger.info(`404 check complete. Found ${issues.length} 404 errors`);
    return issues;
  }

  /**
   * Detect 404 issues with full analysis
   * @param {Array<string>} urlsToCheck - URLs to check for 404
   * @param {Array<string>} siteUrls - All site URLs (for internal link scanning)
   * @returns {Promise<Array<Object>>} Array of 404 issues with full analysis
   */
  async detect404Issues(urlsToCheck, siteUrls = []) {
    // First, check which URLs return 404
    const notFoundIssues = await this.check404s(urlsToCheck);

    if (notFoundIssues.length === 0) {
      this.logger.info('No 404 errors found');
      return [];
    }

    // Extract 404 URLs
    const notFoundUrls = notFoundIssues.map(issue => issue.url);

    // Scan for internal links if site URLs provided
    if (siteUrls.length > 0) {
      const internalLinksMap = await this.scanInternalLinks(siteUrls, notFoundUrls);

      // Update issues with internal link information
      notFoundIssues.forEach(issue => {
        const internalLinks = internalLinksMap.get(issue.url) || [];
        issue.internalLinks = internalLinks;
        issue.internalLinksCount = internalLinks.length;
        issue.hasValue = issue.hasBacklinks || internalLinks.length > 0;
        issue.shouldExist = issue.hasValue;
        issue.recommendation = this.get404Recommendation(issue.hasBacklinks, internalLinks.length);
      });
    }

    return notFoundIssues;
  }

  /**
   * Analyze 404 patterns
   * @param {Array<Object>} notFoundIssues - Array of 404 issues
   * @returns {Object} Analysis summary
   */
  analyze404Patterns(notFoundIssues) {
    const analysis = {
      total404s: notFoundIssues.length,
      with404Backlinks: 0,
      withInternalLinks: 0,
      valueless: 0,
      shouldRedirect: 0,
      canDelete: 0,
      totalInternalLinks: 0
    };

    notFoundIssues.forEach(issue => {
      if (issue.hasBacklinks) {
        analysis.with404Backlinks++;
      }

      if (issue.internalLinksCount > 0) {
        analysis.withInternalLinks++;
        analysis.totalInternalLinks += issue.internalLinksCount;
      }

      if (issue.hasValue) {
        analysis.shouldRedirect++;
      } else {
        analysis.valueless++;
        analysis.canDelete++;
      }
    });

    return analysis;
  }

  /**
   * Find best redirect target for 404 URL
   * @param {string} notFoundUrl - 404 URL
   * @param {Array<string>} siteUrls - All site URLs
   * @returns {Promise<string|null>} Best redirect target or null
   */
  async findBestRedirectTarget(notFoundUrl, siteUrls) {
    // Extract path segments from 404 URL
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
            candidates.push({
              url: siteUrl,
              score: matchingSegments / Math.max(notFoundSegments.length, siteSegments.length)
            });
          }
        } catch (error) {
          // Invalid URL, skip
        }
      }

      // Sort by score and return best match
      if (candidates.length > 0) {
        candidates.sort((a, b) => b.score - a.score);
        return candidates[0].url;
      }

      return null;
    } catch (error) {
      this.logger.error(`Failed to find redirect target for ${notFoundUrl}`, { error: error.message });
      return null;
    }
  }
}

export default NotFoundDetector;
