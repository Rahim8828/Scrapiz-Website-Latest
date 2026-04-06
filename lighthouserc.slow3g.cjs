module.exports = {
  ci: {
    collect: {
      // Build the site before running Lighthouse
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/about',
        'http://localhost:4173/blog',
        'http://localhost:4173/locations/dharavi',
        'http://localhost:4173/locations/bandra',
        'http://localhost:4173/locations/goregaon',
        'http://localhost:4173/scrap-categories/aluminium',
        'http://localhost:4173/scrap-categories/copper',
      ],
      numberOfRuns: 3,
      settings: {
        // Emulate mobile device with Slow 3G network
        preset: 'mobile',
        // Slow 3G throttling settings
        // Based on Lighthouse's slow 3G preset
        throttling: {
          rttMs: 300, // Round-trip time: 300ms (slow 3G)
          throughputKbps: 400, // Download: 400 Kbps (slow 3G)
          requestLatencyMs: 300 * 3.75, // Request latency
          downloadThroughputKbps: 400,
          uploadThroughputKbps: 400,
          cpuSlowdownMultiplier: 4, // 4x CPU slowdown for mobile
        },
        // Mobile emulation
        emulatedFormFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
        },
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Performance budgets for slow 3G network
        // Requirement 8.1: TTI < 5s on slow 3G
        'interactive': ['error', { maxNumericValue: 5000 }], // TTI < 5s
        
        // Requirement 1.3: Page transitions < 1s
        // Note: This is tested separately in page transition tests
        
        // Core Web Vitals (more lenient for slow network)
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }], // More lenient for slow 3G
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }], // More lenient for slow 3G
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // CLS should still be good
        'total-blocking-time': ['error', { maxNumericValue: 300 }], // Slightly more lenient
        'speed-index': ['warn', { maxNumericValue: 5000 }],
        
        // Performance score (more lenient for slow network)
        'categories:performance': ['warn', { minScore: 0.70 }], // Lower threshold for slow 3G
        'categories:accessibility': ['warn', { minScore: 0.90 }],
        'categories:best-practices': ['warn', { minScore: 0.90 }],
        'categories:seo': ['warn', { minScore: 0.90 }],
        
        // Resource budgets (critical for slow networks)
        'resource-summary:script:size': ['error', { maxNumericValue: 204800 }], // 200 KiB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 51200 }], // 50 KiB
        'resource-summary:image:size': ['warn', { maxNumericValue: 512000 }], // 500 KiB
        'resource-summary:total:size': ['error', { maxNumericValue: 2097152 }], // 2 MB - critical!
        
        // Network efficiency (critical for slow networks)
        'uses-text-compression': ['error', { minScore: 1 }], // Must have compression
        'uses-responsive-images': ['error', { minScore: 0.9 }], // Must use responsive images
        'offscreen-images': ['error', { minScore: 0.9 }], // Must lazy load
        'uses-optimized-images': ['error', { minScore: 0.9 }], // Must optimize images
        'modern-image-formats': ['error', { minScore: 0.9 }], // Must use WebP
        'render-blocking-resources': ['error', { maxNumericValue: 3 }], // Minimize blocking
        'unused-javascript': ['error', { maxNumericValue: 102400 }], // 100 KiB max unused
        'uses-long-cache-ttl': ['warn', { minScore: 0.75 }],
        'uses-rel-preconnect': ['warn', { minScore: 0.5 }],
        'uses-rel-preload': ['warn', { minScore: 0.5 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
