import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Form,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getNotMonitoredPatients, addPatient, clearPatientMessages } from "../../store/patients/actions";
import { getDoctors } from "../../store/doctors/actions";
import { useToast } from '../../components/Common/ToastContext';
import Select from 'react-select';
import PatientForm from './PatientForm';

const columns = [
  {
    name: "PATIENT NAME",
    selector: (row) => row.name,
    sortable: true,
    minWidth: "200px",
  },
  {
    name: "DOCTOR",
    selector: (row) => row.doctor,
    sortable: true,
    minWidth: "180px",
  },
  {
    name: "CREATED",
    selector: (row) => row.created,
    sortable: true,
    minWidth: "180px",
  },
  {
    name: "STARTED",
    selector: (row) => row.started,
    sortable: true,
    minWidth: "180px",
  },
  {
    name: "STOPPED",
    selector: (row) => row.stopped,
    sortable: true,
    minWidth: "180px",
  },
];

const customStyles = {
  rows: {
    style: {
      minHeight: "56px",
      paddingTop: "8px",
      paddingBottom: "8px",
    },
  },
  headCells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      fontWeight: "bold",
      fontSize: "0.9rem",
      backgroundColor: "#f8f9fa",
      color: "#495057",
      borderBottom: "2px solid #e9ecef",
    },
  },
  cells: {
    style: {
      paddingLeft: "16px",
      paddingRight: "16px",
      fontSize: "0.85rem",
      verticalAlign: "middle",
      margin: "4px 0",
    },
  },
};

// Add filter options and labels as in Monitored.js
const filterOptions = {
  compliance: [
    "All patients",
    "2-7 days late",
    "1-2 weeks late",
    "2-4 weeks late",
    "= 4 weeks late",
  ],
  alignerType: [
    "Day time dual arch",
    "Night time dual arch", 
    "Day time upper arch",
    "Day time lower arch",
    "Night time upper arch",
    "Night time lower arch"
  ],
  alignerStatus: ["All", "In progress", "Finished", "Aligner number not set"],
  appActivation: ["All", "Activated", "Not activated"],
};

const filterLabels = {
  compliance: "Compliance",
  alignerType: "Aligner Type",
  alignerStatus: "Aligner status",
  appActivation: "App activation",
};

// Merge filter keys into a single array for one row
const filterRowKeys = [
  "compliance",
  "alignerType",
  "alignerStatus",
  "appActivation",
];

const defaultFilters = {
  compliance: "All patients",
  alignerType: "Day Aligner",
  alignerStatus: "All",
  appActivation: "All",
};

// Shared aligner type options (from Orders.js main concern)
const alignerTypeOptions = [
  'Day time dual arch',
  'Night time dual arch',
  'Day time upper arch',
  'Day time lower arch',
  'Night time upper arch',
  'Night time lower arch',
];

