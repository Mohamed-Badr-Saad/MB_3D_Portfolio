import {  Suspense, useState, useEffect } from 'react';
import CanvasLoader from './Loader';

interface LazySectionProps {
  children: React.ReactNode;
  threshold?: number;
}

const LazySection: React.FC<LazySectionProps> = ({ 
  children, 
  threshold = 0.1 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      { 
        threshold,
        // Trigger earlier on mobile
        rootMargin: window.innerWidth <= 768 ? '50px' : '0px'
      }
    );

    const element = document.getElementById('lazy-trigger');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, hasLoaded]);

  return (
    <div>
      <div id="lazy-trigger" style={{ height: '1px' }} />
      {isVisible ? (
        <Suspense fallback={<CanvasLoader />}>
          {children}
        </Suspense>
      ) : (
        <div className="h-screen flex items-center justify-center">
          <CanvasLoader />
        </div>
      )}
    </div>
  );
};

export default LazySection;
