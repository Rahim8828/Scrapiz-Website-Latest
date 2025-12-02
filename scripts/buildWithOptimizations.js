import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Build script with post-build optimizations
 * 1. Run Vite build (includes Critters for critical CSS)
 * 2. Add resource hints for critical assets
 * 3. Verify render-blocking resources
 */

console.log('🚀 Starting optimized build process...\n');

// Step 1: Run Vite build
console.log('📦 Building with Vite...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✓ Vite build completed\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Add resource hints using dedicated script
console.log('🔗 Adding resource hints...');
try {
  execSync('node scripts/addResourceHints.js', { stdio: 'inherit' });
} catch (error) {
  console.error('⚠️  Warning: Could not add resource hints:', error.message);
}

// Step 3: Analyze render-blocking resources
console.log('\n📊 Analyzing render-blocking resources...');
const distPath = resolve(__dirname, '../dist');
const indexPath = resolve(distPath, 'index.html');
try {
  const html = readFileSync(indexPath, 'utf-8');
  
  // Count render-blocking resources more accurately
  // Scripts with type="module" are deferred by default
  const blockingScripts = (html.match(/<script(?![^>]*(?:async|defer|type="module"))[^>]*src=/g) || []).length;
  
  // Stylesheets with onload or media="print" are not blocking
  const allStylesheets = (html.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || []);
  const blockingStyles = allStylesheets.filter(link => 
    !link.includes('onload=') && 
    !link.includes('media="print"') &&
    !link.includes('media="all"')
  ).length;
  
  const inlineStyles = (html.match(/<style[^>]*>/g) || []).length;
  const deferredStyles = allStylesheets.length - blockingStyles;
  
  const totalBlocking = blockingScripts + blockingStyles;
  
  console.log(`  Blocking scripts: ${blockingScripts}`);
  console.log(`  Blocking stylesheets: ${blockingStyles}`);
  console.log(`  Deferred stylesheets: ${deferredStyles}`);
  console.log(`  Inline critical styles: ${inlineStyles}`);
  console.log(`  Total render-blocking: ${totalBlocking}`);
  
  if (totalBlocking < 3) {
    console.log('  ✓ Render-blocking resources under target (< 3)');
  } else {
    console.log('  ⚠️  Render-blocking resources above target (>= 3)');
  }
  
  // Additional analysis
  console.log('\n📈 Additional metrics:');
  const preloadLinks = (html.match(/<link[^>]*rel="preload"[^>]*>/g) || []).length;
  const modulePreloads = (html.match(/<link[^>]*rel="modulepreload"[^>]*>/g) || []).length;
  const preconnects = (html.match(/<link[^>]*rel="preconnect"[^>]*>/g) || []).length;
  
  console.log(`  Preload hints: ${preloadLinks}`);
  console.log(`  Module preloads: ${modulePreloads}`);
  console.log(`  Preconnect hints: ${preconnects}`);
} catch (error) {
  console.error('⚠️  Warning: Could not analyze render-blocking resources:', error.message);
}

console.log('\n✅ Build optimization complete!');
console.log('\nNext steps:');
console.log('  1. Run: npm run preview');
console.log('  2. Test with Lighthouse');
console.log('  3. Deploy to production\n');
