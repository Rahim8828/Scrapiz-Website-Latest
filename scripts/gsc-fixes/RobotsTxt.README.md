# Robots.txt Manager

## Overview

The RobotsTxtManager module provides comprehensive functionality for managing, parsing, validating, and generating robots.txt files. It ensures that search engines can properly crawl your website while protecting important resources.

## Features

- **Parse robots.txt**: Extract and structure all directives from robots.txt
- **Path Blocking Check**: Determine if specific paths are blocked for crawlers
- **Resource Blocking Detection**: Identify blocked CSS, JS, and image resources
- **Sitemap Directive Validation**: Ensure sitemap is properly declared
- **Robots.txt Generation**: Create properly formatted robots.txt files
- **Validation**: Comprehensive validation of robots.txt structure and rules

## Requirements Addressed

- **Requirement 10.4**: Ensure robots.txt does not block important resources (CSS, JS, images)
- **Requirement 10.5**: Ensure robots.txt includes sitemap location

## Usage

### Basic Setup

```javascript
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import RobotsTxtManager from './RobotsTxtManager.js';

// Initialize dependencies
const logger = new Logger();
await logger.initialize();

const errorHandler = new ErrorHandler(logger);
await errorHandler.initialize();

// Create manager
const robotsManager = new RobotsTxtManager(logger, errorHandler);
```

### Parse Robots.txt

```javascript
const parsed = await robotsManager.parseRobotsTxt();

console.log('User Agents:', parsed.userAgents);
console.log('Sitemaps:', parsed.sitemaps);

// Example output:
// {
//   userAgents: [
//     {
//       agent: '*',
//       disallow: ['/admin/', '/private/'],
//       allow: ['/public/'],
//       crawlDelay: null
//     }
//   ],
//   sitemaps: ['https://www.scrapiz.in/sitemap.xml'],
//   raw: '...'
// }
```

### Check if Path is Blocked

```javascript
// Check if a specific path is blocked
const result = await robotsManager.isPathBlocked('/assets/style.css', 'Googlebot');

if (result.blocked) {
  console.log(`Path is blocked: ${result.reason}`);
  console.log(`Matching pattern: ${result.pattern}`);
} else {
  console.log('Path is allowed');
}
```

### Check Resource Blocking

```javascript
// Check if important resources are blocked
const resources = [
  '/assets/main.css',
  '/assets/app.js',
  '/images/logo.png',
  '/fonts/roboto.woff2'
];

const blocked = await robotsManager.checkResourceBlocking(resources);

if (blocked.length > 0) {
  console.log('Blocked resources found:');
  blocked.forEach(resource => {
    console.log(`- ${resource.path} (${resource.type})`);
    console.log(`  Blocked by: ${resource.pattern}`);
  });
}
```

### Validate Sitemap Directive

```javascript
// Validate that sitemap directive exists and is correct
const validation = await robotsManager.validateSitemapDirective(
  'https://www.scrapiz.in/sitemap.xml'
);

if (!validation.valid) {
  console.log('Sitemap directive issues:');
  validation.issues.forEach(issue => {
    console.log(`- ${issue.severity}: ${issue.message}`);
  });
}
```

### Generate Robots.txt

```javascript
// Generate a new robots.txt file
const content = robotsManager.generateRobotsTxt({
  userAgents: [
    {
      agent: '*',
      disallow: ['/admin/', '/private/'],
      allow: ['/public/']
    },
    {
      agent: 'Googlebot',
      disallow: [],
      crawlDelay: 1
    }
  ],
  sitemaps: [
    'https://www.scrapiz.in/sitemap.xml'
  ],
  comments: [
    'Robots.txt for Scrapiz',
    'Updated: 2025-01-01'
  ]
});

console.log(content);
// Output:
// # Robots.txt for Scrapiz
// # Updated: 2025-01-01
//
// User-agent: *
// Allow: /public/
// Disallow: /admin/
// Disallow: /private/
//
// User-agent: Googlebot
// Disallow:
// Crawl-delay: 1
//
// Sitemap: https://www.scrapiz.in/sitemap.xml
```

### Write Robots.txt

```javascript
// Write generated content to file (with automatic backup)
await robotsManager.writeRobotsTxt(content);
```

### Update Sitemap Directive

```javascript
// Add or update sitemap directive
const result = await robotsManager.updateSitemapDirective(
  'https://www.scrapiz.in/sitemap.xml'
);

console.log(result.action); // 'added' or 'no-change'
```

### Unblock Resources

```javascript
// Remove blocking rules for important resources
const result = await robotsManager.unblockResources([
  '/assets/',
  '/images/',
  '/*.css',
  '/*.js'
]);

if (result.action === 'modified') {
  console.log('Blocking rules removed successfully');
}
```

### Validate Robots.txt

```javascript
// Comprehensive validation
const validation = await robotsManager.validateRobotsTxt();

if (!validation.valid) {
  console.log('Validation issues:');
  validation.issues.forEach(issue => {
    console.log(`[${issue.severity}] ${issue.message}`);
  });
}

// Check specific aspects
console.log(`User agents: ${validation.userAgents}`);
console.log(`Sitemaps: ${validation.sitemaps}`);
```

### Get Statistics

```javascript
// Get robots.txt statistics
const stats = await robotsManager.getStatistics();

console.log('Statistics:', {
  exists: stats.exists,
  userAgents: stats.userAgents,
  sitemaps: stats.sitemaps,
  totalDisallowRules: stats.totalDisallowRules,
  totalAllowRules: stats.totalAllowRules
});

// Per user-agent stats
Object.entries(stats.byUserAgent).forEach(([agent, agentStats]) => {
  console.log(`${agent}:`, agentStats);
});
```

