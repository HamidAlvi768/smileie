import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { getImpressions } from "../../../store/patients/actions";
import config from "../../../config";

const InitialTeeth = ({ patientId, patient }) => {
  const dispatch = useDispatch();
  const { impressions, impressionsLoading, impressionsError } = useSelector((state) => state.patients);
  
  const [allImages, setAllImages] = useState([]);
  const [fullscreenModalOpen, setFullscreenModalOpen] = useState(false);
  const [fullscreenImageIndex, setFullscreenImageIndex] = useState(0);
  const [fullscreenImages, setFullscreenImages] = useState([]);

  // Transform API data to match our component structure
  const transformImpressionsData = (apiData) => {
    if (!Array.isArray(apiData)) return [];
    
    return apiData.map((impression, index) => ({
      id: impression.id,
      type: impression.file_title || `Impression ${index + 1}`,
      date: impression.created_at ? impression.created_at.split(' ')[0] : '',
      status: impression.is_active ? "Active" : "Inactive",
      quality: "Good",
      notes: impression.file_title || "Impression scan",
      attachments: [],
      images: impression.file_path ? [impression.file_path] : []
    }));
  };

  useEffect(() => {
    if (patientId) {
      dispatch(getImpressions(patientId));
    }
  }, [patientId, dispatch]);

  // Transform impressions data and prepare images when impressions change
  useEffect(() => {
    console.log('Impressions data changed:', impressions);
    if (impressions && impressions.length > 0) {
      const transformedImpressions = transformImpressionsData(impressions);
      console.log('Transformed impressions:', transformedImpressions);
      
      // Prepare all images for the image viewer
      const allImagesArray = transformedImpressions.flatMap(impression =>
        impression.images.map((image, index) => ({
          src: image.startsWith('http') ? image : config.WEB_APP_URL + image,
          impressionId: impression.id,
          impressionType: impression.type,
          impressionDate: impression.date,
          imageIndex: index
        }))
      );
      console.log('All images array:', allImagesArray);
      
      // If no images from API, add test images
      if (allImagesArray.length === 0) {
        console.log('No images from API, adding test images');
        const testImages = [
          {
            src: 'https://via.placeholder.com/400x300/007bff/ffffff?text=Test+Impression+1',
            impressionId: 'test-1',
            impressionType: 'Test Impression 1',
            impressionDate: '2025-01-01',
            imageIndex: 0
          },
          {
            src: 'https://via.placeholder.com/400x300/28a745/ffffff?text=Test+Impression+2',
            impressionId: 'test-2',
            impressionType: 'Test Impression 2',
            impressionDate: '2025-01-02',
            imageIndex: 0
          }
        ];
        setAllImages(testImages);
      } else {
        setAllImages(allImagesArray);
      }
    } else {
      console.log('No impressions data, setting test images');
      // Add some test data for debugging
      const testImages = [
        {
          src: 'https://via.placeholder.com/400x300/007bff/ffffff?text=Test+Impression+1',
          impressionId: 'test-1',
          impressionType: 'Test Impression 1',
          impressionDate: '2025-01-01',
          imageIndex: 0
        },
        {
          src: 'https://via.placeholder.com/400x300/28a745/ffffff?text=Test+Impression+2',
          impressionId: 'test-2',
          impressionType: 'Test Impression 2',
          impressionDate: '2025-01-02',
          imageIndex: 0
        }
      ];
      setAllImages(testImages);
    }
  }, [impressions]);

  // Fullscreen modal handlers
  const openFullscreenModal = (imageIndex) => {
    console.log('Opening fullscreen modal with index:', imageIndex);
    if (allImages && allImages.length > 0) {
      setFullscreenImages([...allImages]);
      setFullscreenImageIndex(imageIndex);
      setFullscreenModalOpen(true);
    }
  };

  const closeFullscreenModal = () => {
    setFullscreenModalOpen(false);
    setFullscreenImages([]);
  };

  const goToNextFullscreenImage = () => {
    if (fullscreenImageIndex < fullscreenImages.length - 1) {
      setFullscreenImageIndex(fullscreenImageIndex + 1);
    }
  };

  const goToPreviousFullscreenImage = () => {
    if (fullscreenImageIndex > 0) {
      setFullscreenImageIndex(fullscreenImageIndex - 1);
    }
  };

  // Keyboard navigation for fullscreen modal
  useEffect(() => {
    if (!fullscreenModalOpen) return;
    
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPreviousFullscreenImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNextFullscreenImage();
          break;
        case 'Escape':
          event.preventDefault();
          closeFullscreenModal();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenModalOpen, fullscreenImageIndex, fullscreenImages.length]);

  if (impressionsLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading initial teeth images...</p>
      </div>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Initial Teeth</h4>
            <Button 
              color="primary" 
              size="sm"
              onClick={() => {
                if (allImages && allImages.length > 0) {
                  openFullscreenModal(0);
                } else {
                  alert('No images available for fullscreen view');
                }
              }}
            >
              <i className="mdi mdi-fullscreen me-1"></i>
              View All Fullscreen
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {(!impressions || impressions.length === 0) ? (
            <div className="text-center py-4">
              <i className="mdi mdi-tooth-outline text-muted" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3 text-muted">No initial teeth images found for this patient.</p>
            </div>
          ) : (
            <div>
              {allImages.length === 0 ? (
                <div className="text-center py-4">
                  <p>No images available to display</p>
                </div>
              ) : (
                <Row>
                  {allImages.map((imageData, index) => (
                    <Col key={`${imageData.impressionId}-${imageData.imageIndex}`} lg={3} md={4} sm={6} xs={12} className="mb-3">
                      <div className="impression-image-item">
                        <div
                          style={{
                            width: '100%',
                            height: '200px',
                            backgroundImage: `url(${imageData.src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            position: 'relative',
                            border: '2px solid #ddd',
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.02)';
                            e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = 'none';
                          }}
                          onClick={() => {
                            console.log('Image clicked:', index);
                            openFullscreenModal(index);
                          }}
                        >
                          {/* Image info overlay */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "0",
                              left: "0",
                              right: "0",
                              background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                              color: "white",
                              padding: "10px",
                              pointerEvents: "none",
                            }}
                          >
                            <small>{imageData.impressionDate}</small>
                          </div>

                          {/* Zoom indicator */}
                          <div
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              background: "rgba(0,0,0,0.7)",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              pointerEvents: "none",
                            }}
                          >
                            <i className="mdi mdi-magnify-plus"></i> Click to view
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Fullscreen Image Modal */}
      <Modal 
        isOpen={fullscreenModalOpen} 
        toggle={closeFullscreenModal} 
        size="xl" 
        centered
        className="fullscreen-image-modal"
        style={{ 
          maxWidth: '95vw', 
          maxHeight: '95vh',
          width: '90vw',
          height: '90vh'
        }}
      >
        <ModalHeader toggle={closeFullscreenModal} style={{ padding: '15px 20px' }}>
          <div className="d-flex align-items-center">
            <span>Initial Teeth - Fullscreen Viewer</span>
            {fullscreenImages.length > 0 && (
              <span className="ms-2 text-muted">
                ({fullscreenImageIndex + 1} of {fullscreenImages.length})
              </span>
            )}
          </div>
        </ModalHeader>
        <ModalBody className="p-0" style={{ 
          background: '#000', 
          height: 'calc(90vh - 120px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {fullscreenImages[fullscreenImageIndex] && (
            <div className="position-relative" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={fullscreenImages[fullscreenImageIndex].src}
                alt={`Fullscreen impression ${fullscreenImageIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              
              {/* Navigation Buttons */}
              <Button
                color="light"
                className="position-absolute"
                style={{
                  top: '50%',
                  left: '20px',
                  transform: 'translateY(-50%)',
                  zIndex: 1000,
                  opacity: 0.8,
                  transition: 'all 0.2s ease-in-out',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={goToPreviousFullscreenImage}
                disabled={fullscreenImageIndex === 0}
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.8';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <i className="mdi mdi-chevron-left"></i>
              </Button>
              
              <Button
                color="light"
                className="position-absolute"
                style={{
                  top: '50%',
                  right: '20px',
                  transform: 'translateY(-50%)',
                  zIndex: 1000,
                  opacity: 0.8,
                  transition: 'all 0.2s ease-in-out',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={goToNextFullscreenImage}
                disabled={fullscreenImageIndex === fullscreenImages.length - 1}
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '0.8';
                  e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <i className="mdi mdi-chevron-right"></i>
              </Button>

              {/* Image Info Overlay */}
              <div className="position-absolute" style={{
                bottom: '20px',
                left: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1" style={{ fontWeight: '600' }}>
                      {fullscreenImages[fullscreenImageIndex].impressionType}
                    </h6>
                    <small style={{ opacity: 0.9 }}>
                      {fullscreenImages[fullscreenImageIndex].impressionDate}
                    </small>
                  </div>
                  <div className="text-end">
                    <small style={{ opacity: 0.8 }}>
                      Image {fullscreenImageIndex + 1} of {fullscreenImages.length}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter style={{ padding: '15px 20px' }}>
          <div className="d-flex justify-content-between align-items-center w-100">
            <small className="text-muted" style={{ fontSize: '13px' }}>
              <i className="mdi mdi-keyboard me-1"></i>
              Use arrow keys or click buttons to navigate • Press ESC to close
            </small>
            <div className="d-flex gap-2">
              <Button 
                color="info" 
                size="sm"
                style={{
                  border: '1px solid #17a2b8',
                  backgroundColor: '#17a2b8',
                  color: '#fff',
                  fontWeight: '500',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => {
                  if (fullscreenImages[fullscreenImageIndex]) {
                    const link = document.createElement("a");
                    link.href = fullscreenImages[fullscreenImageIndex].src;
                    link.download = `initial-teeth-${fullscreenImageIndex + 1}-${fullscreenImages[fullscreenImageIndex].impressionDate}.jpg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#138496';
                  e.target.style.borderColor = '#138496';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#17a2b8';
                  e.target.style.borderColor = '#17a2b8';
                }}
              >
                <i className="mdi mdi-download me-1"></i>
                Download
              </Button>
              <Button 
                color="secondary" 
                size="sm"
                style={{
                  border: '1px solid #6c757d',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  fontWeight: '500',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={closeFullscreenModal}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#5a6268';
                  e.target.style.borderColor = '#5a6268';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.borderColor = '#6c757d';
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default InitialTeeth; 