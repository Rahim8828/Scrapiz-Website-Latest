# Schema Validator and Fixer Implementation Summary

## Overview

Implemented comprehensive schema validation and fixing system for detecting and resolving structured data issues on web pages.

## Components Implemented

### 1. SchemaValidator.js

**Purpose**: Validates structured data (JSON-LD) on web pages

**Key Features**:
- Extracts JSON-LD from HTML
- Detects schema types (LocalBusiness, FAQPage, Article, BreadcrumbList)
- Validates required fields for each schema type
- Checks data formats (dates, URLs, telephone numbers)
- Provides detailed error reporting with severity levels (error/warning)

**Supported Schema Types**:
1. **LocalBusiness**
   - Required: name, address, telephone
   - Recommended: url, image, priceRange, openingHours
   - Validates PostalAddress structure
   - Checks telephone format

2. **FAQPage**
   - Required: mainEntity (array of Questions)
   - Validates Question structure (@type, name, acceptedAnswer)
   - Validates Answer structure (@type, text)

3. **Article/BlogPosting/NewsArticle**
   - Required: headline, author, datePublished
   - Validates author structure (Person/Organization)
   - Validates ISO 8601 date format
   - Recommended: image, dateModified, publisher

4. **BreadcrumbList**
   - Required: itemListElement (array of ListItems)
   - Validates ListItem structure (@type, position, name, item)
   - Checks URL validity

**Methods**:
- `extractJsonLd(html)` - Extract JSON-LD scripts from HTML
- `detectSchemaType(schema)` - Identify schema type
- `validateLocalBusiness(schema)` - Validate LocalBusiness schema
- `validateFAQPage(schema)` - Validate FAQPage schema
- `validateArticle(schema)` - Validate Article schema
- `validateBreadcrumbList(schema)` - Validate BreadcrumbList schema
- `validateSchema(url)` - Fetch and validate all schemas on a page
- `validateSchemas(urls)` - Batch validate multiple URLs

### 2. SchemaFixer.js

**Purpose**: Automatically fixes common schema errors

**Key Features**:
- Adds missing required fields with placeholder values
- Converts incorrect data types (e.g., string to object)
- Fixes nested structure issues
- Creates backups before modifying files
- Supports rollback on errors

**Fix Capabilities**:
1. **LocalBusiness Fixes**
   - Adds missing name, address, telephone
   - Converts string address to PostalAddress object
   - Adds placeholder values for missing fields

2. **FAQPage Fixes**
   - Creates mainEntity array if missing
   - Adds @type to Questions
   - Creates acceptedAnswer structure
   - Adds placeholder question/answer text

3. **Article Fixes**
   - Adds missing headline, author, datePublished
   - Converts string author to Person object
   - Adds current date as datePublished if missing

4. **BreadcrumbList Fixes**
   - Creates itemListElement array if missing
   - Adds @type, position, name, item to ListItems
   - Generates sequential positions

**Methods**:
- `fixLocalBusiness(schema, errors)` - Fix LocalBusiness errors
- `fixFAQPage(schema, errors)` - Fix FAQPage errors
- `fixArticle(schema, errors)` - Fix Article errors
- `fixBreadcrumbList(schema, errors)` - Fix BreadcrumbList errors
- `fixSchemaErrors(schema, errors)` - Fix errors based on schema type
- `updateSchemaInFile(filePath, oldSchema, newSchema)` - Update schema in file
- `fixSchemaIssue(schemaIssue, filePath)` - Fix single schema issue
- `fixSchemaIssues(schemaIssues, filePathResolver)` - Batch fix multiple issues

### 3. Supporting Files

**Schema.README.md**
- Comprehensive documentation
- Usage examples
- Best practices
- Integration guide

**example-schema-workflow.js**
- Complete workflow example
- Demonstrates validation and fixing
- Shows dry-run mode
- Includes re-validation

**test-schema-unit.js**
- 34 unit tests covering all functionality
- Tests for SchemaValidator
- Tests for SchemaFixer
- All tests passing ✅

## Validation Results Format

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

## Error Handling

- Graceful error handling with recovery strategies
- Automatic backup creation before file modifications
- Rollback capability on failures
- Detailed error logging
- Batch processing with error isolation

## Testing

### Unit Tests (34 tests, all passing)

**SchemaValidator Tests**:
- JSON-LD extraction
- Schema type detection
- LocalBusiness validation (valid and invalid)
- FAQPage validation (valid and invalid)
- Article validation (valid and invalid)
- BreadcrumbList validation
- Date format validation

**SchemaFixer Tests**:
- LocalBusiness fixes (missing fields)
- FAQPage fixes (missing mainEntity, question structure)
- Article fixes (missing fields, author conversion)
- BreadcrumbList fixes
- Schema type-based fixing

### Test Results
```
Test Results:
  Passed: 34
  Failed: 0
  Total:  34

✅ All tests passed!
```

## Usage Example

```javascript
import SchemaValidator from './SchemaValidator.js';
import SchemaFixer from './SchemaFixer.js';

// Validate
const validator = new SchemaValidator(logger, errorHandler);
const issues = await validator.validateSchemas(urls);

// Fix
const fixer = new SchemaFixer(logger, errorHandler);
const results = await fixer.fixSchemaIssues(issues, filePathResolver);

console.log(`Fixed: ${results.fixed}, Failed: ${results.failed}`);
```

## Integration with GSC Fix System

The Schema module integrates seamlessly with the existing GSC fix system:

1. **Issue Detection**: Can be called from main audit script
2. **Batch Processing**: Supports processing multiple URLs
3. **Error Handling**: Uses shared error handler
4. **Logging**: Uses shared logger
5. **Reporting**: Compatible with report generator

## Requirements Satisfied

✅ **Requirement 9.2**: Validates structured data and identifies specific errors
✅ **Requirement 9.3**: Validates FAQPage schema with all required properties
✅ **Requirement 9.4**: Validates LocalBusiness schema with all required properties

## Next Steps

1. Integrate with main audit script (task 22)
2. Add to automated fix script (task 23)
3. Test with real website pages
4. Review and update placeholder values in fixed schemas
5. Add support for additional schema types as needed

## Files Created

1. `scripts/gsc-fixes/SchemaValidator.js` - Validator implementation
2. `scripts/gsc-fixes/SchemaFixer.js` - Fixer implementation
3. `scripts/gsc-fixes/Schema.README.md` - Documentation
4. `scripts/gsc-fixes/example-schema-workflow.js` - Example workflow
5. `scripts/gsc-fixes/test-schema-unit.js` - Unit tests
6. `scripts/gsc-fixes/SCHEMA_IMPLEMENTATION.md` - This summary

## Notes

- Placeholder values added by fixer require manual review
- File path resolver must be provided for automatic file updates
- Supports dry-run mode for testing fixes before applying
- All critical errors are fixed; warnings are logged for manual review
- Backups are created automatically before any file modifications
