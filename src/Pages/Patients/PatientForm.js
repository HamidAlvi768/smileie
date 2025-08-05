import React from 'react';
import { Row, Col, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';

const alignerTypeOptions = [
  'Day time dual arch',
  'Night time dual arch',
  'Day time upper arch',
  'Day time lower arch',
  'Night time upper arch',
  'Night time lower arch',
];

const PatientForm = ({
  formState,
  onChange,
  doctors = [],
  countries = [],
  states = [],
  cities = [],
  isLoadingCountries = false,
  isLoadingStates = false,
  isLoadingCities = false,
  errors = {}, // Keep for parent component to use
}) => {
  // Helper function to render required field labels with red asterisk
  const renderRequiredLabel = (text, fieldName) => (
    <Label for={fieldName} className="form-label fw-semibold">
      {text} <span style={{ color: 'red' }}>*</span>
    </Label>
  );

  // Helper function to render optional field labels
  const renderOptionalLabel = (text, fieldName) => (
    <Label for={fieldName} className="form-label fw-semibold">
      {text}
    </Label>
  );

  return (
  <div className="patient-form-container">
    {/* Personal Information Section */}
    <div className="form-section mb-1">
      <h6 className="section-title mb-3 text-primary fw-bold">
        <i className="mdi mdi-account-outline me-2"></i>
        Personal Information
      </h6>
      <Row>
        <Col md={3}>
          <FormGroup className="mb-3">
            {renderOptionalLabel("Coupon Code", "coupon_code")}
            <Input
              type="text"
              id="coupon_code"
              placeholder="Enter coupon code"
              value={formState.coupon_code || ''}
              onChange={onChange}
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("First Name", "first_name")}
            <Input
              type="text"
              id="first_name"
              placeholder="Enter first name"
              value={formState.first_name}
              onChange={onChange}
              required
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Last Name", "last_name")}
            <Input
              type="text"
              id="last_name"
              placeholder="Enter last name"
              value={formState.last_name}
              onChange={onChange}
              required
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
        <Col md={3}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Date of Birth", "dob")}
            <Input
              type="date"
              id="dob"
              value={formState.dob}
              onChange={onChange}
              max={new Date().toISOString().split('T')[0]}
              required
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
      </Row>
    </div>

    {/* Contact Information Section */}
    <div className="form-section mb-1">
      <h6 className="section-title mb-3 text-primary fw-bold">
        <i className="mdi mdi-phone-outline me-2"></i>
        Contact Information
      </h6>
      <Row>
        <Col md={4}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Email Address", "email")}
            <Input
              type="email"
              id="email"
              placeholder="Enter email address"
              value={formState.email}
              onChange={onChange}
              required
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Mobile Phone", "mobile")}
            <Input
              type="tel"
              id="mobile"
              placeholder="Enter mobile number"
              value={formState.phone}
              onChange={onChange}
              required
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Gender", "gender")}
            <Input
              type="select"
              id="gender"
              value={formState.gender}
              onChange={onChange}
              required
              className="form-control-sm"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Input>
          </FormGroup>
        </Col>
      </Row>
    </div>

    {/* Medical Information Section */}
    <div className="form-section mb-1">
      <h6 className="section-title mb-3 text-primary fw-bold">
        <i className="mdi mdi-stethoscope me-2"></i>
        Medical Information
      </h6>
      <Row>
        <Col md={4}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Assigned Doctor", "doctor_id")}
            <Input
              type="select"
              id="doctor_id"
              value={formState.doctor_id}
              onChange={onChange}
              required
              className="form-control-sm"
            >
              <option value="">Select doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.full_name}</option>
              ))}
            </Input>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Patient Source", "patient_source")}
            <Input
              type="select"
              id="patient_source"
              value={formState.patient_source}
              onChange={onChange}
              required
              className="form-control-sm"
            >
              <option value="">Select source</option>
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
              <option value="Direct">Direct</option>
            </Input>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Aligner Type", "aligner_type")}
            <Input
              type="select"
              id="aligner_type"
              value={formState.aligner_type}
              onChange={onChange}
              required
              className="form-control-sm"
            >
              <option value="">Select aligner type</option>
              {alignerTypeOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>
    </div>

    {/* Address Information Section */}
    <div className="form-section mb-1">
      <h6 className="section-title mb-3 text-primary fw-bold">
        <i className="mdi mdi-map-marker-outline me-2"></i>
        Address Information
      </h6>
      <Row>
        <Col md={4}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Country", "country")}
            <Select
              id="country"
              options={countries.map(c => ({ value: c, label: c }))}
              value={formState.country ? { value: formState.country, label: formState.country } : null}
              onChange={option => onChange({ target: { id: 'country', value: option ? option.value : '' } })}
              isClearable
              placeholder="Select country"
              isLoading={isLoadingCountries}
              loadingMessage={() => "Loading countries..."}
              className="form-control-sm"
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '31px',
                  fontSize: '14px'
                }),
                option: (provided) => ({
                  ...provided,
                  fontSize: '14px'
                })
              }}
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("State", "state")}
            <Select
              id="state"
              options={states.map(s => ({ value: s, label: s }))}
              value={formState.state ? { value: formState.state, label: formState.state } : null}
              onChange={option => onChange({ target: { id: 'state', value: option ? option.value : '' } })}
              isClearable
              placeholder="Select state"
              isDisabled={!formState.country}
              isLoading={isLoadingStates}
              loadingMessage={() => "Loading states..."}
              className="form-control-sm"
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '31px',
                  fontSize: '14px'
                }),
                option: (provided) => ({
                  ...provided,
                  fontSize: '14px'
                })
              }}
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("City", "city")}
            <Select
              id="city"
              options={cities.map(c => ({ value: c, label: c }))}
              value={formState.city ? { value: formState.city, label: formState.city } : null}
              onChange={option => onChange({ target: { id: 'city', value: option ? option.value : '' } })}
              isClearable
              placeholder="Select city"
              isDisabled={!formState.state}
              isLoading={isLoadingCities}
              loadingMessage={() => "Loading cities..."}
              className="form-control-sm"
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '31px',
                  fontSize: '14px'
                }),
                option: (provided) => ({
                  ...provided,
                  fontSize: '14px'
                })
              }}
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Address Line 1", "address")}
            <Input
              type="text"
              id="address"
              placeholder="Enter street address"
              value={formState.address}
              onChange={onChange}
              required
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
        <Col md={6}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Address Line 2", "address2")}
            <Input
              type="text"
              id="address2"
              placeholder="Enter apartment, suite, etc."
              value={formState.address2}
              onChange={onChange}
              required
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <FormGroup className="mb-3">
            {renderRequiredLabel("Zip/Postal Code", "zip_code")}
            <Input
              type="text"
              id="zip_code"
              placeholder="Enter zip code"
              value={formState.zip_code}
              onChange={onChange}
              required
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
      </Row>
    </div>
  </div>
  );
};

export default PatientForm; 