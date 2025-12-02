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
        preset: 'desktop',
        // Throttling settings
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
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
        'total-blocking-time': ['warn', { maxNumericValue: 200 }], // TBT < 200ms
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'interactive': ['warn', { maxNumericValue: 3500 }],
        
        // Performance score thresholds
        'categories:performance': ['error', { minScore: 0.90 }], // Requirement 1.4/1.5: Score >= 90
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
