import React, { useState } from 'react';
import { Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';

const Info = ({ patient }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);

  // Mock data - in a real app, this would come from props or an API
  const initialPatientInfo = {
    firstName: 'Paula',
    lastName: 'Barr',
    email: 'yogz74@hotmail.co.uk',
    secondaryEmail: '',
    language: 'en',
    appActivation: 'Yes',
    dateOfBirth: 'Mar 16, 1973',
    scanProcessVersion: 'v1',
    adapterInstructions: 'Disabled',
    scanSequenceOrder: 'Aligners in first',
    practice: 'Smilie UK'
  };

  // Initialize editedInfo with initialPatientInfo
  const [patientInfo, setPatientInfo] = useState(initialPatientInfo);

  const toggleEditModal = () => {
    if (!isEditModalOpen) {
      // When opening the modal, initialize editedInfo with current values
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
    setPatientInfo(editedInfo);
    toggleEditModal();
    // In a real app, you would make an API call here to save the changes
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
            <Label for="secondaryEmail">Secondary Email</Label>
            <Input
              type="email"
              name="secondaryEmail"
              id="secondaryEmail"
              value={editedInfo.secondaryEmail}
              onChange={handleInputChange}
            />
          </FormGroup>
        </div>
      </div>

      {/* Settings Group */}
      <div className="form-group-row">
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

      {/* Scan Settings Group */}
        <div className="form-group-fourth">
          <FormGroup>
            <Label for="scanProcessVersion">Scan Process Version</Label>
            <Input
              type="select"
              name="scanProcessVersion"
              id="scanProcessVersion"
              value={editedInfo.scanProcessVersion}
              onChange={handleInputChange}
            >
              <option value="v1">v1</option>
              <option value="v2">v2</option>
              <option value="v3">v3</option>
            </Input>
          </FormGroup>
        </div>
      </div>
      <div className="form-group-row">
        <div className="form-group-third">
          <FormGroup>
            <Label for="adapterInstructions">Adapter Instructions</Label>
            <Input
              type="select"
              name="adapterInstructions"
              id="adapterInstructions"
              value={editedInfo.adapterInstructions}
              onChange={handleInputChange}
            >
              <option value="Enabled">Enabled</option>
              <option value="Disabled">Disabled</option>
            </Input>
          </FormGroup>
        </div>
        <div className="form-group-third">
          <FormGroup>
            <Label for="scanSequenceOrder">Scan Sequence Order</Label>
            <Input
              type="select"
              name="scanSequenceOrder"
              id="scanSequenceOrder"
              value={editedInfo.scanSequenceOrder}
              onChange={handleInputChange}
            >
              <option value="Aligners in first">Aligners in first</option>
              <option value="Scans in first">Scans in first</option>
            </Input>
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
              <label>Secondary Email</label>
              <div>{patientInfo.secondaryEmail || '-'}</div>
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
              <label>Scan Process Version</label>
              <div>{patientInfo.scanProcessVersion}</div>
            </div>
            <div className="info-item">
              <label>Adapter Instructions</label>
              <div>{patientInfo.adapterInstructions}</div>
            </div>
            <div className="info-item">
              <label>Scan Sequence Order</label>
              <div>{patientInfo.scanSequenceOrder}</div>
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