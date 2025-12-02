/**
 * Unit Tests for Redirect Detection and Fixing
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import RedirectDetector from './RedirectDetector.js';
import RedirectFixer from './RedirectFixer.js';

// Mock logger and error handler
const mockLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  logIssue: vi.fn(),
  logFix: vi.fn()
};

const mockErrorHandler = {
  handleError: vi.fn((error, context) => ({ action: 'skip' })),
  createBackup: vi.fn(async (path) => `${path}.backup.${Date.now()}`),
  rollback: vi.fn(async (backupPath, originalPath) => {})
};

describe('RedirectDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new RedirectDetector(mockLogger, mockErrorHandler);
    vi.clearAllMocks();
  });

  describe('resolveRedirectUrl', () => {
    it('should handle absolute URLs', () => {
      const baseUrl = 'https://example.com/page1';
      const location = 'https://example.com/page2';
      const result = detector.resolveRedirectUrl(baseUrl, location);
      expect(result).toBe('https://example.com/page2');
    });

    it('should handle absolute paths', () => {
      const baseUrl = 'https://example.com/old/page1';
      const location = '/new/page2';
      const result = detector.resolveRedirectUrl(baseUrl, location);
      expect(result).toBe('https://example.com/new/page2');
    });

    it('should handle protocol-relative URLs', () => {
      const baseUrl = 'https://example.com/page1';
      const location = '//cdn.example.com/page2';
      const result = detector.resolveRedirectUrl(baseUrl, location);
      expect(result).toBe('https://cdn.example.com/page2');
    });

    it('should handle relative paths', () => {
      const baseUrl = 'https://example.com/old/page1';
      const location = 'page2';
      const result = detector.resolveRedirectUrl(baseUrl, location);
      expect(result).toBe('https://example.com/old/page2');
    });
  });

  describe('identifyRedirectType', () => {
    it('should identify 301 as permanent', () => {
      const result = detector.identifyRedirectType(301);
      expect(result.type).toBe('permanent');
      expect(result.recommended).toBe(true);
    });

    it('should identify 302 as temporary', () => {
      const result = detector.identifyRedirectType(302);
      expect(result.type).toBe('temporary');
      expect(result.recommended).toBe(false);
    });

    it('should identify 307 as temporary', () => {
      const result = detector.identifyRedirectType(307);
      expect(result.type).toBe('temporary');
      expect(result.recommended).toBe(false);
    });

    it('should identify 308 as permanent', () => {
      const result = detector.identifyRedirectType(308);
      expect(result.type).toBe('permanent');
      expect(result.recommended).toBe(true);
    });

    it('should handle unknown status codes', () => {
      const result = detector.identifyRedirectType(999);
      expect(result.type).toBe('unknown');
      expect(result.recommended).toBe(false);
    });
  });

  describe('getRedirectRecommendation', () => {
    it('should recommend flattening for chains', () => {
      const chainInfo = {
        hasChain: true,
        chainLength: 3,
        redirectType: 301
      };
      const typeInfo = { recommended: true, name: '301 Moved Permanently' };
      const result = detector.getRedirectRecommendation(chainInfo, typeInfo);
      expect(result).toContain('Flatten redirect chain');
      expect(result).toContain('3 hops');
    });

    it('should recommend changing temporary to permanent', () => {
      const chainInfo = {
        hasChain: false,
        chainLength: 1,
        redirectType: 302
      };
      const typeInfo = { recommended: false, name: '302 Found' };
      const result = detector.getRedirectRecommendation(chainInfo, typeInfo);
      expect(result).toContain('Change from 302 Found to 301 Permanent');
    });

    it('should always recommend updating sitemap and links', () => {
      const chainInfo = {
        hasChain: false,
        chainLength: 1,
        redirectType: 301
      };
      const typeInfo = { recommended: true, name: '301 Moved Permanently' };
      const result = detector.getRedirectRecommendation(chainInfo, typeInfo);
      expect(result).toContain('Update sitemap');
      expect(result).toContain('Update internal links');
    });
  });

  describe('analyzeRedirectPatterns', () => {
    it('should analyze redirect patterns correctly', () => {
      const issues = [
        {
          url: 'https://example.com/page1',
          hasChain: true,
          chainLength: 3,
          isPermanent: false,
          isTemporary: true,
          redirectTypeName: '302 Found'
        },
        {
          url: 'https://example.com/page2',
          hasChain: false,
          chainLength: 1,
          isPermanent: true,
          isTemporary: false,
          redirectTypeName: '301 Moved Permanently'
        },
        {
          url: 'https://example.com/page3',
          hasChain: true,
          chainLength: 5,
          isPermanent: false,
          isTemporary: true,
          redirectTypeName: '302 Found'
        }
      ];

      const analysis = detector.analyzeRedirectPatterns(issues);

      expect(analysis.totalRedirects).toBe(3);
      expect(analysis.redirectChains).toBe(2);
      expect(analysis.temporaryRedirects).toBe(2);
      expect(analysis.permanentRedirects).toBe(1);
      expect(analysis.longestChain).toBe(5);
      expect(analysis.redirectsByType['302 Found']).toBe(2);
      expect(analysis.redirectsByType['301 Moved Permanently']).toBe(1);
    });

    it('should handle empty issues array', () => {
      const analysis = detector.analyzeRedirectPatterns([]);
      expect(analysis.totalRedirects).toBe(0);
      expect(analysis.redirectChains).toBe(0);
      expect(analysis.longestChain).toBe(0);
    });
  });
});

describe('RedirectFixer', () => {
  let fixer;

  beforeEach(() => {
    fixer = new RedirectFixer(mockLogger, mockErrorHandler);
    vi.clearAllMocks();
  });

  describe('generateRedirectRule', () => {
    it('should generate correct redirect rule', () => {
      const fromUrl = 'https://example.com/old-page';
      const toUrl = 'https://example.com/new-page';
      const rule = fixer.generateRedirectRule(fromUrl, toUrl, 301);

      expect(rule).toBeDefined();
      expect(rule.from).toBe(fromUrl);
      expect(rule.to).toBe(toUrl);
      expect(rule.statusCode).toBe(301);
      expect(rule.rule).toContain('RewriteRule');
      expect(rule.rule).toContain('R=301');
      expect(rule.rule).toContain('[R=301,L]');
    });

    it('should handle trailing slashes', () => {
      const fromUrl = 'https://example.com/old-page/';
      const toUrl = 'https://example.com/new-page/';
      const rule = fixer.generateRedirectRule(fromUrl, toUrl, 301);

      expect(rule.rule).toContain('/?$');
    });

    it('should escape special regex characters', () => {
      const fromUrl = 'https://example.com/page.html';
      const toUrl = 'https://example.com/new-page';
      const rule = fixer.generateRedirectRule(fromUrl, toUrl, 301);

      // The dot should be escaped
      expect(rule.pattern).toContain('\\.');
    });

    it('should support 302 redirects', () => {
      const fromUrl = 'https://example.com/old-page';
      const toUrl = 'https://example.com/new-page';
      const rule = fixer.generateRedirectRule(fromUrl, toUrl, 302);

      expect(rule.statusCode).toBe(302);
      expect(rule.rule).toContain('R=302');
    });
  });

  describe('escapeRegexPattern', () => {
    it('should escape dots', () => {
      const result = fixer.escapeRegexPattern('page.html');
      expect(result).toBe('page\\.html');
    });

    it('should escape asterisks', () => {
      const result = fixer.escapeRegexPattern('page*');
      expect(result).toBe('page\\*');
    });

    it('should escape plus signs', () => {
      const result = fixer.escapeRegexPattern('page+');
      expect(result).toBe('page\\+');
    });

    it('should escape question marks', () => {
      const result = fixer.escapeRegexPattern('page?');
      expect(result).toBe('page\\?');
    });

    it('should escape brackets', () => {
      const result = fixer.escapeRegexPattern('page[0-9]');
      expect(result).toBe('page\\[0-9\\]');
    });

    it('should handle multiple special characters', () => {
      const result = fixer.escapeRegexPattern('page.html?id=123');
      expect(result).toBe('page\\.html\\?id=123');
    });
  });

  describe('flattenRedirectChain', () => {
    it('should flatten redirect chain', () => {
      const chain = [
        'https://example.com/page1',
        'https://example.com/page2',
        'https://example.com/page3'
      ];

      const result = fixer.flattenRedirectChain(chain);

      expect(result).toBeDefined();
      expect(result.from).toBe('https://example.com/page1');
      expect(result.to).toBe('https://example.com/page3');
      expect(result.originalChainLength).toBe(3);
    });

    it('should return null for single URL', () => {
      const chain = ['https://example.com/page1'];
      const result = fixer.flattenRedirectChain(chain);
      expect(result).toBeNull();
    });

    it('should return null for empty chain', () => {
      const chain = [];
      const result = fixer.flattenRedirectChain(chain);
      expect(result).toBeNull();
    });
  });

  describe('validateRedirectRule', () => {
    it('should validate correct redirect rule', () => {
      const rule = {
        from: 'https://example.com/old-page',
        to: 'https://example.com/new-page',
        rule: 'RewriteRule ^old-page/?$ /new-page [R=301,L]'
      };

      const result = fixer.validateRedirectRule(rule);
      expect(result).toBe(true);
    });

    it('should reject rule with same from and to', () => {
      const rule = {
        from: 'https://example.com/page',
        to: 'https://example.com/page',
        rule: 'RewriteRule ^page/?$ /page [R=301,L]'
      };

      const result = fixer.validateRedirectRule(rule);
      expect(result).toBe(false);
    });

    it('should reject rule without RewriteRule', () => {
      const rule = {
        from: 'https://example.com/old-page',
        to: 'https://example.com/new-page',
        rule: 'Redirect 301 /old-page /new-page'
      };

      const result = fixer.validateRedirectRule(rule);
      expect(result).toBe(false);
    });

    it('should reject null rule', () => {
      const result = fixer.validateRedirectRule(null);
      expect(result).toBe(false);
    });

    it('should reject rule without rule property', () => {
      const rule = {
        from: 'https://example.com/old-page',
        to: 'https://example.com/new-page'
      };

      const result = fixer.validateRedirectRule(rule);
      expect(result).toBe(false);
    });
  });

  describe('getRedirectStatistics', () => {
    it('should calculate statistics correctly', () => {
      const issues = [
        {
          hasChain: true,
          chainLength: 3,
          isTemporary: true,
          isPermanent: false
        },
        {
          hasChain: false,
          chainLength: 1,
          isTemporary: false,
          isPermanent: true
        },
        {
          hasChain: true,
          chainLength: 5,
          isTemporary: true,
          isPermanent: false
        }
      ];

      const stats = fixer.getRedirectStatistics(issues);

      expect(stats.total).toBe(3);
      expect(stats.chains).toBe(2);
      expect(stats.temporary).toBe(2);
      expect(stats.permanent).toBe(1);
      expect(stats.longestChain).toBe(5);
      expect(stats.averageChainLength).toBe('3.00');
    });

    it('should handle empty issues array', () => {
      const stats = fixer.getRedirectStatistics([]);
      expect(stats.total).toBe(0);
      expect(stats.chains).toBe(0);
      expect(stats.temporary).toBe(0);
      expect(stats.permanent).toBe(0);
      expect(stats.longestChain).toBe(0);
      expect(stats.averageChainLength).toBe(0);
    });
  });

  describe('addRedirectRulesToContent', () => {
    it('should add rules after RewriteEngine On', () => {
      const content = 'RewriteEngine On\n\n# Other rules\nRewriteRule ^test$ /test [L]';
      const rules = [
        { rule: 'RewriteRule ^old-page/?$ /new-page [R=301,L]' }
      ];

      const result = fixer.addRedirectRulesToContent(content, rules);

      expect(result).toContain('RewriteEngine On');
      expect(result).toContain('# GSC Redirect fixes');
      expect(result).toContain('RewriteRule ^old-page/?$ /new-page [R=301,L]');
    });

    it('should add RewriteEngine On if missing', () => {
      const content = '# Some comment\n';
      const rules = [
        { rule: 'RewriteRule ^old-page/?$ /new-page [R=301,L]' }
      ];

      const result = fixer.addRedirectRulesToContent(content, rules);

      expect(result).toContain('RewriteEngine On');
      expect(result).toContain('# GSC Redirect fixes');
      expect(result).toContain('RewriteRule ^old-page/?$ /new-page [R=301,L]');
    });

    it('should not add duplicate rules', () => {
      const existingRule = 'RewriteRule ^old-page/?$ /new-page [R=301,L]';
      const content = `RewriteEngine On\n\n${existingRule}`;
      const rules = [
        { rule: existingRule }
      ];

      const result = fixer.addRedirectRulesToContent(content, rules);

      // Count occurrences of the rule
      const occurrences = (result.match(/RewriteRule \^old-page/g) || []).length;
      expect(occurrences).toBe(1);
    });

    it('should add multiple rules', () => {
      const content = 'RewriteEngine On\n';
      const rules = [
        { rule: 'RewriteRule ^page1/?$ /new1 [R=301,L]' },
        { rule: 'RewriteRule ^page2/?$ /new2 [R=301,L]' },
        { rule: 'RewriteRule ^page3/?$ /new3 [R=301,L]' }
      ];

      const result = fixer.addRedirectRulesToContent(content, rules);

      expect(result).toContain('RewriteRule ^page1/?$ /new1 [R=301,L]');
      expect(result).toContain('RewriteRule ^page2/?$ /new2 [R=301,L]');
      expect(result).toContain('RewriteRule ^page3/?$ /new3 [R=301,L]');
    });
  });
});

console.log('Unit tests defined. Run with: npm test test-redirect-unit.js');
