/**
 * Unit tests for Schema Validator and Fixer
 */

import SchemaValidator from './SchemaValidator.js';
import SchemaFixer from './SchemaFixer.js';
import logger from './logger.js';
import errorHandler from './errorHandler.js';

// Mock logger for testing
const testLogger = {
  info: (msg) => console.log(`[INFO] ${msg}`),
  warn: (msg) => console.log(`[WARN] ${msg}`),
  error: (msg, data) => console.log(`[ERROR] ${msg}`, data || ''),
  debug: (msg) => console.log(`[DEBUG] ${msg}`)
};

// Test counter
let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    testsPassed++;
  } else {
    console.log(`  ✗ ${message}`);
    testsFailed++;
  }
}

function assertEquals(actual, expected, message) {
  if (actual === expected) {
    console.log(`  ✓ ${message}`);
    testsPassed++;
  } else {
    console.log(`  ✗ ${message}`);
    console.log(`    Expected: ${expected}`);
    console.log(`    Actual: ${actual}`);
    testsFailed++;
  }
}

async function testSchemaValidator() {
  console.log('\n=== Testing SchemaValidator ===\n');
  
  const validator = new SchemaValidator(testLogger, errorHandler);

  // Test 1: Extract JSON-LD from HTML
  console.log('Test 1: Extract JSON-LD from HTML');
  const html = `
    <html>
      <head>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Test Business"
          }
        </script>
      </head>
    </html>
  `;
  const schemas = validator.extractJsonLd(html);
  assert(schemas.length === 1, 'Should extract 1 schema');
  assert(schemas[0]['@type'] === 'LocalBusiness', 'Should extract LocalBusiness type');

  // Test 2: Detect schema type
  console.log('\nTest 2: Detect schema type');
  const schema = { '@type': 'FAQPage', mainEntity: [] };
  const type = validator.detectSchemaType(schema);
  assertEquals(type, 'FAQPage', 'Should detect FAQPage type');

  // Test 3: Validate LocalBusiness - missing required fields
  console.log('\nTest 3: Validate LocalBusiness - missing required fields');
  const invalidLocalBusiness = {
    '@type': 'LocalBusiness',
    'name': 'Test Business'
    // Missing address and telephone
  };
  const errors = validator.validateLocalBusiness(invalidLocalBusiness);
  assert(errors.length >= 2, 'Should have at least 2 errors (address, telephone)');
  assert(errors.some(e => e.field === 'address'), 'Should have address error');
  assert(errors.some(e => e.field === 'telephone'), 'Should have telephone error');

  // Test 4: Validate LocalBusiness - valid schema
  console.log('\nTest 4: Validate LocalBusiness - valid schema');
  const validLocalBusiness = {
    '@type': 'LocalBusiness',
    'name': 'Test Business',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '123 Main St',
      'addressLocality': 'City',
      'addressRegion': 'State',
      'postalCode': '12345',
      'addressCountry': 'US'
    },
    'telephone': '+1-555-555-5555'
  };
  const validErrors = validator.validateLocalBusiness(validLocalBusiness);
  const criticalErrors = validErrors.filter(e => e.severity === 'error');
  assert(criticalErrors.length === 0, 'Should have no critical errors');

  // Test 5: Validate FAQPage - missing mainEntity
  console.log('\nTest 5: Validate FAQPage - missing mainEntity');
  const invalidFAQ = {
    '@type': 'FAQPage'
    // Missing mainEntity
  };
  const faqErrors = validator.validateFAQPage(invalidFAQ);
  assert(faqErrors.length > 0, 'Should have errors');
  assert(faqErrors.some(e => e.field === 'mainEntity'), 'Should have mainEntity error');

  // Test 6: Validate FAQPage - valid schema
  console.log('\nTest 6: Validate FAQPage - valid schema');
  const validFAQ = {
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is this?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'This is the answer.'
        }
      }
    ]
  };
  const validFAQErrors = validator.validateFAQPage(validFAQ);
  const faqCriticalErrors = validFAQErrors.filter(e => e.severity === 'error');
  assert(faqCriticalErrors.length === 0, 'Should have no critical errors');

  // Test 7: Validate Article - missing required fields
  console.log('\nTest 7: Validate Article - missing required fields');
  const invalidArticle = {
    '@type': 'Article',
    'headline': 'Test Article'
    // Missing author and datePublished
  };
  const articleErrors = validator.validateArticle(invalidArticle);
  assert(articleErrors.length >= 2, 'Should have at least 2 errors');
  assert(articleErrors.some(e => e.field === 'author'), 'Should have author error');
  assert(articleErrors.some(e => e.field === 'datePublished'), 'Should have datePublished error');

  // Test 8: Validate date format
  console.log('\nTest 8: Validate date format');
  assert(validator.isValidDate('2024-01-15'), 'Should accept YYYY-MM-DD format');
  assert(validator.isValidDate('2024-01-15T10:30:00Z'), 'Should accept ISO 8601 format');
  assert(!validator.isValidDate('01/15/2024'), 'Should reject MM/DD/YYYY format');
  assert(!validator.isValidDate('invalid'), 'Should reject invalid date');

  // Test 9: Validate BreadcrumbList
  console.log('\nTest 9: Validate BreadcrumbList');
  const validBreadcrumb = {
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://example.com'
      }
    ]
  };
  const breadcrumbErrors = validator.validateBreadcrumbList(validBreadcrumb);
  const breadcrumbCriticalErrors = breadcrumbErrors.filter(e => e.severity === 'error');
  assert(breadcrumbCriticalErrors.length === 0, 'Should have no critical errors');
}

