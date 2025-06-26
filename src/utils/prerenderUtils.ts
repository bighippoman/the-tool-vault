import { useEffect, DependencyList } from 'react';

// Extend Window interface for prerender properties
declare global {
  interface Window {
    __isPrerendering?: boolean;
    __PRERENDER_INJECTED?: boolean;
    __prerenderReady?: boolean;
    __renderSignaled?: boolean;
    __appRendered?: boolean;
    __contentLoaded?: boolean;
  }
}

export const useRenderSignal = (dependencies: DependencyList) => {
  useEffect(() => {
    // Enhanced prerender signaling with multiple checkpoints and better JSDOM compatibility
    const signalReady = () => {
      if (typeof window !== 'undefined') {
        // Check if we're in prerender mode first
        const isPrerendering = !!(window.__isPrerendering || window.__PRERENDER_INJECTED);
        
        // Primary signal for prerenderer (required by JSDOM renderer)
        window.dispatchEvent(new Event('render-event'));
        
        // Additional signals for redundancy
        window.dispatchEvent(new Event('page-ready'));
        window.dispatchEvent(new Event('app-rendered'));
        window.dispatchEvent(new Event('content-loaded'));
        
        // Set flags for backup detection
        window.__prerenderReady = true;
        window.__appRendered = true;
        window.__contentLoaded = true;
        
        // Enhanced logging for debugging prerender issues
        if (isPrerendering) {
          console.log(' PRERENDER: Signals dispatched for:', window.location.pathname);
          console.log(' PRERENDER: Page state ready, meta tags updated');
        } else {
          console.log(' Regular render signals dispatched for:', window.location.pathname);
        }
        
        // Multiple delayed signals to ensure JSDOM catches at least one
        setTimeout(() => {
          window.dispatchEvent(new Event('render-event'));
          window.dispatchEvent(new Event('final-render'));
          if (isPrerendering) {
            console.log(' PRERENDER: Final render signal sent for:', window.location.pathname);
          }
        }, 100);
        
        setTimeout(() => {
          window.dispatchEvent(new Event('render-event'));
          window.dispatchEvent(new Event('ultra-final-render'));
          if (isPrerendering) {
            console.log(' PRERENDER: Ultra-final render signal sent for:', window.location.pathname);
          }
        }, 500);
      }
    };

    // Wait for dependencies and DOM to be ready with multiple triggers
    const timer1 = setTimeout(signalReady, 50);
    const timer2 = setTimeout(signalReady, 200);
    const timer3 = setTimeout(signalReady, 500);
    
    // Also signal immediately if DOM is already complete
    if (document.readyState === 'complete') {
      setTimeout(signalReady, 10);
      setTimeout(signalReady, 100);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, dependencies);
  
  // Listen for meta tag updates (critical for tool-specific SEO)
  useEffect(() => {
    const handleMetaUpdate = () => {
      const isPrerendering = !!(window.__isPrerendering || window.__PRERENDER_INJECTED);
      if (isPrerendering) {
        console.log(' PRERENDER: Meta tags updated, signaling readiness');
      }
      
      // Multiple signals after meta updates
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('render-event'));
          window.dispatchEvent(new Event('meta-updated'));
        }
      }, 10);
      
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('render-event'));
          window.dispatchEvent(new Event('meta-final'));
        }
      }, 100);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('meta-tags-updated', handleMetaUpdate);
      return () => window.removeEventListener('meta-tags-updated', handleMetaUpdate);
    }
  }, []);

  // Enhanced DOM ready detection with better JSDOM compatibility
  useEffect(() => {
    const signalDOMReady = () => {
      if (typeof window !== 'undefined' && document.readyState === 'complete') {
        const isPrerendering = !!(window.__isPrerendering || window.__PRERENDER_INJECTED);
        
        setTimeout(() => {
          window.dispatchEvent(new Event('render-event'));
          window.dispatchEvent(new Event('dom-ready'));
          if (isPrerendering) {
            console.log(' PRERENDER: DOM complete signal sent for:', window.location.pathname);
          }
        }, 10);
        
        setTimeout(() => {
          window.dispatchEvent(new Event('render-event'));
          window.dispatchEvent(new Event('dom-final'));
        }, 200);
      }
    };

    if (document.readyState === 'complete') {
      signalDOMReady();
    } else {
      const handleLoad = () => {
        signalDOMReady();
        // Additional signals after full page load
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('render-event'));
            window.dispatchEvent(new Event('assets-loaded'));
          }
        }, 100);
        
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('render-event'));
            window.dispatchEvent(new Event('assets-final'));
          }
        }, 300);
      };
      
      window.addEventListener('load', handleLoad);
      document.addEventListener('DOMContentLoaded', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
        document.removeEventListener('DOMContentLoaded', handleLoad);
      };
    }
  }, []);

  // Signal when all images are loaded (important for complete snapshots)
  useEffect(() => {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;
    
    const checkAllImagesLoaded = () => {
      loadedImages++;
      if (loadedImages === totalImages && typeof window !== 'undefined') {
        const isPrerendering = !!(window.__isPrerendering || window.__PRERENDER_INJECTED);
        
        setTimeout(() => {
          window.dispatchEvent(new Event('render-event'));
          window.dispatchEvent(new Event('images-loaded'));
          if (isPrerendering) {
            console.log(' PRERENDER: All images loaded signal sent');
          }
        }, 50);
        
        setTimeout(() => {
          window.dispatchEvent(new Event('render-event'));
          window.dispatchEvent(new Event('images-final'));
        }, 200);
      }
    };

    if (totalImages > 0) {
      images.forEach(img => {
        if (img.complete) {
          checkAllImagesLoaded();
        } else {
          img.addEventListener('load', checkAllImagesLoaded);
          img.addEventListener('error', checkAllImagesLoaded); // Count errors as "loaded" to avoid hanging
        }
      });
    } else {
      // If no images, signal immediately
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('render-event'));
          window.dispatchEvent(new Event('no-images'));
        }
      }, 10);
    }
  }, []);

  // Additional effect to ensure render signals are sent periodically during prerendering
  useEffect(() => {
    const isPrerendering = !!(window.__isPrerendering || window.__PRERENDER_INJECTED);
    
    if (isPrerendering && typeof window !== 'undefined') {
      const interval = setInterval(() => {
        window.dispatchEvent(new Event('render-event'));
        console.log(' PRERENDER: Periodic render signal sent');
      }, 250);
      
      // Clear after reasonable time
      setTimeout(() => {
        clearInterval(interval);
        // Final burst of signals
        window.dispatchEvent(new Event('render-event'));
        window.dispatchEvent(new Event('render-event'));
        window.dispatchEvent(new Event('render-event'));
        console.log(' PRERENDER: Final signal burst completed');
      }, 1500);
      
      return () => clearInterval(interval);
    }
  }, []);
};

// Utility to check if we're in prerender mode
export const isPrerendering = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.__isPrerendering || window.__PRERENDER_INJECTED);
};

// Enhanced meta tag update function that signals prerenderer with better timing
export const updateMetaForPrerender = (meta: Record<string, string>) => {
  Object.entries(meta).forEach(([name, content]) => {
    let element = document.querySelector(`meta[name="${name}"]`) || 
                 document.querySelector(`meta[property="${name}"]`);
    
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        element.setAttribute('property', name);
      } else {
        element.setAttribute('name', name);
      }
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  });

  // Signal that meta tags have been updated with multiple events
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('meta-tags-updated'));
    
    setTimeout(() => {
      window.dispatchEvent(new Event('render-event'));
      window.dispatchEvent(new Event('meta-render-1'));
    }, 10);
    
    setTimeout(() => {
      window.dispatchEvent(new Event('render-event'));
      window.dispatchEvent(new Event('meta-render-2'));
    }, 50);
    
    setTimeout(() => {
      window.dispatchEvent(new Event('render-event'));
      window.dispatchEvent(new Event('meta-render-final'));
    }, 100);
  }
};
