'use client';

import { ReactNode, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from './CookieConsent';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    // Ensure viewport is properly set for mobile
    const setViewport = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      } else {
        const newViewport = document.createElement('meta');
        newViewport.name = 'viewport';
        newViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        document.head.appendChild(newViewport);
      }
    };

    setViewport();

    // Force scrollbar to be always visible to prevent width jumping
    document.documentElement.style.overflowY = 'scroll';
    document.body.style.overflowY = 'visible';

    // Force layout recalculation on mobile orientation change
    const handleOrientationChange = () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
        // Force a reflow
        document.body.style.height = 'auto';
        void document.body.offsetHeight;
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full stable-width-container">
      <Header />
      <main className="flex-grow w-full stable-width-container min-h-0">
        <div className="w-full stable-width-container">
          {children}
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default Layout;
