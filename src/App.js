import React, { useRef, useEffect, useCallback, useState } from "react";
import Routes from "./Routes/index";
import { ToastProvider } from './components/Common/ToastContext';
import CacheBuster from 'react-cache-buster';
import './assets/scss/theme.scss';
import fakeBackend from "./helpers/AuthType/fakeBackend";
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, receiveNotificationSSE, setNotificationCount } from './store/notifications/actions';
import AppLoader from './components/Common/AppLoader';
// Use require to import version from package.json (must be at the top for ESLint)
const { version } = require('../package.json');

// Activating fake backend
fakeBackend();

// Global styles to prevent gray screen glitches and improve performance
const globalStyles = `
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    background: inherit;
    transition: background-color 0.2s ease-in-out;
    font-display: swap;
  }
  
  #root {
    background: inherit;
    min-height: 100vh;
  }
  
  .routes-container {
    background: inherit !important;
    min-height: 100vh;
    position: relative;
  }
  
  .page-content {
    background: inherit;
    min-height: 100vh;
    position: relative;
  }
  
  /* Prevent gray screen during transitions */
  .page-transition,
  .slide-transition,
  .scale-transition,
  .loading-transition,
  .smooth-page-transition {
    background: inherit !important;
    min-height: 100vh;
    position: relative;
  }
  
  /* Smooth transitions */
  .page-transition *,
  .slide-transition *,
  .scale-transition *,
  .loading-transition *,
  .smooth-page-transition * {
    transition: inherit;
  }
  
  /* Dark theme support */
  [data-bs-theme="dark"] {
    background: var(--bs-body-bg, #1a1a1a) !important;
  }
  
  /* Light theme support */
  [data-bs-theme="light"] {
    background: var(--bs-body-bg, #ffffff) !important;
  }
  
  /* Performance optimizations */
  .shimmer-loader,
  .app-loader {
    will-change: transform;
  }
  
  /* Prevent layout shifts */
  .page-content,
  .routes-container {
    contain: layout style paint;
  }
  
  /* Optimize animations */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* Content transition optimizations */
  .content-transition {
    will-change: transform, opacity;
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  /* Ensure smooth scrolling */
  html {
    scroll-behavior: smooth;
  }
  
  /* Prevent content flash */
  .main-content {
    contain: layout style paint;
  }
`;

// Add global styles to document head
if (!document.getElementById('global-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'global-styles';
  styleElement.textContent = globalStyles;
  document.head.appendChild(styleElement);
}

const isProduction = process.env.NODE_ENV === 'production';

function App() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.notifications);
  const notificationCount = useSelector((state) => state.notifications.count);
  const audioRef = useRef(null);
  const audioUnlocked = useRef(false);
  const prevNotificationCount = useRef(0);
  const prevNotificationsLength = useRef(0);

  // Function to check if notification is important
  const isImportantNotification = (notification) => {
    if (!notification || !notification.title) return false;
    
    const title = notification.title.toLowerCase();
    const importantKeywords = [
      'new message from patient',
      'message from patient',
      'scan uploaded',
      'plan approved',
      'patient message',
      'scan received',
      'treatment plan approved'
    ];
    
    return importantKeywords.some(keyword => title.includes(keyword));
  };

  // Audio unlock for mobile devices
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = 0.3;
        audioUnlocked.current = true;
      }
    };

    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, unlockAudio, { once: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, unlockAudio);
      });
    };
  }, []);

  // Handle notifications
  useEffect(() => {
    if (notificationCount !== prevNotificationCount.current) {
      prevNotificationCount.current = notificationCount;
    }
  }, [notificationCount]);

  // Handle new notifications
  useEffect(() => {
    if (notifications.length > prevNotificationsLength.current) {
      const newNotifications = notifications.slice(prevNotificationsLength.current);
      const hasImportantNotification = newNotifications.some(isImportantNotification);
      
      if (hasImportantNotification && audioRef.current && audioUnlocked.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {
          // Ignore errors
        });
      }
      
      prevNotificationsLength.current = notifications.length;
    }
  }, [notifications]);

  // Initialize notifications
  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  // SSE for real-time notifications
  useEffect(() => {
    const eventSource = new EventSource(`${process.env.REACT_APP_API_URL || ''}/notifications/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          dispatch(receiveNotificationSSE(data.notification));
          dispatch(setNotificationCount(data.count));
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      // Optionally handle errors, e.g., reconnect
    };

    return () => {
      eventSource.close();
    };
  }, [dispatch]);

  // Handle app loading completion
  const handleAppLoadComplete = useCallback(() => {
    setIsAppLoaded(true);
  }, []);

  if (!isAppLoaded) {
    return <AppLoader onComplete={handleAppLoadComplete} />;
  }

  return (
    <>
      <audio ref={audioRef} preload="none">
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
      </audio>
      <CacheBuster
        currentVersion={version}
        isEnabled={isProduction}
        isVerboseMode={false}
        loadingComponent={<AppLoader onComplete={handleAppLoadComplete} />}
      >
        <ToastProvider>
          <Routes />
        </ToastProvider>
      </CacheBuster>
    </>
  );
}

export default App;
