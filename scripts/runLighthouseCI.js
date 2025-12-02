#!/usr/bin/env node

/**
 * Lighthouse CI Runner Script
 * 
 * This script runs Lighthouse CI tests and generates performance reports.
 * It can be used locally or in CI/CD pipelines.
 * 
 * Usage:
 *   node scripts/runLighthouseCI.js [options]
 * 
 * Options:
 *   --mobile    Run mobile tests only
 *   --desktop   Run desktop tests only
 *   --all       Run both mobile and desktop tests (default)
 *   --urls      Comma-separated list of URLs to test
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const options = {
  mobile: args.includes('--mobile'),
  desktop: args.includes('--desktop'),
  all: args.includes('--all') || (!args.includes('--mobile') && !args.includes('--desktop')),
  urls: args.find(arg => arg.startsWith('--urls='))?.split('=')[1]?.split(',') || null,
};

console.log('🚀 Starting Lighthouse CI Runner...\n');

// Ensure build exists
console.log('📦 Building the site...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Function to run Lighthouse CI
function runLighthouseCI(config, name) {
  console.log(`\n🔍 Running Lighthouse CI - ${name}...`);
  console.log('━'.repeat(50));
  
  try {
    const command = `lhci autorun --config=${config}`;
    execSync(command, { stdio: 'inherit' });
    console.log(`\n✅ ${name} tests completed successfully`);
    return true;
  } catch (error) {
    console.error(`\n❌ ${name} tests failed`);
    console.error('Error:', error.message);
    return false;
  }
}

// Function to generate summary report
function generateSummaryReport() {
  console.log('\n📊 Generating summary report...');
  
  const lighthouseDir = '.lighthouseci';
  if (!fs.existsSync(lighthouseDir)) {
    console.log('⚠️  No Lighthouse results found');
    return;
  }

  try {
    const files = fs.readdirSync(lighthouseDir);
    const manifestFiles = files.filter(f => f.startsWith('manifest') && f.endsWith('.json'));
    
    if (manifestFiles.length === 0) {
      console.log('⚠️  No manifest files found');
      return;
    }

    console.log('\n📈 Performance Summary:');
    console.log('━'.repeat(50));

    manifestFiles.forEach(manifestFile => {
      const manifestPath = path.join(lighthouseDir, manifestFile);
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      manifest.forEach(entry => {
        if (entry.summary) {
          const url = new URL(entry.url).pathname || '/';
          console.log(`\n📄 ${url}`);
          console.log(`   Performance: ${Math.round(entry.summary.performance * 100)}/100`);
          console.log(`   Accessibility: ${Math.round(entry.summary.accessibility * 100)}/100`);
          console.log(`   Best Practices: ${Math.round(entry.summary['best-practices'] * 100)}/100`);
          console.log(`   SEO: ${Math.round(entry.summary.seo * 100)}/100`);
        }
      });
    });

    console.log('\n━'.repeat(50));
    console.log('✅ Summary report generated');
    console.log(`📁 Full results available in: ${lighthouseDir}/`);
  } catch (error) {
    console.error('❌ Error generating summary:', error.message);
  }
}

// Run tests based on options
let desktopSuccess = true;
let mobileSuccess = true;

if (options.all || options.desktop) {
  desktopSuccess = runLighthouseCI('lighthouserc.js', 'Desktop');
}

if (options.all || options.mobile) {
  mobileSuccess = runLighthouseCI('lighthouserc.mobile.js', 'Mobile');
}

// Generate summary report
generateSummaryReport();

// Final status
console.log('\n' + '='.repeat(50));
if (desktopSuccess && mobileSuccess) {
  console.log('✅ All Lighthouse CI tests passed!');
  console.log('='.repeat(50) + '\n');
  process.exit(0);
} else {
  console.log('❌ Some Lighthouse CI tests failed');
  console.log('='.repeat(50) + '\n');
  process.exit(1);
}
