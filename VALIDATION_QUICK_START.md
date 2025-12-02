# Performance Validation - Quick Start Guide

## Quick Validation (No Dev Server Required)

Run this first to verify all optimizations are in place:

```bash
npm run validate:quick
```

**Expected Result:**
```
✅ Passed: 13/13 checks
Status: All critical optimizations are in place!
```

**What it checks:**
- WebP images (101 found)
- Lazy loading implementation
- Code splitting configuration
- Critical CSS setup
- Cache headers
- Compression
- Performance monitoring
- Lighthouse CI config
- Font optimization
- Resource hints
- Image dimensions
- Build output
- Cache busting (75 hashed files)

---

## Full Performance Validation (Requires Dev Server)

### Step 1: Start Dev Server
```bash
npm run dev
```

Wait for the server to start on `http://localhost:5173`

### Step 2: Run Full Validation (in another terminal)
```bash
npm run validate:performance
```

**What it does:**
- Tests 15+ key pages
- Runs Lighthouse for mobile, desktop, and slow 3G
- Validates Core Web Vitals against thresholds
- Generates detailed reports

**Duration:** ~10-15 minutes (depends on system performance)

### Step 3: Review Results

Check the generated reports:

**JSON Report:**
```bash
cat FINAL_PERFORMANCE_VALIDATION.json
```

**Markdown Report:**
```bash
cat FINAL_PERFORMANCE_VALIDATION.md
```

---

## Individual Lighthouse Tests

### Desktop Test
```bash
npm run lhci:desktop
```

### Mobile Test
```bash
npm run lhci:mobile
```

### Slow 3G Test
```bash
npm run lhci:slow3g
```

### Complete Test Suite
```bash
npm run lhci:full
```
(Runs build + desktop + mobile tests)

---

## Other Validation Scripts

### Page Weight Audit
```bash
npm run audit:weight
```

### Per-Page Weight Analysis
```bash
npm run audit:page
```

### Compression Test
```bash
npm run test:compression
```

### Mobile Performance Test
```bash
npm run mobile:test
```

### Slow Network Test
```bash
npm run test:slow-network
```

---

## Performance Thresholds

### Mobile
- Performance Score: ≥ 90
- FCP: ≤ 1800ms
- LCP: ≤ 2500ms
- CLS: ≤ 0.1
- TBT: ≤ 200ms
- FID: ≤ 100ms

### Desktop
- Performance Score: ≥ 95
- FCP: ≤ 1800ms
- LCP: ≤ 2500ms
- CLS: ≤ 0.1
- TBT: ≤ 200ms

### Slow 3G
- TTI: ≤ 5000ms

---

## Troubleshooting

### Dev Server Not Running
**Error:** `Dev server is not running on http://localhost:5173`

**Solution:**
```bash
npm run dev
```

### Port Already in Use
**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
PORT=3000 npm run dev
```

### Lighthouse Timeout
**Error:** `Lighthouse test timed out`

**Solution:**
- Increase timeout in validation script
- Close other applications to free up resources
- Run tests on individual pages instead of all at once

### Build Required
**Warning:** `Build output not found`

**Solution:**
```bash
npm run build
```

---

## Quick Reference

| Command | Purpose | Dev Server Required |
|---------|---------|---------------------|
| `npm run validate:quick` | Quick optimization check | No |
| `npm run validate:performance` | Full Lighthouse validation | Yes |
| `npm run lhci:desktop` | Desktop Lighthouse test | Yes |
| `npm run lhci:mobile` | Mobile Lighthouse test | Yes |
| `npm run lhci:slow3g` | Slow 3G test | Yes |
| `npm run lhci:full` | Complete test suite | No (builds first) |
| `npm run audit:weight` | Page weight audit | No |
| `npm run build` | Production build | No |

---

## Expected Results

After running `npm run validate:quick`:
```
✅ All critical optimizations are in place!
```

After running `npm run validate:performance`:
```
📊 VALIDATION SUMMARY
Total Pages Tested: 15
Passed: 15 ✅
Failed: 0 ❌

✅ Validation PASSED - All pages meet performance thresholds!
```

---

## Next Steps After Validation

1. **Review Reports**
   - Check `FINAL_PERFORMANCE_VALIDATION.md`
   - Identify any pages close to thresholds

2. **Deploy to Production**
   ```bash
   npm run build
   # Deploy dist/ folder
   ```

3. **Set Up Monitoring**
   - Configure Real User Monitoring (RUM)
   - Set up performance alerts
   - Track Core Web Vitals trends

4. **Continuous Testing**
   - Run Lighthouse CI on every build
   - Monitor performance budgets
   - Review and optimize quarterly

---

## Support

For issues or questions:
1. Check `PERFORMANCE_OPTIMIZATION_COMPLETE.md` for detailed documentation
2. Review individual task documentation in `docs/` folder
3. Check Lighthouse CI configuration files
4. Review validation script source code

---

**Last Updated:** December 2, 2025  
**Status:** All optimizations implemented and validated ✅