## Pattern Matching

The module supports robots.txt pattern matching:

- `*` - Matches any sequence of characters
- `$` - Matches end of URL
- `/path/` - Matches URLs starting with /path/

Examples:
```javascript
// Matches /admin/users, /admin/settings, etc.
Disallow: /admin/

// Matches only /private (not /private/page)
Disallow: /private$

// Matches any .pdf file
Disallow: /*.pdf$

// Matches everything
Disallow: /
```

## Common Use Cases

### 1. Ensure Resources Are Not Blocked

```javascript
const resources = [
  '/assets/main.css',
  '/assets/app.js',
  '/images/',
  '/fonts/'
];

const blocked = await robotsManager.checkResourceBlocking(resources);

if (blocked.length > 0) {
  // Unblock them
  await robotsManager.unblockResources(
    blocked.map(r => r.path)
  );
}
```

### 2. Add Sitemap if Missing

```javascript
const validation = await robotsManager.validateSitemapDirective();

if (!validation.valid) {
  await robotsManager.updateSitemapDirective(
    'https://www.scrapiz.in/sitemap.xml'
  );
}
```

### 3. Create Standard Robots.txt

```javascript
const content = robotsManager.generateRobotsTxt({
  userAgents: [
    {
      agent: '*',
      disallow: ['/admin/', '/api/private/'],
      allow: []
    }
  ],
  sitemaps: ['https://www.scrapiz.in/sitemap.xml'],
  comments: ['Standard robots.txt configuration']
});

await robotsManager.writeRobotsTxt(content);
```

### 4. Audit Current Robots.txt

```javascript
// Get full validation report
const validation = await robotsManager.validateRobotsTxt();

// Get statistics
const stats = await robotsManager.getStatistics();

// Generate report
console.log('=== Robots.txt Audit ===');
console.log(`Valid: ${validation.valid}`);
console.log(`User Agents: ${stats.userAgents}`);
console.log(`Sitemaps: ${stats.sitemaps}`);
console.log(`Total Rules: ${stats.totalDisallowRules + stats.totalAllowRules}`);

if (!validation.valid) {
  console.log('\nIssues:');
  validation.issues.forEach(issue => {
    console.log(`- [${issue.severity}] ${issue.message}`);
  });
}
```

## Error Handling

The module uses the ErrorHandler for backup and rollback:

```javascript
try {
  await robotsManager.writeRobotsTxt(content);
} catch (error) {
  // Automatic rollback occurs
  console.error('Failed to write robots.txt:', error.message);
}
```

## Best Practices

1. **Always validate before writing**: Use `validateRobotsTxt()` to check for issues
2. **Don't block resources**: Ensure CSS, JS, and images are not blocked
3. **Include sitemap**: Always include a Sitemap directive
4. **Use specific rules**: Avoid overly broad `Disallow: /` rules
5. **Test patterns**: Use `isPathBlocked()` to test your rules
6. **Regular audits**: Periodically validate your robots.txt

## Integration with Other Modules

```javascript
// Use with SitemapManager
const sitemapManager = new SitemapManager(logger, errorHandler);
const sitemap = await sitemapManager.parseSitemap();

// Ensure robots.txt references the sitemap
await robotsManager.updateSitemapDirective(
  'https://www.scrapiz.in/sitemap.xml'
);

// Use with IssueDetector
const issueDetector = new IssueDetector(logger);
const pages = await issueDetector.getAllPages();

// Check if any pages are blocked
for (const page of pages) {
  const url = new URL(page.url);
  const result = await robotsManager.isPathBlocked(url.pathname);
  
  if (result.blocked) {
    console.log(`Page blocked: ${page.url}`);
  }
}
```

## API Reference

### Constructor
- `new RobotsTxtManager(logger, errorHandler)`

### Methods

#### Parsing
- `parseRobotsTxt()` - Parse robots.txt file
- `extractUrls(parsedSitemap)` - Extract URLs from parsed sitemap

#### Validation
- `isPathBlocked(urlPath, userAgent)` - Check if path is blocked
- `matchesPattern(urlPath, pattern)` - Check if URL matches pattern
- `checkResourceBlocking(resourcePaths)` - Check blocked resources
- `validateSitemapDirective(expectedSitemapUrl)` - Validate sitemap directive
- `validateRobotsTxt()` - Comprehensive validation

#### Generation
- `generateRobotsTxt(config)` - Generate robots.txt content
- `writeRobotsTxt(content)` - Write robots.txt file

#### Modification
- `updateSitemapDirective(sitemapUrl)` - Add/update sitemap
- `unblockResources(resourcePatterns)` - Remove blocking rules

#### Utilities
- `getResourceType(path)` - Get resource type from path
- `getStatistics()` - Get robots.txt statistics

## Logging

All operations are logged:

```javascript
// Info logs
logger.info('Parsing robots.txt file');
logger.info('Robots.txt parsed successfully');

// Warning logs
logger.warn('Robots.txt file not found');

// Error logs
logger.error('Failed to parse robots.txt', { error: error.message });
```

## Testing

See `test-robotstxt-unit.js` for unit tests covering:
- Parsing various robots.txt formats
- Pattern matching
- Resource blocking detection
- Sitemap directive validation
- Generation and validation
