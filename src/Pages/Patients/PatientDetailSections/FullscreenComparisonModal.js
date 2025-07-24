import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalBody, Button, ButtonGroup } from 'reactstrap';
import VisTimeline from './VisTimeline';
import { ImageViewer, IndicesPanel, ObservationsGoals } from './Monitoring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import config from '../../../config';
// Make sure to import the new SCSS file
import '../../../assets/scss/pages/patient.scss';

// Custom Image Viewer for Comparison Modal that matches monitoring screen layout exactly
const ComparisonImageViewer = ({ images, selectedImageIndex, onImageClick, onThumbnailClick, onDownload }) => {
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  const [imageLoadSuccess, setImageLoadSuccess] = useState({});

  const validImages = Array.isArray(images) ? images.filter(img => img && img.src && img.src !== '') : [];
  const safeImageIndex = selectedImageIndex >= 0 && selectedImageIndex < validImages.length ? selectedImageIndex : 0;
  const mainImageUrl = validImages.length > 0 ? validImages[safeImageIndex].src : '';

  // Handle image load errors
  const handleImageError = (imageSrc) => {
    console.log('❌ Image failed to load:', imageSrc);
    setImageLoadErrors(prev => ({ ...prev, [imageSrc]: true }));
  };

  // Handle successful image loads
  const handleImageLoad = (imageSrc) => {
    console.log('✅ Image loaded successfully:', imageSrc);
    setImageLoadSuccess(prev => ({ ...prev, [imageSrc]: true }));
    setImageLoadErrors(prev => ({ ...prev, [imageSrc]: false }));
  };

  // Debug logging
  console.log('🔍 ComparisonImageViewer Debug:');
  console.log('  - Raw images:', images);
  console.log('  - Valid images:', validImages);
  console.log('  - Main image URL:', mainImageUrl);
  console.log('  - Selected index:', selectedImageIndex, 'Safe index:', safeImageIndex);
  console.log('  - Image load errors:', imageLoadErrors);
  console.log('  - Image load success:', imageLoadSuccess);

  // Test image URL accessibility
  useEffect(() => {
    if (mainImageUrl) {
      console.log('🔗 Testing image URL accessibility:', mainImageUrl);
      const img = new Image();
      img.onload = () => {
        console.log('✅ Image URL is accessible:', mainImageUrl);
        handleImageLoad(mainImageUrl);
      };
      img.onerror = () => {
        console.log('❌ Image URL is not accessible:', mainImageUrl);
        handleImageError(mainImageUrl);
      };
      img.src = mainImageUrl;
    }
  }, [mainImageUrl]);

  return (
    <div className="image-viewer-container" style={{
      width: '100%',
      maxWidth: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      gap: '16px'
    }}>
      {/* Main Image Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden'
      }}>
        {mainImageUrl && !imageLoadErrors[mainImageUrl] ? (
          <div className="image-viewer-main-content" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto'
          }}>
            <div style={{
              width: '100%',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              overflow: 'auto',
              padding: '16px'
            }}>
              <img
                src={mainImageUrl}
                alt="Main scan"
                className="image-viewer-main-image"
                style={{
                  cursor: 'zoom-in',
                  maxHeight: '100%',
                  maxWidth: '100%',
                  width: 'auto',
                  height: 'auto',
                  borderRadius: 8,
                  boxShadow: '0 2px 8px #0001',
                  display: 'block',
                  margin: '0 auto',
                  objectFit: 'cover'
                }}
                onClick={onImageClick}
                onError={() => handleImageError(mainImageUrl)}
                onLoad={() => handleImageLoad(mainImageUrl)}
              />
            </div>
            <div className="image-viewer-actions" style={{ flexShrink: 0, padding: '16px', textAlign: 'center' }}>
              <button type="button" className="image-viewer-action-button" onClick={onDownload}>
                <i className="mdi mdi-download"></i>
                Download Photo
              </button>
            </div>
          </div>
        ) : validImages.length > 0 ? (
          <div className="text-center text-muted py-4" style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div>
              <i className="mdi mdi-image-off-outline" style={{ fontSize: '2em', color: '#ccc' }}></i><br />
              {imageLoadErrors[mainImageUrl] ? (
                <div>
                  <strong>Failed to load image</strong><br />
                  <small style={{ color: '#999' }}>URL: {mainImageUrl}</small>
                </div>
              ) : (
                'Loading scan image...'
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted py-4" style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div>
              <i className="mdi mdi-image-off-outline" style={{ fontSize: '2em', color: '#ccc' }}></i><br />
              <strong>No images available</strong><br />
              <small style={{ color: '#999' }}>Valid images: {validImages.length}</small>
            </div>
          </div>
        )}
      </div>

      {/* Side Images Container */}
      {validImages.length > 0 && (
        <div style={{
          width: '120px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '8px 0'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#666',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            Thumbnails
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto',
            maxHeight: '100%',
            paddingRight: '4px'
          }}>
            {validImages.map((img, idx) => {
              const isActive = idx === safeImageIndex;
              const hasError = imageLoadErrors[img.src];
              const hasSuccess = imageLoadSuccess[img.src];
              return (
                <div key={img.id || `scan-${idx}`} style={{
                  position: 'relative',
                  width: '100px',
                  height: '60px',
                  flexShrink: 0
                }}>
                  <img
                    src={img.src}
                    alt={`Scan ${idx + 1}`}
                    onClick={() => onThumbnailClick(idx)}
                    className={`thumbnail-image${isActive ? ' active' : ''}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 6,
                      border: isActive ? '2px solid #1da5fe' : '1.5px solid #eee',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 0 0 2px #1da5fe33' : 'none',
                      opacity: hasError ? 0.5 : 1,
                      display: 'block'
                    }}
                    onError={() => handleImageError(img.src)}
                    onLoad={() => handleImageLoad(img.src)}
                  />
                  {hasError && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255,0,0,0.1)',
                      borderRadius: 6,
                      fontSize: '8px',
                      color: '#e74c3c',
                      fontWeight: 'bold'
                    }}>
                      ERROR
                    </div>
                  )}
                  {hasSuccess && (
                    <div style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 8,
                      height: 8,
                      backgroundColor: '#27ae60',
                      borderRadius: '50%',
                      border: '1px solid white'
                    }}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const FullscreenComparisonModal = ({
  isOpen,
  toggle,
  leftData,
  rightData
}) => {
  // Add local selectedDate state for both sides
  const [leftSelectedDate, setLeftSelectedDate] = useState(leftData?.imageViewerProps?.selectedDate || '');
  const [rightSelectedDate, setRightSelectedDate] = useState(rightData?.imageViewerProps?.selectedDate || '');

  // Add local image index state for both sides
  const [leftSelectedImageIndex, setLeftSelectedImageIndex] = useState(0);
  const [rightSelectedImageIndex, setRightSelectedImageIndex] = useState(0);

  // Update local state when props change
  useEffect(() => {
    console.log("🔄 Comparison Modal - Props changed:");
    console.log("  - Left selectedDate from props:", leftData?.imageViewerProps?.selectedDate);
    console.log("  - Right selectedDate from props:", rightData?.imageViewerProps?.selectedDate);
    
    if (leftData?.imageViewerProps?.selectedDate) {
      console.log("  - Updating leftSelectedDate to:", leftData.imageViewerProps.selectedDate);
      setLeftSelectedDate(leftData.imageViewerProps.selectedDate);
    }
    if (rightData?.imageViewerProps?.selectedDate) {
      console.log("  - Updating rightSelectedDate to:", rightData.imageViewerProps.selectedDate);
      setRightSelectedDate(rightData.imageViewerProps.selectedDate);
    }
  }, [leftData?.imageViewerProps?.selectedDate, rightData?.imageViewerProps?.selectedDate]);

  // Get images for the currently selected dates
  const getImagesForDate = (allImages, selectedDate) => {
    const images = allImages.filter(img => img.date === selectedDate);
    console.log(`📅 Getting images for date ${selectedDate}:`, images);
    return images;
  };

  const allLeftImages = Array.isArray(leftData?.imageViewerProps?.images) ?
    leftData.imageViewerProps.images.filter(img => img && img.src && img.src !== '') : [];
  const allRightImages = Array.isArray(rightData?.imageViewerProps?.images) ?
    rightData.imageViewerProps.images.filter(img => img && img.src && img.src !== '') : [];

  const leftImages = getImagesForDate(allLeftImages, leftSelectedDate);
  const rightImages = getImagesForDate(allRightImages, rightSelectedDate);

  // Reset image index when date changes
  useEffect(() => {
    setLeftSelectedImageIndex(0);
  }, [leftSelectedDate]);

  useEffect(() => {
    setRightSelectedImageIndex(0);
  }, [rightSelectedDate]);

  // Keyboard navigation for up/down arrows
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        setLeftSelectedImageIndex(idx => Math.max(0, idx - 1));
        setRightSelectedImageIndex(idx => Math.max(0, idx - 1));
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        setLeftSelectedImageIndex(idx => Math.min(leftImages.length - 1, idx + 1));
        setRightSelectedImageIndex(idx => Math.min(rightImages.length - 1, idx + 1));
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, leftImages.length, rightImages.length]);

  // Debug logging
  console.log('🔍 Comparison Modal Debug:');
  console.log('  - Left Data:', leftData);
  console.log('  - Right Data:', rightData);
  console.log('  - All Left Images:', allLeftImages);
  console.log('  - All Right Images:', allRightImages);
  console.log('  - Left Images for selected date:', leftImages);
  console.log('  - Right Images for selected date:', rightImages);
  console.log('  - Left Selected Date:', leftSelectedDate);
  console.log('  - Right Selected Date:', rightSelectedDate);
  console.log('  - Left Selected Image Index:', leftSelectedImageIndex);
  console.log('  - Right Selected Image Index:', rightSelectedImageIndex);
  console.log('  - Config WEB_APP_URL:', config.WEB_APP_URL);

  // Handlers for left side
  const handleLeftImageClick = () => {
    if (leftImages[leftSelectedImageIndex]) {
      // Open fullscreen modal or handle image click
      console.log('Left image clicked:', leftImages[leftSelectedImageIndex]);
    }
  };

  const handleLeftThumbnailClick = (index) => {
    setLeftSelectedImageIndex(index);
  };

  const handleLeftDownload = () => {
    if (leftImages[leftSelectedImageIndex]) {
      const link = document.createElement('a');
      link.href = leftImages[leftSelectedImageIndex].src;
      link.download = 'left-scan.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handlers for right side
  const handleRightImageClick = () => {
    if (rightImages[rightSelectedImageIndex]) {
      // Open fullscreen modal or handle image click
      console.log('Right image clicked:', rightImages[rightSelectedImageIndex]);
    }
  };

  const handleRightThumbnailClick = (index) => {
    setRightSelectedImageIndex(index);
  };

  const handleRightDownload = () => {
    if (rightImages[rightSelectedImageIndex]) {
      const link = document.createElement('a');
      link.href = rightImages[rightSelectedImageIndex].src;
      link.download = 'right-scan.jpg';
      document.body.removeChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} fullscreen className="comparison-modal" fade={false}>
      <ModalBody className="comparison-modal-body">
        {/* Close Button */}
        <button onClick={toggle} className="comparison-modal-close-btn" aria-label="Close">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Patient Header Row */}
        <div className="comparison-modal-header">
          <div className="d-flex align-items-center justify-content-center w-100">
            {/* Single Patient Info */}
            <div className="d-flex align-items-center">
              <span className="header-icon-wrapper">
                <FontAwesomeIcon icon={faUserCircle} className="header-icon" />
              </span>
              <span className="header-patient-name">
                {leftData?.patientName || 'Patient'}
              </span>
              <span className="header-patient-id">
                {leftData?.patientId || 'ID'}
              </span>
            </div>
          </div>
        </div>

        <div className="comparison-modal-content">
          {/* Left Side */}
          <div className="comparison-side comparison-side-left">
            <div className="comparison-timeline-wrapper">
              <VisTimeline
                {...leftData.timelineProps}
                minimal={true}
                selectedDate={leftSelectedDate}
                onDateChange={(date) => {
                  console.log("🔄 Left timeline date changed to:", date);
                  setLeftSelectedDate(date);
                  // Also update the parent component's selected date
                  if (leftData?.imageViewerProps?.setSelectedDate) {
                    leftData.imageViewerProps.setSelectedDate(date);
                  }
                }}
              />
            </div>
            <div className="comparison-viewer-wrapper">
              {leftImages.length > 0 ? (
                <ComparisonImageViewer
                  images={leftImages}
                  selectedImageIndex={leftSelectedImageIndex}
                  onImageClick={handleLeftImageClick}
                  onThumbnailClick={handleLeftThumbnailClick}
                  onDownload={handleLeftDownload}
                />
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="mdi mdi-image-off-outline" style={{ fontSize: '3em', color: '#ccc' }}></i>
                  <p className="mt-3">No scans available for {leftSelectedDate || 'this date'}</p>
                </div>
              )}
              {/* Other components can go here */}
            </div>
          </div>

          {/* Right Side */}
          <div className="comparison-side comparison-side-right">
            <div className="comparison-timeline-wrapper">
              <VisTimeline
                {...rightData.timelineProps}
                minimal={true}
                selectedDate={rightSelectedDate}
                onDateChange={(date) => {
                  console.log("🔄 Right timeline date changed to:", date);
                  setRightSelectedDate(date);
                  // Also update the parent component's selected date
                  if (rightData?.imageViewerProps?.setSelectedDate) {
                    rightData.imageViewerProps.setSelectedDate(date);
                  }
                }}
              />
            </div>
            <div className="comparison-viewer-wrapper">
              {rightImages.length > 0 ? (
                <ComparisonImageViewer
                  images={rightImages}
                  selectedImageIndex={rightSelectedImageIndex}
                  onImageClick={handleRightImageClick}
                  onThumbnailClick={handleRightThumbnailClick}
                  onDownload={handleRightDownload}
                />
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="mdi mdi-image-off-outline" style={{ fontSize: '3em', color: '#ccc' }}></i>
                  <p className="mt-3">No scans available for {rightSelectedDate || 'this date'}</p>
                </div>
              )}
              {/* Other components can go here */}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default FullscreenComparisonModal;