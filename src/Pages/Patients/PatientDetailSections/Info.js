import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updatePatientDetail } from '../../../store/patients/actions';
import { useToast } from '../../../components/Common/ToastContext';
import Select from 'react-select';

const Info = ({ patient }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  // Get patient detail from Redux (already fetched in PatientDetail.js)
  const patientDetail = useSelector(state => state.patients.patientDetail) || {};
  const updatingDetail = useSelector(state => state.patients.updatingDetail);
  const updateDetailError = useSelector(state => state.patients.updateDetailError);
  const showToast = useToast();

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);

  // Add country/state/city options and loading states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Track previous country and state to only reset when they actually change
  const prevCountry = React.useRef();
  const prevState = React.useRef();

  // Fetch countries when edit modal opens
  useEffect(() => {
    if (isEditModalOpen) {
      setIsLoadingCountries(true);
      fetch('https://countriesnow.space/api/v0.1/countries/iso')
        .then(res => res.json())
        .then(data => setCountries(data.data.map(c => c.name)))
        .finally(() => setIsLoadingCountries(false));
    }
  }, [isEditModalOpen]);

  // Fetch states when country changes (but not just on modal open)
  useEffect(() => {
    if (isEditModalOpen && editedInfo && editedInfo.country) {
      setIsLoadingStates(true);
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: editedInfo.country })
      })
        .then(res => res.json())
        .then(data => setStates(data.data.states.map(s => s.name)))
        .finally(() => setIsLoadingStates(false));
      // Only reset state/city if country actually changed
      if (prevCountry.current && prevCountry.current !== editedInfo.country) {
        setEditedInfo(prev => ({ ...prev, state: '', city: '' }));
        setCities([]);
      }
      prevCountry.current = editedInfo.country;
    } else if (isEditModalOpen) {
      setStates([]);
      setCities([]);
    }
  }, [isEditModalOpen, editedInfo && editedInfo.country]);

  // Fetch cities when state changes (but not just on modal open)
  useEffect(() => {
    if (isEditModalOpen && editedInfo && editedInfo.country && editedInfo.state) {
      setIsLoadingCities(true);
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: editedInfo.country, state: editedInfo.state })
      })
        .then(res => res.json())
        .then(data => setCities(data.data))
        .finally(() => setIsLoadingCities(false));
      // Only reset city if state actually changed
      if (prevState.current && prevState.current !== editedInfo.state) {
        setEditedInfo(prev => ({ ...prev, city: '' }));
      }
      prevState.current = editedInfo.state;
    } else if (isEditModalOpen) {
      setCities([]);
    }
  }, [isEditModalOpen, editedInfo && editedInfo.state, editedInfo && editedInfo.country]);

  // Map API fields to UI fields
  const patientInfo = {
    firstName: patientDetail.first_name || '',
    lastName: patientDetail.last_name || '',
    email: patientDetail.email || '',
    phone: patientDetail.phone || '',
    alignerType: patientDetail.aligner_type || patient?.aligner_type || '',
    dateOfBirth: patientDetail.dob || '',
    gender: patientDetail.gender || '',
    address: patientDetail.address || '',
    address2: patientDetail.address2 || '',
    zip_code: patientDetail.zip_code || '',
    city: patientDetail.city || '',
    state: patientDetail.state || '',
    country: patientDetail.country || '',
  };

  // When opening the modal, initialize editedInfo with current values
  const toggleEditModal = () => {
    if (!isEditModalOpen) {
      setEditedInfo({ ...patientInfo });
    }
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Prepare data for API (convert UI fields to API fields)
    const data = {
      first_name: editedInfo.firstName,
      last_name: editedInfo.lastName,
      email: editedInfo.email,
      phone: editedInfo.phone,
      dob: editedInfo.dateOfBirth,
      gender: editedInfo.gender,
      address: editedInfo.address,
      address2: editedInfo.address2,
      zip_code: editedInfo.zip_code,
      city: editedInfo.city,
      state: editedInfo.state,
      country: editedInfo.country,
      aligner_type: editedInfo.alignerType, // send aligner_type to payload
    };
    dispatch(updatePatientDetail(patientDetail.id, data));
  };

  // Close modal when update is done and not loading
  React.useEffect(() => {
    if (!updatingDetail && isEditModalOpen) {
      setIsEditModalOpen(false);
    }
  }, [updatingDetail]);

  // Toast handling for update success/error
  const prevUpdatingDetail = React.useRef(false);
  React.useEffect(() => {
    // Success: was updating, now not updating, and no error
    if (prevUpdatingDetail.current && !updatingDetail && !updateDetailError && isEditModalOpen) {
      showToast({
        message: 'Patient information updated successfully!',
        type: 'success',
        title: 'Success',
      });
      setIsEditModalOpen(false);
    }
    // Error: was updating, now not updating, and error exists
    if (prevUpdatingDetail.current && !updatingDetail && updateDetailError && isEditModalOpen) {
      showToast({
        message: typeof updateDetailError === 'string' ? updateDetailError : 'Failed to update patient information',
        type: 'error',
        title: 'Error',
      });
    }
    prevUpdatingDetail.current = updatingDetail;
  }, [updatingDetail, updateDetailError, isEditModalOpen, showToast]);

  const handleManageGuardians = () => {
    navigate(`/patients/${id}/guardians`);
  };

  // Validation: check if any field is blank
  const isFormValid = editedInfo && Object.values({
    firstName: editedInfo.firstName,
    lastName: editedInfo.lastName,
    email: editedInfo.email,
    phone: editedInfo.phone,
    dateOfBirth: editedInfo.dateOfBirth,
    gender: editedInfo.gender,
    address: editedInfo.address,
    zip_code: editedInfo.zip_code,
    city: editedInfo.city,
    state: editedInfo.state,
    country: editedInfo.country,
  }).every(val => val && val.trim() !== "");

  const renderEditForm = () => (
    <div className="edit-form-grid">
      {/* Personal Information Group */}
      <div className="form-group-row">
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="firstName">First Name</Label>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              value={editedInfo.firstName}
              onChange={handleInputChange}
            />
          </FormGroup>
        </div>
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="lastName">Last Name</Label>
            <Input
              type="text"
              name="lastName"
              id="lastName"
              value={editedInfo.lastName}
              onChange={handleInputChange}
            />
          </FormGroup>
        </div>
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={editedInfo.email}
              onChange={handleInputChange}
            />
          </FormGroup>
        </div>
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input
              type="text"
              name="phone"
              id="phone"
              value={editedInfo.phone}
              onChange={handleInputChange}
            />
          </FormGroup>
        </div>
      </div>
      {/* Settings Group */}
      <div className="form-group-row">
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="gender">Gender</Label>
            <Input
              type="select"
              name="gender"
              id="gender"
              value={editedInfo.gender}
              onChange={handleInputChange}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Input>
          </FormGroup>
        </div>
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="alignerType">Aligner Type</Label>
            <Input
              type="select"
              name="alignerType"
              id="alignerType"
              value={editedInfo.alignerType}
              onChange={handleInputChange}
            >
              <option value="">Select aligner type</option>
              <option value="Day Aligner">Day Aligner</option>
              <option value="Night Aligner">Night Aligner</option>
            </Input>
          </FormGroup>
        </div>
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="dateOfBirth">Date of Birth</Label>
            <Input
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              value={editedInfo.dateOfBirth}
              onChange={handleInputChange}
            />
          </FormGroup>
        </div>
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="country">Country</Label>
            <Select
              id="country"
              options={countries.map(c => ({ value: c, label: c }))}
              value={editedInfo.country ? { value: editedInfo.country, label: editedInfo.country } : null}
              onChange={option => setEditedInfo(prev => ({ ...prev, country: option ? option.value : '' }))}
              isClearable
              placeholder="Select country"
              isLoading={isLoadingCountries}
              loadingMessage={() => "Loading countries..."}
            />
          </FormGroup>
        </div>
      </div>
      <div className="form-group-row">
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="zip_code">Zip Code</Label>
            <Input
              type="text"
              name="zip_code"
              id="zip_code"
              value={editedInfo.zip_code}
              onChange={handleInputChange}
            />
          </FormGroup>
        </div>
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="state">State</Label>
            <Select
              id="state"
              options={states.map(s => ({ value: s, label: s }))}
              value={editedInfo.state ? { value: editedInfo.state, label: editedInfo.state } : null}
              onChange={option => setEditedInfo(prev => ({ ...prev, state: option ? option.value : '' }))}
              isClearable
              placeholder="Select state"
              isDisabled={!editedInfo.country}
              isLoading={isLoadingStates}
              loadingMessage={() => "Loading states..."}
            />
          </FormGroup>
        </div>
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="city">City</Label>
            <Select
              id="city"
              options={cities.map(c => ({ value: c, label: c }))}
              value={editedInfo.city ? { value: editedInfo.city, label: editedInfo.city } : null}
              onChange={option => setEditedInfo(prev => ({ ...prev, city: option ? option.value : '' }))}
              isClearable
              placeholder="Select city"
              isDisabled={!editedInfo.state}
              isLoading={isLoadingCities}
              loadingMessage={() => "Loading cities..."}
            />
          </FormGroup>
        </div>
      </div>
      {/* Dedicated row for address fields at the end */}
      <div className="form-group-row">
        <div className="form-group-half">
          <FormGroup>
            <Label for="address">Address</Label>
            <Input
              type="text"
              name="address"
              id="address"
              value={editedInfo.address}
              onChange={handleInputChange}
            />
          </FormGroup>
        </div>
        <div className="form-group-half">
          <FormGroup>
            <Label for="address2">Address Line 2</Label>
            <Input
              type="text"
              name="address2"
              id="address2"
              value={editedInfo.address2}
              onChange={handleInputChange}
            />
          </FormGroup>
        </div>
      </div>
    </div>
  );

  return (
    <div className="info-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Patient Information</h4>
        <Button color="primary" size="sm" className="edit-info-btn" onClick={toggleEditModal}>
          <i className="mdi mdi-pencil me-1"></i>
          Edit patient info
        </Button>
      </div>

      <Card className="info-card mb-4">
        <CardBody>
          <div className="info-grid">
            <div className="info-item">
              <label>First Name</label>
              <div>{patientInfo.firstName}</div>
            </div>
            <div className="info-item">
              <label>Last Name</label>
              <div>{patientInfo.lastName}</div>
            </div>
            <div className="info-item">
              <label>Email</label>
              <div>{patientInfo.email}</div>
            </div>
            <div className="info-item">
              <label>Phone</label>
              <div>{patientInfo.phone}</div>
            </div>
            <div className="info-item">
              <label>Gender</label>
              <div>{patientInfo.gender}</div>
            </div>
            <div className="info-item">
              <label>Aligner Type</label>
              <div>{patientInfo.alignerType}</div>
            </div>
            <div className="info-item">
              <label>Zip Code</label>
              <div>{patientInfo.zip_code}</div>
            </div>
            <div className="info-item">
              <label>City</label>
              <div>{patientInfo.city}</div>
            </div>
            <div className="info-item">
              <label>State</label>
              <div>{patientInfo.state}</div>
            </div>
            <div className="info-item">
              <label>Country</label>
              <div>{patientInfo.country}</div>
            </div>
            {/* Dedicated row for address fields at the end */}
            <div className="info-item">
              <label>Address</label>
              <div>{patientInfo.address}</div>
            </div>
            <div className="info-item">
              <label>Address Line 2</label>
              <div>{patientInfo.address2}</div>
            </div>
            <div className="info-item">
              <label>Date of Birth</label>
              <div>{patientInfo.dateOfBirth}</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* <div className="guardians-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Guardians</h5>
          <Button color="primary" size="sm" className="manage-guardians-btn" onClick={handleManageGuardians}>
            <i className="mdi mdi-account-multiple me-1"></i>
            Manage patient's guardians
          </Button>
        </div>
        <Card>
          <CardBody>
            <div className="text-center text-muted py-4">
              <i className="mdi mdi-account-multiple-outline mb-2" style={{ fontSize: '2rem' }}></i>
              <p className="mb-0">No guardians have been added for this patient.</p>
            </div>
          </CardBody>
        </Card>
      </div> */}

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} toggle={toggleEditModal} size="lg" className="edit-patient-modal" centered>
        <ModalHeader toggle={toggleEditModal}>
          Edit Patient Information
        </ModalHeader>
        <ModalBody>
          {editedInfo && renderEditForm()}
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggleEditModal} disabled={updatingDetail}>Cancel</Button>
          <Button color="primary" onClick={handleSave} disabled={updatingDetail || !isFormValid}>
            {updatingDetail ? 'Saving...' : 'Save Changes'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Info; 