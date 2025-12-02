import fs from 'fs/promises';
import path from 'path';
import { parseStringPromise, Builder } from 'xml2js';
import { isValidUrl, normalizeUrl } from './utils.js';

/**
 * Sitemap Manager Module
 * Manages sitemap generation, validation, and cleaning
 * 
 * Requirements: 10.1, 10.2
 */
class SitemapManager {
  constructor(logger, errorHandler) {
    this.logger = logger;
    this.errorHandler = errorHandler;
    this.sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');
    this.baseUrl = 'https://www.scrapiz.in';
  }

  /**
   * Parse sitemap XML file
   * @returns {Promise<Object>} Parsed sitemap object
   */
  async parseSitemap() {
    try {
      this.logger.info('Parsing sitemap XML');
      
      const xmlContent = await fs.readFile(this.sitemapPath, 'utf-8');
      const parsed = await parseStringPromise(xmlContent);
      
      this.logger.info('Sitemap parsed successfully');
      return parsed;
    } catch (error) {
      this.logger.error('Failed to parse sitemap', { error: error.message });
      throw error;
    }
  }

  /**
   * Extract URLs from parsed sitemap
   * @param {Object} parsedSitemap - Parsed sitemap object
   * @returns {Array<Object>} Array of URL entries with metadata
   */
  extractUrls(parsedSitemap) {
    try {
      if (!parsedSitemap.urlset || !parsedSitemap.urlset.url) {
        return [];
      }

      return parsedSitemap.urlset.url.map(entry => ({
        loc: entry.loc ? entry.loc[0] : null,
        lastmod: entry.lastmod ? entry.lastmod[0] : null,
        changefreq: entry.changefreq ? entry.changefreq[0] : null,
        priority: entry.priority ? entry.priority[0] : null
      })).filter(entry => entry.loc);
    } catch (error) {
      this.logger.error('Failed to extract URLs from sitemap', { error: error.message });
      return [];
    }
  }

  /**
   * Generate sitemap XML with proper structure
   * @param {Array<Object>} pages - Array of page objects with url, lastmod, priority, changefreq
   * @returns {string} XML sitemap content
   */
  generateSitemap(pages) {
    try {
      this.logger.info(`Generating sitemap for ${pages.length} pages`);

      // Build sitemap structure
      const urlset = {
        urlset: {
          $: {
            xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9'
          },
          url: pages.map(page => {
            const url = {
              loc: [page.url || page.loc]
            };

            if (page.lastmod) {
              url.lastmod = [page.lastmod];
            }

            if (page.changefreq) {
              url.changefreq = [page.changefreq];
            }

            if (page.priority !== undefined) {
              url.priority = [String(page.priority)];
            }

            return url;
          })
        }
      };

      // Build XML
      const builder = new Builder({
        xmldec: { version: '1.0', encoding: 'UTF-8' },
        renderOpts: { pretty: true, indent: '  ' }
      });

      const xml = builder.buildObject(urlset);
      
      this.logger.info('Sitemap generated successfully');
      return xml;
    } catch (error) {
      this.logger.error('Failed to generate sitemap', { error: error.message });
      throw error;
    }
  }

  /**
   * Validate sitemap entries (check for redirects, 404s, noindex)
   * @param {Array<Object>} urlEntries - Array of URL entries from sitemap
   * @param {Function} statusChecker - Function to check URL status (url) => Promise<{status, noindex, isRedirect}>
   * @returns {Promise<Array<Object>>} Array of validation issues
   */
  async validateSitemap(urlEntries, statusChecker) {
    try {
      this.logger.info(`Validating ${urlEntries.length} sitemap entries`);
      
      const issues = [];

      for (const entry of urlEntries) {
        const url = entry.loc;

        // Validate URL format
        if (!isValidUrl(url)) {
          issues.push({
            url,
            issue: 'invalid-url',
            severity: 'error',
            message: 'Invalid URL format'
          });
          continue;
        }

        // Check URL status if checker provided
        if (statusChecker) {
          try {
            const status = await statusChecker(url);

            // Check for redirects
            if (status.isRedirect) {
              issues.push({
                url,
                issue: 'redirect',
                severity: 'error',
                message: `URL redirects (${status.status})`,
                finalUrl: status.finalUrl
              });
            }

            // Check for 404s
            if (status.status === 404) {
              issues.push({
                url,
                issue: 'not-found',
                severity: 'error',
                message: 'URL returns 404'
              });
            }

            // Check for server errors
            if (status.status >= 500) {
              issues.push({
                url,
                issue: 'server-error',
                severity: 'error',
                message: `URL returns ${status.status}`
              });
            }

            // Check for noindex
            if (status.noindex) {
              issues.push({
                url,
                issue: 'noindex',
                severity: 'error',
                message: 'URL has noindex directive'
              });
            }

            // Check for non-200 status (excluding redirects already caught)
            if (status.status !== 200 && !status.isRedirect && status.status !== 404) {
              issues.push({
                url,
                issue: 'non-200-status',
                severity: 'warning',
                message: `URL returns ${status.status}`
              });
            }
          } catch (error) {
            issues.push({
              url,
              issue: 'check-failed',
              severity: 'warning',
              message: `Failed to check URL: ${error.message}`
            });
          }
        }

        // Validate metadata completeness
        if (!entry.lastmod) {
          issues.push({
            url,
            issue: 'missing-lastmod',
            severity: 'warning',
            message: 'Missing lastmod date'
          });
        }

        if (!entry.priority) {
          issues.push({
            url,
            issue: 'missing-priority',
            severity: 'warning',
            message: 'Missing priority value'
          });
        }
      }

      this.logger.info(`Validation complete: ${issues.length} issues found`);
      return issues;
    } catch (error) {
      this.logger.error('Failed to validate sitemap', { error: error.message });
      throw error;
    }
  }

