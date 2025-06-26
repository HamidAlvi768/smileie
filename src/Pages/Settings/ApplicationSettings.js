import React, { useState, useRef } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import logoSm from '../../assets/images/logo-sm-1.png';
import favicon from '../../assets/images/favicon.png';

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

  const logoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form Data:', formData);
    console.log('Logo File:', logoFile);
    console.log('Favicon File:', faviconFile);
    // You can add API call here to save the settings
  };

  document.title = "Application Settings | Smileie";

  return (
    <React.Fragment>
      <div className="page-content no-navbar">
        <Container fluid={true}>
          <Breadcrumbs 
            title="Smileie" 
            breadcrumbItem="Settings" 
            breadcrumbItem2="Application Settings"
          />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Application Settings</h4>
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="websiteName">Website Name</Label>
                          <Input
                            id="websiteName"
                            name="websiteName"
                            type="text"
                            value={formData.websiteName}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    
                      <Col md={3}>
                        <FormGroup>
                          <Label for="contactEmail">Contact Email</Label>
                          <Input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="contactPhone">Contact Phone</Label>
                          <Input
                            id="contactPhone"
                            name="contactPhone"
                            type="tel"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="whatsappNumber">WhatsApp Number</Label>
                          <Input
                            id="whatsappNumber"
                            name="whatsappNumber"
                            type="tel"
                            value={formData.whatsappNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            type="text"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="country">Country</Label>
                          <Input
                            id="country"
                            name="country"
                            type="text"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="logo">Logo</Label>
                          <div 
                            className="d-flex align-items-center cursor-pointer" 
                            onClick={() => handleImageClick('logo')}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="me-3">
                              {logoFile ? (
                                <img 
                                  src={URL.createObjectURL(logoFile)} 
                                  alt="Logo Preview" 
                                  className="rounded-circle avatar-lg" 
                                  style={{ width: '80px', height: '80px', objectFit: 'none' }}
                                />
                              ) : (
                                <img
                                  src={logoSm}
                                  alt="Default Logo"
                                  className="rounded-circle avatar-lg"
                                  style={{ width: '80px', height: '80px', objectFit: 'none' }}
                                />
                              )}
                            </div>
                            <div>
                              <Input
                                id="logo"
                                name="logo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'logo')}
                                className="d-none" // Hide the actual input
                                innerRef={logoInputRef}
                              />
                              <label htmlFor="logo" className="btn btn-light-primary waves-effect waves-light">
                                <i className="ri-upload-cloud-line align-middle me-1"></i> Upload Logo
                              </label>
                            </div>
                          </div>
                          <small className="text-muted d-block mt-2">
                            Recommended size: 200x60px, Max size: 2MB
                          </small>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="favicon">Favicon</Label>
                          <div 
                            className="d-flex align-items-center cursor-pointer" 
                            onClick={() => handleImageClick('favicon')}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="me-3">
                              {faviconFile ? (
                                <img 
                                  src={URL.createObjectURL(faviconFile)} 
                                  alt="Favicon Preview" 
                                  className="rounded-circle avatar-lg" 
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                              ) : (
                                <img
                                  src={favicon}
                                  alt="Default Favicon"
                                  className="rounded-circle avatar-lg"
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                              )}
                            </div>
                            <div>
                              <Input
                                id="favicon"
                                name="favicon"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'favicon')}
                                className="d-none" // Hide the actual input
                                innerRef={faviconInputRef}
                              />
                              <label htmlFor="favicon" className="btn btn-light-primary waves-effect waves-light">
                                <i className="ri-upload-cloud-line align-middle me-1"></i> Upload Favicon
                              </label>
                            </div>
                          </div>
                          <small className="text-muted d-block mt-2">
                            Recommended size: 32x32px, Max size: 1MB
                          </small>
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="text-end">
                      <Button type="submit" color="primary">
                        <i className="ri-save-line me-1"></i>
                        Save Settings
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ApplicationSettings; 