import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Script to add resource hints (preload, prefetch) to the built HTML
 * This helps prioritize critical resources for faster initial load
 * 
 * Resource Hints Strategy:
 * - Preload: Critical CSS and JavaScript needed for initial render
 * - Prefetch: Resources likely needed for next navigation (vendor chunks)
 * - Preconnect: Already handled in index.html for external domains
 */

function findChunkFiles(distPath) {
  const jsDir = resolve(distPath, 'assets/js');
  const cssDir = resolve(distPath, 'assets/css');
  
  const chunks = {
    mainJs: null,
    mainCss: null,
    reactVendor: null,
    criticalChunks: []
  };
  
  try {
    // Find main entry JS file
    const jsFiles = readdirSync(jsDir);
    chunks.mainJs = jsFiles.find(f => f.startsWith('index-') && f.endsWith('.js'));
    
    // Find React vendor chunk (critical for app initialization)
    chunks.reactVendor = jsFiles.find(f => f.startsWith('react-vendor-') && f.endsWith('.js'));
    
    // Find other critical chunks (radix-ui, motion for hero animations)
    chunks.criticalChunks = jsFiles.filter(f => 
      (f.startsWith('radix-ui-') || f.startsWith('motion-')) && f.endsWith('.js')
    );
    
    // Find main CSS file
    const cssFiles = readdirSync(cssDir);
    chunks.mainCss = cssFiles.find(f => f.startsWith('index-') && f.endsWith('.css'));
  } catch (error) {
    console.error('Error reading chunk files:', error);
  }
  
  return chunks;
}

function addResourceHints() {
  const distPath = resolve(__dirname, '../dist');
  const indexPath = resolve(distPath, 'index.html');
  
  try {
    let html = readFileSync(indexPath, 'utf-8');
    
    // Find chunk files
    const chunks = findChunkFiles(distPath);
    
    if (!chunks.mainJs || !chunks.mainCss) {
      console.log('Could not find main JS or CSS files');
      return;
    }
    
    // Build resource hints
    let resourceHints = '\n    <!-- Preload critical assets for faster initial load -->\n';
    
    // Preload main CSS (highest priority for rendering)
    resourceHints += `    <link rel="preload" href="/assets/css/${chunks.mainCss}" as="style" />\n`;
    
    // Preload main JavaScript (critical for app initialization)
    resourceHints += `    <link rel="preload" href="/assets/js/${chunks.mainJs}" as="script" />\n`;
    
    // Preload React vendor chunk (critical for React app)
    if (chunks.reactVendor) {
      resourceHints += `    <link rel="preload" href="/assets/js/${chunks.reactVendor}" as="script" />\n`;
    }
    
    // Prefetch other vendor chunks for faster subsequent navigation
    resourceHints += '\n    <!-- Prefetch vendor chunks for faster navigation -->\n';
    
    for (const chunk of chunks.criticalChunks) {
      resourceHints += `    <link rel="prefetch" href="/assets/js/${chunk}" as="script" />\n`;
    }
    
    // Insert resource hints after the hero image preload
    // This ensures proper ordering: fonts -> images -> CSS -> JS
    const insertPoint = html.indexOf('<!-- Load critical fonts with display=swap');
    
    if (insertPoint !== -1) {
      html = html.slice(0, insertPoint) + resourceHints + '\n    ' + html.slice(insertPoint);
    } else {
      // Fallback: insert after viewport meta tag
      html = html.replace(
        /<meta name="viewport"[^>]*>/,
        (match) => match + resourceHints
      );
    }
    
    writeFileSync(indexPath, html);
    console.log('✓ Resource hints added to index.html');
    console.log('  Preloaded:');
    console.log('    - CSS:', chunks.mainCss);
    console.log('    - JS:', chunks.mainJs);
    if (chunks.reactVendor) {
      console.log('    - React Vendor:', chunks.reactVendor);
    }
    if (chunks.criticalChunks.length > 0) {
      console.log('  Prefetched:');
      chunks.criticalChunks.forEach(chunk => {
        console.log('    -', chunk);
      });
    }
  } catch (error) {
    console.error('Error adding resource hints:', error);
  }
}

addResourceHints();
