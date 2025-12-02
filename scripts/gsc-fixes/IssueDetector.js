import axios from 'axios';
import * as cheerio from 'cheerio';
import { countWords, extractTextFromHtml, isValidUrl, normalizeUrl } from './utils.js';

/**
 * Issue Detector Module
 * Scans pages and identifies indexing issues
 */
class IssueDetector {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.httpClient = axios.create({
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true // Accept all status codes
    });
  }

  /**
   * Analyze page content for quality signals
   * @param {string} html - HTML content
   * @returns {Object} Content analysis result
   */
  analyzePageContent(html) {
    if (!html) {
      return {
        wordCount: 0,
        hasHeadings: false,
        headings: { h1: 0, h2: 0, h3: 0 },
        internalLinks: 0,
        hasBodyContent: false,
        textContent: ''
      };
    }

    const $ = cheerio.load(html);
    
    // Remove script and style tags
    $('script, style, noscript').remove();
    
    // Extract text content
    const textContent = extractTextFromHtml(html);
    const wordCount = countWords(textContent);
    
    // Count headings
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;
    const h3Count = $('h3').length;
    const hasHeadings = h1Count > 0 || h2Count > 0 || h3Count > 0;
    
    // Count internal links (relative or same domain)
    let internalLinks = 0;
    $('a[href]').each((_, elem) => {
      const href = $(elem).attr('href');
      if (href && (href.startsWith('/') || href.startsWith('#') || !href.startsWith('http'))) {
        internalLinks++;
      }
    });
    
    // Check if there's substantial body content
    const bodyText = $('body').text().trim();
    const hasBodyContent = bodyText.length > 100;
    
    return {
      wordCount,
      hasHeadings,
      headings: {
        h1: h1Count,
        h2: h2Count,
        h3: h3Count
      },
      internalLinks,
      hasBodyContent,
      textContent
    };
  }

  /**
   * Check HTTP status with redirect following
   * @param {string} url - URL to check
   * @returns {Promise<Object>} Status check result
   */
  async checkHttpStatus(url) {
    if (!isValidUrl(url)) {
      return {
        url,
        status: null,
        error: 'Invalid URL',
        redirectChain: [],
        finalUrl: url
      };
    }

    try {
      const redirectChain = [];
      let currentUrl = url;
      let response;
      let redirectCount = 0;
      const maxRedirects = 10;

      // Manually follow redirects to track the chain
      while (redirectCount < maxRedirects) {
        response = await this.httpClient.get(currentUrl, {
          maxRedirects: 0,
          validateStatus: () => true
        });

        redirectChain.push({
          url: currentUrl,
          status: response.status,
          statusText: response.statusText
        });

        // Check if it's a redirect
        if (response.status >= 300 && response.status < 400) {
          const location = response.headers.location;
          if (!location) {
            break;
          }

          // Handle relative redirects
          if (location.startsWith('/')) {
            const urlObj = new URL(currentUrl);
            currentUrl = `${urlObj.protocol}//${urlObj.host}${location}`;
          } else if (location.startsWith('http')) {
            currentUrl = location;
          } else {
            // Relative to current path
            const urlObj = new URL(currentUrl);
            const basePath = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
            currentUrl = `${urlObj.protocol}//${urlObj.host}${basePath}${location}`;
          }

          redirectCount++;
        } else {
          // Not a redirect, we're done
          break;
        }
      }

      return {
        url,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        redirectChain: redirectChain.length > 1 ? redirectChain : [],
        finalUrl: currentUrl,
        isRedirect: redirectChain.length > 1,
        redirectType: redirectChain.length > 1 ? redirectChain[0].status : null
      };
    } catch (error) {
      this.logger.error(`HTTP status check failed for ${url}`, { error: error.message });
      return {
        url,
        status: null,
        error: error.message,
        redirectChain: [],
        finalUrl: url
      };
    }
  }

  /**
   * Parse HTML for meta tags and canonical detection
   * @param {string} html - HTML content
   * @param {string} url - Page URL
   * @returns {Object} Parsed meta information
   */
  parseHtmlMetadata(html, url) {
    if (!html) {
      return {
        canonical: null,
        metaRobots: null,
        noindex: false,
        nofollow: false,
        title: null,
        description: null,
        ogTags: {}
      };
    }

    const $ = cheerio.load(html);
    
    // Extract canonical tag
    const canonicalTag = $('link[rel="canonical"]').attr('href');
    let canonical = canonicalTag || null;
    
    // Normalize canonical URL
    if (canonical) {
      if (canonical.startsWith('/')) {
        const urlObj = new URL(url);
        canonical = `${urlObj.protocol}//${urlObj.host}${canonical}`;
      } else if (!canonical.startsWith('http')) {
        const urlObj = new URL(url);
        const basePath = urlObj.pathname.substring(0, urlObj.pathname.lastIndexOf('/') + 1);
        canonical = `${urlObj.protocol}//${urlObj.host}${basePath}${canonical}`;
      }
      canonical = normalizeUrl(canonical);
    }
    
    // Extract meta robots tag
    const metaRobots = $('meta[name="robots"]').attr('content') || null;
    
    // Check for noindex and nofollow
    const noindex = metaRobots ? metaRobots.toLowerCase().includes('noindex') : false;
    const nofollow = metaRobots ? metaRobots.toLowerCase().includes('nofollow') : false;
    
    // Extract title and description
    const title = $('title').text() || null;
    const description = $('meta[name="description"]').attr('content') || null;
    
    // Extract Open Graph tags
    const ogTags = {};
    $('meta[property^="og:"]').each((_, elem) => {
      const property = $(elem).attr('property');
      const content = $(elem).attr('content');
      if (property && content) {
        ogTags[property] = content;
      }
    });
    
    return {
      canonical,
      metaRobots,
      noindex,
      nofollow,
      title,
      description,
      ogTags
    };
  }

  /**
   * Fetch page content
   * @param {string} url - URL to fetch
   * @returns {Promise<Object>} Page content and metadata
   */
  async fetchPage(url) {
    try {
      const response = await this.httpClient.get(url);
      
      return {
        url,
        status: response.status,
        headers: response.headers,
        html: response.data,
        success: true
      };
    } catch (error) {
      this.logger.error(`Failed to fetch page: ${url}`, { error: error.message });
      return {
        url,
        status: null,
        headers: {},
        html: null,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check for X-Robots-Tag in HTTP headers
   * @param {Object} headers - HTTP response headers
   * @returns {Object} Robots header information
   */
  checkRobotsHeaders(headers) {
    const xRobotsTag = headers['x-robots-tag'] || null;
    
    if (!xRobotsTag) {
      return {
        hasXRobotsTag: false,
        noindex: false,
        nofollow: false,
        value: null
      };
    }
    
    const value = xRobotsTag.toLowerCase();
    
    return {
      hasXRobotsTag: true,
      noindex: value.includes('noindex'),
      nofollow: value.includes('nofollow'),
      value: xRobotsTag
    };
  }

  /**
   * Detect soft 404 issues
   * @param {string} url - URL to check
   * @returns {Promise<Object|null>} Soft 404 issue or null
   */
  async checkSoft404(url) {
    try {
      const statusResult = await this.checkHttpStatus(url);
      
      // If it returns proper 404, it's not a soft 404
      if (statusResult.status === 404) {
        return null;
      }
      
      // If it's not 200, skip soft 404 check
      if (statusResult.status !== 200) {
        return null;
      }
      
      // Fetch and analyze content
      const pageResult = await this.fetchPage(url);
      if (!pageResult.success || !pageResult.html) {
        return null;
      }
      
      const contentAnalysis = this.analyzePageContent(pageResult.html);
      
      // Determine if it's a soft 404
      let isSoft404 = false;
      let reason = null;
      
      if (contentAnalysis.wordCount < 300) {
        isSoft404 = true;
        reason = 'thin-content';
      } else if (!contentAnalysis.hasBodyContent) {
        isSoft404 = true;
        reason = 'empty-page';
      } else if (!contentAnalysis.hasHeadings && contentAnalysis.internalLinks === 0) {
        isSoft404 = true;
        reason = 'low-quality';
      }
      
      if (!isSoft404) {
        return null;
      }
      
      return {
        url,
        reason,
        contentLength: pageResult.html.length,
        wordCount: contentAnalysis.wordCount,
        hasHeadings: contentAnalysis.hasHeadings,
        hasInternalLinks: contentAnalysis.internalLinks > 0,
        recommendation: this.getSoft404Recommendation(reason, contentAnalysis),
        fixable: true
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `checkSoft404: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get recommendation for soft 404 issue
   * @param {string} reason - Reason for soft 404
   * @param {Object} contentAnalysis - Content analysis result
   * @returns {string} Recommendation
   */
  getSoft404Recommendation(reason, contentAnalysis) {
    switch (reason) {
      case 'thin-content':
        return `Enhance content to at least 500 words (currently ${contentAnalysis.wordCount} words)`;
      case 'empty-page':
        return 'Add substantial body content or return proper 404 status';
      case 'low-quality':
        return 'Add proper heading structure and internal links';
      default:
        return 'Review page content and structure';
    }
  }

  /**
   * Check canonical tags
   * Note: This method is deprecated. Use CanonicalDetector.checkCanonical() instead.
   * @param {string} url - URL to check
   * @returns {Promise<Object|null>} Canonical issue or null
   */
  async checkCanonicalTags(url) {
    try {
      const pageResult = await this.fetchPage(url);
      if (!pageResult.success || !pageResult.html) {
        return null;
      }
      
      const metadata = this.parseHtmlMetadata(pageResult.html, url);
      const normalizedUrl = normalizeUrl(url);
      
      // Check if canonical is missing
      if (!metadata.canonical) {
        return {
          url,
          currentCanonical: null,
          expectedCanonical: normalizedUrl,
          issueType: 'missing',
          inSitemap: false, // Will be checked later
          recommendation: 'Add self-referencing canonical tag',
          fixable: true
        };
      }
      
      // Check if canonical points to self (self-referencing)
      const normalizedCanonical = normalizeUrl(metadata.canonical);
      if (normalizedCanonical === normalizedUrl) {
        // This is correct, no issue
        return null;
      }
      
      // Canonical points to different URL
      // Verify the canonical target is valid
      const canonicalStatus = await this.checkHttpStatus(metadata.canonical);
      
      if (canonicalStatus.status !== 200) {
        return {
          url,
          currentCanonical: metadata.canonical,
          expectedCanonical: normalizedUrl,
          issueType: 'invalid-target',
          inSitemap: false,
          recommendation: `Canonical target returns ${canonicalStatus.status}. Update to valid URL or make self-referencing`,
          fixable: true
        };
      }
      
      // Check if canonical target has noindex
      const canonicalPage = await this.fetchPage(metadata.canonical);
      if (canonicalPage.success && canonicalPage.html) {
        const canonicalMetadata = this.parseHtmlMetadata(canonicalPage.html, metadata.canonical);
        const robotsHeaders = this.checkRobotsHeaders(canonicalPage.headers);
        
        if (canonicalMetadata.noindex || robotsHeaders.noindex) {
          return {
            url,
            currentCanonical: metadata.canonical,
            expectedCanonical: normalizedUrl,
            issueType: 'noindex-target',
            inSitemap: false,
            recommendation: 'Canonical target has noindex. Choose different canonical or remove noindex from target',
            fixable: true
          };
        }
      }
      
      // Canonical is valid but points to different URL (might be intentional for duplicates)
      return {
        url,
        currentCanonical: metadata.canonical,
        expectedCanonical: metadata.canonical,
        issueType: 'alternative-page',
        inSitemap: false,
        recommendation: 'Page has canonical pointing to different URL. Verify this is intentional for duplicate content',
        fixable: false
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `checkCanonicalTags: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Check for redirect issues
   * @param {string} url - URL to check
   * @returns {Promise<Object|null>} Redirect issue or null
   */
  async checkRedirects(url) {
    try {
      const statusResult = await this.checkHttpStatus(url);
      
      // No redirect
      if (!statusResult.isRedirect) {
        return null;
      }
      
      const redirectChain = statusResult.redirectChain.map(r => r.url);
      const finalDestination = statusResult.finalUrl;
      const redirectType = statusResult.redirectType;
      
      return {
        url,
        redirectChain,
        finalDestination,
        redirectType,
        inSitemap: false, // Will be checked later
        internalLinksCount: 0, // Will be checked later
        recommendation: this.getRedirectRecommendation(redirectChain, redirectType),
        fixable: true
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `checkRedirects: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get recommendation for redirect issue
   * @param {Array<string>} redirectChain - Redirect chain
   * @param {number} redirectType - Redirect status code
   * @returns {string} Recommendation
   */
  getRedirectRecommendation(redirectChain, redirectType) {
    const recommendations = [];
    
    if (redirectChain.length > 2) {
      recommendations.push(`Flatten redirect chain (${redirectChain.length} redirects)`);
    }
    
    if (redirectType === 302 || redirectType === 307) {
      recommendations.push('Change to 301 permanent redirect');
    }
    
    recommendations.push('Update sitemap and internal links to point to final destination');
    
    return recommendations.join('. ');
  }

  /**
   * Check for noindex tags
   * @param {string} url - URL to check
   * @returns {Promise<Object|null>} Noindex issue or null
   */
  async checkNoindexTags(url) {
    try {
      const pageResult = await this.fetchPage(url);
      if (!pageResult.success) {
        return null;
      }
      
      const metadata = this.parseHtmlMetadata(pageResult.html, url);
      const robotsHeaders = this.checkRobotsHeaders(pageResult.headers);
      
      // Check for noindex in meta tag or HTTP header
      const hasNoindex = metadata.noindex || robotsHeaders.noindex;
      
      if (!hasNoindex) {
        return null;
      }
      
      // Determine source of noindex
      let noindexSource = [];
      if (metadata.noindex) {
        noindexSource.push('meta-tag');
      }
      if (robotsHeaders.noindex) {
        noindexSource.push('http-header');
      }
      
      // Analyze if page should be indexed
      const contentAnalysis = this.analyzePageContent(pageResult.html);
      const shouldBeIndexed = contentAnalysis.wordCount >= 500 && contentAnalysis.hasHeadings;
      
      return {
        url,
        noindexSource: noindexSource.join(', '),
        shouldBeIndexed,
        inSitemap: false, // Will be checked later
        hasBacklinks: false, // Will be checked later
        recommendation: shouldBeIndexed 
          ? 'Remove noindex tag - page has valuable content'
          : 'Keep noindex or improve content quality',
        fixable: shouldBeIndexed
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `checkNoindexTags: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Check for duplicate content (basic implementation)
   * @param {string} url - URL to check
   * @param {Array<Object>} allPages - All pages to compare against
   * @returns {Promise<Object|null>} Duplicate issue or null
   */
  async checkDuplicateContent(url, allPages = []) {
    try {
      const pageResult = await this.fetchPage(url);
      if (!pageResult.success || !pageResult.html) {
        return null;
      }
      
      const contentAnalysis = this.analyzePageContent(pageResult.html);
      const metadata = this.parseHtmlMetadata(pageResult.html, url);
      
      // If page already has canonical pointing elsewhere, it's handled
      const normalizedUrl = normalizeUrl(url);
      if (metadata.canonical && normalizeUrl(metadata.canonical) !== normalizedUrl) {
        return null;
      }
      
      // For now, return null as full duplicate detection requires comparing with all pages
      // This will be implemented in the DuplicateDetector class
      return null;
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `checkDuplicateContent: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Detect all issues for a single URL
   * @param {string} url - URL to check
   * @returns {Promise<Object>} All detected issues
   */
  async detectIssuesForUrl(url) {
    this.logger.info(`Detecting issues for: ${url}`);
    
    const issues = {
      url,
      soft404: null,
      canonical: null,
      redirect: null,
      noindex: null,
      duplicate: null
    };
    
    try {
      // Run all checks
      issues.soft404 = await this.checkSoft404(url);
      issues.canonical = await this.checkCanonicalTags(url);
      issues.redirect = await this.checkRedirects(url);
      issues.noindex = await this.checkNoindexTags(url);
      issues.duplicate = await this.checkDuplicateContent(url);
      
      // Log detected issues
      Object.entries(issues).forEach(([type, issue]) => {
        if (issue && type !== 'url') {
          this.logger.logIssue(type, url, issue);
        }
      });
    } catch (error) {
      this.logger.error(`Failed to detect issues for ${url}`, { error: error.message });
    }
    
    return issues;
  }

  /**
   * Detect all issues for multiple URLs
   * @param {Array<string>} urls - URLs to check
   * @returns {Promise<Array<Object>>} All detected issues
   */
  async detectAllIssues(urls) {
    this.logger.info(`Starting issue detection for ${urls.length} URLs`);
    
    const results = [];
    
    // Process in batches to avoid overwhelming the system
    const batchSize = 5;
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => this.detectIssuesForUrl(url))
      );
      results.push(...batchResults);
      
      // Small delay between batches
      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    this.logger.info(`Issue detection complete. Processed ${results.length} URLs`);
    
    return results;
  }
}

export default IssueDetector;
