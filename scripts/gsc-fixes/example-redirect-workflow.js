/**
 * Example Redirect Detection and Fixing Workflow
 * 
 * This script demonstrates how to use RedirectDetector and RedirectFixer
 * to identify and fix redirect issues for Google Search Console.
 */

import RedirectDetector from './RedirectDetector.js';
import RedirectFixer from './RedirectFixer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

// Initialize components
const logger = new Logger();
const errorHandler = new ErrorHandler(logger);
const detector = new RedirectDetector(logger, errorHandler);
const fixer = new RedirectFixer(logger, errorHandler);

/**
 * Example 1: Check single URL for redirects
 */
async function example1_checkSingleUrl() {
  console.log('\n=== Example 1: Check Single URL ===\n');

  const url = 'https://example.com/old-page';
  const issue = await detector.checkRedirect(url);

  if (issue) {
    console.log('Redirect detected!');
    console.log('URL:', issue.url);
    console.log('Redirect chain:', issue.redirectChain);
    console.log('Final destination:', issue.finalDestination);
    console.log('Redirect type:', issue.redirectTypeName);
    console.log('Is permanent:', issue.isPermanent);
    console.log('Has chain:', issue.hasChain);
    console.log('Chain length:', issue.chainLength);
    console.log('Recommendation:', issue.recommendation);
  } else {
    console.log('No redirect found');
  }
}

/**
 * Example 2: Check multiple URLs
 */
async function example2_checkMultipleUrls() {
  console.log('\n=== Example 2: Check Multiple URLs ===\n');

  const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3',
    'https://example.com/page4',
    'https://example.com/page5'
  ];

  const issues = await detector.checkRedirects(urls);

  console.log(`Found ${issues.length} redirect issues out of ${urls.length} URLs`);

  issues.forEach((issue, index) => {
    console.log(`\n${index + 1}. ${issue.url}`);
    console.log(`   Type: ${issue.redirectTypeName}`);
    console.log(`   Chain: ${issue.hasChain ? 'Yes' : 'No'} (${issue.chainLength} hops)`);
    console.log(`   Final: ${issue.finalDestination}`);
  });
}

/**
 * Example 3: Analyze redirect patterns
 */
async function example3_analyzePatterns() {
  console.log('\n=== Example 3: Analyze Redirect Patterns ===\n');

  const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
  ];

  const issues = await detector.checkRedirects(urls);
  const analysis = detector.analyzeRedirectPatterns(issues);

  console.log('Redirect Analysis:');
  console.log('Total redirects:', analysis.totalRedirects);
  console.log('Redirect chains:', analysis.redirectChains);
  console.log('Temporary redirects:', analysis.temporaryRedirects);
  console.log('Permanent redirects:', analysis.permanentRedirects);
  console.log('Longest chain:', analysis.longestChain);
  console.log('By type:', analysis.redirectsByType);
}

/**
 * Example 4: Fix redirects (dry run)
 */
async function example4_dryRunFixes() {
  console.log('\n=== Example 4: Fix Redirects (Dry Run) ===\n');

  const urls = [
    'https://example.com/old-page',
    'https://example.com/temp-page'
  ];

  // Detect issues
  const issues = await detector.checkRedirects(urls);
  console.log(`Found ${issues.length} redirect issues`);

  // Preview fixes
  const result = await fixer.fixRedirectIssues(issues, {
    dryRun: true,
    flattenChains: true,
    convertToPermament: true,
    updateHtaccess: true
  });

  console.log('\nDry Run Results:');
  console.log('Would fix:', result.issuesFixed);
  console.log('Would fail:', result.issuesFailed);
  console.log('\nRedirect rules that would be added:');
  result.redirectRules.forEach(rule => {
    console.log(`  ${rule.rule}`);
  });

  console.log('\nDetails:');
  result.details.forEach((detail, index) => {
    console.log(`\n${index + 1}. ${detail.url}`);
    console.log(`   Status: ${detail.status}`);
    console.log(`   Message: ${detail.message}`);
    if (detail.fixes) {
      console.log(`   Fixes: ${detail.fixes.join(', ')}`);
    }
  });
}

/**
 * Example 5: Apply fixes
 */
async function example5_applyFixes() {
  console.log('\n=== Example 5: Apply Fixes ===\n');

  const urls = [
    'https://example.com/old-page',
    'https://example.com/temp-page'
  ];

  // Detect issues
  const issues = await detector.checkRedirects(urls);
  console.log(`Found ${issues.length} redirect issues`);

  // Apply fixes
  const result = await fixer.fixRedirectIssues(issues, {
    dryRun: false,
    flattenChains: true,
    convertToPermament: true,
    updateHtaccess: true
  });

  console.log('\nFix Results:');
  console.log('Fixed:', result.issuesFixed);
  console.log('Failed:', result.issuesFailed);
  console.log('Success:', result.success);
  console.log('Htaccess updated:', result.htaccessUpdated);
  console.log('Htaccess path:', result.htaccessPath);

  if (result.redirectRules.length > 0) {
    console.log('\nRedirect rules added:');
    result.redirectRules.forEach(rule => {
      console.log(`  ${rule.rule}`);
    });
  }
}

/**
 * Example 6: Generate redirect rule
 */
