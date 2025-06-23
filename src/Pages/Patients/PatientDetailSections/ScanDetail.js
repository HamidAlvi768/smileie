import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Button, Modal, ModalBody } from 'reactstrap';

// Use the provided image for all thumbnails
const intraoralImg = require('../../../assets/images/intraoral_1.jpg');
const intraoralImg2 = require('../../../assets/images/intraoral_2.jpg');
const lowerJawImg = require('../../../assets/images/lower-jaw.jpg');
const lowerJawImg2 = require('../../../assets/images/lower-jaw2.jpg');
const upperJawImg = require('../../../assets/images/upper-jaw.jpg');
const upperJawImg2 = require('../../../assets/images/upper-jaw2.jpg');
const rightJawImg = require('../../../assets/images/right-view.jpg');
const rightJawImg2 = require('../../../assets/images/right-view2.jpg');
const leftJawImg = require('../../../assets/images/left-view.jpg');
const leftJawImg2 = require('../../../assets/images/left-view2.jpg');
const frontViewImg2 = require('../../../assets/images/front-view2.jpg');

const mockScan = {
  timestamp: '2025-05-27 12:14 GMT+5',
  sections: [
    {
      name: 'Front View',
      subsections: [
        {
          name: 'With Aligner',
          images: [intraoralImg, intraoralImg2],
        },
        {
          name: 'Without Aligner',
          images: [intraoralImg2, frontViewImg2],
        },
      ],
    },
    {
      name: 'Left View',
      subsections: [
        {
          name: 'With Aligner',
          images: [leftJawImg, rightJawImg],
        },
        {
          name: 'Without Aligner',
          images: [leftJawImg2, rightJawImg2],
        },
      ],
    },
    {
      name: 'Right View',
      subsections: [
        {
          name: 'With Aligner',
          images: [rightJawImg, leftJawImg],
        },
        {
          name: 'Without Aligner',
          images: [rightJawImg2, leftJawImg2],
        },
      ],
    },
    {
      name: 'Upper Jaw',
      subsections: [
        {
          name: 'With Aligner',
          images: [upperJawImg, lowerJawImg],
        },
        {
          name: 'Without Aligner',
          images: [upperJawImg2, lowerJawImg2],
        },
      ],
    },
    {
      name: 'Lower Jaw',
      subsections: [
        {
          name: 'With Aligner',
          images: [lowerJawImg, upperJawImg],
        },
        {
          name: 'Without Aligner',
          images: [lowerJawImg2, upperJawImg2],
        },
      ],
    },
  ],
};

const ScanDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImages, setAllImages] = useState([]); // All images from all sections (for filtering)
  const [currentSectionImages, setCurrentSectionImages] = useState([]); // Images for the current section in modal
  const [currentSectionName, setCurrentSectionName] = useState('');

  // Flatten all images from all sections into a single array for easier filtering later
  useEffect(() => {
    const images = [];
    mockScan.sections.forEach(section => {
      section.subsections.forEach(subsection => {
        subsection.images.forEach((img, index) => {
          images.push({
            src: img,
            alt: `${section.name} - ${subsection.name} ${index + 1}`,
            section: section.name,
            subsection: subsection.name
          });
        });
      });
    });
    setAllImages(images);
  }, []);

  const openModal = (sectionName, subsectionName, imageIndexInThatSubsection) => {
    const imagesForSubsection = allImages.filter(img => img.section === sectionName && img.subsection === subsectionName);
    setCurrentSectionImages(imagesForSubsection);
    setCurrentImageIndex(imageIndexInThatSubsection);
    setCurrentSectionName(`${sectionName} - ${subsectionName}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Reset section specific images when modal closes
    setCurrentSectionImages([]);
    setCurrentImageIndex(0);
    setCurrentSectionName('');
  };

  const navigateImage = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === currentSectionImages.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? currentSectionImages.length - 1 : prev - 1
      );
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isModalOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigateImage('prev');
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateImage('next');
          break;
        case 'Escape':
          event.preventDefault();
          closeModal();
          break;
        default:
          break;
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className="scan-detail-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">Scan taken on {mockScan.timestamp}</h5>
          <a href="#" className="small me-3" onClick={() => navigate(-1)}>
            <i className="mdi mdi-arrow-left"></i> Back to the list
          </a>
        </div>
        <a href="#" className="small text-primary fw-bold">
          <i className="mdi mdi-download me-1"></i>Download all photos
        </a>
      </div>
      
      <Card>
        <CardBody>
          {mockScan.sections.map((section) => (
            <div key={section.name} className="mb-4">
              <div className="section-header mb-2">
                <h6 className="mb-0 fw-semibold">{section.name}</h6>
              </div>
              {section.subsections.map((subsection, subIdx) => (
                <div key={subsection.name} className="mb-2 ms-3">
                  <div 
                    className="mb-1"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#3b4453',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {subsection.name}
                  </div>
                  <div className="p-3 border rounded bg-light-subtle">
                    <div className="d-flex flex-wrap gap-3">
                      {subsection.images.map((img, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={img}
                          alt={`${section.name} - ${subsection.name} ${imgIdx + 1}`}
                          className="scan-thumbnail"
                          style={{ 
                            width: 120, 
                            height: 90, 
                            objectFit: 'cover', 
                            borderRadius: 6, 
                            border: '1px solid #eee',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                          onClick={() => openModal(section.name, subsection.name, imgIdx)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Full-screen Image Modal */}
      <Modal 
        isOpen={isModalOpen} 
        toggle={closeModal}
        fullscreen={true} // Make the modal full screen
        className="image-viewer-modal"
        contentClassName="bg-transparent border-0" // Make modal content transparent and borderless
      >
        <ModalBody 
          className="bg-transparent p-0 d-flex align-items-center justify-content-center position-relative"
          style={{ backgroundColor: '#212529' }}
          onClick={closeModal} // Close modal on any click inside ModalBody
        >
          {currentSectionImages[currentImageIndex] && (
            <div className="position-relative d-flex align-items-center justify-content-center h-100" style={{ width: '100%', height: '100%' }}>
              {/* Previous Button */}
              {currentSectionImages.length > 1 && (
                <button
                  type="button"
                  className="btn btn-lg btn-icon position-absolute top-50 start-0 translate-middle-y"
                  style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', zIndex: 10 }}
                  onClick={e => { e.stopPropagation(); navigateImage('prev'); }}
                  aria-label="Previous"
                >
                  <i className="ri-arrow-left-s-line" style={{ fontSize: '2rem' }}></i>
                </button>
              )}
              <img
                src={currentSectionImages[currentImageIndex].src}
                alt={currentSectionImages[currentImageIndex].alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100vh',
                  objectFit: 'contain'
                }}
              />
              {/* Next Button */}
              {currentSectionImages.length > 1 && (
                <button
                  type="button"
                  className="btn btn-lg btn-icon position-absolute top-50 end-0 translate-middle-y"
                  style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', zIndex: 10 }}
                  onClick={e => { e.stopPropagation(); navigateImage('next'); }}
                  aria-label="Next"
                >
                  <i className="ri-arrow-right-s-line" style={{ fontSize: '2rem' }}></i>
                </button>
              )}
              {/* Image counter overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                }}
              >
                {currentImageIndex + 1}/{currentSectionImages.length}
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ScanDetail; 