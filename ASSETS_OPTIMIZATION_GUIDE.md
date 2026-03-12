# Assets Image Optimization Guide

This guide explains how to optimize images in `src/assets` and use them responsively across different screen sizes.

## Overview

The optimization system creates multiple sizes of each image (320w, 640w, 768w, 1024w, 1280w, 1920w) in WebP format for optimal performance across different devices.

## Step 1: Optimize Your Assets

Run the optimization script to generate responsive versions of all images in `src/assets`:

```bash
npm run optimize:assets
```

This will:
- Convert all PNG/JPG images to WebP format
- Generate responsive sizes (320w, 640w, 768w, 1024w, 1280w, 1920w)
- Save optimized images to `public/assets-optimized/`
- Create a manifest.json file with optimization details

## Step 2: Use Responsive Images in Components

### Option 1: Using the ResponsiveAssetImage Component (Recommended)

Import and use the `ResponsiveAssetImage` component:

```jsx
import ResponsiveAssetImage from '../components/ResponsiveAssetImage';

function MyComponent() {
  return (
    <ResponsiveAssetImage
      src="man.png"
      alt="Scrapiz Representative"
      className="w-full h-auto"
      loading="lazy"
    />
  );
}
```

The component automatically:
- Loads the appropriate image size based on screen width
- Uses WebP format for better compression
- Implements lazy loading by default
- Provides srcset for responsive images

### Option 2: Manual Implementation

If you need more control, use the standard `<img>` tag with srcset:

```jsx
<img
  src="/assets-optimized/man.webp"
  srcSet="
    /assets-optimized/man-320w.webp 320w,
    /assets-optimized/man-640w.webp 640w,
    /assets-optimized/man-768w.webp 768w,
    /assets-optimized/man-1024w.webp 1024w,
    /assets-optimized/man-1280w.webp 1280w,
    /assets-optimized/man-1920w.webp 1920w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Scrapiz Representative"
  loading="lazy"
/>
```

## Step 3: Update Existing Components

### Before (Original):
```jsx
import personImg from "../assets/man.png";

<img
  src={personImg}
  alt="Scrapiz Representative"
  className="w-40 h-auto"
  loading="lazy"
/>
```

### After (Optimized):
```jsx
import ResponsiveAssetImage from '../components/ResponsiveAssetImage';

<ResponsiveAssetImage
  src="man.png"
  alt="Scrapiz Representative"
  className="w-40 h-auto"
  loading="lazy"
/>
```

## Customizing Sizes Attribute

The `sizes` attribute tells the browser how much space the image will take up. Adjust based on your layout:

```jsx
// Full width on mobile, half width on tablet, third width on desktop
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

// Always full width
sizes="100vw"

// Fixed width
sizes="400px"

// Complex layout
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
```

## Images in src/assets

Current images that will be optimized:
- apple.png (App Store badge)
- google.png (Google Play badge)
- img5.jpeg
- man.png (Representative image)
- phones.png
- pickup.jpeg
- pricing.jpeg
- service.jpg
- services_2.png through services_6.png
- step1.png through step4.png
- truck.png
- verfied.jpeg
- whyus.jpeg

**Note:** SVG files (react.svg, whatsapp.svg) are not optimized as they're already vector format.

## Performance Benefits

- **Reduced file sizes**: WebP format provides 25-35% better compression than PNG/JPG
- **Faster loading**: Browser loads only the size it needs
- **Better UX**: Faster page loads, especially on mobile
- **SEO improvement**: Better Core Web Vitals scores

## Build Process Integration

The optimized images are in the `public/` folder, so they'll be automatically included in your build. No additional configuration needed!

## Troubleshooting

### Images not loading?
- Make sure you ran `npm run optimize:assets`
- Check that `public/assets-optimized/` folder exists
- Verify the image name matches (case-sensitive)

### Want to re-optimize?
Simply run `npm run optimize:assets` again. It will overwrite existing optimized images.

## Example: Complete Component Update

Here's a complete example of updating the HeroSection component:

```jsx
import { motion } from "framer-motion";
import ResponsiveAssetImage from "../components/ResponsiveAssetImage";
import googlePlay from "../assets/google.png";
import appStore from "../assets/apple.png";

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="max-w-7xl mx-auto">
        {/* Person Image - Now Responsive */}
        <ResponsiveAssetImage
          src="man.png"
          alt="Scrapiz Representative"
          className="w-[380px] md:w-[350px] h-[500px]"
          loading="eager"
        />
        
        {/* Truck Image - Now Responsive */}
        <ResponsiveAssetImage
          src="truck.png"
          alt="Scrapiz Truck"
          className="w-[550px] md:w-[500px] h-[340px]"
          loading="lazy"
        />
      </div>
    </section>
  );
}
```

## Next Steps

1. Run `npm run optimize:assets` to generate optimized images
2. Update your components to use `ResponsiveAssetImage`
3. Test on different screen sizes
4. Monitor performance improvements in Lighthouse

Happy optimizing! 🚀
