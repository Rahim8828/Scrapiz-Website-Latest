import CrawlAnalyzer from './CrawlAnalyzer.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

/**
 * Example workflow for analyzing crawled and discovered pages
 */
async function exampleCrawlWorkflow() {
  console.log('=== Crawl Analyzer Example Workflow ===\n');

  // Initialize components
  const logger = new Logger();
  await logger.initialize();
  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();
  const analyzer = new CrawlAnalyzer(logger, errorHandler);

  // Example URLs from GSC
  const crawledUrls = [
    'https://scrapiz.com/scrap-dealer-in-andheri',
    'https://scrapiz.com/scrap-dealer-in-bandra',
    'https://scrapiz.com/services/scrap-collection'
  ];

  const discoveredUrls = [
    'https://scrapiz.com/scrap-dealer-in-mulund',
    'https://scrapiz.com/blog/new-post'
  ];

  const allUrls = [
    ...crawledUrls,
    ...discoveredUrls,
    'https://scrapiz.com/',
    'https://scrapiz.com/about',
    'https://scrapiz.com/services'
  ];

  // Simulate sitemap URLs
  const sitemapUrls = new Set([
    'https://scrapiz.com/',
    'https://scrapiz.com/about',
    'https://scrapiz.com/services',
    'https://scrapiz.com/scrap-dealer-in-andheri',
    'https://scrapiz.com/scrap-dealer-in-bandra'
  ]);

  try {
    // Step 1: Analyze quality signals for a single page
    console.log('Step 1: Analyzing quality signals for a single page...\n');
    const qualityResult = await analyzer.detectQualitySignals(crawledUrls[0]);
    console.log('Quality Analysis:', {
      url: qualityResult.url,
      wordCount: qualityResult.wordCount,
      headingCount: qualityResult.headingCount,
      linkCount: qualityResult.linkCount,
      qualityScore: qualityResult.qualityScore,
      issues: qualityResult.issues,
      recommendation: qualityResult.recommendation
    });
    console.log('\n---\n');

    // Step 2: Detect duplicates for a crawled page
    console.log('Step 2: Detecting duplicates for a crawled page...\n');
    const duplicateResult = await analyzer.detectDuplicateForCrawledPage(
      crawledUrls[0],
      allUrls
    );
    if (duplicateResult) {
      console.log('Duplicate Analysis:', {
        url: duplicateResult.url,
        isDuplicate: duplicateResult.isDuplicate,
        duplicateOf: duplicateResult.duplicateOf,
        duplicates: duplicateResult.duplicates,
        maxSimilarity: duplicateResult.maxSimilarity,
        recommendation: duplicateResult.recommendation
      });
    } else {
      console.log('No duplicates found');
    }
    console.log('\n---\n');

    // Step 3: Comprehensive analysis of crawled pages
    console.log('Step 3: Analyzing all crawled pages...\n');
    const crawledResults = await analyzer.analyzeCrawledPages(crawledUrls, allUrls);
    
    console.log(`Analyzed ${crawledResults.length} crawled pages:\n`);
    crawledResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.url}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Primary Issue: ${result.primaryIssue}`);
      console.log(`   Fix Strategy: ${result.fixStrategy}`);
      console.log(`   Fixable: ${result.fixable}`);
      console.log(`   Recommendation: ${result.recommendation}`);
      
      if (result.qualityAnalysis) {
        console.log(`   Quality Score: ${result.qualityAnalysis.qualityScore}/100`);
        console.log(`   Quality Issues: ${result.qualityAnalysis.issues.join(', ')}`);
      }
      
      if (result.duplicateAnalysis) {
        console.log(`   Duplicate Of: ${result.duplicateAnalysis.duplicateOf || 'Primary version'}`);
      }
      console.log('');
    });
    console.log('---\n');

    // Step 4: Analyze discovered pages
    console.log('Step 4: Analyzing discovered pages...\n');
    const discoveredResults = await analyzer.analyzeDiscoveredPages(
      discoveredUrls,
      sitemapUrls,
      allUrls
    );
    
    console.log(`Analyzed ${discoveredResults.length} discovered pages:\n`);
    discoveredResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.url}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   In Sitemap: ${result.inSitemap}`);
      console.log(`   Accessible: ${result.isAccessible}`);
      console.log(`   Issues: ${result.issues.join(', ')}`);
      console.log(`   Fix Strategy: ${result.fixStrategy}`);
      console.log(`   Recommendation: ${result.recommendation}`);
      
      if (result.qualityAnalysis) {
        console.log(`   Quality Score: ${result.qualityAnalysis.qualityScore}/100`);
      }
      console.log('');
    });
    console.log('---\n');

    // Step 5: Generate fixes (dry run)
    console.log('Step 5: Generating fixes for crawled pages (dry run)...\n');
    const fixResults = await analyzer.fixCrawledPages(crawledResults, {
      dryRun: true
    });
    
    console.log('Fix Results:');
    console.log(`  Total Issues: ${crawledResults.length}`);
    console.log(`  Fixed: ${fixResults.issuesFixed}`);
    console.log(`  Failed: ${fixResults.issuesFailed}`);
    console.log(`  Success Rate: ${((fixResults.issuesFixed / crawledResults.length) * 100).toFixed(1)}%`);
    console.log('\nFix Details:');
    
    fixResults.details.forEach((detail, index) => {
      console.log(`\n${index + 1}. ${detail.url}`);
      console.log(`   Action: ${detail.action}`);
      console.log(`   Message: ${detail.message}`);
    });
    console.log('\n---\n');

    // Step 6: Summary and recommendations
    console.log('Step 6: Summary and Recommendations\n');
    
    const totalPages = crawledResults.length + discoveredResults.length;
    const fixablePages = [...crawledResults, ...discoveredResults].filter(r => r.fixable).length;
    const qualityIssues = crawledResults.filter(r => r.primaryIssue === 'low-quality').length;
    const duplicateIssues = crawledResults.filter(r => r.primaryIssue === 'duplicate-content').length;
    const sitemapIssues = discoveredResults.filter(r => !r.inSitemap).length;
    
    console.log('Summary:');
    console.log(`  Total Pages Analyzed: ${totalPages}`);
    console.log(`  Crawled Pages: ${crawledResults.length}`);
    console.log(`  Discovered Pages: ${discoveredResults.length}`);
    console.log(`  Fixable Pages: ${fixablePages}`);
    console.log(`  Quality Issues: ${qualityIssues}`);
    console.log(`  Duplicate Issues: ${duplicateIssues}`);
    console.log(`  Sitemap Issues: ${sitemapIssues}`);
    
    console.log('\nRecommendations:');
    if (qualityIssues > 0) {
      console.log(`  - Enhance content on ${qualityIssues} pages (add words, headings, links)`);
    }
    if (duplicateIssues > 0) {
      console.log(`  - Add canonical tags or redirects for ${duplicateIssues} duplicate pages`);
    }
    if (sitemapIssues > 0) {
      console.log(`  - Add ${sitemapIssues} discovered pages to sitemap`);
    }
    if (fixablePages === totalPages) {
      console.log('  - All issues are fixable! Proceed with fixes.');
    } else {
      console.log(`  - ${totalPages - fixablePages} pages require manual review`);
    }
    
    console.log('\n---\n');

    // Clean up
    analyzer.clearCache();
    console.log('Cache cleared. Workflow complete!');

  } catch (error) {
    console.error('Error in workflow:', error.message);
    console.error(error.stack);
  }
}

// Run the workflow
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleCrawlWorkflow().catch(console.error);
}

export default exampleCrawlWorkflow;
