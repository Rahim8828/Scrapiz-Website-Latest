# Robots.txt Manager - Quick Start Guide

## Installation

No additional dependencies required. Uses built-in Node.js modules.

## Basic Setup

```javascript
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import RobotsTxtManager from './RobotsTxtManager.js';

const logger = new Logger();
await logger.initialize();

const errorHandler = new ErrorHandler(logger);
await errorHandler.initialize();

const robotsManager = new RobotsTxtManager(logger, errorHandler);
```

## Common Tasks

### 1. Check if Resources Are Blocked

```javascript
const resources = [
  '/assets/main.css',
  '/assets/app.js',
  '/images/logo.png'
];

const blocked = await robotsManager.checkResourceBlocking(resources);

if (blocked.length > 0) {
  console.log('Blocked resources:', blocked);
  
  // Unblock them
  await robotsManager.unblockResources(blocked.map(r => r.path));
}
```

### 2. Validate Sitemap Directive

```javascript
const validation = await robotsManager.validateSitemapDirective(
  'https://www.scrapiz.in/sitemap.xml'
);

if (!validation.valid) {
  // Add sitemap
  await robotsManager.updateSitemapDirective(
    'https://www.scrapiz.in/sitemap.xml'
  );
}
```

### 3. Check if Specific Path is Blocked

```javascript
const result = await robotsManager.isPathBlocked('/admin/users', 'Googlebot');

if (result.blocked) {
  console.log(`Blocked by: ${result.pattern}`);
} else {
  console.log('Path is allowed');
}
```

### 4. Validate Entire Robots.txt

```javascript
const validation = await robotsManager.validateRobotsTxt();

if (!validation.valid) {
  console.log('Issues found:');
  validation.issues.forEach(issue => {
    console.log(`[${issue.severity}] ${issue.message}`);
  });
}
```

### 5. Generate New Robots.txt

```javascript
const content = robotsManager.generateRobotsTxt({
  userAgents: [
    {
      agent: '*',
      disallow: ['/admin/', '/private/'],
      allow: ['/public/']
    }
  ],
  sitemaps: ['https://www.scrapiz.in/sitemap.xml'],
  comments: ['Robots.txt for Scrapiz']
});

await robotsManager.writeRobotsTxt(content);
```

### 6. Get Statistics

```javascript
const stats = await robotsManager.getStatistics();

console.log(`User agents: ${stats.userAgents}`);
console.log(`Sitemaps: ${stats.sitemaps}`);
console.log(`Total rules: ${stats.totalDisallowRules + stats.totalAllowRules}`);
```

## Complete Workflow

```javascript
// 1. Parse current robots.txt
const parsed = await robotsManager.parseRobotsTxt();

// 2. Validate
const validation = await robotsManager.validateRobotsTxt();

// 3. Check resources
const resources = ['/assets/', '/images/', '/*.css', '/*.js'];
const blocked = await robotsManager.checkResourceBlocking(resources);

// 4. Fix issues
if (blocked.length > 0) {
  await robotsManager.unblockResources(blocked.map(r => r.path));
}

// 5. Ensure sitemap
const sitemapValidation = await robotsManager.validateSitemapDirective();
if (!sitemapValidation.valid) {
  await robotsManager.updateSitemapDirective(
    'https://www.scrapiz.in/sitemap.xml'
  );
}

// 6. Final validation
const finalValidation = await robotsManager.validateRobotsTxt();
console.log('Valid:', finalValidation.valid);
```

## Pattern Examples

```javascript
// Block admin directory
Disallow: /admin/

// Block all PDF files
Disallow: /*.pdf$

// Block everything
Disallow: /

// Allow specific subdirectory
Allow: /admin/public/
Disallow: /admin/

// Block with wildcard
Disallow: /temp*
```

## Testing Patterns

```javascript
// Test if pattern matches
const matches = robotsManager.matchesPattern('/admin/users', '/admin/');
console.log(matches); // true

// Test various patterns
const patterns = [
  { path: '/admin/users', pattern: '/admin/', expected: true },
  { path: '/test.pdf', pattern: '/*.pdf$', expected: true },
  { path: '/public/', pattern: '/admin/', expected: false }
];

patterns.forEach(({ path, pattern, expected }) => {
  const result = robotsManager.matchesPattern(path, pattern);
  console.log(`${path} vs ${pattern}: ${result === expected ? '✓' : '✗'}`);
});
```

## Error Handling

```javascript
try {
  await robotsManager.writeRobotsTxt(content);
  console.log('Success!');
} catch (error) {
  console.error('Failed:', error.message);
  // Automatic rollback occurs
}
```

## Best Practices

1. **Always validate before deploying**
   ```javascript
   const validation = await robotsManager.validateRobotsTxt();
   if (!validation.valid) {
     // Fix issues before deploying
   }
   ```

2. **Don't block resources**
   ```javascript
   // Check resources regularly
   const blocked = await robotsManager.checkResourceBlocking([
     '/assets/', '/images/', '/*.css', '/*.js'
   ]);
   ```

3. **Include sitemap**
   ```javascript
   await robotsManager.updateSitemapDirective(
     'https://www.scrapiz.in/sitemap.xml'
   );
   ```

4. **Test patterns**
   ```javascript
   const result = await robotsManager.isPathBlocked('/test-path');
   console.log('Blocked:', result.blocked);
   ```

5. **Regular audits**
   ```javascript
   // Run weekly
   const validation = await robotsManager.validateRobotsTxt();
   const stats = await robotsManager.getStatistics();
   ```

## Troubleshooting

### Issue: Resources are blocked
```javascript
const blocked = await robotsManager.checkResourceBlocking([
  '/assets/', '/images/'
]);
await robotsManager.unblockResources(blocked.map(r => r.path));
```

### Issue: Missing sitemap
```javascript
await robotsManager.updateSitemapDirective(
  'https://www.scrapiz.in/sitemap.xml'
);
```

### Issue: Overly broad rules
```javascript
const validation = await robotsManager.validateRobotsTxt();
// Check for "blocks-all-content" issue
// Regenerate with specific rules
```

## Running the Example

```bash
node scripts/gsc-fixes/example-robotstxt-workflow.js
```

## Running Tests

```bash
npx vitest run scripts/gsc-fixes/robotstxt.test.js
```

## Documentation

- Full documentation: `RobotsTxt.README.md`
- Implementation details: `ROBOTSTXT_IMPLEMENTATION.md`
- Example workflow: `example-robotstxt-workflow.js`

## Support

For issues or questions:
1. Check the full README: `RobotsTxt.README.md`
2. Review test cases: `robotstxt.test.js`
3. Run example workflow: `example-robotstxt-workflow.js`
