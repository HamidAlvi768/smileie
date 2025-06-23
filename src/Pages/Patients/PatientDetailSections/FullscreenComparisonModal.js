import React, { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import VisTimeline from './VisTimeline';
import { ImageViewer, IndicesPanel, ObservationsGoals } from './Monitoring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
// Make sure to import the new SCSS file
import '../../../assets/scss/pages/patient.scss'; 

const FullscreenComparisonModal = ({
  isOpen,
  toggle,
  leftData,
  rightData
}) => {
  // Add local selectedDate state for both sides
  const [leftSelectedDate, setLeftSelectedDate] = useState(leftData.imageViewerProps.images[0].date);
  const [rightSelectedDate, setRightSelectedDate] = useState(rightData.imageViewerProps.images[0].date);
  const leftSelectedImageIndex = leftData.imageViewerProps.images.findIndex(img => img.date === leftSelectedDate);
  const rightSelectedImageIndex = rightData.imageViewerProps.images.findIndex(img => img.date === rightSelectedDate);

  return (
    <Modal isOpen={isOpen} toggle={toggle} fullscreen className="comparison-modal" fade={false}>
      <ModalBody className="comparison-modal-body">
        {/* Close Button */}
        <button onClick={toggle} className="comparison-modal-close-btn" aria-label="Close">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Patient Header Row */}
        <div className="comparison-modal-header">
          <span className="header-icon-wrapper">
            <FontAwesomeIcon icon={faUserCircle} className="header-icon" />
          </span>
          <span className="header-patient-name">
            {leftData.patientName}
          </span>
          <span className="header-patient-id">
            {leftData.patientId}
          </span>
        </div>

        <div className="comparison-modal-content">
          {/* Left Side */}
          <div className="comparison-side comparison-side-left">
            <div className="comparison-timeline-wrapper">
              <VisTimeline 
                {...leftData.timelineProps} 
                minimal={true} 
                selectedDate={leftSelectedDate}
                onDateChange={setLeftSelectedDate}
              />
            </div>
            <div className="comparison-viewer-wrapper">
              <ImageViewer 
                {...leftData.imageViewerProps} 
                selectedDate={leftSelectedDate}
                setSelectedDate={setLeftSelectedDate}
                selectedImageIndex={leftSelectedImageIndex}
              />
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
                onDateChange={setRightSelectedDate}
              />
            </div>
            <div className="comparison-viewer-wrapper">
              <ImageViewer 
                {...rightData.imageViewerProps} 
                selectedDate={rightSelectedDate}
                setSelectedDate={setRightSelectedDate}
                selectedImageIndex={rightSelectedImageIndex}
              />
              {/* Other components can go here */}
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default FullscreenComparisonModal;