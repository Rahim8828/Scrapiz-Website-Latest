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
        // Emulate mobile device
        preset: 'mobile',
        // Mobile throttling (Slow 4G)
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          requestLatencyMs: 562.5,
          downloadThroughputKbps: 1638.4,
          uploadThroughputKbps: 675,
          cpuSlowdownMultiplier: 4,
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
        // Performance budgets based on requirements
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }], // Requirement 1.1: FCP < 1.8s
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // Requirement 1.2: LCP < 2.5s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }], // CLS < 0.1
        'total-blocking-time': ['error', { maxNumericValue: 200 }], // Requirement 10.1: TBT < 200ms on mobile
        'speed-index': ['warn', { maxNumericValue: 3500 }],
        'interactive': ['warn', { maxNumericValue: 5000 }], // Requirement 8.1: TTI < 5s on slow network
        
        // Performance score thresholds
        'categories:performance': ['error', { minScore: 0.90 }], // Requirement 1.4: Mobile score >= 90
        'categories:accessibility': ['warn', { minScore: 0.90 }],
        'categories:best-practices': ['warn', { minScore: 0.90 }],
        'categories:seo': ['warn', { minScore: 0.90 }],
        
        // Resource budgets
        'resource-summary:script:size': ['warn', { maxNumericValue: 204800 }], // 200 KiB
        'resource-summary:stylesheet:size': ['warn', { maxNumericValue: 51200 }], // 50 KiB
        'resource-summary:image:size': ['warn', { maxNumericValue: 512000 }], // 500 KiB
        'resource-summary:total:size': ['error', { maxNumericValue: 2097152 }], // 2 MB
        
        // Best practices
        'uses-responsive-images': ['warn', { minScore: 0.9 }],
        'offscreen-images': ['warn', { minScore: 0.9 }],
        'uses-optimized-images': ['warn', { minScore: 0.9 }],
        'modern-image-formats': ['warn', { minScore: 0.9 }],
        'uses-text-compression': ['error', { minScore: 1 }],
        'render-blocking-resources': ['warn', { maxNumericValue: 3 }],
        'unused-javascript': ['warn', { maxNumericValue: 102400 }], // 100 KiB
        'uses-long-cache-ttl': ['warn', { minScore: 0.75 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
