import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Info = ({ patient }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Get patient detail from Redux (already fetched in PatientDetail.js)
  const patientDetail = useSelector(state => state.patients.patientDetail) || {};

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);

  // Map API fields to UI fields
  const patientInfo = {
    firstName: patientDetail.first_name || '',
    lastName: patientDetail.last_name || '',
    email: patientDetail.email || '',
    language: 'en', // Not in API, keep as default or from patientDetail if available
    appActivation: 'Yes', // Not in API, keep as default or from patientDetail if available
    dateOfBirth: patientDetail.dob || '',
    practice: patientDetail.practice || '',
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
    // In a real app, you would make an API call here to save the changes
    // For now, just close the modal
    toggleEditModal();
    // Optionally update Redux or local state if needed
    // setPatientInfo(editedInfo);
    console.log('Saving changes:', editedInfo);
  };

  const handleManageGuardians = () => {
    navigate(`/patients/${id}/guardians`);
  };

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
            <Label for="language">Language</Label>
            <Input
              type="select"
              name="language"
              id="language"
              value={editedInfo.language}
              onChange={handleInputChange}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
            </Input>
          </FormGroup>
        </div>
      </div>
      {/* Settings Group */}
      <div className="form-group-row">
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="appActivation">App Activation</Label>
            <Input
              type="select"
              name="appActivation"
              id="appActivation"
              value={editedInfo.appActivation}
              onChange={handleInputChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
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
        <div className="form-group-third">
          <FormGroup>
            <Label for="practice">Practice</Label>
            <Input
              type="text"
              name="practice"
              id="practice"
              value={editedInfo.practice}
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
              <label>Language</label>
              <div>{patientInfo.language.toUpperCase()}</div>
            </div>
            <div className="info-item">
              <label>App Activation</label>
              <div>
                <span className={`status-badge ${patientInfo.appActivation === 'Yes' ? 'active' : 'inactive'}`}>
                  {patientInfo.appActivation}
                </span>
              </div>
            </div>
            <div className="info-item">
              <label>Date of Birth</label>
              <div>{patientInfo.dateOfBirth}</div>
            </div>
            <div className="info-item">
              <label>Practice</label>
              <div>{patientInfo.practice}</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="guardians-section">
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
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} toggle={toggleEditModal} size="lg" className="edit-patient-modal">
        <ModalHeader toggle={toggleEditModal}>
          Edit Patient Information
        </ModalHeader>
        <ModalBody>
          {editedInfo && renderEditForm()}
        </ModalBody>
        <ModalFooter>
          <Button color="light" onClick={toggleEditModal}>Cancel</Button>
          <Button color="primary" onClick={handleSave}>Save Changes</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Info; 