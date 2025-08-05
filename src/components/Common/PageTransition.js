import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.scss';

const PageTransition = ({ children, className = '' }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut');
      setIsTransitioning(true);
      
      // Faster fade out to prevent gray screen
      const fadeOutTimer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
        
        // Quick fade in
        const fadeInTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
        
        return () => clearTimeout(fadeInTimer);
      }, 100);
      
      return () => clearTimeout(fadeOutTimer);
    }
  }, [location, displayLocation]);

  return (
    <div 
      className={`page-transition ${transitionStage} ${isTransitioning ? 'transitioning' : ''} ${className}`}
      style={{ 
        background: 'inherit',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
};

// Higher-order component for route transitions
export const withPageTransition = (Component) => {
  return (props) => (
    <PageTransition>
      <Component {...props} />
    </PageTransition>
  );
};

// Slide transition component
export const SlideTransition = ({ children, direction = 'right', className = '' }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('slideIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('slideOut');
      setIsTransitioning(true);
      
      const slideOutTimer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('slideIn');
        
        const slideInTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 150);
        
        return () => clearTimeout(slideInTimer);
      }, 150);
      
      return () => clearTimeout(slideOutTimer);
    }
  }, [location, displayLocation]);

  return (
    <div 
      className={`slide-transition ${direction} ${transitionStage} ${isTransitioning ? 'transitioning' : ''} ${className}`}
      style={{ 
        background: 'inherit',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
};

// Scale transition component
export const ScaleTransition = ({ children, className = '' }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('scaleIn');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('scaleOut');
      setIsTransitioning(true);
      
      const scaleOutTimer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('scaleIn');
        
        const scaleInTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 100);
        
        return () => clearTimeout(scaleInTimer);
      }, 100);
      
      return () => clearTimeout(scaleOutTimer);
    }
  }, [location, displayLocation]);

  return (
    <div 
      className={`scale-transition ${transitionStage} ${isTransitioning ? 'transitioning' : ''} ${className}`}
      style={{ 
        background: 'inherit',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
};

// Loading transition component
export const LoadingTransition = ({ children, isLoading, className = '' }) => {
  return (
    <div 
      className={`loading-transition ${isLoading ? 'loading' : 'loaded'} ${className}`}
      style={{ 
        background: 'inherit',
        minHeight: '100vh',
        position: 'relative'
      }}
    >
      {children}
    </div>
  );
};

// Quick transition component for instant page changes
export const QuickTransition = ({ children, className = '' }) => {
  const location = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [location]);

  return (
    <div 
      key={key}
      className={`quick-transition ${className}`}
      style={{ 
        background: 'inherit',
        minHeight: '100vh',
        position: 'relative',
        opacity: 1,
        transition: 'none'
      }}
    >
      {children}
    </div>
  );
}; 