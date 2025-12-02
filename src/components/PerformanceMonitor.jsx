/**
 * Performance Monitor Component
 * React component that initializes performance monitoring
 */

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '../utils/performanceMonitoring';

/**
 * PerformanceMonitor Component
 * Initializes Web Vitals monitoring when mounted
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.enabled - Enable/disable monitoring (default: true in production)
 * @param {boolean} props.debug - Enable debug logging (default: true in development)
 * @param {number} props.sampleRate - Sample rate for metrics (0-1, default: 1.0)
 * @param {string} props.analyticsEndpoint - Endpoint to send metrics to
 */
export default function PerformanceMonitor({ 
  enabled = import.meta.env.PROD,
  debug = import.meta.env.DEV,
  sampleRate = 1.0,
  analyticsEndpoint = '/api/analytics',
}) {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring({
      enabled,
      debug,
      sampleRate,
      analyticsEndpoint,
    });
    
    // Log initialization in debug mode
    if (debug) {
      console.log('[PerformanceMonitor] Component mounted and monitoring initialized');
    }
  }, [enabled, debug, sampleRate, analyticsEndpoint]);
  
  // This component doesn't render anything
  return null;
}

/**
 * Hook for using performance monitoring in functional components
 */
export function usePerformanceMonitoring(options = {}) {
  useEffect(() => {
    initPerformanceMonitoring(options);
  }, []);
}
