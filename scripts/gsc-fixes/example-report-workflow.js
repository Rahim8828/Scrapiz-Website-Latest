import Logger from './logger.js';
import ReportGenerator from './ReportGenerator.js';

/**
 * Example workflow for generating GSC issue reports
 */

async function exampleReportWorkflow() {
  console.log('=== Report Generator Example Workflow ===\n');
  
  // Initialize logger
  const logger = new Logger();
  await logger.initialize();
  
  // Initialize report generator
  const reportGenerator = new ReportGenerator(logger);
  await reportGenerator.initialize();
  
  // Example issue report data
  const issueReport = {
    timestamp: new Date(),
    totalPages: 50,
    issues: {
      soft404: [
        {
          url: 'https://example.com/thin-page',
          reason: 'thin-content',
          contentLength: 500,
          wordCount: 150,
          hasHeadings: false,
          hasInternalLinks: false,
          recommendation: 'Enhance content to at least 500 words (currently 150 words)',
          fixable: true
        },
        {
          url: 'https://example.com/empty-page',
          reason: 'empty-page',
          contentLength: 200,
          wordCount: 50,
          hasHeadings: false,
          hasInternalLinks: false,
          recommendation: 'Add substantial body content or return proper 404 status',
          fixable: true
        }
      ],
      canonical: [
        {
          url: 'https://example.com/page-without-canonical',
          currentCanonical: null,
          expectedCanonical: 'https://example.com/page-without-canonical',
          issueType: 'missing',
          inSitemap: true,
          recommendation: 'Add self-referencing canonical tag',
          fixable: true
        },
        {
          url: 'https://example.com/duplicate-page',
          currentCanonical: null,
          expectedCanonical: 'https://example.com/original-page',
          issueType: 'missing',
          inSitemap: false,
          recommendation: 'Add canonical tag pointing to original page',
          fixable: true
        }
      ],
      redirects: [
        {
          url: 'https://example.com/old-page',
          redirectChain: [
            'https://example.com/old-page',
            'https://example.com/intermediate-page',
            'https://example.com/new-page'
          ],
          finalDestination: 'https://example.com/new-page',
          redirectType: 301,
          inSitemap: true,
          internalLinksCount: 5,
          recommendation: 'Flatten redirect chain (3 redirects). Update sitemap and internal links to point to final destination',
          fixable: true
        },
        {
          url: 'https://example.com/temp-redirect',
          redirectChain: [
            'https://example.com/temp-redirect',
            'https://example.com/destination'
          ],
          finalDestination: 'https://example.com/destination',
          redirectType: 302,
          inSitemap: false,
          internalLinksCount: 2,
          recommendation: 'Change to 301 permanent redirect. Update sitemap and internal links to point to final destination',
          fixable: true
        }
      ],
      noindex: [
        {
          url: 'https://example.com/valuable-page',
          noindexSource: 'meta-tag',
          shouldBeIndexed: true,
          inSitemap: true,
          hasBacklinks: true,
          recommendation: 'Remove noindex tag - page has valuable content',
          fixable: true
        },
        {
          url: 'https://example.com/admin-page',
          noindexSource: 'meta-tag, http-header',
          shouldBeIndexed: false,
          inSitemap: false,
          hasBacklinks: false,
          recommendation: 'Keep noindex or improve content quality',
          fixable: false
        }
      ],
      duplicates: [
        {
          url: 'https://example.com/page?sort=asc',
          duplicateOf: 'https://example.com/page',
          similarityScore: 0.95,
          hasCanonical: false,
          canonicalTarget: null,
          recommendation: 'Add canonical tag pointing to https://example.com/page',
          fixable: true
        }
      ],
      crawled: [
        {
          url: 'https://example.com/crawled-page',
          reason: 'thin-content',
          recommendation: 'Enhance content to at least 500 words of unique, valuable information'
        }
      ],
      discovered: [
        {
          url: 'https://example.com/discovered-page',
          reason: 'not-in-sitemap',
          recommendation: 'Add to sitemap and improve internal linking'
        }
      ],
      notFound: [
        {
          url: 'https://example.com/deleted-page',
          hasBacklinks: true,
          internalLinksCount: 3,
          recommendation: 'Implement 301 redirect to most relevant existing page',
          fixable: true
        },
        {
          url: 'https://example.com/never-existed',
          hasBacklinks: false,
          internalLinksCount: 0,
          recommendation: 'Ensure it returns proper 404 status and is removed from sitemaps',
          fixable: true
        }
      ],
      invalidSchema: [
        {
          url: 'https://example.com/business-page',
          schemaType: 'LocalBusiness',
          errors: [
            {
              field: 'telephone',
              message: 'Missing required field',
              severity: 'error'
            },
            {
              field: 'address',
              message: 'Invalid format',
              severity: 'error'
            }
          ],
          fixable: true
        },
        {
          url: 'https://example.com/faq-page',
          schemaType: 'FAQPage',
          errors: [
            {
              field: 'acceptedAnswer',
              message: 'Missing required property',
              severity: 'error'
            }
          ],
          fixable: true
        }
      ]
    },
    summary: {
      totalIssues: 15,
      criticalIssues: 5,
      warningIssues: 7,
      fixableIssues: 12
    }
  };
  
  console.log('1. Generating Summary Report...\n');
  const summaryReport = reportGenerator.generateSummaryReport(issueReport);
  console.log(summaryReport);
  console.log('\n');
  
  console.log('2. Generating Detailed Report...\n');
  const detailedReport = reportGenerator.generateDetailedReport(issueReport);
  console.log(detailedReport.substring(0, 1000) + '...\n[Truncated for display]\n');
  
  console.log('3. Exporting to CSV...\n');
  const csvPath = await reportGenerator.exportToCSV(issueReport, 'example-issues.csv');
  console.log(`CSV exported to: ${csvPath}\n`);
  
  console.log('4. Exporting to JSON...\n');
  const jsonPath = await reportGenerator.exportToJSON(issueReport, 'example-issues.json');
  console.log(`JSON exported to: ${jsonPath}\n`);
  
  console.log('5. Generating Complete Report Package...\n');
  const reportPaths = await reportGenerator.generateCompleteReportPackage(
    issueReport,
    'example-complete-audit'
  );
  
  console.log('Complete report package generated:');
  console.log(`- Summary Report: ${reportPaths.summary}`);
  console.log(`- Detailed Report: ${reportPaths.detailed}`);
  console.log(`- CSV Report: ${reportPaths.csv}`);
  console.log(`- JSON Report: ${reportPaths.json}`);
  
  console.log('\n=== Workflow Complete ===');
}

// Run the example
exampleReportWorkflow().catch(error => {
  console.error('Error in example workflow:', error);
  process.exit(1);
});
