import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './ContentTransition.scss';

const ContentTransition = ({ children, className = '' }) => {
  const location = useLocation();
  const contentRef = useRef(null);

  // Smooth scroll to top on route change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [location]);

  return (
    <div 
      ref={contentRef}
      className={`content-transition ${className}`}
    >
      {children}
    </div>
  );
};

export default ContentTransition;
