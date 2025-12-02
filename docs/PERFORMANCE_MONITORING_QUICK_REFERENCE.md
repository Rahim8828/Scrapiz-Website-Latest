# Performance Monitoring Quick Reference

## What's Implemented

✅ Real User Monitoring (RUM) for Core Web Vitals
✅ Automatic metric collection on all pages
✅ Batched metric sending for efficiency
✅ Debug mode for development
✅ Configurable sampling and endpoints

## Core Web Vitals Tracked

| Metric | Description | Good Threshold |
|--------|-------------|----------------|
| **FCP** | First Contentful Paint | < 1.8s |
| **LCP** | Largest Contentful Paint | < 2.5s |
| **CLS** | Cumulative Layout Shift | < 0.1 |
| **INP** | Interaction to Next Paint | < 200ms |
| **TTFB** | Time to First Byte | < 800ms |

## Files Added

```
src/
├── utils/
│   └── performanceMonitoring.js    # Core monitoring utility
└── components/
    └── PerformanceMonitor.jsx      # React component

docs/
├── PERFORMANCE_MONITORING.md       # Full documentation
└── PERFORMANCE_MONITORING_QUICK_REFERENCE.md  # This file
```

## Usage

### Already Integrated

The PerformanceMonitor component is already added to `App.jsx` and will automatically collect metrics.

### View Metrics in Development

Open browser console to see metrics:

```
[Performance Monitoring] Initialized
[FCP] 1234.5 good
[LCP] 2345.6 needs-improvement
[CLS] 0.05 good
```

### Custom Configuration

Edit `src/App.jsx` to customize:

```jsx
<PerformanceMonitor
  enabled={true}
  debug={false}
  sampleRate={0.5}  // 50% sampling
  analyticsEndpoint="https://your-endpoint.com/metrics"
/>
```

## Metric Data Structure

Each metric includes:

```javascript
{
  name: "LCP",
  value: 2345.6,
  rating: "needs-improvement",
  url: "https://scrapiz.com/",
  pathname: "/",
  timestamp: 1234567890,
  deviceType: "mobile",
  connection: {
    effectiveType: "4g",
    downlink: 10,
    rtt: 50
  },
  viewportWidth: 375,
  viewportHeight: 667
}
```

## Analytics Integration

### Option 1: Google Analytics 4

```javascript
// In src/utils/performanceMonitoring.js
function sendToGA4(metric) {
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    metric_id: metric.id,
  });
}
```

### Option 2: Custom Backend

Create endpoint at `/api/analytics`:

```javascript
app.post('/api/analytics', (req, res) => {
  const { metrics } = req.body;
  // Store in database
  await db.performanceMetrics.insertMany(metrics);
  res.json({ success: true });
});
```

### Option 3: Third-Party Services

- **New Relic**: Use Browser agent
- **Datadog**: Use RUM SDK
- **Sentry**: Use Performance Monitoring
- **LogRocket**: Use session replay

## Testing

### Check Metrics Collection

```javascript
// In browser console
import { getPerformanceSnapshot } from './utils/performanceMonitoring';
console.log(getPerformanceSnapshot());
```

### Manual Metric Reporting

```javascript
import { reportMetric } from './utils/performanceMonitoring';

reportMetric('custom-timing', 1234, {
  category: 'user-interaction'
});
```

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `true` | Enable/disable monitoring |
| `debug` | `DEV mode` | Log metrics to console |
| `sampleRate` | `1.0` | Sample rate (0-1) |
| `batchSize` | `5` | Metrics per batch |
| `batchTimeout` | `10000` | Batch timeout (ms) |
| `analyticsEndpoint` | `/api/analytics` | Endpoint URL |

## Performance Impact

- **Minimal**: Uses native Web Vitals API
- **Efficient**: Batches metrics to reduce requests
- **Reliable**: Uses `keepalive` for sending
- **Non-blocking**: Defers non-critical operations

## Troubleshooting

### Metrics not showing in console?

1. Check `debug={true}` is set
2. Verify PerformanceMonitor is mounted
3. Check browser console for errors

### Metrics not being sent?

1. Check network tab for requests
2. Verify endpoint URL is correct
3. Check CORS configuration
4. Ensure `enabled={true}`

### High data volume?

1. Reduce `sampleRate` (e.g., 0.1 for 10%)
2. Increase `batchSize`
3. Increase `batchTimeout`

## Requirements Satisfied

✅ **Requirement 9.1**: Track Core Web Vitals for all pages
✅ **Requirement 9.5**: Real User Monitoring with context

## Next Steps

1. **Set up analytics endpoint** to receive metrics
2. **Configure alerting** for performance regressions
3. **Create dashboard** to visualize metrics
4. **Set up sampling** for production traffic
5. **Integrate with monitoring service** (optional)

## Resources

- [Web Vitals Documentation](https://web.dev/vitals/)
- [web-vitals Library](https://github.com/GoogleChrome/web-vitals)
- [Full Documentation](./PERFORMANCE_MONITORING.md)
