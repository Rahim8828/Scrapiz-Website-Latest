/**
 * Integration Tests for Redirect Detection and Fixing
 * 
 * These tests verify the complete workflow of detecting and fixing redirect issues.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import RedirectDetector from './RedirectDetector.js';
import RedirectFixer from './RedirectFixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

describe('Redirect Integration Tests', () => {
  let logger;
  let errorHandler;
  let detector;
  let fixer;
  let testHtaccessPath;

  beforeEach(async () => {
    logger = new Logger();
    errorHandler = new ErrorHandler(logger);
    detector = new RedirectDetector(logger, errorHandler);
    fixer = new RedirectFixer(logger, errorHandler);

    // Create a test .htaccess file
    testHtaccessPath = path.join(process.cwd(), 'scripts/gsc-fixes/test.htaccess');
    await fs.writeFile(testHtaccessPath, 'RewriteEngine On\n\n', 'utf-8');
  });

  afterEach(async () => {
    // Clean up test files
    try {
      await fs.unlink(testHtaccessPath);
      // Clean up any backup files
      const files = await fs.readdir(path.dirname(testHtaccessPath));
      for (const file of files) {
        if (file.startsWith('test.htaccess.backup')) {
          await fs.unlink(path.join(path.dirname(testHtaccessPath), file));
        }
      }
    } catch (error) {
      // Ignore errors during cleanup
    }
  });

  describe('Complete Workflow', () => {
    it('should detect and fix redirect issues (dry run)', async () => {
      // Create mock redirect issues
      const issues = [
        {
          url: 'https://example.com/old-page',
          redirectChain: [
            'https://example.com/old-page',
            'https://example.com/temp-page',
            'https://example.com/new-page'
          ],
          finalDestination: 'https://example.com/new-page',
          redirectType: 302,
          redirectTypeName: '302 Found',
          isPermanent: false,
          isTemporary: true,
          hasChain: true,
          chainLength: 3
        }
      ];

      // Fix issues in dry run mode
      const result = await fixer.fixRedirectIssues(issues, {
        dryRun: true,
        flattenChains: true,
        convertToPermament: true,
        updateHtaccess: false
      });

      expect(result.success).toBe(true);
      expect(result.issuesFixed).toBe(1);
      expect(result.issuesFailed).toBe(0);
      expect(result.details).toHaveLength(1);
      expect(result.details[0].status).toBe('dry-run');
      expect(result.details[0].redirectRule).toBeDefined();
    });

    it('should generate correct redirect rules for chains', async () => {
      const issues = [
        {
          url: 'https://example.com/page1',
          redirectChain: [
            'https://example.com/page1',
            'https://example.com/page2',
            'https://example.com/page3'
          ],
          finalDestination: 'https://example.com/page3',
          redirectType: 301,
          isPermanent: true,
          isTemporary: false,
          hasChain: true,
          chainLength: 3
        }
      ];

      const result = await fixer.fixRedirectIssues(issues, {
        dryRun: true,
        flattenChains: true,
        convertToPermament: true,
        updateHtaccess: false
      });

      expect(result.redirectRules).toHaveLength(1);
      const rule = result.redirectRules[0];
      expect(rule.from).toBe('https://example.com/page1');
      expect(rule.to).toBe('https://example.com/page3');
      expect(rule.statusCode).toBe(301);
      expect(rule.rule).toContain('RewriteRule');
      expect(rule.rule).toContain('R=301');
    });

    it('should convert temporary redirects to permanent', async () => {
      const issues = [
        {
          url: 'https://example.com/temp-page',
          redirectChain: [
            'https://example.com/temp-page',
            'https://example.com/new-page'
          ],
          finalDestination: 'https://example.com/new-page',
          redirectType: 302,
          isPermanent: false,
          isTemporary: true,
          hasChain: false,
          chainLength: 1
        }
      ];

      const result = await fixer.fixRedirectIssues(issues, {
        dryRun: true,
        flattenChains: true,
        convertToPermament: true,
        updateHtaccess: false
      });

      expect(result.redirectRules).toHaveLength(1);
      const rule = result.redirectRules[0];
      expect(rule.statusCode).toBe(301);
      expect(rule.rule).toContain('R=301');
    });

    it('should handle multiple redirect issues', async () => {
      const issues = [
        {
          url: 'https://example.com/page1',
          redirectChain: ['https://example.com/page1', 'https://example.com/new1'],
          finalDestination: 'https://example.com/new1',
          redirectType: 302,
          isPermanent: false,
          isTemporary: true,
          hasChain: false,
          chainLength: 1
        },
        {
          url: 'https://example.com/page2',
          redirectChain: ['https://example.com/page2', 'https://example.com/temp2', 'https://example.com/new2'],
          finalDestination: 'https://example.com/new2',
          redirectType: 301,
          isPermanent: true,
          isTemporary: false,
          hasChain: true,
          chainLength: 3
        },
        {
          url: 'https://example.com/page3',
          redirectChain: ['https://example.com/page3', 'https://example.com/new3'],
          finalDestination: 'https://example.com/new3',
          redirectType: 307,
          isPermanent: false,
          isTemporary: true,
          hasChain: false,
          chainLength: 1
        }
      ];

      const result = await fixer.fixRedirectIssues(issues, {
        dryRun: true,
        flattenChains: true,
        convertToPermament: true,
        updateHtaccess: false
      });

      expect(result.issuesFixed).toBe(3);
      expect(result.redirectRules).toHaveLength(3);
    });

    it('should calculate statistics correctly', async () => {
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
      expect(parseFloat(stats.averageChainLength)).toBeCloseTo(3.0, 1);
    });

    it('should analyze redirect patterns', async () => {
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
        }
      ];

      const analysis = detector.analyzeRedirectPatterns(issues);

      expect(analysis.totalRedirects).toBe(2);
      expect(analysis.redirectChains).toBe(1);
      expect(analysis.temporaryRedirects).toBe(1);
      expect(analysis.permanentRedirects).toBe(1);
      expect(analysis.redirectsByType['302 Found']).toBe(1);
      expect(analysis.redirectsByType['301 Moved Permanently']).toBe(1);
    });
  });

  describe('Htaccess Content Manipulation', () => {
    it('should add redirect rules to htaccess content', () => {
      const content = 'RewriteEngine On\n\n# Other rules\n';
      const rules = [
        { rule: 'RewriteRule ^old-page/?$ /new-page [R=301,L]' },
        { rule: 'RewriteRule ^another-old/?$ /another-new [R=301,L]' }
      ];

      const result = fixer.addRedirectRulesToContent(content, rules);

      expect(result).toContain('RewriteEngine On');
      expect(result).toContain('# GSC Redirect fixes');
      expect(result).toContain('RewriteRule ^old-page/?$ /new-page [R=301,L]');
      expect(result).toContain('RewriteRule ^another-old/?$ /another-new [R=301,L]');
    });

    it('should not add duplicate rules', () => {
      const existingRule = 'RewriteRule ^old-page/?$ /new-page [R=301,L]';
      const content = `RewriteEngine On\n\n${existingRule}\n`;
      const rules = [
        { rule: existingRule }
      ];

      const result = fixer.addRedirectRulesToContent(content, rules);

      // Count occurrences
      const matches = result.match(/RewriteRule \^old-page/g);
      expect(matches).toHaveLength(1);
    });

    it('should add RewriteEngine On if missing', () => {
      const content = '# Some comment\n';
      const rules = [
        { rule: 'RewriteRule ^old-page/?$ /new-page [R=301,L]' }
      ];

      const result = fixer.addRedirectRulesToContent(content, rules);

      expect(result).toContain('RewriteEngine On');
      expect(result).toContain('RewriteRule ^old-page/?$ /new-page [R=301,L]');
    });
  });

  describe('Redirect Rule Generation', () => {
    it('should generate valid redirect rules', () => {
      const testCases = [
        {
          from: 'https://example.com/old-page',
          to: 'https://example.com/new-page',
          expected: 'RewriteRule ^old-page/?$ /new-page [R=301,L]'
        },
        {
          from: 'https://example.com/old/path/page',
          to: 'https://example.com/new/path/page',
          expected: 'RewriteRule ^old/path/page/?$ /new/path/page [R=301,L]'
        },
        {
          from: 'https://example.com/page.html',
          to: 'https://example.com/page',
          expected: 'RewriteRule ^page\\.html/?$ /page [R=301,L]'
        }
      ];

      testCases.forEach(({ from, to, expected }) => {
        const rule = fixer.generateRedirectRule(from, to, 301);
        expect(rule.rule).toBe(expected);
      });
    });

    it('should validate redirect rules correctly', () => {
      const validRule = {
        from: 'https://example.com/old-page',
        to: 'https://example.com/new-page',
        rule: 'RewriteRule ^old-page/?$ /new-page [R=301,L]'
      };

      const invalidRule1 = {
        from: 'https://example.com/page',
        to: 'https://example.com/page',
        rule: 'RewriteRule ^page/?$ /page [R=301,L]'
      };

      const invalidRule2 = {
        from: 'https://example.com/old-page',
        to: 'https://example.com/new-page',
        rule: 'Redirect 301 /old-page /new-page'
      };

      expect(fixer.validateRedirectRule(validRule)).toBe(true);
      expect(fixer.validateRedirectRule(invalidRule1)).toBe(false);
      expect(fixer.validateRedirectRule(invalidRule2)).toBe(false);
    });
  });

  describe('Redirect Chain Flattening', () => {
    it('should flatten redirect chains correctly', () => {
      const testCases = [
        {
          chain: ['https://example.com/a', 'https://example.com/b', 'https://example.com/c'],
          expected: { from: 'https://example.com/a', to: 'https://example.com/c', originalChainLength: 3 }
        },
        {
          chain: ['https://example.com/1', 'https://example.com/2', 'https://example.com/3', 'https://example.com/4'],
          expected: { from: 'https://example.com/1', to: 'https://example.com/4', originalChainLength: 4 }
        }
      ];

      testCases.forEach(({ chain, expected }) => {
        const result = fixer.flattenRedirectChain(chain);
        expect(result).toEqual(expected);
      });
    });

    it('should return null for single URL chains', () => {
      const result = fixer.flattenRedirectChain(['https://example.com/page']);
      expect(result).toBeNull();
    });

    it('should return null for empty chains', () => {
      const result = fixer.flattenRedirectChain([]);
      expect(result).toBeNull();
    });
  });

  describe('URL Resolution', () => {
    it('should resolve absolute URLs', () => {
      const result = detector.resolveRedirectUrl(
        'https://example.com/page1',
        'https://example.com/page2'
      );
      expect(result).toBe('https://example.com/page2');
    });

    it('should resolve absolute paths', () => {
      const result = detector.resolveRedirectUrl(
        'https://example.com/old/page',
        '/new/page'
      );
      expect(result).toBe('https://example.com/new/page');
    });

    it('should resolve relative paths', () => {
      const result = detector.resolveRedirectUrl(
        'https://example.com/old/page1',
        'page2'
      );
      expect(result).toBe('https://example.com/old/page2');
    });

    it('should resolve protocol-relative URLs', () => {
      const result = detector.resolveRedirectUrl(
        'https://example.com/page',
        '//cdn.example.com/page'
      );
      expect(result).toBe('https://cdn.example.com/page');
    });
  });
});

console.log('Integration tests defined. Run with: npm test test-redirect-integration.js');
