import { describe, it, expect, beforeEach, vi } from 'vitest';
import CrawlAnalyzer from './CrawlAnalyzer.js';

/**
 * Unit tests for CrawlAnalyzer
 */

// Mock logger
const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  logIssue: vi.fn(),
  logFix: vi.fn()
};

// Mock error handler
const mockErrorHandler = {
  handleError: vi.fn((error, context) => ({
    action: 'skip',
    message: error.message
  })),
  createBackup: vi.fn(),
  rollback: vi.fn()
};

describe('CrawlAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new CrawlAnalyzer(mockLogger, mockErrorHandler);
    vi.clearAllMocks();
  });

  describe('analyzePageContent', () => {
    it('should identify thin content (< 500 words)', () => {
      const html = `
        <html>
          <body>
            <h1>Title</h1>
            <p>Short content with less than 500 words.</p>
          </body>
        </html>
      `;

      const result = analyzer.analyzePageContent(html);

      expect(result.isThinContent).toBe(true);
      expect(result.wordCount).toBeLessThan(500);
    });

    it('should identify pages without headings', () => {
      const html = `
        <html>
          <body>
            <p>Content without any headings. This is just plain text.</p>
          </body>
        </html>
      `;

      const result = analyzer.analyzePageContent(html);

      expect(result.hasHeadings).toBe(false);
      expect(result.headings.h1).toBe(0);
      expect(result.headings.h2).toBe(0);
    });

    it('should count internal links correctly', () => {
      const html = `
        <html>
          <body>
            <a href="/page1">Link 1</a>
            <a href="/page2">Link 2</a>
            <a href="https://external.com">External</a>
            <a href="#section">Anchor</a>
          </body>
        </html>
      `;

      const result = analyzer.analyzePageContent(html);

      expect(result.internalLinks).toBe(3); // /page1, /page2, #section
    });

    it('should identify low quality pages', () => {
      const html = `
        <html>
          <body>
            <p>Content without headings or links.</p>
          </body>
        </html>
      `;

      const result = analyzer.analyzePageContent(html);

      expect(result.isLowQuality).toBe(true);
      expect(result.hasHeadings).toBe(false);
      expect(result.internalLinks).toBe(0);
    });

    it('should handle empty HTML', () => {
      const result = analyzer.analyzePageContent('');

      expect(result.wordCount).toBe(0);
      expect(result.hasHeadings).toBe(false);
      expect(result.internalLinks).toBe(0);
      expect(result.isThinContent).toBe(true);
      expect(result.isLowQuality).toBe(true);
    });

    it('should identify good quality pages', () => {
      const html = `
        <html>
          <body>
            <h1>Main Title</h1>
            <h2>Section 1</h2>
            <p>${'Lorem ipsum dolor sit amet. '.repeat(100)}</p>
            <a href="/related1">Related Page 1</a>
            <a href="/related2">Related Page 2</a>
            <a href="/related3">Related Page 3</a>
            <h2>Section 2</h2>
            <p>${'More content here. '.repeat(50)}</p>
          </body>
        </html>
      `;

      const result = analyzer.analyzePageContent(html);

      expect(result.isThinContent).toBe(false);
      expect(result.hasHeadings).toBe(true);
      expect(result.internalLinks).toBeGreaterThanOrEqual(3);
      expect(result.isLowQuality).toBe(false);
    });
  });

  describe('generateQualityRecommendation', () => {
    it('should recommend adding content for thin pages', () => {
      const issues = ['thin-content'];
      const contentAnalysis = { wordCount: 200, hasHeadings: true, internalLinks: 3 };

      const recommendation = analyzer.generateQualityRecommendation(issues, contentAnalysis);

      expect(recommendation).toContain('300 more words');
    });

    it('should recommend adding headings', () => {
      const issues = ['no-headings'];
      const contentAnalysis = { wordCount: 600, hasHeadings: false, internalLinks: 3 };

      const recommendation = analyzer.generateQualityRecommendation(issues, contentAnalysis);

      expect(recommendation).toContain('heading structure');
      expect(recommendation).toContain('H1, H2, H3');
    });

    it('should recommend adding internal links', () => {
      const issues = ['low-links'];
      const contentAnalysis = { wordCount: 600, hasHeadings: true, internalLinks: 1 };

      const recommendation = analyzer.generateQualityRecommendation(issues, contentAnalysis);

      expect(recommendation).toContain('internal links');
      expect(recommendation).toContain('2 more');
    });

    it('should combine multiple recommendations', () => {
      const issues = ['thin-content', 'no-headings', 'low-links'];
      const contentAnalysis = { wordCount: 200, hasHeadings: false, internalLinks: 0 };

      const recommendation = analyzer.generateQualityRecommendation(issues, contentAnalysis);

      expect(recommendation).toContain('words');
      expect(recommendation).toContain('heading');
      expect(recommendation).toContain('links');
    });

    it('should return positive message for good quality', () => {
      const issues = [];
      const contentAnalysis = { wordCount: 600, hasHeadings: true, internalLinks: 5 };

      const recommendation = analyzer.generateQualityRecommendation(issues, contentAnalysis);

      expect(recommendation).toContain('acceptable');
    });
  });

  describe('selectPrimaryVersion', () => {
    it('should prefer HTTPS over HTTP', () => {
      const urls = [
        'http://example.com/page',
        'https://example.com/page'
      ];

      const primary = analyzer.selectPrimaryVersion(urls);

      expect(primary).toBe('https://example.com/page');
    });

    it('should prefer URLs without parameters', () => {
      const urls = [
        'https://example.com/page?utm_source=test',
        'https://example.com/page'
      ];

      const primary = analyzer.selectPrimaryVersion(urls);

      expect(primary).toBe('https://example.com/page');
    });

    it('should prefer shorter URLs', () => {
      const urls = [
        'https://example.com/very/long/path/to/page',
        'https://example.com/page'
      ];

      const primary = analyzer.selectPrimaryVersion(urls);

      expect(primary).toBe('https://example.com/page');
    });

    it('should handle single URL', () => {
      const urls = ['https://example.com/page'];

      const primary = analyzer.selectPrimaryVersion(urls);

      expect(primary).toBe('https://example.com/page');
    });

    it('should return null for empty array', () => {
      const primary = analyzer.selectPrimaryVersion([]);

      expect(primary).toBeNull();
    });

    it('should be consistent with same scores', () => {
      const urls = [
        'https://example.com/page-b',
        'https://example.com/page-a'
      ];

      const primary = analyzer.selectPrimaryVersion(urls);

      // Should sort alphabetically when scores are equal
      expect(primary).toBe('https://example.com/page-a');
    });
  });

  describe('generateCrawledPageRecommendation', () => {
    it('should prioritize duplicate recommendation', () => {
      const qualityAnalysis = {
        issues: ['thin-content'],
        recommendation: 'Add more content'
      };
      const duplicateAnalysis = {
        recommendation: 'Add canonical tag to primary'
      };

      const recommendation = analyzer.generateCrawledPageRecommendation(
        qualityAnalysis,
        duplicateAnalysis
      );

      expect(recommendation).toBe(duplicateAnalysis.recommendation);
    });

    it('should use quality recommendation when no duplicates', () => {
      const qualityAnalysis = {
        issues: ['thin-content'],
        recommendation: 'Add more content'
      };

      const recommendation = analyzer.generateCrawledPageRecommendation(
        qualityAnalysis,
        null
      );

      expect(recommendation).toBe(qualityAnalysis.recommendation);
    });

    it('should suggest sitemap for good quality pages', () => {
      const qualityAnalysis = {
        issues: [],
        recommendation: 'Page quality is acceptable'
      };

      const recommendation = analyzer.generateCrawledPageRecommendation(
        qualityAnalysis,
        null
      );

      expect(recommendation).toContain('sitemap');
      expect(recommendation).toContain('GSC');
    });
  });

  describe('generateDiscoveredPageRecommendation', () => {
    it('should recommend adding to sitemap', () => {
      const qualityAnalysis = { issues: [] };

      const recommendation = analyzer.generateDiscoveredPageRecommendation(
        false,
        true,
        qualityAnalysis
      );

      expect(recommendation).toContain('sitemap');
    });

    it('should recommend fixing accessibility', () => {
      const qualityAnalysis = { issues: [] };

      const recommendation = analyzer.generateDiscoveredPageRecommendation(
        true,
        false,
        qualityAnalysis
      );

      expect(recommendation).toContain('accessibility');
    });

    it('should include quality recommendations', () => {
      const qualityAnalysis = {
        issues: ['thin-content'],
        recommendation: 'Add more content'
      };

      const recommendation = analyzer.generateDiscoveredPageRecommendation(
        true,
        true,
        qualityAnalysis
      );

      expect(recommendation).toContain('Add more content');
    });

    it('should suggest GSC submission for good pages', () => {
      const qualityAnalysis = { issues: [] };

      const recommendation = analyzer.generateDiscoveredPageRecommendation(
        true,
        true,
        qualityAnalysis
      );

      expect(recommendation).toContain('GSC');
      expect(recommendation).toContain('URL Inspection');
    });

    it('should combine multiple recommendations', () => {
      const qualityAnalysis = {
        issues: ['thin-content'],
        recommendation: 'Add more content'
      };

      const recommendation = analyzer.generateDiscoveredPageRecommendation(
        false,
        false,
        qualityAnalysis
      );

      expect(recommendation).toContain('sitemap');
      expect(recommendation).toContain('accessibility');
      expect(recommendation).toContain('Add more content');
    });
  });

  describe('clearCache', () => {
    it('should clear the page cache', () => {
      analyzer.pageCache.set('test-url', { data: 'test' });
      expect(analyzer.pageCache.size).toBe(1);

      analyzer.clearCache();

      expect(analyzer.pageCache.size).toBe(0);
    });
  });
});
