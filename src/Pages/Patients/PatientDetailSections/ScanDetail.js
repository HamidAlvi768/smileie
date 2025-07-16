import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardBody, Button, Modal, ModalBody } from 'reactstrap';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useDispatch, useSelector } from 'react-redux';
import { WEB_APP_URL } from '../../../config';

// Use the provided image for all thumbnails (fallbacks)
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

const fallbackImages = {
  front: [intraoralImg, intraoralImg2, frontViewImg2],
  left: [leftJawImg, leftJawImg2],
  right: [rightJawImg, rightJawImg2],
  upper: [upperJawImg, upperJawImg2],
  lower: [lowerJawImg, lowerJawImg2],
};

const ScanDetail = () => {
  const navigate = useNavigate();
  const { id, arch, scanId } = useParams();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSectionImages, setCurrentSectionImages] = useState([]);
  const [currentSectionName, setCurrentSectionName] = useState('');

  // Get scan detail from Redux
  const { scanDetail, scanDetailLoading, scanDetailError } = useSelector(state => state.patients);

  // Debug: Log params and redux state
  console.log('ScanDetail params:', { id, scanId, arch });
  console.log('Redux scanDetail:', scanDetail);
  console.log('Redux scanDetailLoading:', scanDetailLoading);
  console.log('Redux scanDetailError:', scanDetailError);

  // Always call hooks at the top
  useEffect(() => {
    if (id && scanId) {
      console.log('Dispatching GET_SCAN_DETAIL with:', { id, scanId });
      dispatch({ type: 'GET_SCAN_DETAIL', payload: { id, step_number: scanId } });
    }
  }, [dispatch, id, scanId]);

  // Map API data to sections/subsections/images
  const dynamicScan = useMemo(() => {
    if (!Array.isArray(scanDetail) || scanDetail.length === 0) return null;
    // Group scans by view_type (front, left, right, upper, lower, etc.)
    const sectionsMap = {};
    scanDetail.forEach(scan => {
      const view = scan.view_type || 'front';
      if (!sectionsMap[view]) {
        sectionsMap[view] = { name: `${view.charAt(0).toUpperCase() + view.slice(1)} View`, subsections: [] };
      }
      // Use scan_type from API, not scan_url
      const alignerType = scan.scan_type === 'without_aligner' ? 'Without Aligner' : 'With Aligner';
      let subsection = sectionsMap[view].subsections.find(s => s.name === alignerType);
      if (!subsection) {
        subsection = { name: alignerType, images: [] };
        sectionsMap[view].subsections.push(subsection);
      }
      subsection.images.push(scan.scan_url);
    });
    // Only keep subsections that have real images (not fallback) if there is any real data for that view
    Object.keys(sectionsMap).forEach(view => {
      const section = sectionsMap[view];
      // If this view exists in API data, filter out fallback-only subsections (not needed anymore, but keep for safety)
      const hasRealData = scanDetail.some(scan => scan.view_type === view);
      if (hasRealData) {
        section.subsections = section.subsections.filter(subsection =>
          subsection.images.some(img => typeof img === 'string' && img.startsWith('/uploads'))
        );
      }
    });
    // Convert to array
    let sectionsArr = Object.values(sectionsMap);
    // Filter: Only show 'top' view for upper arch, and 'bottom' view for lower arch
    sectionsArr = sectionsArr.filter(section => {
      if (section.name.toLowerCase().includes('top')) {
        return arch === 'upper';
      }
      if (section.name.toLowerCase().includes('bottom')) {
        return arch === 'lower';
      }
      return true;
    });
    return {
      timestamp: scanDetail[0]?.created_at || '',
      sections: sectionsArr
    };
  }, [scanDetail, arch]);

  // Debug: Log dynamicScan result
  console.log('dynamicScan:', dynamicScan);

  // Flatten all images from all sections into a single array for easier filtering later
  const allImages = useMemo(() => {
    if (!dynamicScan) return [];
    const images = [];
    dynamicScan.sections.forEach(section => {
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
    return images;
  }, [dynamicScan]);

  // Modal and navigation logic (unchanged)
  const openModal = (sectionName, subsectionName, imageIndexInThatSubsection) => {
    const imagesForSubsection = allImages.filter(img => img.section === sectionName && img.subsection === subsectionName);
    setCurrentSectionImages(imagesForSubsection);
    setCurrentImageIndex(imageIndexInThatSubsection);
    setCurrentSectionName(`${sectionName} - ${subsectionName}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Download all photos logic (unchanged)
  const handleDownloadAllPhotos = async (e) => {
    e.preventDefault();
    if (!allImages.length) return;
    const zip = new JSZip();
    const folder = zip.folder('photos');
    await Promise.all(
      allImages.map(async (img, idx) => {
        try {
          const url = typeof img.src === 'string' ? img.src : img.src.default || img.src;
          const response = await fetch(url);
          const blob = await response.blob();
          const ext = url.split('.').pop().split('?')[0];
          const name = `${img.section.replace(/\s+/g, '_')}_${img.subsection.replace(/\s+/g, '_')}_${idx + 1}.${ext}`;
          folder.file(name, blob);
        } catch (err) {
          // Skip failed images
        }
      })
    );
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'photos.zip');
  };

  // Helper to format timestamp without seconds
  function formatTimestamp(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    // Format: YYYY-MM-DD HH:mm
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  }

  // Loading and error/empty state logic (after all hooks)
  if (scanDetailLoading) {
    return (
      <div className="scan-detail-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1">Loading scan data...</h5>
            <a href="#" className="small me-3" onClick={() => navigate(-1)}>
              <i className="mdi mdi-arrow-left"></i> Back to the list
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (scanDetailError) {
    return (
      <div className="scan-detail-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1 text-danger">Error loading scan data</h5>
            <div className="text-danger small">{scanDetailError.toString()}</div>
            <a href="#" className="small me-3" onClick={() => navigate(-1)}>
              <i className="mdi mdi-arrow-left"></i> Back to the list
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!dynamicScan) {
    return (
      <div className="scan-detail-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1">No scan data available</h5>
            <a href="#" className="small me-3" onClick={() => navigate(-1)}>
              <i className="mdi mdi-arrow-left"></i> Back to the list
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scan-detail-section">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-1">Scan taken on {formatTimestamp(dynamicScan.timestamp)}</h5>
          <a href="#" className="small me-3" onClick={() => navigate(-1)}>
            <i className="mdi mdi-arrow-left"></i> Back to the list
          </a>
        </div>
        <a href="#" className="small text-primary fw-bold" onClick={handleDownloadAllPhotos}>
          <i className="mdi mdi-download me-1"></i>Download all photos
        </a>
      </div>
      <Card>
        <CardBody>
          {dynamicScan.sections.map((section) => (
            <div key={section.name} className="mb-4 border bg-light-subtle p-3 rounded">
              <div className="section-header mb-2">
                <h6 className="mb-0 fw-semibold">
                  {section.name}
                  {arch && (
                    <span style={{ color: '#d9534f', marginLeft: 8 }}>
                      ({arch === 'upper' ? 'Upper Arch' : arch === 'lower' ? 'Lower Arch' : arch})
                    </span>
                  )}
                </h6>
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
                  <div className="p-3 border rounded bg-light-subtle-darker">
                    <div className="d-flex flex-wrap gap-3">
                      {subsection.images.map((img, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={typeof img === 'string' && img.startsWith('/uploads') ? `${WEB_APP_URL}${img}` : img}
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
                src={
                  typeof currentSectionImages[currentImageIndex].src === 'string' && currentSectionImages[currentImageIndex].src.startsWith('/uploads')
                    ? `${WEB_APP_URL}${currentSectionImages[currentImageIndex].src}`
                    : currentSectionImages[currentImageIndex].src
                }
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