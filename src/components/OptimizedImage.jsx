import { useState, useEffect, useRef } from 'react';
import imageMap from '@/utils/imageMap.json';

/**
 * OptimizedImage component that automatically uses responsive images
 * with proper srcset and sizes attributes for optimal performance.
 * Includes Intersection Observer fallback for older browsers.
 * 
 * @param {string} src - Image filename (e.g., "Scrapiz-Bandra.webp")
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - CSS classes
 * @param {string} sizes - Custom sizes attribute (optional)
 * @param {boolean} loading - Loading strategy: "lazy" or "eager" (default: "lazy")
 * @param {number} width - Image width (optional, auto-detected from imageMap)
 * @param {number} height - Image height (optional, auto-detected from imageMap)
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  sizes,
  loading = 'lazy',
  width,
  height,
  ...props 
}) => {
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(loading === 'eager');
  const imgRef = useRef(null);

  useEffect(() => {
    // Extract filename from src (handle both /image.webp and image.webp)
    const filename = src.split('/').pop();
    const baseName = filename.replace(/\.webp$/i, '');
    
    // Get image data from map
    const data = imageMap[baseName];
    
    if (data) {
      setImageData(data);
    } else {
      console.warn(`OptimizedImage: No responsive images found for "${src}". Using original.`);
      setError(true);
    }
  }, [src]);

  // Intersection Observer fallback for browsers that don't support native lazy loading
  useEffect(() => {
    // If eager loading or native lazy loading is supported, skip observer
    if (loading === 'eager' || 'loading' in HTMLImageElement.prototype) {
      setShouldLoad(true);
      return;
    }

    // Check if IntersectionObserver is available (not available in some test environments)
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    // Intersection Observer fallback for older browsers
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
      }
    );

    observer.observe(img);

    return () => {
      if (img) {
        observer.unobserve(img);
      }
    };
  }, [loading]);

  // Fallback to original image if no responsive versions exist
  if (error || !imageData) {
    return (
      <img
        ref={imgRef}
        src={shouldLoad ? src : undefined}
        data-src={!shouldLoad ? src : undefined}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    );
  }

  // Use responsive images with srcset
  return (
    <img
      ref={imgRef}
      src={shouldLoad ? imageData.original : undefined}
      data-src={!shouldLoad ? imageData.original : undefined}
      srcSet={shouldLoad ? imageData.srcSet : undefined}
      data-srcset={!shouldLoad ? imageData.srcSet : undefined}
      sizes={sizes || imageData.sizes}
      alt={alt}
      className={className}
      loading={loading}
      width={width || imageData.width}
      height={height || imageData.height}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
};

export default OptimizedImage;