async function testSchemaFixer() {
  console.log('\n=== Testing SchemaFixer ===\n');
  
  const fixer = new SchemaFixer(testLogger, errorHandler);

  // Test 1: Fix LocalBusiness - add missing fields
  console.log('Test 1: Fix LocalBusiness - add missing fields');
  const invalidLocalBusiness = {
    '@type': 'LocalBusiness',
    'name': 'Test Business'
  };
  const errors = [
    { field: 'address', message: 'Missing required field: address', severity: 'error' },
    { field: 'telephone', message: 'Missing required field: telephone', severity: 'error' }
  ];
  const fixed = fixer.fixLocalBusiness(invalidLocalBusiness, errors);
  assert(fixed.address !== undefined, 'Should add address');
  assert(fixed.telephone !== undefined, 'Should add telephone');
  assert(typeof fixed.address === 'object', 'Address should be an object');

  // Test 2: Fix FAQPage - add missing mainEntity
  console.log('\nTest 2: Fix FAQPage - add missing mainEntity');
  const invalidFAQ = {
    '@type': 'FAQPage'
  };
  const faqErrors = [
    { field: 'mainEntity', message: 'Missing required field: mainEntity', severity: 'error' }
  ];
  const fixedFAQ = fixer.fixFAQPage(invalidFAQ, faqErrors);
  assert(Array.isArray(fixedFAQ.mainEntity), 'Should add mainEntity as array');

  // Test 3: Fix FAQPage - fix question structure
  console.log('\nTest 3: Fix FAQPage - fix question structure');
  const faqWithBadQuestion = {
    '@type': 'FAQPage',
    'mainEntity': [
      {
        'name': 'What is this?'
        // Missing @type and acceptedAnswer
      }
    ]
  };
  const questionErrors = [
    { field: 'mainEntity[0].@type', message: 'Missing @type', severity: 'error' },
    { field: 'mainEntity[0].acceptedAnswer', message: 'Missing acceptedAnswer', severity: 'error' }
  ];
  const fixedQuestion = fixer.fixFAQPage(faqWithBadQuestion, questionErrors);
  assert(fixedQuestion.mainEntity[0]['@type'] === 'Question', 'Should add @type: Question');
  assert(fixedQuestion.mainEntity[0].acceptedAnswer !== undefined, 'Should add acceptedAnswer');

  // Test 4: Fix Article - add missing fields
  console.log('\nTest 4: Fix Article - add missing fields');
  const invalidArticle = {
    '@type': 'Article',
    'headline': 'Test Article'
  };
  const articleErrors = [
    { field: 'author', message: 'Missing required field: author', severity: 'error' },
    { field: 'datePublished', message: 'Missing required field: datePublished', severity: 'error' }
  ];
  const fixedArticle = fixer.fixArticle(invalidArticle, articleErrors);
  assert(fixedArticle.author !== undefined, 'Should add author');
  assert(fixedArticle.datePublished !== undefined, 'Should add datePublished');
  assert(typeof fixedArticle.author === 'object', 'Author should be an object');

  // Test 5: Fix Article - convert string author to object
  console.log('\nTest 5: Fix Article - convert string author to object');
  const articleWithStringAuthor = {
    '@type': 'Article',
    'headline': 'Test',
    'author': 'John Doe',
    'datePublished': '2024-01-15'
  };
  const authorErrors = [
    { field: 'author', message: 'Author should be object', severity: 'warning' }
  ];
  const fixedAuthor = fixer.fixArticle(articleWithStringAuthor, authorErrors);
  assert(typeof fixedAuthor.author === 'object', 'Should convert author to object');
  assert(fixedAuthor.author['@type'] === 'Person', 'Should set @type to Person');
  assert(fixedAuthor.author.name === 'John Doe', 'Should preserve author name');

  // Test 6: Fix BreadcrumbList
  console.log('\nTest 6: Fix BreadcrumbList');
  const invalidBreadcrumb = {
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        'name': 'Home'
        // Missing @type, position, item
      }
    ]
  };
  const breadcrumbErrors = [
    { field: 'itemListElement[0].@type', message: 'Missing @type', severity: 'error' },
    { field: 'itemListElement[0].position', message: 'Missing position', severity: 'error' },
    { field: 'itemListElement[0].item', message: 'Missing item', severity: 'error' }
  ];
  const fixedBreadcrumb = fixer.fixBreadcrumbList(invalidBreadcrumb, breadcrumbErrors);
  assert(fixedBreadcrumb.itemListElement[0]['@type'] === 'ListItem', 'Should add @type');
  assert(fixedBreadcrumb.itemListElement[0].position !== undefined, 'Should add position');
  assert(fixedBreadcrumb.itemListElement[0].item !== undefined, 'Should add item');

  // Test 7: Fix schema errors by type
  console.log('\nTest 7: Fix schema errors by type');
  const schemaToFix = {
    '@type': 'LocalBusiness',
    'name': 'Test'
  };
  const errorsToFix = [
    { field: 'telephone', message: 'Missing telephone', severity: 'error' }
  ];
  const fixedByType = fixer.fixSchemaErrors(schemaToFix, errorsToFix);
  assert(fixedByType.telephone !== undefined, 'Should fix by schema type');
}

async function runTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         Schema Validator and Fixer Unit Tests             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    await testSchemaValidator();
    await testSchemaFixer();

    console.log('\n' + '═'.repeat(60));
    console.log(`\nTest Results:`);
    console.log(`  Passed: ${testsPassed}`);
    console.log(`  Failed: ${testsFailed}`);
    console.log(`  Total:  ${testsPassed + testsFailed}`);

    if (testsFailed === 0) {
      console.log('\n✅ All tests passed!\n');
      process.exit(0);
    } else {
      console.log('\n❌ Some tests failed.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