  /**
   * Remove invalid URLs from sitemap
   * @param {Array<string>} urlsToRemove - URLs to remove from sitemap
   * @returns {Promise<Object>} Result with removed count and new sitemap
   */
  async cleanSitemap(urlsToRemove) {
    try {
      this.logger.info(`Cleaning sitemap: removing ${urlsToRemove.length} URLs`);

      // Create backup
      const backupPath = await this.errorHandler.createBackup(this.sitemapPath);

      try {
        // Parse current sitemap
        const parsed = await this.parseSitemap();
        const currentUrls = this.extractUrls(parsed);

        // Normalize URLs for comparison
        const normalizedRemoveUrls = new Set(
          urlsToRemove.map(url => normalizeUrl(url))
        );

        // Filter out URLs to remove
        const cleanedUrls = currentUrls.filter(entry => {
          const normalized = normalizeUrl(entry.loc);
          return !normalizedRemoveUrls.has(normalized);
        });

        const removedCount = currentUrls.length - cleanedUrls.length;

        // Generate new sitemap
        const newSitemap = this.generateSitemap(cleanedUrls);

        // Write new sitemap
        await fs.writeFile(this.sitemapPath, newSitemap, 'utf-8');

        this.logger.info(`Sitemap cleaned: removed ${removedCount} URLs`);

        return {
          success: true,
          removedCount,
          remainingCount: cleanedUrls.length,
          sitemap: newSitemap
        };
      } catch (error) {
        // Rollback on error
        await this.errorHandler.rollback(backupPath, this.sitemapPath);
        throw error;
      }
    } catch (error) {
      this.logger.error('Failed to clean sitemap', { error: error.message });
      throw error;
    }
  }

  /**
   * Add URLs to sitemap
   * @param {Array<Object>} newPages - Array of page objects to add
   * @returns {Promise<Object>} Result with added count
   */
  async addUrls(newPages) {
    try {
      this.logger.info(`Adding ${newPages.length} URLs to sitemap`);

      // Create backup
      const backupPath = await this.errorHandler.createBackup(this.sitemapPath);

      try {
        // Parse current sitemap
        const parsed = await this.parseSitemap();
        const currentUrls = this.extractUrls(parsed);

        // Get existing URLs for deduplication
        const existingUrls = new Set(
          currentUrls.map(entry => normalizeUrl(entry.loc))
        );

        // Filter out duplicates
        const urlsToAdd = newPages.filter(page => {
          const normalized = normalizeUrl(page.url || page.loc);
          return !existingUrls.has(normalized);
        });

        // Combine URLs
        const allUrls = [...currentUrls, ...urlsToAdd];

        // Generate new sitemap
        const newSitemap = this.generateSitemap(allUrls);

        // Write new sitemap
        await fs.writeFile(this.sitemapPath, newSitemap, 'utf-8');

        this.logger.info(`Added ${urlsToAdd.length} URLs to sitemap`);

        return {
          success: true,
          addedCount: urlsToAdd.length,
          skippedCount: newPages.length - urlsToAdd.length,
          totalCount: allUrls.length
        };
      } catch (error) {
        // Rollback on error
        await this.errorHandler.rollback(backupPath, this.sitemapPath);
        throw error;
      }
    } catch (error) {
      this.logger.error('Failed to add URLs to sitemap', { error: error.message });
      throw error;
    }
  }

