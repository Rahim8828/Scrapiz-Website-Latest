import CanonicalDetector from './CanonicalDetector.js';
import CanonicalFixer from './CanonicalFixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

/**
 * Example workflow for canonical tag detection and fixes
 */
async function exampleCanonicalWorkflow() {
  console.log('=== Canonical Tag Detection and Fix Workflow ===\n');

  // Initialize components
  const logger = new Logger();
  const errorHandler = new ErrorHandler(logger);
  const detector = new CanonicalDetector(logger, errorHandler);
  const fixer = new CanonicalFixer(logger, errorHandler);

  // Example URLs to check
  const testUrls = [
    'https://www.scrapiz.in/',
    'https://www.scrapiz.in/about',
    'https://www.scrapiz.in/services',
    'https://www.scrapiz.in/bandra',
    'https://www.scrapiz.in/jogeshwari'
  ];

  console.log('Step 1: Detecting canonical tag issues...\n');
  
  // Detect canonical issues
  const canonicalIssues = await detector.checkCanonicals(testUrls);
  
  console.log(`Found ${canonicalIssues.length} canonical issues:\n`);
  canonicalIssues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.url}`);
    console.log(`   Type: ${issue.issueType}`);
    console.log(`   Current: ${issue.currentCanonical || 'none'}`);
    console.log(`   Expected: ${issue.expectedCanonical}`);
    console.log(`   Recommendation: ${issue.recommendation}`);
    console.log('');
  });

  // Example: Detect duplicate content
  console.log('\nStep 2: Detecting duplicate content...\n');
  
  const duplicateUrls = [
    'https://www.scrapiz.in/bandra',
    'https://www.scrapiz.in/bandra-east',
    'https://www.scrapiz.in/jogeshwari'
  ];

  const duplicateIssues = [];
  for (const url of duplicateUrls) {
    const duplicates = await detector.findDuplicates(url, duplicateUrls);
    if (duplicates) {
      duplicateIssues.push(duplicates);
    }
  }

  console.log(`Found ${duplicateIssues.length} duplicate content issues:\n`);
  duplicateIssues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.url}`);
    console.log(`   Duplicate of: ${issue.duplicateOf || 'primary version'}`);
    console.log(`   Similarity: ${(issue.similarityScore * 100).toFixed(1)}%`);
    console.log(`   Has canonical: ${issue.hasCanonical}`);
    console.log(`   Recommendation: ${issue.recommendation}`);
    console.log('');
  });

  // Example: Fix canonical issues (dry run)
  console.log('\nStep 3: Fixing canonical issues (dry run)...\n');
  
  const fixableIssues = canonicalIssues.filter(issue => issue.fixable);
  
  if (fixableIssues.length > 0) {
    const fixResults = await fixer.fixCanonicalIssues(fixableIssues, { dryRun: true });
    
    console.log(`Fix Results (dry run):`);
    console.log(`  Fixed: ${fixResults.issuesFixed}`);
    console.log(`  Failed: ${fixResults.issuesFailed}`);
    console.log('');
    
    fixResults.details.forEach((result, index) => {
      console.log(`${index + 1}. ${result.url}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Message: ${result.message}`);
      if (result.filePath) {
        console.log(`   File: ${result.filePath}`);
      }
      console.log('');
    });
  } else {
    console.log('No fixable canonical issues found.');
  }

  // Example: Fix duplicate content (dry run)
  console.log('\nStep 4: Fixing duplicate content (dry run)...\n');
  
  const fixableDuplicates = duplicateIssues.filter(issue => issue.fixable);
  
  if (fixableDuplicates.length > 0) {
    const duplicateFixResults = await fixer.fixDuplicateContent(fixableDuplicates, true);
    
    console.log(`Duplicate Fix Results (dry run):`);
    console.log(`  Fixed: ${duplicateFixResults.issuesFixed}`);
    console.log(`  Failed: ${duplicateFixResults.issuesFailed}`);
    console.log('');
    
    duplicateFixResults.details.forEach((result, index) => {
      console.log(`${index + 1}. ${result.url}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Message: ${result.message}`);
      console.log('');
    });
  } else {
    console.log('No fixable duplicate content issues found.');
  }

  // Example: Validate canonical target
  console.log('\nStep 5: Validating canonical targets...\n');
  
  const testCanonicals = [
    'https://www.scrapiz.in/',
    'https://www.scrapiz.in/about',
    'https://www.scrapiz.in/invalid-page'
  ];

  for (const canonicalUrl of testCanonicals) {
    const validation = await detector.validateCanonicalTarget(canonicalUrl);
    console.log(`${canonicalUrl}`);
    console.log(`  Valid: ${validation.valid}`);
    console.log(`  Status: ${validation.status}`);
    console.log(`  Noindex: ${validation.noindex}`);
    if (!validation.valid) {
      console.log(`  Reason: ${validation.reason}`);
    }
    console.log('');
  }

  // Clear cache
  detector.clearCache();
  
  console.log('\n=== Workflow Complete ===');
}

// Run the example workflow
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleCanonicalWorkflow().catch(error => {
    console.error('Workflow failed:', error);
    process.exit(1);
  });
}

export default exampleCanonicalWorkflow;
