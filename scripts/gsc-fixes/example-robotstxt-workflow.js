import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import RobotsTxtManager from './RobotsTxtManager.js';

/**
 * Example workflow for using RobotsTxtManager
 * Demonstrates common use cases and best practices
 */

async function main() {
  // Initialize dependencies
  const logger = new Logger();
  await logger.initialize();
  
  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();
  
  const robotsManager = new RobotsTxtManager(logger, errorHandler);
  
  console.log('=== Robots.txt Manager Workflow ===\n');
  
  // 1. Parse current robots.txt
  console.log('1. Parsing current robots.txt...');
  const parsed = await robotsManager.parseRobotsTxt();
  console.log(`   Found ${parsed.userAgents.length} user agent(s)`);
  console.log(`   Found ${parsed.sitemaps.length} sitemap(s)`);
  console.log('');
  
  // 2. Validate robots.txt
  console.log('2. Validating robots.txt...');
  const validation = await robotsManager.validateRobotsTxt();
  console.log(`   Valid: ${validation.valid}`);
  
  if (!validation.valid) {
    console.log('   Issues found:');
    validation.issues.forEach(issue => {
      console.log(`   - [${issue.severity}] ${issue.message}`);
    });
  }
  console.log('');
  
  // 3. Check if important resources are blocked
  console.log('3. Checking resource blocking...');
  const importantResources = [
    '/assets/main.css',
    '/assets/app.js',
    '/images/logo.png',
    '/fonts/roboto.woff2',
    '/public/favicon.svg'
  ];
  
  const blockedResources = await robotsManager.checkResourceBlocking(importantResources);
  
  if (blockedResources.length > 0) {
    console.log(`   ⚠️  Found ${blockedResources.length} blocked resource(s):`);
    blockedResources.forEach(resource => {
      console.log(`   - ${resource.path} (${resource.type})`);
      console.log(`     Blocked by pattern: ${resource.pattern}`);
    });
    
    // Unblock them
    console.log('   Unblocking resources...');
    const unblockResult = await robotsManager.unblockResources(
      blockedResources.map(r => r.path)
    );
    console.log(`   Result: ${unblockResult.action}`);
  } else {
    console.log('   ✓ No important resources are blocked');
  }
  console.log('');
  
  // 4. Validate sitemap directive
  console.log('4. Validating sitemap directive...');
  const sitemapValidation = await robotsManager.validateSitemapDirective(
    'https://www.scrapiz.in/sitemap.xml'
  );
  
  if (!sitemapValidation.valid) {
    console.log('   ⚠️  Sitemap directive issues:');
    sitemapValidation.issues.forEach(issue => {
      console.log(`   - [${issue.severity}] ${issue.message}`);
    });
    
    // Add sitemap if missing
    if (sitemapValidation.issues.some(i => i.issue === 'missing-sitemap')) {
      console.log('   Adding sitemap directive...');
      const updateResult = await robotsManager.updateSitemapDirective(
        'https://www.scrapiz.in/sitemap.xml'
      );
      console.log(`   Result: ${updateResult.action}`);
    }
  } else {
    console.log('   ✓ Sitemap directive is valid');
    console.log(`   Sitemaps: ${sitemapValidation.sitemaps.join(', ')}`);
  }
  console.log('');
  
  // 5. Check specific paths
  console.log('5. Checking specific paths...');
  const pathsToCheck = [
    '/admin/',
    '/api/private/',
    '/services/scrap-collection',
    '/assets/main.css'
  ];
  
  for (const path of pathsToCheck) {
    const result = await robotsManager.isPathBlocked(path, 'Googlebot');
    const status = result.blocked ? '❌ BLOCKED' : '✓ ALLOWED';
    console.log(`   ${status}: ${path}`);
    if (result.blocked) {
      console.log(`              Pattern: ${result.pattern}`);
    }
  }
  console.log('');
  
  // 6. Get statistics
  console.log('6. Getting statistics...');
  const stats = await robotsManager.getStatistics();
  console.log(`   File exists: ${stats.exists}`);
  console.log(`   User agents: ${stats.userAgents}`);
  console.log(`   Sitemaps: ${stats.sitemaps}`);
  console.log(`   Total disallow rules: ${stats.totalDisallowRules}`);
  console.log(`   Total allow rules: ${stats.totalAllowRules}`);
  
  if (Object.keys(stats.byUserAgent).length > 0) {
    console.log('   By user agent:');
    Object.entries(stats.byUserAgent).forEach(([agent, agentStats]) => {
      console.log(`   - ${agent}:`);
      console.log(`     Disallow: ${agentStats.disallow}, Allow: ${agentStats.allow}`);
      if (agentStats.crawlDelay) {
        console.log(`     Crawl-delay: ${agentStats.crawlDelay}`);
      }
    });
  }
  console.log('');
  
  // 7. Generate optimized robots.txt (example)
  console.log('7. Example: Generate optimized robots.txt');
  const optimizedContent = robotsManager.generateRobotsTxt({
    userAgents: [
      {
        agent: '*',
        disallow: ['/admin/', '/api/private/'],
        allow: ['/api/public/']
      },
      {
        agent: 'Googlebot',
        disallow: [],
        crawlDelay: null
      }
    ],
    sitemaps: [
      'https://www.scrapiz.in/sitemap.xml'
    ],
    comments: [
      'Robots.txt for Scrapiz',
      'Optimized for search engine crawling'
    ]
  });
  
  console.log('   Generated content:');
  console.log('   ---');
  console.log(optimizedContent.split('\n').map(line => `   ${line}`).join('\n'));
  console.log('   ---');
  console.log('');
  
  // 8. Final validation
  console.log('8. Final validation...');
  const finalValidation = await robotsManager.validateRobotsTxt();
  
  if (finalValidation.valid) {
    console.log('   ✓ Robots.txt is valid and optimized!');
  } else {
    console.log('   ⚠️  Some issues remain:');
    finalValidation.issues.forEach(issue => {
      console.log(`   - [${issue.severity}] ${issue.message}`);
    });
  }
  
  console.log('\n=== Workflow Complete ===');
}

// Run the workflow
main().catch(error => {
  console.error('Workflow failed:', error);
  process.exit(1);
});
