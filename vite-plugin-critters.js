import Critters from 'critters';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Vite plugin for critical CSS extraction and inlining using Critters
 * This plugin processes HTML files after build to:
 * 1. Extract critical CSS for above-the-fold content
 * 2. Inline critical CSS in the HTML head
 * 3. Defer loading of non-critical CSS
 */
export default function viteCritters(options = {}) {
  let config;
  
  const defaultOptions = {
    // Paths to process (relative to output directory)
    path: 'dist',
    // Inline critical CSS
    inline: true,
    // Preload non-critical CSS
    preload: 'swap',
    // Don't inline all styles (only critical)
    inlineThreshold: 0,
    // Minimum external stylesheet size to inline
    minimumExternalSize: 0,
    // Prune source CSS files
    pruneSource: false,
    // Merge stylesheets
    mergeStylesheets: true,
    // Additional options
    compress: true,
    logLevel: 'info',
    ...options
  };

  return {
    name: 'vite-plugin-critters',
    apply: 'build',
    
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    
    async closeBundle() {
      const critters = new Critters({
        ...defaultOptions,
        path: resolve(config.root, config.build.outDir),
      });

      const outDir = resolve(config.root, config.build.outDir);
      
      try {
        // Process index.html
        const indexPath = resolve(outDir, 'index.html');
        const html = readFileSync(indexPath, 'utf-8');
        const inlined = await critters.process(html);
        writeFileSync(indexPath, inlined);
        
        console.log('✓ Critical CSS extracted and inlined for index.html');
      } catch (error) {
        console.error('Error processing critical CSS:', error);
        // Don't fail the build, just log the error
      }
    }
  };
}
