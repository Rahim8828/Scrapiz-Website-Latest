# Image Optimization Pipeline

This document explains how to use the image optimization pipeline for the Scrapiz website.

## Overview

The image optimization pipeline provides:
- **WebP format delivery** with quality optimization
- **Responsive image sizes** for different breakpoints (320px, 640px, 768px, 1024px, 1280px, 1920px)
- **Automatic srcset generation** for optimal image delivery
- **Easy-to-use React components** for implementing responsive images

## Directory Structure

```
public/
├── *.webp                    # Original optimized images
├── responsive/               # Generated responsive images
│   ├── *-320w.webp
│   ├── *-640w.webp
│   ├── *-768w.webp
│   ├── *-1024w.webp
│   ├── *-1280w.webp
│   ├── *-1920w.webp
│   └── manifest.json         # Metadata about generated images
src/
├── components/
│   └── OptimizedImage.jsx    # React component for responsive images
└── utils/
    ├── imageMap.json         # Auto-generated image metadata
    └── imageHelpers.js       # Helper functions for images
```

## Scripts

### 1. Generate Responsive Images

Generates responsive image sizes from existing WebP images:

```bash
node scripts/generateResponsiveImages.js
```

This script:
- Reads all `.webp` images from `public/` directory
- Generates responsive sizes for each image
- Creates `public/responsive/` directory with all variants
- Generates `src/utils/imageMap.json` for component usage
- Creates a manifest file with metadata

**When to run:**
- After adding new images to the `public/` directory
- When updating existing images
- As part of the build process

### 2. Optimize New Images

If you have new images in other formats (JPEG, PNG), use the optimization script:

```bash
node scripts/optimizeImages.js
```

This script:
- Converts images to WebP format
- Optimizes quality (85% by default)
- Generates responsive sizes
- Outputs to `public/optimized/` directory

## Using Optimized Images in Components

### Method 1: OptimizedImage Component (Recommended)

The `OptimizedImage` component automatically handles responsive images:

```jsx
import OptimizedImage from '@/components/OptimizedImage';

function MyComponent() {
  return (
    <OptimizedImage
      src="/Scrapiz-Bandra.webp"
      alt="Scrapiz Bandra Location"
      width={1200}
      height={600}
      loading="lazy"
      className="w-full h-auto"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
}
```

**Props:**
- `src` (required): Image filename or path
- `alt` (required): Alt text for accessibility
- `width`: Image width (auto-detected if not provided)
- `height`: Image height (auto-detected if not provided)
- `loading`: "lazy" (default) or "eager"
- `sizes`: Custom sizes attribute (optional, has smart defaults)
- `className`: CSS classes
- Any other standard img attributes

### Method 2: Helper Functions

For more control, use the helper functions:

```jsx
import { 
  getResponsiveImageData, 
  getSrcSet, 
  getSizes,
  getImageDimensions 
} from '@/utils/imageHelpers';

function MyComponent() {
  const imageData = getResponsiveImageData('Scrapiz-Bandra.webp');
  const { width, height } = getImageDimensions('Scrapiz-Bandra.webp');
  
  return (
    <img
      src={imageData.original}
      srcSet={imageData.srcSet}
      sizes={imageData.sizes}
      alt="Scrapiz Bandra"
      width={width}
      height={height}
      loading="lazy"
    />
  );
}
```

### Method 3: Preloading Critical Images

For above-the-fold images, preload them for better performance:

```jsx
import { useEffect } from 'react';
import { preloadImages } from '@/utils/imageHelpers';

function App() {
  useEffect(() => {
    // Preload hero images
    preloadImages([
      'Scrapiz-logo.webp',
      'scrapiz-facility.webp'
    ]);
  }, []);
  
  return <div>...</div>;
}
```

## Image Sizes Attribute

The `sizes` attribute tells the browser which image size to use based on viewport width:

```jsx
// Full width on mobile, half width on tablet, third width on desktop
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

// Fixed width
sizes="800px"

// Complex media queries
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
```

## Best Practices

### 1. Always Specify Dimensions

```jsx
// ✅ Good - prevents layout shift
<OptimizedImage
  src="/image.webp"
  width={1200}
  height={600}
  alt="Description"
/>

// ❌ Bad - causes layout shift
<OptimizedImage
  src="/image.webp"
  alt="Description"
/>
```

### 2. Use Lazy Loading for Below-Fold Images

```jsx
// ✅ Good - lazy load below-fold images
<OptimizedImage
  src="/image.webp"
  loading="lazy"
  alt="Description"
/>

// ✅ Good - eager load above-fold images
<OptimizedImage
  src="/hero-image.webp"
  loading="eager"
  alt="Hero"
/>
```

### 3. Provide Descriptive Alt Text

```jsx
// ✅ Good - descriptive alt text
<OptimizedImage
  src="/Scrapiz-Bandra.webp"
  alt="Scrapiz scrap collection facility in Bandra, Mumbai"
/>

// ❌ Bad - generic alt text
<OptimizedImage
  src="/Scrapiz-Bandra.webp"
  alt="Image"
/>
```

### 4. Use Appropriate Sizes Attribute

```jsx
// ✅ Good - matches actual layout
<OptimizedImage
  src="/image.webp"
  sizes="(max-width: 640px) 100vw, 50vw"
  className="w-full md:w-1/2"
/>

// ❌ Bad - doesn't match layout
<OptimizedImage
  src="/image.webp"
  sizes="100vw"
  className="w-full md:w-1/2"
/>
```

## Adding New Images

1. **Add WebP image to `public/` directory**
   ```bash
   cp new-image.webp public/
   ```

2. **Generate responsive sizes**
   ```bash
   node scripts/generateResponsiveImages.js
   ```

3. **Use in components**
   ```jsx
   <OptimizedImage src="/new-image.webp" alt="Description" />
   ```

## Converting Existing Images

If you have JPEG or PNG images:

1. **Place images in `public/` directory**

2. **Run optimization script**
   ```bash
   node scripts/optimizeImages.js
   ```

3. **Replace old images with optimized WebP versions**

4. **Generate responsive sizes**
   ```bash
   node scripts/generateResponsiveImages.js
   ```

## Performance Benefits

Using this pipeline provides:

- **60-80% file size reduction** through WebP format
- **Faster page loads** by serving appropriately sized images
- **Better Core Web Vitals** (LCP, CLS)
- **Reduced bandwidth usage** for users
- **Improved SEO** through faster load times

## Troubleshooting

### Image not found in imageMap

If you see a warning about missing responsive images:

1. Check if the image exists in `public/` directory
2. Run `node scripts/generateResponsiveImages.js`
3. Verify the image appears in `src/utils/imageMap.json`

### Images not loading

1. Check browser console for errors
2. Verify image paths are correct
3. Ensure responsive images were generated
4. Check that `public/responsive/` directory exists

### Build errors

If you get build errors related to images:

1. Ensure `sharp` is installed: `npm install --save-dev sharp`
2. Regenerate image map: `node scripts/generateResponsiveImages.js`
3. Clear build cache and rebuild

## Integration with Build Process

Add to `package.json` scripts:

```json
{
  "scripts": {
    "optimize:images": "node scripts/generateResponsiveImages.js",
    "prebuild": "npm run optimize:images",
    "build": "vite build"
  }
}
```

This ensures responsive images are generated before every build.
