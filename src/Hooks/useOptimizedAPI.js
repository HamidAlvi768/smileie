import { useState, useEffect, useRef, useCallback } from 'react';

// Cache for API responses
const apiCache = new Map();
const pendingRequests = new Map();

// Generate cache key
const generateCacheKey = (url, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});
  return `${url}-${JSON.stringify(sortedParams)}`;
};

// Debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const useOptimizedAPI = (apiFunction, dependencies = [], options = {}) => {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    debounceTime = 300,
    enableCache = true,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  
  const mountedRef = useRef(true);
  const cacheKeyRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Cleanup function
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Generate cache key based on dependencies
  useEffect(() => {
    cacheKeyRef.current = generateCacheKey(apiFunction.name || 'api', dependencies);
  }, [apiFunction, dependencies]);

  // Check if data is stale
  const isDataStale = useCallback(() => {
    if (!lastFetched || !enableCache) return true;
    return Date.now() - lastFetched > cacheTime;
  }, [lastFetched, cacheTime, enableCache]);

  // Fetch data function
  const fetchData = useCallback(async (force = false) => {
    if (!mountedRef.current) return;

    const cacheKey = cacheKeyRef.current;
    if (!cacheKey) return;

    // Check cache first
    if (enableCache && !force && apiCache.has(cacheKey)) {
      const cachedData = apiCache.get(cacheKey);
      if (!isDataStale()) {
        setData(cachedData.data);
        setLoading(false);
        setError(null);
        return;
      }
    }

    // Check if request is already pending
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const requestPromise = apiFunction(...dependencies, abortControllerRef.current.signal);
      pendingRequests.set(cacheKey, requestPromise);

      const result = await requestPromise;

      if (mountedRef.current) {
        setData(result);
        setLastFetched(Date.now());
        
        // Cache the result
        if (enableCache) {
          apiCache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }
      }
    } catch (err) {
      if (mountedRef.current && err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      pendingRequests.delete(cacheKey);
    }
  }, [apiFunction, dependencies, enableCache, isDataStale]);

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce((force = false) => fetchData(force), debounceTime),
    [fetchData, debounceTime]
  );

  // Initial fetch
  useEffect(() => {
    if (refetchOnMount) {
      fetchData();
    }
  }, [fetchData, refetchOnMount]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (isDataStale()) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData, refetchOnWindowFocus, isDataStale]);

  // Manual refetch function
  const refetch = useCallback((force = false) => {
    fetchData(force);
  }, [fetchData]);

  // Clear cache for this specific API call
  const clearCache = useCallback(() => {
    const cacheKey = cacheKeyRef.current;
    if (cacheKey && apiCache.has(cacheKey)) {
      apiCache.delete(cacheKey);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    lastFetched,
    isStale: isDataStale(),
  };
};

// Utility function to clear all cache
export const clearAllCache = () => {
  apiCache.clear();
  pendingRequests.clear();
};

// Utility function to clear cache by pattern
export const clearCacheByPattern = (pattern) => {
  for (const key of apiCache.keys()) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  }
};

// Hook for real-time data with polling
export const usePollingAPI = (apiFunction, dependencies = [], options = {}) => {
  const {
    interval = 30000, // 30 seconds
    enabled = true,
    ...apiOptions
  } = options;

  const apiResult = useOptimizedAPI(apiFunction, dependencies, apiOptions);

  useEffect(() => {
    if (!enabled || !apiResult.data) return;

    const intervalId = setInterval(() => {
      apiResult.refetch(true); // Force refetch for polling
    }, interval);

    return () => clearInterval(intervalId);
  }, [enabled, interval, apiResult.data, apiResult.refetch]);

  return apiResult;
};

// Hook for infinite scroll or pagination
export const useInfiniteAPI = (apiFunction, dependencies = [], options = {}) => {
  const {
    pageSize = 20,
    initialPage = 1,
    ...apiOptions
  } = options;

  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState([]);

  const apiResult = useOptimizedAPI(
    (...args) => apiFunction(...args, page, pageSize),
    [...dependencies, page],
    apiOptions
  );

  useEffect(() => {
    if (apiResult.data) {
      if (page === initialPage) {
        setAllData(apiResult.data);
      } else {
        setAllData(prev => [...prev, ...apiResult.data]);
      }
      
      // Check if there's more data
      setHasMore(apiResult.data.length === pageSize);
    }
  }, [apiResult.data, page, pageSize, initialPage]);

  const loadMore = useCallback(() => {
    if (hasMore && !apiResult.loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, apiResult.loading]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setAllData([]);
    setHasMore(true);
    apiResult.clearCache();
  }, [initialPage, apiResult]);

  return {
    ...apiResult,
    data: allData,
    page,
    hasMore,
    loadMore,
    reset,
  };
}; 