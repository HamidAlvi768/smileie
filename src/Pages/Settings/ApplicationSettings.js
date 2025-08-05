import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import logoSm from '../../assets/images/logo-sm-1.png';
import favicon from '../../assets/images/favicon.png';

// Enhanced components
import { withPageTransition } from "../../components/Common/PageTransition";
import ShimmerLoader from "../../components/Common/ShimmerLoader";
import EnhancedLayout, { EnhancedCard } from "../../components/Common/EnhancedLayout";

const ApplicationSettings = () => {
  const [formData, setFormData] = useState({
    websiteName: "Smileie",
    registrationNumber: "REG123456789",
    contactEmail: "contact@smileie.com",
    contactPhone: "+1 (555) 123-4567",
    whatsappNumber: "+1 (555) 123-4567",
    address: "123 Dental Street",
    city: "Los Angeles",
    state: "California",
    postalCode: "90210",
    country: "United States",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  // Simulate loading state for demo
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'logo') {
      setLogoFile(file);
    } else if (type === 'favicon') {
      setFaviconFile(file);
    }
  };

  const handleImageClick = (type) => {
    if (type === 'logo') {
      logoInputRef.current.click();
    } else if (type === 'favicon') {
      faviconInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    console.log('Form Data:', formData);
    console.log('Logo File:', logoFile);
    console.log('Favicon File:', faviconFile);
      
      setSaveStatus({ type: 'success', message: 'Settings saved successfully!' });
    } catch (error) {
      setSaveStatus({ type: 'danger', message: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  document.title = "Application Settings | Smileie";

  return (
    <EnhancedLayout title="Application Settings" subtitle="Configure your application preferences">
        <Container fluid={true}>
        <Row className="mb-3 align-items-center">
          <Col md={8} xs={6}>
            <h4 className="mb-0">Application Settings</h4>
            <p className="text-muted mb-0">Configure your application preferences and branding</p>
          </Col>
          <Col md={4} xs={6} className="text-end">
            <div className="d-flex align-items-center justify-content-end">
              <div className="me-2">
                <small className="text-muted">Last updated</small>
                <div className="fw-bold">Just now</div>
              </div>
            </div>
          </Col>
        </Row>

        {saveStatus && (
          <Alert color={saveStatus.type} className="mb-3">
            <i className={`fas fa-${saveStatus.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
            {saveStatus.message}
          </Alert>
        )}

        <EnhancedCard 
          title="General Settings"
          subtitle="Basic application configuration"
          loading={isLoading}
        >
                  <Form onSubmit={handleSubmit}>
                    <Row>
              <Col md={6}>
                        <FormGroup>
                  <Label for="websiteName" className="form-label">Website Name</Label>
                          <Input
                            id="websiteName"
                            name="websiteName"
                            type="text"
                            value={formData.websiteName}
                            onChange={handleInputChange}
                            required
                    className="form-control"
                          />
                        </FormGroup>
                      </Col>
                    
              <Col md={6}>
                        <FormGroup>
                  <Label for="contactEmail" className="form-label">Contact Email</Label>
                          <Input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            required
                    className="form-control"
                          />
                        </FormGroup>
                      </Col>
            </Row>

            <Row>
              <Col md={6}>
                        <FormGroup>
                  <Label for="contactPhone" className="form-label">Contact Phone</Label>
                          <Input
                            id="contactPhone"
                            name="contactPhone"
                            type="tel"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                    className="form-control"
                          />
                        </FormGroup>
                      </Col>
            
              <Col md={6}>
                        <FormGroup>
                  <Label for="whatsappNumber" className="form-label">WhatsApp Number</Label>
                          <Input
                            id="whatsappNumber"
                            name="whatsappNumber"
                            type="tel"
                            value={formData.whatsappNumber}
                            onChange={handleInputChange}
                    className="form-control"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="registrationNumber" className="form-label">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className="form-control"
                          />
                        </FormGroup>
                      </Col>
            </Row>

            <hr className="my-4" />

            <h5 className="mb-3">Address Information</h5>
            <Row>
              <Col md={12}>
                        <FormGroup>
                  <Label for="address" className="form-label">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                    className="form-control"
                          />
                        </FormGroup>
                      </Col>
            </Row>

            <Row>
              <Col md={4}>
                        <FormGroup>
                  <Label for="city" className="form-label">City</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleInputChange}
                    className="form-control"
                          />
                        </FormGroup>
                      </Col>
            
              <Col md={4}>
                        <FormGroup>
                  <Label for="state" className="form-label">State</Label>
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            value={formData.state}
                            onChange={handleInputChange}
                    className="form-control"
                  />
                </FormGroup>
              </Col>
            
              <Col md={4}>
                <FormGroup>
                  <Label for="postalCode" className="form-label">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="form-control"
                          />
                        </FormGroup>
                      </Col>
            </Row>

            <Row>
              <Col md={6}>
                        <FormGroup>
                  <Label for="country" className="form-label">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            type="text"
                            value={formData.country}
                            onChange={handleInputChange}
                    className="form-control"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

            <hr className="my-4" />

            <h5 className="mb-3">Branding</h5>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                  <Label className="form-label">Logo</Label>
                  <div className="d-flex align-items-center">
                          <div 
                      className="me-3 cursor-pointer"
                            onClick={() => handleImageClick('logo')}
                            style={{ cursor: 'pointer' }}
                          >
                      <img 
                        src={logoFile ? URL.createObjectURL(logoFile) : logoSm} 
                        alt="Logo" 
                        className="img-fluid" 
                        style={{ maxWidth: '100px', maxHeight: '60px' }}
                      />
                            </div>
                            <div>
                      <Button 
                        type="button" 
                        color="outline-primary" 
                        size="sm"
                        onClick={() => handleImageClick('logo')}
                      >
                        <i className="fas fa-upload me-1"></i>Upload Logo
                      </Button>
                      <input
                        ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'logo')}
                        style={{ display: 'none' }}
                              />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
            
                      <Col md={6}>
                        <FormGroup>
                  <Label className="form-label">Favicon</Label>
                  <div className="d-flex align-items-center">
                          <div 
                      className="me-3 cursor-pointer"
                            onClick={() => handleImageClick('favicon')}
                            style={{ cursor: 'pointer' }}
                          >
                      <img 
                        src={faviconFile ? URL.createObjectURL(faviconFile) : favicon} 
                        alt="Favicon" 
                        className="img-fluid" 
                        style={{ maxWidth: '32px', maxHeight: '32px' }}
                      />
                            </div>
                            <div>
                      <Button 
                        type="button" 
                        color="outline-primary" 
                        size="sm"
                        onClick={() => handleImageClick('favicon')}
                      >
                        <i className="fas fa-upload me-1"></i>Upload Favicon
                      </Button>
                      <input
                        ref={faviconInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'favicon')}
                        style={{ display: 'none' }}
                              />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button 
                type="submit" 
                color="primary" 
                disabled={isSaving}
                className="px-4"
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                        Save Settings
                  </>
                )}
                      </Button>
                    </div>
                  </Form>
        </EnhancedCard>
        </Container>
    </EnhancedLayout>
  );
};

// Export with page transition
export default withPageTransition(ApplicationSettings); 