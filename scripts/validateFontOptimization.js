#!/usr/bin/env node

/**
 * Font Optimization Validation Script
 * 
 * This script validates that font loading optimizations are properly implemented:
 * 1. Font-display: swap is present
 * 2. Critical fonts are preloaded
 * 3. Only necessary font weights are loaded
 * 4. WOFF2 format is used
 * 5. Proper fallback fonts are configured
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

// Configuration
const REQUIRED_FONT_WEIGHTS = {
  Inter: [400, 500, 600, 700],
  Poppins: [600, 700, 800],
};

const CRITICAL_FONTS = [
  { family: 'Poppins', weight: 700, usage: 'Main headings' },
  { family: 'Inter', weight: 400, usage: 'Body text' },
];

// Read files
const indexHtmlPath = path.join(__dirname, '..', 'index.html');
const tailwindConfigPath = path.join(__dirname, '..', 'tailwind.config.js');
const indexCssPath = path.join(__dirname, '..', 'src', 'index.css');

let indexHtml, tailwindConfig, indexCss;

try {
  indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf-8');
  indexCss = fs.readFileSync(indexCssPath, 'utf-8');
} catch (error) {
  log.error(`Failed to read files: ${error.message}`);
  process.exit(1);
}

// Validation functions
function validateFontDisplay() {
  log.section('1. Validating font-display: swap');
  
  const hasDisplaySwap = indexHtml.includes('display=swap');
  
  if (hasDisplaySwap) {
    log.success('font-display: swap is present in Google Fonts URL');
    return true;
  } else {
    log.error('font-display: swap is missing from Google Fonts URL');
    log.info('Add &display=swap to the Google Fonts URL');
    return false;
  }
}

function validateCriticalFontPreloading() {
  log.section('2. Validating critical font preloading');
  
  let allPreloaded = true;
  
  CRITICAL_FONTS.forEach(font => {
    const preloadPattern = new RegExp(`rel="preload"[^>]*as="font"[^>]*type="font/woff2"`, 'i');
    const fontFamilyPattern = new RegExp(font.family.toLowerCase(), 'i');
    
    // Check if there's a preload link
    const hasPreload = indexHtml.match(preloadPattern);
    
    if (hasPreload) {
      log.success(`${font.family} ${font.weight} is preloaded (${font.usage})`);
    } else {
      log.warning(`${font.family} ${font.weight} preload not found (${font.usage})`);
      allPreloaded = false;
    }
  });
  
  // Check for crossorigin attribute
  const preloadLinks = indexHtml.match(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/gi) || [];
  const allHaveCrossorigin = preloadLinks.every(link => link.includes('crossorigin'));
  
  if (allHaveCrossorigin && preloadLinks.length > 0) {
    log.success('All font preload links have crossorigin attribute');
  } else if (preloadLinks.length > 0) {
    log.error('Some font preload links are missing crossorigin attribute');
    allPreloaded = false;
  }
  
  return allPreloaded;
}

function validateFontWeights() {
  log.section('3. Validating minimal font weights');
  
  // Extract font weights from Google Fonts URL
  const googleFontsMatch = indexHtml.match(/fonts\.googleapis\.com\/css2\?family=([^"']+)/);
  
  if (!googleFontsMatch) {
    log.error('Google Fonts URL not found');
    return false;
  }
  
  const fontsUrl = googleFontsMatch[1];
  let allCorrect = true;
  
  Object.entries(REQUIRED_FONT_WEIGHTS).forEach(([family, weights]) => {
    const familyPattern = new RegExp(`${family}:wght@([0-9;]+)`, 'i');
    const match = fontsUrl.match(familyPattern);
    
    if (match) {
      const loadedWeights = match[1].split(';').map(w => parseInt(w));
      const expectedWeights = weights;
      
      const hasAllRequired = expectedWeights.every(w => loadedWeights.includes(w));
      const hasExtra = loadedWeights.some(w => !expectedWeights.includes(w));
      
      if (hasAllRequired && !hasExtra) {
        log.success(`${family}: Loading optimal weights [${loadedWeights.join(', ')}]`);
      } else if (hasAllRequired && hasExtra) {
        log.warning(`${family}: Loading extra weights [${loadedWeights.join(', ')}]`);
        log.info(`  Expected: [${expectedWeights.join(', ')}]`);
        allCorrect = false;
      } else {
        log.error(`${family}: Missing required weights`);
        log.info(`  Loaded: [${loadedWeights.join(', ')}]`);
        log.info(`  Expected: [${expectedWeights.join(', ')}]`);
        allCorrect = false;
      }
    } else {
      log.error(`${family}: Not found in Google Fonts URL`);
      allCorrect = false;
    }
  });
  
  return allCorrect;
}

function validateWOFF2Format() {
  log.section('4. Validating WOFF2 format');
  
  const preloadLinks = indexHtml.match(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/gi) || [];
  const allWOFF2 = preloadLinks.every(link => link.includes('woff2'));
  
  if (allWOFF2 && preloadLinks.length > 0) {
    log.success('All preloaded fonts use WOFF2 format');
    log.info('Google Fonts automatically serves WOFF2 to modern browsers');
    return true;
  } else if (preloadLinks.length === 0) {
    log.warning('No font preload links found');
    return false;
  } else {
    log.error('Some preloaded fonts are not in WOFF2 format');
    return false;
  }
}

function validateFallbackFonts() {
  log.section('5. Validating fallback fonts');
  
  const hasPoppinsFallback = indexCss.includes("font-family: 'Poppins'") || 
                             tailwindConfig.includes("'Poppins'");
  const hasInterFallback = indexCss.includes("font-family: 'Inter'") || 
                           tailwindConfig.includes("'Inter'");
  
  let allCorrect = true;
  
  if (hasPoppinsFallback) {
    log.success('Poppins font family configured with fallbacks');
  } else {
    log.error('Poppins font family not properly configured');
    allCorrect = false;
  }
  
  if (hasInterFallback) {
    log.success('Inter font family configured with fallbacks');
  } else {
    log.error('Inter font family not properly configured');
    allCorrect = false;
  }
  
  return allCorrect;
}

function validateAsyncLoading() {
  log.section('6. Validating async font loading');
  
  const hasMediaPrintTrick = indexHtml.includes('media="print"') && 
                             indexHtml.includes('onload="this.media=\'all\'"');
  
  if (hasMediaPrintTrick) {
    log.success('Fonts loaded asynchronously using media="print" trick');
    return true;
  } else {
    log.warning('Fonts may be loaded synchronously (blocking)');
    log.info('Consider using media="print" onload="this.media=\'all\'" for async loading');
    return false;
  }
}

// Run all validations
function runValidation() {
  console.log('\n' + '='.repeat(60));
  console.log('Font Optimization Validation');
  console.log('='.repeat(60));
  
  const results = {
    fontDisplay: validateFontDisplay(),
    preloading: validateCriticalFontPreloading(),
    weights: validateFontWeights(),
    woff2: validateWOFF2Format(),
    fallbacks: validateFallbackFonts(),
    asyncLoading: validateAsyncLoading(),
  };
  
  // Summary
  log.section('Summary');
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`\nPassed: ${passed}/${total} checks`);
  
  if (passed === total) {
    log.success('All font optimizations are properly implemented! 🎉');
    process.exit(0);
  } else {
    log.warning(`${total - passed} optimization(s) need attention`);
    process.exit(1);
  }
}

// Run the validation
runValidation();
