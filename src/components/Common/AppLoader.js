import React, { useState, useEffect } from 'react';
import './AppLoader.scss';

const AppLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after a brief delay
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Complete loading after a brief delay
          setTimeout(() => {
            onComplete && onComplete();
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => {
      clearTimeout(contentTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="app-loader">
      <div className="app-loader__container">
        {/* Smileie Logo */}
        <div className="app-loader__logo">
          <div className="app-loader__logo-icon">
            <svg viewBox="0 0 100 100" className="app-loader__logo-svg">
              <circle cx="50" cy="50" r="45" className="app-loader__logo-circle" />
              <path d="M30 70 Q50 90 70 70" className="app-loader__logo-smile" />
              <circle cx="35" cy="35" r="5" className="app-loader__logo-eye" />
              <circle cx="65" cy="35" r="5" className="app-loader__logo-eye" />
            </svg>
          </div>
          <h1 className="app-loader__title">Smileie</h1>
        </div>

        {/* Loading Progress */}
        {showContent && (
          <div className="app-loader__progress">
            <div className="app-loader__progress-bar">
              <div 
                className="app-loader__progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="app-loader__progress-text">
              {progress < 100 ? `Loading... ${Math.round(progress)}%` : 'Ready!'}
            </div>
          </div>
        )}

        {/* Loading Animation */}
        <div className="app-loader__animation">
          <div className="app-loader__dots">
            <div className="app-loader__dot"></div>
            <div className="app-loader__dot"></div>
            <div className="app-loader__dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
