/**
 * Third-Party Script Loader
 * Utilities for lazy loading third-party scripts after page interactive
 * to improve initial page load performance
 */

/**
 * Load a script dynamically after page is interactive
 * @param {string} src - Script source URL
 * @param {Object} options - Script options (async, defer, id, etc.)
 * @returns {Promise} - Resolves when script is loaded
 */
export function loadScriptAsync(src, options = {}) {
  return new Promise((resolve, reject) => {
    // Check if script already exists
    if (options.id && document.getElementById(options.id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = options.async !== false; // Default to async
    
    if (options.defer) script.defer = true;
    if (options.id) script.id = options.id;
    if (options.crossOrigin) script.crossOrigin = options.crossOrigin;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    
    document.body.appendChild(script);
  });
}

/**
 * Load a script after the page is interactive
 * @param {Function} loadFn - Function that loads the script
 */
export function loadAfterInteractive(loadFn) {
  if (document.readyState === 'complete') {
    // Page already loaded
    setTimeout(loadFn, 0);
  } else if (document.readyState === 'interactive') {
    // DOM ready but resources still loading
    window.addEventListener('load', loadFn);
  } else {
    // Still loading
    window.addEventListener('DOMContentLoaded', () => {
      window.addEventListener('load', loadFn);
    });
  }
}

/**
 * Load a script on user interaction (click, scroll, etc.)
 * @param {Function} loadFn - Function that loads the script
 * @param {Object} options - Options for interaction detection
 */
export function loadOnInteraction(loadFn, options = {}) {
  const {
    events = ['click', 'scroll', 'touchstart', 'mousemove'],
    once = true
  } = options;

  let loaded = false;

  const load = () => {
    if (loaded) return;
    loaded = true;
    
    // Remove event listeners
    events.forEach(event => {
      window.removeEventListener(event, load);
    });
    
    loadFn();
  };

  // Add event listeners
  events.forEach(event => {
    window.addEventListener(event, load, { once, passive: true });
  });

  // Fallback: load after 5 seconds if no interaction
  setTimeout(() => {
    if (!loaded) load();
  }, 5000);
}

/**
 * Preconnect to a domain to speed up future requests
 * @param {string} url - Domain URL to preconnect
 */
export function preconnect(url) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * DNS prefetch for a domain
 * @param {string} url - Domain URL for DNS prefetch
 */
export function dnsPrefetch(url) {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Load Google Analytics / GTM after page interactive
 */
export function loadGoogleAnalytics(measurementId) {
  loadAfterInteractive(() => {
    // Load gtag.js
    loadScriptAsync(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`, {
      async: true,
      id: 'gtag-script'
    }).then(() => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', measurementId);
    }).catch(err => {
      console.warn('Failed to load Google Analytics:', err);
    });
  });
}

/**
 * Load Facebook Pixel after user interaction
 */
export function loadFacebookPixel(pixelId) {
  loadOnInteraction(() => {
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  });
}

/**
 * Load any third-party widget after user interaction
 * @param {Function} widgetLoader - Function that initializes the widget
 */
export function loadWidgetOnInteraction(widgetLoader) {
  loadOnInteraction(widgetLoader, {
    events: ['click', 'scroll', 'touchstart'],
    once: true
  });
}

export default {
  loadScriptAsync,
  loadAfterInteractive,
  loadOnInteraction,
  preconnect,
  dnsPrefetch,
  loadGoogleAnalytics,
  loadFacebookPixel,
  loadWidgetOnInteraction
};
