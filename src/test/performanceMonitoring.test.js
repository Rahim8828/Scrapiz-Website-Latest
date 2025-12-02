/**
 * Performance Monitoring Tests
 * Tests for the performance monitoring utility
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { __testing__ } from '../utils/performanceMonitoring';

describe('Performance Monitoring', () => {
  describe('Device Type Detection', () => {
    it('should detect mobile device', () => {
      // Mock window.innerWidth for mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      const deviceType = __testing__.getDeviceType();
      expect(deviceType).toBe('mobile');
    });
    
    it('should detect tablet device', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });
      
      const deviceType = __testing__.getDeviceType();
      expect(deviceType).toBe('tablet');
    });
    
    it('should detect desktop device', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });
      
      const deviceType = __testing__.getDeviceType();
      expect(deviceType).toBe('desktop');
    });
  });
  
  describe('Connection Info', () => {
    it('should get connection information when available', () => {
      // Mock navigator.connection
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        configurable: true,
        value: {
          effectiveType: '4g',
          downlink: 10,
          rtt: 50,
        },
      });
      
      const connectionInfo = __testing__.getConnectionInfo();
      expect(connectionInfo.effectiveType).toBe('4g');
      expect(connectionInfo.downlink).toBe(10);
      expect(connectionInfo.rtt).toBe(50);
    });
    
    it('should handle missing connection API', () => {
      // Remove connection API
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        configurable: true,
        value: undefined,
      });
      
      const connectionInfo = __testing__.getConnectionInfo();
      expect(connectionInfo.effectiveType).toBe('unknown');
      expect(connectionInfo.downlink).toBe(0);
      expect(connectionInfo.rtt).toBe(0);
    });
  });
  
  describe('Metric Formatting', () => {
    it('should format metric with all required fields', () => {
      const mockMetric = {
        name: 'LCP',
        value: 2500,
        rating: 'good',
        delta: 100,
        id: 'test-id',
        navigationType: 'navigate',
      };
      
      const formatted = __testing__.formatMetric(mockMetric);
      
      expect(formatted.name).toBe('LCP');
      expect(formatted.value).toBe(2500);
      expect(formatted.rating).toBe('good');
      expect(formatted.delta).toBe(100);
      expect(formatted.id).toBe('test-id');
      expect(formatted.navigationType).toBe('navigate');
      expect(formatted.url).toBeDefined();
      expect(formatted.pathname).toBeDefined();
      expect(formatted.timestamp).toBeDefined();
      expect(formatted.deviceType).toBeDefined();
      expect(formatted.connection).toBeDefined();
      expect(formatted.userAgent).toBeDefined();
      expect(formatted.viewportWidth).toBeDefined();
      expect(formatted.viewportHeight).toBeDefined();
    });
    
    it('should include current URL and pathname', () => {
      const mockMetric = {
        name: 'FCP',
        value: 1500,
        rating: 'good',
        delta: 50,
        id: 'test-id-2',
        navigationType: 'navigate',
      };
      
      const formatted = __testing__.formatMetric(mockMetric);
      
      expect(formatted.url).toBe(window.location.href);
      expect(formatted.pathname).toBe(window.location.pathname);
    });
    
    it('should include timestamp', () => {
      const beforeTime = Date.now();
      
      const mockMetric = {
        name: 'CLS',
        value: 0.05,
        rating: 'good',
        delta: 0.01,
        id: 'test-id-3',
        navigationType: 'navigate',
      };
      
      const formatted = __testing__.formatMetric(mockMetric);
      const afterTime = Date.now();
      
      expect(formatted.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(formatted.timestamp).toBeLessThanOrEqual(afterTime);
    });
  });
  
  describe('Configuration', () => {
    it('should have default configuration', () => {
      const config = __testing__.config;
      
      expect(config.enabled).toBe(true);
      expect(config.sampleRate).toBe(1.0);
      expect(config.batchSize).toBe(5);
      expect(config.batchTimeout).toBe(10000);
      expect(config.analyticsEndpoint).toBe('/api/analytics');
    });
  });
});
