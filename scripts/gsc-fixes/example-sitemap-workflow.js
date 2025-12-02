import SitemapManager from './SitemapManager.js';
import Logger from './logger.js';
import ErrorHandler from './errorHandler.js';
import axios from 'axios';

/**
 * Example workflow for Sitemap Manager
 * Demonstrates parsing, validation, cleaning, and updating sitemap
 */

async function main() {
  console.log('🗺️  Sitemap Manager Example Workflow\n');
  console.log('='.repeat(60));

  // Initialize dependencies
  const logger = new Logger();
  await logger.initialize();

  const errorHandler = new ErrorHandler(logger);
  await errorHandler.initialize();

  const sitemapManager = new SitemapManager(logger, errorHandler);

  try {
    // Step 1: Parse existing sitemap
    console.log('\n📖 Step 1: Parsing existing sitemap...');
    const parsed = await sitemapManager.parseSitemap();
    const urls = sitemapManager.extractUrls(parsed);
    console.log(`✅ Found ${urls.length} URLs in sitemap`);

    // Step 2: Validate sitemap structure
    console.log('\n🔍 Step 2: Validating sitemap structure...');
    const structureValidation = await sitemapManager.validateStructure();
    if (structureValidation.valid) {
      console.log('✅ Sitemap structure is valid');
    } else {
      console.log('⚠️  Sitemap structure has issues:');
      structureValidation.issues.forEach(issue => {
        console.log(`   ${issue.severity}: ${issue.message}`);
      });
    }

    // Step 3: Get sitemap statistics
    console.log('\n📊 Step 3: Getting sitemap statistics...');
    const stats = await sitemapManager.getStatistics();
    console.log(`✅ Total URLs: ${stats.totalUrls}`);
    console.log(`   With lastmod: ${stats.withLastmod}`);
    console.log(`   With priority: ${stats.withPriority}`);
    console.log(`   With changefreq: ${stats.withChangefreq}`);
    console.log('   By priority:', stats.byPriority);
    console.log('   By changefreq:', stats.byChangefreq);

    // Step 4: Validate URLs (with simple status checker)
    console.log('\n🔍 Step 4: Validating sitemap URLs...');
    
    // Simple status checker that checks a few URLs
    const statusChecker = async (url) => {
      try {
        const response = await axios.get(url, {
          maxRedirects: 0,
          validateStatus: () => true,
          timeout: 5000
        });

        return {
          status: response.status,
          noindex: false, // Would need to parse HTML to check
          isRedirect: response.status >= 300 && response.status < 400,
          finalUrl: url
        };
      } catch (error) {
        if (error.response) {
          return {
            status: error.response.status,
            noindex: false,
            isRedirect: error.response.status >= 300 && error.response.status < 400,
            finalUrl: url
          };
        }
        throw error;
      }
    };

    // Validate first 5 URLs as example
    const urlsToValidate = urls.slice(0, 5);
    console.log(`   Validating ${urlsToValidate.length} URLs (sample)...`);
    const issues = await sitemapManager.validateSitemap(urlsToValidate, statusChecker);
    
    if (issues.length === 0) {
      console.log('✅ No issues found in sample URLs');
    } else {
      console.log(`⚠️  Found ${issues.length} issues:`);
      issues.forEach(issue => {
        console.log(`   ${issue.severity}: ${issue.url} - ${issue.message}`);
      });
    }

    // Step 5: Example - Clean sitemap (dry run)
    console.log('\n🧹 Step 5: Example sitemap cleaning (dry run)...');
    const urlsToRemove = issues
      .filter(i => i.severity === 'error')
      .map(i => i.url);
    
    if (urlsToRemove.length > 0) {
      console.log(`   Would remove ${urlsToRemove.length} URLs:`);
      urlsToRemove.forEach(url => console.log(`   - ${url}`));
      console.log('   (Skipping actual removal in example)');
    } else {
      console.log('   No URLs to remove');
    }

    // Step 6: Example - Add new URL
    console.log('\n➕ Step 6: Example adding new URL (dry run)...');
    const newPages = [
      {
        url: 'https://www.scrapiz.in/example-new-page',
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.7',
        changefreq: 'monthly'
      }
    ];
    console.log(`   Would add: ${newPages[0].url}`);
    console.log('   (Skipping actual addition in example)');

    // Step 7: Example - Update URL
    console.log('\n✏️  Step 7: Example updating URL (dry run)...');
    if (urls.length > 0) {
      const urlToUpdate = urls[0].loc;
      console.log(`   Would update: ${urlToUpdate}`);
      console.log('   New lastmod:', new Date().toISOString().split('T')[0]);
      console.log('   (Skipping actual update in example)');
    }

    // Step 8: Generate sample sitemap
    console.log('\n📝 Step 8: Generating sample sitemap...');
    const samplePages = [
      {
        url: 'https://www.scrapiz.in/',
        lastmod: '2025-12-01',
        priority: '1.0',
        changefreq: 'weekly'
      },
      {
        url: 'https://www.scrapiz.in/about',
        lastmod: '2025-12-01',
        priority: '0.8',
        changefreq: 'monthly'
      },
      {
        url: 'https://www.scrapiz.in/contact',
        lastmod: '2025-12-01',
        priority: '0.8',
        changefreq: 'monthly'
      }
    ];

    const sampleXml = sitemapManager.generateSitemap(samplePages);
    console.log('✅ Sample sitemap generated:');
    console.log(sampleXml.substring(0, 500) + '...');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Workflow completed successfully!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error in workflow:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default main;
