/**
 * Performance Monitoring Utility
 * Collects Core Web Vitals and sends metrics to analytics
 * 
 * Metrics collected:
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - CLS (Cumulative Layout Shift)
 * - INP (Interaction to Next Paint) - replaces FID
 * - TTFB (Time to First Byte)
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

/**
 * Configuration for performance monitoring
 */
const config = {
  // Enable/disable monitoring
  enabled: true,
  
  // Debug mode - logs metrics to console
  debug: import.meta.env.DEV,
  
  // Analytics endpoint (can be configured for your analytics service)
  analyticsEndpoint: '/api/analytics',
  
  // Sample rate (1.0 = 100%, 0.1 = 10%)
  sampleRate: 1.0,
  
  // Batch metrics before sending
  batchSize: 5,
  batchTimeout: 10000, // 10 seconds
};

/**
 * Metrics queue for batching
 */
let metricsQueue = [];
let batchTimer = null;

/**
 * Get device type based on screen width
 */
function getDeviceType() {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Get connection information
 */
function getConnectionInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return { effectiveType: 'unknown', downlink: 0, rtt: 0 };
  
  return {
    effectiveType: connection.effectiveType || 'unknown',
    downlink: connection.downlink || 0,
    rtt: connection.rtt || 0,
  };
}

/**
 * Format metric data for sending
 */
function formatMetric(metric) {
  return {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    
    // Context information
    url: window.location.href,
    pathname: window.location.pathname,
    timestamp: Date.now(),
    deviceType: getDeviceType(),
    connection: getConnectionInfo(),
    userAgent: navigator.userAgent,
    
    // Viewport information
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  };
}

/**
 * Send metrics to analytics endpoint
 */
async function sendMetrics(metrics) {
  if (!config.enabled || metrics.length === 0) return;
  
  try {
    // In development or if no endpoint configured, just log
    if (config.debug) {
      console.log('[Performance Metrics]', metrics);
    }
    
    // Send to analytics endpoint
    // This can be customized to send to Google Analytics, custom backend, etc.
    if (config.analyticsEndpoint && !config.debug) {
      await fetch(config.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics,
          session: getSessionId(),
        }),
        // Use keepalive to ensure metrics are sent even if page is closing
        keepalive: true,
      });
    }
  } catch (error) {
    console.error('[Performance Monitoring] Error sending metrics:', error);
  }
}

/**
 * Add metric to queue and send when batch is full
 */
function queueMetric(metric) {
  metricsQueue.push(formatMetric(metric));
  
  // Send immediately if batch size reached
  if (metricsQueue.length >= config.batchSize) {
    flushMetrics();
  } else {
    // Schedule batch send
    if (batchTimer) clearTimeout(batchTimer);
    batchTimer = setTimeout(flushMetrics, config.batchTimeout);
  }
}

/**
 * Flush metrics queue
 */
function flushMetrics() {
  if (metricsQueue.length === 0) return;
  
  const metricsToSend = [...metricsQueue];
  metricsQueue = [];
  
  if (batchTimer) {
    clearTimeout(batchTimer);
    batchTimer = null;
  }
  
  sendMetrics(metricsToSend);
}

/**
 * Get or create session ID
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('perf_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('perf_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Handle metric callback
 */
function handleMetric(metric) {
  // Apply sampling
  if (Math.random() > config.sampleRate) return;
  
  // Log in debug mode
  if (config.debug) {
    console.log(`[${metric.name}]`, metric.value, metric.rating);
  }
  
  // Queue metric for sending
  queueMetric(metric);
}

/**
 * Initialize performance monitoring
 * Collects Core Web Vitals: FCP, LCP, CLS, INP (replaces FID), TTFB
 */
export function initPerformanceMonitoring(options = {}) {
  // Merge options with default config
  Object.assign(config, options);
  
  if (!config.enabled) {
    console.log('[Performance Monitoring] Disabled');
    return;
  }
  
  console.log('[Performance Monitoring] Initialized');
  
  // Collect Core Web Vitals
  onCLS(handleMetric);
  onFCP(handleMetric);
  onINP(handleMetric); // INP replaces FID in web-vitals v3+
  onLCP(handleMetric);
  onTTFB(handleMetric);
  
  // Flush metrics before page unload
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushMetrics();
    }
  });
  
  // Flush metrics on page unload
  window.addEventListener('pagehide', flushMetrics);
}

/**
 * Manually report a custom metric
 */
export function reportMetric(name, value, additionalData = {}) {
  if (!config.enabled) return;
  
  const metric = {
    name,
    value,
    rating: 'custom',
    delta: value,
    id: `${name}-${Date.now()}`,
    navigationType: 'custom',
    ...additionalData,
  };
  
  queueMetric(metric);
}

/**
 * Get current performance metrics snapshot
 */
export function getPerformanceSnapshot() {
  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  
  return {
    // Navigation timing
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
    loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
    
    // Paint timing
    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    
    // Resource timing
    resources: performance.getEntriesByType('resource').length,
    
    // Memory (if available)
    memory: performance.memory ? {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    } : null,
  };
}

/**
 * Configure performance monitoring
 */
export function configurePerformanceMonitoring(options) {
  Object.assign(config, options);
}

/**
 * Export for testing
 */
export const __testing__ = {
  config,
  formatMetric,
  getDeviceType,
  getConnectionInfo,
};
