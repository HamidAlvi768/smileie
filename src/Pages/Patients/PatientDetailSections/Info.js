import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updatePatientDetail } from '../../../store/patients/actions';
import { getDoctors } from '../../../store/doctors/actions';
import { useToast } from '../../../components/Common/ToastContext';
import { useRoleAccess } from '../../../Hooks/RoleHooks';
import RoleBasedRender from '../../../components/Common/RoleBasedRender';
import PatientForm from '../PatientForm';

const Info = ({ patient }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userRole, canAccessFeature } = useRoleAccess();

  // Get patient detail from Redux (already fetched in PatientDetail.js)
  const patientDetail = useSelector(state => state.patients.patientDetail) || {};
  const updatingDetail = useSelector(state => state.patients.updatingDetail);
  const updateDetailError = useSelector(state => state.patients.updateDetailError);
  const doctors = useSelector((state) => state.doctor.doctors) || [];
  const showToast = useToast();

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedInfo, setEditedInfo] = useState(null);
  const [formErrors, setFormErrors] = useState({});

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

  // Fetch doctors and countries when edit modal opens
  useEffect(() => {
    if (isEditModalOpen) {
      dispatch(getDoctors());
      setIsLoadingCountries(true);
      fetch('https://countriesnow.space/api/v0.1/countries/iso')
        .then(res => res.json())
        .then(data => setCountries(data.data.map(c => c.name)))
        .finally(() => setIsLoadingCountries(false));
    }
  }, [isEditModalOpen, dispatch]);

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

  // Map API fields to UI fields (matching PatientForm structure)
  const patientInfo = {
    coupon_code: patientDetail.coupon_code || '',
    first_name: patientDetail.first_name || '',
    last_name: patientDetail.last_name || '',
    email: patientDetail.email || '',
    phone: patientDetail.phone || '',
    dob: patientDetail.dob || '',
    gender: patientDetail.gender || '',
    doctor_id: patientDetail.doctor_id || '',
    doctor_name: patientDetail.doctor_name || '',
    patient_source: patientDetail.patient_source || '',
    aligner_type: patientDetail.aligner_type || patient?.aligner_type || '',
    address: patientDetail.address || '',
    address2: patientDetail.address2 || '',
    zip_code: patientDetail.zip_code || '',
    city: patientDetail.city || '',
    state: patientDetail.state || '',
    country: patientDetail.country || '',
  };

  // Helper function to find doctor ID by name
  const findDoctorIdByName = (doctorName) => {
    if (!doctorName || !doctors.length) return '';
    const doctor = doctors.find(doc => doc.full_name === doctorName);
    return doctor ? doctor.id : '';
  };

  // Helper function to normalize gender value
  const normalizeGender = (gender) => {
    if (!gender) return '';
    // Convert to title case to match dropdown options
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  // When opening the modal, initialize editedInfo with current values
  const toggleEditModal = () => {
    if (!isEditModalOpen) {
      // Map API response fields to form fields
      const formData = {
        coupon_code: patientDetail.coupon_code || '',
        first_name: patientDetail.first_name || '',
        last_name: patientDetail.last_name || '',
        email: patientDetail.email || '',
        phone: patientDetail.phone || '',
        dob: patientDetail.dob || '',
        gender: normalizeGender(patientDetail.gender) || '',
        doctor_id: patientDetail.doctor_id || findDoctorIdByName(patientDetail.doctor_name) || '',
        doctor_name: patientDetail.doctor_name || '',
        patient_source: patientDetail.patient_source || '',
        aligner_type: patientDetail.aligner_type || '',
        address: patientDetail.address || '',
        address2: patientDetail.address2 || '',
        zip_code: patientDetail.zip_code || '',
        city: patientDetail.city || '',
        state: patientDetail.state || '',
        country: patientDetail.country || '',
      };

      console.log('Initializing form with data:', formData);
      console.log('Gender normalization:', { original: patientDetail.gender, normalized: normalizeGender(patientDetail.gender) });
      setEditedInfo(formData);
    }
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setEditedInfo(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSave = () => {
    // Validate form
    const errors = validatePatientForm(editedInfo);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast({
        message: "Please fill all the required fields",
        type: "error",
        title: "Validation Error",
      });
      return;
    }

    // Prepare data for API (fields already match API structure)
    const data = {
      ...editedInfo,
      // Ensure all required fields are present
      first_name: editedInfo.first_name,
      last_name: editedInfo.last_name,
      email: editedInfo.email,
      phone: editedInfo.phone,
      dob: editedInfo.dob,
      gender: editedInfo.gender,
      doctor_id: editedInfo.doctor_id,
      patient_source: editedInfo.patient_source,
      aligner_type: editedInfo.aligner_type,
      address: editedInfo.address,
      address2: editedInfo.address2,
      zip_code: editedInfo.zip_code,
      city: editedInfo.city,
      state: editedInfo.state,
      country: editedInfo.country,
    };
    dispatch(updatePatientDetail(patientDetail.id, data));
  };

  // Close modal when update is done and not loading
  React.useEffect(() => {
    if (!updatingDetail && isEditModalOpen) {
      setIsEditModalOpen(false);
    }
  }, [updatingDetail]);

  // Clear form errors when modal closes
  React.useEffect(() => {
    if (!isEditModalOpen) {
      setFormErrors({});
    }
  }, [isEditModalOpen]);

  // Update editedInfo when patientDetail changes (if modal is open)
  React.useEffect(() => {
    if (isEditModalOpen && patientDetail) {
      const formData = {
        coupon_code: patientDetail.coupon_code || '',
        first_name: patientDetail.first_name || '',
        last_name: patientDetail.last_name || '',
        email: patientDetail.email || '',
        phone: patientDetail.phone || '',
        dob: patientDetail.dob || '',
        gender: normalizeGender(patientDetail.gender) || '',
        doctor_id: patientDetail.doctor_id || findDoctorIdByName(patientDetail.doctor_name) || '',
        doctor_name: patientDetail.doctor_name || '',
        patient_source: patientDetail.patient_source || '',
        aligner_type: patientDetail.aligner_type || '',
        address: patientDetail.address || '',
        address2: patientDetail.address2 || '',
        zip_code: patientDetail.zip_code || '',
        city: patientDetail.city || '',
        state: patientDetail.state || '',
        country: patientDetail.country || '',
      };

      console.log('Updating form with patientDetail:', formData);
      console.log('Gender normalization:', { original: patientDetail.gender, normalized: normalizeGender(patientDetail.gender) });
      setEditedInfo(formData);
    }
  }, [patientDetail, isEditModalOpen, doctors]);

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

  // Validation function (same as in Monitored.js)
  const validatePatientForm = (form) => {
    const errors = {};
    if (!form.first_name) errors.first_name = 'First name is required';
    if (!form.last_name) errors.last_name = 'Last name is required';
    if (!form.email) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Invalid email address';
    if (!form.phone) errors.phone = 'Mobile phone is required';
    if (!form.dob) errors.dob = 'Date of birth is required';
    if (!form.doctor_id) errors.doctor_id = 'Doctor is required';
    if (!form.gender) errors.gender = 'Gender is required';
    if (!form.patient_source) errors.patient_source = 'Patient source is required';
    if (!form.country) errors.country = 'Country is required';
    if (!form.state) errors.state = 'State is required';
    if (!form.city) errors.city = 'City is required';
    if (!form.address) errors.address = 'Address is required';
    if (!form.address2) errors.address2 = 'Address line 2 is required';
    if (!form.zip_code) errors.zip_code = 'Zip code is required';
    if (!form.aligner_type) errors.aligner_type = 'Aligner type is required';
    return errors;
  };

  // Validation: check if any field is blank
  const isFormValid = editedInfo && Object.keys(validatePatientForm(editedInfo)).length === 0;



    const renderEditForm = () => {
    // Debug logging to verify form values
    console.log('PatientForm Debug - editedInfo:', editedInfo);
    console.log('PatientForm Debug - gender:', editedInfo?.gender);
    console.log('PatientForm Debug - doctor_id:', editedInfo?.doctor_id);
    console.log('PatientForm Debug - doctor_name:', editedInfo?.doctor_name);
    console.log('PatientForm Debug - patient_source:', editedInfo?.patient_source);
    console.log('PatientForm Debug - aligner_type:', editedInfo?.aligner_type);
    console.log('PatientForm Debug - doctors:', doctors);
    console.log('PatientForm Debug - patientDetail:', patientDetail);
    
    return (
      <PatientForm
        formState={editedInfo}
        onChange={handleInputChange}
        doctors={doctors}
        countries={countries}
        states={states}
        cities={cities}
        isLoadingCountries={isLoadingCountries}
        isLoadingStates={isLoadingStates}
        isLoadingCities={isLoadingCities}
        errors={formErrors}
      />
    );
  };

  return (
    <div className="info-section">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Patient Information</h4>
        <RoleBasedRender feature="edit_patients">
          <Button color="primary" size="sm" className="edit-info-btn" onClick={toggleEditModal}>
            <i className="mdi mdi-pencil me-1"></i>
            Edit patient info
          </Button>
        </RoleBasedRender>
      </div>

      <Card className="info-card mb-4">
        <CardBody>
          <div className="info-grid">
            <div className="info-item">
              <label>Coupon Code</label>
              <div>{patientInfo.coupon_code || 'Not set'}</div>
            </div>
            <div className="info-item">
              <label>First Name</label>
              <div>{patientInfo.first_name}</div>
            </div>
            <div className="info-item">
              <label>Last Name</label>
              <div>{patientInfo.last_name}</div>
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
              <label>Date of Birth</label>
              <div>{patientInfo.dob}</div>
            </div>
            <div className="info-item">
              <label>Gender</label>
              <div>{patientInfo.gender}</div>
            </div>
            <div className="info-item">
              <label>Doctor Name</label>
              <div>{patientInfo.doctor_name || 'Not assigned'}</div>
            </div>
            <div className="info-item">
              <label>Patient Source</label>
              <div>{patientInfo.patient_source || 'Not set'}</div>
            </div>
            <div className="info-item">
              <label>Aligner Type</label>
              <div>{patientInfo.aligner_type}</div>
            </div>
            <div className="info-item">
              <label>Country</label>
              <div>{patientInfo.country}</div>
            </div>
            <div className="info-item">
              <label>State</label>
              <div>{patientInfo.state}</div>
            </div>
            <div className="info-item">
              <label>City</label>
              <div>{patientInfo.city}</div>
            </div>
            <div className="info-item">
              <label>Zip Code</label>
              <div>{patientInfo.zip_code}</div>
            </div>
            <div className="info-item">
              <label>Address</label>
              <div>{patientInfo.address}</div>
            </div>
            <div className="info-item">
              <label>Address Line 2</label>
              <div>{patientInfo.address2}</div>
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