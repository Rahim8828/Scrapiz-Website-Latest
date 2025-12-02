/**
 * Example workflow for Schema validation and fixing
 */

import SchemaValidator from './SchemaValidator.js';
import SchemaFixer from './SchemaFixer.js';
import logger from './logger.js';
import errorHandler from './errorHandler.js';

async function exampleSchemaWorkflow() {
  console.log('=== Schema Validation and Fixing Workflow ===\n');

  // Initialize validator and fixer
  const validator = new SchemaValidator(logger, errorHandler);
  const fixer = new SchemaFixer(logger, errorHandler);

  // Example URLs to check
  const urls = [
    'http://localhost:5173/',
    'http://localhost:5173/locations/bandra',
    'http://localhost:5173/locations/dharavi',
    'http://localhost:5173/services/scrap-collection'
  ];

  console.log(`Checking ${urls.length} URLs for schema issues...\n`);

  // Step 1: Validate schemas
  console.log('Step 1: Validating schemas...');
  const issues = await validator.validateSchemas(urls);

  if (issues.length === 0) {
    console.log('✓ No schema issues found!\n');
    return;
  }

  console.log(`✗ Found schema issues on ${issues.length} page(s)\n`);

  // Step 2: Display issues
  console.log('Step 2: Schema Issues Summary');
  console.log('─'.repeat(80));

  issues.forEach((issue, index) => {
    console.log(`\n${index + 1}. ${issue.url}`);
    console.log(`   Schemas found: ${issue.schemas.length}`);
    
    issue.issues.forEach((schemaIssue, schemaIndex) => {
      console.log(`\n   Schema ${schemaIndex + 1}: ${schemaIssue.schemaType}`);
      
      const errors = schemaIssue.errors.filter(e => e.severity === 'error');
      const warnings = schemaIssue.errors.filter(e => e.severity === 'warning');
      
      if (errors.length > 0) {
        console.log(`   Errors (${errors.length}):`);
        errors.forEach(error => {
          console.log(`     - ${error.field}: ${error.message}`);
        });
      }
      
      if (warnings.length > 0) {
        console.log(`   Warnings (${warnings.length}):`);
        warnings.forEach(warning => {
          console.log(`     - ${warning.field}: ${warning.message}`);
        });
      }
    });
    
    console.log(`\n   Recommendation: ${issue.recommendation}`);
  });

  console.log('\n' + '─'.repeat(80));

  // Step 3: Fix critical errors
  console.log('\nStep 3: Fixing critical errors...');
  
  const fixableIssues = issues.filter(issue => {
    return issue.issues.some(i => 
      i.errors.some(e => e.severity === 'error')
    );
  });

  if (fixableIssues.length === 0) {
    console.log('No critical errors to fix (only warnings remain)\n');
    return;
  }

  console.log(`Found ${fixableIssues.length} page(s) with critical errors`);

  // Example file path resolver (adjust based on your project structure)
  const filePathResolver = (url) => {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    if (pathname === '/') {
      return 'src/pages/Home.jsx';
    } else if (pathname.startsWith('/locations/')) {
      const location = pathname.split('/')[2];
      const locationName = location.charAt(0).toUpperCase() + location.slice(1);
      return `src/pages/${locationName}.jsx`;
    } else if (pathname.startsWith('/services/')) {
      const service = pathname.split('/')[2];
      const serviceName = service.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join('');
      return `src/pages/${serviceName}Page.jsx`;
    }
    
    return null;
  };

  // Fix the issues (dry run - don't actually modify files)
  console.log('\nGenerating fixes (dry run)...\n');

  for (const issue of fixableIssues) {
    console.log(`\nFixing: ${issue.url}`);
    
    for (const schemaIssue of issue.issues) {
      const criticalErrors = schemaIssue.errors.filter(e => e.severity === 'error');
      
      if (criticalErrors.length === 0) {
        continue;
      }

      console.log(`  Schema type: ${schemaIssue.schemaType}`);
      console.log(`  Errors to fix: ${criticalErrors.length}`);

      // Generate fixed schema
      const fixedSchema = fixer.fixSchemaErrors(schemaIssue.schema, criticalErrors);
      
      console.log('  Original schema:');
      console.log('  ' + JSON.stringify(schemaIssue.schema, null, 2).split('\n').join('\n  '));
      
      console.log('\n  Fixed schema:');
      console.log('  ' + JSON.stringify(fixedSchema, null, 2).split('\n').join('\n  '));
    }
  }

  console.log('\n' + '─'.repeat(80));
  console.log('\nNote: This was a dry run. To apply fixes, uncomment the file update code.');
  console.log('Review the generated fixes above and manually update your files as needed.\n');

  // To actually apply fixes, uncomment this:
  /*
  const results = await fixer.fixSchemaIssues(fixableIssues, filePathResolver);
  
  console.log('\nFix Results:');
  console.log(`  Total: ${results.total}`);
  console.log(`  Fixed: ${results.fixed}`);
  console.log(`  Failed: ${results.failed}`);
  console.log(`  Skipped: ${results.skipped}`);
  
  results.details.forEach(detail => {
    console.log(`  ${detail.status.toUpperCase()}: ${detail.url} - ${detail.message}`);
  });
  */

  // Step 4: Re-validate (optional)
  console.log('\nStep 4: Re-validation');
  console.log('After applying fixes, run validation again to confirm all issues are resolved.');
  console.log('Example: const revalidated = await validator.validateSchemas(urls);\n');
}

// Run the workflow
exampleSchemaWorkflow().catch(error => {
  console.error('Workflow failed:', error);
  process.exit(1);
});