async function example6_generateRule() {
  console.log('\n=== Example 6: Generate Redirect Rule ===\n');

  const fromUrl = 'https://example.com/old-page';
  const toUrl = 'https://example.com/new-page';

  const rule = fixer.generateRedirectRule(fromUrl, toUrl, 301);

  console.log('Generated redirect rule:');
  console.log('From:', rule.from);
  console.log('To:', rule.to);
  console.log('Status code:', rule.statusCode);
  console.log('Pattern:', rule.pattern);
  console.log('Rule:', rule.rule);

  // Validate the rule
  const isValid = fixer.validateRedirectRule(rule);
  console.log('Valid:', isValid);
}

/**
 * Example 7: Get redirect statistics
 */
async function example7_getStatistics() {
  console.log('\n=== Example 7: Get Redirect Statistics ===\n');

  const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
  ];

  const issues = await detector.checkRedirects(urls);
  const stats = fixer.getRedirectStatistics(issues);

  console.log('Redirect Statistics:');
  console.log('Total:', stats.total);
  console.log('Chains:', stats.chains);
  console.log('Temporary:', stats.temporary);
  console.log('Permanent:', stats.permanent);
  console.log('Longest chain:', stats.longestChain);
  console.log('Average chain length:', stats.averageChainLength);
}

/**
 * Example 8: Complete workflow
 */
async function example8_completeWorkflow() {
  console.log('\n=== Example 8: Complete Workflow ===\n');

  // Step 1: Define URLs to check
  const urls = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
  ];

  console.log('Step 1: Detecting redirect issues...');
  const issues = await detector.checkRedirects(urls);
  console.log(`Found ${issues.length} redirect issues`);

  if (issues.length === 0) {
    console.log('No redirect issues found!');
    return;
  }

  // Step 2: Analyze patterns
  console.log('\nStep 2: Analyzing redirect patterns...');
  const analysis = detector.analyzeRedirectPatterns(issues);
  console.log('Analysis:', analysis);

  // Step 3: Get statistics
  console.log('\nStep 3: Getting statistics...');
  const stats = fixer.getRedirectStatistics(issues);
  console.log('Statistics:', stats);

  // Step 4: Preview fixes
  console.log('\nStep 4: Previewing fixes (dry run)...');
  const dryRun = await fixer.fixRedirectIssues(issues, { dryRun: true });
  console.log(`Would fix ${dryRun.issuesFixed} issues`);
  console.log(`Would add ${dryRun.redirectRules.length} redirect rules`);

  // Step 5: Apply fixes (commented out for safety)
  console.log('\nStep 5: Applying fixes...');
  console.log('(Skipped in example - uncomment to apply)');
  /*
  const result = await fixer.fixRedirectIssues(issues, { dryRun: false });
  console.log('Fixed:', result.issuesFixed);
  console.log('Failed:', result.issuesFailed);
  console.log('Htaccess updated:', result.htaccessUpdated);
  */

  console.log('\nWorkflow complete!');
}

/**
 * Example 9: Follow redirect chain manually
 */
async function example9_followChain() {
  console.log('\n=== Example 9: Follow Redirect Chain ===\n');

  const url = 'https://example.com/old-page';
  const chainInfo = await detector.followRedirectChain(url);

  console.log('Redirect chain for:', url);
  console.log('Is redirect:', chainInfo.isRedirect);
  console.log('Chain length:', chainInfo.chainLength);
  console.log('Has chain:', chainInfo.hasChain);
  console.log('Final destination:', chainInfo.finalDestination);

  console.log('\nChain details:');
  chainInfo.redirectChain.forEach((hop, index) => {
    console.log(`${index + 1}. ${hop.url}`);
    console.log(`   Status: ${hop.status} ${hop.statusText}`);
  });
}

/**
 * Example 10: Identify redirect type
 */
async function example10_identifyType() {
  console.log('\n=== Example 10: Identify Redirect Type ===\n');

  const statusCodes = [301, 302, 303, 307, 308];

  statusCodes.forEach(code => {
    const typeInfo = detector.identifyRedirectType(code);
    console.log(`${code}:`);
    console.log(`  Type: ${typeInfo.type}`);
    console.log(`  Name: ${typeInfo.name}`);
    console.log(`  Recommended: ${typeInfo.recommended}`);
  });
}

// Main execution
async function main() {
  console.log('='.repeat(60));
  console.log('Redirect Detection and Fixing Examples');
  console.log('='.repeat(60));

  try {
    // Run examples (comment out as needed)
    // await example1_checkSingleUrl();
    // await example2_checkMultipleUrls();
    // await example3_analyzePatterns();
    // await example4_dryRunFixes();
    // await example5_applyFixes(); // Be careful with this one!
    // await example6_generateRule();
    // await example7_getStatistics();
    await example8_completeWorkflow();
    // await example9_followChain();
    // await example10_identifyType();

    console.log('\n' + '='.repeat(60));
    console.log('Examples complete!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  example1_checkSingleUrl,
  example2_checkMultipleUrls,
  example3_analyzePatterns,
  example4_dryRunFixes,
  example5_applyFixes,
  example6_generateRule,
  example7_getStatistics,
  example8_completeWorkflow,
  example9_followChain,
  example10_identifyType
};
