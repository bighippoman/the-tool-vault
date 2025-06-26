
import { useState, useEffect, useRef } from 'react';

interface UseLazyIconProps {
  iconPath: string;
  threshold?: number;
}

export const useLazyIcon = ({ iconPath, threshold = 0.1 }: UseLazyIconProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const currentImgRef = imgRef.current;
    
    if (!currentImgRef) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new intersection observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Disconnect after triggering to prevent multiple calls
          if (observerRef.current) {
            observerRef.current.unobserve(currentImgRef);
          }
        }
      },
      { threshold }
    );

    observerRef.current.observe(currentImgRef);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [iconPath, threshold]);

  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      const img = new Image();
      
      img.onload = () => {
        setIsLoaded(true);
      };
      
      img.onerror = () => {
        setHasError(true);
      };
      
      img.src = iconPath;
    }
  }, [isInView, iconPath, isLoaded, hasError]);

  return {
    imgRef,
    shouldShowImage: isLoaded && !hasError,
    shouldShowFallback: hasError || (!isLoaded && isInView),
    isLoading: isInView && !isLoaded && !hasError
  };
};
