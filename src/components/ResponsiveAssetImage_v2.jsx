/**
 * ResponsiveAssetImage Component (Simplified Version)
 * Loads optimized responsive images from assets-optimized folder
 * Uses a simpler approach that tries common breakpoints and lets browser handle missing images
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
  
  // Common breakpoints - browser will ignore missing sizes
  const breakpoints = [320, 640, 768, 1024, 1280];
  
  // Generate srcset for all common breakpoints
  // Browser will gracefully handle if some sizes don't exist
  const srcSetArray = breakpoints.map(width => 
    `/assets-optimized/${baseName}-${width}w.webp ${width}w`
  );

  const srcSet = srcSetArray.join(', ');
  const fallbackSrc = `/assets-optimized/${baseName}.webp`;

  // Sizes attribute for responsive loading
  // Adjust these based on your layout needs
  const sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <img
      src={fallbackSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={loading}
      style={style}
      onError={(e) => {
        // Fallback to base image if srcset fails
        if (e.target.src !== fallbackSrc) {
          e.target.srcset = '';
          e.target.src = fallbackSrc;
        }
      }}
      {...props}
    />
  );
};

export default ResponsiveAssetImage;
