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
}) => (
  <Row>
    <Col md={6}>
      <FormGroup className="mb-3">
        <Label for="first_name" className="fw-semibold text-uppercase" style={{ letterSpacing: "0.03em" }}>
          First Name
        </Label>
        <Input
          type="text"
          id="first_name"
          placeholder="Enter first name"
          value={formState.first_name}
          onChange={onChange}
          required
        />
      </FormGroup>
    </Col>
    <Col md={6}>
      <FormGroup className="mb-3">
        <Label for="last_name" className="fw-semibold text-uppercase" style={{ letterSpacing: "0.03em" }}>
          Last Name
        </Label>
        <Input
          type="text"
          id="last_name"
          placeholder="Enter last name"
          value={formState.last_name}
          onChange={onChange}
          required
        />
      </FormGroup>
    </Col>
    <Col md={6}>
      <FormGroup className="mb-3">
        <Label for="email">Email *</Label>
        <Input
          type="email"
          id="email"
          placeholder="Enter email address"
          value={formState.email}
          onChange={onChange}
          required
        />
      </FormGroup>
    </Col>
    <Col md={6}>
      <FormGroup className="mb-3">
        <Label for="mobile">Mobile Phone</Label>
        <Input
          type="tel"
          id="mobile"
          placeholder="Enter mobile number"
          value={formState.phone}
          onChange={onChange}
          required
        />
      </FormGroup>
    </Col>
    <Col md={4}>
      <FormGroup className="mb-3">
        <Label for="dob">Date of Birth</Label>
        <Input
          type="date"
          id="dob"
          value={formState.dob}
          onChange={onChange}
          max={new Date().toISOString().split('T')[0]}
          required
        />
      </FormGroup>
    </Col>
    <Col md={4}>
      <FormGroup className="mb-3">
        <Label for="doctor_id">Doctor</Label>
        <Input
          type="select"
          id="doctor_id"
          value={formState.doctor_id}
          onChange={onChange}
          required
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
        <Label for="gender">Gender</Label>
        <Input
          type="select"
          id="gender"
          value={formState.gender}
          onChange={onChange}
          required
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </Input>
      </FormGroup>
    </Col>
    <Col md={4}>
      <FormGroup className="mb-3">
        <Label for="country">Country</Label>
        <Select
          id="country"
          options={countries.map(c => ({ value: c, label: c }))}
          value={formState.country ? { value: formState.country, label: formState.country } : null}
          onChange={option => onChange({ target: { id: 'country', value: option ? option.value : '' } })}
          isClearable
          placeholder="Select country"
          isLoading={isLoadingCountries}
          loadingMessage={() => "Loading countries..."}
          required
        />
      </FormGroup>
    </Col>
    <Col md={4}>
      <FormGroup className="mb-3">
        <Label for="state">State</Label>
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
          required
        />
      </FormGroup>
    </Col>
    <Col md={4}>
      <FormGroup className="mb-3">
        <Label for="city">City</Label>
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
          required
        />
      </FormGroup>
    </Col>
    <Col md={6}>
      <FormGroup className="mb-3">
        <Label for="address">Address</Label>
        <Input
          type="text"
          id="address"
          value={formState.address}
          onChange={onChange}
          required
        />
      </FormGroup>
    </Col>
    <Col md={6}>
      <FormGroup className="mb-3">
        <Label for="address2">Address Line 2</Label>
        <Input
          type="text"
          id="address2"
          value={formState.address2}
          onChange={onChange}
          required
        />
      </FormGroup>
    </Col>
    <Col md={4}>
      <FormGroup className="mb-3">
        <Label for="zip_code">Zip Code</Label>
        <Input
          type="text"
          id="zip_code"
          value={formState.zip_code}
          onChange={onChange}
          required
        />
      </FormGroup>
    </Col>
    <Col md={4}>
      <FormGroup className="mb-3">
        <Label for="aligner_type">Aligner Type</Label>
        <Input
          type="select"
          id="aligner_type"
          value={formState.aligner_type}
          onChange={onChange}
          required
        >
          <option value="">Select aligner type</option>
          {alignerTypeOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Input>
      </FormGroup>
    </Col>
  </Row>
);

export default PatientForm; 