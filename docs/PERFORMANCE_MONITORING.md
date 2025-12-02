# Performance Monitoring Implementation

## Overview

This document describes the Real User Monitoring (RUM) implementation for tracking Core Web Vitals and performance metrics on the Scrapiz website.

## Features

### Core Web Vitals Tracked

1. **FCP (First Contentful Paint)**: Time when first text/image is painted
2. **LCP (Largest Contentful Paint)**: Time when largest content element becomes visible
3. **CLS (Cumulative Layout Shift)**: Visual stability metric
4. **INP (Interaction to Next Paint)**: Time from user interaction to next paint (replaces FID in web-vitals v3+)
5. **TTFB (Time to First Byte)**: Time from navigation start to first byte received

**Note**: INP (Interaction to Next Paint) has replaced FID (First Input Delay) as a Core Web Vital. INP provides a more comprehensive measure of responsiveness by considering all interactions throughout the page lifecycle, not just the first one.

### Additional Context

Each metric includes:
- Device type (mobile/tablet/desktop)
- Connection information (effective type, downlink, RTT)
- Viewport dimensions
- URL and pathname
- User agent
- Timestamp

## Implementation

### 1. Performance Monitoring Utility

**File**: `src/utils/performanceMonitoring.js`

Core functionality:
- Collects Core Web Vitals using `web-vitals` library
- Batches metrics for efficient sending
- Supports sampling for high-traffic sites
- Provides debug mode for development
- Handles metric formatting and context enrichment

### 2. React Component

**File**: `src/components/PerformanceMonitor.jsx`

React integration:
- Initializes monitoring on mount
- Configurable via props
- Provides hook for functional components
- No visual rendering (monitoring only)

### 3. App Integration

**File**: `src/App.jsx`

The PerformanceMonitor component is added at the app root level to ensure metrics are collected across all pages.

## Configuration

### Default Configuration

```javascript
{
  enabled: true,              // Enable/disable monitoring
  debug: import.meta.env.DEV, // Debug mode in development
  sampleRate: 1.0,            // 100% sampling
  batchSize: 5,               // Batch 5 metrics before sending
  batchTimeout: 10000,        // Send after 10 seconds
  analyticsEndpoint: '/api/analytics'
}
```

### Custom Configuration

You can customize the configuration by passing props to the PerformanceMonitor component:

```jsx
<PerformanceMonitor
  enabled={true}
  debug={false}
  sampleRate={0.5}  // Sample 50% of users
  analyticsEndpoint="https://your-analytics-endpoint.com/metrics"
/>
```

## Usage

### Basic Usage

The component is already integrated in `App.jsx` and will automatically start collecting metrics.

### Manual Metric Reporting

You can manually report custom metrics:

```javascript
import { reportMetric } from '../utils/performanceMonitoring';

// Report a custom timing
reportMetric('custom-operation', 1234, {
  category: 'user-interaction',
  label: 'button-click'
});
```

### Get Performance Snapshot

Get current performance metrics:

```javascript
import { getPerformanceSnapshot } from '../utils/performanceMonitoring';

const snapshot = getPerformanceSnapshot();
console.log('Current performance:', snapshot);
```

## Data Flow

1. **Collection**: Web Vitals API collects metrics as they occur
2. **Formatting**: Metrics are enriched with context (device, connection, etc.)
3. **Batching**: Metrics are queued and batched for efficiency
4. **Sending**: Batches are sent to analytics endpoint
5. **Flushing**: Remaining metrics are flushed on page hide/unload

## Analytics Integration

### Current Implementation

In development mode, metrics are logged to console. In production, they can be sent to an analytics endpoint.

### Integration Options

#### 1. Google Analytics 4

```javascript
import { reportMetric } from '../utils/performanceMonitoring';

// Send to GA4
function sendToGA4(metric) {
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
  });
}

// Configure to use GA4
configurePerformanceMonitoring({
  analyticsEndpoint: null, // Disable default endpoint
});

// Manually send to GA4
onCLS(sendToGA4);
onFCP(sendToGA4);
onLCP(sendToGA4);
onINP(sendToGA4); // INP replaces FID
onTTFB(sendToGA4);
```

#### 2. Custom Backend

Create an API endpoint to receive metrics:

