/// <reference types="vitest" />
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { plugin as markdown } from "vite-plugin-markdown"
import sitemap from 'vite-plugin-sitemap'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import remarkToc from 'remark-toc'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCritters from './vite-plugin-critters.js'

const blogPosts = [
  'sell-scrap-without-leaving-home-in-mumbai',
  'best-price-for-scrap-metal-near-me-sell-now',
  'sell-scrap-online-in-mumbai-instant-pickup-call-now',
  'reliable-scrap-buyer-near-me-for-home-pick-up',
  'sell-my-unused-junk-for-cash-in-mumbai',
  'selling-scrap-online-with-scrapiz-how-it-makes-scrap-selling-easy',
  'sell-scrap-online-in-mumbai',
  'top-10-benefits-of-selling-your-scrap-online-with-scrapiz'
];

const staticRoutes = [
  '/about',
  '/bandra',
  '/bandra-east',
  '/blog',
  '/contact',
  '/services/demolition-service',
  '/dharavi',
  '/dharavi-koliwada',
  '/services/dismantling',
  '/goregaon',
  '/jogeshwari',
  '/services/junk-removal-service',
  '/kandivali',
  '/locations',
  '/mahim',
  '/nalasopara',
  '/services/paper-shredding',
  '/privacy-policy',
  '/services/scrap-collection',
  '/sell-aluminium-scrap-mumbai',
  '/sell-copper-scrap-mumbai',
  '/sell-brass-scrap-mumbai',
  '/sell-iron-steel-scrap-mumbai',
  '/sell-stainless-steel-scrap-mumbai',
  '/sell-e-waste-mumbai',
  '/sell-ac-scrap-mumbai',
  '/sell-refrigerator-scrap-mumbai',
  '/sell-washing-machine-scrap-mumbai',
  '/sell-microwave-scrap-mumbai',
  '/services',
  '/services/society-tie-up',
  '/terms-and-conditions',
  '/services/vehicle-scrapping',
  // Extra Location Pages (29)
  '/scrap-dealer-in-andheri',
  '/scrap-dealer-in-andheri-east',
  '/scrap-dealer-in-jogeshwari-west',
  '/scrap-dealer-in-jogeshwari-east',
  '/scrap-dealer-in-goregaon-east',
  '/scrap-dealer-in-goregaon-west',
  '/scrap-dealer-in-malad-east',
  '/scrap-dealer-in-malad-west',
  '/scrap-dealer-in-kandivali-east',
  '/scrap-dealer-in-kandivali-west',
  '/scrap-dealer-in-sion',
  '/scrap-dealer-in-kurla',
  '/scrap-dealer-in-chembur',
  '/scrap-dealer-in-ghatkopar-east',
  '/scrap-dealer-in-ghatkopar-west',
  '/scrap-dealer-in-vidyavihar',
  '/scrap-dealer-in-mulund',
  '/scrap-dealer-in-bhandup',
  '/scrap-dealer-in-vikhroli',
  '/scrap-dealer-in-wadala',
  '/scrap-dealer-in-lower-parel',
  '/scrap-dealer-in-worli',
  '/scrap-dealer-in-byculla',
  '/scrap-dealer-in-grant-road',
  '/scrap-dealer-in-cst',
  '/scrap-dealer-in-colaba',
  '/scrap-dealer-in-fort',
  '/scrap-dealer-in-dadar-east',
  '/scrap-dealer-in-dadar-west',
];

export default defineConfig({

  base: '/',  
  plugins: [
    react(), 
    markdown({ 
      mode: ['html', 'attributes'],
      remarkPlugins: [
        remarkGfm,
        remarkSlug, 
        [remarkToc, { heading: 'table of contents', tight: true }]
      ],
    }),
    sitemap({
      hostname: 'https://www.scrapiz.in',
      dynamicRoutes: staticRoutes.concat(blogPosts.map((post) => `/blog/${post}`)),
      beautify: true, // This will format the XML
    }),
    // Only generate bundle visualization in development or when ANALYZE=true
    process.env.ANALYZE === 'true' && visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    viteCritters({
      // Inline critical CSS
      inline: true,
      // Preload non-critical CSS with media swap strategy
      preload: 'media',
      // Don't inline all styles, only critical
      inlineThreshold: 0,
      // Prune source to remove inlined styles from external CSS
      pruneSource: true,
      // Merge stylesheets for better optimization
      mergeStylesheets: true,
      // Compress output
      compress: true,
      // Reduce CSS size
      reduceInlineStyles: false,
      // Log level
      logLevel: 'info',
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        passes: 2, // Run compression twice for better results
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
      },
      mangle: {
        safari10: true, // Fix Safari 10 issues
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'react-vendor';
          }
          
          // Radix UI components - split into separate chunk
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui';
          }
          
          // Framer Motion - animation library
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          
          // Lucide icons - split separately
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          
          // Markdown and related libraries
          if (id.includes('node_modules/react-markdown') ||
              id.includes('node_modules/remark') ||
              id.includes('node_modules/markdown-it') ||
              id.includes('node_modules/gray-matter')) {
            return 'markdown';
          }
          
          // EmailJS and other utilities
          if (id.includes('node_modules/@emailjs') ||
              id.includes('node_modules/axios')) {
            return 'utilities';
          }
          
          // All other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize chunk file names with content hash
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Organize assets by type
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|svg|gif|webp|avif)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
      // Enable tree shaking
      treeshake: {
        moduleSideEffects: 'no-external',
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    // Reduce chunk size warnings threshold to 200 KiB
    chunkSizeWarningLimit: 200,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Source maps for production debugging (disabled for smaller builds)
    sourcemap: false,
    // Target modern browsers for better tree shaking
    target: 'es2015',
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