  /**
   * Update existing URL in sitemap
   * @param {string} url - URL to update
   * @param {Object} updates - Fields to update (lastmod, priority, changefreq)
   * @returns {Promise<Object>} Result
   */
  async updateUrl(url, updates) {
    try {
      this.logger.info(`Updating URL in sitemap: ${url}`);

      // Create backup
      const backupPath = await this.errorHandler.createBackup(this.sitemapPath);

      try {
        // Parse current sitemap
        const parsed = await this.parseSitemap();
        const currentUrls = this.extractUrls(parsed);

        // Find and update URL
        const normalizedUrl = normalizeUrl(url);
        let found = false;

        const updatedUrls = currentUrls.map(entry => {
          if (normalizeUrl(entry.loc) === normalizedUrl) {
            found = true;
            return {
              ...entry,
              ...updates,
              loc: entry.loc // Keep original loc
            };
          }
          return entry;
        });

        if (!found) {
          throw new Error(`URL not found in sitemap: ${url}`);
        }

        // Generate new sitemap
        const newSitemap = this.generateSitemap(updatedUrls);

        // Write new sitemap
        await fs.writeFile(this.sitemapPath, newSitemap, 'utf-8');

        this.logger.info(`URL updated in sitemap: ${url}`);

        return {
          success: true,
          url,
          updates
        };
      } catch (error) {
        // Rollback on error
        await this.errorHandler.rollback(backupPath, this.sitemapPath);
        throw error;
      }
    } catch (error) {
      this.logger.error('Failed to update URL in sitemap', { error: error.message });
      throw error;
    }
  }

  /**
   * Get sitemap statistics
   * @returns {Promise<Object>} Sitemap statistics
   */
  async getStatistics() {
    try {
      const parsed = await this.parseSitemap();
      const urls = this.extractUrls(parsed);

      const stats = {
        totalUrls: urls.length,
        withLastmod: urls.filter(u => u.lastmod).length,
        withPriority: urls.filter(u => u.priority).length,
        withChangefreq: urls.filter(u => u.changefreq).length,
        byPriority: {},
        byChangefreq: {}
      };

      // Group by priority
      urls.forEach(url => {
        if (url.priority) {
          stats.byPriority[url.priority] = (stats.byPriority[url.priority] || 0) + 1;
        }
      });

      // Group by changefreq
      urls.forEach(url => {
        if (url.changefreq) {
          stats.byChangefreq[url.changefreq] = (stats.byChangefreq[url.changefreq] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      this.logger.error('Failed to get sitemap statistics', { error: error.message });
      throw error;
    }
  }

  /**
   * Extract URLs from sitemap file
   * @param {string} sitemapPath - Path to sitemap file (optional, uses default if not provided)
   * @returns {Promise<Array<string>>} Array of URLs
   */
  async extractUrlsFromSitemap(sitemapPath = null) {
    try {
      // Use provided path or default
      const pathToUse = sitemapPath || this.sitemapPath;
      
      this.logger.info(`Extracting URLs from sitemap: ${pathToUse}`);
      
      const xmlContent = await fs.readFile(pathToUse, 'utf-8');
      const parsed = await parseStringPromise(xmlContent);
      const urlEntries = this.extractUrls(parsed);
      
      const urls = urlEntries.map(entry => entry.loc);
      
      this.logger.info(`Extracted ${urls.length} URLs from sitemap`);
      return urls;
    } catch (error) {
      this.logger.error('Failed to extract URLs from sitemap', { error: error.message });
      throw error;
    }
  }

  /**
   * Validate sitemap structure
   * @returns {Promise<Object>} Validation result
   */
  async validateStructure() {
    try {
      this.logger.info('Validating sitemap structure');

      const parsed = await this.parseSitemap();
      const issues = [];

      // Check for urlset element
      if (!parsed.urlset) {
        issues.push({
          issue: 'missing-urlset',
          severity: 'error',
          message: 'Missing urlset element'
        });
        return { valid: false, issues };
      }

      // Check for xmlns attribute
      if (!parsed.urlset.$ || !parsed.urlset.$.xmlns) {
        issues.push({
          issue: 'missing-xmlns',
          severity: 'error',
          message: 'Missing xmlns attribute'
        });
      }

      // Check for url elements
      if (!parsed.urlset.url || parsed.urlset.url.length === 0) {
        issues.push({
          issue: 'no-urls',
          severity: 'warning',
          message: 'Sitemap contains no URLs'
        });
      }

      const valid = issues.filter(i => i.severity === 'error').length === 0;

      this.logger.info(`Structure validation complete: ${valid ? 'valid' : 'invalid'}`);

      return {
        valid,
        issues
      };
    } catch (error) {
      this.logger.error('Failed to validate sitemap structure', { error: error.message });
      return {
        valid: false,
        issues: [{
          issue: 'parse-error',
          severity: 'error',
          message: error.message
        }]
      };
    }
  }
}

export default SitemapManager;
