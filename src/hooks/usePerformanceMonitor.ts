import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  loadingTime: number;
  lastLoadTime: number;
  averageLoadTime: number;
  loadCount: number;
}

export const usePerformanceMonitor = (isLoading: boolean, componentName: string = 'Component') => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadingTime: 0,
    lastLoadTime: 0,
    averageLoadTime: 0,
    loadCount: 0,
  });
  
  const loadStartTime = useRef<number | null>(null);
  const loadTimes = useRef<number[]>([]);

  useEffect(() => {
    if (isLoading && loadStartTime.current === null) {
      // Start timing
      loadStartTime.current = performance.now();
    } else if (!isLoading && loadStartTime.current !== null) {
      // End timing
      const loadTime = performance.now() - loadStartTime.current;
      loadTimes.current.push(loadTime);
      
      // Keep only last 10 load times for average calculation
      if (loadTimes.current.length > 10) {
        loadTimes.current.shift();
      }
      
      const averageLoadTime = loadTimes.current.reduce((sum, time) => sum + time, 0) / loadTimes.current.length;
      
      setMetrics(prev => ({
        loadingTime: loadTime,
        lastLoadTime: loadTime,
        averageLoadTime,
        loadCount: prev.loadCount + 1,
      }));
      
      // Log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 ${componentName} Load Performance:`, {
          'Current Load': `${loadTime.toFixed(2)}ms`,
          'Average Load': `${averageLoadTime.toFixed(2)}ms`,
          'Total Loads': loadTimes.current.length,
        });
        
        // Warn about slow loads
        if (loadTime > 2000) {
          console.warn(`⚠️ Slow load detected in ${componentName}: ${loadTime.toFixed(2)}ms`);
        }
      }
      
      loadStartTime.current = null;
    }
  }, [isLoading, componentName]);

  return metrics;
};

export default usePerformanceMonitor; 