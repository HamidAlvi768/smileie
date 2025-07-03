import React, { useState } from 'react';
import { Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updatePatientDetail } from '../../../store/patients/actions';
import { useToast } from '../../../components/Common/ToastContext';

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

  // Map API fields to UI fields
  const patientInfo = {
    firstName: patientDetail.first_name || '',
    lastName: patientDetail.last_name || '',
    email: patientDetail.email || '',
    phone: patientDetail.phone || '',
    appActivation: 'Yes', // Not in API, keep as default or from patientDetail if available
    dateOfBirth: patientDetail.dob || '',
    practice: patientDetail.practice || 'Smileie UK',
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
      practice: editedInfo.practice,
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
    practice: editedInfo.practice,
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
              type="select"
              name="practice"
              id="practice"
              value={editedInfo.practice}
              onChange={handleInputChange}
            >
              <option value="Smileie UK">Smileie UK</option>
              <option value="Smileie US">Smileie US</option>
              <option value="Smileie AU">Smileie AU</option>
            </Input>
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