```javascript
// Backend endpoint example (Node.js/Express)
app.post('/api/analytics', (req, res) => {
  const { metrics, session } = req.body;
  
  // Store metrics in database
  await db.performanceMetrics.insertMany(metrics);
  
  res.json({ success: true });
});
```

#### 3. Third-Party Services

- **New Relic**: Use New Relic Browser agent
- **Datadog**: Use Datadog RUM
- **Sentry**: Use Sentry Performance Monitoring
- **LogRocket**: Use LogRocket session replay with performance

## Monitoring Best Practices

### 1. Sampling

For high-traffic sites, use sampling to reduce data volume:

```jsx
<PerformanceMonitor sampleRate={0.1} /> // 10% sampling
```

### 2. Privacy

Ensure compliance with privacy regulations:
- Don't collect PII in metrics
- Respect Do Not Track settings
- Provide opt-out mechanism
- Include in privacy policy

### 3. Performance Impact

The monitoring itself has minimal impact:
- Uses native Web Vitals API (no polling)
- Batches metrics to reduce requests
- Uses `keepalive` for reliable sending
- Defers non-critical operations

### 4. Alerting

Set up alerts for performance regressions:
- FCP > 1.8s
- LCP > 2.5s
- CLS > 0.1
- INP > 200ms (replaces FID)
- TBT > 200ms

## Debugging

### Enable Debug Mode

```jsx
<PerformanceMonitor debug={true} />
```

This will log all metrics to the console:

```
[Performance Monitoring] Initialized
[FCP] 1234.5 good
[LCP] 2345.6 needs-improvement
[CLS] 0.05 good
```

### Check Metrics in DevTools

Open DevTools Console and check for performance logs. You can also inspect the metrics queue:

```javascript
// In console
window.__performanceMetrics
```

## Testing

### Unit Tests

Test the performance monitoring utilities:

```javascript
import { describe, it, expect } from 'vitest';
import { __testing__ } from '../utils/performanceMonitoring';

describe('Performance Monitoring', () => {
  it('should format metrics correctly', () => {
    const metric = {
      name: 'FCP',
      value: 1234,
      rating: 'good',
    };
    
    const formatted = __testing__.formatMetric(metric);
    expect(formatted.name).toBe('FCP');
    expect(formatted.value).toBe(1234);
    expect(formatted.deviceType).toBeDefined();
  });
});
```

### Integration Tests

Test that metrics are collected in the browser:

```javascript
import { render } from '@testing-library/react';
import PerformanceMonitor from '../components/PerformanceMonitor';

it('should initialize monitoring', () => {
  const consoleSpy = vi.spyOn(console, 'log');
  render(<PerformanceMonitor debug={true} />);
  
  expect(consoleSpy).toHaveBeenCalledWith(
    expect.stringContaining('Performance Monitoring')
  );
});
```

## Troubleshooting

### Metrics Not Being Collected

1. Check that PerformanceMonitor is mounted
2. Verify `enabled` prop is true
3. Check browser console for errors
4. Ensure web-vitals library is installed

### Metrics Not Being Sent

1. Check network tab for failed requests
2. Verify analytics endpoint is correct
3. Check CORS configuration
4. Verify keepalive is supported

### High Data Volume

1. Reduce sample rate
2. Increase batch size
3. Increase batch timeout
4. Filter out less important metrics

## Requirements Validation

This implementation satisfies the following requirements:

- **Requirement 9.1**: Tracks Core Web Vitals (FCP, LCP, CLS, INP, TTFB) for all pages ✓
  - Note: INP (Interaction to Next Paint) has replaced FID as a Core Web Vital
  - TBT (Total Blocking Time) is calculated from other metrics and available via Performance API
- **Requirement 9.5**: Implements Real User Monitoring (RUM) with device and connection context ✓

## Future Enhancements

1. **Long Tasks Monitoring**: Track long tasks that block the main thread
2. **Resource Timing**: Monitor individual resource load times
3. **Error Tracking**: Correlate errors with performance metrics
4. **User Flows**: Track performance across multi-step user journeys
5. **A/B Testing**: Compare performance across different variants
6. **Synthetic Monitoring**: Complement RUM with scheduled synthetic tests

## References

- [Web Vitals](https://web.dev/vitals/)
- [web-vitals library](https://github.com/GoogleChrome/web-vitals)
- [Core Web Vitals](https://web.dev/vitals/#core-web-vitals)
- [Measuring Performance](https://web.dev/user-centric-performance-metrics/)
