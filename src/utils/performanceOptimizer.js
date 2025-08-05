// Performance Optimization Utilities

// API Call Debouncer
export const createDebouncer = (delay = 300) => {
  let timeoutId;
  return (callback) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

// API Call Throttler
export const createThrottler = (delay = 1000) => {
  let lastCall = 0;
  return (callback) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback();
    }
  };
};

// Request Deduplication
const pendingRequests = new Map();

export const deduplicateRequest = (key, requestFn) => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  
  const promise = requestFn();
  pendingRequests.set(key, promise);
  
  promise.finally(() => {
    pendingRequests.delete(key);
  });
  
  return promise;
};

// Cache Management
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100;
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  set(key, value, ttl = this.defaultTTL) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();

// Intersection Observer for lazy loading
export const createIntersectionObserver = (callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Virtual Scrolling Helper
export const createVirtualScroller = (items, itemHeight, containerHeight) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;

  return {
    getVisibleRange: (scrollTop) => {
      const start = Math.floor(scrollTop / itemHeight);
      const end = Math.min(start + visibleCount, items.length);
      return { start, end, items: items.slice(start, end) };
    },
    getTotalHeight: () => totalHeight,
    getItemHeight: () => itemHeight
  };
};

// Memory Management
export const createMemoryManager = () => {
  const observers = new Set();
  const intervals = new Set();
  const timeouts = new Set();

  return {
    addObserver: (observer) => {
      observers.add(observer);
    },
    addInterval: (intervalId) => {
      intervals.add(intervalId);
    },
    addTimeout: (timeoutId) => {
      timeouts.add(timeoutId);
    },
    cleanup: () => {
      observers.forEach(observer => observer.disconnect());
      intervals.forEach(intervalId => clearInterval(intervalId));
      timeouts.forEach(timeoutId => clearTimeout(timeoutId));
      
      observers.clear();
      intervals.clear();
      timeouts.clear();
      
      cacheManager.clearExpired();
    }
  };
};

// Performance Monitoring
export const createPerformanceMonitor = () => {
  const metrics = {
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0,
    renderTime: 0,
    memoryUsage: 0
  };

  return {
    startTimer: (name) => {
      const start = performance.now();
      return () => {
        const duration = performance.now() - start;
        metrics[name] = (metrics[name] || 0) + duration;
        return duration;
      };
    },
    increment: (name) => {
      metrics[name] = (metrics[name] || 0) + 1;
    },
    getMetrics: () => ({ ...metrics }),
    reset: () => {
      Object.keys(metrics).forEach(key => {
        metrics[key] = 0;
      });
    }
  };
};

// Bundle Size Optimization
export const createCodeSplittingHelper = () => {
  const loadedModules = new Set();

  return {
    loadModule: async (modulePath) => {
      if (loadedModules.has(modulePath)) {
        return;
      }

      try {
        await import(modulePath);
        loadedModules.add(modulePath);
      } catch (error) {
        console.error(`Failed to load module: ${modulePath}`, error);
      }
    },
    isLoaded: (modulePath) => loadedModules.has(modulePath)
  };
};

// Image Optimization
export const createImageOptimizer = () => {
  const imageCache = new Map();

  return {
    preloadImage: (src) => {
      if (imageCache.has(src)) {
        return imageCache.get(src);
      }

      const promise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

      imageCache.set(src, promise);
      return promise;
    },
    getOptimizedSrc: (src, width, height) => {
      // Add image optimization parameters
      const url = new URL(src, window.location.origin);
      url.searchParams.set('w', width);
      url.searchParams.set('h', height);
      url.searchParams.set('q', '85');
      return url.toString();
    }
  };
};

// Network Status Monitor
export const createNetworkMonitor = () => {
  let isOnline = navigator.onLine;
  const listeners = new Set();

  const updateStatus = () => {
    const newStatus = navigator.onLine;
    if (newStatus !== isOnline) {
      isOnline = newStatus;
      listeners.forEach(listener => listener(isOnline));
    }
  };

  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);

  return {
    isOnline: () => isOnline,
    addListener: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    cleanup: () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      listeners.clear();
    }
  };
};

// Export all utilities
export default {
  createDebouncer,
  createThrottler,
  deduplicateRequest,
  cacheManager,
  createIntersectionObserver,
  createVirtualScroller,
  createMemoryManager,
  createPerformanceMonitor,
  createCodeSplittingHelper,
  createImageOptimizer,
  createNetworkMonitor
}; 