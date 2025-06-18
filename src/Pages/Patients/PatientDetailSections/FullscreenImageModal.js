import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button } from 'reactstrap';
import VisTimeline from './VisTimeline';
import '../../../assets/scss/pages/patient.scss';

// Mock data (reuse from Monitoring.js)
const mockImages = [
  require('../../../assets/images/intraoral_1.jpg'),
  require('../../../assets/images/intraoral_1.jpg'),
  require('../../../assets/images/intraoral_1.jpg'),
  require('../../../assets/images/intraoral_2.jpg'),
  require('../../../assets/images/intraoral_2.jpg'),
  require('../../../assets/images/intraoral_2.jpg'),
  require('../../../assets/images/intraoral_2.jpg'),
  require('../../../assets/images/intraoral_2.jpg'),
  require('../../../assets/images/intraoral_2.jpg'),
  require('../../../assets/images/intraoral_2.jpg'),
  require('../../../assets/images/intraoral_2.jpg'),
];

const mockTimelinePoints = [
  { alignerIndex: 'Slight unseat', dataObjectLabel: '2025-05-01', tooltip: 'Slight unseat: 1.2' },
  { alignerIndex: 'Noticeable unseat', dataObjectLabel: '2025-05-10', tooltip: 'Noticeable unseat: 2.2' },
  { alignerIndex: 'Slight unseat', dataObjectLabel: '2025-05-15', tooltip: 'Slight unseat: 1.3' },
  { alignerIndex: 'Noticeable unseat', dataObjectLabel: '2025-05-20', tooltip: 'Noticeable unseat: 2.3' },
];

const FullscreenImageModal = ({ isOpen, toggle, onCompare }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const thumbnailsRef = useRef(null);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        setSelectedImageIndex((idx) => Math.max(0, idx - 1));
      } else if (e.key === 'ArrowDown') {
        setSelectedImageIndex((idx) => Math.min(mockImages.length - 1, idx + 1));
      }
      // Date navigation (left/right) would be handled by VisTimeline or parent
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Scroll selected thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const selectedThumb = thumbnailsRef.current.children[selectedImageIndex];
      if (selectedThumb) {
        const containerHeight = thumbnailsRef.current.clientHeight;
        const thumbHeight = selectedThumb.offsetHeight;
        const thumbTop = selectedThumb.offsetTop;
        const scrollPosition = thumbTop - (containerHeight / 2) + (thumbHeight / 2);
        thumbnailsRef.current.scrollTo({
          top: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedImageIndex]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} fullscreen className="fullscreen-image-modal" backdrop="static" fade={false}>
      <div className="fim-root">
        {/* Timeline and Compare */}
        <div className="fim-timeline-row">
          <div className="fim-timeline">
            <VisTimeline timelinePoints={mockTimelinePoints} hygienePoints={[]} height={100} minimal={true} />
          </div>
          {/* <Button color="primary" className="fim-compare-btn" onClick={onCompare}>
            <i className="mdi mdi-compare"></i> Compare
          </Button> */}
        </div>
        {/* Main content */}
        <div className="fim-content-row">
          <div className="fim-image-center">
            <img
              src={mockImages[selectedImageIndex]}
              alt={`Intraoral ${selectedImageIndex + 1}`}
              className="fim-main-image"
            />
          </div>
          <div className="fim-thumbnails" ref={thumbnailsRef}>
            {mockImages.map((img, idx) => (
              <img
                key={`fim-thumb-${idx}`}
                src={img}
                alt={`Thumb ${idx + 1}`}
                className={`fim-thumb ${idx === selectedImageIndex ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(idx)}
              />
            ))}
          </div>
        </div>
        {/* Navigation instructions */}
        <div className="fim-nav-instructions">
          <span>Use <b>↑</b> or <b>↓</b> to navigate between photos</span>
        </div>
        {/* Close button */}
        <Button color="light" className="fim-close-btn" onClick={toggle}>
          <i className="mdi mdi-close"></i>
        </Button>
      </div>
    </Modal>
  );
};

export default FullscreenImageModal; 