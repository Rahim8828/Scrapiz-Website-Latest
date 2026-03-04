import { getAvailableSizes } from '../utils/imageManifest';

/**
 * ResponsiveAssetImage Component
 * Loads optimized responsive images from assets-optimized folder
 * Automatically selects the appropriate size based on screen width
 * Only includes sizes that actually exist for each image
 * 
 * @param {string} src - Original image name (e.g., "man.png")
 * @param {string} alt - Alt text for accessibility
 * @param {string} className - Additional CSS classes
 * @param {string} loading - Loading strategy ("lazy" or "eager")
 * @param {object} style - Inline styles
 */
const ResponsiveAssetImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  style = {},
  ...props 
}) => {
  // Extract filename without extension
  const getBaseName = (filename) => {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.substring(0, lastDot) : filename;
  };

  const baseName = getBaseName(src);
  
  // Get available sizes for this specific image
  const availableSizes = getAvailableSizes(baseName);
  
  // Generate srcset only for sizes that actually exist
  const srcSetArray = availableSizes.map(width => 
    `/assets-optimized/${baseName}-${width}w.webp ${width}w`
  );

  const srcSet = srcSetArray.length > 0 ? srcSetArray.join(', ') : '';
  const fallbackSrc = `/assets-optimized/${baseName}.webp`;

  // Sizes attribute for responsive loading
  // Adjust these based on your layout needs
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <img
      src={fallbackSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      className={className}
      loading={loading}
      style={style}
      {...props}
    />
  );
};

export default ResponsiveAssetImage;
