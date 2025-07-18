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

// Simple loading fallback if no Loading component exists
const Loading = () => <div>Loading...</div>;

// Activating fake backend
fakeBackend();

// Firebase
// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper"

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// }

// init firebase backend
// initFirebaseBackend(firebaseConfig)

var oldNoti=[];
function App() {
  const isProduction = process.env.NODE_ENV === 'production';
  const dispatch = useDispatch();
  const notificationCount = useSelector(state => state.notifications?.notificationCount);
  const prevNotificationCount = useRef(notificationCount);
  const audioRef = useRef(null);

  // Unlock audio on first user interaction
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        audioRef.current.muted = true;
        audioRef.current.play().catch(() => {});
        audioRef.current.muted = false;
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
    // dispatch(getNotifications()); // Initial fetch
    // SSE for notifications
    const eventSource = new window.EventSource('https://smileie.jantrah.com/backend/api/notifications/stream');
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data === 'object' && data !== null && 'total_notifications' in data) {
          dispatch(setNotificationCount(data.total_notifications));
        } else if (Array.isArray(data)) {
          data.forEach((notif) => dispatch(receiveNotificationSSE(notif.notification || notif)));
        } else if (data) {
          dispatch(receiveNotificationSSE(data.notification || data));
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

  useEffect(() => {
    if (
      typeof prevNotificationCount.current === "number" &&
      typeof notificationCount === "number" &&
      notificationCount > prevNotificationCount.current
    ) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
    prevNotificationCount.current = notificationCount;
  }, [notificationCount]);

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
