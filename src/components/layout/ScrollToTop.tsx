'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Multiple approaches to ensure scroll reset works on all mobile browsers
    
    // Method 1: Immediate scroll to top
    window.scrollTo(0, 0);
    
    // Method 2: Force scroll after a brief delay for mobile browsers
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
    
    // Method 3: Additional fallback for stubborn mobile browsers
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    
    // Reset any potential transform or position issues
    document.body.style.transform = '';
    document.documentElement.style.transform = '';
    
  }, [pathname]);

  return null;
};

export default ScrollToTop;
