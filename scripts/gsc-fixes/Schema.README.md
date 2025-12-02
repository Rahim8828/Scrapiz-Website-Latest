# Schema Validator and Fixer

This module provides comprehensive validation and fixing capabilities for structured data (Schema.org markup) on web pages.

## Overview

The Schema module consists of two main classes:
- **SchemaValidator**: Detects and validates structured data issues
- **SchemaFixer**: Automatically fixes common schema errors

## Features

### Supported Schema Types

1. **LocalBusiness**
   - Validates required fields: name, address, telephone
   - Checks address structure (PostalAddress)
   - Validates telephone format
   - Checks optional fields: url, image, priceRange, openingHours

2. **FAQPage**
   - Validates mainEntity array
   - Checks Question objects
   - Validates acceptedAnswer structure
   - Ensures proper @type declarations

3. **Article/BlogPosting/NewsArticle**
   - Validates required fields: headline, author, datePublished
   - Checks author structure (Person/Organization)
   - Validates date formats (ISO 8601)
   - Checks optional fields: image, dateModified, publisher

4. **BreadcrumbList**
   - Validates itemListElement array
   - Checks ListItem structure
   - Validates position, name, and item fields

## Usage

### Basic Validation

```javascript
import SchemaValidator from './SchemaValidator.js';
import logger from './logger.js';
import errorHandler from './errorHandler.js';

const validator = new SchemaValidator(logger, errorHandler);

// Validate a single URL
const result = await validator.validateSchema('https://example.com/page');

if (result && result.issues.length > 0) {
  console.log('Schema issues found:', result.issues);
}

// Batch validate multiple URLs
const urls = ['https://example.com/page1', 'https://example.com/page2'];
const issues = await validator.validateSchemas(urls);
```

### Fixing Schema Errors

```javascript
import SchemaFixer from './SchemaFixer.js';

const fixer = new SchemaFixer(logger, errorHandler);

// Fix a single schema issue
const fixResult = await fixer.fixSchemaIssue(schemaIssue, '/path/to/file.jsx');

// Batch fix multiple issues
const filePathResolver = (url) => {
  // Convert URL to file path
  return `/path/to/file.jsx`;
};

const results = await fixer.fixSchemaIssues(schemaIssues, filePathResolver);
console.log(`Fixed: ${results.fixed}, Failed: ${results.failed}`);
```

### Complete Workflow

```javascript
// 1. Validate schemas
const validator = new SchemaValidator(logger, errorHandler);
const issues = await validator.validateSchemas(urls);

// 2. Filter issues that need fixing
const fixableIssues = issues.filter(issue => {
  return issue.issues.some(i => i.errors.some(e => e.severity === 'error'));
});

// 3. Fix the issues
const fixer = new SchemaFixer(logger, errorHandler);
const results = await fixer.fixSchemaIssues(fixableIssues, filePathResolver);

// 4. Re-validate to confirm fixes
const revalidated = await validator.validateSchemas(
  fixableIssues.map(i => i.url)
);
```

## Validation Results

### Schema Issue Object

```javascript
{
  url: 'https://example.com/page',
  hasSchema: true,
  schemas: [/* array of schema objects */],
  issues: [
    {
      schemaIndex: 0,
      schemaType: 'LocalBusiness',
      schema: {/* schema object */},
      errors: [
        {
          field: 'telephone',
          message: 'Missing required field: telephone',
          severity: 'error'
        }
      ]
    }
  ],
  recommendation: 'Fix 1 error(s) in structured data'
}
```

### Error Severities

- **error**: Critical issues that prevent schema from being valid
- **warning**: Non-critical issues that should be addressed for best practices

## Common Fixes

### LocalBusiness

```javascript
// Before
{
  "@type": "LocalBusiness",
  "name": "My Business"
  // Missing address and telephone
}

// After
{
  "@type": "LocalBusiness",
  "name": "My Business",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345",
    "addressCountry": "US"
  },
  "telephone": "+1-555-555-5555"
}
```

### FAQPage

```javascript
// Before
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "name": "What is this?"
      // Missing @type and acceptedAnswer
    }
  ]
}

// After
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is this?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "This is the answer."
      }
    }
  ]
}
```

## Best Practices

1. **Always create backups**: The fixer automatically creates backups before modifying files
2. **Review placeholders**: Automatic fixes may add placeholder values that need manual review
3. **Validate after fixing**: Always re-validate after applying fixes
4. **Handle warnings**: While not critical, addressing warnings improves schema quality
5. **Use proper formats**: Ensure dates are in ISO 8601 format, URLs are absolute, etc.

## Error Handling

The module uses the error handler to manage failures gracefully:

```javascript
try {
  const result = await validator.validateSchema(url);
} catch (error) {
  // Error is logged and handled by errorHandler
  // Recovery strategy is applied automatically
}
```

## Limitations

1. **Placeholder values**: Automatic fixes may add placeholder values that require manual review
2. **Complex schemas**: Some complex schema structures may not be fully fixable automatically
3. **File updates**: File path resolution must be provided for automatic file updates
4. **Context-specific data**: Some fields require business-specific data that cannot be auto-generated

## Integration with GSC Fixes

This module integrates with the broader GSC fix system:

```javascript
import IssueDetector from './IssueDetector.js';
import SchemaValidator from './SchemaValidator.js';
import SchemaFixer from './SchemaFixer.js';

// Detect all issues including schema
const detector = new IssueDetector(logger, errorHandler);
const allIssues = await detector.detectAllIssues(urls);

// Validate schemas separately for detailed analysis
const validator = new SchemaValidator(logger, errorHandler);
const schemaIssues = await validator.validateSchemas(urls);

// Fix schema issues
const fixer = new SchemaFixer(logger, errorHandler);
const results = await fixer.fixSchemaIssues(schemaIssues);
```

## Testing

The module should be tested with:
- Valid schemas (should return no issues)
- Invalid schemas (should detect errors)
- Missing required fields
- Incorrect data types
- Invalid formats (dates, URLs, etc.)

See the test files for comprehensive examples.
