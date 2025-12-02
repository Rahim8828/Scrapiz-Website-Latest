import DuplicateDetector from './DuplicateDetector.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';

/**
 * Example workflow for duplicate content detection
 */

async function exampleDuplicateWorkflow() {
  // Initialize components
  const logger = new Logger();
  const errorHandler = new ErrorHandler(logger);
  const detector = new DuplicateDetector(logger, errorHandler);

  console.log('=== Duplicate Content Detection Workflow ===\n');

  // Example URLs with various duplicate scenarios
  const urls = [
    // Protocol variations
    'https://scrapiz.com/services/scrap-collection',
    'http://scrapiz.com/services/scrap-collection',
    
    // Trailing slash variations
    'https://scrapiz.com/locations/bandra',
    'https://scrapiz.com/locations/bandra/',
    
    // URL parameter variations
    'https://scrapiz.com/blog/article-1',
    'https://scrapiz.com/blog/article-1?utm_source=google',
    'https://scrapiz.com/blog/article-1?utm_campaign=summer',
    
    // Content duplicates (simulated)
    'https://scrapiz.com/scrap-dealer-in-bandra',
    'https://scrapiz.com/locations/bandra-east',
    
    // Unique pages
    'https://scrapiz.com/about',
    'https://scrapiz.com/contact'
  ];

  try {
    // 1. Check protocol consistency
    console.log('1. Checking Protocol Consistency...');
    const protocolAnalysis = detector.checkProtocolConsistency(urls);
    console.log(`   Total URLs: ${protocolAnalysis.totalUrls}`);
    console.log(`   HTTP URLs: ${protocolAnalysis.httpCount}`);
    console.log(`   HTTPS URLs: ${protocolAnalysis.httpsCount}`);
    console.log(`   Protocol issues: ${protocolAnalysis.duplicateProtocols.length}`);
    
    if (protocolAnalysis.hasProtocolIssues) {
      console.log('\n   Protocol Issues Found:');
      protocolAnalysis.duplicateProtocols.forEach((issue, index) => {
        console.log(`   ${index + 1}. Path: ${issue.path}`);
        console.log(`      URLs: ${issue.urls.join(', ')}`);
        console.log(`      Preferred: ${issue.preferredUrl}`);
      });
    }
    console.log(`   Recommendation: ${protocolAnalysis.recommendation}\n`);

    // 2. Check trailing slash consistency
    console.log('2. Checking Trailing Slash Consistency...');
    const trailingSlashAnalysis = detector.normalizeTrailingSlashes(urls);
    console.log(`   Total URLs: ${trailingSlashAnalysis.totalUrls}`);
    console.log(`   Trailing slash issues: ${trailingSlashAnalysis.trailingSlashIssues.length}`);
    
    if (trailingSlashAnalysis.hasIssues) {
      console.log('\n   Trailing Slash Issues Found:');
      trailingSlashAnalysis.trailingSlashIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. URLs: ${issue.urls.join(', ')}`);
        console.log(`      Preferred: ${issue.preferredUrl}`);
      });
    }
    console.log(`   Recommendation: ${trailingSlashAnalysis.recommendation}\n`);

    // 3. Normalize URL parameters
    console.log('3. Normalizing URL Parameters...');
    const urlsWithParams = urls.filter(url => url.includes('?'));
    console.log(`   URLs with parameters: ${urlsWithParams.length}`);
    
    urlsWithParams.forEach(url => {
      const normalized = detector.normalizeUrlParameters(url);
      if (normalized !== url) {
        console.log(`   Original:   ${url}`);
        console.log(`   Normalized: ${normalized}`);
      }
    });
    console.log();

    // 4. Select primary versions
    console.log('4. Testing Primary Version Selection...');
    const testGroups = [
      [
        'http://scrapiz.com/page',
        'https://scrapiz.com/page',
        'https://scrapiz.com/page/',
        'https://scrapiz.com/page?ref=home'
      ],
      [
        'https://scrapiz.com/services/scrap-collection/',
        'https://scrapiz.com/services/scrap-collection',
        'http://scrapiz.com/services/scrap-collection'
      ]
    ];

    testGroups.forEach((group, index) => {
      const primary = detector.selectPrimaryVersion(group);
      console.log(`   Group ${index + 1}:`);
      console.log(`   URLs: ${group.join(', ')}`);
      console.log(`   Selected Primary: ${primary}\n`);
    });

    // 5. Comprehensive duplicate analysis
    console.log('5. Running Comprehensive Duplicate Analysis...');
    console.log('   (Note: This would normally fetch and compare actual page content)');
    console.log('   For this example, we\'ll show the expected output format:\n');

    // Simulated analysis result
    const simulatedAnalysis = {
      totalUrls: urls.length,
      duplicateGroups: 3,
      protocolAnalysis,
      trailingSlashAnalysis,
      duplicateIssues: [
        {
          url: 'http://scrapiz.com/services/scrap-collection',
          duplicateOf: 'https://scrapiz.com/services/scrap-collection',
          duplicates: ['https://scrapiz.com/services/scrap-collection'],
          similarityScore: 1.0,
          hasCanonical: false,
          canonicalTarget: null,
          recommendation: 'Add canonical tag pointing to https://scrapiz.com/services/scrap-collection',
          fixable: true
        },
        {
          url: 'https://scrapiz.com/locations/bandra/',
          duplicateOf: 'https://scrapiz.com/locations/bandra',
          duplicates: ['https://scrapiz.com/locations/bandra'],
          similarityScore: 1.0,
          hasCanonical: false,
          canonicalTarget: null,
          recommendation: 'Add canonical tag pointing to https://scrapiz.com/locations/bandra',
          fixable: true
        },
        {
          url: 'https://scrapiz.com/blog/article-1?utm_source=google',
          duplicateOf: 'https://scrapiz.com/blog/article-1',
          duplicates: ['https://scrapiz.com/blog/article-1', 'https://scrapiz.com/blog/article-1?utm_campaign=summer'],
          similarityScore: 1.0,
          hasCanonical: false,
          canonicalTarget: null,
          recommendation: 'Add canonical tag pointing to https://scrapiz.com/blog/article-1',
          fixable: true
        }
      ],
      summary: {
        contentDuplicates: 3,
        protocolIssues: protocolAnalysis.duplicateProtocols.length,
        trailingSlashIssues: trailingSlashAnalysis.trailingSlashIssues.length,
        totalIssues: 3 + protocolAnalysis.duplicateProtocols.length + trailingSlashAnalysis.trailingSlashIssues.length
      }
    };

    console.log('   Analysis Summary:');
    console.log(`   - Total URLs analyzed: ${simulatedAnalysis.totalUrls}`);
    console.log(`   - Duplicate groups found: ${simulatedAnalysis.duplicateGroups}`);
    console.log(`   - Content duplicates: ${simulatedAnalysis.summary.contentDuplicates}`);
    console.log(`   - Protocol issues: ${simulatedAnalysis.summary.protocolIssues}`);
    console.log(`   - Trailing slash issues: ${simulatedAnalysis.summary.trailingSlashIssues}`);
    console.log(`   - Total issues: ${simulatedAnalysis.summary.totalIssues}\n`);

    // 6. Display duplicate issues
    console.log('6. Duplicate Issues Detail:');
    simulatedAnalysis.duplicateIssues.forEach((issue, index) => {
      console.log(`\n   Issue ${index + 1}:`);
      console.log(`   URL: ${issue.url}`);
      console.log(`   Duplicate of: ${issue.duplicateOf || 'N/A (this is primary)'}`);
      console.log(`   Similarity: ${(issue.similarityScore * 100).toFixed(1)}%`);
      console.log(`   Has canonical: ${issue.hasCanonical ? 'Yes' : 'No'}`);
      console.log(`   Recommendation: ${issue.recommendation}`);
      console.log(`   Fixable: ${issue.fixable ? 'Yes' : 'No'}`);
    });

    // 7. Generate fix recommendations
    console.log('\n\n7. Fix Recommendations:');
    console.log('   Based on the analysis, here are the recommended actions:\n');

    const fixActions = [];

    // Protocol issues
    if (protocolAnalysis.hasProtocolIssues) {
      protocolAnalysis.duplicateProtocols.forEach(issue => {
        const httpUrl = issue.urls.find(u => u.startsWith('http://'));
        if (httpUrl) {
          fixActions.push({
            type: 'canonical',
            url: httpUrl,
            action: `Add canonical tag pointing to ${issue.preferredUrl}`,
            priority: 'high'
          });
        }
      });
    }

    // Trailing slash issues
    if (trailingSlashAnalysis.hasIssues) {
      trailingSlashAnalysis.trailingSlashIssues.forEach(issue => {
        issue.urls.forEach(url => {
          if (url !== issue.preferredUrl) {
            fixActions.push({
              type: 'canonical',
              url,
              action: `Add canonical tag pointing to ${issue.preferredUrl}`,
              priority: 'medium'
            });
          }
        });
      });
    }

    // Content duplicates
    simulatedAnalysis.duplicateIssues.forEach(issue => {
      if (issue.duplicateOf) {
        fixActions.push({
          type: 'canonical',
          url: issue.url,
          action: issue.recommendation,
          priority: 'high'
        });
      }
    });

    // Group by priority
    const highPriority = fixActions.filter(a => a.priority === 'high');
    const mediumPriority = fixActions.filter(a => a.priority === 'medium');

    console.log(`   High Priority (${highPriority.length} actions):`);
    highPriority.forEach((action, index) => {
      console.log(`   ${index + 1}. ${action.url}`);
      console.log(`      Action: ${action.action}\n`);
    });

    console.log(`   Medium Priority (${mediumPriority.length} actions):`);
    mediumPriority.forEach((action, index) => {
      console.log(`   ${index + 1}. ${action.url}`);
      console.log(`      Action: ${action.action}\n`);
    });

    // 8. Summary
    console.log('\n8. Summary:');
    console.log(`   Total issues found: ${simulatedAnalysis.summary.totalIssues}`);
    console.log(`   Total fix actions required: ${fixActions.length}`);
    console.log(`   Estimated time to fix: ${Math.ceil(fixActions.length * 2)} minutes`);
    console.log('\n   Next steps:');
    console.log('   1. Review the duplicate groups to ensure primary version selection is correct');
    console.log('   2. Apply canonical tags to non-primary versions');
    console.log('   3. Update sitemap to include only primary versions');
    console.log('   4. Update internal links to point to primary versions');
    console.log('   5. Submit updated URLs to Google Search Console for re-indexing');

    // Clear cache
    detector.clearCache();
    console.log('\n   Cache cleared.');

  } catch (error) {
    console.error('Error in duplicate detection workflow:', error);
    throw error;
  }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  exampleDuplicateWorkflow()
    .then(() => {
      console.log('\n=== Workflow Complete ===');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n=== Workflow Failed ===');
      console.error(error);
      process.exit(1);
    });
}

export default exampleDuplicateWorkflow;
