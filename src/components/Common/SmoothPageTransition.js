import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './SmoothPageTransition.scss';

const SmoothPageTransition = ({ children, className = '' }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('enter');
  const prevLocationRef = useRef(location);

  useEffect(() => {
    if (location !== prevLocationRef.current) {
      setIsTransitioning(true);
      setTransitionStage('exit');
      
      // Quick exit transition
      const exitTimer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('enter');
        
        // Quick enter transition
        const enterTimer = setTimeout(() => {
          setIsTransitioning(false);
        }, 150);
        
        return () => clearTimeout(enterTimer);
      }, 150);
      
      prevLocationRef.current = location;
      return () => clearTimeout(exitTimer);
    }
  }, [location]);

  return (
    <div 
      className={`smooth-page-transition ${transitionStage} ${isTransitioning ? 'transitioning' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export default SmoothPageTransition;
