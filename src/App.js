import React, { useRef, useEffect, useCallback } from "react";
import Routes from "./Routes/index";
import { ToastProvider } from './components/Common/ToastContext';
import CacheBuster from 'react-cache-buster';
import './assets/scss/theme.scss';
import fakeBackend from "./helpers/AuthType/fakeBackend";
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, receiveNotificationSSE, setNotificationCount } from './store/notifications/actions';
// Use require to import version from package.json (must be at the top for ESLint)
const { version } = require('../package.json');

// Enhanced loading component with shimmer effect
const Loading = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
    <div className="shimmer-card" style={{ width: "300px", height: "200px" }}>
      <div className="shimmer-header">
        <div className="shimmer-avatar"></div>
        <div className="shimmer-content">
          <div className="shimmer-line" style={{ width: '60%' }}></div>
          <div className="shimmer-line" style={{ width: '40%' }}></div>
        </div>
      </div>
      <div className="shimmer-body">
        <div className="shimmer-line" style={{ width: '80%' }}></div>
        <div className="shimmer-line" style={{ width: '70%' }}></div>
        <div className="shimmer-line" style={{ width: '90%' }}></div>
      </div>
    </div>
  </div>
);

// Activating fake backend
fakeBackend();

// Global styles to prevent gray screen glitches
const globalStyles = `
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    background: inherit;
    transition: background-color 0.2s ease-in-out;
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
  .loading-transition {
    background: inherit !important;
    min-height: 100vh;
    position: relative;
  }
  
  /* Smooth transitions */
  .page-transition *,
  .slide-transition *,
  .scale-transition *,
  .loading-transition * {
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
  
  /* Sound tooltip animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .sound-tooltip {
    animation: fadeIn 0.3s ease-in-out;
  }
`;

// Inject global styles
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

function App() {
  const isProduction = process.env.NODE_ENV === 'production';
  const dispatch = useDispatch();
  const notificationCount = useSelector(state => state.notifications?.notificationCount);
  const notifications = useSelector(state => state.notifications?.notifications || []);
  const prevNotificationCount = useRef(notificationCount);
  const audioRef = useRef(null);
  const prevNotificationsLength = useRef(notifications.length);
  const audioUnlocked = useRef(false);

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

  // Unlock audio on first user interaction (without playing sound)
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current && !audioUnlocked.current) {
        // Just unlock audio context without playing
        audioRef.current.muted = true;
        audioRef.current.volume = 0;
        audioRef.current.play().then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current.muted = false;
          audioRef.current.volume = 1;
          audioUnlocked.current = true;
        }).catch(() => {
          // Silently handle any errors
        });
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // Global polling for notifications
  React.useEffect(() => {
    // SSE for notifications
    const eventSource = new window.EventSource('https://smileie.jantrah.com/backend/api/notifications/stream');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data === 'object' && data !== null && 'total_notifications' in data) {
          dispatch(setNotificationCount(data.total_notifications));
        } else if (Array.isArray(data)) {
          data.forEach((notif) => {
            const notification = notif.notification || notif;
            dispatch(receiveNotificationSSE(notification));
            
            // Check if this is an important notification and play sound
            if (isImportantNotification(notification)) {
              const isSoundMuted = localStorage.getItem('notificationSoundMuted') === 'true';
              if (audioRef.current && !isSoundMuted && audioUnlocked.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {
                  // Silently handle play errors
                });
              }
            }
          });
        } else if (data) {
          const notification = data.notification || data;
          dispatch(receiveNotificationSSE(notification));
          
          // Check if this is an important notification and play sound
          if (isImportantNotification(notification)) {
            const isSoundMuted = localStorage.getItem('notificationSoundMuted') === 'true';
            if (audioRef.current && !isSoundMuted && audioUnlocked.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {
                // Silently handle play errors
              });
            }
          }
        }
      } catch (err) {
        // Optionally log or handle parse errors
      }
    };
    eventSource.onerror = (err) => {
      // Optionally handle errors, e.g., reconnect
      // eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [dispatch]);

  // Monitor notifications array for important notifications (fallback method)
  useEffect(() => {
    if (notifications.length > prevNotificationsLength.current) {
      // Check the latest notification(s) for importance
      const newNotifications = notifications.slice(prevNotificationsLength.current);
      const hasImportantNotification = newNotifications.some(notification => 
        isImportantNotification(notification)
      );
      
      if (hasImportantNotification && audioRef.current) {
        const isSoundMuted = localStorage.getItem('notificationSoundMuted') === 'true';
        if (!isSoundMuted && audioUnlocked.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {
            // Silently handle play errors
          });
        }
      }
    }
    prevNotificationsLength.current = notifications.length;
  }, [notifications]);

  return (
    <>
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2025/07/09/audio_121db7b43f.mp3" preload="auto" />
      <CacheBuster
        currentVersion={version}
        isEnabled={isProduction}
        isVerboseMode={false}
        loadingComponent={<Loading />}
        metaFileDirectory={'.'}
      >
        <ToastProvider>
          <Routes />
        </ToastProvider>
      </CacheBuster>
    </>
  );
}

export default App;
