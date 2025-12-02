import imageMap from './imageMap.json';

/**
 * Get responsive image data for a given image filename
 * @param {string} filename - Image filename (e.g., "Scrapiz-Bandra.webp")
 * @returns {object|null} Image data with srcSet, sizes, dimensions
 */
export const getResponsiveImageData = (filename) => {
  const baseName = filename.replace(/\.webp$/i, '').split('/').pop();
  return imageMap[baseName] || null;
};

/**
 * Get srcSet string for an image
 * @param {string} filename - Image filename
 * @returns {string} srcSet string or empty string
 */
export const getSrcSet = (filename) => {
  const data = getResponsiveImageData(filename);
  return data?.srcSet || '';
};

/**
 * Get sizes attribute for an image
 * @param {string} filename - Image filename
 * @param {string} customSizes - Custom sizes string (optional)
 * @returns {string} sizes string
 */
export const getSizes = (filename, customSizes) => {
  if (customSizes) return customSizes;
  const data = getResponsiveImageData(filename);
  return data?.sizes || '100vw';
};

/**
 * Get image dimensions
 * @param {string} filename - Image filename
 * @returns {object} Object with width and height
 */
export const getImageDimensions = (filename) => {
  const data = getResponsiveImageData(filename);
  return {
    width: data?.width || undefined,
    height: data?.height || undefined
  };
};

/**
 * Get the best image source for a given viewport width
 * @param {string} filename - Image filename
 * @param {number} viewportWidth - Viewport width in pixels
 * @returns {string} Best image source URL
 */
export const getBestImageSource = (filename, viewportWidth) => {
  const data = getResponsiveImageData(filename);
  if (!data || !data.responsive || data.responsive.length === 0) {
    return data?.original || filename;
  }

  // Find the smallest image that's larger than the viewport
  const sorted = [...data.responsive].sort((a, b) => a.width - b.width);
  const best = sorted.find(img => img.width >= viewportWidth);
  
  return best ? best.src : data.original;
};

/**
 * Preload critical images for better performance
 * @param {string[]} filenames - Array of image filenames to preload
 */
export const preloadImages = (filenames) => {
  filenames.forEach(filename => {
    const data = getResponsiveImageData(filename);
    if (data) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = data.original;
      if (data.srcSet) {
        link.imageSrcset = data.srcSet;
        link.imageSizes = data.sizes;
      }
      document.head.appendChild(link);
    }
  });
};

/**
 * Get all available image names
 * @returns {string[]} Array of image base names
 */
export const getAvailableImages = () => {
  return Object.keys(imageMap);
};

/**
 * Check if responsive images exist for a filename
 * @param {string} filename - Image filename
 * @returns {boolean} True if responsive images exist
 */
export const hasResponsiveImages = (filename) => {
  const data = getResponsiveImageData(filename);
  return data && data.responsive && data.responsive.length > 0;
};
