import axios from 'axios';
import * as cheerio from 'cheerio';
import { normalizeUrl, isValidUrl, extractTextFromHtml, countWords, calculateSimilarity } from './utils.js';

/**
 * Crawl Analyzer Module
 * Analyzes crawled and discovered pages for quality issues
 */
class CrawlAnalyzer {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.httpClient = axios.create({
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: () => true
    });
    this.pageCache = new Map();
    this.similarityThreshold = 0.8;
  }

  /**
   * Fetch and cache page content
   * @param {string} url - URL to fetch
   * @returns {Promise<Object>} Page data
   */
  async fetchPage(url) {
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
        textContent: '',
        isThinContent: true,
        isLowQuality: true
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
    
    // Count internal links
    let internalLinks = 0;
    $('a[href]').each((_, elem) => {
      const href = $(elem).attr('href');
      if (href && (href.startsWith('/') || href.startsWith('#') || !href.startsWith('http'))) {
        internalLinks++;
      }
    });
    
    // Check body content
    const bodyText = $('body').text().trim();
    const hasBodyContent = bodyText.length > 100;
    
    // Quality signals
    const isThinContent = wordCount < 500;
    const isLowQuality = !hasHeadings || internalLinks === 0;
    
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
      textContent,
      isThinContent,
      isLowQuality
    };
  }

  /**
   * Detect quality signals for crawled page
   * @param {string} url - URL to analyze
   * @returns {Promise<Object>} Quality analysis result
   */
  async detectQualitySignals(url) {
    try {
      const pageData = await this.fetchPage(url);
      
      if (!pageData.success) {
        return {
          url,
          hasThinContent: false,
          hasNoHeadings: false,
          hasLowLinks: false,
          wordCount: 0,
          headingCount: 0,
          linkCount: 0,
          qualityScore: 0,
          issues: ['page-fetch-failed'],
          recommendation: 'Unable to fetch page for analysis'
        };
      }

      const contentAnalysis = this.analyzePageContent(pageData.html);
      
      const hasThinContent = contentAnalysis.wordCount < 500;
      const hasNoHeadings = !contentAnalysis.hasHeadings;
      const hasLowLinks = contentAnalysis.internalLinks < 3;
      
      // Calculate quality score (0-100)
      let qualityScore = 100;
      if (hasThinContent) qualityScore -= 40;
      if (hasNoHeadings) qualityScore -= 30;
      if (hasLowLinks) qualityScore -= 30;
      
      const issues = [];
      if (hasThinContent) issues.push('thin-content');
      if (hasNoHeadings) issues.push('no-headings');
      if (hasLowLinks) issues.push('low-links');
      
      return {
        url,
        hasThinContent,
        hasNoHeadings,
        hasLowLinks,
        wordCount: contentAnalysis.wordCount,
        headingCount: contentAnalysis.headings.h1 + contentAnalysis.headings.h2 + contentAnalysis.headings.h3,
        linkCount: contentAnalysis.internalLinks,
        qualityScore,
        issues,
        recommendation: this.generateQualityRecommendation(issues, contentAnalysis)
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `detectQualitySignals: ${url}`);
      if (recovery.action === 'skip') {
        return {
          url,
          hasThinContent: false,
          hasNoHeadings: false,
          hasLowLinks: false,
          wordCount: 0,
          headingCount: 0,
          linkCount: 0,
          qualityScore: 0,
          issues: ['error'],
          recommendation: 'Error analyzing page'
        };
      }
      throw error;
    }
  }

  /**
   * Generate quality recommendation based on issues
   * @param {Array<string>} issues - Detected issues
   * @param {Object} contentAnalysis - Content analysis result
   * @returns {string} Recommendation
   */
  generateQualityRecommendation(issues, contentAnalysis) {
    const recommendations = [];
    
    if (issues.includes('thin-content')) {
      const wordsNeeded = 500 - contentAnalysis.wordCount;
      recommendations.push(`Add ${wordsNeeded} more words of unique content`);
    }
    
    if (issues.includes('no-headings')) {
      recommendations.push('Add proper heading structure (H1, H2, H3)');
    }
    
    if (issues.includes('low-links')) {
      const linksNeeded = 3 - contentAnalysis.internalLinks;
      recommendations.push(`Add ${linksNeeded} more internal links to related pages`);
    }
    
    if (recommendations.length === 0) {
      return 'Page quality is acceptable';
    }
    
    return recommendations.join('. ');
  }

  /**
   * Detect duplicate content for crawled page
   * @param {string} url - URL to check
   * @param {Array<string>} compareUrls - URLs to compare against
   * @returns {Promise<Object|null>} Duplicate detection result
   */
  async detectDuplicateForCrawledPage(url, compareUrls) {
    try {
      const targetPage = await this.fetchPage(url);
      
      if (!targetPage.success || !targetPage.text) {
        return null;
      }

      const duplicates = [];

      for (const compareUrl of compareUrls) {
        if (normalizeUrl(url) === normalizeUrl(compareUrl)) {
          continue;
        }

        const comparePage = await this.fetchPage(compareUrl);
        
        if (!comparePage.success || !comparePage.text) {
          continue;
        }

        const similarity = calculateSimilarity(targetPage.text, comparePage.text);

        if (similarity >= this.similarityThreshold) {
          duplicates.push({
            url: compareUrl,
            similarity
          });
        }
      }

      if (duplicates.length === 0) {
        return null;
      }

      // Select primary version
      const allUrls = [url, ...duplicates.map(d => d.url)];
      const primaryUrl = this.selectPrimaryVersion(allUrls);

      return {
        url,
        isDuplicate: true,
        duplicateOf: primaryUrl !== url ? primaryUrl : null,
        duplicates: duplicates.map(d => d.url),
        maxSimilarity: Math.max(...duplicates.map(d => d.similarity)),
        recommendation: primaryUrl !== url
          ? `Add canonical tag pointing to ${primaryUrl} or implement 301 redirect`
          : 'This is the primary version. Ensure duplicates have canonical tags pointing here'
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `detectDuplicateForCrawledPage: ${url}`);
      if (recovery.action === 'skip') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Select primary version from duplicate URLs
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

    const scores = urls.map(url => {
      let score = 0;
      const urlObj = new URL(url);

      // Prefer HTTPS
      if (urlObj.protocol === 'https:') {
        score += 10;
      }

      // Prefer URLs without parameters
      if (!urlObj.search) {
        score += 5;
      }

      // Prefer normalized URLs
      if (!urlObj.pathname.endsWith('/') || urlObj.pathname === '/') {
        score += 3;
      }

      // Prefer shorter URLs
      score -= url.length * 0.01;

      // Prefer URLs without fragments
      if (!urlObj.hash) {
        score += 2;
      }

      return { url, score };
    });

    scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.url.localeCompare(b.url);
    });

    return scores[0].url;
  }

  /**
   * Analyze crawled but not indexed page
   * @param {string} url - URL to analyze
   * @param {Array<string>} allUrls - All URLs for duplicate comparison
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeCrawledPage(url, allUrls = []) {
    this.logger.info(`Analyzing crawled page: ${url}`);

    try {
      // Detect quality signals
      const qualityAnalysis = await this.detectQualitySignals(url);
      
      // Detect duplicates
      const duplicateAnalysis = await this.detectDuplicateForCrawledPage(url, allUrls);
      
      // Determine primary issue
      let primaryIssue = null;
      let fixStrategy = null;
      
      if (duplicateAnalysis) {
        primaryIssue = 'duplicate-content';
        fixStrategy = duplicateAnalysis.duplicateOf 
          ? 'add-canonical-or-redirect'
          : 'ensure-duplicates-canonicalize-here';
      } else if (qualityAnalysis.issues.length > 0) {
        primaryIssue = 'low-quality';
        fixStrategy = 'enhance-content';
      } else {
        primaryIssue = 'unknown';
        fixStrategy = 'manual-review';
      }

      return {
        url,
        status: 'crawled-not-indexed',
        primaryIssue,
        fixStrategy,
        qualityAnalysis,
        duplicateAnalysis,
        recommendation: this.generateCrawledPageRecommendation(qualityAnalysis, duplicateAnalysis),
        fixable: primaryIssue !== 'unknown'
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `analyzeCrawledPage: ${url}`);
      if (recovery.action === 'skip') {
        return {
          url,
          status: 'crawled-not-indexed',
          primaryIssue: 'error',
          fixStrategy: 'manual-review',
          qualityAnalysis: null,
          duplicateAnalysis: null,
          recommendation: 'Error analyzing page',
          fixable: false
        };
      }
      throw error;
    }
  }

  /**
   * Generate recommendation for crawled page
   * @param {Object} qualityAnalysis - Quality analysis result
   * @param {Object|null} duplicateAnalysis - Duplicate analysis result
   * @returns {string} Recommendation
   */
  generateCrawledPageRecommendation(qualityAnalysis, duplicateAnalysis) {
    if (duplicateAnalysis) {
      return duplicateAnalysis.recommendation;
    }
    
    if (qualityAnalysis.issues.length > 0) {
      return qualityAnalysis.recommendation;
    }
    
    return 'Page appears to have good quality. Consider adding to sitemap and requesting indexing via GSC.';
  }

  /**
   * Analyze discovered but not indexed page
   * @param {string} url - URL to analyze
   * @param {Object} sitemapUrls - Set of URLs in sitemap
   * @param {Array<string>} allUrls - All URLs for analysis
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeDiscoveredPage(url, sitemapUrls = new Set(), allUrls = []) {
    this.logger.info(`Analyzing discovered page: ${url}`);

    try {
      const normalizedUrl = normalizeUrl(url);
      const inSitemap = sitemapUrls.has(normalizedUrl);
      
      // Check quality
      const qualityAnalysis = await this.detectQualitySignals(url);
      
      // Check if page is accessible
      const pageData = await this.fetchPage(url);
      const isAccessible = pageData.success && pageData.status === 200;
      
      // Determine issues
      const issues = [];
      if (!inSitemap) issues.push('not-in-sitemap');
      if (!isAccessible) issues.push('not-accessible');
      if (qualityAnalysis.issues.length > 0) issues.push(...qualityAnalysis.issues);
      
      // Determine fix strategy
      let fixStrategy = null;
      if (!inSitemap) {
        fixStrategy = 'add-to-sitemap';
      } else if (!isAccessible) {
        fixStrategy = 'fix-accessibility';
      } else if (qualityAnalysis.issues.length > 0) {
        fixStrategy = 'enhance-content';
      } else {
        fixStrategy = 'request-indexing';
      }

      return {
        url,
        status: 'discovered-not-indexed',
        inSitemap,
        isAccessible,
        issues,
        fixStrategy,
        qualityAnalysis,
        recommendation: this.generateDiscoveredPageRecommendation(inSitemap, isAccessible, qualityAnalysis),
        fixable: true
      };
    } catch (error) {
      const recovery = this.errorHandler.handleError(error, `analyzeDiscoveredPage: ${url}`);
      if (recovery.action === 'skip') {
        return {
          url,
          status: 'discovered-not-indexed',
          inSitemap: false,
          isAccessible: false,
          issues: ['error'],
          fixStrategy: 'manual-review',
          qualityAnalysis: null,
          recommendation: 'Error analyzing page',
          fixable: false
        };
      }
      throw error;
    }
  }

  /**
   * Generate recommendation for discovered page
   * @param {boolean} inSitemap - Whether page is in sitemap
   * @param {boolean} isAccessible - Whether page is accessible
   * @param {Object} qualityAnalysis - Quality analysis result
   * @returns {string} Recommendation
   */
  generateDiscoveredPageRecommendation(inSitemap, isAccessible, qualityAnalysis) {
    const recommendations = [];
    
    if (!inSitemap) {
      recommendations.push('Add page to XML sitemap');
    }
    
    if (!isAccessible) {
      recommendations.push('Fix page accessibility issues');
    }
    
    if (qualityAnalysis && qualityAnalysis.issues.length > 0) {
      recommendations.push(qualityAnalysis.recommendation);
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Submit URL via GSC URL Inspection tool for indexing');
    }
    
    return recommendations.join('. ');
  }

  /**
   * Create fixes for crawled but not indexed pages
   * @param {Array<Object>} issues - Array of crawled page issues
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixCrawledPages(issues, options = {}) {
    const { dryRun = false } = options;

    this.logger.info(`Creating fixes for ${issues.length} crawled pages (dry run: ${dryRun})`);

    const results = {
      success: true,
      issuesFixed: 0,
      issuesFailed: 0,
      details: []
    };

    for (const issue of issues) {
      try {
        const fixResult = await this.fixSingleCrawledPage(issue, { dryRun });
        
        if (fixResult.success) {
          results.issuesFixed++;
        } else {
          results.issuesFailed++;
        }
        
        results.details.push(fixResult);
        await this.logger.logFix('crawled-not-indexed', issue.url, fixResult.success, fixResult);
      } catch (error) {
        results.issuesFailed++;
        results.success = false;
        
        const errorResult = {
          url: issue.url,
          success: false,
          message: `Error: ${error.message}`
        };
        
        results.details.push(errorResult);
        await this.logger.logFix('crawled-not-indexed', issue.url, false, errorResult);
      }
    }

    this.logger.info(`Crawled page fixes complete: ${results.issuesFixed} fixed, ${results.issuesFailed} failed`);
    return results;
  }

  /**
   * Fix single crawled page issue
   * @param {Object} issue - Crawled page issue
   * @param {Object} options - Fix options
   * @returns {Promise<Object>} Fix result
   */
  async fixSingleCrawledPage(issue, options = {}) {
    const { dryRun } = options;

    this.logger.info(`Fixing crawled page: ${issue.url} (strategy: ${issue.fixStrategy})`);

    switch (issue.fixStrategy) {
      case 'add-canonical-or-redirect':
        if (dryRun) {
          return {
            url: issue.url,
            success: true,
            action: 'dry-run',
            message: `Would add canonical tag or redirect to ${issue.duplicateAnalysis.duplicateOf}`
          };
        }
        return {
          url: issue.url,
          success: true,
          action: 'manual-action-required',
          message: `Add canonical tag pointing to ${issue.duplicateAnalysis.duplicateOf} or implement 301 redirect`
        };

      case 'enhance-content':
        if (dryRun) {
          return {
            url: issue.url,
            success: true,
            action: 'dry-run',
            message: `Would enhance content: ${issue.qualityAnalysis.recommendation}`
          };
        }
        return {
          url: issue.url,
          success: true,
          action: 'manual-action-required',
          message: issue.qualityAnalysis.recommendation
        };

      case 'ensure-duplicates-canonicalize-here':
        if (dryRun) {
          return {
            url: issue.url,
            success: true,
            action: 'dry-run',
            message: 'Would ensure duplicate pages have canonical tags pointing here'
          };
        }
        return {
          url: issue.url,
          success: true,
          action: 'manual-action-required',
          message: 'Ensure duplicate pages have canonical tags pointing to this URL'
        };

      default:
        return {
          url: issue.url,
          success: false,
          action: 'skipped',
          message: 'Manual review required'
        };
    }
  }

  /**
   * Batch analyze crawled pages
   * @param {Array<string>} urls - URLs to analyze
   * @param {Array<string>} allUrls - All URLs for duplicate comparison
   * @returns {Promise<Array<Object>>} Analysis results
   */
  async analyzeCrawledPages(urls, allUrls = []) {
    this.logger.info(`Analyzing ${urls.length} crawled pages`);

    const results = [];
    const batchSize = 5;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => this.analyzeCrawledPage(url, allUrls))
      );
      results.push(...batchResults);

      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.logger.info(`Crawled page analysis complete. Processed ${results.length} pages`);
    return results;
  }

  /**
   * Batch analyze discovered pages
   * @param {Array<string>} urls - URLs to analyze
   * @param {Set<string>} sitemapUrls - URLs in sitemap
   * @param {Array<string>} allUrls - All URLs for analysis
   * @returns {Promise<Array<Object>>} Analysis results
   */
  async analyzeDiscoveredPages(urls, sitemapUrls = new Set(), allUrls = []) {
    this.logger.info(`Analyzing ${urls.length} discovered pages`);

    const results = [];
    const batchSize = 5;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(url => this.analyzeDiscoveredPage(url, sitemapUrls, allUrls))
      );
      results.push(...batchResults);

      if (i + batchSize < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.logger.info(`Discovered page analysis complete. Processed ${results.length} pages`);
    return results;
  }

  /**
   * Clear page cache
   */
  clearCache() {
    this.pageCache.clear();
    this.logger.info('Page cache cleared');
  }
}

export default CrawlAnalyzer;
