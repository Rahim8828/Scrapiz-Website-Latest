#!/usr/bin/env node

/**
 * Analyze Thin Content Pages
 * Identifies pages with < 500 words and provides recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../../src');
const MIN_WORD_COUNT = 500;

/**
 * Extract text content from JSX file
 */
function extractTextFromJSX(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove imports, exports, and JavaScript code
  let textContent = content
    .replace(/import\s+.*?from\s+['"].*?['"];?/g, '')
    .replace(/export\s+(default\s+)?/g, '')
    .replace(/const\s+\w+\s*=\s*\{[^}]*\};?/g, '')
    .replace(/const\s+\w+\s*=\s*\[[^\]]*\];?/g, '')
    .replace(/const\s+\w+\s*=\s*['"`].*?['"`];?/g, '')
    .replace(/function\s+\w+\s*\([^)]*\)\s*\{/g, '')
    .replace(/\}\s*;?/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Extract text from JSX tags
  const textMatches = textContent.match(/>[^<>]+</g) || [];
  const extractedText = textMatches
    .map(match => match.slice(1, -1).trim())
    .filter(text => text.length > 0)
    .join(' ');
  
  return extractedText;
}

/**
 * Count words in text
 */
function countWords(text) {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Check if file has proper heading structure
 */
function hasProperHeadings(content) {
  const hasH1 = /<h1[^>]*>|<Heading[^>]*level="1"|className="[^"]*text-4xl/i.test(content);
  const hasH2 = /<h2[^>]*>|<Heading[^>]*level="2"|className="[^"]*text-3xl/i.test(content);
  return { hasH1, hasH2 };
}

/**
 * Analyze a single page file
 */
function analyzePage(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const text = extractTextFromJSX(filePath);
  const wordCount = countWords(text);
  const headings = hasProperHeadings(content);
  
  return {
    file: path.relative(SRC_DIR, filePath),
    wordCount,
    isThin: wordCount < MIN_WORD_COUNT,
    hasH1: headings.hasH1,
    hasH2: headings.hasH2,
    needsHeadings: !headings.hasH1 || !headings.hasH2
  };
}

/**
 * Recursively find all JSX files
 */
function findJSXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, dist, etc.
      if (!['node_modules', 'dist', '.git', 'public'].includes(file)) {
        findJSXFiles(filePath, fileList);
      }
    } else if (file.endsWith('.jsx') && !file.includes('.test.')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Main analysis function
 */
function analyzeThinContent() {
  console.log('🔍 Analyzing pages for thin content...\n');
  
  const jsxFiles = findJSXFiles(SRC_DIR);
  const results = jsxFiles.map(analyzePage);
  
  // Filter thin content pages
  const thinPages = results.filter(r => r.isThin);
  const pagesNeedingHeadings = results.filter(r => r.needsHeadings);
  
  console.log(`📊 Analysis Results:`);
  console.log(`   Total pages analyzed: ${results.length}`);
  console.log(`   Pages with < ${MIN_WORD_COUNT} words: ${thinPages.length}`);
  console.log(`   Pages needing heading improvements: ${pagesNeedingHeadings.length}\n`);
  
  if (thinPages.length > 0) {
    console.log('📄 Thin Content Pages (< 500 words):\n');
    thinPages
      .sort((a, b) => a.wordCount - b.wordCount)
      .forEach(page => {
        console.log(`   ${page.file}`);
        console.log(`      Words: ${page.wordCount}`);
        console.log(`      H1: ${page.hasH1 ? '✓' : '✗'}, H2: ${page.hasH2 ? '✓' : '✗'}`);
        console.log('');
      });
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalPages: results.length,
    thinPages: thinPages.map(p => ({
      file: p.file,
      wordCount: p.wordCount,
      hasH1: p.hasH1,
      hasH2: p.hasH2
    })),
    pagesNeedingHeadings: pagesNeedingHeadings.map(p => ({
      file: p.file,
      hasH1: p.hasH1,
      hasH2: p.hasH2
    }))
  };
  
  const reportPath = path.join(__dirname, 'reports', 'thin-content-analysis.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`✅ Report saved to: ${reportPath}\n`);
  
  return report;
}

// Run analysis
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeThinContent();
}

export { analyzeThinContent, analyzePage, countWords };
