import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import SitemapManager from './SitemapManager.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

describe('SitemapManager', () => {
  let sitemapManager;
  let logger;
  let errorHandler;
  let testSitemapPath;
  let originalSitemapPath;

  beforeEach(async () => {
    // Initialize dependencies
    logger = new Logger('scripts/gsc-fixes/logs/test');
    await logger.initialize();

    errorHandler = new ErrorHandler(logger);
    await errorHandler.initialize();

    sitemapManager = new SitemapManager(logger, errorHandler);

    // Create test sitemap path
    testSitemapPath = path.join(process.cwd(), 'public/sitemap.test.xml');
    originalSitemapPath = sitemapManager.sitemapPath;
    sitemapManager.sitemapPath = testSitemapPath;
  });

  afterEach(async () => {
    // Clean up test files
    try {
      await fs.unlink(testSitemapPath);
    } catch (error) {
      // Ignore if file doesn't exist
    }

    // Restore original path
    sitemapManager.sitemapPath = originalSitemapPath;
  });

  describe('generateSitemap', () => {
    test('generates valid XML sitemap with all fields', () => {
      const pages = [
        {
          url: 'https://www.scrapiz.in/',
          lastmod: '2025-12-01',
          priority: '1.0',
          changefreq: 'weekly'
        },
        {
          url: 'https://www.scrapiz.in/about',
          lastmod: '2025-12-01',
          priority: '0.8',
          changefreq: 'monthly'
        }
      ];

      const xml = sitemapManager.generateSitemap(pages);

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>https://www.scrapiz.in/</loc>');
      expect(xml).toContain('<lastmod>2025-12-01</lastmod>');
      expect(xml).toContain('<priority>1.0</priority>');
      expect(xml).toContain('<changefreq>weekly</changefreq>');
    });

    test('generates sitemap with minimal fields', () => {
      const pages = [
        {
          url: 'https://www.scrapiz.in/'
        }
      ];

      const xml = sitemapManager.generateSitemap(pages);

      expect(xml).toContain('<loc>https://www.scrapiz.in/</loc>');
      expect(xml).not.toContain('<lastmod>');
      expect(xml).not.toContain('<priority>');
      expect(xml).not.toContain('<changefreq>');
    });

    test('handles empty pages array', () => {
      const xml = sitemapManager.generateSitemap([]);

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    });
  });

  describe('parseSitemap and extractUrls', () => {
    test('parses valid sitemap and extracts URLs', async () => {
      const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.scrapiz.in/</loc>
    <lastmod>2025-12-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.scrapiz.in/about</loc>
    <lastmod>2025-12-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

      await fs.writeFile(testSitemapPath, testXml, 'utf-8');

      const parsed = await sitemapManager.parseSitemap();
      const urls = sitemapManager.extractUrls(parsed);

      expect(urls).toHaveLength(2);
      expect(urls[0].loc).toBe('https://www.scrapiz.in/');
      expect(urls[0].lastmod).toBe('2025-12-01');
      expect(urls[0].priority).toBe('1.0');
      expect(urls[0].changefreq).toBe('weekly');
    });

    test('handles sitemap with missing optional fields', async () => {
      const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.scrapiz.in/</loc>
  </url>
</urlset>`;

      await fs.writeFile(testSitemapPath, testXml, 'utf-8');

      const parsed = await sitemapManager.parseSitemap();
      const urls = sitemapManager.extractUrls(parsed);

      expect(urls).toHaveLength(1);
      expect(urls[0].loc).toBe('https://www.scrapiz.in/');
      expect(urls[0].lastmod).toBeNull();
      expect(urls[0].priority).toBeNull();
      expect(urls[0].changefreq).toBeNull();
    });
  });

  describe('validateSitemap', () => {
    test('identifies invalid URL format', async () => {
      const urlEntries = [
        { loc: 'not-a-valid-url' }
      ];

      const issues = await sitemapManager.validateSitemap(urlEntries, null);

      expect(issues).toHaveLength(1);
      expect(issues[0].issue).toBe('invalid-url');
      expect(issues[0].severity).toBe('error');
    });

    test('identifies missing metadata', async () => {
      const urlEntries = [
        { loc: 'https://www.scrapiz.in/' }
      ];

      const issues = await sitemapManager.validateSitemap(urlEntries, null);

      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some(i => i.issue === 'missing-lastmod')).toBe(true);
      expect(issues.some(i => i.issue === 'missing-priority')).toBe(true);
    });

    test('identifies redirects using status checker', async () => {
      const urlEntries = [
        { loc: 'https://www.scrapiz.in/old-page', lastmod: '2025-12-01', priority: '0.8' }
      ];

      const statusChecker = async (url) => ({
        status: 301,
        isRedirect: true,
        noindex: false,
        finalUrl: 'https://www.scrapiz.in/new-page'
      });

      const issues = await sitemapManager.validateSitemap(urlEntries, statusChecker);

      const redirectIssue = issues.find(i => i.issue === 'redirect');
      expect(redirectIssue).toBeDefined();
      expect(redirectIssue.severity).toBe('error');
    });

    test('identifies 404 errors using status checker', async () => {
      const urlEntries = [
        { loc: 'https://www.scrapiz.in/missing', lastmod: '2025-12-01', priority: '0.8' }
      ];

      const statusChecker = async (url) => ({
        status: 404,
        isRedirect: false,
        noindex: false,
        finalUrl: url
      });

      const issues = await sitemapManager.validateSitemap(urlEntries, statusChecker);

      const notFoundIssue = issues.find(i => i.issue === 'not-found');
      expect(notFoundIssue).toBeDefined();
      expect(notFoundIssue.severity).toBe('error');
    });

    test('identifies noindex pages using status checker', async () => {
      const urlEntries = [
        { loc: 'https://www.scrapiz.in/noindex-page', lastmod: '2025-12-01', priority: '0.8' }
      ];

      const statusChecker = async (url) => ({
        status: 200,
        isRedirect: false,
        noindex: true,
        finalUrl: url
      });

      const issues = await sitemapManager.validateSitemap(urlEntries, statusChecker);

      const noindexIssue = issues.find(i => i.issue === 'noindex');
      expect(noindexIssue).toBeDefined();
      expect(noindexIssue.severity).toBe('error');
    });
  });

  describe('cleanSitemap', () => {
    test('removes specified URLs from sitemap', async () => {
      const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.scrapiz.in/</loc>
    <lastmod>2025-12-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.scrapiz.in/remove-me</loc>
    <lastmod>2025-12-01</lastmod>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.scrapiz.in/about</loc>
    <lastmod>2025-12-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>`;

      await fs.writeFile(testSitemapPath, testXml, 'utf-8');

      const result = await sitemapManager.cleanSitemap([
        'https://www.scrapiz.in/remove-me'
      ]);

      expect(result.success).toBe(true);
      expect(result.removedCount).toBe(1);
      expect(result.remainingCount).toBe(2);

      // Verify the URL was actually removed
      const parsed = await sitemapManager.parseSitemap();
      const urls = sitemapManager.extractUrls(parsed);
      expect(urls).toHaveLength(2);
      expect(urls.find(u => u.loc === 'https://www.scrapiz.in/remove-me')).toBeUndefined();
    });

    test('handles trailing slash variations', async () => {
      const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.scrapiz.in/page/</loc>
    <lastmod>2025-12-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>`;

      await fs.writeFile(testSitemapPath, testXml, 'utf-8');

      const result = await sitemapManager.cleanSitemap([
        'https://www.scrapiz.in/page' // Without trailing slash
      ]);

      expect(result.removedCount).toBe(1);
    });
  });

  describe('addUrls', () => {
    test('adds new URLs to sitemap', async () => {
      const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.scrapiz.in/</loc>
    <lastmod>2025-12-01</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;

      await fs.writeFile(testSitemapPath, testXml, 'utf-8');

      const newPages = [
        {
          url: 'https://www.scrapiz.in/new-page',
          lastmod: '2025-12-01',
          priority: '0.7',
          changefreq: 'monthly'
        }
      ];

      const result = await sitemapManager.addUrls(newPages);

      expect(result.success).toBe(true);
      expect(result.addedCount).toBe(1);
      expect(result.totalCount).toBe(2);

      // Verify the URL was actually added
      const parsed = await sitemapManager.parseSitemap();
      const urls = sitemapManager.extractUrls(parsed);
      expect(urls).toHaveLength(2);
      expect(urls.find(u => u.loc === 'https://www.scrapiz.in/new-page')).toBeDefined();
    });

    test('skips duplicate URLs', async () => {
      const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.scrapiz.in/existing</loc>
    <lastmod>2025-12-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>`;

      await fs.writeFile(testSitemapPath, testXml, 'utf-8');

      const newPages = [
        {
          url: 'https://www.scrapiz.in/existing',
          lastmod: '2025-12-01',
          priority: '0.8'
        }
      ];

      const result = await sitemapManager.addUrls(newPages);

      expect(result.addedCount).toBe(0);
      expect(result.skippedCount).toBe(1);
    });
  });

  describe('getStatistics', () => {
    test('returns correct statistics', async () => {
      const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.scrapiz.in/</loc>
    <lastmod>2025-12-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.scrapiz.in/about</loc>
    <lastmod>2025-12-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.scrapiz.in/contact</loc>
  </url>
</urlset>`;

      await fs.writeFile(testSitemapPath, testXml, 'utf-8');

      const stats = await sitemapManager.getStatistics();

      expect(stats.totalUrls).toBe(3);
      expect(stats.withLastmod).toBe(2);
      expect(stats.withPriority).toBe(2);
      expect(stats.withChangefreq).toBe(2);
      expect(stats.byPriority['1.0']).toBe(1);
      expect(stats.byPriority['0.8']).toBe(1);
      expect(stats.byChangefreq['weekly']).toBe(1);
      expect(stats.byChangefreq['monthly']).toBe(1);
    });
  });

  describe('validateStructure', () => {
    test('validates correct sitemap structure', async () => {
      const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.scrapiz.in/</loc>
  </url>
</urlset>`;

      await fs.writeFile(testSitemapPath, testXml, 'utf-8');

      const result = await sitemapManager.validateStructure();

      expect(result.valid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    test('identifies missing xmlns', async () => {
      const testXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset>
  <url>
    <loc>https://www.scrapiz.in/</loc>
  </url>
</urlset>`;

      await fs.writeFile(testSitemapPath, testXml, 'utf-8');

      const result = await sitemapManager.validateStructure();

      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.issue === 'missing-xmlns')).toBe(true);
    });
  });
});
