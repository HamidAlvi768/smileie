import { useRef, useCallback, useEffect, useState, useMemo } from 'react';

// Cache for API responses
const apiCache = new Map();
const cacheTimeout = 5 * 60 * 1000; // 5 minutes

const usePerformanceOptimization = () => {
  const abortControllerRef = useRef(null);

  // Debounce function
  const debounce = useCallback((func, delay = 300) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Throttle function
  const throttle = useCallback((func, limit = 300) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }, []);

  // API caching function
  const cachedApiCall = useCallback(async (key, apiFunction, options = {}) => {
    const { cacheTime = cacheTimeout, forceRefresh = false } = options;
    
    // Check cache first
    if (!forceRefresh && apiCache.has(key)) {
      const cached = apiCache.get(key);
      if (Date.now() - cached.timestamp < cacheTime) {
        return cached.data;
      }
    }

    // Make API call
    try {
      const data = await apiFunction();
      
      // Cache the result
      apiCache.set(key, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      throw error;
    }
  }, []);

  // Clear cache function
  const clearCache = useCallback((key = null) => {
    if (key) {
      apiCache.delete(key);
    } else {
      apiCache.clear();
    }
  }, []);

  // Abort controller for cleanup
  const createAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Optimized scroll handler
  const optimizedScroll = useCallback((handler, options = {}) => {
    const { throttle: throttleTime = 16 } = options; // 60fps
    return throttle(handler, throttleTime);
  }, [throttle]);

  // Optimized resize handler
  const optimizedResize = useCallback((handler, options = {}) => {
    const { throttle: throttleTime = 250 } = options;
    return throttle(handler, throttleTime);
  }, [throttle]);

  // Memory efficient list rendering
  const useVirtualization = useCallback((items, itemHeight, containerHeight) => {
    const [scrollTop, setScrollTop] = useState(0);
    
    const visibleItems = useMemo(() => {
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      );
      
      return items.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        index: startIndex + index,
        style: {
          position: 'absolute',
          top: (startIndex + index) * itemHeight,
          height: itemHeight,
          width: '100%'
        }
      }));
    }, [items, scrollTop, itemHeight, containerHeight]);

    return {
      visibleItems,
      totalHeight: items.length * itemHeight,
      onScroll: (e) => setScrollTop(e.target.scrollTop)
    };
  }, []);

  return {
    debounce,
    throttle,
    cachedApiCall,
    clearCache,
    createAbortController,
    optimizedScroll,
    optimizedResize,
    useVirtualization
  };
};

export default usePerformanceOptimization;
