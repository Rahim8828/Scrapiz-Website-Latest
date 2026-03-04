# Quick Start: Optimizing Assets Images

## 1️⃣ Run the Optimization Script

```bash
npm run optimize:assets
```

This creates optimized WebP images in `public/assets-optimized/` with multiple sizes:
- 320w (mobile)
- 640w (small tablet)
- 768w (tablet)
- 1024w (small desktop)
- 1280w (desktop)
- 1920w (large desktop)

## 2️⃣ Update Your Components

### Before:
```jsx
import personImg from "../assets/man.png";

<img src={personImg} alt="Person" className="w-40" />
```

### After:
```jsx
import ResponsiveAssetImage from '../components/ResponsiveAssetImage';

<ResponsiveAssetImage src="man.png" alt="Person" className="w-40" />
```

## 3️⃣ That's It!

The browser will automatically:
- Load the right size for the screen
- Use WebP format (25-35% smaller)
- Lazy load images (better performance)

## Common Props

```jsx
<ResponsiveAssetImage
  src="image.png"           // Required: filename from src/assets
  alt="Description"         // Required: for accessibility
  className="w-full h-auto" // Optional: CSS classes
  loading="lazy"            // Optional: "lazy" or "eager" (default: lazy)
  style={{}}                // Optional: inline styles
/>
```

## Images Available

All images in `src/assets/` will be optimized:
- man.png
- truck.png
- phones.png
- pickup.jpeg
- pricing.jpeg
- service.jpg
- services_2.png to services_6.png
- step1.png to step4.png
- verified.jpeg
- whyus.jpeg
- img5.jpeg

**Note:** SVG files (whatsapp.svg, react.svg) don't need optimization.

## Performance Impact

- ✅ 25-35% smaller file sizes
- ✅ Faster page loads
- ✅ Better mobile experience
- ✅ Improved SEO scores
- ✅ Automatic responsive loading

## Need Help?

See `ASSETS_OPTIMIZATION_GUIDE.md` for detailed documentation.
