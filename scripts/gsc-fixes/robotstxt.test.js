import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import RobotsTxtManager from './RobotsTxtManager.js';

describe('RobotsTxtManager Unit Tests', () => {
  let logger;
  let errorHandler;
  let robotsManager;
  let testRobotsPath;
  let originalRobotsPath;
  
  beforeEach(async () => {
    // Initialize dependencies
    logger = new Logger('scripts/gsc-fixes/logs/test');
    await logger.initialize();
    
    errorHandler = new ErrorHandler(logger);
    await errorHandler.initialize();
    
    robotsManager = new RobotsTxtManager(logger, errorHandler);
    
    // Save original path and use test path
    originalRobotsPath = robotsManager.robotsPath;
    testRobotsPath = path.join(process.cwd(), 'scripts/gsc-fixes/test-robots.txt');
    robotsManager.robotsPath = testRobotsPath;
  });
  
  afterEach(async () => {
    // Clean up test file
    try {
      await fs.unlink(testRobotsPath);
    } catch (error) {
      // Ignore if file doesn't exist
    }
    
    // Restore original path
    robotsManager.robotsPath = originalRobotsPath;
  });
  
  describe('parseRobotsTxt', () => {
    it('should parse basic robots.txt', async () => {
      const content = `User-agent: *
Disallow: /admin/
Allow: /public/

Sitemap: https://example.com/sitemap.xml`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const parsed = await robotsManager.parseRobotsTxt();
      
      expect(parsed.userAgents).toHaveLength(1);
      expect(parsed.userAgents[0].agent).toBe('*');
      expect(parsed.userAgents[0].disallow).toContain('/admin/');
      expect(parsed.userAgents[0].allow).toContain('/public/');
      expect(parsed.sitemaps).toContain('https://example.com/sitemap.xml');
    });
    
    it('should parse multiple user agents', async () => {
      const content = `User-agent: *
Disallow: /admin/

User-agent: Googlebot
Disallow: /private/
Crawl-delay: 1`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const parsed = await robotsManager.parseRobotsTxt();
      
      expect(parsed.userAgents).toHaveLength(2);
      expect(parsed.userAgents[0].agent).toBe('*');
      expect(parsed.userAgents[1].agent).toBe('Googlebot');
      expect(parsed.userAgents[1].crawlDelay).toBe(1);
    });
    
    it('should handle missing file', async () => {
      const parsed = await robotsManager.parseRobotsTxt();
      
      expect(parsed.userAgents).toHaveLength(0);
      expect(parsed.sitemaps).toHaveLength(0);
      expect(parsed.raw).toBe('');
    });
    
    it('should ignore comments and empty lines', async () => {
      const content = `# This is a comment
User-agent: *

# Another comment
Disallow: /admin/

Sitemap: https://example.com/sitemap.xml`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const parsed = await robotsManager.parseRobotsTxt();
      
      expect(parsed.userAgents).toHaveLength(1);
      expect(parsed.userAgents[0].disallow).toHaveLength(1);
    });
  });
  
  describe('matchesPattern', () => {
    it('should match exact paths', () => {
      expect(robotsManager.matchesPattern('/admin/', '/admin/')).toBe(true);
      expect(robotsManager.matchesPattern('/admin/users', '/admin/')).toBe(true);
      expect(robotsManager.matchesPattern('/public/', '/admin/')).toBe(false);
    });
    
    it('should match wildcard patterns', () => {
      expect(robotsManager.matchesPattern('/admin/users.php', '/*.php')).toBe(true);
      expect(robotsManager.matchesPattern('/test.pdf', '/*.pdf')).toBe(true);
      expect(robotsManager.matchesPattern('/test.html', '/*.pdf')).toBe(false);
    });
    
    it('should match end-of-line patterns', () => {
      expect(robotsManager.matchesPattern('/private', '/private$')).toBe(true);
      expect(robotsManager.matchesPattern('/private/', '/private$')).toBe(false);
      expect(robotsManager.matchesPattern('/private/page', '/private$')).toBe(false);
    });
    
    it('should handle root disallow', () => {
      expect(robotsManager.matchesPattern('/anything', '/')).toBe(true);
      expect(robotsManager.matchesPattern('/admin/', '/')).toBe(true);
    });
    
    it('should handle empty pattern', () => {
      expect(robotsManager.matchesPattern('/anything', '')).toBe(false);
    });
  });
  
  describe('isPathBlocked', () => {
    it('should detect blocked paths', async () => {
      const content = `User-agent: *
Disallow: /admin/
Disallow: /private/`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const result1 = await robotsManager.isPathBlocked('/admin/users');
      expect(result1.blocked).toBe(true);
      expect(result1.pattern).toBe('/admin/');
      
      const result2 = await robotsManager.isPathBlocked('/public/page');
      expect(result2.blocked).toBe(false);
    });
    
    it('should respect allow rules', async () => {
      const content = `User-agent: *
Disallow: /admin/
Allow: /admin/public/`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const result1 = await robotsManager.isPathBlocked('/admin/public/page');
      expect(result1.blocked).toBe(false);
      expect(result1.reason).toBe('explicitly-allowed');
      
      const result2 = await robotsManager.isPathBlocked('/admin/private/page');
      expect(result2.blocked).toBe(true);
    });
    
    it('should handle no rules', async () => {
      const content = `User-agent: *
Disallow:`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const result = await robotsManager.isPathBlocked('/anything');
      expect(result.blocked).toBe(false);
    });
  });
  
  describe('getResourceType', () => {
    it('should identify stylesheets', () => {
      expect(robotsManager.getResourceType('/assets/main.css')).toBe('stylesheet');
    });
    
    it('should identify scripts', () => {
      expect(robotsManager.getResourceType('/assets/app.js')).toBe('script');
      expect(robotsManager.getResourceType('/src/main.jsx')).toBe('script');
    });
    
    it('should identify images', () => {
      expect(robotsManager.getResourceType('/images/logo.png')).toBe('image');
      expect(robotsManager.getResourceType('/photos/pic.jpg')).toBe('image');
      expect(robotsManager.getResourceType('/icon.svg')).toBe('image');
    });
    
    it('should identify fonts', () => {
      expect(robotsManager.getResourceType('/fonts/roboto.woff2')).toBe('font');
      expect(robotsManager.getResourceType('/fonts/arial.ttf')).toBe('font');
    });
    
    it('should return other for unknown types', () => {
      expect(robotsManager.getResourceType('/document.pdf')).toBe('other');
    });
  });
  
  describe('checkResourceBlocking', () => {
    it('should detect blocked resources', async () => {
      const content = `User-agent: Googlebot
Disallow: /assets/
Disallow: /*.css`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const resources = [
        '/assets/main.css',
        '/assets/app.js',
        '/images/logo.png',
        '/styles/theme.css'
      ];
      
      const blocked = await robotsManager.checkResourceBlocking(resources);
      
      expect(blocked.length).toBeGreaterThan(0);
      expect(blocked.some(r => r.path === '/assets/main.css')).toBe(true);
      expect(blocked.some(r => r.path === '/assets/app.js')).toBe(true);
    });
    
    it('should return empty array when no resources blocked', async () => {
      const content = `User-agent: *
Disallow: /admin/`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const resources = [
        '/assets/main.css',
        '/assets/app.js',
        '/images/logo.png'
      ];
      
      const blocked = await robotsManager.checkResourceBlocking(resources);
      
      expect(blocked).toHaveLength(0);
    });
  });
  
  describe('generateRobotsTxt', () => {
    it('should generate basic robots.txt', () => {
      const content = robotsManager.generateRobotsTxt({
        userAgents: [
          {
            agent: '*',
            disallow: ['/admin/'],
            allow: []
          }
        ],
        sitemaps: ['https://example.com/sitemap.xml']
      });
      
      expect(content).toContain('User-agent: *');
      expect(content).toContain('Disallow: /admin/');
      expect(content).toContain('Sitemap: https://example.com/sitemap.xml');
    });
    
    it('should include comments', () => {
      const content = robotsManager.generateRobotsTxt({
        userAgents: [{ agent: '*', disallow: [], allow: [] }],
        sitemaps: [],
        comments: ['Test comment', 'Another comment']
      });
      
      expect(content).toContain('# Test comment');
      expect(content).toContain('# Another comment');
    });
    
    it('should handle multiple user agents', () => {
      const content = robotsManager.generateRobotsTxt({
        userAgents: [
          { agent: '*', disallow: ['/admin/'], allow: [] },
          { agent: 'Googlebot', disallow: [], allow: [], crawlDelay: 1 }
        ],
        sitemaps: []
      });
      
      expect(content).toContain('User-agent: *');
      expect(content).toContain('User-agent: Googlebot');
      expect(content).toContain('Crawl-delay: 1');
    });
    
    it('should handle allow rules', () => {
      const content = robotsManager.generateRobotsTxt({
        userAgents: [
          {
            agent: '*',
            disallow: ['/admin/'],
            allow: ['/admin/public/']
          }
        ],
        sitemaps: []
      });
      
      expect(content).toContain('Allow: /admin/public/');
      expect(content).toContain('Disallow: /admin/');
    });
  });
  
  describe('validateSitemapDirective', () => {
    it('should detect missing sitemap', async () => {
      const content = `User-agent: *
Disallow: /admin/`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const validation = await robotsManager.validateSitemapDirective();
      
      expect(validation.valid).toBe(false);
      expect(validation.issues.some(i => i.issue === 'missing-sitemap')).toBe(true);
    });
    
    it('should validate correct sitemap', async () => {
      const content = `User-agent: *
Disallow: /admin/

Sitemap: https://www.scrapiz.in/sitemap.xml`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const validation = await robotsManager.validateSitemapDirective(
        'https://www.scrapiz.in/sitemap.xml'
      );
      
      expect(validation.valid).toBe(true);
      expect(validation.sitemaps).toContain('https://www.scrapiz.in/sitemap.xml');
    });
    
    it('should detect incorrect sitemap', async () => {
      const content = `User-agent: *
Disallow: /admin/

Sitemap: https://wrong.com/sitemap.xml`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const validation = await robotsManager.validateSitemapDirective(
        'https://www.scrapiz.in/sitemap.xml'
      );
      
      expect(validation.valid).toBe(false);
      expect(validation.issues.some(i => i.issue === 'incorrect-sitemap')).toBe(true);
    });
  });
  
  describe('validateRobotsTxt', () => {
    it('should validate correct robots.txt', async () => {
      const content = `User-agent: *
Disallow: /admin/

Sitemap: https://www.scrapiz.in/sitemap.xml`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const validation = await robotsManager.validateRobotsTxt();
      
      expect(validation.valid).toBe(true);
      expect(validation.userAgents).toBe(1);
      expect(validation.sitemaps).toBe(1);
    });
    
    it('should detect missing sitemap', async () => {
      const content = `User-agent: *
Disallow: /admin/`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const validation = await robotsManager.validateRobotsTxt();
      
      expect(validation.valid).toBe(false);
      expect(validation.issues.some(i => i.issue === 'no-sitemap')).toBe(true);
    });
    
    it('should detect blocked important resources', async () => {
      const content = `User-agent: Googlebot
Disallow: /assets/

Sitemap: https://www.scrapiz.in/sitemap.xml`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const validation = await robotsManager.validateRobotsTxt();
      
      expect(validation.valid).toBe(false);
      expect(validation.issues.some(i => i.issue === 'important-resources-blocked')).toBe(true);
    });
    
    it('should detect overly broad disallow', async () => {
      const content = `User-agent: *
Disallow: /

Sitemap: https://www.scrapiz.in/sitemap.xml`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const validation = await robotsManager.validateRobotsTxt();
      
      expect(validation.valid).toBe(false);
      expect(validation.issues.some(i => i.issue === 'blocks-all-content')).toBe(true);
    });
  });
  
  describe('getStatistics', () => {
    it('should return correct statistics', async () => {
      const content = `User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /public/

User-agent: Googlebot
Disallow: /test/

Sitemap: https://www.scrapiz.in/sitemap.xml`;
      
      await fs.writeFile(testRobotsPath, content);
      
      const stats = await robotsManager.getStatistics();
      
      expect(stats.exists).toBe(true);
      expect(stats.userAgents).toBe(2);
      expect(stats.sitemaps).toBe(1);
      expect(stats.totalDisallowRules).toBe(3);
      expect(stats.totalAllowRules).toBe(1);
      expect(stats.byUserAgent['*']).toBeDefined();
      expect(stats.byUserAgent['*'].disallow).toBe(2);
      expect(stats.byUserAgent['*'].allow).toBe(1);
    });
    
    it('should handle missing file', async () => {
      const stats = await robotsManager.getStatistics();
      
      expect(stats.exists).toBe(false);
      expect(stats.userAgents).toBe(0);
      expect(stats.sitemaps).toBe(0);
    });
  });
});
