import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import config from '../../../config';
import '../../../assets/scss/pages/patient.scss';

const FullscreenImageModal = ({ 
  isOpen, 
  toggle, 
  scansByDate = {},
  scanDates = [],
  selectedDate = '',
  onDateChange,
  selectedImageIndex = 0,
  onImageIndexChange
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedImageIndex);
  const [currentDate, setCurrentDate] = useState(selectedDate);

  // Update local state when props change
  useEffect(() => {
    setCurrentImageIndex(selectedImageIndex);
    setCurrentDate(selectedDate);
  }, [selectedImageIndex, selectedDate]);

  // Get current scans and image
  const currentScans = currentDate && scansByDate[currentDate] ? scansByDate[currentDate] : [];
  const currentImage = currentScans[currentImageIndex] || null;
  const currentImageUrl = currentImage && currentImage.scan_url ? 
    (currentImage.scan_url.startsWith('http') ? currentImage.scan_url : config.WEB_APP_URL + currentImage.scan_url) : '';

  // Navigation functions
  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      if (onImageIndexChange) onImageIndexChange(newIndex);
    } else if (currentImageIndex === 0) {
      // Go to last image of previous date
      const currentDateIndex = scanDates.indexOf(currentDate);
      if (currentDateIndex > 0) {
        const prevDate = scanDates[currentDateIndex - 1];
        const prevScans = scansByDate[prevDate] || [];
        const newIndex = prevScans.length - 1;
        setCurrentDate(prevDate);
        setCurrentImageIndex(newIndex);
        if (onDateChange) onDateChange(prevDate);
        if (onImageIndexChange) onImageIndexChange(newIndex);
      }
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < currentScans.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      if (onImageIndexChange) onImageIndexChange(newIndex);
    } else if (currentImageIndex === currentScans.length - 1) {
      // Go to first image of next date
      const currentDateIndex = scanDates.indexOf(currentDate);
      if (currentDateIndex < scanDates.length - 1) {
        const nextDate = scanDates[currentDateIndex + 1];
        setCurrentDate(nextDate);
        setCurrentImageIndex(0);
        if (onDateChange) onDateChange(nextDate);
        if (onImageIndexChange) onImageIndexChange(0);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextImage();
          break;
        case 'Escape':
          e.preventDefault();
          toggle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentImageIndex, currentDate, currentScans.length, scanDates]);

  // Check if navigation buttons should be disabled
  const isFirstImage = currentImageIndex === 0 && scanDates.indexOf(currentDate) === 0;
  const isLastImage = currentImageIndex === currentScans.length - 1 && scanDates.indexOf(currentDate) === scanDates.length - 1;

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" centered className="simple-fullscreen-modal" backdrop="static">
      <div className="simple-fim-container">
        {/* Close button */}
        <Button color="light" className="simple-fim-close-btn" onClick={toggle}>
          <FontAwesomeIcon icon={faTimes} />
        </Button>

        {/* Main content */}
        <div className="simple-fim-content">
          {/* Navigation buttons */}
          <Button 
            color="light" 
            className="simple-fim-nav-btn simple-fim-prev-btn" 
            onClick={goToPreviousImage}
            disabled={isFirstImage}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>

          {/* Main image */}
          <div className="simple-fim-image-center">
            {currentImageUrl ? (
              <img
                src={currentImageUrl}
                alt={`Scan ${currentImageIndex + 1}`}
                className="simple-fim-main-image"
              />
            ) : (
              <div className="text-center text-muted py-5">
                <i className="mdi mdi-image-off-outline" style={{ fontSize: '3em', color: '#ccc' }}></i>
                <p className="mt-3">No image available</p>
              </div>
            )}
          </div>

          <Button 
            color="light" 
            className="simple-fim-nav-btn simple-fim-next-btn" 
            onClick={goToNextImage}
            disabled={isLastImage}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </Button>
        </div>

        {/* Image counter */}
        <div className="simple-fim-counter">
          <span>{currentImageIndex + 1} of {currentScans.length}</span>
          {currentDate && <span className="simple-fim-date"> • {currentDate}</span>}
        </div>

        {/* Navigation instructions */}
        <div className="simple-fim-instructions">
          <span>Use <b>←</b> or <b>→</b> arrow keys to navigate</span>
        </div>
      </div>
    </Modal>
  );
};

export default FullscreenImageModal; 