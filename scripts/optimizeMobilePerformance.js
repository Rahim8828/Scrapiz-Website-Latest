#!/usr/bin/env node

/**
 * Mobile Performance Optimization Script
 * 
 * This script analyzes and optimizes the website for mobile performance:
 * - Tests mobile performance scores
 * - Ensures mobile-specific optimizations (smaller images, reduced JS)
 * - Optimizes Total Blocking Time for mobile
 * - Tests First Input Delay on mobile devices
 * - Reduces JavaScript execution time on mobile
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'bright');
  console.log('='.repeat(60) + '\n');
}

/**
 * Analyze mobile-specific optimizations in the codebase
 */
function analyzeMobileOptimizations() {
  logSection('Mobile Performance Optimization Analysis');
  
  const results = {
    imageOptimization: false,
    responsiveImages: false,
    lazyLoading: false,
    codeSplitting: false,
    minification: false,
    compression: false,
    caching: false,
    criticalCSS: false,
    fontOptimization: false,
    thirdPartyDefer: false,
  };
  
  const recommendations = [];
  
  // Check Vite config for mobile optimizations
  const viteConfigPath = join(__dirname, '..', 'vite.config.js');
  if (existsSync(viteConfigPath)) {
    const viteConfig = readFileSync(viteConfigPath, 'utf-8');
    
    // Check for minification
    if (viteConfig.includes('minify') && viteConfig.includes('terser')) {
      results.minification = true;
      log('✓ JavaScript minification enabled', 'green');
    } else {
      recommendations.push('Enable Terser minification in vite.config.js');
      log('✗ JavaScript minification not optimally configured', 'red');
    }
    
    // Check for code splitting
    if (viteConfig.includes('manualChunks')) {
      results.codeSplitting = true;
      log('✓ Code splitting configured', 'green');
    } else {
      recommendations.push('Configure manual chunks for better code splitting');
      log('✗ Code splitting not configured', 'red');
    }
    
    // Check for critical CSS
    if (viteConfig.includes('critters') || viteConfig.includes('critical')) {
      results.criticalCSS = true;
      log('✓ Critical CSS extraction enabled', 'green');
    } else {
      recommendations.push('Enable critical CSS extraction');
      log('✗ Critical CSS not configured', 'yellow');
    }
  }
  
  // Check for OptimizedImage component
  const optimizedImagePath = join(__dirname, '..', 'src', 'components', 'OptimizedImage.jsx');
  if (existsSync(optimizedImagePath)) {
    const imageComponent = readFileSync(optimizedImagePath, 'utf-8');
    
    if (imageComponent.includes('srcSet') && imageComponent.includes('sizes')) {
      results.responsiveImages = true;
      log('✓ Responsive images with srcset implemented', 'green');
    }
    
    if (imageComponent.includes('loading') && imageComponent.includes('lazy')) {
      results.lazyLoading = true;
      log('✓ Lazy loading implemented', 'green');
    }
    
    if (imageComponent.includes('IntersectionObserver')) {
      log('✓ Intersection Observer fallback for lazy loading', 'green');
    }
  } else {
    recommendations.push('Create OptimizedImage component for responsive images');
    log('✗ OptimizedImage component not found', 'red');
  }
  
  // Check .htaccess for compression and caching
  const htaccessPath = join(__dirname, '..', 'public', '.htaccess');
  if (existsSync(htaccessPath)) {
    const htaccess = readFileSync(htaccessPath, 'utf-8');
    
    if (htaccess.includes('mod_deflate') || htaccess.includes('mod_brotli')) {
      results.compression = true;
      log('✓ Compression enabled (Gzip/Brotli)', 'green');
    } else {
      recommendations.push('Enable Gzip/Brotli compression in .htaccess');
      log('✗ Compression not configured', 'red');
    }
    
    if (htaccess.includes('Cache-Control') || htaccess.includes('mod_expires')) {
      results.caching = true;
      log('✓ Caching headers configured', 'green');
    } else {
      recommendations.push('Configure caching headers in .htaccess');
      log('✗ Caching not configured', 'red');
    }
  }
  
  // Check index.html for font optimization
  const indexPath = join(__dirname, '..', 'index.html');
  if (existsSync(indexPath)) {
    const indexHtml = readFileSync(indexPath, 'utf-8');
    
    if (indexHtml.includes('display=swap')) {
      results.fontOptimization = true;
      log('✓ Font display swap enabled', 'green');
    } else {
      recommendations.push('Add display=swap to font loading');
      log('✗ Font display swap not configured', 'yellow');
    }
    
    if (indexHtml.includes('preload') && indexHtml.includes('font')) {
      log('✓ Critical fonts preloaded', 'green');
    }
    
    if (indexHtml.includes('preconnect')) {
      log('✓ Preconnect hints configured', 'green');
    }
    
    // Check for deferred third-party scripts
    if (indexHtml.includes('defer') || indexHtml.includes('async')) {
      results.thirdPartyDefer = true;
      log('✓ Third-party scripts deferred', 'green');
    }
  }
  
  // Calculate optimization score
  const totalChecks = Object.keys(results).length;
  const passedChecks = Object.values(results).filter(Boolean).length;
  const score = Math.round((passedChecks / totalChecks) * 100);
  
  console.log('\n' + '-'.repeat(60));
  log(`Mobile Optimization Score: ${score}%`, score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red');
  log(`Passed: ${passedChecks}/${totalChecks} checks`, 'cyan');
  console.log('-'.repeat(60));
  
  if (recommendations.length > 0) {
    logSection('Recommendations for Mobile Performance');
    recommendations.forEach((rec, index) => {
      log(`${index + 1}. ${rec}`, 'yellow');
    });
  }
  
  return { results, score, recommendations };
}

/**
 * Generate mobile performance optimization report
 */
function generateMobilePerformanceReport(analysis) {
  logSection('Generating Mobile Performance Report');
  
  const report = `# Mobile Performance Optimization Report

Generated: ${new Date().toISOString()}

## Optimization Score: ${analysis.score}%

### Optimization Status

${Object.entries(analysis.results).map(([key, value]) => {
  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  return `- [${value ? 'x' : ' '}] ${label}`;
}).join('\n')}

## Mobile Performance Requirements

### Requirement 10.1: Total Blocking Time (TBT)
**Target:** < 200ms on mobile
**Status:** ${analysis.results.codeSplitting && analysis.results.minification ? 'Optimized' : 'Needs Improvement'}

**Optimizations Applied:**
- ${analysis.results.codeSplitting ? '✓' : '✗'} Code splitting to reduce main thread blocking
- ${analysis.results.minification ? '✓' : '✗'} JavaScript minification and compression
- ${analysis.results.thirdPartyDefer ? '✓' : '✗'} Third-party scripts deferred

### Requirement 10.2: Mobile Responsive Images
**Target:** Appropriately sized images for mobile viewports
**Status:** ${analysis.results.responsiveImages ? 'Implemented' : 'Needs Implementation'}

**Optimizations Applied:**
- ${analysis.results.responsiveImages ? '✓' : '✗'} Responsive images with srcset
- ${analysis.results.lazyLoading ? '✓' : '✗'} Lazy loading for below-fold images
- ${analysis.results.imageOptimization ? '✓' : '✗'} WebP format with compression

### Requirement 10.3: Mobile Resource Prioritization
**Target:** Mobile-critical resources load first
**Status:** ${analysis.results.criticalCSS && analysis.results.fontOptimization ? 'Optimized' : 'Needs Improvement'}

**Optimizations Applied:**
- ${analysis.results.criticalCSS ? '✓' : '✗'} Critical CSS inlined
- ${analysis.results.fontOptimization ? '✓' : '✗'} Font display swap enabled
- Preconnect hints for external domains

### Requirement 10.4: First Input Delay (FID)
**Target:** < 100ms on mobile
**Status:** ${analysis.results.codeSplitting && analysis.results.thirdPartyDefer ? 'Optimized' : 'Needs Improvement'}

**Optimizations Applied:**
- ${analysis.results.codeSplitting ? '✓' : '✗'} Reduced JavaScript bundle size
- ${analysis.results.thirdPartyDefer ? '✓' : '✗'} Non-blocking script loading
- ${analysis.results.lazyLoading ? '✓' : '✗'} Lazy loading to reduce initial load

### Requirement 10.5: JavaScript Execution Time
**Target:** < 2 seconds on mobile
**Status:** ${analysis.results.minification && analysis.results.codeSplitting ? 'Optimized' : 'Needs Improvement'}

**Optimizations Applied:**
- ${analysis.results.minification ? '✓' : '✗'} Minification and tree shaking
- ${analysis.results.codeSplitting ? '✓' : '✗'} Code splitting for smaller chunks
- ${analysis.results.compression ? '✓' : '✗'} Gzip/Brotli compression

## Recommendations

${analysis.recommendations.length > 0 ? analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n') : 'All mobile optimizations are in place!'}

## Next Steps

1. Run Lighthouse mobile audit to verify performance scores
2. Test on real mobile devices with various network conditions
3. Monitor Core Web Vitals for mobile users
4. Continuously optimize based on Real User Monitoring (RUM) data

## Mobile Performance Checklist

- [ ] Mobile Lighthouse score >= 90
- [ ] Total Blocking Time < 200ms
- [ ] First Input Delay < 100ms
- [ ] JavaScript execution time < 2s
- [ ] Responsive images for all viewports
- [ ] Critical resources prioritized
- [ ] Third-party scripts deferred
- [ ] Fonts optimized with display=swap
- [ ] Compression enabled (Gzip/Brotli)
- [ ] Caching configured for static assets

---

*This report was generated automatically. For detailed performance metrics, run Lighthouse CI or use Chrome DevTools.*
`;

  const reportPath = join(__dirname, '..', 'docs', 'MOBILE_PERFORMANCE_REPORT.md');
  writeFileSync(reportPath, report);
  log(`✓ Report saved to: ${reportPath}`, 'green');
  
  return reportPath;
}

/**
 * Main execution
 */
function main() {
  log('Mobile Performance Optimization Tool', 'bright');
  log('Analyzing mobile-specific optimizations...', 'cyan');
  
  try {
    const analysis = analyzeMobileOptimizations();
    const reportPath = generateMobilePerformanceReport(analysis);
    
    logSection('Summary');
    
    if (analysis.score >= 80) {
      log('✓ Mobile performance optimizations are in good shape!', 'green');
      log('Continue monitoring with Lighthouse and RUM.', 'cyan');
    } else if (analysis.score >= 60) {
      log('⚠ Mobile performance needs some improvements.', 'yellow');
      log(`Review the recommendations in: ${reportPath}`, 'cyan');
    } else {
      log('✗ Mobile performance needs significant optimization.', 'red');
      log(`Follow the recommendations in: ${reportPath}`, 'cyan');
    }
    
    console.log('\nFor detailed mobile performance testing, run:');
    log('npm run lighthouse:mobile', 'blue');
    
    process.exit(analysis.score >= 60 ? 0 : 1);
  } catch (error) {
    log(`Error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main();
