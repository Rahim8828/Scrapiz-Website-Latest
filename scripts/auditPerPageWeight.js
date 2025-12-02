import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Parse HTML to find referenced assets
function parseHtmlAssets(htmlPath) {
  const html = readFileSync(htmlPath, 'utf-8');
  const assets = {
    js: [],
    css: [],
    images: [],
    fonts: []
  };
  
  // Find JS files
  const jsMatches = html.matchAll(/<script[^>]+src="([^"]+)"/g);
  for (const match of jsMatches) {
    assets.js.push(match[1]);
  }
  
  // Find CSS files
  const cssMatches = html.matchAll(/<link[^>]+href="([^"]+\.css)"/g);
  for (const match of cssMatches) {
    assets.css.push(match[1]);
  }
  
  // Find preloaded images
  const imgPreloadMatches = html.matchAll(/<link[^>]+rel="preload"[^>]+as="image"[^>]+href="([^"]+)"/g);
  for (const match of imgPreloadMatches) {
    assets.images.push(match[1]);
  }
  
  // Find fonts
  const fontMatches = html.matchAll(/<link[^>]+rel="preload"[^>]+as="font"[^>]+href="([^"]+)"/g);
  for (const match of fontMatches) {
    assets.fonts.push(match[1]);
  }
  
  return assets;
}

// Get file size
function getFileSize(path) {
  try {
    const stat = statSync(path);
    return stat.size;
  } catch (error) {
    return 0;
  }
}

// Analyze a single page
function analyzePage(htmlPath, distPath) {
  const assets = parseHtmlAssets(htmlPath);
  const sizes = {
    html: getFileSize(htmlPath),
    js: 0,
    css: 0,
    images: 0,
    fonts: 0
  };
  
  let requestCount = 1; // HTML itself
  
  // Calculate JS sizes
  assets.js.forEach(jsFile => {
    const fullPath = join(distPath, jsFile.replace(/^\//, ''));
    sizes.js += getFileSize(fullPath);
    requestCount++;
  });
  
  // Calculate CSS sizes
  assets.css.forEach(cssFile => {
    const fullPath = join(distPath, cssFile.replace(/^\//, ''));
    sizes.css += getFileSize(fullPath);
    requestCount++;
  });
  
  // Calculate image sizes
  assets.images.forEach(imgFile => {
    const fullPath = join(distPath, imgFile.replace(/^\//, ''));
    sizes.images += getFileSize(fullPath);
    requestCount++;
  });
  
  // Calculate font sizes
  assets.fonts.forEach(fontFile => {
    const fullPath = join(distPath, fontFile.replace(/^\//, ''));
    sizes.fonts += getFileSize(fullPath);
    requestCount++;
  });
  
  const totalSize = Object.values(sizes).reduce((sum, size) => sum + size, 0);
  
  return {
    sizes,
    totalSize,
    requestCount,
    assets
  };
}

// Main audit
console.log('🔍 Auditing Per-Page Weight and Requests...\n');

const distPath = join(__dirname, '../dist');
const indexPath = join(distPath, 'index.html');

if (!existsSync(indexPath)) {
  console.error('❌ dist/index.html not found. Run npm run build first.');
  process.exit(1);
}

const result = analyzePage(indexPath, distPath);

console.log('📊 Home Page Analysis\n');
console.log('=' .repeat(60));

console.log('\n📈 Summary:');
console.log(`Total Requests: ${result.requestCount}`);
console.log(`Total Size: ${formatBytes(result.totalSize)}`);
console.log(`Target Size: < 2 MB (${result.totalSize > 2 * 1024 * 1024 ? '❌ EXCEEDS' : '✅ MEETS'})`);
console.log(`Target Requests: < 50 (${result.requestCount > 50 ? '❌ EXCEEDS' : '✅ MEETS'})`);

console.log('\n📦 Breakdown by Type:');
console.log('-'.repeat(60));

Object.entries(result.sizes).forEach(([type, size]) => {
  const percentage = ((size / result.totalSize) * 100).toFixed(1);
  console.log(`${type.toUpperCase().padEnd(10)} ${formatBytes(size).padStart(12)}  (${percentage}%)`);
});

console.log('\n📋 Asset Details:');
console.log('-'.repeat(60));
console.log(`JavaScript files: ${result.assets.js.length}`);
console.log(`CSS files: ${result.assets.css.length}`);
console.log(`Preloaded images: ${result.assets.images.length}`);
console.log(`Preloaded fonts: ${result.assets.fonts.length}`);

// Estimate additional lazy-loaded resources
console.log('\n💡 Note:');
console.log('This analysis shows initial page load only.');
console.log('Additional images will be lazy-loaded as user scrolls.');
console.log('Route-based code splitting means other pages load separately.');

console.log('\n' + '='.repeat(60));

// Check if targets are met
if (result.totalSize <= 2 * 1024 * 1024 && result.requestCount <= 50) {
  console.log('\n✅ All optimization targets met for initial page load!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Initial page load exceeds targets. Further optimization needed.\n');
  process.exit(1);
}