const NotMonitored = ({ pageTitle = "Not Monitored Patients" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createPatientModal, setCreatePatientModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const patients = useSelector(state => state.patients.notMonitoredPatients);
  const doctors = useSelector(state => state.doctor.doctors) || [];
  const successMessage = useSelector(state => state.patients.successMessage);
  const error = useSelector(state => state.patients.error);
  const showToast = useToast();

  // Form state for create patient
  const [patientForm, setPatientForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    doctor_id: "",
    gender: "",
    address: "",
    address2: "",
    zip_code: "",
    city: "",
    state: "",
    country: "",
    aligner_type: "",
  });
  const [formErrors, setFormErrors] = useState({}); // NEW: error state

  // Add search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    compliance: "All patients",
    alignerType: "Day Aligner",
    alignerStatus: "All",
    appActivation: "All",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  // Fetch countries on mount
  useEffect(() => {
    setIsLoadingCountries(true);
    fetch('https://countriesnow.space/api/v0.1/countries/iso')
      .then(res => res.json())
      .then(data => setCountries(data.data.map(c => c.name)))
      .finally(() => setIsLoadingCountries(false));
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (patientForm.country) {
      setIsLoadingStates(true);
      fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: patientForm.country })
      })
        .then(res => res.json())
        .then(data => setStates(data.data.states.map(s => s.name)))
        .finally(() => setIsLoadingStates(false));
      setPatientForm(prev => ({ ...prev, state: '', city: '' }));
      setCities([]);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [patientForm.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (patientForm.country && patientForm.state) {
      setIsLoadingCities(true);
      fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: patientForm.country, state: patientForm.state })
      })
        .then(res => res.json())
        .then(data => setCities(data.data))
        .finally(() => setIsLoadingCities(false));
      setPatientForm(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [patientForm.state, patientForm.country]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    dispatch(getNotMonitoredPatients());
    dispatch(getDoctors());
  }, [dispatch]);

  const notMonitoredPatients = useSelector((state) => state.patients.notMonitoredPatients);
  const notMonitoredError = useSelector((state) => state.patients.error);

  useEffect(() => {
    if (notMonitoredPatients || notMonitoredError) {
      setIsLoading(false);
    }
  }, [notMonitoredPatients, notMonitoredError]);

  // Map API patients to table data
  const data = patients && Array.isArray(patients) ? patients.map((p) => ({
    name: `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.username || '',
    doctor: p.doctor_name || '',
    created: p.created_at || "2025-05-01 10:00 GMT+5", // fallback/mock
    started: p.started_at || "Not Started", // fallback/mock
    stopped: p.stopped_at || "", // fallback/mock
    id: p.id,
  })) : [];

  // Filter and search data (add this logic)
  const filteredData = data.filter((item) => {
    // Search filter
    const searchMatch = searchTerm
      ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.id && item.id.toString().includes(searchTerm))
      : true;
    // Apply other filters here if needed (currently just search)
    return searchMatch;
  });

  const handlePatientFormChange = (e) => {
    const { id, value } = e.target;
    setPatientForm((prev) => ({ ...prev, [id === "mobile" ? "phone" : id === "doctor" ? "doctor_id" : id]: value }));
  };

  // Validation function
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
    if (!form.country) errors.country = 'Country is required';
    if (!form.state) errors.state = 'State is required';
    if (!form.city) errors.city = 'City is required';
    if (!form.address) errors.address = 'Address is required';
    if (!form.address2) errors.address2 = 'Address line 2 is required';
    if (!form.zip_code) errors.zip_code = 'Zip code is required';
    if (!form.aligner_type) errors.aligner_type = 'Aligner type is required';
    return errors;
  };

  const handleCreatePatient = (e) => {
    e.preventDefault();
    const errors = validatePatientForm(patientForm);
    if (Object.keys(errors).length > 0) {
      showToast({
        message: "Please fill all the required fields",
        type: "error",
        title: "Validation Error",
      });
      return;
    }
    dispatch(addPatient(patientForm));
    // Do not close modal or show toast here; wait for Redux state
  };

  // Listen for patient creation success/error and show toast
  useEffect(() => {
    if (successMessage) {
      showToast({ message: successMessage || 'Patient created successfully!', type: 'success', title: 'Success' });
      setCreatePatientModal(false);
      setPatientForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        dob: "",
        doctor_id: "",
        gender: "",
        address: "",
        address2: "",
        zip_code: "",
        city: "",
        state: "",
        country: "",
        aligner_type: "",
      });
      setFormErrors({}); // Clear errors on success
      dispatch(clearPatientMessages());
      dispatch(getNotMonitoredPatients()); // Refresh the list after creation
    }
  }, [successMessage, showToast, dispatch]);

  useEffect(() => {
    if (notMonitoredError) {
      showToast({ message: typeof notMonitoredError === 'string' ? notMonitoredError : 'Failed to create patient', type: 'error', title: 'Error' });
      dispatch(clearPatientMessages());
    }
  }, [notMonitoredError, showToast, dispatch]);

  // Table row click handler (optional: navigate to patient detail)
  const handleRowClicked = (row) => {
    const patientId = row.id || row.name.replace(/\s+/g, '-').toLowerCase();
    navigate(`/patients/${patientId}`);
  };

  // Add filter and search handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const hasActiveFilters =
    filters.compliance !== defaultFilters.compliance ||
    filters.alignerType !== defaultFilters.alignerType ||
    filters.alignerStatus !== defaultFilters.alignerStatus ||
    filters.appActivation !== defaultFilters.appActivation ||
    searchTerm.trim() !== "";

  const handleClearFilters = () => {
    setFilters({ ...defaultFilters });
    setSearchTerm("");
  };

  // Reset errors when modal is closed
  const toggleCreatePatient = () => {
    setCreatePatientModal(!createPatientModal);
    if (createPatientModal) {
      setPatientForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        dob: "",
        doctor_id: "",
        gender: "",
        address: "",
        address2: "",
        zip_code: "",
        city: "",
        state: "",
        country: "",
        aligner_type: "",
      });
      setFormErrors({});
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        {/* Page Title and New Patient Button */}
        <Row className="mb-3 align-items-center">
          <Col md={8} xs={6}>
            <h4 className="mb-0">{pageTitle}</h4>
          </Col>
          <Col md={4} xs={6} className="text-end">
            <div className="d-flex align-items-center justify-content-end">
              {hasActiveFilters && (
                <Button
                  color="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
              <Button color="primary" onClick={toggleCreatePatient}>
                + New patient
              </Button>
            </div>
          </Col>
        </Row>

        <Card>
          <CardBody>
            {/* Filter Section (now inside Card) */}
            <div className="control-panel">
              {/* Single Row for Search and Filters (Monitored.js style) */}
              <Row className="mb-3 align-items-center">
                <Col md={2} sm={6} xs={12} className="mb-2">
                  <div>
                    <label className="form-label" htmlFor="search-input">
                      Search Patients
                    </label>
                    <Input
                      id="search-input"
                      type="search"
                      placeholder="Patient name"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </Col>
                {filterRowKeys.map((key) => (
                  <Col md={2} sm={6} xs={12} key={key} className="mb-2">
                    <label className="form-label" htmlFor={`filter-${key}`}>
                      {filterLabels[key] || key}
                    </label>
                    <Input
                      id={`filter-${key}`}
                      type="select"
                      value={filters[key]}
                      onChange={(e) => handleFilterChange(key, e.target.value)}
                    >
                      {filterOptions[key].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Input>
                  </Col>
                ))}
              </Row>
            </div>
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              responsive
              customStyles={{
                ...customStyles,
                rows: {
                  ...customStyles.rows,
                  style: {
                    ...customStyles.rows.style,
                    cursor: 'pointer',
                  },
                },
              }}
              onRowClicked={handleRowClicked}
            />
          </CardBody>
        </Card>

        {/* Create Patient Modal (reused from Monitored.js) */}
        <Modal
          isOpen={createPatientModal}
          toggle={toggleCreatePatient}
          size="lg"
          centered
        >
          <ModalHeader toggle={toggleCreatePatient}>
            <h4 className="modal-title">Create a new patient</h4>
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={handleCreatePatient}>
              <PatientForm
                formState={patientForm}
                onChange={handlePatientFormChange}
                doctors={doctors}
                countries={countries}
                states={states}
                cities={cities}
                isLoadingCountries={isLoadingCountries}
                isLoadingStates={isLoadingStates}
                isLoadingCities={isLoadingCities}
                errors={formErrors} // Pass errors
              />
              <div className="text-end mt-4">
                <Button color="light" className="me-2" onClick={toggleCreatePatient} type="button">
                  Cancel
                </Button>
                <Button color="primary" type="submit">
                  Create patient
                </Button>
              </div>
            </Form>
          </ModalBody>
        </Modal>
      </Container>
    </div>
  );
};

export default NotMonitored; 