import React from "react";
import Routes from "./Routes/index";
import { ToastProvider } from './components/Common/ToastContext';
import CacheBuster from 'react-cache-buster';
import './assets/scss/theme.scss';
import fakeBackend from "./helpers/AuthType/fakeBackend";
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


function App() {
  const isProduction = process.env.NODE_ENV === 'production';
  return (
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
  );
}

export default App;
